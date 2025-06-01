import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  profileImage: text("profile_image"),
  verified: boolean("verified").default(false),
});

export const rides = pgTable("rides", {
  id: serial("id").primaryKey(),
  driverId: integer("driver_id").notNull(),
  fromLocation: text("from_location").notNull(),
  toLocation: text("to_location").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  totalSeats: integer("total_seats").notNull(),
  availableSeats: integer("available_seats").notNull(),
  costPerPerson: integer("cost_per_person").notNull(),
  vehicleInfo: text("vehicle_info").notNull(),
  driverName: text("driver_name").notNull(),
  driverImage: text("driver_image"),
  driverRating: text("driver_rating").default("4.8"),
  createdAt: text("created_at").notNull(),
});

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  sharerId: integer("sharer_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  condition: text("condition").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  sharerName: text("sharer_name").notNull(),
  sharerImage: text("sharer_image"),
  available: boolean("available").default(true),
  createdAt: text("created_at").notNull(),
});

export const helpRequests = pgTable("help_requests", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  urgency: text("urgency").notNull(),
  requesterName: text("requester_name").notNull(),
  requesterImage: text("requester_image"),
  helpersCount: integer("helpers_count").default(0),
  resolved: boolean("resolved").default(false),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertRideSchema = createInsertSchema(rides).omit({
  id: true,
  driverId: true,
  driverName: true,
  driverImage: true,
  driverRating: true,
  availableSeats: true,
  createdAt: true,
}).extend({
  totalSeats: z.number().min(1).max(8),
  costPerPerson: z.number().min(1),
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  sharerId: true,
  sharerName: true,
  sharerImage: true,
  available: true,
  createdAt: true,
});

export const insertHelpRequestSchema = createInsertSchema(helpRequests).omit({
  id: true,
  requesterId: true,
  requesterName: true,
  requesterImage: true,
  helpersCount: true,
  resolved: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Ride = typeof rides.$inferSelect;
export type InsertRide = z.infer<typeof insertRideSchema>;
export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;
export type HelpRequest = typeof helpRequests.$inferSelect;
export type InsertHelpRequest = z.infer<typeof insertHelpRequestSchema>;
