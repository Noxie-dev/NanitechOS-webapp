import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Wallpaper settings
export const wallpapers = pgTable("wallpapers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(),
  isDefault: boolean("is_default").default(false),
});

// App definitions
export const apps = pgTable("apps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  visible: boolean("visible").default(true),
  position: integer("position"),
  windowSettings: jsonb("window_settings").notNull(),
});

// OS Settings
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  darkMode: boolean("dark_mode").default(true),
  animations: boolean("animations").default(true),
  blurEffects: boolean("blur_effects").default(true),
  clockFormat: text("clock_format").default("12h"),
  dockSettings: jsonb("dock_settings").notNull(),
});

// User content
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'article', 'project', 'resource'
  title: text("title").notNull(),
  description: text("description"),
  content: text("content"),
  imageUrl: text("image_url"),
  category: text("category"),
});

// Services catalog
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // Lucide icon name, e.g. "Sparkles"
  color: text("color").notNull(), // Tailwind gradient class
  borderColor: text("border_color").notNull(), // Tailwind border hover class
  isActive: boolean("is_active").default(true).notNull(),
});

// Behavioral analytics events (per session)
export const behavioralEvents = pgTable("behavioral_events", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  pageKey: text("page_key").notNull(),
  eventType: text("event_type").notNull(),
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWallpaperSchema = createInsertSchema(wallpapers).omit({
  id: true,
});

export const insertAppSchema = createInsertSchema(apps).omit({
  id: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWallpaper = z.infer<typeof insertWallpaperSchema>;
export type Wallpaper = typeof wallpapers.$inferSelect;

export type InsertApp = z.infer<typeof insertAppSchema>;
export type App = typeof apps.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

export type BehavioralEvent = typeof behavioralEvents.$inferSelect;
export type InsertBehavioralEvent = typeof behavioralEvents.$inferInsert;
