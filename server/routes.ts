import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { content, users, wallpapers, apps, settings, services, behavioralEvents } from "@shared/schema";
import { eq, like, or, desc } from "drizzle-orm";
import crypto from "crypto";
import rateLimit from "express-rate-limit";

// Initial data for the OS
const companyInfo = {
  story: `NaniTech was founded in Cape Town, South Africa with a vision to create innovative technology solutions that address real-world challenges.

What began as a small startup has grown into a leading tech company, pioneering advancements in artificial intelligence, data analytics, and digital experiences.

Our journey is characterized by continuous innovation, unwavering dedication to excellence, and a commitment to making technology accessible and beneficial for everyone.`,
  team: [
    { name: "Jane Doe", position: "Chief Executive Officer" },
    { name: "John Smith", position: "Chief Technology Officer" },
    { name: "Alex Johnson", position: "Head of Design" },
    { name: "Sam Williams", position: "Lead Developer" }
  ],
  values: [
    { name: "Innovation", description: "We push boundaries and explore new possibilities." },
    { name: "Excellence", description: "We strive for the highest quality in everything we do." },
    { name: "Inclusion", description: "We create technology that works for everyone." }
  ],
  mission: `"To create innovative technology solutions that solve real-world problems and improve people's lives."

At NaniTech, we are driven by the belief that technology should be accessible, intuitive, and beneficial for everyone. Our mission guides our product development, research initiatives, and community engagement.`
};

const launchpadApps = [
  // Desktop apps mirrored here
  { id: 1, name: "NaniVault", icon: "folder", category: "workspace", windowId: "vault" },
  { id: 2, name: "NaniAssist", icon: "terminal", category: "tools", windowId: "assist" },
  { id: 3, name: "Services", icon: "services", category: "delivery", windowId: "services" },
  { id: 4, name: "Activity Bin", icon: "bin", category: "activity", windowId: "activity" },
  { id: 5, name: "Settings", icon: "settings", category: "system", windowId: "settings" },
  // Content/marketing surfaces
  { id: 6, name: "Blog", icon: "blog", category: "content", windowId: "blog" },
  { id: 7, name: "News", icon: "news", category: "content", windowId: "news" },
  // Extras / placeholders
  { id: 8, name: "Projects", icon: "plus-circle", category: "portfolio" },
  { id: 9, name: "Resources", icon: "file", category: "content" },
  { id: 10, name: "Analytics", icon: "chart", category: "tools" },
  { id: 11, name: "Demo", icon: "video", category: "portfolio" },
  { id: 12, name: "Contact", icon: "mail", category: "help" },
  { id: 13, name: "Features", icon: "sparkles", category: "info" }
];

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes

  const requireAuth = (req: any, res: any, next: any) => {
    // Simple guard: replace with real auth when available
    const authorized = Boolean(req.headers["x-authenticated"] || req.headers.cookie?.includes("session="));
    if (!authorized) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  const analyticsLimiter = rateLimit({
    windowMs: 60_000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
  });

  const signals = [
    {
      id: 1,
      title: "The Future of Machine Learning in Africa",
      summary: "Opportunities and constraints for deploying AI on the continent — infra, data, and talent flywheels.",
      tag: "AI",
      eta: "6 min read",
      featured: true,
    },
    {
      id: 2,
      title: "Scaling Your SaaS Startup",
      summary: "A systems view on growth loops, pricing levers, and product velocity.",
      tag: "SaaS",
      eta: "5 min read",
    },
    {
      id: 3,
      title: "Building Robust API Systems",
      summary: "Contracts, versioning, and resilience patterns for modern teams.",
      tag: "Dev",
      eta: "4 min read",
    },
    {
      id: 4,
      title: "The Power of Lean Innovation",
      summary: "Iteration as a strategic advantage when markets shift fast.",
      tag: "Strategy",
      eta: "4 min read",
    },
    {
      id: 5,
      title: "Ethics in AI",
      summary: "Practical guardrails for applied intelligence work.",
      tag: "AI",
      eta: "3 min read",
    },
    {
      id: 6,
      title: "Fintech in Africa",
      summary: "What’s working in emerging ecosystems — rails, risk, reach.",
      tag: "Case Study",
      eta: "5 min read",
    },
    {
      id: 7,
      title: "Unlocking Business Agility",
      summary: "Adaptation patterns for teams in fast-paced environments.",
      tag: "Case Study",
      eta: "6 min read",
    },
  ];

  // Company Info endpoint
  app.get('/api/company-info', (req, res) => {
    res.json(companyInfo);
  });

  // Launchpad apps endpoint
  app.get('/api/launchpad-apps', (req, res) => {
    res.json(launchpadApps);
  });

  // Search apps
  app.get('/api/search-apps', (req, res) => {
    const query = req.query.q?.toString().toLowerCase() || '';
    
    if (!query) {
      return res.json(launchpadApps);
    }

    const filtered = launchpadApps.filter(app => 
      app.name.toLowerCase().includes(query) || 
      app.category.toLowerCase().includes(query)
    );
    
    res.json(filtered);
  });

  // Contact form submission
  app.post('/api/contact', (req, res) => {
    const { name, email, message, type } = req.body;
    
    // In a real application, we would validate and store the contact request
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    // Simulate successful submission
    res.json({ 
      success: true, 
      message: 'Thank you for contacting NaniTech. We will respond shortly.' 
    });
  });

  // OS Settings
  app.get('/api/settings', (req, res) => {
    // Default settings
    res.json({
      darkMode: true,
      animations: true,
      blurEffects: true,
      showDesktopIcons: false,
      dockSettings: {
        magnification: true,
        autoHide: false,
        showLabels: true
      },
      clockSettings: {
        format24h: false,
        showSeconds: false,
        showDate: true
      }
    });
  });

  // Services catalog
  app.get('/api/services', requireAuth, async (_req, res) => {
    try {
      const activeServices = await db
        .select()
        .from(services)
        .where(eq(services.isActive, true))
        .orderBy(services.id);

      res.json(activeServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Failed to fetch services' });
    }
  });

  // Behavioral analytics ingest
  app.post('/api/behavioral-events', analyticsLimiter, requireAuth, async (req, res) => {
    try {
      const { pageKey, events, sessionId } = req.body as { pageKey?: string; sessionId?: string; events?: Array<{ type: string; data?: Record<string, unknown>; ts: number }> };

      if (!pageKey || !Array.isArray(events) || events.length === 0) {
        return res.status(400).json({ message: 'Invalid payload' });
      }

      const resolvedSessionId = sessionId || crypto.randomUUID();

      const rows = events.map(evt => ({
        sessionId: resolvedSessionId,
        pageKey,
        eventType: evt.type,
        data: evt.data ?? null,
        createdAt: new Date(evt.ts || Date.now())
      }));

      await db.insert(behavioralEvents).values(rows);

      res.json({ sessionId: resolvedSessionId, stored: rows.length });
    } catch (error) {
      console.error('Error ingesting behavioral events:', error);
      res.status(500).json({ message: 'Failed to store events' });
    }
  });

  // Blog signals (public for now)
  app.get('/api/signals', (_req, res) => {
    res.json(signals);
  });

  app.post('/api/settings', (req, res) => {
    // In a real application, we would validate and store the settings
    res.json({ 
      success: true, 
      message: 'Settings updated successfully' 
    });
  });

  // Global search API - searches across all content types
  app.get('/api/search', async (req, res) => {
    try {
      const query = req.query.q?.toString() || '';
      
      if (!query.trim()) {
        return res.json([]);
      }

      // Search pattern with wildcard
      const searchPattern = `%${query}%`;
      
      // Search content (articles, blogs, resources)
      const contentResults = await db
        .select({
          id: content.id,
          title: content.title,
          content: content.content,
          type: content.type,
          category: content.category,
          imageUrl: content.imageUrl,
          url: content.type, // We'll convert this to a URL below
        })
        .from(content)
        .where(
          or(
            like(content.title, searchPattern),
            like(content.content, searchPattern),
            like(content.description, searchPattern),
            like(content.category, searchPattern)
          )
        )
        .orderBy(desc(content.id))
        .limit(10);
        
      // Map content results to add proper URLs and snippets
      const mappedContentResults = contentResults.map(item => {
        // Create URL based on content type
        let url = '/';
        if (item.type === 'article') url = `/articles/${item.id}`;
        else if (item.type === 'blog') url = `/blog/${item.id}`;
        else if (item.type === 'news') url = `/news/${item.id}`;
        else if (item.type === 'resource') url = `/resources/${item.id}`;
        
        // Create a text snippet that includes the search term
        let snippet = item.content;
        if (snippet && snippet.length > 200) {
          // Try to find the search term in the content
          const lowerContent = snippet.toLowerCase();
          const lowerQuery = query.toLowerCase();
          const index = lowerContent.indexOf(lowerQuery);
          
          if (index >= 0) {
            // Get content around the search term
            const start = Math.max(0, index - 60);
            const end = Math.min(snippet.length, index + query.length + 60);
            snippet = (start > 0 ? '...' : '') + 
                      snippet.substring(start, end) + 
                      (end < snippet.length ? '...' : '');
          } else {
            // If term not found, just use the beginning
            snippet = snippet.substring(0, 150) + '...';
          }
        }
        
        return {
          ...item,
          url,
          snippet
        };
      });
      
      // Search company team members
      const teamResults = companyInfo.team
        .filter(member => 
          member.name.toLowerCase().includes(query.toLowerCase()) ||
          member.position.toLowerCase().includes(query.toLowerCase())
        )
        .map(member => ({
          id: `team-${member.name.replace(/\s+/g, '-').toLowerCase()}`,
          title: member.name,
          content: `${member.name} - ${member.position}`,
          type: 'team' as const,
          url: '/about#team',
          snippet: `${member.name} is the ${member.position} at NaniTech.`
        }));
      
      // Search apps
      const appResults = launchpadApps
        .filter(app => 
          app.name.toLowerCase().includes(query.toLowerCase()) ||
          app.category.toLowerCase().includes(query.toLowerCase())
        )
        .map(app => ({
          id: `app-${app.id}`,
          title: app.name,
          content: `${app.name} - ${app.category}`,
          type: 'page' as const,
          url: `/${app.name.toLowerCase()}`,
          category: app.category,
          icon: app.icon,
          snippet: `${app.name} - ${app.category} application`
        }));
      
      // Combine all results
      const allResults = [
        ...mappedContentResults,
        ...teamResults,
        ...appResults
      ];
      
      // Sort results by relevance (title matches first, then content)
      allResults.sort((a, b) => {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const queryLower = query.toLowerCase();
        
        // Exact title matches get highest priority
        if (aTitle === queryLower && bTitle !== queryLower) return -1;
        if (bTitle === queryLower && aTitle !== queryLower) return 1;
        
        // Title contains get next priority
        const aTitleContains = aTitle.includes(queryLower);
        const bTitleContains = bTitle.includes(queryLower);
        if (aTitleContains && !bTitleContains) return -1;
        if (bTitleContains && !aTitleContains) return 1;
        
        // Then sort by title length (shorter = more relevant)
        if (aTitleContains && bTitleContains) {
          return aTitle.length - bTitle.length;
        }
        
        return 0;
      });
      
      res.json(allResults);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'An error occurred during search' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
