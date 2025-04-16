import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

  const httpServer = createServer(app);
  return httpServer;
}
