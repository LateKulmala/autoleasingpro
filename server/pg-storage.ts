import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, like, and, inArray, gte, lte, desc, asc } from 'drizzle-orm';
import postgres from 'postgres';
import type { IStorage } from './storage';
import * as schema from '../shared/schema';
import type { User, InsertUser, LeasingOffer, InsertLeasingOffer, QuoteRequest, 
  InsertQuoteRequest, QuoteOffer, InsertQuoteOffer, SeoSettings, InsertSeoSettings, 
  SiteSettings, InsertSiteSettings, FleetRequest, InsertFleetRequest } from '../shared/schema';
import { Store } from 'express-session';
import connectPg from 'connect-pg-simple';

export class PostgresStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private sql: ReturnType<typeof postgres>;
  public sessionStore: Store;
  
  constructor(connectionString: string) {
    if (!connectionString) {
      throw new Error('DATABASE_URL ympäristömuuttuja puuttuu');
    }
    
    // Luo postgres-oliot
    this.sql = postgres(connectionString);
    this.db = drizzle(this.sql, { schema });
    
    // Luo session store
    const PostgresSessionStore = connectPg(require('express-session'));
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      },
      createTableIfMissing: true
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const users = await this.db.select().from(schema.users).where(eq(schema.users.id, id)).limit(1);
    return users[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.db.select().from(schema.users).where(eq(schema.users.username, username)).limit(1);
    return users[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
    return users[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const inserted = await this.db.insert(schema.users).values(user).returning();
    return inserted[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const updated = await this.db.update(schema.users)
      .set(userData)
      .where(eq(schema.users.id, id))
      .returning();
    return updated[0];
  }

  async getUsers(): Promise<User[]> {
    return await this.db.select().from(schema.users);
  }

  // Leasing offer operations
  async getLeasingOffer(id: number): Promise<LeasingOffer | undefined> {
    const offers = await this.db.select().from(schema.leasingOffers).where(eq(schema.leasingOffers.id, id)).limit(1);
    return offers[0];
  }

  async getLeasingOffers(filters?: Partial<LeasingOffer>): Promise<LeasingOffer[]> {
    if (!filters) {
      return await this.db.select().from(schema.leasingOffers);
    }

    const conditions = [];
    
    if (filters.providerId !== undefined) {
      conditions.push(eq(schema.leasingOffers.providerId, filters.providerId));
    }
    
    if (filters.leasingType !== undefined) {
      conditions.push(eq(schema.leasingOffers.leasingType, filters.leasingType));
    }
    
    if (filters.carType !== undefined) {
      conditions.push(eq(schema.leasingOffers.carType, filters.carType));
    }
    
    if (filters.carBrand !== undefined) {
      conditions.push(eq(schema.leasingOffers.carBrand, filters.carBrand));
    }
    
    if (filters.carModel !== undefined) {
      conditions.push(eq(schema.leasingOffers.carModel, filters.carModel));
    }
    
    if (filters.featured !== undefined) {
      conditions.push(eq(schema.leasingOffers.featured, filters.featured as boolean));
    }
    
    if (conditions.length === 0) {
      return await this.db.select().from(schema.leasingOffers);
    }
    
    return await this.db.select().from(schema.leasingOffers).where(and(...conditions));
  }

  async getLeasingOffersByProvider(providerId: number): Promise<LeasingOffer[]> {
    return await this.db.select()
      .from(schema.leasingOffers)
      .where(eq(schema.leasingOffers.providerId, providerId));
  }

  async createLeasingOffer(offer: InsertLeasingOffer): Promise<LeasingOffer> {
    const inserted = await this.db.insert(schema.leasingOffers).values(offer).returning();
    return inserted[0];
  }

  async updateLeasingOffer(id: number, offer: Partial<LeasingOffer>): Promise<LeasingOffer | undefined> {
    const updated = await this.db.update(schema.leasingOffers)
      .set(offer)
      .where(eq(schema.leasingOffers.id, id))
      .returning();
    return updated[0];
  }

  async deleteLeasingOffer(id: number): Promise<boolean> {
    const result = await this.db.delete(schema.leasingOffers)
      .where(eq(schema.leasingOffers.id, id))
      .returning({ id: schema.leasingOffers.id });
    return result.length > 0;
  }

  // Quote request operations
  async getQuoteRequest(id: number): Promise<QuoteRequest | undefined> {
    const requests = await this.db.select().from(schema.quoteRequests).where(eq(schema.quoteRequests.id, id)).limit(1);
    return requests[0];
  }

  async getQuoteRequests(filters?: Partial<QuoteRequest>): Promise<QuoteRequest[]> {
    if (!filters) {
      return await this.db.select().from(schema.quoteRequests);
    }

    const conditions = [];
    
    if (filters.userId !== undefined) {
      conditions.push(eq(schema.quoteRequests.userId, filters.userId as number));
    }
    
    if (filters.status !== undefined) {
      conditions.push(eq(schema.quoteRequests.status, filters.status));
    }
    
    if (filters.requestType !== undefined) {
      conditions.push(eq(schema.quoteRequests.requestType, filters.requestType));
    }
    
    if (filters.leasingType !== undefined) {
      conditions.push(eq(schema.quoteRequests.leasingType, filters.leasingType));
    }
    
    if (conditions.length === 0) {
      return await this.db.select().from(schema.quoteRequests);
    }
    
    return await this.db.select().from(schema.quoteRequests).where(and(...conditions));
  }

  async getQuoteRequestsByUser(userId: number): Promise<QuoteRequest[]> {
    return await this.db.select()
      .from(schema.quoteRequests)
      .where(eq(schema.quoteRequests.userId, userId));
  }

  async createQuoteRequest(request: InsertQuoteRequest): Promise<QuoteRequest> {
    const inserted = await this.db.insert(schema.quoteRequests).values(request).returning();
    return inserted[0];
  }

  async updateQuoteRequest(id: number, request: Partial<QuoteRequest>): Promise<QuoteRequest | undefined> {
    const updated = await this.db.update(schema.quoteRequests)
      .set(request)
      .where(eq(schema.quoteRequests.id, id))
      .returning();
    return updated[0];
  }

  // Quote offer operations
  async getQuoteOffer(id: number): Promise<QuoteOffer | undefined> {
    const offers = await this.db.select().from(schema.quoteOffers).where(eq(schema.quoteOffers.id, id)).limit(1);
    return offers[0];
  }

  async getQuoteOffers(filters?: Partial<QuoteOffer>): Promise<QuoteOffer[]> {
    if (!filters) {
      return await this.db.select().from(schema.quoteOffers);
    }

    const conditions = [];
    
    if (filters.providerId !== undefined) {
      conditions.push(eq(schema.quoteOffers.providerId, filters.providerId));
    }
    
    if (filters.quoteRequestId !== undefined) {
      conditions.push(eq(schema.quoteOffers.quoteRequestId, filters.quoteRequestId));
    }
    
    if (filters.status !== undefined) {
      conditions.push(eq(schema.quoteOffers.status, filters.status));
    }
    
    if (conditions.length === 0) {
      return await this.db.select().from(schema.quoteOffers);
    }
    
    return await this.db.select().from(schema.quoteOffers).where(and(...conditions));
  }

  async getQuoteOffersByRequest(requestId: number): Promise<QuoteOffer[]> {
    return await this.db.select()
      .from(schema.quoteOffers)
      .where(eq(schema.quoteOffers.quoteRequestId, requestId));
  }

  async getQuoteOffersByProvider(providerId: number): Promise<QuoteOffer[]> {
    return await this.db.select()
      .from(schema.quoteOffers)
      .where(eq(schema.quoteOffers.providerId, providerId));
  }

  async createQuoteOffer(offer: InsertQuoteOffer): Promise<QuoteOffer> {
    const inserted = await this.db.insert(schema.quoteOffers).values(offer).returning();
    return inserted[0];
  }

  async updateQuoteOffer(id: number, offer: Partial<QuoteOffer>): Promise<QuoteOffer | undefined> {
    const updated = await this.db.update(schema.quoteOffers)
      .set(offer)
      .where(eq(schema.quoteOffers.id, id))
      .returning();
    return updated[0];
  }

  // SEO settings operations
  async getSeoSetting(id: number): Promise<SeoSettings | undefined> {
    const settings = await this.db.select().from(schema.seoSettings).where(eq(schema.seoSettings.id, id)).limit(1);
    return settings[0];
  }

  async getSeoSettingByPageId(pageId: string): Promise<SeoSettings | undefined> {
    const settings = await this.db.select().from(schema.seoSettings).where(eq(schema.seoSettings.pageId, pageId)).limit(1);
    return settings[0];
  }

  async getSeoSettings(): Promise<SeoSettings[]> {
    return await this.db.select().from(schema.seoSettings);
  }

  async createSeoSetting(setting: InsertSeoSettings): Promise<SeoSettings> {
    const inserted = await this.db.insert(schema.seoSettings).values(setting).returning();
    return inserted[0];
  }

  async updateSeoSetting(id: number, setting: Partial<SeoSettings>): Promise<SeoSettings | undefined> {
    const updated = await this.db.update(schema.seoSettings)
      .set(setting)
      .where(eq(schema.seoSettings.id, id))
      .returning();
    return updated[0];
  }

  async deleteSeoSetting(id: number): Promise<boolean> {
    const result = await this.db.delete(schema.seoSettings)
      .where(eq(schema.seoSettings.id, id))
      .returning({ id: schema.seoSettings.id });
    return result.length > 0;
  }

  // Site settings operations
  async getSiteSetting(id: number): Promise<SiteSettings | undefined> {
    const settings = await this.db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, id)).limit(1);
    return settings[0];
  }

  async getSiteSettingByKey(key: string): Promise<SiteSettings | undefined> {
    const settings = await this.db.select().from(schema.siteSettings).where(eq(schema.siteSettings.settingKey, key)).limit(1);
    return settings[0];
  }

  async getSiteSettings(group?: string): Promise<SiteSettings[]> {
    if (group) {
      return await this.db.select().from(schema.siteSettings).where(eq(schema.siteSettings.settingGroup, group));
    }
    return await this.db.select().from(schema.siteSettings);
  }

  async getPublicSiteSettings(): Promise<SiteSettings[]> {
    return await this.db.select().from(schema.siteSettings).where(eq(schema.siteSettings.isPublic, true));
  }

  async createSiteSetting(setting: InsertSiteSettings): Promise<SiteSettings> {
    const inserted = await this.db.insert(schema.siteSettings).values(setting).returning();
    return inserted[0];
  }

  async updateSiteSetting(id: number, setting: Partial<SiteSettings>): Promise<SiteSettings | undefined> {
    const updated = await this.db.update(schema.siteSettings)
      .set(setting)
      .where(eq(schema.siteSettings.id, id))
      .returning();
    return updated[0];
  }

  async deleteSiteSetting(id: number): Promise<boolean> {
    const result = await this.db.delete(schema.siteSettings)
      .where(eq(schema.siteSettings.id, id))
      .returning({ id: schema.siteSettings.id });
    return result.length > 0;
  }

  // Fleet request operations (yrityskalusto)
  async getFleetRequest(id: number): Promise<FleetRequest | undefined> {
    const requests = await this.db.select().from(schema.fleetRequests).where(eq(schema.fleetRequests.id, id)).limit(1);
    return requests[0];
  }

  async getFleetRequests(filters?: Partial<FleetRequest>): Promise<FleetRequest[]> {
    if (!filters) {
      return await this.db.select().from(schema.fleetRequests);
    }

    const conditions = [];
    
    if (filters.userId !== undefined) {
      conditions.push(eq(schema.fleetRequests.userId, filters.userId as number));
    }
    
    if (filters.status !== undefined) {
      conditions.push(eq(schema.fleetRequests.status, filters.status));
    }
    
    if (filters.businessId !== undefined) {
      conditions.push(eq(schema.fleetRequests.businessId, filters.businessId));
    }
    
    if (conditions.length === 0) {
      return await this.db.select().from(schema.fleetRequests);
    }
    
    return await this.db.select().from(schema.fleetRequests).where(and(...conditions));
  }

  async getFleetRequestsByUser(userId: number): Promise<FleetRequest[]> {
    return await this.db.select()
      .from(schema.fleetRequests)
      .where(eq(schema.fleetRequests.userId, userId));
  }

  async createFleetRequest(request: InsertFleetRequest): Promise<FleetRequest> {
    const inserted = await this.db.insert(schema.fleetRequests).values(request).returning();
    return inserted[0];
  }

  async updateFleetRequest(id: number, request: Partial<FleetRequest>): Promise<FleetRequest | undefined> {
    const updated = await this.db.update(schema.fleetRequests)
      .set(request)
      .where(eq(schema.fleetRequests.id, id))
      .returning();
    return updated[0];
  }

  async deleteFleetRequest(id: number): Promise<boolean> {
    const result = await this.db.delete(schema.fleetRequests)
      .where(eq(schema.fleetRequests.id, id))
      .returning({ id: schema.fleetRequests.id });
    return result.length > 0;
  }
}