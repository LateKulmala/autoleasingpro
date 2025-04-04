import { pgTable, text, serial, integer, boolean, timestamp, jsonb, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  role: text("role").notNull().default("customer"), // customer, provider, admin
  verified: boolean("verified").default(false), // Used for provider verification by admins
  businessId: text("business_id"), // Y-tunnus for providers
  description: text("description"), // Company description for providers
  newsletterSubscription: boolean("newsletter_subscription").default(true),
  offerNotifications: boolean("offer_notifications").default(true), // Notifications for new offers
  reminderNotifications: boolean("reminder_notifications").default(true), // Reminders
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Leasing Offer schema
export const leasingOffers = pgTable("leasing_offers", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  title: text("title").notNull(),
  carBrand: text("car_brand").notNull(),
  carModel: text("car_model").notNull(),
  carYear: integer("car_year").notNull(),
  carType: text("car_type").notNull(), // e.g., electric, hybrid, gasoline, diesel
  monthlyPrice: integer("monthly_price").notNull(),
  contractLength: integer("contract_length").notNull(), // in months
  annualMileage: integer("annual_mileage").notNull(),
  downPayment: integer("down_payment").notNull(),
  leasingType: text("leasing_type").notNull(), // private, business, financial
  description: text("description"),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  active: boolean("active").default(true),
});

export const insertLeasingOfferSchema = createInsertSchema(leasingOffers).omit({
  id: true,
  createdAt: true,
});

// Quote Request schema
export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  requestType: text("request_type").notNull(), // specific, general
  leasingType: text("leasing_type").notNull(), // private, business, financial
  contractLength: integer("contract_length").notNull(), // in months
  carBrand: text("car_brand"), // required for specific requests
  carModel: text("car_model"), // required for specific requests
  carYear: integer("car_year"), // required for specific requests
  carType: text("car_type"), // required for general requests
  maxMonthlyPrice: integer("max_monthly_price"), // required for general requests
  annualMileage: integer("annual_mileage").notNull(),
  downPayment: integer("down_payment"),
  additionalInfo: text("additional_info"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company"),
  newsletterSubscription: boolean("newsletter_subscription").default(true),
  termsAccepted: boolean("terms_accepted").notNull(),
  status: text("status").notNull().default("open"), // open, closed
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuoteRequestSchema = createInsertSchema(quoteRequests).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Quote Offer schema (responses to quote requests)
export const quoteOffers = pgTable("quote_offers", {
  id: serial("id").primaryKey(),
  quoteRequestId: integer("quote_request_id").notNull(),
  providerId: integer("provider_id").notNull(),
  title: text("title").notNull(),
  carBrand: text("car_brand").notNull(),
  carModel: text("car_model").notNull(),
  carYear: integer("car_year").notNull(),
  carType: text("car_type").notNull(),
  monthlyPrice: integer("monthly_price").notNull(),
  contractLength: integer("contract_length").notNull(), // in months
  annualMileage: integer("annual_mileage").notNull(),
  downPayment: integer("down_payment").notNull(),
  leasingType: text("leasing_type").notNull(), // private, business, financial
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuoteOfferSchema = createInsertSchema(quoteOffers).omit({
  id: true,
  status: true,
  createdAt: true,
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type LeasingOffer = typeof leasingOffers.$inferSelect;
export type InsertLeasingOffer = z.infer<typeof insertLeasingOfferSchema>;

export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;

export type QuoteOffer = typeof quoteOffers.$inferSelect;
export type InsertQuoteOffer = z.infer<typeof insertQuoteOfferSchema>;

// SEO settings schema
export const seoSettings = pgTable("seo_settings", {
  id: serial("id").primaryKey(),
  pageId: text("page_id").notNull().unique(), // Unique identifier for the page
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSeoSettingsSchema = createInsertSchema(seoSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Site settings schema
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  settingKey: text("setting_key").notNull().unique(),
  settingValue: text("setting_value").notNull(),
  settingGroup: text("setting_group").notNull(), // e.g. general, analytics, contact
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SeoSettings = typeof seoSettings.$inferSelect;
export type InsertSeoSettings = z.infer<typeof insertSeoSettingsSchema>;

export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;

// Fleet Request schema (yrityskaluston tarjouspyynnöt)
export const fleetRequests = pgTable("fleet_requests", {
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
  status: text("status").notNull().default("new"), // new, processing, completed, cancelled
  termsAccepted: boolean("terms_accepted").notNull(),
  userId: integer("user_id"), // Optional, can be linked to a user if they are logged in
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFleetRequestSchema = createInsertSchema(fleetRequests).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type FleetRequest = typeof fleetRequests.$inferSelect;
export type InsertFleetRequest = z.infer<typeof insertFleetRequestSchema>;
