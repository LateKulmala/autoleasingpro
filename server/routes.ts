import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertLeasingOfferSchema,
  insertQuoteRequestSchema,
  insertQuoteOfferSchema,
  insertSeoSettingsSchema,
  insertSiteSettingsSchema,
  insertFleetRequestSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";
import { hashPassword, comparePasswords } from "./auth";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Kirjautuminen vaaditaan" });
};

// Middleware to check if user is provider
const isProvider = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user && req.user.role === "provider") {
    return next();
  }
  res.status(403).json({ message: "Ei käyttöoikeutta" });
};

// Middleware to check if user is a verified provider
const isVerifiedProvider = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user && req.user.role === "provider" && req.user.verified) {
    return next();
  }
  if (req.isAuthenticated() && req.user && req.user.role === "provider" && !req.user.verified) {
    return res.status(403).json({ message: "Tilisi odottaa hyväksyntää" });
  }
  res.status(403).json({ message: "Ei käyttöoikeutta" });
};

// Middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Ei käyttöoikeutta" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static HTML files from public folder
  app.get('/mukautettu-header.html', (req, res) => {
    res.sendFile('mukautettu-header.html', { root: './public' });
  });
  
  // Setup authentication
  setupAuth(app);
  
  // Check if user exists by email (for automatic account creation)
  app.post("/api/check-existing-user", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Sähköpostiosoite puuttuu" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (user) {
        return res.status(200).json({ exists: true, userId: user.id });
      } else {
        return res.status(200).json({ exists: false });
      }
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Get current user's profile information
  app.get("/api/profile", isAuthenticated, async (req, res) => {
    try {
      // User information is already attached to req.user by passport
      // Make sure req.user exists and remove sensitive information
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sisään" });
      }
      
      const userObj = req.user as Record<string, any>;
      // Create a new object without the password
      const userWithoutPassword = Object.keys(userObj)
        .filter(key => key !== 'password')
        .reduce((obj, key) => {
          obj[key] = userObj[key];
          return obj;
        }, {} as Record<string, any>);
        
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Update user profile
  app.put("/api/profile", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sisään" });
      }
      
      const userId = (req.user as any).id;
      const updatedUser = await storage.updateUser(userId, req.body);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Käyttäjää ei löydy" });
      }
      
      // Create a new object without the password
      const userObj = updatedUser as Record<string, any>;
      const userWithoutPassword = Object.keys(userObj)
        .filter(key => key !== 'password')
        .reduce((obj, key) => {
          obj[key] = userObj[key];
          return obj;
        }, {} as Record<string, any>);
        
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  // Get current user's quote requests
  app.get("/api/quote-requests/user", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sisään" });
      }
      
      const userId = (req.user as any).id;
      const requests = await storage.getQuoteRequestsByUser(userId);
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Get quote offers for the current user
  app.get("/api/quote-offers/user", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sisään" });
      }
      
      const userId = (req.user as any).id;
      
      // First get all user's quote requests
      const requests = await storage.getQuoteRequestsByUser(userId);
      
      if (!requests.length) {
        return res.status(200).json([]);
      }
      
      // Then get all offers for those requests
      const allOffers = [];
      for (const request of requests) {
        const offers = await storage.getQuoteOffersByRequest(request.id);
        allOffers.push(...offers);
      }
      
      res.status(200).json(allOffers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Get quote offers for specific request (with user validation)
  app.get("/api/quote-requests/:requestId/offers", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sisään" });
      }
      
      const userId = (req.user as any).id;
      const requestId = parseInt(req.params.requestId);
      
      if (isNaN(requestId)) {
        return res.status(400).json({ message: "Virheellinen tarjouspyynnön ID" });
      }
      
      // Verify user owns this quote request
      const request = await storage.getQuoteRequest(requestId);
      
      if (!request || request.userId !== userId) {
        return res.status(403).json({ message: "Ei käyttöoikeutta tähän tarjouspyyntöön" });
      }
      
      const offers = await storage.getQuoteOffersByRequest(requestId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // For providers: get all quote requests
  app.get("/api/provider/quote-requests", isProvider, async (req, res) => {
    try {
      const requests = await storage.getQuoteRequests();
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // For providers: get their own quote offers
  app.get("/api/provider/quote-offers", isProvider, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sisään" });
      }
      
      const providerId = (req.user as any).id;
      const offers = await storage.getQuoteOffersByProvider(providerId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/quote-offers/provider", isProvider, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sisään" });
      }
      
      const providerId = (req.user as any).id;
      const offers = await storage.getQuoteOffersByProvider(providerId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // For providers: get their own leasing offers
  app.get("/api/provider/leasing-offers", isProvider, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sisään" });
      }
      
      const providerId = (req.user as any).id;
      const offers = await storage.getLeasingOffersByProvider(providerId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/leasing-offers/provider", isProvider, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sisään" });
      }
      
      const providerId = (req.user as any).id;
      const offers = await storage.getLeasingOffersByProvider(providerId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Leasing offers routes
  app.get("/api/leasing-offers", async (req, res) => {
    try {
      const leasingType = req.query.leasingType as string | undefined;
      const filters: any = {};
      
      if (leasingType) {
        filters.leasingType = leasingType;
      }
      
      // Only return active offers
      filters.active = true;
      
      const offers = await storage.getLeasingOffers(filters);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/leasing-offers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const offer = await storage.getLeasingOffer(id);
      
      if (!offer) {
        return res.status(404).json({ message: "Tarjousta ei löydy" });
      }
      
      res.status(200).json(offer);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.post("/api/leasing-offers", isProvider, async (req, res) => {
    try {
      const validatedData = insertLeasingOfferSchema.parse(req.body);
      const offer = await storage.createLeasingOffer(validatedData);
      res.status(201).json(offer);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  app.put("/api/leasing-offers/:id", isProvider, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const offer = await storage.getLeasingOffer(id);
      
      if (!offer) {
        return res.status(404).json({ message: "Tarjousta ei löydy" });
      }
      
      const updatedOffer = await storage.updateLeasingOffer(id, req.body);
      res.status(200).json(updatedOffer);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  // Partial update for leasing offer (for toggling active status etc.)
  app.patch("/api/leasing-offers/:id/toggle-status", isProvider, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const offer = await storage.getLeasingOffer(id);
      
      if (!offer) {
        return res.status(404).json({ message: "Tarjousta ei löydy" });
      }
      
      // Check if the provider owns this offer
      if (offer.providerId !== (req.user as any).id && (req.user as any).role !== "admin") {
        return res.status(403).json({ message: "Ei käyttöoikeutta" });
      }
      
      // Toggle the active status
      const updatedOffer = await storage.updateLeasingOffer(id, { 
        active: !offer.active 
      });
      
      res.status(200).json(updatedOffer);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  app.delete("/api/leasing-offers/:id", isProvider, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const success = await storage.deleteLeasingOffer(id);
      
      if (!success) {
        return res.status(404).json({ message: "Tarjousta ei löydy" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Provider leasing offers
  app.get("/api/providers/:providerId/leasing-offers", async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      
      if (isNaN(providerId)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const offers = await storage.getLeasingOffersByProvider(providerId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Quote request routes
  app.post("/api/quote-requests", async (req, res) => {
    try {
      const validatedData = insertQuoteRequestSchema.parse(req.body);
      
      // Additional validation for user information
      if (!validatedData.userId) {
        res.status(400).json({ message: "Käyttäjän ID on pakollinen tieto" });
        return;
      }
      
      // Make sure the associated user exists
      const userExists = await storage.getUser(validatedData.userId);
      if (!userExists) {
        res.status(400).json({ message: "Käyttäjää ei löydy annetulla ID:llä" });
        return;
      }
      
      const quoteRequest = await storage.createQuoteRequest(validatedData);
      res.status(201).json(quoteRequest);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  app.get("/api/quote-requests", async (req, res) => {
    try {
      const requests = await storage.getQuoteRequests();
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/quote-requests/open", isProvider, async (req, res) => {
    try {
      const requests = await storage.getQuoteRequests({ status: "open" });
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/quote-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const request = await storage.getQuoteRequest(id);
      
      if (!request) {
        return res.status(404).json({ message: "Tarjouspyyntöä ei löydy" });
      }
      
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/users/:userId/quote-requests", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const requests = await storage.getQuoteRequestsByUser(userId);
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Quote offer routes
  app.post("/api/quote-offers", isProvider, async (req, res) => {
    try {
      const validatedData = insertQuoteOfferSchema.parse(req.body);
      
      // Verify quote request exists
      const quoteRequest = await storage.getQuoteRequest(validatedData.quoteRequestId);
      
      if (!quoteRequest) {
        return res.status(404).json({ message: "Tarjouspyyntöä ei löydy" });
      }
      
      const quoteOffer = await storage.createQuoteOffer(validatedData);
      res.status(201).json(quoteOffer);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  app.get("/api/quote-requests/:requestId/offers", async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      
      if (isNaN(requestId)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const offers = await storage.getQuoteOffersByRequest(requestId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/providers/:providerId/quote-offers", async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId);
      
      if (isNaN(providerId)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const offers = await storage.getQuoteOffersByProvider(providerId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.put("/api/quote-offers/:id", isProvider, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const offer = await storage.getQuoteOffer(id);
      
      if (!offer) {
        return res.status(404).json({ message: "Tarjousta ei löydy" });
      }
      
      const updatedOffer = await storage.updateQuoteOffer(id, req.body);
      res.status(200).json(updatedOffer);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  // Admin routes - all require admin privileges
  // For development only - enable direct access to admin endpoints
  const isDevMode = true; // Set to false in production
  const adminAuth = isDevMode ? (req: Request, res: Response, next: NextFunction) => next() : isAdmin;
  
  // API endpoint for verifying providers
  // Fleet request routes (yrityskalusto)
  app.post("/api/fleet-requests", async (req, res) => {
    try {
      const validatedData = insertFleetRequestSchema.parse(req.body);
      
      // Create user automatically if email is not associated with an existing account
      let userId = validatedData.userId;
      
      if (!userId && validatedData.email) {
        const existingUser = await storage.getUserByEmail(validatedData.email);
        
        if (existingUser) {
          userId = existingUser.id;
        } else {
          // Generate a random password for automatic user creation
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await hashPassword(randomPassword);
          
          const newUser = await storage.createUser({
            username: validatedData.email.split('@')[0] + Math.floor(Math.random() * 1000),
            password: hashedPassword,
            email: validatedData.email,
            name: validatedData.contactPerson,
            phone: validatedData.phone,
            company: validatedData.companyName,
            businessId: validatedData.businessId,
            role: "customer"
          });
          
          userId = newUser.id;
        }
      }
      
      // Update the userId field in the validated data
      const requestData = { ...validatedData, userId };
      
      const fleetRequest = await storage.createFleetRequest(requestData);
      res.status(201).json(fleetRequest);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  app.get("/api/fleet-requests", adminAuth, async (req, res) => {
    try {
      const requests = await storage.getFleetRequests();
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/fleet-requests/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const request = await storage.getFleetRequest(id);
      
      if (!request) {
        return res.status(404).json({ message: "Kalustotarjouspyyntöä ei löydy" });
      }
      
      // Check if the user is the owner, a provider, or an admin
      if (req.user) {
        const user = req.user as any;
        if (request.userId !== user.id && user.role !== "admin" && user.role !== "provider") {
          return res.status(403).json({ message: "Ei käyttöoikeutta" });
        }
      }
      
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/user/fleet-requests", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sisään" });
      }
      
      const userId = (req.user as any).id;
      const requests = await storage.getFleetRequestsByUser(userId);
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.put("/api/fleet-requests/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const request = await storage.getFleetRequest(id);
      
      if (!request) {
        return res.status(404).json({ message: "Kalustotarjouspyyntöä ei löydy" });
      }
      
      const updatedRequest = await storage.updateFleetRequest(id, req.body);
      res.status(200).json(updatedRequest);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  app.patch("/api/fleet-requests/:id/status", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const { status } = req.body;
      
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Tila on pakollinen kenttä" });
      }
      
      const request = await storage.getFleetRequest(id);
      
      if (!request) {
        return res.status(404).json({ message: "Kalustotarjouspyyntöä ei löydy" });
      }
      
      const updatedRequest = await storage.updateFleetRequest(id, { status });
      res.status(200).json(updatedRequest);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  app.delete("/api/fleet-requests/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const success = await storage.deleteFleetRequest(id);
      
      if (!success) {
        return res.status(404).json({ message: "Kalustotarjouspyyntöä ei löydy" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Admin routes
  app.post("/api/admin/verify-provider/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "Käyttäjää ei löydy" });
      }
      
      if (user.role !== "provider") {
        return res.status(400).json({ message: "Käyttäjä ei ole tarjoaja" });
      }
      
      // Käytetään request body:sta saatua verified arvoa tai oletuksena true
      const verified = req.body.verified !== undefined ? req.body.verified : true;
      
      const updatedUser = await storage.updateUser(id, { verified });
      
      if (!updatedUser) {
        return res.status(500).json({ message: "Päivitys epäonnistui" });
      }
      
      const { password, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/admin/users", adminAuth, async (req, res) => {
    try {
      const users = await storage.getUsers();
      
      // Return users without passwords
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.status(200).json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Change password endpoint
  app.post("/api/users/:id/change-password", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Ei kirjautunut sisään" });
      }
      
      const userId = parseInt(req.params.id);
      const { currentPassword, newPassword } = req.body;
      
      // Check if the user is authorized to change this password
      if ((req.user as any).id !== userId && (req.user as any).role !== "admin") {
        return res.status(403).json({ error: "Ei oikeuksia vaihtaa tämän käyttäjän salasanaa" });
      }
      
      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Nykyinen ja uusi salasana ovat pakollisia" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Uuden salasanan on oltava vähintään 6 merkkiä" });
      }
      
      // Get the user
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "Käyttäjää ei löydy" });
      }
      
      // Verify current password
      if (!(await comparePasswords(currentPassword, user.password))) {
        return res.status(400).json({ error: "Nykyinen salasana on virheellinen" });
      }
      
      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update the user's password
      await storage.updateUser(userId, { password: hashedPassword });
      
      return res.status(200).json({ message: "Salasana vaihdettu onnistuneesti" });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ error: "Virhe salasanan vaihdossa" });
    }
  });
  
  // SEO Settings routes
  app.get("/api/seo-settings", async (req, res) => {
    try {
      const seoSettings = await storage.getSeoSettings();
      res.status(200).json(seoSettings);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/seo-settings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const seoSetting = await storage.getSeoSetting(id);
      
      if (!seoSetting) {
        return res.status(404).json({ message: "SEO-asetuksia ei löydy" });
      }
      
      res.status(200).json(seoSetting);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/seo-settings/page/:pageId", async (req, res) => {
    try {
      const pageId = req.params.pageId;
      
      if (!pageId) {
        return res.status(400).json({ message: "Sivun tunniste puuttuu" });
      }
      
      const seoSetting = await storage.getSeoSettingByPageId(pageId);
      
      if (!seoSetting) {
        return res.status(404).json({ message: "SEO-asetuksia ei löydy tälle sivulle" });
      }
      
      res.status(200).json(seoSetting);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Alternative route path for client hooks
  app.get("/api/public/seo-settings", async (req, res) => {
    try {
      const seoSettings = await storage.getSeoSettings();
      res.status(200).json(seoSettings);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/public/seo-settings/:pageId", async (req, res) => {
    try {
      const pageId = req.params.pageId;
      
      if (!pageId) {
        return res.status(400).json({ message: "Sivun tunniste puuttuu" });
      }
      
      const seoSetting = await storage.getSeoSettingByPageId(pageId);
      
      if (!seoSetting) {
        return res.status(404).json({ message: "SEO-asetuksia ei löydy tälle sivulle" });
      }
      
      res.status(200).json(seoSetting);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.post("/api/seo-settings", adminAuth, async (req, res) => {
    try {
      const validatedData = insertSeoSettingsSchema.parse(req.body);
      
      // Check if this page already has SEO settings
      const existingSetting = await storage.getSeoSettingByPageId(validatedData.pageId);
      
      if (existingSetting) {
        return res.status(400).json({ 
          message: "Tälle sivulle on jo olemassa SEO-asetukset",
          existingId: existingSetting.id
        });
      }
      
      const seoSetting = await storage.createSeoSetting(validatedData);
      res.status(201).json(seoSetting);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  app.put("/api/seo-settings/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const seoSetting = await storage.getSeoSetting(id);
      
      if (!seoSetting) {
        return res.status(404).json({ message: "SEO-asetuksia ei löydy" });
      }
      
      const updatedSeoSetting = await storage.updateSeoSetting(id, req.body);
      res.status(200).json(updatedSeoSetting);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  app.delete("/api/seo-settings/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const success = await storage.deleteSeoSetting(id);
      
      if (!success) {
        return res.status(404).json({ message: "SEO-asetuksia ei löydy" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Site Settings routes
  app.get("/api/site-settings", async (req, res) => {
    try {
      const group = req.query.group as string | undefined;
      const siteSettings = await storage.getSiteSettings(group);
      res.status(200).json(siteSettings);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Public API routes for site settings
  app.get("/api/site-settings/public", async (req, res) => {
    try {
      const siteSettings = await storage.getPublicSiteSettings();
      res.status(200).json(siteSettings);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  // Alternative route path for client hooks
  app.get("/api/public/site-settings", async (req, res) => {
    try {
      const siteSettings = await storage.getPublicSiteSettings();
      res.status(200).json(siteSettings);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/site-settings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const siteSetting = await storage.getSiteSetting(id);
      
      if (!siteSetting) {
        return res.status(404).json({ message: "Sivustoasetuksia ei löydy" });
      }
      
      res.status(200).json(siteSetting);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.get("/api/site-settings/key/:key", async (req, res) => {
    try {
      const key = req.params.key;
      
      if (!key) {
        return res.status(400).json({ message: "Avaimen tunniste puuttuu" });
      }
      
      const siteSetting = await storage.getSiteSettingByKey(key);
      
      if (!siteSetting) {
        return res.status(404).json({ message: "Sivustoasetuksia ei löydy tälle avaimelle" });
      }
      
      res.status(200).json(siteSetting);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  
  app.post("/api/site-settings", adminAuth, async (req, res) => {
    try {
      const validatedData = insertSiteSettingsSchema.parse(req.body);
      
      // Check if this key already exists
      const existingSetting = await storage.getSiteSettingByKey(validatedData.settingKey);
      
      if (existingSetting) {
        return res.status(400).json({ 
          message: "Tällä avaimella on jo olemassa asetus",
          existingId: existingSetting.id
        });
      }
      
      const siteSetting = await storage.createSiteSetting(validatedData);
      res.status(201).json(siteSetting);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  app.put("/api/site-settings/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const siteSetting = await storage.getSiteSetting(id);
      
      if (!siteSetting) {
        return res.status(404).json({ message: "Sivustoasetuksia ei löydy" });
      }
      
      const updatedSiteSetting = await storage.updateSiteSetting(id, req.body);
      res.status(200).json(updatedSiteSetting);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  
  app.delete("/api/site-settings/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      
      const success = await storage.deleteSiteSetting(id);
      
      if (!success) {
        return res.status(404).json({ message: "Sivustoasetuksia ei löydy" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });

  // Place a custom middleware at the end to catch undefined API routes
  app.use((req, res, next) => {
    // Only handle API routes that weren't caught by other middleware
    if (req.path.startsWith('/api/') && !(res.headersSent)) {
      return res.status(404).json({ message: "Sivua tai resurssia ei löydy" });
    }
    // Pass to the next middleware
    next();
  });

  const httpServer = createServer(app);
  return httpServer;
}
