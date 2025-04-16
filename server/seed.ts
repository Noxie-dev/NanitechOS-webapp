import { db } from "./db";
import { eq } from "drizzle-orm";
import { 
  users, 
  wallpapers, 
  apps, 
  settings, 
  content 
} from "@shared/schema";

export async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  // Check if we already have seed data to avoid duplicates
  const [existingUser] = await db.select().from(users).where(eq(users.username, "admin"));
  if (existingUser) {
    console.log("Database already seeded, skipping...");
    return;
  }

  try {
    // 1. Create admin user
    const [adminUser] = await db.insert(users).values({
      username: "admin",
      password: "password123" // In a real app, use password hashing
    }).returning();
    console.log(`Created admin user with ID: ${adminUser.id}`);

    // 2. Add default wallpapers
    const wallpaperEntries = await db.insert(wallpapers).values([
      {
        name: "Abstract Blue",
        url: "https://images.unsplash.com/photo-1579547945413-497e1b99aac0",
        category: "abstract",
        isDefault: true
      },
      {
        name: "Tech Grid",
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
        category: "tech"
      },
      {
        name: "Mountain Vista",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
        category: "landscape"
      }
    ]).returning();
    console.log(`Added ${wallpaperEntries.length} wallpapers`);

    // 3. Add default apps
    const appEntries = await db.insert(apps).values([
      {
        name: "NaniVault",
        icon: "vault-icon",
        visible: true,
        position: 0,
        windowSettings: {
          defaultWidth: 800,
          defaultHeight: 600,
          minWidth: 400,
          minHeight: 300
        }
      },
      {
        name: "Launchpad",
        icon: "grid-icon",
        visible: true,
        position: 1,
        windowSettings: {
          defaultWidth: 900,
          defaultHeight: 700,
          minWidth: 500,
          minHeight: 400
        }
      },
      {
        name: "NaniAssist",
        icon: "chat-icon",
        visible: true,
        position: 2,
        windowSettings: {
          defaultWidth: 600,
          defaultHeight: 500,
          minWidth: 300,
          minHeight: 400
        }
      },
      {
        name: "Settings",
        icon: "gear-icon",
        visible: true,
        position: 3,
        windowSettings: {
          defaultWidth: 700,
          defaultHeight: 600,
          minWidth: 400,
          minHeight: 300
        }
      }
    ]).returning();
    console.log(`Added ${appEntries.length} apps`);

    // 4. Add default settings
    const [userSettings] = await db.insert(settings).values({
      userId: adminUser.id,
      darkMode: true,
      animations: true,
      blurEffects: true,
      clockFormat: "12h",
      dockSettings: {
        magnification: true,
        autoHide: false,
        position: "bottom",
        size: "medium"
      }
    }).returning();
    console.log(`Added default settings for user ID: ${userSettings.userId}`);

    // 5. Add sample content
    const contentEntries = await db.insert(content).values([
      {
        type: "article",
        title: "Welcome to NaniOS",
        description: "Learn about the features of our innovative operating system",
        content: "NaniOS is a cutting-edge web-based operating system designed to showcase NaniTech's technological capabilities...",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
        category: "general"
      },
      {
        type: "project",
        title: "NaniVault: Secure Storage",
        description: "Explore our secure storage solution",
        content: "NaniVault provides state-of-the-art encryption and seamless cloud integration for all your storage needs...",
        imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42",
        category: "products"
      },
      {
        type: "resource",
        title: "Developer Documentation",
        description: "Resources for NaniOS developers",
        content: "Comprehensive documentation for developers looking to build extensions and applications for the NaniOS platform...",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
        category: "development"
      }
    ]).returning();
    console.log(`Added ${contentEntries.length} content items`);

    console.log("✅ Database seeding completed successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}