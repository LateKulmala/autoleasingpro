import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function comparePasswords(supplied: string, stored: string) {
  // Check if the stored password is in the correct format
  if (!stored || !stored.includes(".")) {
    return false;
  }
  
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    return false;
  }
  
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore, // Use the session store from storage
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000 // 1 hour
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`Login attempt: ${username}, ${password}`);
        
        // Hard-coded test users for development
        if (username === "admin" && password === "password123") {
          return done(null, {
            id: 1,
            username: "admin",
            password: "hashed_password",
            name: "Admin User",
            email: "admin@autoleasingpro.fi",
            role: "admin",
            verified: true,
            phone: null,
            company: null,
            newsletterSubscription: true,
            offerNotifications: true,
            reminderNotifications: true,
            createdAt: new Date(),
            description: null,
            businessId: null
          });
        }
        
        if (username === "provider" && password === "password123") {
          return done(null, {
            id: 2,
            username: "provider",
            password: "hashed_password",
            name: "Provider Company",
            email: "provider@company.fi",
            company: "Provider Company Oy",
            role: "provider",
            verified: true,
            phone: null,
            newsletterSubscription: true,
            offerNotifications: true,
            reminderNotifications: true,
            createdAt: new Date(),
            description: null,
            businessId: null
          });
        }
        
        if (username === "customer" && password === "password123") {
          return done(null, {
            id: 3,
            username: "customer",
            password: "hashed_password",
            name: "Testi Asiakas",
            email: "asiakas@esimerkki.fi",
            role: "customer",
            verified: true,
            phone: null,
            company: null,
            newsletterSubscription: true,
            offerNotifications: true,
            reminderNotifications: true,
            createdAt: new Date(),
            description: null,
            businessId: null
          });
        }
        
        // Fall back to the database for other users during normal operation
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      // Hard-coded test users for development
      if (id === 1) {
        return done(null, {
          id: 1,
          username: "admin",
          password: "hashed_password",
          name: "Admin User",
          email: "admin@autoleasingpro.fi",
          role: "admin",
          verified: true,
          phone: null,
          company: null,
          newsletterSubscription: true,
          offerNotifications: true,
          reminderNotifications: true,
          createdAt: new Date(),
          description: null,
          businessId: null
        });
      }
      
      if (id === 2) {
        return done(null, {
          id: 2,
          username: "provider",
          password: "hashed_password",
          name: "Provider Company",
          email: "provider@company.fi",
          company: "Provider Company Oy",
          role: "provider",
          verified: true,
          phone: null,
          newsletterSubscription: true,
          offerNotifications: true,
          reminderNotifications: true,
          createdAt: new Date(),
          description: null,
          businessId: null
        });
      }
      
      if (id === 3) {
        return done(null, {
          id: 3,
          username: "customer",
          password: "hashed_password",
          name: "Testi Asiakas",
          email: "asiakas@esimerkki.fi",
          role: "customer",
          verified: true,
          phone: null,
          company: null,
          newsletterSubscription: true,
          offerNotifications: true,
          reminderNotifications: true,
          createdAt: new Date(),
          description: null,
          businessId: null
        });
      }
      
      // Fall back to the database for other users
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ error: "Käyttäjänimi on jo käytössä" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
        role: req.body.role || "customer" // Default role is customer if not specified
      });

      req.login(user, (err) => {
        if (err) return next(err);
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: Express.User) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: "Väärä käyttäjänimi tai salasana" });
      
      req.login(user, (err) => {
        if (err) return next(err);
        // Return user without password
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Ei kirjautunut sisään" });
    
    // Return user without password
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    res.json(userWithoutPassword);
  });
}