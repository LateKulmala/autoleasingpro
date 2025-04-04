import {
  User, InsertUser,
  LeasingOffer, InsertLeasingOffer,
  QuoteRequest, InsertQuoteRequest,
  QuoteOffer, InsertQuoteOffer,
  SeoSettings, InsertSeoSettings,
  SiteSettings, InsertSiteSettings,
  FleetRequest, InsertFleetRequest
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  
  // Leasing offer operations
  getLeasingOffer(id: number): Promise<LeasingOffer | undefined>;
  getLeasingOffers(filters?: Partial<LeasingOffer>): Promise<LeasingOffer[]>;
  getLeasingOffersByProvider(providerId: number): Promise<LeasingOffer[]>;
  createLeasingOffer(offer: InsertLeasingOffer): Promise<LeasingOffer>;
  updateLeasingOffer(id: number, offer: Partial<LeasingOffer>): Promise<LeasingOffer | undefined>;
  deleteLeasingOffer(id: number): Promise<boolean>;
  
  // Quote request operations
  getQuoteRequest(id: number): Promise<QuoteRequest | undefined>;
  getQuoteRequests(filters?: Partial<QuoteRequest>): Promise<QuoteRequest[]>;
  getQuoteRequestsByUser(userId: number): Promise<QuoteRequest[]>;
  createQuoteRequest(request: InsertQuoteRequest): Promise<QuoteRequest>;
  updateQuoteRequest(id: number, request: Partial<QuoteRequest>): Promise<QuoteRequest | undefined>;
  
  // Quote offer operations
  getQuoteOffer(id: number): Promise<QuoteOffer | undefined>;
  getQuoteOffers(filters?: Partial<QuoteOffer>): Promise<QuoteOffer[]>;
  getQuoteOffersByRequest(requestId: number): Promise<QuoteOffer[]>;
  getQuoteOffersByProvider(providerId: number): Promise<QuoteOffer[]>;
  createQuoteOffer(offer: InsertQuoteOffer): Promise<QuoteOffer>;
  updateQuoteOffer(id: number, offer: Partial<QuoteOffer>): Promise<QuoteOffer | undefined>;
  
  // Fleet request operations (yrityskalusto)
  getFleetRequest(id: number): Promise<FleetRequest | undefined>;
  getFleetRequests(filters?: Partial<FleetRequest>): Promise<FleetRequest[]>;
  getFleetRequestsByUser(userId: number): Promise<FleetRequest[]>;
  createFleetRequest(request: InsertFleetRequest): Promise<FleetRequest>;
  updateFleetRequest(id: number, request: Partial<FleetRequest>): Promise<FleetRequest | undefined>;
  deleteFleetRequest(id: number): Promise<boolean>;
  
  // SEO settings operations
  getSeoSetting(id: number): Promise<SeoSettings | undefined>;
  getSeoSettingByPageId(pageId: string): Promise<SeoSettings | undefined>;
  getSeoSettings(): Promise<SeoSettings[]>;
  createSeoSetting(setting: InsertSeoSettings): Promise<SeoSettings>;
  updateSeoSetting(id: number, setting: Partial<SeoSettings>): Promise<SeoSettings | undefined>;
  deleteSeoSetting(id: number): Promise<boolean>;
  
  // Site settings operations
  getSiteSetting(id: number): Promise<SiteSettings | undefined>;
  getSiteSettingByKey(key: string): Promise<SiteSettings | undefined>;
  getSiteSettings(group?: string): Promise<SiteSettings[]>;
  getPublicSiteSettings(): Promise<SiteSettings[]>;
  createSiteSetting(setting: InsertSiteSettings): Promise<SiteSettings>;
  updateSiteSetting(id: number, setting: Partial<SiteSettings>): Promise<SiteSettings | undefined>;
  deleteSiteSetting(id: number): Promise<boolean>;
  
  // Session storage
  sessionStore: session.Store;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private leasingOffers: Map<number, LeasingOffer>;
  private quoteRequests: Map<number, QuoteRequest>;
  private quoteOffers: Map<number, QuoteOffer>;
  private fleetRequests: Map<number, FleetRequest>;
  private seoSettings: Map<number, SeoSettings>;
  private siteSettings: Map<number, SiteSettings>;
  private userIdCounter: number;
  private leasingOfferIdCounter: number;
  private quoteRequestIdCounter: number;
  private quoteOfferIdCounter: number;
  private fleetRequestIdCounter: number;
  private seoSettingsIdCounter: number;
  private siteSettingsIdCounter: number;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.leasingOffers = new Map();
    this.quoteRequests = new Map();
    this.quoteOffers = new Map();
    this.fleetRequests = new Map();
    this.seoSettings = new Map();
    this.siteSettings = new Map();
    this.userIdCounter = 1;
    this.leasingOfferIdCounter = 1;
    this.quoteRequestIdCounter = 1;
    this.quoteOfferIdCounter = 1;
    this.fleetRequestIdCounter = 1;
    this.seoSettingsIdCounter = 1;
    this.siteSettingsIdCounter = 1;
    
    // Initialize session store
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
    
    // Initialize with admin user
    const adminUser = {
      username: "admin",
      password: "SecureAdminPass2023!", // More secure password that will be hashed
      name: "Admin User",
      email: "admin@autoleasingpro.fi",
      role: "admin" as const
    };
    this.users.set(1, {
      ...adminUser,
      id: 1,
      password: "71bb859a523feb6e46974b9ed65eb726596dbc262dac4bf88ec0fecf1a31959956bc2aba65bc4ba853903468312ee2230bb27ae18697991ff3efb6cac5a3aaa2.733e3dec342321ec4d785b60a8b51dde",
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
    this.userIdCounter = 2;
    
    // Initialize with a provider user
    const providerUser = {
      username: "provider",
      password: "provider123", // Will be hashed properly
      name: "Provider Company",
      email: "provider@company.fi",
      company: "Provider Company Oy",
      role: "provider" as const
    };
    this.users.set(2, {
      ...providerUser,
      id: 2,
      password: "6d92d2c1cc87eaaa2dcc68791400ed198d7eabcbad33a3e957f6b51fcd48f4af56bd4af5686ff950ed1918b313d2563fd6343fead126e593119493b86080dc0b.2e43e20a641a6c8982eaea02599b26d1",
      verified: true,
      phone: null,
      newsletterSubscription: true,
      offerNotifications: true,
      reminderNotifications: true,
      createdAt: new Date(),
      description: null,
      businessId: null
    });
    this.userIdCounter = 3;
    
    // Initialize with a customer user
    const customerUser = {
      username: "customer",
      password: "customer123", // Will be hashed properly
      name: "Testi Asiakas",
      email: "asiakas@esimerkki.fi",
      role: "customer" as const
    };
    this.users.set(3, {
      ...customerUser,
      id: 3,
      password: "6d92d2c1cc87eaaa2dcc68791400ed198d7eabcbad33a3e957f6b51fcd48f4af56bd4af5686ff950ed1918b313d2563fd6343fead126e593119493b86080dc0b.2e43e20a641a6c8982eaea02599b26d1",
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
    this.userIdCounter = 4;
    
    // Initialize with some leasing offers
    this.createSampleLeasingOffers();
    
    // Initialize with test quote requests
    this.createSampleQuoteRequests();
    
    // Initialize with default SEO settings
    this.createDefaultSeoSettings();
  }

  private createSampleQuoteRequests() {
    const sampleRequests = [
      {
        userId: 3, // customer user
        name: "Matti Meikäläinen",
        email: "matti@example.com",
        phone: "0401234567",
        requestType: "specific",
        leasingType: "private",
        contractLength: 36,
        carBrand: "BMW",
        carModel: "3-sarja",
        carYear: 2023,
        carType: "hybrid",
        annualMileage: 20000,
        downPayment: 250000, // 2500€
        maxMonthlyPrice: 60000, // 600€
        additionalInfo: "Haluan tumman auton, mielellään nahkapenkeillä.",
        termsAccepted: true,
        newsletterSubscription: true
      },
      {
        userId: 3, // customer user
        name: "Liisa Virtanen",
        email: "liisa@example.com",
        phone: "0507654321",
        requestType: "general",
        leasingType: "private",
        contractLength: 48,
        carType: "electric",
        annualMileage: 15000,
        downPayment: 300000, // 3000€
        maxMonthlyPrice: 50000, // 500€
        additionalInfo: "Etsin perheautoa, jossa hyvä toimintamatka.",
        termsAccepted: true,
        newsletterSubscription: true
      },
      {
        name: "Yritys Oy",
        email: "hankinta@yritys.fi",
        phone: "0981234567",
        company: "Yritys Oy",
        requestType: "specific",
        leasingType: "business",
        contractLength: 48,
        carBrand: "Mercedes-Benz",
        carModel: "E-sarja",
        carYear: 2023,
        carType: "plugin_hybrid",
        annualMileage: 30000,
        downPayment: 500000, // 5000€
        additionalInfo: "Tarvitsemme kaksi autoa johtoryhmälle. Tarjoattehan molemmat samalla sopimuksella.",
        termsAccepted: true,
        newsletterSubscription: false
      }
    ];
    
    sampleRequests.forEach(request => this.createQuoteRequest(request));
  }

  private createSampleLeasingOffers() {
    const sampleOffers: InsertLeasingOffer[] = [
      {
        providerId: 2,
        title: "Audi Q4 e-tron",
        carBrand: "Audi",
        carModel: "Q4 e-tron",
        carYear: 2023,
        carType: "electric",
        monthlyPrice: 69900, // in cents, 699€
        contractLength: 36,
        annualMileage: 20000,
        downPayment: 200000, // in cents, 2000€
        leasingType: "private",
        description: "Tyylikäs sähköauto parhailla varusteilla",
        imageUrl: "https://images.unsplash.com/photo-1614708267570-08b714e32e08?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        active: true
      },
      {
        providerId: 2,
        title: "Volvo XC60",
        carBrand: "Volvo",
        carModel: "XC60",
        carYear: 2023,
        carType: "hybrid",
        monthlyPrice: 74900, // in cents, 749€
        contractLength: 48,
        annualMileage: 30000,
        downPayment: 150000, // in cents, 1500€
        leasingType: "business",
        description: "Laadukas hybridi-SUV yrityskäyttöön",
        imageUrl: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        active: true
      },
      {
        providerId: 2,
        title: "Tesla Model 3",
        carBrand: "Tesla",
        carModel: "Model 3",
        carYear: 2023,
        carType: "electric",
        monthlyPrice: 59900, // in cents, 599€
        contractLength: 36,
        annualMileage: 15000,
        downPayment: 300000, // in cents, 3000€
        leasingType: "private",
        description: "Tehokas ja suosittu sähköauto",
        imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        active: true
      },
      {
        providerId: 3,
        title: "Ford Focus",
        carBrand: "Ford",
        carModel: "Focus",
        carYear: 2022,
        carType: "gasoline",
        monthlyPrice: 22900, // in cents, 229€
        contractLength: 36,
        annualMileage: 15000,
        downPayment: 100000, // in cents, 1000€
        leasingType: "private",
        description: "Taloudellinen ja luotettava ensiauto. Pieni kulutus, pieni kuukausierä.",
        imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        active: true
      },
      {
        providerId: 2,
        title: "Renault Master Pakettiauto",
        carBrand: "Renault",
        carModel: "Master",
        carYear: 2023,
        carType: "diesel",
        monthlyPrice: 44900, // in cents, 449€
        contractLength: 48,
        annualMileage: 30000,
        downPayment: 250000, // in cents, 2500€
        leasingType: "business",
        description: "Käytännöllinen ja luotettava pakettiauto yrityskäyttöön.",
        imageUrl: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        active: true
      },
      {
        providerId: 3,
        title: "Toyota RAV4 Hybrid",
        carBrand: "Toyota",
        carModel: "RAV4",
        carYear: 2023,
        carType: "hybrid",
        monthlyPrice: 49900, // in cents, 499€
        contractLength: 36,
        annualMileage: 20000,
        downPayment: 200000, // in cents, 2000€
        leasingType: "private",
        description: "Luotettava ja vähän kuluttava hybridi SUV perheille.",
        imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        active: true
      }
    ];
    
    // Initialize with another provider if not exists
    if (!this.users.has(3)) {
      this.createUser({
        username: "provider2",
        password: "provider2pass",
        name: "AutoLeasing Finland",
        email: "info@autoleasing.fi",
        company: "AutoLeasing Finland Oy",
        role: "provider"
      });
    }
    
    sampleOffers.forEach(offer => this.createLeasingOffer(offer));
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    // Do not allow updating certain fields like id and role
    const { id: _, role: __, ...safeUserData } = userData;
    
    const updatedUser = { ...user, ...safeUserData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    // Ensure role is set, default to "customer" if not provided
    const role = user.role || "customer";
    // Ensure null for optional fields that might be undefined
    const phone = user.phone === undefined ? null : user.phone;
    const company = user.company === undefined ? null : user.company;
    
    // Ensure defaults for notification settings if undefined
    const newsletterSubscription = user.newsletterSubscription === undefined ? true : user.newsletterSubscription;
    const offerNotifications = user.offerNotifications === undefined ? true : user.offerNotifications;
    const reminderNotifications = user.reminderNotifications === undefined ? true : user.reminderNotifications;
    
    const newUser: User = { 
      ...user, 
      id, 
      role,
      phone,
      company,
      newsletterSubscription,
      offerNotifications,
      reminderNotifications,
      verified: role === "provider" ? false : true, // Providers need verification
      createdAt: new Date(),
      description: user.description || null,
      businessId: user.businessId || null
    };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Leasing offer operations
  async getLeasingOffer(id: number): Promise<LeasingOffer | undefined> {
    return this.leasingOffers.get(id);
  }

  async getLeasingOffers(filters?: Partial<LeasingOffer>): Promise<LeasingOffer[]> {
    let offers = Array.from(this.leasingOffers.values());
    
    if (filters) {
      offers = offers.filter(offer => {
        for (const [key, value] of Object.entries(filters)) {
          // Skip undefined values in filters
          if (value === undefined) continue;
          
          // @ts-ignore - dynamic property access
          if (offer[key] !== value) return false;
        }
        return true;
      });
    }
    
    return offers;
  }

  async getLeasingOffersByProvider(providerId: number): Promise<LeasingOffer[]> {
    return Array.from(this.leasingOffers.values()).filter(
      offer => offer.providerId === providerId
    );
  }

  async createLeasingOffer(offer: InsertLeasingOffer): Promise<LeasingOffer> {
    const id = this.leasingOfferIdCounter++;
    // Ensure null for optional fields that might be undefined
    const description = offer.description === undefined ? null : offer.description;
    const imageUrl = offer.imageUrl === undefined ? null : offer.imageUrl;
    const active = offer.active === undefined ? true : offer.active;
    const featured = offer.featured === undefined ? false : offer.featured;
    
    const newOffer: LeasingOffer = { 
      ...offer, 
      id, 
      description,
      imageUrl,
      active,
      featured,
      createdAt: new Date() 
    };
    this.leasingOffers.set(id, newOffer);
    return newOffer;
  }

  async updateLeasingOffer(id: number, offerData: Partial<LeasingOffer>): Promise<LeasingOffer | undefined> {
    const offer = this.leasingOffers.get(id);
    if (!offer) return undefined;
    
    const updatedOffer = { ...offer, ...offerData };
    this.leasingOffers.set(id, updatedOffer);
    return updatedOffer;
  }

  async deleteLeasingOffer(id: number): Promise<boolean> {
    return this.leasingOffers.delete(id);
  }

  // Quote request operations
  async getQuoteRequest(id: number): Promise<QuoteRequest | undefined> {
    return this.quoteRequests.get(id);
  }

  async getQuoteRequests(filters?: Partial<QuoteRequest>): Promise<QuoteRequest[]> {
    let requests = Array.from(this.quoteRequests.values());
    
    if (filters) {
      requests = requests.filter(request => {
        for (const [key, value] of Object.entries(filters)) {
          // Skip undefined values in filters
          if (value === undefined) continue;
          
          // @ts-ignore - dynamic property access
          if (request[key] !== value) return false;
        }
        return true;
      });
    }
    
    return requests;
  }

  async getQuoteRequestsByUser(userId: number): Promise<QuoteRequest[]> {
    return Array.from(this.quoteRequests.values()).filter(
      request => request.userId === userId
    );
  }

  async createQuoteRequest(request: InsertQuoteRequest): Promise<QuoteRequest> {
    const id = this.quoteRequestIdCounter++;
    // Ensure null for optional fields that might be undefined
    const company = request.company === undefined ? null : request.company;
    const carBrand = request.carBrand === undefined ? null : request.carBrand;
    const carModel = request.carModel === undefined ? null : request.carModel;
    const carYear = request.carYear === undefined ? null : request.carYear;
    const carType = request.carType === undefined ? null : request.carType;
    const maxMonthlyPrice = request.maxMonthlyPrice === undefined ? null : request.maxMonthlyPrice;
    const downPayment = request.downPayment === undefined ? null : request.downPayment;
    const additionalInfo = request.additionalInfo === undefined ? null : request.additionalInfo;
    const userId = request.userId === undefined ? null : request.userId;
    
    const newRequest: QuoteRequest = { 
      ...request, 
      id, 
      company,
      carBrand,
      carModel,
      carYear,
      carType,
      maxMonthlyPrice,
      downPayment,
      additionalInfo,
      userId,
      status: "open", 
      createdAt: new Date(),
      newsletterSubscription: request.newsletterSubscription || null
    };
    this.quoteRequests.set(id, newRequest);
    return newRequest;
  }

  async updateQuoteRequest(id: number, requestData: Partial<QuoteRequest>): Promise<QuoteRequest | undefined> {
    const request = this.quoteRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...requestData };
    this.quoteRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  // Quote offer operations
  async getQuoteOffer(id: number): Promise<QuoteOffer | undefined> {
    return this.quoteOffers.get(id);
  }

  async getQuoteOffers(filters?: Partial<QuoteOffer>): Promise<QuoteOffer[]> {
    let offers = Array.from(this.quoteOffers.values());
    
    if (filters) {
      offers = offers.filter(offer => {
        for (const [key, value] of Object.entries(filters)) {
          // Skip undefined values in filters
          if (value === undefined) continue;
          
          // @ts-ignore - dynamic property access
          if (offer[key] !== value) return false;
        }
        return true;
      });
    }
    
    return offers;
  }

  async getQuoteOffersByRequest(requestId: number): Promise<QuoteOffer[]> {
    return Array.from(this.quoteOffers.values()).filter(
      offer => offer.quoteRequestId === requestId
    );
  }

  async getQuoteOffersByProvider(providerId: number): Promise<QuoteOffer[]> {
    return Array.from(this.quoteOffers.values()).filter(
      offer => offer.providerId === providerId
    );
  }

  async createQuoteOffer(offer: InsertQuoteOffer): Promise<QuoteOffer> {
    const id = this.quoteOfferIdCounter++;
    // Ensure null for optional fields that might be undefined
    const description = offer.description === undefined ? null : offer.description;
    
    const newOffer: QuoteOffer = { 
      ...offer, 
      id, 
      description,
      status: "pending", 
      createdAt: new Date() 
    };
    this.quoteOffers.set(id, newOffer);
    return newOffer;
  }

  async updateQuoteOffer(id: number, offerData: Partial<QuoteOffer>): Promise<QuoteOffer | undefined> {
    const offer = this.quoteOffers.get(id);
    if (!offer) return undefined;
    
    const updatedOffer = { ...offer, ...offerData };
    this.quoteOffers.set(id, updatedOffer);
    return updatedOffer;
  }
  
  // Fleet request operations (yrityskalusto)
  async getFleetRequest(id: number): Promise<FleetRequest | undefined> {
    return this.fleetRequests.get(id);
  }

  async getFleetRequests(filters?: Partial<FleetRequest>): Promise<FleetRequest[]> {
    let requests = Array.from(this.fleetRequests.values());
    
    if (filters) {
      requests = requests.filter(request => {
        for (const [key, value] of Object.entries(filters)) {
          // Skip undefined values in filters
          if (value === undefined) continue;
          
          // @ts-ignore - dynamic property access
          if (request[key] !== value) return false;
        }
        return true;
      });
    }
    
    return requests;
  }

  async getFleetRequestsByUser(userId: number): Promise<FleetRequest[]> {
    return Array.from(this.fleetRequests.values()).filter(
      request => request.userId === userId
    );
  }

  async createFleetRequest(request: InsertFleetRequest): Promise<FleetRequest> {
    const id = this.fleetRequestIdCounter++;
    
    // Ensure null for optional fields that might be undefined
    const userId = request.userId === undefined ? null : request.userId;
    const deliveryTime = request.deliveryTime === undefined ? null : request.deliveryTime;
    const message = request.message === undefined ? null : request.message;
    const preferredCallback = request.preferredCallback === undefined ? "email" : request.preferredCallback;
    
    const newRequest: FleetRequest = { 
      ...request, 
      id,
      companyName: request.companyName,
      businessId: request.businessId,
      contactPerson: request.contactPerson,
      email: request.email,
      phone: request.phone,
      leasingDuration: request.leasingDuration,
      annualMileage: request.annualMileage,
      deliveryTime,
      preferredCallback,
      message,
      vehicles: request.vehicles,
      termsAccepted: request.termsAccepted,
      userId,
      status: "new",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.fleetRequests.set(id, newRequest);
    return newRequest;
  }

  async updateFleetRequest(id: number, requestData: Partial<FleetRequest>): Promise<FleetRequest | undefined> {
    const request = this.fleetRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { 
      ...request, 
      ...requestData,
      updatedAt: new Date() 
    };
    
    this.fleetRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async deleteFleetRequest(id: number): Promise<boolean> {
    return this.fleetRequests.delete(id);
  }

  // SEO Settings operations
  async getSeoSetting(id: number): Promise<SeoSettings | undefined> {
    return this.seoSettings.get(id);
  }

  async getSeoSettingByPageId(pageId: string): Promise<SeoSettings | undefined> {
    return Array.from(this.seoSettings.values()).find(
      setting => setting.pageId === pageId
    );
  }

  async getSeoSettings(): Promise<SeoSettings[]> {
    return Array.from(this.seoSettings.values());
  }

  async createSeoSetting(setting: InsertSeoSettings): Promise<SeoSettings> {
    const id = this.seoSettingsIdCounter++;
    
    // Ensure null for optional fields that might be undefined
    const keywords = setting.keywords === undefined ? null : setting.keywords;
    const ogTitle = setting.ogTitle === undefined ? null : setting.ogTitle;
    const ogDescription = setting.ogDescription === undefined ? null : setting.ogDescription;
    const ogImage = setting.ogImage === undefined ? null : setting.ogImage;
    const twitterTitle = setting.twitterTitle === undefined ? null : setting.twitterTitle;
    const twitterDescription = setting.twitterDescription === undefined ? null : setting.twitterDescription;
    const twitterImage = setting.twitterImage === undefined ? null : setting.twitterImage;
    const canonicalUrl = setting.canonicalUrl === undefined ? null : setting.canonicalUrl;
    const structuredData = setting.structuredData === undefined ? null : setting.structuredData;
    
    const newSetting: SeoSettings = {
      ...setting,
      id,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterImage,
      canonicalUrl,
      structuredData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.seoSettings.set(id, newSetting);
    return newSetting;
  }

  async updateSeoSetting(id: number, settingData: Partial<SeoSettings>): Promise<SeoSettings | undefined> {
    const setting = this.seoSettings.get(id);
    if (!setting) return undefined;
    
    const updatedSetting = { 
      ...setting, 
      ...settingData,
      updatedAt: new Date()
    };
    
    this.seoSettings.set(id, updatedSetting);
    return updatedSetting;
  }

  async deleteSeoSetting(id: number): Promise<boolean> {
    return this.seoSettings.delete(id);
  }

  // Site Settings operations
  async getSiteSetting(id: number): Promise<SiteSettings | undefined> {
    return this.siteSettings.get(id);
  }

  async getSiteSettingByKey(key: string): Promise<SiteSettings | undefined> {
    return Array.from(this.siteSettings.values()).find(
      setting => setting.settingKey === key
    );
  }

  async getSiteSettings(group?: string): Promise<SiteSettings[]> {
    const settings = Array.from(this.siteSettings.values());
    
    if (group) {
      return settings.filter(setting => setting.settingGroup === group);
    }
    
    return settings;
  }

  async getPublicSiteSettings(): Promise<SiteSettings[]> {
    return Array.from(this.siteSettings.values()).filter(
      setting => setting.isPublic === true
    );
  }

  async createSiteSetting(setting: InsertSiteSettings): Promise<SiteSettings> {
    const id = this.siteSettingsIdCounter++;
    
    // Ensure null for optional fields that might be undefined
    const description = setting.description === undefined ? null : setting.description;
    const isPublic = setting.isPublic === undefined ? false : setting.isPublic;
    
    const newSetting: SiteSettings = {
      ...setting,
      id,
      description,
      isPublic,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.siteSettings.set(id, newSetting);
    return newSetting;
  }

  async updateSiteSetting(id: number, settingData: Partial<SiteSettings>): Promise<SiteSettings | undefined> {
    const setting = this.siteSettings.get(id);
    if (!setting) return undefined;
    
    const updatedSetting = { 
      ...setting, 
      ...settingData,
      updatedAt: new Date()
    };
    
    this.siteSettings.set(id, updatedSetting);
    return updatedSetting;
  }

  async deleteSiteSetting(id: number): Promise<boolean> {
    return this.siteSettings.delete(id);
  }
  
  private createDefaultSeoSettings() {
    const seoSettings = [
      {
        pageId: "home",
        title: "AutoLeasingPro | Helpoin tapa LÖYTÄÄ LEASING AUTO | Autojen kilpailutus",
        description: "Löydä edullisin leasing auto helposti ja nopeasti. Autojen kilpailutus yhdellä lomakkeella säästää aikaasi. Vertaile yksityis-, yritys- ja rahoitusleasing vaihtoehtoja Suomen kattavimmasta palvelusta.",
        keywords: "leasing auto, autojen kilpailutus, auton leasing vertailu, edullisin leasing, leasing tarjoukset, yritysleasing, yksityisleasing, rahoitusleasing, vertaa leasing-sopimuksia, halvat leasing-autot, leasing-tarjousten vertailu, autojen leasing-kilpailutus, leasing-hintavertailu, leasing-sopimus yritykselle, helppo autojen kilpailutus, nopea leasing-vertailu, henkilöautojen leasing, leasing ilman käsirahaa, joustavat leasing-ehdot, leasing-sopimuksen kilpailutus, sähköauton leasing, hybridiauton leasing, autojen leasing-markkinapaikka, leasing-haku, perheleasing, premium auton leasing, leasing-vertailutyökalu, autoleasing Suomessa, autorahoitusvertailu, yritykselle auto edullisesti",
        ogTitle: "AutoLeasingPro - Helpoin tapa löytää edullisin leasing auto | Autojen kilpailutus",
        ogDescription: "Kilpailuta leasing-autosi helposti ja löydä paras sopimus. Vertaa yksityis-, yritys- ja rahoitusleasing-tarjouksia Suomen kattavimmasta palvelusta. Säästä aikaa ja rahaa.",
        ogImage: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "AutoLeasingPro - Leasing-autojen kilpailutus | Edullisin leasing",
        twitterDescription: "Löydä leasing auto helposti kilpailuttamalla. Vertaile Suomen parhaat tarjoukset yhdestä paikasta ja säästä jopa 30% leasing-kustannuksissa.",
        twitterImage: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "AutoLeasingPro - Autojen leasing-kilpailutus",
          "url": "https://autoleasingpro.fi",
          "description": "Suomen kattavin leasing-autojen vertailupalvelu. Kilpailuta autot ja saa parhaat tarjoukset yhdellä hakemuksella.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://autoleasingpro.fi/haku?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })
      },
      {
        pageId: "leasing-laskuri",
        title: "Leasing-laskuri | Laske Autoleasing-kustannukset | Tekoälysuositukset",
        description: "Käytä tekoälypohjaista leasing-laskuria ja löydä juuri sinulle sopivat autot. Laske leasing-kustannukset, vertaile autoja ja pyydä tarjouksia yhdessä paikassa.",
        keywords: "leasing-laskuri, autoleasing laskuri, auto laskuri, tekoälylaskuri, leasing-kustannuslaskuri, auton hinta laskuri, leasing-vertailulaskuri, leasing-kuukausimaksu laskuri, leasing-auto kalkulaattori, leasing-budjetti, auto tekoälysuositukset, leasing-kalkulaattori, leasing-sopimus laskuri, autoleasing-hintalaskuri, vertaile autoja, leasing-hintalaskelma, leasing-rahoituslaskuri, autosuosittelija, autovertailu, auto kustannuslaskuri, leasing-tarjouslaskuri, leasing-sopimusvertailu, halvin leasing-auto, edullisin leasing, leasing-hintavertailu, henkilöauton leasing-laskuri",
        ogTitle: "Tekoälypohjainen leasing-laskuri ja autosuosittelija | AutoLeasingPro",
        ogDescription: "Laske autoleasing-kustannukset ja löydä parhaat autovaihtoehdot tekoälysuosituksilla. Kokeile ilmaiseksi ja säästä aikaa auton etsinnässä.",
        ogImage: "https://images.unsplash.com/photo-1563990315362-93277dc5c0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Tekoälylaskuri autoleasing | Löydä täydellinen auto budjettiin",
        twitterDescription: "Laske autoleasing-kustannukset ja katso räätälöidyt tekoälysuositukset. Helpoin tapa löytää sopiva auto juuri sinun tarpeisiisi.",
        twitterImage: "https://images.unsplash.com/photo-1563990315362-93277dc5c0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/leasing-laskuri",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "AutoLeasingPro Leasing-laskuri",
          "url": "https://autoleasingpro.fi/leasing-laskuri",
          "description": "Tekoälypohjainen laskuri leasing-kuukausimaksujen arviointiin ja autosuosituksiin.",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          }
        })
      },
      {
        pageId: "offers",
        title: "Vertaa leasing-sopimuksia | Halvat leasing-autot | Sähköauton leasing",
        description: "Selaa ja vertaile edullisin leasing-sopimuksia. Löydä halvat leasing-autot helposti - sähköautot, hybridit, bensa- ja dieselmallit. Yksityis-, yritys- ja rahoitusleasing.",
        keywords: "vertaa leasing-sopimuksia, halvat leasing-autot, edullisin leasing, leasing-hintavertailu, sähköauton leasing, hybridiauton leasing, leasing ilman käsirahaa, yritysleasing, yksityisleasing, rahoitusleasing, henkilöautojen leasing, premium auton leasing, perheleasing, joustavat leasing-ehdot, leasing-tarjoukset, autojen leasing, autojen kilpailutus, leasing-sopimus yritykselle, auton leasing vertailu",
        ogTitle: "Vertaa leasing-sopimuksia - Löydä edullisin leasing-auto",
        ogDescription: "Selaa laajaa valikoimaa leasing-autoja eri hintakategorioissa. Löydä edullisimmat sähköautot, hybridiautot ja perinteiset autot. Leasing ilman käsirahaa tai joustavilla ehdoilla.",
        ogImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Vertaa leasing-autoja | Edullisin leasing-sopimus | Sähköautot",
        twitterDescription: "Selaa ja löydä halvat leasing-autot nopeasti - sähköautot, hybridit ja perinteiset mallit yhdessä paikassa. Vertaa ja säästä.",
        twitterImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/offers",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Leasing-tarjoukset ja paketit",
          "description": "Suomen parhaat leasing-tarjoukset autoille - sähköautot, hybridit ja perinteiset autot.",
          "url": "https://autoleasingpro.fi/offers",
          "numberOfItems": 10,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Sähköauton leasing",
              "url": "https://autoleasingpro.fi/offers?type=electric"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Hybridiauton leasing",
              "url": "https://autoleasingpro.fi/offers?type=hybrid"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": "Yritysleasing",
              "url": "https://autoleasingpro.fi/offers?category=business"
            }
          ]
        })
      },
      {
        pageId: "request",
        title: "Autojen kilpailutus | Helppo leasing-hintavertailu | Yritykselle auto edullisesti",
        description: "Kilpailuta auto - täytä yksi lomake ja vastaanota useita tarjouksia. Nopea leasing-vertailu säästää aikaasi ja rahaa. Leasing ilman käsirahaa, edullisin leasing yritykselle ja yksityisille.",
        keywords: "autojen kilpailutus, leasing-hintavertailu, edullisin leasing, nopea leasing-vertailu, leasing-sopimuksen kilpailutus, helppo autojen kilpailutus, leasing-tarjousten vertailu, autojen leasing-kilpailutus, leasing-vertailutyökalu, yritykselle auto edullisesti, leasing ilman käsirahaa, premium auton leasing, sähköauton leasing, hybridiauton leasing, joustavat leasing-ehdot, auton leasing vertailu, leasing-haku, yritysleasing, yksityisleasing, rahoitusleasing",
        ogTitle: "Kilpailuta autot helposti - Nopea leasing-hintavertailu",
        ogDescription: "Säästä jopa 30% autojen leasing-kustannuksissa. Täytä yksi lomake ja vastaanota useita kilpailevia tarjouksia. Helpoin tapa löytää edullisin leasing-auto yritykselle tai yksityiselle.",
        ogImage: "https://images.unsplash.com/photo-1560438718-eb61ede255eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Autojen kilpailutus | Nopea leasing-hintavertailu",
        twitterDescription: "Kilpailuta autot - säästä aikaa ja rahaa. Täytä yksi lomake ja saat useilta toimijoilta parhaat tarjoukset.",
        twitterImage: "https://images.unsplash.com/photo-1560438718-eb61ede255eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/request",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "AutoLeasingPro - Autojen kilpailutuspalvelu",
          "description": "Kilpailuta leasing-autosi helposti ja löydä edullisin sopimus. Yksi lomake, monta tarjousta.",
          "provider": {
            "@type": "Organization",
            "name": "AutoLeasingPro",
            "url": "https://autoleasingpro.fi"
          },
          "areaServed": "Finland",
          "serviceType": "Autojen leasing-kilpailutus",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
          }
        })
      },
      {
        pageId: "auth",
        title: "Kirjaudu sisään | AutoLeasingPro",
        description: "Kirjaudu AutoLeasingPro-tilillesi tai rekisteröidy uudeksi käyttäjäksi. Hallinnoi tarjouspyyntöjä ja leasing-sopimuksia.",
        keywords: "kirjaudu, rekisteröidy, autoleasing tili, leasing palvelu kirjautuminen",
        ogTitle: "Kirjaudu sisään AutoLeasingPro-palveluun",
        ogDescription: "Hallinnoi autoleasing-tarjouksia, tarjouspyyntöjä ja sopimuksia helposti yhdestä paikasta.",
        ogImage: "https://images.unsplash.com/photo-1517153295259-74eb0b416cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Kirjaudu sisään | AutoLeasingPro",
        twitterDescription: "Hallinnoi leasing-tarjouksia ja tarjouspyyntöjä tilisi kautta",
        twitterImage: "https://images.unsplash.com/photo-1517153295259-74eb0b416cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/auth"
      },
      {
        pageId: "profile",
        title: "Käyttäjäprofiili | AutoLeasingPro",
        description: "Hallinnoi käyttäjäprofiiliasi, tarjouspyyntöjä ja vastaanotettuoja tarjouksia AutoLeasingPro-palvelussa.",
        keywords: "käyttäjäprofiili, leasing tarjoukset, leasing tarjouspyynnöt, autoleasing hallinta",
        ogTitle: "Hallinnoi leasing-palvelujasi",
        ogDescription: "Käyttäjäprofiilissa voit hallita tarjouspyyntöjä, tarkastella tarjouksia ja päivittää tietojasi.",
        ogImage: "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Käyttäjäprofiili | AutoLeasingPro",
        twitterDescription: "Hallinnoi leasing-sopimuksiasi ja tarjouspyyntöjäsi",
        twitterImage: "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/profile"
      },
      {
        pageId: "provider-register",
        title: "Liity autoleasing-tarjoajaksi | Leasing-yrityksen markkinapaikka | AutoLeasingPro",
        description: "Liity autojen leasing-markkinapaikkaan ja tavoita asiakkaat, jotka etsivät leasing-autoja. Kasvata leasing-liiketoimintaasi Suomen suosituimmalla autojen vertailupalvelulla.",
        keywords: "autojen leasing-markkinapaikka, autoleasing-tarjoaja, leasing-yritys rekisteröinti, leasing-yrityksen rekisteröityminen, autojen leasing-kilpailutus, leasing-tarjousten vertailu, yritysleasing, rahoitusleasing, yksityisleasing, autojen leasing, leasing-sopimus yritykselle, leasing-hintavertailu, leasing-vertailutyökalu, autoleasing Suomessa",
        ogTitle: "Liity autoleasing-markkinapaikkaan | Kasvata liiketoimintaasi",
        ogDescription: "Tavoita autojen leasing-asiakkaat ja kasvata liiketoimintaasi. Tuo tarjoukset AutoLeasingPro-markkinapaikkaan ja tavoita sekä yritys- että kuluttaja-asiakkaat.",
        ogImage: "https://images.unsplash.com/photo-1560438718-eb61ede255eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Liity autojen leasing-markkinapaikkaan | AutoLeasingPro",
        twitterDescription: "Kasvata leasing-liiketoimintaasi - tavoita yritykset ja kuluttajat jotka etsivät parhaita leasing-vaihtoehtoja",
        twitterImage: "https://images.unsplash.com/photo-1560438718-eb61ede255eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/provider-register",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "AutoLeasingPro - Leasing-yritysten markkinapaikka",
          "description": "Tarjoamme leasing-yrityksille markkinapaikan, jossa tavoittaa laajan asiakaskunnan. Liity kumppaniverkostoon ja kasvata liiketoimintaasi.",
          "provider": {
            "@type": "Organization",
            "name": "AutoLeasingPro",
            "url": "https://autoleasingpro.fi"
          },
          "areaServed": "Finland",
          "serviceType": "Leasing-yritysten markkinapaikka",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          }
        })
      },
      {
        pageId: "about",
        title: "Tietoa palvelusta | AutoLeasingPro - Autojen leasing-vertailu",
        description: "Tietoa AutoLeasingPro-palvelusta ja yrityksestämme. Tutustu toimintaamme, arvoihimme sekä visioomme autojen leasing-vertailun helpottamiseksi.",
        keywords: "tietoa autoleasingpro, autoleasing yritys, autojen leasing-vertailu, leasing-palvelu, autojen kilpailutus, leasing-hintavertailu, autoleasing Suomessa",
        ogTitle: "Tietoa AutoLeasingPro-palvelusta | Suomen johtava autojen leasing-vertailupalvelu",
        ogDescription: "AutoLeasingPro on Suomen johtava autojen leasing-vertailupalvelu, jonka tavoitteena on tehdä autojen leasing-sopimuksen hankkimisesta mahdollisimman helppoa ja edullista.",
        ogImage: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Tietoa AutoLeasingPro-palvelusta | Autojen leasing-vertailu",
        twitterDescription: "Tutustu Suomen johtavaan autojen leasing-vertailupalveluun. AutoLeasingPro auttaa löytämään juuri sinulle tai yrityksellesi sopivan leasing-auton.",
        twitterImage: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/tietoa-palvelusta",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "AutoLeasingPro",
          "url": "https://autoleasingpro.fi",
          "logo": "https://autoleasingpro.fi/logo.png",
          "description": "Suomen johtava autojen leasing-vertailupalvelu",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Helsinki",
            "addressRegion": "Uusimaa",
            "postalCode": "00100",
            "addressCountry": "FI"
          }
        })
      },
      {
        pageId: "leasing-guide",
        title: "Leasing-opas | Kaikki mitä sinun tulee tietää autojen leasingista",
        description: "Kattava opas autojen leasingista. Tutustu leasing-eri vaihtoehtoihin, sopimusehtoihin ja säästövinkkeihin.",
        keywords: "leasing-opas, autojen leasing, yksityisleasing, yritysleasing, rahoitusleasing, leasing-sopimus, leasing-vinkit, leasing auton valinta, leasing kilpailutus, leasing-hintavertailu",
        ogTitle: "Leasing-opas | Kaikki mitä sinun tulee tietää autojen leasingista",
        ogDescription: "Tutustu autojen leasingin eri muotoihin, vaihtoehtoihin ja säästövinkkeihin. Kattava leasing-opas auttaa löytämään parhaan vaihtoehdon.",
        ogImage: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Leasing-opas | Autoilun uusi suunta - Leasingin vaihtoehdot ja vinkit",
        twitterDescription: "Kattava opas autojen leasingista. Vertaile eri vaihtoehtoja ja löydä paras ratkaisu autoilun tarpeisiisi.",
        twitterImage: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/leasing-opas",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Kattava Leasing-opas - Kaikki mitä sinun tulee tietää autojen leasingista",
          "description": "Opas autojen leasingin eri muotoihin, vaihtoehtoihin ja säästövinkkeihin. Vertaile eri vaihtoehtoja ja löydä paras ratkaisu.",
          "image": "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          "author": {
            "@type": "Organization",
            "name": "AutoLeasingPro"
          },
          "publisher": {
            "@type": "Organization",
            "name": "AutoLeasingPro",
            "logo": {
              "@type": "ImageObject",
              "url": "https://autoleasingpro.fi/logo.png"
            }
          },
          "datePublished": "2023-06-15",
          "dateModified": "2023-10-20"
        })
      },
      {
        pageId: "yksityisleasing",
        title: "Yksityisleasing | Henkilöauton leasing yksityishenkilöille",
        description: "Yksityisleasing on joustava tapa hankkia auto yksityishenkilöille. Tutustu etuihin, rahoitusratkaisuihin ja vinkkeihin parhaan sopimuksen löytämiseksi.",
        keywords: "yksityisleasing, yksityishenkilön leasing, henkilöauton leasing, leasing sopimus, auto leasing yksityisille, leasing ilman käsirahaa, edullinen leasing, henkilöautojen leasing",
        ogTitle: "Yksityisleasing - Henkilöauton leasing yksityishenkilöille",
        ogDescription: "Yksityisleasing on moderni tapa hankkia auto käyttöösi ilman omistamisen huolia. Kiinteä kuukausimaksu ja huolettomuus. Lue lisää!",
        ogImage: "https://images.unsplash.com/photo-1558400566-0228f94d372b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Yksityisleasing | Joustavaa autoilua ilman omistushuolia",
        twitterDescription: "Tutustu yksityisleasingin etuihin: ei jälleenmyyntihuolia, kiinteät kuukausikulut, huoletonta autoilua.",
        twitterImage: "https://images.unsplash.com/photo-1558400566-0228f94d372b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/yksityisleasing",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Mitä yksityisleasing tarkoittaa?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yksityisleasing on henkilökohtainen auton pitkäaikaisvuokraus, jossa maksat kiinteää kuukausimaksua auton käytöstä tietyn sopimusajan, yleensä 24-60 kuukauden ajan. Toisin kuin auton ostamisessa, sinun ei tarvitse sitoa suuria pääomia tai huolehtia jälleenmyyntiarvon laskusta."
              }
            },
            {
              "@type": "Question",
              "name": "Sisältyvätkö huollot ja vakuutukset yksityisleasingiin?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Useimmiten kyllä. Tyypillisesti yksityisleasingsopimukseen kuuluu huolto- ja korjauspalvelut sekä kattava kaskovakuutus. Tarkista kuitenkin aina vakuutuksen sisältö ja omavastuut sopimuksesta."
              }
            },
            {
              "@type": "Question",
              "name": "Voiko leasingautoa lunastaa itselleen?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yksityisleasingissa se ei yleensä ole mahdollista. Rahoitusleasingissa auton lunastusmahdollisuus on tavallisempi. Tarkista sopimuksen ehdot."
              }
            }
          ]
        })
      },
      {
        pageId: "yritysleasing",
        title: "Yritysleasing | Yritykselle auto edullisesti ja veroetuja",
        description: "Yritysleasing on joustava ja kustannustehokas tapa hankkia autoja yritykselle. Tutustu verotusetuihin, kirjanpidollisiin hyötyihin ja erilaisiin leasing-vaihtoehtoihin.",
        keywords: "yritysleasing, yritykselle auto, leasing yritykselle, yritysautojen leasing, yrityksen autoetu, leasing-auto alv, leasing-sopimus yritykselle, leasing-hintavertailu, yritykselle auto edullisesti",
        ogTitle: "Yritysleasing - Yritykselle auto kustannustehokkaasti",
        ogDescription: "Yritysleasing tarjoaa merkittäviä veroetuja ja vapauttaa pääomaa muuhun liiketoimintaan. Kustannustehokas tapa hallinnoida yrityksen autokantaa.",
        ogImage: "https://images.unsplash.com/photo-1530685932526-378f58335fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Yritysleasing | ALV-vähennys ja kirjanpitoedut autoissa",
        twitterDescription: "Yritysleasing on kustannustehokas tapa järjestää yrityksen autoilu. Tutustu veroetuihin ja tasevaikutuksiin.",
        twitterImage: "https://images.unsplash.com/photo-1530685932526-378f58335fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/yritysleasing",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Mitä veroetuja yritysleasing tarjoaa?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yritysleasingissa autoon liittyvä arvonlisävero on vähennyskelpoinen (24%), mikä ei ole mahdollista ostetuissa autoissa. Lisäksi leasing-maksut ovat kokonaisuudessaan vähennyskelpoisia yrityksen kirjanpidossa."
              }
            },
            {
              "@type": "Question",
              "name": "Miten yritysleasing vaikuttaa yrityksen taseeseen?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Leasing-autot eivät näy yrityksen taseessa, mikä parantaa pääoman tuottoprosenttia ja muita taloudellisia tunnuslukuja. Kyseessä on taseen ulkopuolinen rahoitus."
              }
            },
            {
              "@type": "Question",
              "name": "Sopiiko yritysleasing myös pienille yrityksille?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Kyllä, yritysleasing sopii kaikenkokoisille yrityksille. Se vapauttaa pääomaa muuhun liiketoimintaan, tekee autoilun kustannuksista ennakoitavia ja poistaa riskin auton jälleenmyyntiarvon laskusta."
              }
            }
          ]
        })
      },
      {
        pageId: "rahoitusleasing",
        title: "Rahoitusleasing | Auto käyttöön ja mahdollisuus lunastukseen",
        description: "Rahoitusleasing on joustava tapa hankkia auto käyttöön ja mahdollisuus lunastaa se sopimuskauden päättyessä. Tutustu rahoitusleasingin etuihin ja ehtoihin.",
        keywords: "rahoitusleasing, auto rahoitusleasing, leasing auton lunastus, rahoitusleasing yritykselle, rahoitusleasing yksityiselle, auton rahoitusvaihtoehdot, leasing-hintavertailu, edullinen leasing",
        ogTitle: "Rahoitusleasing - Joustava autorahoitus lunastusmahdollisuudella",
        ogDescription: "Rahoitusleasing tarjoaa edullisemman kuukausimaksun ja mahdollisuuden lunastaa auto itsellesi sopimuskauden päättyessä. Tutustu rahoitusleasingin etuihin.",
        ogImage: "https://images.unsplash.com/photo-1551952238-2315a31e1f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Rahoitusleasing | Joustava autorahoitus lunastusmahdollisuudella",
        twitterDescription: "Rahoitusleasing soveltuu sekä yrityksille että yksityishenkilöille. Edullisempi vaihtoehto auton hankintaan lunastusvaihtoehdolla.",
        twitterImage: "https://images.unsplash.com/photo-1551952238-2315a31e1f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/rahoitusleasing",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Mitä rahoitusleasing tarkoittaa?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Rahoitusleasing on autorahoituksen muoto, jossa auton hankkii rahoitusyhtiö, mutta asiakas tekee sopimuksen auton käytöstä sovituksi määräajaksi. Sopimuskauden päättyessä asiakkaalla on usein mahdollisuus lunastaa auto itselleen."
              }
            },
            {
              "@type": "Question",
              "name": "Miten rahoitusleasing eroaa huoltoleasingista?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Toisin kuin huoltoleasingissa (yksityis- ja yritysleasing), rahoitusleasingissa asiakas vastaa itse auton huolloista, korjauksista ja muista käyttökuluista. Tämän vuoksi kuukausimaksut ovat yleensä edullisemmat."
              }
            },
            {
              "@type": "Question",
              "name": "Kenelle rahoitusleasing sopii?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Rahoitusleasing sopii sekä yksityishenkilöille että yrityksille, jotka haluavat joustavuutta auton hankintaan, mutta myös mahdollisuuden auton lopulliseen omistamiseen. Se on hyvä vaihtoehto, jos haluat alhaisemman kuukausimaksun ja olet valmis vastaamaan itse auton huolto- ja korjauskuluista."
              }
            }
          ]
        })
      },
      {
        pageId: "yrityskalusto",
        title: "Yrityskalusto ja kalustonhallinta | AutoLeasingPro",
        description: "Pyydä tarjous yrityskalustosta. Hanki paketti- ja kuorma-autot, rekat ja henkilöautot edullisesti leasing-periaatteella. Räätälöimme tarpeidesi mukaan.",
        keywords: "yrityskalusto, kalustonhallinta, pakettiauto leasing, kuorma-auto leasing, rekka leasing, bulkki tarjous, yritystarjous, kaluston uusiminen, logistiikka-alan ajoneuvot, yritysautot",
        ogTitle: "Yrityskalusto ja kalustonhallinta | Keskitetty ratkaisu yrityksille",
        ogDescription: "Keskitetty ratkaisu yrityksesi koko ajoneuvokaluston hankintaan ja hallintaan. Kuorma-autot, pakettiautot ja henkilöautot yhdellä sopimuksella.",
        ogImage: "https://images.unsplash.com/photo-1601172252975-744c9bd6aa1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Yrityskalusto ja kalustonhallinta | AutoLeasingPro",
        twitterDescription: "Hanki koko yrityskalustosi keskitetysti ja kustannustehokkaasti. Kuorma-autot, pakettiautot ja rekat saman katon alta.",
        twitterImage: "https://images.unsplash.com/photo-1601172252975-744c9bd6aa1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/yrityskalusto",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Yrityskalusto ja ajoneuvohankinnat",
          "description": "Keskitetty ratkaisu yrityksesi koko ajoneuvokaluston hankintaan ja hallintaan.",
          "provider": {
            "@type": "Organization",
            "name": "AutoLeasingPro",
            "url": "https://autoleasingpro.fi"
          },
          "serviceType": "Yrityskaluston leasing-palvelu",
          "areaServed": "Finland",
          "audience": {
            "@type": "BusinessAudience",
            "audienceType": "logistics companies, businesses"
          },
          "offers": {
            "@type": "Offer",
            "description": "Keskitetty ajoneuvojen hankinta ja hallinta yrityksille"
          }
        })
      }
    ];

    for (const setting of seoSettings) {
      const existingSetting = Array.from(this.seoSettings.values()).find(s => s.pageId === setting.pageId);
      if (!existingSetting) {
        this.createSeoSetting(setting);
        console.log(`Luotu oletusarvoinen SEO-asetus sivulle: ${setting.pageId}`);
      }
    }
  }
}

export const storage = new MemStorage();
