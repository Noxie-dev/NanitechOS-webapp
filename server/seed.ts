import { db } from "./db";
import { eq } from "drizzle-orm";
import { 
  users, 
  wallpapers, 
  apps, 
  settings, 
  content,
  services
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

    const missionExists = await db.select().from(content).where(eq(content.title, "Our Mission"));
    if (missionExists.length === 0) {
      await db.insert(content).values({
        type: "article",
        title: "Our Mission",
        description: "Mission and values of NaniTech",
        content: `Our Mission

To design and build intelligent digital products that help businesses and startups work smarter, scale faster, and create meaningful impact — by combining thoughtful engineering, creative problem-solving, and practical AI integration.

We exist to turn ideas into scalable platforms and to transform existing systems into more productive, revenue-driven, and future-ready solutions.

Our Values
1. Purpose Before Hype
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
We believe world-class technology can be built from Africa. Our work reflects global standards while embracing local insight and ambition.`,
        imageUrl: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e",
        category: "general"
      });
    } else {
      await db.update(content).set({
      content: `Our Mission

To design and build intelligent digital products that help businesses and startups work smarter, scale faster, and create meaningful impact — by combining thoughtful engineering, creative problem-solving, and practical AI integration.

We exist to turn ideas into scalable platforms and to transform existing systems into more productive, revenue-driven, and future-ready solutions.

Our Values
1. Purpose Before Hype
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
    }).where(eq(content.title, "Our Mission"));
    }

    await db.update(content).set({
      content: `NaniTech is founder-led and builder-driven.

At its core is a hands-on technologist and strategist who believes that software should do more than function — it should solve real problems, unlock opportunity, and create measurable impact.

What started as a deep curiosity about systems, platforms, and digital ecosystems evolved into a focused mission: to build intelligent SaaS products that improve productivity, expand access, and generate real value for businesses and users alike.

A Builder’s Mindset
I approach development as both a technical challenge and a strategic opportunity. Whether architecting a web platform, integrating AI into an existing system, or designing a product from the ground up, I focus on:
• Clean, scalable foundations
• Thoughtful system architecture
• Practical innovation over hype
• Long-term sustainability over shortcuts

Every feature must earn its place. Every integration must serve a purpose.

AI With Intention
AI isn’t an add-on — it’s a capability. I believe in building AI-powered systems that are meaningful, not superficial. That means:
• Automating intelligently
• Enhancing decision-making
• Improving operational efficiency
• Increasing revenue potential
• Strengthening competitive advantage

From AI-first applications to smart integrations within existing platforms, the goal is always the same: make technology work harder so people can work smarter.

Entrepreneurial and Execution-Focused
Building in emerging and high-growth markets requires resilience, adaptability, and strategic thinking. I understand the realities of startups — limited resources, ambitious goals, and the need to move quickly without sacrificing quality.

NaniTech reflects that mindset: lean, deliberate, and focused on building products that scale.

While NaniTech collaborates with partners and specialists when needed, it is guided by a strong, hands-on leadership approach — ensuring every solution meets high standards of innovation, performance, and impact.

This isn’t just development.
It’s building intelligent systems with purpose.`
    }).where(eq(content.title, "Team"));

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
        type: "article",
        title: "Our Mission",
        description: "Mission and values of NaniTech",
        content: `Our Mission

To design and build intelligent digital products that help businesses and startups work smarter, scale faster, and create meaningful impact — by combining thoughtful engineering, creative problem-solving, and practical AI integration.

We exist to turn ideas into scalable platforms and to transform existing systems into more productive, revenue-driven, and future-ready solutions.

Our Values
1. Purpose Before Hype
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
We believe world-class technology can be built from Africa. Our work reflects global standards while embracing local insight and ambition.`,
        imageUrl: "https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e",
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

    // 6. Seed services catalog
    const servicesSeed = [
      {
        title: "AI Product Design",
        description: "Futuristic, intuitive interfaces built from the ground up. We design for the modern web, ensuring your users experience seamless, captivating journeys.",
        icon: "Sparkles",
        color: "from-[#00a8ff]/20 to-transparent",
        borderColor: "group-hover:border-[#00a8ff]/50",
        isActive: true,
      },
      {
        title: "Custom SaaS & Apps",
        description: "Robust, scalable software architecture. We build web and mobile applications that don't just function, but dominate their market spaces.",
        icon: "Code2",
        color: "from-[#3c6382]/30 to-transparent",
        borderColor: "group-hover:border-[#3c6382]/50",
        isActive: true,
      },
      {
        title: "Applied AI Integration",
        description: "Moving beyond the 'noise' of AI. We integrate real, useful artificial intelligence to solve actual business problems and increase your ROI.",
        icon: "Cpu",
        color: "from-teal-500/20 to-transparent",
        borderColor: "group-hover:border-teal-500/50",
        isActive: true,
      },
      {
        title: "Platform Modernization",
        description: "Transform legacy systems into high-performance, modern tech stacks. Future-proof your business with cutting-edge runtime and cloud integrations.",
        icon: "Layers",
        color: "from-purple-500/20 to-transparent",
        borderColor: "group-hover:border-purple-500/50",
        isActive: true,
      }
    ];

    await db.delete(services); // reset for idempotent dev seeding
    const servicesEntries = await db.insert(services).values(servicesSeed).returning();
    console.log(`Added ${servicesEntries.length} services`);

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
