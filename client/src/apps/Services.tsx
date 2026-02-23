import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import * as Icons from 'lucide-react';
import { 
  Bot, 
  Sparkles, 
  TerminalSquare,
  ArrowRight,
  Activity,
  X,
  Target,
  Clock,
  MousePointer2,
  BarChart3,
  Loader2
} from 'lucide-react';
import { useBehavioralAnalytics } from '../hooks/useBehavioralAnalytics';
import { apiRequest } from '../lib/queryClient';

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

const DynamicIcon = ({ name, className, size }: { name: string; className?: string; size?: number }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    const Fallback = (Icons as any)["Box"];
    return <Fallback className={className} size={size} />;
  }
  return <IconComponent className={className} size={size} />;
};

export default function ServicesApp() {
  const { showModal, setShowModal, analyticsResult, trackEvent, eventLog } = useBehavioralAnalytics("services");
  const [loadError, setLoadError] = useState<Error | null>(null);

  const { data: serviceCards = [], isLoading, isError, error } = useQuery({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/services");
      return res.json();
    },
    initialData: [
      {
        id: 1,
        title: "AI Product Design",
        description: "Futuristic, intuitive interfaces built from the ground up. We design for the modern web, ensuring your users experience seamless, captivating journeys.",
        icon: "Sparkles",
        color: "from-[#00a8ff]/20 to-transparent",
        borderColor: "group-hover:border-[#00a8ff]/50"
      },
      {
        id: 2,
        title: "Custom SaaS & Apps",
        description: "Robust, scalable software architecture. We build web and mobile applications that don't just function, but dominate their market spaces.",
        icon: "Code2",
        color: "from-[#3c6382]/30 to-transparent",
        borderColor: "group-hover:border-[#3c6382]/50"
      },
      {
        id: 3,
        title: "Applied AI Integration",
        description: "Moving beyond the 'noise' of AI. We integrate real, useful artificial intelligence to solve actual business problems and increase your ROI.",
        icon: "Cpu",
        color: "from-teal-500/20 to-transparent",
        borderColor: "group-hover:border-teal-500/50"
      },
      {
        id: 4,
        title: "Platform Modernization",
        description: "Transform legacy systems into high-performance, modern tech stacks. Future-proof your business with cutting-edge runtime and cloud integrations.",
        icon: "Layers",
        color: "from-purple-500/20 to-transparent",
        borderColor: "group-hover:border-purple-500/50"
      }
    ],
    retry: false,
  });

  React.useEffect(() => {
    if (isError && error) setLoadError(error as Error);
    if (!isError) setLoadError(null);
  }, [isError, error]);

  // Prioritize error view over any stale/initial data
  const derivedError = loadError ?? (isError ? error ?? new Error("Failed to load services data.") : null);
  const safeServices = derivedError ? [] : serviceCards;
  const [showInitConsole, setShowInitConsole] = useState(false);
  const [initPhase, setInitPhase] = useState<'boot' | 'form' | 'confirmed'>('boot');
  const [bootStep, setBootStep] = useState(0);
  const [selectedBuildType, setSelectedBuildType] = useState<string | null>(null);
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null);

  // Map services to suggested build types so cards feel like system actions
  const buildTypeByService = useMemo(() => ({
    'AI Product Design': 'SaaS Platform',
    'Custom SaaS & Apps': 'Custom App',
    'Applied AI Integration': 'AI Integration',
    'Platform Modernization': 'Platform Modernization'
  }) as Record<string, string>, []);

  // Drive the boot → form phase transition
  useEffect(() => {
    if (!showInitConsole) return;

    setInitPhase('boot');
    setBootStep(0);

    const timers = [
      setTimeout(() => setBootStep(1), 400),
      setTimeout(() => setBootStep(2), 850),
      setTimeout(() => setBootStep(3), 1250),
      setTimeout(() => setInitPhase('form'), 1800)
    ];

    return () => timers.forEach(clearTimeout);
  }, [showInitConsole]);

  const resetForm = () => {
    setSelectedBuildType(null);
    setSelectedObjective(null);
    setSelectedTimeline(null);
  };

  const openConsole = (buildType?: string | null, source?: string) => {
    if (buildType) setSelectedBuildType(buildType);
    if (source) trackEvent('open_console', { source, buildType });
    setShowInitConsole(true);
  };

  const handleSubmit = () => {
    setInitPhase('confirmed');
    trackEvent('submit_init_request', {
      buildType: selectedBuildType,
      objective: selectedObjective,
      timeline: selectedTimeline
    });
    setTimeout(() => {
      setShowInitConsole(false);
      setInitPhase('boot');
      resetForm();
    }, 2300);
  };

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
            <motion.button
              data-interactive="true"
              whileHover={{ scale: 1.02, boxShadow: '0 0 26px rgba(0,168,255,0.45)' }}
              whileTap={{ scale: 0.98, boxShadow: '0 0 22px rgba(0,168,255,0.35)' }}
              onClick={() => {
                resetForm();
                openConsole(null, 'cta');
              }}
              className="px-8 py-4 bg-[#00a8ff] text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(0,168,255,0.3)]"
            >
              Initiate Project
            </motion.button>
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
          
          {derivedError ? (
            <div className="text-center text-red-400 py-10" role="alert">
              Failed to load services data.
              <div className="text-xs text-red-300 mt-2">{derivedError.message}</div>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center items-center py-20 text-[#00a8ff]" role="status">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : safeServices.length === 0 ? (
            <div className="text-center text-gray-300 py-10" role="alert">
              No services available.
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {safeServices.map((service: any) => (
                <motion.div
                  key={service.id}
                  data-interactive="true"
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.01 }}
                  onClick={() => openConsole(buildTypeByService[service.title] || undefined, service.title)}
                  className={`group relative p-8 rounded-2xl bg-[#2a3d52]/40 backdrop-blur-sm border border-white/5 ${service.borderColor} transition-colors duration-300 overflow-hidden cursor-pointer`}
                >
                  {/* Gradient background that shows on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="h-12 w-12 rounded-lg bg-[#1a2634] border border-white/10 flex items-center justify-center mb-6 group-hover:shadow-[0_0_20px_rgba(0,168,255,0.2)] transition-shadow duration-300">
                      <DynamicIcon name={service.icon} className="text-[#00a8ff]" size={24} />
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
          )}
        </section>

        {/* FOOTER PADDING */}
        <div className="h-12" />
      </div>

      {/* PROJECT INITIALIZATION CONSOLE */}
      <AnimatePresence>
        {showInitConsole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1220]/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.94, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 12, opacity: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 18 }}
              className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-[#111927]/95 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#00a8ff]/10 via-transparent to-[#00a8ff]/5" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00a8ff] via-teal-400 to-[#00a8ff]" />

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0c1523]/80 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-warning">Project Initialization Protocol</p>
                    <p className="text-sm text-light-secondary">System-level engagement console</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInitConsole(false)}
                  className="text-light-secondary hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Boot animation */}
              {initPhase === 'boot' && (
                <div className="px-6 pt-4 pb-6 text-sm font-mono text-light-secondary space-y-3">
                  {["Establishing connection…", "Preparing requirements intake…", "Initializing engagement sequence…"].map((line, idx) => (
                    <div key={line} className="flex items-center gap-2">
                      {bootStep > idx ? <TerminalSquare size={14} className="text-[#00a8ff]" /> : <Loader2 size={14} className="text-[#00a8ff] animate-spin" />}
                      <span className="text-white">{line}</span>
                    </div>
                  ))}
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#00a8ff] via-teal-400 to-[#00a8ff]"
                      initial={{ width: '0%' }}
                      animate={{ width: bootStep >= 3 ? '100%' : `${bootStep * 33}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              )}

              {/* Form */}
              {initPhase === 'form' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 py-6 animate-fade-in">
                  <div className="col-span-1 md:col-span-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-warning mb-2">Step 1 — Build Type</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["SaaS Platform", "Custom App", "AI Integration", "Platform Modernization"].map((opt) => (
                        <label key={opt} className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition ${selectedBuildType === opt ? 'border-[#00a8ff] text-white bg-[#00a8ff]/10' : 'border-white/10 bg-white/5 text-light-secondary hover:border-[#00a8ff]/50 hover:text-white'}`}>
                          <input
                            type="radio"
                            name="buildType"
                            value={opt}
                            className="mr-2 accent-[#00a8ff]"
                            checked={selectedBuildType === opt}
                            onChange={() => setSelectedBuildType(opt)}
                          /> {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-warning mb-2">Step 2 — Business Objective</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {["Increase Revenue", "Automate Operations", "Generate Leads", "Reduce Costs", "Modernize Infrastructure", "Other"].map((opt) => (
                        <label key={opt} className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition ${selectedObjective === opt ? 'border-[#00a8ff] text-white bg-[#00a8ff]/10' : 'border-white/10 bg-white/5 text-light-secondary hover:border-[#00a8ff]/50 hover:text-white'}`}>
                          <input
                            type="radio"
                            name="objective"
                            value={opt}
                            className="mr-2 accent-[#00a8ff]"
                            checked={selectedObjective === opt}
                            onChange={() => setSelectedObjective(opt)}
                          /> {opt}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-warning mb-2">Step 3 — Timeline</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {["Exploration Phase", "3–6 Months", "6–12 Months", "Strategic Partnership"].map((opt) => (
                        <label key={opt} className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition ${selectedTimeline === opt ? 'border-[#00a8ff] text-white bg-[#00a8ff]/10' : 'border-white/10 bg-white/5 text-light-secondary hover:border-[#00a8ff]/50 hover:text-white'}`}>
                          <input
                            type="radio"
                            name="timeline"
                            value={opt}
                            className="mr-2 accent-[#00a8ff]"
                            checked={selectedTimeline === opt}
                            onChange={() => setSelectedTimeline(opt)}
                          /> {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {initPhase === 'form' && (
                <div className="px-6 pb-6 flex justify-between items-center">
                  <p className="text-xs text-light-secondary">System will register this request with our delivery pod.</p>
                  <button
                    disabled={!selectedBuildType || !selectedObjective || !selectedTimeline}
                    className="px-6 py-3 rounded-lg bg-[#00a8ff] hover:bg-[#00a8ff]/90 disabled:bg-white/10 disabled:text-gray-400 text-white text-sm font-semibold shadow-[0_0_20px_rgba(0,168,255,0.25)] transition"
                    onClick={handleSubmit}
                  >
                    Submit Request
                  </button>
                </div>
              )}

              {initPhase === 'confirmed' && (
                <div className="px-6 py-10 space-y-4 text-center animate-fade-in">
                  <div className="mx-auto h-14 w-14 rounded-full bg-[#00a8ff]/20 border border-[#00a8ff]/40 flex items-center justify-center">
                    <Sparkles className="text-[#00a8ff]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Request Registered</h3>
                  <p className="text-light-secondary max-w-md mx-auto">Our engineering pod will assess feasibility within 24 hours and initiate the engagement sequence.</p>
                  <div className="flex justify-center gap-3 text-xs text-light-secondary font-mono">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Build: {selectedBuildType || '—'}</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Objective: {selectedObjective || '—'}</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Timeline: {selectedTimeline || '—'}</span>
                  </div>
                  <div className="max-h-32 overflow-y-auto text-left bg-white/5 border border-white/10 rounded-lg p-3 mt-2 text-[11px] text-light-secondary font-mono">
                    {eventLog.slice(-6).map((evt, idx) => (
                      <div key={idx} className="flex items-center gap-2 py-0.5">
                        <span className="text-[#00a8ff]">•</span>
                        <span>{evt.type}</span>
                        {evt.data && <span className="text-gray-400">{JSON.stringify(evt.data)}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
