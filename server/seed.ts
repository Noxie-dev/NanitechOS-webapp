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
    console.log("Database already seeded, updating content...");
    await db.update(content).set({
      content: `NaniTech was founded with a clear mission: to build intelligent digital products that solve real problems and scale with purpose — especially in fast-growing, high-impact markets.

Rooted in the African tech ecosystem and inspired by global innovation, we work at the intersection of SaaS, startups, and AI-driven development. We understand the realities founders and businesses face: limited resources, high expectations, and the need to move fast without breaking what matters.

That’s why our approach is both innovative and practical.

We design and build apps, web apps, and websites either:
• AI-first, from the ground up, where intelligence is part of the foundation
• Or by meaningfully integrating AI into existing platforms, enhancing performance, productivity, and decision-making without unnecessary disruption

AI, for us, is not hype. It’s a tool — one we use deliberately to help our clients:
• Increase productivity and efficiency
• Unlock new revenue streams
• Improve customer experience and engagement
• Scale sustainably in competitive markets

We build with startups in mind and SaaS at heart — focusing on clean architecture, scalability, and long-term value. Every solution is crafted to grow with the business, adapt to change, and stay relevant in a rapidly evolving digital landscape.

At NaniTech, we believe African innovation belongs on the global stage. We build technology that reflects that belief — bold, intelligent, and built for impact.`
    }).where(eq(content.title, "Our Story"));

    await db.update(content).set({
      content: `To design and build intelligent digital products that help businesses and startups work smarter, scale faster, and create meaningful impact — by combining thoughtful engineering, creative problem-solving, and practical AI integration.

We exist to turn ideas into scalable platforms and to transform existing systems into more productive, revenue-driven, and future-ready solutions.`
    }).where(eq(content.title, "Our Mission"));

    await db.update(content).set({
      content: `1. Purpose Before Hype
We don’t use technology for show. Every tool, feature, and AI integration must serve a clear purpose and deliver real value.

2. Build Smart, Build Right
Clean architecture, scalable systems, and long-term thinking guide everything we build. Shortcuts today create problems tomorrow — we avoid them.

3. Innovation With Context
We build for real people, real markets, and real constraints. Especially in emerging and fast-growing ecosystems, practicality matters as much as innovation.

4. AI as an Enabler
AI is not a replacement for people — it’s a force multiplier. We use it to enhance productivity, improve decision-making, and unlock new possibilities.

5. Partnership Over Projects
We don’t just deliver and disappear. We collaborate closely with our clients, treating their goals as our own and growing alongside them.

6. African-Rooted, Globally Competitive
We believe world-class technology can be built from Africa. Our work reflects global standards while embracing local insight and ambition.`
    }).where(eq(content.title, "Our Values"));

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
        title: "Our Story",
        description: "The journey of NaniTech",
        content: `NaniTech was founded with a clear mission: to build intelligent digital products that solve real problems and scale with purpose — especially in fast-growing, high-impact markets.

Rooted in the African tech ecosystem and inspired by global innovation, we work at the intersection of SaaS, startups, and AI-driven development. We understand the realities founders and businesses face: limited resources, high expectations, and the need to move fast without breaking what matters.

That’s why our approach is both innovative and practical.

We design and build apps, web apps, and websites either:
• AI-first, from the ground up, where intelligence is part of the foundation
• Or by meaningfully integrating AI into existing platforms, enhancing performance, productivity, and decision-making without unnecessary disruption

AI, for us, is not hype. It’s a tool — one we use deliberately to help our clients:
• Increase productivity and efficiency
• Unlock new revenue streams
• Improve customer experience and engagement
• Scale sustainably in competitive markets

We build with startups in mind and SaaS at heart — focusing on clean architecture, scalability, and long-term value. Every solution is crafted to grow with the business, adapt to change, and stay relevant in a rapidly evolving digital landscape.

At NaniTech, we believe African innovation belongs on the global stage. We build technology that reflects that belief — bold, intelligent, and built for impact.`,
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

// Only execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().catch(err => {
    console.error(err);
    process.exit(1);
  });
}
