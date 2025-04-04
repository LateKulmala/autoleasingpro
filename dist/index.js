var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import session from "express-session";
import createMemoryStore from "memorystore";
var MemStorage = class {
  users;
  leasingOffers;
  quoteRequests;
  quoteOffers;
  fleetRequests;
  seoSettings;
  siteSettings;
  userIdCounter;
  leasingOfferIdCounter;
  quoteRequestIdCounter;
  quoteOfferIdCounter;
  fleetRequestIdCounter;
  seoSettingsIdCounter;
  siteSettingsIdCounter;
  sessionStore;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.leasingOffers = /* @__PURE__ */ new Map();
    this.quoteRequests = /* @__PURE__ */ new Map();
    this.quoteOffers = /* @__PURE__ */ new Map();
    this.fleetRequests = /* @__PURE__ */ new Map();
    this.seoSettings = /* @__PURE__ */ new Map();
    this.siteSettings = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.leasingOfferIdCounter = 1;
    this.quoteRequestIdCounter = 1;
    this.quoteOfferIdCounter = 1;
    this.fleetRequestIdCounter = 1;
    this.seoSettingsIdCounter = 1;
    this.siteSettingsIdCounter = 1;
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // prune expired entries every 24h
    });
    const adminUser = {
      username: "admin",
      password: "SecureAdminPass2023!",
      // More secure password that will be hashed
      name: "Admin User",
      email: "admin@autoleasingpro.fi",
      role: "admin"
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
      createdAt: /* @__PURE__ */ new Date(),
      description: null,
      businessId: null
    });
    this.userIdCounter = 2;
    const providerUser = {
      username: "provider",
      password: "provider123",
      // Will be hashed properly
      name: "Provider Company",
      email: "provider@company.fi",
      company: "Provider Company Oy",
      role: "provider"
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
      createdAt: /* @__PURE__ */ new Date(),
      description: null,
      businessId: null
    });
    this.userIdCounter = 3;
    const customerUser = {
      username: "customer",
      password: "customer123",
      // Will be hashed properly
      name: "Testi Asiakas",
      email: "asiakas@esimerkki.fi",
      role: "customer"
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
      createdAt: /* @__PURE__ */ new Date(),
      description: null,
      businessId: null
    });
    this.userIdCounter = 4;
    this.createSampleLeasingOffers();
    this.createSampleQuoteRequests();
    this.createDefaultSeoSettings();
  }
  createSampleQuoteRequests() {
    const sampleRequests = [
      {
        userId: 3,
        // customer user
        name: "Matti Meik\xE4l\xE4inen",
        email: "matti@example.com",
        phone: "0401234567",
        requestType: "specific",
        leasingType: "private",
        contractLength: 36,
        carBrand: "BMW",
        carModel: "3-sarja",
        carYear: 2023,
        carType: "hybrid",
        annualMileage: 2e4,
        downPayment: 25e4,
        // 2500€
        maxMonthlyPrice: 6e4,
        // 600€
        additionalInfo: "Haluan tumman auton, mielell\xE4\xE4n nahkapenkeill\xE4.",
        termsAccepted: true,
        newsletterSubscription: true
      },
      {
        userId: 3,
        // customer user
        name: "Liisa Virtanen",
        email: "liisa@example.com",
        phone: "0507654321",
        requestType: "general",
        leasingType: "private",
        contractLength: 48,
        carType: "electric",
        annualMileage: 15e3,
        downPayment: 3e5,
        // 3000€
        maxMonthlyPrice: 5e4,
        // 500€
        additionalInfo: "Etsin perheautoa, jossa hyv\xE4 toimintamatka.",
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
        annualMileage: 3e4,
        downPayment: 5e5,
        // 5000€
        additionalInfo: "Tarvitsemme kaksi autoa johtoryhm\xE4lle. Tarjoattehan molemmat samalla sopimuksella.",
        termsAccepted: true,
        newsletterSubscription: false
      }
    ];
    sampleRequests.forEach((request) => this.createQuoteRequest(request));
  }
  createSampleLeasingOffers() {
    const sampleOffers = [
      {
        providerId: 2,
        title: "Audi Q4 e-tron",
        carBrand: "Audi",
        carModel: "Q4 e-tron",
        carYear: 2023,
        carType: "electric",
        monthlyPrice: 69900,
        // in cents, 699€
        contractLength: 36,
        annualMileage: 2e4,
        downPayment: 2e5,
        // in cents, 2000€
        leasingType: "private",
        description: "Tyylik\xE4s s\xE4hk\xF6auto parhailla varusteilla",
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
        monthlyPrice: 74900,
        // in cents, 749€
        contractLength: 48,
        annualMileage: 3e4,
        downPayment: 15e4,
        // in cents, 1500€
        leasingType: "business",
        description: "Laadukas hybridi-SUV yritysk\xE4ytt\xF6\xF6n",
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
        monthlyPrice: 59900,
        // in cents, 599€
        contractLength: 36,
        annualMileage: 15e3,
        downPayment: 3e5,
        // in cents, 3000€
        leasingType: "private",
        description: "Tehokas ja suosittu s\xE4hk\xF6auto",
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
        monthlyPrice: 22900,
        // in cents, 229€
        contractLength: 36,
        annualMileage: 15e3,
        downPayment: 1e5,
        // in cents, 1000€
        leasingType: "private",
        description: "Taloudellinen ja luotettava ensiauto. Pieni kulutus, pieni kuukausier\xE4.",
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
        monthlyPrice: 44900,
        // in cents, 449€
        contractLength: 48,
        annualMileage: 3e4,
        downPayment: 25e4,
        // in cents, 2500€
        leasingType: "business",
        description: "K\xE4yt\xE4nn\xF6llinen ja luotettava pakettiauto yritysk\xE4ytt\xF6\xF6n.",
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
        monthlyPrice: 49900,
        // in cents, 499€
        contractLength: 36,
        annualMileage: 2e4,
        downPayment: 2e5,
        // in cents, 2000€
        leasingType: "private",
        description: "Luotettava ja v\xE4h\xE4n kuluttava hybridi SUV perheille.",
        imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80",
        active: true
      }
    ];
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
    sampleOffers.forEach((offer) => this.createLeasingOffer(offer));
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  async updateUser(id, userData) {
    const user = this.users.get(id);
    if (!user) return void 0;
    const { id: _, role: __, ...safeUserData } = userData;
    const updatedUser = { ...user, ...safeUserData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  async createUser(user) {
    const id = this.userIdCounter++;
    const role = user.role || "customer";
    const phone = user.phone === void 0 ? null : user.phone;
    const company = user.company === void 0 ? null : user.company;
    const newsletterSubscription = user.newsletterSubscription === void 0 ? true : user.newsletterSubscription;
    const offerNotifications = user.offerNotifications === void 0 ? true : user.offerNotifications;
    const reminderNotifications = user.reminderNotifications === void 0 ? true : user.reminderNotifications;
    const newUser = {
      ...user,
      id,
      role,
      phone,
      company,
      newsletterSubscription,
      offerNotifications,
      reminderNotifications,
      verified: role === "provider" ? false : true,
      // Providers need verification
      createdAt: /* @__PURE__ */ new Date(),
      description: user.description || null,
      businessId: user.businessId || null
    };
    this.users.set(id, newUser);
    return newUser;
  }
  async getUsers() {
    return Array.from(this.users.values());
  }
  // Leasing offer operations
  async getLeasingOffer(id) {
    return this.leasingOffers.get(id);
  }
  async getLeasingOffers(filters) {
    let offers = Array.from(this.leasingOffers.values());
    if (filters) {
      offers = offers.filter((offer) => {
        for (const [key, value] of Object.entries(filters)) {
          if (value === void 0) continue;
          if (offer[key] !== value) return false;
        }
        return true;
      });
    }
    return offers;
  }
  async getLeasingOffersByProvider(providerId) {
    return Array.from(this.leasingOffers.values()).filter(
      (offer) => offer.providerId === providerId
    );
  }
  async createLeasingOffer(offer) {
    const id = this.leasingOfferIdCounter++;
    const description = offer.description === void 0 ? null : offer.description;
    const imageUrl = offer.imageUrl === void 0 ? null : offer.imageUrl;
    const active = offer.active === void 0 ? true : offer.active;
    const featured = offer.featured === void 0 ? false : offer.featured;
    const newOffer = {
      ...offer,
      id,
      description,
      imageUrl,
      active,
      featured,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.leasingOffers.set(id, newOffer);
    return newOffer;
  }
  async updateLeasingOffer(id, offerData) {
    const offer = this.leasingOffers.get(id);
    if (!offer) return void 0;
    const updatedOffer = { ...offer, ...offerData };
    this.leasingOffers.set(id, updatedOffer);
    return updatedOffer;
  }
  async deleteLeasingOffer(id) {
    return this.leasingOffers.delete(id);
  }
  // Quote request operations
  async getQuoteRequest(id) {
    return this.quoteRequests.get(id);
  }
  async getQuoteRequests(filters) {
    let requests = Array.from(this.quoteRequests.values());
    if (filters) {
      requests = requests.filter((request) => {
        for (const [key, value] of Object.entries(filters)) {
          if (value === void 0) continue;
          if (request[key] !== value) return false;
        }
        return true;
      });
    }
    return requests;
  }
  async getQuoteRequestsByUser(userId) {
    return Array.from(this.quoteRequests.values()).filter(
      (request) => request.userId === userId
    );
  }
  async createQuoteRequest(request) {
    const id = this.quoteRequestIdCounter++;
    const company = request.company === void 0 ? null : request.company;
    const carBrand = request.carBrand === void 0 ? null : request.carBrand;
    const carModel = request.carModel === void 0 ? null : request.carModel;
    const carYear = request.carYear === void 0 ? null : request.carYear;
    const carType = request.carType === void 0 ? null : request.carType;
    const maxMonthlyPrice = request.maxMonthlyPrice === void 0 ? null : request.maxMonthlyPrice;
    const downPayment = request.downPayment === void 0 ? null : request.downPayment;
    const additionalInfo = request.additionalInfo === void 0 ? null : request.additionalInfo;
    const userId = request.userId === void 0 ? null : request.userId;
    const newRequest = {
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
      createdAt: /* @__PURE__ */ new Date(),
      newsletterSubscription: request.newsletterSubscription || null
    };
    this.quoteRequests.set(id, newRequest);
    return newRequest;
  }
  async updateQuoteRequest(id, requestData) {
    const request = this.quoteRequests.get(id);
    if (!request) return void 0;
    const updatedRequest = { ...request, ...requestData };
    this.quoteRequests.set(id, updatedRequest);
    return updatedRequest;
  }
  // Quote offer operations
  async getQuoteOffer(id) {
    return this.quoteOffers.get(id);
  }
  async getQuoteOffers(filters) {
    let offers = Array.from(this.quoteOffers.values());
    if (filters) {
      offers = offers.filter((offer) => {
        for (const [key, value] of Object.entries(filters)) {
          if (value === void 0) continue;
          if (offer[key] !== value) return false;
        }
        return true;
      });
    }
    return offers;
  }
  async getQuoteOffersByRequest(requestId) {
    return Array.from(this.quoteOffers.values()).filter(
      (offer) => offer.quoteRequestId === requestId
    );
  }
  async getQuoteOffersByProvider(providerId) {
    return Array.from(this.quoteOffers.values()).filter(
      (offer) => offer.providerId === providerId
    );
  }
  async createQuoteOffer(offer) {
    const id = this.quoteOfferIdCounter++;
    const description = offer.description === void 0 ? null : offer.description;
    const newOffer = {
      ...offer,
      id,
      description,
      status: "pending",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.quoteOffers.set(id, newOffer);
    return newOffer;
  }
  async updateQuoteOffer(id, offerData) {
    const offer = this.quoteOffers.get(id);
    if (!offer) return void 0;
    const updatedOffer = { ...offer, ...offerData };
    this.quoteOffers.set(id, updatedOffer);
    return updatedOffer;
  }
  // Fleet request operations (yrityskalusto)
  async getFleetRequest(id) {
    return this.fleetRequests.get(id);
  }
  async getFleetRequests(filters) {
    let requests = Array.from(this.fleetRequests.values());
    if (filters) {
      requests = requests.filter((request) => {
        for (const [key, value] of Object.entries(filters)) {
          if (value === void 0) continue;
          if (request[key] !== value) return false;
        }
        return true;
      });
    }
    return requests;
  }
  async getFleetRequestsByUser(userId) {
    return Array.from(this.fleetRequests.values()).filter(
      (request) => request.userId === userId
    );
  }
  async createFleetRequest(request) {
    const id = this.fleetRequestIdCounter++;
    const userId = request.userId === void 0 ? null : request.userId;
    const deliveryTime = request.deliveryTime === void 0 ? null : request.deliveryTime;
    const message = request.message === void 0 ? null : request.message;
    const preferredCallback = request.preferredCallback === void 0 ? "email" : request.preferredCallback;
    const newRequest = {
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
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.fleetRequests.set(id, newRequest);
    return newRequest;
  }
  async updateFleetRequest(id, requestData) {
    const request = this.fleetRequests.get(id);
    if (!request) return void 0;
    const updatedRequest = {
      ...request,
      ...requestData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.fleetRequests.set(id, updatedRequest);
    return updatedRequest;
  }
  async deleteFleetRequest(id) {
    return this.fleetRequests.delete(id);
  }
  // SEO Settings operations
  async getSeoSetting(id) {
    return this.seoSettings.get(id);
  }
  async getSeoSettingByPageId(pageId) {
    return Array.from(this.seoSettings.values()).find(
      (setting) => setting.pageId === pageId
    );
  }
  async getSeoSettings() {
    return Array.from(this.seoSettings.values());
  }
  async createSeoSetting(setting) {
    const id = this.seoSettingsIdCounter++;
    const keywords = setting.keywords === void 0 ? null : setting.keywords;
    const ogTitle = setting.ogTitle === void 0 ? null : setting.ogTitle;
    const ogDescription = setting.ogDescription === void 0 ? null : setting.ogDescription;
    const ogImage = setting.ogImage === void 0 ? null : setting.ogImage;
    const twitterTitle = setting.twitterTitle === void 0 ? null : setting.twitterTitle;
    const twitterDescription = setting.twitterDescription === void 0 ? null : setting.twitterDescription;
    const twitterImage = setting.twitterImage === void 0 ? null : setting.twitterImage;
    const canonicalUrl = setting.canonicalUrl === void 0 ? null : setting.canonicalUrl;
    const structuredData = setting.structuredData === void 0 ? null : setting.structuredData;
    const newSetting = {
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
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.seoSettings.set(id, newSetting);
    return newSetting;
  }
  async updateSeoSetting(id, settingData) {
    const setting = this.seoSettings.get(id);
    if (!setting) return void 0;
    const updatedSetting = {
      ...setting,
      ...settingData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.seoSettings.set(id, updatedSetting);
    return updatedSetting;
  }
  async deleteSeoSetting(id) {
    return this.seoSettings.delete(id);
  }
  // Site Settings operations
  async getSiteSetting(id) {
    return this.siteSettings.get(id);
  }
  async getSiteSettingByKey(key) {
    return Array.from(this.siteSettings.values()).find(
      (setting) => setting.settingKey === key
    );
  }
  async getSiteSettings(group) {
    const settings = Array.from(this.siteSettings.values());
    if (group) {
      return settings.filter((setting) => setting.settingGroup === group);
    }
    return settings;
  }
  async getPublicSiteSettings() {
    return Array.from(this.siteSettings.values()).filter(
      (setting) => setting.isPublic === true
    );
  }
  async createSiteSetting(setting) {
    const id = this.siteSettingsIdCounter++;
    const description = setting.description === void 0 ? null : setting.description;
    const isPublic = setting.isPublic === void 0 ? false : setting.isPublic;
    const newSetting = {
      ...setting,
      id,
      description,
      isPublic,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.siteSettings.set(id, newSetting);
    return newSetting;
  }
  async updateSiteSetting(id, settingData) {
    const setting = this.siteSettings.get(id);
    if (!setting) return void 0;
    const updatedSetting = {
      ...setting,
      ...settingData,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.siteSettings.set(id, updatedSetting);
    return updatedSetting;
  }
  async deleteSiteSetting(id) {
    return this.siteSettings.delete(id);
  }
  createDefaultSeoSettings() {
    const seoSettings2 = [
      {
        pageId: "home",
        title: "AutoLeasingPro | Helpoin tapa L\xD6YT\xC4\xC4 LEASING AUTO | Autojen kilpailutus",
        description: "L\xF6yd\xE4 edullisin leasing auto helposti ja nopeasti. Autojen kilpailutus yhdell\xE4 lomakkeella s\xE4\xE4st\xE4\xE4 aikaasi. Vertaile yksityis-, yritys- ja rahoitusleasing vaihtoehtoja Suomen kattavimmasta palvelusta.",
        keywords: "leasing auto, autojen kilpailutus, auton leasing vertailu, edullisin leasing, leasing tarjoukset, yritysleasing, yksityisleasing, rahoitusleasing, vertaa leasing-sopimuksia, halvat leasing-autot, leasing-tarjousten vertailu, autojen leasing-kilpailutus, leasing-hintavertailu, leasing-sopimus yritykselle, helppo autojen kilpailutus, nopea leasing-vertailu, henkil\xF6autojen leasing, leasing ilman k\xE4sirahaa, joustavat leasing-ehdot, leasing-sopimuksen kilpailutus, s\xE4hk\xF6auton leasing, hybridiauton leasing, autojen leasing-markkinapaikka, leasing-haku, perheleasing, premium auton leasing, leasing-vertailuty\xF6kalu, autoleasing Suomessa, autorahoitusvertailu, yritykselle auto edullisesti",
        ogTitle: "AutoLeasingPro - Helpoin tapa l\xF6yt\xE4\xE4 edullisin leasing auto | Autojen kilpailutus",
        ogDescription: "Kilpailuta leasing-autosi helposti ja l\xF6yd\xE4 paras sopimus. Vertaa yksityis-, yritys- ja rahoitusleasing-tarjouksia Suomen kattavimmasta palvelusta. S\xE4\xE4st\xE4 aikaa ja rahaa.",
        ogImage: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "AutoLeasingPro - Leasing-autojen kilpailutus | Edullisin leasing",
        twitterDescription: "L\xF6yd\xE4 leasing auto helposti kilpailuttamalla. Vertaile Suomen parhaat tarjoukset yhdest\xE4 paikasta ja s\xE4\xE4st\xE4 jopa 30% leasing-kustannuksissa.",
        twitterImage: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "AutoLeasingPro - Autojen leasing-kilpailutus",
          "url": "https://autoleasingpro.fi",
          "description": "Suomen kattavin leasing-autojen vertailupalvelu. Kilpailuta autot ja saa parhaat tarjoukset yhdell\xE4 hakemuksella.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://autoleasingpro.fi/haku?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })
      },
      {
        pageId: "leasing-laskuri",
        title: "Leasing-laskuri | Laske Autoleasing-kustannukset | Teko\xE4lysuositukset",
        description: "K\xE4yt\xE4 teko\xE4lypohjaista leasing-laskuria ja l\xF6yd\xE4 juuri sinulle sopivat autot. Laske leasing-kustannukset, vertaile autoja ja pyyd\xE4 tarjouksia yhdess\xE4 paikassa.",
        keywords: "leasing-laskuri, autoleasing laskuri, auto laskuri, teko\xE4lylaskuri, leasing-kustannuslaskuri, auton hinta laskuri, leasing-vertailulaskuri, leasing-kuukausimaksu laskuri, leasing-auto kalkulaattori, leasing-budjetti, auto teko\xE4lysuositukset, leasing-kalkulaattori, leasing-sopimus laskuri, autoleasing-hintalaskuri, vertaile autoja, leasing-hintalaskelma, leasing-rahoituslaskuri, autosuosittelija, autovertailu, auto kustannuslaskuri, leasing-tarjouslaskuri, leasing-sopimusvertailu, halvin leasing-auto, edullisin leasing, leasing-hintavertailu, henkil\xF6auton leasing-laskuri",
        ogTitle: "Teko\xE4lypohjainen leasing-laskuri ja autosuosittelija | AutoLeasingPro",
        ogDescription: "Laske autoleasing-kustannukset ja l\xF6yd\xE4 parhaat autovaihtoehdot teko\xE4lysuosituksilla. Kokeile ilmaiseksi ja s\xE4\xE4st\xE4 aikaa auton etsinn\xE4ss\xE4.",
        ogImage: "https://images.unsplash.com/photo-1563990315362-93277dc5c0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Teko\xE4lylaskuri autoleasing | L\xF6yd\xE4 t\xE4ydellinen auto budjettiin",
        twitterDescription: "Laske autoleasing-kustannukset ja katso r\xE4\xE4t\xE4l\xF6idyt teko\xE4lysuositukset. Helpoin tapa l\xF6yt\xE4\xE4 sopiva auto juuri sinun tarpeisiisi.",
        twitterImage: "https://images.unsplash.com/photo-1563990315362-93277dc5c0ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/leasing-laskuri",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "AutoLeasingPro Leasing-laskuri",
          "url": "https://autoleasingpro.fi/leasing-laskuri",
          "description": "Teko\xE4lypohjainen laskuri leasing-kuukausimaksujen arviointiin ja autosuosituksiin.",
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
        title: "Vertaa leasing-sopimuksia | Halvat leasing-autot | S\xE4hk\xF6auton leasing",
        description: "Selaa ja vertaile edullisin leasing-sopimuksia. L\xF6yd\xE4 halvat leasing-autot helposti - s\xE4hk\xF6autot, hybridit, bensa- ja dieselmallit. Yksityis-, yritys- ja rahoitusleasing.",
        keywords: "vertaa leasing-sopimuksia, halvat leasing-autot, edullisin leasing, leasing-hintavertailu, s\xE4hk\xF6auton leasing, hybridiauton leasing, leasing ilman k\xE4sirahaa, yritysleasing, yksityisleasing, rahoitusleasing, henkil\xF6autojen leasing, premium auton leasing, perheleasing, joustavat leasing-ehdot, leasing-tarjoukset, autojen leasing, autojen kilpailutus, leasing-sopimus yritykselle, auton leasing vertailu",
        ogTitle: "Vertaa leasing-sopimuksia - L\xF6yd\xE4 edullisin leasing-auto",
        ogDescription: "Selaa laajaa valikoimaa leasing-autoja eri hintakategorioissa. L\xF6yd\xE4 edullisimmat s\xE4hk\xF6autot, hybridiautot ja perinteiset autot. Leasing ilman k\xE4sirahaa tai joustavilla ehdoilla.",
        ogImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Vertaa leasing-autoja | Edullisin leasing-sopimus | S\xE4hk\xF6autot",
        twitterDescription: "Selaa ja l\xF6yd\xE4 halvat leasing-autot nopeasti - s\xE4hk\xF6autot, hybridit ja perinteiset mallit yhdess\xE4 paikassa. Vertaa ja s\xE4\xE4st\xE4.",
        twitterImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/offers",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Leasing-tarjoukset ja paketit",
          "description": "Suomen parhaat leasing-tarjoukset autoille - s\xE4hk\xF6autot, hybridit ja perinteiset autot.",
          "url": "https://autoleasingpro.fi/offers",
          "numberOfItems": 10,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "S\xE4hk\xF6auton leasing",
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
        description: "Kilpailuta auto - t\xE4yt\xE4 yksi lomake ja vastaanota useita tarjouksia. Nopea leasing-vertailu s\xE4\xE4st\xE4\xE4 aikaasi ja rahaa. Leasing ilman k\xE4sirahaa, edullisin leasing yritykselle ja yksityisille.",
        keywords: "autojen kilpailutus, leasing-hintavertailu, edullisin leasing, nopea leasing-vertailu, leasing-sopimuksen kilpailutus, helppo autojen kilpailutus, leasing-tarjousten vertailu, autojen leasing-kilpailutus, leasing-vertailuty\xF6kalu, yritykselle auto edullisesti, leasing ilman k\xE4sirahaa, premium auton leasing, s\xE4hk\xF6auton leasing, hybridiauton leasing, joustavat leasing-ehdot, auton leasing vertailu, leasing-haku, yritysleasing, yksityisleasing, rahoitusleasing",
        ogTitle: "Kilpailuta autot helposti - Nopea leasing-hintavertailu",
        ogDescription: "S\xE4\xE4st\xE4 jopa 30% autojen leasing-kustannuksissa. T\xE4yt\xE4 yksi lomake ja vastaanota useita kilpailevia tarjouksia. Helpoin tapa l\xF6yt\xE4\xE4 edullisin leasing-auto yritykselle tai yksityiselle.",
        ogImage: "https://images.unsplash.com/photo-1560438718-eb61ede255eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Autojen kilpailutus | Nopea leasing-hintavertailu",
        twitterDescription: "Kilpailuta autot - s\xE4\xE4st\xE4 aikaa ja rahaa. T\xE4yt\xE4 yksi lomake ja saat useilta toimijoilta parhaat tarjoukset.",
        twitterImage: "https://images.unsplash.com/photo-1560438718-eb61ede255eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/request",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "AutoLeasingPro - Autojen kilpailutuspalvelu",
          "description": "Kilpailuta leasing-autosi helposti ja l\xF6yd\xE4 edullisin sopimus. Yksi lomake, monta tarjousta.",
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
        title: "Kirjaudu sis\xE4\xE4n | AutoLeasingPro",
        description: "Kirjaudu AutoLeasingPro-tilillesi tai rekister\xF6idy uudeksi k\xE4ytt\xE4j\xE4ksi. Hallinnoi tarjouspyynt\xF6j\xE4 ja leasing-sopimuksia.",
        keywords: "kirjaudu, rekister\xF6idy, autoleasing tili, leasing palvelu kirjautuminen",
        ogTitle: "Kirjaudu sis\xE4\xE4n AutoLeasingPro-palveluun",
        ogDescription: "Hallinnoi autoleasing-tarjouksia, tarjouspyynt\xF6j\xE4 ja sopimuksia helposti yhdest\xE4 paikasta.",
        ogImage: "https://images.unsplash.com/photo-1517153295259-74eb0b416cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Kirjaudu sis\xE4\xE4n | AutoLeasingPro",
        twitterDescription: "Hallinnoi leasing-tarjouksia ja tarjouspyynt\xF6j\xE4 tilisi kautta",
        twitterImage: "https://images.unsplash.com/photo-1517153295259-74eb0b416cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/auth"
      },
      {
        pageId: "profile",
        title: "K\xE4ytt\xE4j\xE4profiili | AutoLeasingPro",
        description: "Hallinnoi k\xE4ytt\xE4j\xE4profiiliasi, tarjouspyynt\xF6j\xE4 ja vastaanotettuoja tarjouksia AutoLeasingPro-palvelussa.",
        keywords: "k\xE4ytt\xE4j\xE4profiili, leasing tarjoukset, leasing tarjouspyynn\xF6t, autoleasing hallinta",
        ogTitle: "Hallinnoi leasing-palvelujasi",
        ogDescription: "K\xE4ytt\xE4j\xE4profiilissa voit hallita tarjouspyynt\xF6j\xE4, tarkastella tarjouksia ja p\xE4ivitt\xE4\xE4 tietojasi.",
        ogImage: "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "K\xE4ytt\xE4j\xE4profiili | AutoLeasingPro",
        twitterDescription: "Hallinnoi leasing-sopimuksiasi ja tarjouspyynt\xF6j\xE4si",
        twitterImage: "https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/profile"
      },
      {
        pageId: "provider-register",
        title: "Liity autoleasing-tarjoajaksi | Leasing-yrityksen markkinapaikka | AutoLeasingPro",
        description: "Liity autojen leasing-markkinapaikkaan ja tavoita asiakkaat, jotka etsiv\xE4t leasing-autoja. Kasvata leasing-liiketoimintaasi Suomen suosituimmalla autojen vertailupalvelulla.",
        keywords: "autojen leasing-markkinapaikka, autoleasing-tarjoaja, leasing-yritys rekister\xF6inti, leasing-yrityksen rekister\xF6ityminen, autojen leasing-kilpailutus, leasing-tarjousten vertailu, yritysleasing, rahoitusleasing, yksityisleasing, autojen leasing, leasing-sopimus yritykselle, leasing-hintavertailu, leasing-vertailuty\xF6kalu, autoleasing Suomessa",
        ogTitle: "Liity autoleasing-markkinapaikkaan | Kasvata liiketoimintaasi",
        ogDescription: "Tavoita autojen leasing-asiakkaat ja kasvata liiketoimintaasi. Tuo tarjoukset AutoLeasingPro-markkinapaikkaan ja tavoita sek\xE4 yritys- ett\xE4 kuluttaja-asiakkaat.",
        ogImage: "https://images.unsplash.com/photo-1560438718-eb61ede255eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Liity autojen leasing-markkinapaikkaan | AutoLeasingPro",
        twitterDescription: "Kasvata leasing-liiketoimintaasi - tavoita yritykset ja kuluttajat jotka etsiv\xE4t parhaita leasing-vaihtoehtoja",
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
        description: "Tietoa AutoLeasingPro-palvelusta ja yrityksest\xE4mme. Tutustu toimintaamme, arvoihimme sek\xE4 visioomme autojen leasing-vertailun helpottamiseksi.",
        keywords: "tietoa autoleasingpro, autoleasing yritys, autojen leasing-vertailu, leasing-palvelu, autojen kilpailutus, leasing-hintavertailu, autoleasing Suomessa",
        ogTitle: "Tietoa AutoLeasingPro-palvelusta | Suomen johtava autojen leasing-vertailupalvelu",
        ogDescription: "AutoLeasingPro on Suomen johtava autojen leasing-vertailupalvelu, jonka tavoitteena on tehd\xE4 autojen leasing-sopimuksen hankkimisesta mahdollisimman helppoa ja edullista.",
        ogImage: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Tietoa AutoLeasingPro-palvelusta | Autojen leasing-vertailu",
        twitterDescription: "Tutustu Suomen johtavaan autojen leasing-vertailupalveluun. AutoLeasingPro auttaa l\xF6yt\xE4m\xE4\xE4n juuri sinulle tai yrityksellesi sopivan leasing-auton.",
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
        title: "Leasing-opas | Kaikki mit\xE4 sinun tulee tiet\xE4\xE4 autojen leasingista",
        description: "Kattava opas autojen leasingista. Tutustu leasing-eri vaihtoehtoihin, sopimusehtoihin ja s\xE4\xE4st\xF6vinkkeihin.",
        keywords: "leasing-opas, autojen leasing, yksityisleasing, yritysleasing, rahoitusleasing, leasing-sopimus, leasing-vinkit, leasing auton valinta, leasing kilpailutus, leasing-hintavertailu",
        ogTitle: "Leasing-opas | Kaikki mit\xE4 sinun tulee tiet\xE4\xE4 autojen leasingista",
        ogDescription: "Tutustu autojen leasingin eri muotoihin, vaihtoehtoihin ja s\xE4\xE4st\xF6vinkkeihin. Kattava leasing-opas auttaa l\xF6yt\xE4m\xE4\xE4n parhaan vaihtoehdon.",
        ogImage: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Leasing-opas | Autoilun uusi suunta - Leasingin vaihtoehdot ja vinkit",
        twitterDescription: "Kattava opas autojen leasingista. Vertaile eri vaihtoehtoja ja l\xF6yd\xE4 paras ratkaisu autoilun tarpeisiisi.",
        twitterImage: "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/leasing-opas",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Kattava Leasing-opas - Kaikki mit\xE4 sinun tulee tiet\xE4\xE4 autojen leasingista",
          "description": "Opas autojen leasingin eri muotoihin, vaihtoehtoihin ja s\xE4\xE4st\xF6vinkkeihin. Vertaile eri vaihtoehtoja ja l\xF6yd\xE4 paras ratkaisu.",
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
        title: "Yksityisleasing | Henkil\xF6auton leasing yksityishenkil\xF6ille",
        description: "Yksityisleasing on joustava tapa hankkia auto yksityishenkil\xF6ille. Tutustu etuihin, rahoitusratkaisuihin ja vinkkeihin parhaan sopimuksen l\xF6yt\xE4miseksi.",
        keywords: "yksityisleasing, yksityishenkil\xF6n leasing, henkil\xF6auton leasing, leasing sopimus, auto leasing yksityisille, leasing ilman k\xE4sirahaa, edullinen leasing, henkil\xF6autojen leasing",
        ogTitle: "Yksityisleasing - Henkil\xF6auton leasing yksityishenkil\xF6ille",
        ogDescription: "Yksityisleasing on moderni tapa hankkia auto k\xE4ytt\xF6\xF6si ilman omistamisen huolia. Kiinte\xE4 kuukausimaksu ja huolettomuus. Lue lis\xE4\xE4!",
        ogImage: "https://images.unsplash.com/photo-1558400566-0228f94d372b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Yksityisleasing | Joustavaa autoilua ilman omistushuolia",
        twitterDescription: "Tutustu yksityisleasingin etuihin: ei j\xE4lleenmyyntihuolia, kiinte\xE4t kuukausikulut, huoletonta autoilua.",
        twitterImage: "https://images.unsplash.com/photo-1558400566-0228f94d372b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/yksityisleasing",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Mit\xE4 yksityisleasing tarkoittaa?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yksityisleasing on henkil\xF6kohtainen auton pitk\xE4aikaisvuokraus, jossa maksat kiinte\xE4\xE4 kuukausimaksua auton k\xE4yt\xF6st\xE4 tietyn sopimusajan, yleens\xE4 24-60 kuukauden ajan. Toisin kuin auton ostamisessa, sinun ei tarvitse sitoa suuria p\xE4\xE4omia tai huolehtia j\xE4lleenmyyntiarvon laskusta."
              }
            },
            {
              "@type": "Question",
              "name": "Sis\xE4ltyv\xE4tk\xF6 huollot ja vakuutukset yksityisleasingiin?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Useimmiten kyll\xE4. Tyypillisesti yksityisleasingsopimukseen kuuluu huolto- ja korjauspalvelut sek\xE4 kattava kaskovakuutus. Tarkista kuitenkin aina vakuutuksen sis\xE4lt\xF6 ja omavastuut sopimuksesta."
              }
            },
            {
              "@type": "Question",
              "name": "Voiko leasingautoa lunastaa itselleen?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yksityisleasingissa se ei yleens\xE4 ole mahdollista. Rahoitusleasingissa auton lunastusmahdollisuus on tavallisempi. Tarkista sopimuksen ehdot."
              }
            }
          ]
        })
      },
      {
        pageId: "yritysleasing",
        title: "Yritysleasing | Yritykselle auto edullisesti ja veroetuja",
        description: "Yritysleasing on joustava ja kustannustehokas tapa hankkia autoja yritykselle. Tutustu verotusetuihin, kirjanpidollisiin hy\xF6tyihin ja erilaisiin leasing-vaihtoehtoihin.",
        keywords: "yritysleasing, yritykselle auto, leasing yritykselle, yritysautojen leasing, yrityksen autoetu, leasing-auto alv, leasing-sopimus yritykselle, leasing-hintavertailu, yritykselle auto edullisesti",
        ogTitle: "Yritysleasing - Yritykselle auto kustannustehokkaasti",
        ogDescription: "Yritysleasing tarjoaa merkitt\xE4vi\xE4 veroetuja ja vapauttaa p\xE4\xE4omaa muuhun liiketoimintaan. Kustannustehokas tapa hallinnoida yrityksen autokantaa.",
        ogImage: "https://images.unsplash.com/photo-1530685932526-378f58335fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Yritysleasing | ALV-v\xE4hennys ja kirjanpitoedut autoissa",
        twitterDescription: "Yritysleasing on kustannustehokas tapa j\xE4rjest\xE4\xE4 yrityksen autoilu. Tutustu veroetuihin ja tasevaikutuksiin.",
        twitterImage: "https://images.unsplash.com/photo-1530685932526-378f58335fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/yritysleasing",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Mit\xE4 veroetuja yritysleasing tarjoaa?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yritysleasingissa autoon liittyv\xE4 arvonlis\xE4vero on v\xE4hennyskelpoinen (24%), mik\xE4 ei ole mahdollista ostetuissa autoissa. Lis\xE4ksi leasing-maksut ovat kokonaisuudessaan v\xE4hennyskelpoisia yrityksen kirjanpidossa."
              }
            },
            {
              "@type": "Question",
              "name": "Miten yritysleasing vaikuttaa yrityksen taseeseen?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Leasing-autot eiv\xE4t n\xE4y yrityksen taseessa, mik\xE4 parantaa p\xE4\xE4oman tuottoprosenttia ja muita taloudellisia tunnuslukuja. Kyseess\xE4 on taseen ulkopuolinen rahoitus."
              }
            },
            {
              "@type": "Question",
              "name": "Sopiiko yritysleasing my\xF6s pienille yrityksille?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Kyll\xE4, yritysleasing sopii kaikenkokoisille yrityksille. Se vapauttaa p\xE4\xE4omaa muuhun liiketoimintaan, tekee autoilun kustannuksista ennakoitavia ja poistaa riskin auton j\xE4lleenmyyntiarvon laskusta."
              }
            }
          ]
        })
      },
      {
        pageId: "rahoitusleasing",
        title: "Rahoitusleasing | Auto k\xE4ytt\xF6\xF6n ja mahdollisuus lunastukseen",
        description: "Rahoitusleasing on joustava tapa hankkia auto k\xE4ytt\xF6\xF6n ja mahdollisuus lunastaa se sopimuskauden p\xE4\xE4ttyess\xE4. Tutustu rahoitusleasingin etuihin ja ehtoihin.",
        keywords: "rahoitusleasing, auto rahoitusleasing, leasing auton lunastus, rahoitusleasing yritykselle, rahoitusleasing yksityiselle, auton rahoitusvaihtoehdot, leasing-hintavertailu, edullinen leasing",
        ogTitle: "Rahoitusleasing - Joustava autorahoitus lunastusmahdollisuudella",
        ogDescription: "Rahoitusleasing tarjoaa edullisemman kuukausimaksun ja mahdollisuuden lunastaa auto itsellesi sopimuskauden p\xE4\xE4ttyess\xE4. Tutustu rahoitusleasingin etuihin.",
        ogImage: "https://images.unsplash.com/photo-1551952238-2315a31e1f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        twitterTitle: "Rahoitusleasing | Joustava autorahoitus lunastusmahdollisuudella",
        twitterDescription: "Rahoitusleasing soveltuu sek\xE4 yrityksille ett\xE4 yksityishenkil\xF6ille. Edullisempi vaihtoehto auton hankintaan lunastusvaihtoehdolla.",
        twitterImage: "https://images.unsplash.com/photo-1551952238-2315a31e1f43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        canonicalUrl: "https://autoleasingpro.fi/rahoitusleasing",
        structuredData: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Mit\xE4 rahoitusleasing tarkoittaa?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Rahoitusleasing on autorahoituksen muoto, jossa auton hankkii rahoitusyhti\xF6, mutta asiakas tekee sopimuksen auton k\xE4yt\xF6st\xE4 sovituksi m\xE4\xE4r\xE4ajaksi. Sopimuskauden p\xE4\xE4ttyess\xE4 asiakkaalla on usein mahdollisuus lunastaa auto itselleen."
              }
            },
            {
              "@type": "Question",
              "name": "Miten rahoitusleasing eroaa huoltoleasingista?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Toisin kuin huoltoleasingissa (yksityis- ja yritysleasing), rahoitusleasingissa asiakas vastaa itse auton huolloista, korjauksista ja muista k\xE4ytt\xF6kuluista. T\xE4m\xE4n vuoksi kuukausimaksut ovat yleens\xE4 edullisemmat."
              }
            },
            {
              "@type": "Question",
              "name": "Kenelle rahoitusleasing sopii?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Rahoitusleasing sopii sek\xE4 yksityishenkil\xF6ille ett\xE4 yrityksille, jotka haluavat joustavuutta auton hankintaan, mutta my\xF6s mahdollisuuden auton lopulliseen omistamiseen. Se on hyv\xE4 vaihtoehto, jos haluat alhaisemman kuukausimaksun ja olet valmis vastaamaan itse auton huolto- ja korjauskuluista."
              }
            }
          ]
        })
      },
      {
        pageId: "yrityskalusto",
        title: "Yrityskalusto ja kalustonhallinta | AutoLeasingPro",
        description: "Pyyd\xE4 tarjous yrityskalustosta. Hanki paketti- ja kuorma-autot, rekat ja henkil\xF6autot edullisesti leasing-periaatteella. R\xE4\xE4t\xE4l\xF6imme tarpeidesi mukaan.",
        keywords: "yrityskalusto, kalustonhallinta, pakettiauto leasing, kuorma-auto leasing, rekka leasing, bulkki tarjous, yritystarjous, kaluston uusiminen, logistiikka-alan ajoneuvot, yritysautot",
        ogTitle: "Yrityskalusto ja kalustonhallinta | Keskitetty ratkaisu yrityksille",
        ogDescription: "Keskitetty ratkaisu yrityksesi koko ajoneuvokaluston hankintaan ja hallintaan. Kuorma-autot, pakettiautot ja henkil\xF6autot yhdell\xE4 sopimuksella.",
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
    for (const setting of seoSettings2) {
      const existingSetting = Array.from(this.seoSettings.values()).find((s) => s.pageId === setting.pageId);
      if (!existingSetting) {
        this.createSeoSetting(setting);
        console.log(`Luotu oletusarvoinen SEO-asetus sivulle: ${setting.pageId}`);
      }
    }
  }
};
var storage = new MemStorage();

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  fleetRequests: () => fleetRequests,
  insertFleetRequestSchema: () => insertFleetRequestSchema,
  insertLeasingOfferSchema: () => insertLeasingOfferSchema,
  insertQuoteOfferSchema: () => insertQuoteOfferSchema,
  insertQuoteRequestSchema: () => insertQuoteRequestSchema,
  insertSeoSettingsSchema: () => insertSeoSettingsSchema,
  insertSiteSettingsSchema: () => insertSiteSettingsSchema,
  insertUserSchema: () => insertUserSchema,
  leasingOffers: () => leasingOffers,
  quoteOffers: () => quoteOffers,
  quoteRequests: () => quoteRequests,
  seoSettings: () => seoSettings,
  siteSettings: () => siteSettings,
  users: () => users
});
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  role: text("role").notNull().default("customer"),
  // customer, provider, admin
  verified: boolean("verified").default(false),
  // Used for provider verification by admins
  businessId: text("business_id"),
  // Y-tunnus for providers
  description: text("description"),
  // Company description for providers
  newsletterSubscription: boolean("newsletter_subscription").default(true),
  offerNotifications: boolean("offer_notifications").default(true),
  // Notifications for new offers
  reminderNotifications: boolean("reminder_notifications").default(true),
  // Reminders
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var leasingOffers = pgTable("leasing_offers", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  title: text("title").notNull(),
  carBrand: text("car_brand").notNull(),
  carModel: text("car_model").notNull(),
  carYear: integer("car_year").notNull(),
  carType: text("car_type").notNull(),
  // e.g., electric, hybrid, gasoline, diesel
  monthlyPrice: integer("monthly_price").notNull(),
  contractLength: integer("contract_length").notNull(),
  // in months
  annualMileage: integer("annual_mileage").notNull(),
  downPayment: integer("down_payment").notNull(),
  leasingType: text("leasing_type").notNull(),
  // private, business, financial
  description: text("description"),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  active: boolean("active").default(true)
});
var insertLeasingOfferSchema = createInsertSchema(leasingOffers).omit({
  id: true,
  createdAt: true
});
var quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  requestType: text("request_type").notNull(),
  // specific, general
  leasingType: text("leasing_type").notNull(),
  // private, business, financial
  contractLength: integer("contract_length").notNull(),
  // in months
  carBrand: text("car_brand"),
  // required for specific requests
  carModel: text("car_model"),
  // required for specific requests
  carYear: integer("car_year"),
  // required for specific requests
  carType: text("car_type"),
  // required for general requests
  maxMonthlyPrice: integer("max_monthly_price"),
  // required for general requests
  annualMileage: integer("annual_mileage").notNull(),
  downPayment: integer("down_payment"),
  additionalInfo: text("additional_info"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company"),
  newsletterSubscription: boolean("newsletter_subscription").default(true),
  termsAccepted: boolean("terms_accepted").notNull(),
  status: text("status").notNull().default("open"),
  // open, closed
  createdAt: timestamp("created_at").defaultNow()
});
var insertQuoteRequestSchema = createInsertSchema(quoteRequests).omit({
  id: true,
  status: true,
  createdAt: true
});
var quoteOffers = pgTable("quote_offers", {
  id: serial("id").primaryKey(),
  quoteRequestId: integer("quote_request_id").notNull(),
  providerId: integer("provider_id").notNull(),
  title: text("title").notNull(),
  carBrand: text("car_brand").notNull(),
  carModel: text("car_model").notNull(),
  carYear: integer("car_year").notNull(),
  carType: text("car_type").notNull(),
  monthlyPrice: integer("monthly_price").notNull(),
  contractLength: integer("contract_length").notNull(),
  // in months
  annualMileage: integer("annual_mileage").notNull(),
  downPayment: integer("down_payment").notNull(),
  leasingType: text("leasing_type").notNull(),
  // private, business, financial
  description: text("description"),
  status: text("status").notNull().default("pending"),
  // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow()
});
var insertQuoteOfferSchema = createInsertSchema(quoteOffers).omit({
  id: true,
  status: true,
  createdAt: true
});
var seoSettings = pgTable("seo_settings", {
  id: serial("id").primaryKey(),
  pageId: text("page_id").notNull().unique(),
  // Unique identifier for the page
  title: text("title").notNull(),
  description: text("description").notNull(),
  keywords: text("keywords"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  canonicalUrl: text("canonical_url"),
  structuredData: jsonb("structured_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertSeoSettingsSchema = createInsertSchema(seoSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value").notNull(),
  settingGroup: text("setting_group").notNull(),
  // e.g. general, analytics, contact
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var fleetRequests = pgTable("fleet_requests", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  businessId: text("business_id").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  leasingDuration: text("leasing_duration").notNull(),
  annualMileage: text("annual_mileage").notNull(),
  deliveryTime: text("delivery_time"),
  preferredCallback: text("preferred_callback").notNull().default("email"),
  message: text("message"),
  vehicles: json("vehicles").notNull(),
  status: text("status").notNull().default("new"),
  // new, processing, completed, cancelled
  termsAccepted: boolean("terms_accepted").notNull(),
  userId: integer("user_id"),
  // Optional, can be linked to a user if they are logged in
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertFleetRequestSchema = createInsertSchema(fleetRequests).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true
});

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  if (!stored || !stored.includes(".")) {
    return false;
  }
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    return false;
  }
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  const sessionSettings = {
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    // Use the session store from storage
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1e3
      // 1 hour
    }
  };
  app2.set("trust proxy", 1);
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`Login attempt: ${username}, ${password}`);
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
            createdAt: /* @__PURE__ */ new Date(),
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
            createdAt: /* @__PURE__ */ new Date(),
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
            createdAt: /* @__PURE__ */ new Date(),
            description: null,
            businessId: null
          });
        }
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
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
          createdAt: /* @__PURE__ */ new Date(),
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
          createdAt: /* @__PURE__ */ new Date(),
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
          createdAt: /* @__PURE__ */ new Date(),
          description: null,
          businessId: null
        });
      }
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ error: "K\xE4ytt\xE4j\xE4nimi on jo k\xE4yt\xF6ss\xE4" });
      }
      const hashedPassword = await hashPassword(req.body.password);
      const user = await storage.createUser({
        ...req.body,
        password: hashedPassword,
        role: req.body.role || "customer"
        // Default role is customer if not specified
      });
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (err) {
      next(err);
    }
  });
  app2.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: "V\xE4\xE4r\xE4 k\xE4ytt\xE4j\xE4nimi tai salasana" });
      req.login(user, (err2) => {
        if (err2) return next(err2);
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: "Ei kirjautunut sis\xE4\xE4n" });
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}

// server/routes.ts
var isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Kirjautuminen vaaditaan" });
};
var isProvider = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.role === "provider") {
    return next();
  }
  res.status(403).json({ message: "Ei k\xE4ytt\xF6oikeutta" });
};
var isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Ei k\xE4ytt\xF6oikeutta" });
};
async function registerRoutes(app2) {
  app2.get("/mukautettu-header.html", (req, res) => {
    res.sendFile("mukautettu-header.html", { root: "./public" });
  });
  setupAuth(app2);
  app2.post("/api/check-existing-user", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "S\xE4hk\xF6postiosoite puuttuu" });
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
  app2.get("/api/profile", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sis\xE4\xE4n" });
      }
      const userObj = req.user;
      const userWithoutPassword = Object.keys(userObj).filter((key) => key !== "password").reduce((obj, key) => {
        obj[key] = userObj[key];
        return obj;
      }, {});
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.put("/api/profile", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sis\xE4\xE4n" });
      }
      const userId = req.user.id;
      const updatedUser = await storage.updateUser(userId, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "K\xE4ytt\xE4j\xE4\xE4 ei l\xF6ydy" });
      }
      const userObj = updatedUser;
      const userWithoutPassword = Object.keys(userObj).filter((key) => key !== "password").reduce((obj, key) => {
        obj[key] = userObj[key];
        return obj;
      }, {});
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Palvelinvirhe" });
      }
    }
  });
  app2.get("/api/quote-requests/user", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sis\xE4\xE4n" });
      }
      const userId = req.user.id;
      const requests = await storage.getQuoteRequestsByUser(userId);
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/quote-offers/user", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sis\xE4\xE4n" });
      }
      const userId = req.user.id;
      const requests = await storage.getQuoteRequestsByUser(userId);
      if (!requests.length) {
        return res.status(200).json([]);
      }
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
  app2.get("/api/quote-requests/:requestId/offers", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sis\xE4\xE4n" });
      }
      const userId = req.user.id;
      const requestId = parseInt(req.params.requestId);
      if (isNaN(requestId)) {
        return res.status(400).json({ message: "Virheellinen tarjouspyynn\xF6n ID" });
      }
      const request = await storage.getQuoteRequest(requestId);
      if (!request || request.userId !== userId) {
        return res.status(403).json({ message: "Ei k\xE4ytt\xF6oikeutta t\xE4h\xE4n tarjouspyynt\xF6\xF6n" });
      }
      const offers = await storage.getQuoteOffersByRequest(requestId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/provider/quote-requests", isProvider, async (req, res) => {
    try {
      const requests = await storage.getQuoteRequests();
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/provider/quote-offers", isProvider, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sis\xE4\xE4n" });
      }
      const providerId = req.user.id;
      const offers = await storage.getQuoteOffersByProvider(providerId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/quote-offers/provider", isProvider, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sis\xE4\xE4n" });
      }
      const providerId = req.user.id;
      const offers = await storage.getQuoteOffersByProvider(providerId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/provider/leasing-offers", isProvider, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sis\xE4\xE4n" });
      }
      const providerId = req.user.id;
      const offers = await storage.getLeasingOffersByProvider(providerId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/leasing-offers/provider", isProvider, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sis\xE4\xE4n" });
      }
      const providerId = req.user.id;
      const offers = await storage.getLeasingOffersByProvider(providerId);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/leasing-offers", async (req, res) => {
    try {
      const leasingType = req.query.leasingType;
      const filters = {};
      if (leasingType) {
        filters.leasingType = leasingType;
      }
      filters.active = true;
      const offers = await storage.getLeasingOffers(filters);
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/leasing-offers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const offer = await storage.getLeasingOffer(id);
      if (!offer) {
        return res.status(404).json({ message: "Tarjousta ei l\xF6ydy" });
      }
      res.status(200).json(offer);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.post("/api/leasing-offers", isProvider, async (req, res) => {
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
  app2.put("/api/leasing-offers/:id", isProvider, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const offer = await storage.getLeasingOffer(id);
      if (!offer) {
        return res.status(404).json({ message: "Tarjousta ei l\xF6ydy" });
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
  app2.patch("/api/leasing-offers/:id/toggle-status", isProvider, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const offer = await storage.getLeasingOffer(id);
      if (!offer) {
        return res.status(404).json({ message: "Tarjousta ei l\xF6ydy" });
      }
      if (offer.providerId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "Ei k\xE4ytt\xF6oikeutta" });
      }
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
  app2.delete("/api/leasing-offers/:id", isProvider, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const success = await storage.deleteLeasingOffer(id);
      if (!success) {
        return res.status(404).json({ message: "Tarjousta ei l\xF6ydy" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/providers/:providerId/leasing-offers", async (req, res) => {
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
  app2.post("/api/quote-requests", async (req, res) => {
    try {
      const validatedData = insertQuoteRequestSchema.parse(req.body);
      if (!validatedData.userId) {
        res.status(400).json({ message: "K\xE4ytt\xE4j\xE4n ID on pakollinen tieto" });
        return;
      }
      const userExists = await storage.getUser(validatedData.userId);
      if (!userExists) {
        res.status(400).json({ message: "K\xE4ytt\xE4j\xE4\xE4 ei l\xF6ydy annetulla ID:ll\xE4" });
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
  app2.get("/api/quote-requests", async (req, res) => {
    try {
      const requests = await storage.getQuoteRequests();
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/quote-requests/open", isProvider, async (req, res) => {
    try {
      const requests = await storage.getQuoteRequests({ status: "open" });
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/quote-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const request = await storage.getQuoteRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Tarjouspyynt\xF6\xE4 ei l\xF6ydy" });
      }
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/users/:userId/quote-requests", isAuthenticated, async (req, res) => {
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
  app2.post("/api/quote-offers", isProvider, async (req, res) => {
    try {
      const validatedData = insertQuoteOfferSchema.parse(req.body);
      const quoteRequest = await storage.getQuoteRequest(validatedData.quoteRequestId);
      if (!quoteRequest) {
        return res.status(404).json({ message: "Tarjouspyynt\xF6\xE4 ei l\xF6ydy" });
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
  app2.get("/api/quote-requests/:requestId/offers", async (req, res) => {
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
  app2.get("/api/providers/:providerId/quote-offers", async (req, res) => {
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
  app2.put("/api/quote-offers/:id", isProvider, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const offer = await storage.getQuoteOffer(id);
      if (!offer) {
        return res.status(404).json({ message: "Tarjousta ei l\xF6ydy" });
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
  const isDevMode = true;
  const adminAuth = isDevMode ? (req, res, next) => next() : isAdmin;
  app2.post("/api/fleet-requests", async (req, res) => {
    try {
      const validatedData = insertFleetRequestSchema.parse(req.body);
      let userId = validatedData.userId;
      if (!userId && validatedData.email) {
        const existingUser = await storage.getUserByEmail(validatedData.email);
        if (existingUser) {
          userId = existingUser.id;
        } else {
          const randomPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await hashPassword(randomPassword);
          const newUser = await storage.createUser({
            username: validatedData.email.split("@")[0] + Math.floor(Math.random() * 1e3),
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
  app2.get("/api/fleet-requests", adminAuth, async (req, res) => {
    try {
      const requests = await storage.getFleetRequests();
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/fleet-requests/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const request = await storage.getFleetRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Kalustotarjouspyynt\xF6\xE4 ei l\xF6ydy" });
      }
      if (req.user) {
        const user = req.user;
        if (request.userId !== user.id && user.role !== "admin" && user.role !== "provider") {
          return res.status(403).json({ message: "Ei k\xE4ytt\xF6oikeutta" });
        }
      }
      res.status(200).json(request);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/user/fleet-requests", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Ei kirjautunut sis\xE4\xE4n" });
      }
      const userId = req.user.id;
      const requests = await storage.getFleetRequestsByUser(userId);
      res.status(200).json(requests);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.put("/api/fleet-requests/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const request = await storage.getFleetRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Kalustotarjouspyynt\xF6\xE4 ei l\xF6ydy" });
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
  app2.patch("/api/fleet-requests/:id/status", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ message: "Tila on pakollinen kentt\xE4" });
      }
      const request = await storage.getFleetRequest(id);
      if (!request) {
        return res.status(404).json({ message: "Kalustotarjouspyynt\xF6\xE4 ei l\xF6ydy" });
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
  app2.delete("/api/fleet-requests/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const success = await storage.deleteFleetRequest(id);
      if (!success) {
        return res.status(404).json({ message: "Kalustotarjouspyynt\xF6\xE4 ei l\xF6ydy" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.post("/api/admin/verify-provider/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "K\xE4ytt\xE4j\xE4\xE4 ei l\xF6ydy" });
      }
      if (user.role !== "provider") {
        return res.status(400).json({ message: "K\xE4ytt\xE4j\xE4 ei ole tarjoaja" });
      }
      const verified = req.body.verified !== void 0 ? req.body.verified : true;
      const updatedUser = await storage.updateUser(id, { verified });
      if (!updatedUser) {
        return res.status(500).json({ message: "P\xE4ivitys ep\xE4onnistui" });
      }
      const { password, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/admin/users", adminAuth, async (req, res) => {
    try {
      const users2 = await storage.getUsers();
      const usersWithoutPasswords = users2.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.status(200).json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.post("/api/users/:id/change-password", isAuthenticated, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Ei kirjautunut sis\xE4\xE4n" });
      }
      const userId = parseInt(req.params.id);
      const { currentPassword, newPassword } = req.body;
      if (req.user.id !== userId && req.user.role !== "admin") {
        return res.status(403).json({ error: "Ei oikeuksia vaihtaa t\xE4m\xE4n k\xE4ytt\xE4j\xE4n salasanaa" });
      }
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Nykyinen ja uusi salasana ovat pakollisia" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Uuden salasanan on oltava v\xE4hint\xE4\xE4n 6 merkki\xE4" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "K\xE4ytt\xE4j\xE4\xE4 ei l\xF6ydy" });
      }
      if (!await comparePasswords(currentPassword, user.password)) {
        return res.status(400).json({ error: "Nykyinen salasana on virheellinen" });
      }
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(userId, { password: hashedPassword });
      return res.status(200).json({ message: "Salasana vaihdettu onnistuneesti" });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ error: "Virhe salasanan vaihdossa" });
    }
  });
  app2.get("/api/seo-settings", async (req, res) => {
    try {
      const seoSettings2 = await storage.getSeoSettings();
      res.status(200).json(seoSettings2);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/seo-settings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const seoSetting = await storage.getSeoSetting(id);
      if (!seoSetting) {
        return res.status(404).json({ message: "SEO-asetuksia ei l\xF6ydy" });
      }
      res.status(200).json(seoSetting);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/seo-settings/page/:pageId", async (req, res) => {
    try {
      const pageId = req.params.pageId;
      if (!pageId) {
        return res.status(400).json({ message: "Sivun tunniste puuttuu" });
      }
      const seoSetting = await storage.getSeoSettingByPageId(pageId);
      if (!seoSetting) {
        return res.status(404).json({ message: "SEO-asetuksia ei l\xF6ydy t\xE4lle sivulle" });
      }
      res.status(200).json(seoSetting);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/public/seo-settings", async (req, res) => {
    try {
      const seoSettings2 = await storage.getSeoSettings();
      res.status(200).json(seoSettings2);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/public/seo-settings/:pageId", async (req, res) => {
    try {
      const pageId = req.params.pageId;
      if (!pageId) {
        return res.status(400).json({ message: "Sivun tunniste puuttuu" });
      }
      const seoSetting = await storage.getSeoSettingByPageId(pageId);
      if (!seoSetting) {
        return res.status(404).json({ message: "SEO-asetuksia ei l\xF6ydy t\xE4lle sivulle" });
      }
      res.status(200).json(seoSetting);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.post("/api/seo-settings", adminAuth, async (req, res) => {
    try {
      const validatedData = insertSeoSettingsSchema.parse(req.body);
      const existingSetting = await storage.getSeoSettingByPageId(validatedData.pageId);
      if (existingSetting) {
        return res.status(400).json({
          message: "T\xE4lle sivulle on jo olemassa SEO-asetukset",
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
  app2.put("/api/seo-settings/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const seoSetting = await storage.getSeoSetting(id);
      if (!seoSetting) {
        return res.status(404).json({ message: "SEO-asetuksia ei l\xF6ydy" });
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
  app2.delete("/api/seo-settings/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const success = await storage.deleteSeoSetting(id);
      if (!success) {
        return res.status(404).json({ message: "SEO-asetuksia ei l\xF6ydy" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/site-settings", async (req, res) => {
    try {
      const group = req.query.group;
      const siteSettings2 = await storage.getSiteSettings(group);
      res.status(200).json(siteSettings2);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/site-settings/public", async (req, res) => {
    try {
      const siteSettings2 = await storage.getPublicSiteSettings();
      res.status(200).json(siteSettings2);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/public/site-settings", async (req, res) => {
    try {
      const siteSettings2 = await storage.getPublicSiteSettings();
      res.status(200).json(siteSettings2);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/site-settings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const siteSetting = await storage.getSiteSetting(id);
      if (!siteSetting) {
        return res.status(404).json({ message: "Sivustoasetuksia ei l\xF6ydy" });
      }
      res.status(200).json(siteSetting);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.get("/api/site-settings/key/:key", async (req, res) => {
    try {
      const key = req.params.key;
      if (!key) {
        return res.status(400).json({ message: "Avaimen tunniste puuttuu" });
      }
      const siteSetting = await storage.getSiteSettingByKey(key);
      if (!siteSetting) {
        return res.status(404).json({ message: "Sivustoasetuksia ei l\xF6ydy t\xE4lle avaimelle" });
      }
      res.status(200).json(siteSetting);
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.post("/api/site-settings", adminAuth, async (req, res) => {
    try {
      const validatedData = insertSiteSettingsSchema.parse(req.body);
      const existingSetting = await storage.getSiteSettingByKey(validatedData.settingKey);
      if (existingSetting) {
        return res.status(400).json({
          message: "T\xE4ll\xE4 avaimella on jo olemassa asetus",
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
  app2.put("/api/site-settings/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const siteSetting = await storage.getSiteSetting(id);
      if (!siteSetting) {
        return res.status(404).json({ message: "Sivustoasetuksia ei l\xF6ydy" });
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
  app2.delete("/api/site-settings/:id", adminAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Virheellinen ID" });
      }
      const success = await storage.deleteSiteSetting(id);
      if (!success) {
        return res.status(404).json({ message: "Sivustoasetuksia ei l\xF6ydy" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Palvelinvirhe" });
    }
  });
  app2.use((req, res, next) => {
    if (req.path.startsWith("/api/") && !res.headersSent) {
      return res.status(404).json({ message: "Sivua tai resurssia ei l\xF6ydy" });
    }
    next();
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/pg-storage.ts
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and } from "drizzle-orm";
import postgres from "postgres";
import connectPg from "connect-pg-simple";
var PostgresStorage = class {
  db;
  sql;
  sessionStore;
  constructor(connectionString) {
    if (!connectionString) {
      throw new Error("DATABASE_URL ymp\xE4rist\xF6muuttuja puuttuu");
    }
    this.sql = postgres(connectionString);
    this.db = drizzle(this.sql, { schema: schema_exports });
    const PostgresSessionStore = connectPg(__require("express-session"));
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
      },
      createTableIfMissing: true
    });
  }
  // User operations
  async getUser(id) {
    const users2 = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return users2[0];
  }
  async getUserByUsername(username) {
    const users2 = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return users2[0];
  }
  async getUserByEmail(email) {
    const users2 = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    return users2[0];
  }
  async createUser(user) {
    const inserted = await this.db.insert(users).values(user).returning();
    return inserted[0];
  }
  async updateUser(id, userData) {
    const updated = await this.db.update(users).set(userData).where(eq(users.id, id)).returning();
    return updated[0];
  }
  async getUsers() {
    return await this.db.select().from(users);
  }
  // Leasing offer operations
  async getLeasingOffer(id) {
    const offers = await this.db.select().from(leasingOffers).where(eq(leasingOffers.id, id)).limit(1);
    return offers[0];
  }
  async getLeasingOffers(filters) {
    if (!filters) {
      return await this.db.select().from(leasingOffers);
    }
    const conditions = [];
    if (filters.providerId !== void 0) {
      conditions.push(eq(leasingOffers.providerId, filters.providerId));
    }
    if (filters.leasingType !== void 0) {
      conditions.push(eq(leasingOffers.leasingType, filters.leasingType));
    }
    if (filters.carType !== void 0) {
      conditions.push(eq(leasingOffers.carType, filters.carType));
    }
    if (filters.carBrand !== void 0) {
      conditions.push(eq(leasingOffers.carBrand, filters.carBrand));
    }
    if (filters.carModel !== void 0) {
      conditions.push(eq(leasingOffers.carModel, filters.carModel));
    }
    if (filters.featured !== void 0) {
      conditions.push(eq(leasingOffers.featured, filters.featured));
    }
    if (conditions.length === 0) {
      return await this.db.select().from(leasingOffers);
    }
    return await this.db.select().from(leasingOffers).where(and(...conditions));
  }
  async getLeasingOffersByProvider(providerId) {
    return await this.db.select().from(leasingOffers).where(eq(leasingOffers.providerId, providerId));
  }
  async createLeasingOffer(offer) {
    const inserted = await this.db.insert(leasingOffers).values(offer).returning();
    return inserted[0];
  }
  async updateLeasingOffer(id, offer) {
    const updated = await this.db.update(leasingOffers).set(offer).where(eq(leasingOffers.id, id)).returning();
    return updated[0];
  }
  async deleteLeasingOffer(id) {
    const result = await this.db.delete(leasingOffers).where(eq(leasingOffers.id, id)).returning({ id: leasingOffers.id });
    return result.length > 0;
  }
  // Quote request operations
  async getQuoteRequest(id) {
    const requests = await this.db.select().from(quoteRequests).where(eq(quoteRequests.id, id)).limit(1);
    return requests[0];
  }
  async getQuoteRequests(filters) {
    if (!filters) {
      return await this.db.select().from(quoteRequests);
    }
    const conditions = [];
    if (filters.userId !== void 0) {
      conditions.push(eq(quoteRequests.userId, filters.userId));
    }
    if (filters.status !== void 0) {
      conditions.push(eq(quoteRequests.status, filters.status));
    }
    if (filters.requestType !== void 0) {
      conditions.push(eq(quoteRequests.requestType, filters.requestType));
    }
    if (filters.leasingType !== void 0) {
      conditions.push(eq(quoteRequests.leasingType, filters.leasingType));
    }
    if (conditions.length === 0) {
      return await this.db.select().from(quoteRequests);
    }
    return await this.db.select().from(quoteRequests).where(and(...conditions));
  }
  async getQuoteRequestsByUser(userId) {
    return await this.db.select().from(quoteRequests).where(eq(quoteRequests.userId, userId));
  }
  async createQuoteRequest(request) {
    const inserted = await this.db.insert(quoteRequests).values(request).returning();
    return inserted[0];
  }
  async updateQuoteRequest(id, request) {
    const updated = await this.db.update(quoteRequests).set(request).where(eq(quoteRequests.id, id)).returning();
    return updated[0];
  }
  // Quote offer operations
  async getQuoteOffer(id) {
    const offers = await this.db.select().from(quoteOffers).where(eq(quoteOffers.id, id)).limit(1);
    return offers[0];
  }
  async getQuoteOffers(filters) {
    if (!filters) {
      return await this.db.select().from(quoteOffers);
    }
    const conditions = [];
    if (filters.providerId !== void 0) {
      conditions.push(eq(quoteOffers.providerId, filters.providerId));
    }
    if (filters.quoteRequestId !== void 0) {
      conditions.push(eq(quoteOffers.quoteRequestId, filters.quoteRequestId));
    }
    if (filters.status !== void 0) {
      conditions.push(eq(quoteOffers.status, filters.status));
    }
    if (conditions.length === 0) {
      return await this.db.select().from(quoteOffers);
    }
    return await this.db.select().from(quoteOffers).where(and(...conditions));
  }
  async getQuoteOffersByRequest(requestId) {
    return await this.db.select().from(quoteOffers).where(eq(quoteOffers.quoteRequestId, requestId));
  }
  async getQuoteOffersByProvider(providerId) {
    return await this.db.select().from(quoteOffers).where(eq(quoteOffers.providerId, providerId));
  }
  async createQuoteOffer(offer) {
    const inserted = await this.db.insert(quoteOffers).values(offer).returning();
    return inserted[0];
  }
  async updateQuoteOffer(id, offer) {
    const updated = await this.db.update(quoteOffers).set(offer).where(eq(quoteOffers.id, id)).returning();
    return updated[0];
  }
  // SEO settings operations
  async getSeoSetting(id) {
    const settings = await this.db.select().from(seoSettings).where(eq(seoSettings.id, id)).limit(1);
    return settings[0];
  }
  async getSeoSettingByPageId(pageId) {
    const settings = await this.db.select().from(seoSettings).where(eq(seoSettings.pageId, pageId)).limit(1);
    return settings[0];
  }
  async getSeoSettings() {
    return await this.db.select().from(seoSettings);
  }
  async createSeoSetting(setting) {
    const inserted = await this.db.insert(seoSettings).values(setting).returning();
    return inserted[0];
  }
  async updateSeoSetting(id, setting) {
    const updated = await this.db.update(seoSettings).set(setting).where(eq(seoSettings.id, id)).returning();
    return updated[0];
  }
  async deleteSeoSetting(id) {
    const result = await this.db.delete(seoSettings).where(eq(seoSettings.id, id)).returning({ id: seoSettings.id });
    return result.length > 0;
  }
  // Site settings operations
  async getSiteSetting(id) {
    const settings = await this.db.select().from(siteSettings).where(eq(siteSettings.id, id)).limit(1);
    return settings[0];
  }
  async getSiteSettingByKey(key) {
    const settings = await this.db.select().from(siteSettings).where(eq(siteSettings.settingKey, key)).limit(1);
    return settings[0];
  }
  async getSiteSettings(group) {
    if (group) {
      return await this.db.select().from(siteSettings).where(eq(siteSettings.settingGroup, group));
    }
    return await this.db.select().from(siteSettings);
  }
  async getPublicSiteSettings() {
    return await this.db.select().from(siteSettings).where(eq(siteSettings.isPublic, true));
  }
  async createSiteSetting(setting) {
    const inserted = await this.db.insert(siteSettings).values(setting).returning();
    return inserted[0];
  }
  async updateSiteSetting(id, setting) {
    const updated = await this.db.update(siteSettings).set(setting).where(eq(siteSettings.id, id)).returning();
    return updated[0];
  }
  async deleteSiteSetting(id) {
    const result = await this.db.delete(siteSettings).where(eq(siteSettings.id, id)).returning({ id: siteSettings.id });
    return result.length > 0;
  }
  // Fleet request operations (yrityskalusto)
  async getFleetRequest(id) {
    const requests = await this.db.select().from(fleetRequests).where(eq(fleetRequests.id, id)).limit(1);
    return requests[0];
  }
  async getFleetRequests(filters) {
    if (!filters) {
      return await this.db.select().from(fleetRequests);
    }
    const conditions = [];
    if (filters.userId !== void 0) {
      conditions.push(eq(fleetRequests.userId, filters.userId));
    }
    if (filters.status !== void 0) {
      conditions.push(eq(fleetRequests.status, filters.status));
    }
    if (filters.businessId !== void 0) {
      conditions.push(eq(fleetRequests.businessId, filters.businessId));
    }
    if (conditions.length === 0) {
      return await this.db.select().from(fleetRequests);
    }
    return await this.db.select().from(fleetRequests).where(and(...conditions));
  }
  async getFleetRequestsByUser(userId) {
    return await this.db.select().from(fleetRequests).where(eq(fleetRequests.userId, userId));
  }
  async createFleetRequest(request) {
    const inserted = await this.db.insert(fleetRequests).values(request).returning();
    return inserted[0];
  }
  async updateFleetRequest(id, request) {
    const updated = await this.db.update(fleetRequests).set(request).where(eq(fleetRequests.id, id)).returning();
    return updated[0];
  }
  async deleteFleetRequest(id) {
    const result = await this.db.delete(fleetRequests).where(eq(fleetRequests.id, id)).returning({ id: fleetRequests.id });
    return result.length > 0;
  }
};

// server/index.ts
import crypto from "crypto";
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = crypto.randomBytes(64).toString("hex");
  console.log("WARNING: Luotu v\xE4liaikainen SESSION_SECRET. Aseta pysyv\xE4 SESSION_SECRET ymp\xE4rist\xF6muuttujiin.");
}
if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
  console.log("K\xE4ytet\xE4\xE4n PostgreSQL-tietokantaa tuotantoymp\xE4rist\xF6ss\xE4.");
  global.storage = new PostgresStorage(process.env.DATABASE_URL);
}
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
