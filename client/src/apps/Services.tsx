import React from "react";
import { motion } from "framer-motion";
import { getIconByName } from "@/assets/Icons";

const services = [
  {
    title: "AI Product Design",
    description:
      "Blueprint, prototype, and validate AI-first products with production-ready architectures.",
    icon: "sparkles",
    hue: "from-blue-500/20 to-cyan-500/10",
  },
  {
    title: "Platform Modernization",
    description:
      "Refactor legacy systems into scalable, cloud-ready services with clean contracts.",
    icon: "settings",
    hue: "from-purple-500/20 to-pink-500/10",
  },
  {
    title: "Data & Analytics",
    description:
      "Build reliable data pipelines, feature stores, and decision dashboards that ship insights fast.",
    icon: "chart",
    hue: "from-amber-500/20 to-orange-500/10",
  },
  {
    title: "DevOps & Reliability",
    description:
      "Automate deploys, observability, and SRE guardrails so teams move quickly without outages.",
    icon: "shield",
    hue: "from-emerald-500/20 to-teal-500/10",
  },
  {
    title: "Product Advisory",
    description:
      "Hands-on technical leadership for roadmaps, architecture reviews, and build-vs-buy decisions.",
    icon: "academic",
    hue: "from-rose-500/20 to-red-500/10",
  },
];

const Services: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-warning">What we do</p>
          <h1 className="text-3xl font-black text-white">Services built for momentum</h1>
          <p className="text-sm text-light-secondary mt-2">
            AI-led product teams, engineered for speed, stability, and measurable impact.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-light-secondary">
          {getIconByName("sparkles", { size: "md", className: "text-warning" })}
          <span>Human + AI delivery</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((svc, idx) => (
          <motion.div
            key={svc.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${svc.hue} backdrop-blur-md p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]`}
          >
            <div className="absolute inset-0 bg-white/2 opacity-10 mix-blend-overlay pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                {getIconByName(svc.icon, { size: "md", className: "text-white" })}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{svc.title}</h3>
                <p className="text-xs text-light-secondary">Specialist delivery pods</p>
              </div>
            </div>
            <p className="text-sm text-light-secondary mt-4 leading-relaxed">
              {svc.description}
            </p>
            <div className="mt-5 flex items-center justify-between text-xs text-warning">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
                High-touch sprints
              </span>
              <span className="text-light-secondary/80">Week-long progress demos</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Services;
