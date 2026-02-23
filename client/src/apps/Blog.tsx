import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  PenLine,
  FolderOpen,
  BookOpen,
  Timer,
  ArrowRight,
  Search,
  Flame,
  Network,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Post = {
  title: string;
  summary: string;
  tag: string;
  eta: string;
  featured?: boolean;
  id?: number;
};

const filters = ["All", "AI", "SaaS", "Dev", "Strategy", "Case Study"] as const;

const defaultSignals: Post[] = [
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

export default function Blog() {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/signals")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load signals");
        return res.json();
      })
      .then((data: Post[]) => setPosts(data))
      .catch(() => {
        setPosts(defaultSignals);
        toast({
          title: "Using fallback signals",
          description: "Live signals unavailable. Showing cached defaults.",
          variant: "default",
        });
      });
  }, []);

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchesFilter = activeFilter === "All" || post.tag.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch =
        search.trim().length === 0 ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.summary.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search]);

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p !== featured);

  return (
    <div className="h-full w-full bg-[#0b0f17] text-[#f5f6fa] overflow-y-auto p-6 custom-scrollbar relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(0,168,255,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.07),transparent_30%)]" />

      {/* Hero */}
      <div className="relative mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#00e0ff]">Signal</p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Ideas, Systems, Strategy & AI Insights
            </h1>
            <p className="text-[#c8d6e5] mt-2">
              Where we break down AI, SaaS, systems & African tech innovation.
            </p>
          </div>
          <div className="flex gap-2 items-center bg-[#111827] border border-white/10 px-3 py-2 rounded-lg w-full md:w-72">
            <Search size={16} className="text-[#c8d6e5]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search signals..."
              className="bg-transparent text-sm w-full focus:outline-none text-white placeholder:text-[#6b7280]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {filters.map((filter) => (
            <motion.button
              key={filter}
              whileHover={{ y: -2, boxShadow: "0 0 15px rgba(0,168,255,0.25)" }}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                activeFilter === filter
                  ? "bg-[#00a8ff]/20 border-[#00a8ff]/50 text-white"
                  : "bg-white/5 border-white/10 text-[#c8d6e5]"
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Featured */}
      {featured && (
        <motion.div
          layout
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#10182b] via-[#0f1729] to-[#0b1324] mb-8 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.8)]"
          whileHover={{ y: -4, boxShadow: "0 20px 80px -50px rgba(0,168,255,0.3)" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(0,168,255,0.18),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.08),transparent_30%)]" />
          <div className="p-6 md:p-8 relative">
            <span className="inline-block px-3 py-1 text-xs rounded-full bg-[#00a8ff]/20 text-[#00e0ff] font-semibold border border-[#00e0ff]/30 mb-3">
              {featured.tag} Insight
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white drop-shadow-md">{featured.title}</h2>
            <p className="text-[#c8d6e5] max-w-3xl mb-5">{featured.summary}</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-white hover:bg-[#00a8ff]/20 transition">
              Read Signal <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 grid gap-4 md:grid-cols-3 auto-rows-[1fr]">
          {rest.map((post, idx) => (
            <motion.div
              key={post.title}
              className={`group relative rounded-2xl border border-white/10 bg-[#111827]/80 p-4 backdrop-blur ${
                idx % 3 === 0 ? "md:col-span-2" : ""
              }`}
              whileHover={{ y: -3, scale: 1.003 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 text-[11px] rounded-full bg-[#00a8ff]/15 text-[#00d1ff] border border-[#00a8ff]/30">
                  {post.tag}
                </span>
                <span className="text-[11px] text-[#94a3b8] flex items-center gap-1">
                  <Timer size={12} /> {post.eta}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{post.title}</h3>
              <p className="text-sm text-[#c8d6e5] leading-relaxed mb-3 line-clamp-2">{post.summary}</p>
              <div className="flex items-center gap-1 text-[#00a8ff] text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
                <span>AI preview: {post.summary.slice(0, 32)}...</span>
                <ArrowRight size={14} />
              </div>
              <div className="absolute inset-x-4 bottom-2 h-px bg-gradient-to-r from-transparent via-[#00a8ff]/40 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          {/* Trending Signals */}
          <div className="rounded-2xl border border-white/10 bg-[#111827]/80 p-4 backdrop-blur">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-white">
              <Flame size={16} className="text-[#ff7b7b]" /> Trending Signals
            </div>
            <ul className="space-y-2 text-sm text-[#c8d6e5]">
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#ff7b7b]" /> Hot Topic One</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#00e0ff]" /> Emerging Trend Two</li>
              <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#a855f7]" /> Startup Tip Three</li>
            </ul>
          </div>

          {/* Founder's Notes */}
          <div className="rounded-2xl border border-white/10 bg-[#111827]/80 p-4 backdrop-blur">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-white">
              <PenLine size={16} className="text-[#00e0ff]" /> Founder's Notes
            </div>
            <p className="text-sm text-[#c8d6e5] leading-relaxed">
              “We publish systems thinking, not hot takes. Every signal is tied to delivery lessons from the field.”
            </p>
          </div>

          {/* Signal Map teaser */}
          <div className="rounded-2xl border border-white/10 bg-[#0f1627] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Network size={16} className="text-[#00e0ff]" /> Signal Map
            </div>
            <div className="flex flex-wrap gap-2">
              {["AI", "SaaS", "Strategy", "Dev", "Case Study"].map((node) => (
                <motion.button
                  key={node}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-[#c8d6e5]"
                >
                  {node}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prep panel */}
      <motion.div
        className="mt-6 rounded-2xl bg-[#111827]/80 border border-white/10 p-5 backdrop-blur shadow-[0_15px_50px_-40px_rgba(0,0,0,0.7)]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-3 mb-3">
          <Sparkles className="text-[#00a8ff]" size={18} />
          <div>
            <p className="text-sm text-[#c8d6e5]">Editorial staging</p>
            <h2 className="text-lg font-semibold text-white">Prep for upcoming articles</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-[#c8d6e5]">
          <div className="flex items-center gap-2"><PenLine size={16} className="text-[#00a8ff]" /> Markdown/MDX compatible</div>
          <div className="flex items-center gap-2"><FolderOpen size={16} className="text-[#00a8ff]" /> Hook to CMS/API later</div>
          <div className="flex items-center gap-2"><Timer size={16} className="text-[#00a8ff]" /> Draft → Review → Publish</div>
        </div>
      </motion.div>
    </div>
  );
}
