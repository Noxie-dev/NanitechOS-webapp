import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Cpu, 
  Code2, 
  Sparkles, 
  Layers, 
  TerminalSquare,
  ArrowRight,
  Activity,
  X,
  Target,
  Clock,
  MousePointer2,
  BarChart3
} from 'lucide-react';
import { useBehavioralAnalytics } from '../hooks/useBehavioralAnalytics';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

const serviceCards = [
  {
    title: "AI Product Design",
    description: "Futuristic, intuitive interfaces built from the ground up. We design for the modern web, ensuring your users experience seamless, captivating journeys.",
    icon: Sparkles,
    color: "from-[#00a8ff]/20 to-transparent",
    borderColor: "group-hover:border-[#00a8ff]/50"
  },
  {
    title: "Custom SaaS & Apps",
    description: "Robust, scalable software architecture. We build web and mobile applications that don't just function, but dominate their market spaces.",
    icon: Code2,
    color: "from-[#3c6382]/30 to-transparent",
    borderColor: "group-hover:border-[#3c6382]/50"
  },
  {
    title: "Applied AI Integration",
    description: "Moving beyond the 'noise' of AI. We integrate real, useful artificial intelligence to solve actual business problems and increase your ROI.",
    icon: Cpu,
    color: "from-teal-500/20 to-transparent",
    borderColor: "group-hover:border-teal-500/50"
  },
  {
    title: "Platform Modernization",
    description: "Transform legacy systems into high-performance, modern tech stacks. Future-proof your business with cutting-edge runtime and cloud integrations.",
    icon: Layers,
    color: "from-purple-500/20 to-transparent",
    borderColor: "group-hover:border-purple-500/50"
  }
];

export default function ServicesApp() {
  const { showModal, setShowModal, analyticsResult } = useBehavioralAnalytics("services");

  return (
    <div className="h-full w-full overflow-y-auto bg-[#1a2634] text-[#f5f6fa] custom-scrollbar selection:bg-[#00a8ff]/30">
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-20">
        
        {/* HERO SECTION */}
        <motion.section 
          id="hero"
          data-track-section
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center space-y-6 max-w-4xl mx-auto pt-8"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a3d52]/50 border border-[#3c6382]/30 text-[#00a8ff] text-sm font-medium tracking-wide">
            <Sparkles size={16} />
            <span>NaniTech Capability Showcase</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-bold tracking-tight">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] to-teal-400">Intelligence</span> <br className="hidden md:block"/> Into Digital Products
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg text-[#c8d6e5] max-w-2xl mx-auto leading-relaxed">
            We don't just build software. We architect modern, futuristic applications with AI integrated from the ground up—designed to increase revenue, filter the noise, and solve real-world problems.
          </motion.p>
          
          <motion.div variants={itemVariants} className="pt-4">
            <button data-interactive="true" className="px-8 py-4 bg-[#00a8ff] hover:bg-[#00a8ff]/90 text-white rounded-lg font-medium transition-colors shadow-[0_0_20px_rgba(0,168,255,0.3)]">
              Initiate Project
            </button>
          </motion.div>
        </motion.section>

        {/* AIE (AUTO INITIAL ENGAGEMENT) SHOWCASE */}
        <motion.section
          id="aie-core"
          data-track-section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-[#3c6382]/30 bg-[#2a3d52]/20 backdrop-blur-xl overflow-hidden shadow-[0_0_40px_rgba(0,168,255,0.05)]"
        >
          {/* Animated Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00a8ff]/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12">
            <div className="space-y-6 z-10">
              <div className="flex items-center gap-3 text-[#00a8ff] mb-4">
                <Bot size={28} />
                <h2 className="text-2xl font-bold text-white">Auto Initial Engagement (AIE)</h2>
              </div>
              <p className="text-[#c8d6e5] leading-relaxed">
                Our proprietary AIE system detects, screens, and engages leads autonomously. It calculates a <strong className="text-white">"likelihood to convert"</strong> score using site activity, analytics, and active engagement time.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "Intelligent Noise Filtering",
                  "Real-time Lead Qualification",
                  "Actionable ROI Generation"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-[#f5f6fa]">
                    <div className="h-2 w-2 rounded-full bg-[#00a8ff] shadow-[0_0_8px_#00a8ff]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Terminal / Code Visual */}
            <div className="relative rounded-xl bg-[#1a2634] border border-white/5 p-6 font-mono text-sm shadow-inner z-10 flex flex-col justify-center">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="space-y-3 text-gray-400">
                <p className="flex items-center gap-2"><TerminalSquare size={14} className="text-[#00a8ff]"/> <span className="text-white">Analyzing traffic patterns...</span></p>
                <p className="pl-6 text-teal-400">&gt; Lead detected: ID_78492</p>
                <p className="pl-6 text-purple-400">&gt; Initiating AIE protocol...</p>
                <p className="pl-6">&gt; Calculating conversion probability...</p>
                <div className="pl-6 flex items-center gap-2">
                  <span>&gt; Result:</span>
                  <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-bold">87% LIKELY</span>
                </div>
                <p className="pl-6 text-[#00a8ff]">&gt; Routing to sales pod.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SERVICES GRID */}
        <section id="services-grid" data-track-section>
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-4">Our Core Nodes</h2>
            <p className="text-[#c8d6e5]">Specialist delivery pods engineered for maximum impact.</p>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {serviceCards.map((service, index) => (
              <motion.div
                key={index}
                data-interactive="true"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.01 }}
                className={`group relative p-8 rounded-2xl bg-[#2a3d52]/40 backdrop-blur-sm border border-white/5 ${service.borderColor} transition-colors duration-300 overflow-hidden cursor-pointer`}
              >
                {/* Gradient background that shows on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="h-12 w-12 rounded-lg bg-[#1a2634] border border-white/10 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(0,168,255,0.2)] transition-shadow duration-300">
                    <service.icon className="text-[#00a8ff]" size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{service.title}</h3>
                  <p className="text-[#c8d6e5] text-sm leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[#00a8ff] text-sm font-medium mt-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span>Explore capability</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FOOTER PADDING */}
        <div className="h-12" />
      </div>

      {/* MINI AIE MODAL */}
      <AnimatePresence>
        {showModal && analyticsResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1a2634]/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#1a2634] border border-[#3c6382]/50 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00a8ff] to-teal-400" />
              
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2 text-[#00a8ff]">
                  <Activity size={20} />
                  <span className="font-mono text-sm font-bold tracking-wider">AIE // BEHAVIORAL SNAPSHOT</span>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between bg-[#2a3d52]/30 rounded-xl p-4 border border-white/5">
                  <div>
                    <p className="text-xs text-gray-400 font-mono mb-1">ENGAGEMENT SCORE</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white">{analyticsResult.engagementScore}</span>
                      <span className="text-sm text-[#00a8ff]">/ 100</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 font-mono mb-1">CLASSIFICATION</p>
                    <span className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium">
                      {analyticsResult.classification}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                      <Clock size={14} /> TIME ON PAGE
                    </div>
                    <p className="text-lg font-medium text-white">{analyticsResult.timeOnPage}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                      <BarChart3 size={14} /> MAX SCROLL
                    </div>
                    <p className="text-lg font-medium text-white">{analyticsResult.maxScroll}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                      <MousePointer2 size={14} /> INTERACTIVE CLICKS
                    </div>
                    <p className="text-lg font-medium text-white">{analyticsResult.interactiveClicks}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                      <Target size={14} /> TOP SECTION
                    </div>
                    <p className="text-lg font-medium text-white truncate" title={analyticsResult.topSection}>
                      {analyticsResult.topSection}
                    </p>
                  </div>
                </div>

                <div className="bg-[#00a8ff]/10 border border-[#00a8ff]/20 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm text-[#c8d6e5]">Simulated Conversion Probability</span>
                  <span className="text-xl font-bold text-[#00a8ff]">{analyticsResult.simulatedConversion}</span>
                </div>
              </div>

              <div className="bg-[#151e29] p-4 text-center border-t border-white/5">
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                  This is a simplified behavioral analytics preview running locally in your browser.
                  Our deployed AIE systems provide deeper cross-session and CRM-integrated intelligence.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
