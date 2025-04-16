import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { content, users, wallpapers, apps, settings } from "@shared/schema";
import { eq, like, or, desc } from "drizzle-orm";

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
  { id: 1, name: "Blog", icon: "document", category: "content" },
  { id: 2, name: "Projects", icon: "plus-circle", category: "portfolio" },
  { id: 3, name: "Resources", icon: "file", category: "content" },
  { id: 4, name: "Analytics", icon: "chart", category: "tools" },
  { id: 5, name: "Demo", icon: "video", category: "portfolio" },
  { id: 6, name: "News", icon: "clock", category: "content" },
  { id: 7, name: "Contact", icon: "mail", category: "help" },
  { id: 8, name: "Features", icon: "sparkles", category: "info" }
];

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes

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
