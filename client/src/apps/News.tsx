import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Radio, Timer, ArrowRight, Sparkles, Search, Flame, Network } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type NewsItem = {
  id?: number;
  title: string;
  summary: string;
  tag: string;
  eta: string;
  featured?: boolean;
};

const fallbackNews: NewsItem[] = [
  {
    id: 1,
    title: "AI policy shifts across Africa",
    summary: "A roundup of emerging AI frameworks and how they impact builders.",
    tag: "Policy",
    eta: "3 min read",
    featured: true,
  },
  {
    id: 2,
    title: "Data infra funding climbs",
    summary: "Infra startups in SSA raise to close the latency gap.",
    tag: "Funding",
    eta: "2 min read",
  },
  {
    id: 3,
    title: "Edge compute pilots roll out",
    summary: "Early results from distributed edge trials for fintech workloads.",
    tag: "Infra",
    eta: "2 min read",
  },
];

const filters = ["All", "Policy", "Funding", "Infra", "AI", "Product"] as const;

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/signals")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load news");
        return res.json();
      })
      .then((data: NewsItem[]) => setNews(data))
      .catch(() => {
        setNews(fallbackNews);
        toast({ title: "Using fallback news", description: "Live news unavailable. Showing cached defaults." });
      });
  }, []);

  const filtered = useMemo(() => {
    return news.filter((item) => {
      const byFilter = activeFilter === "All" || item.tag.toLowerCase() === activeFilter.toLowerCase();
      const bySearch =
        search.trim().length === 0 ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.summary.toLowerCase().includes(search.toLowerCase());
      return byFilter && bySearch;
    });
  }, [news, activeFilter, search]);

  const featured = filtered.find((n) => n.featured) ?? filtered[0];
  const rest = filtered.filter((n) => n !== featured);

  return (
    <div className="h-full w-full bg-[#0b0f17] text-[#f5f6fa] overflow-y-auto p-6 custom-scrollbar relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_10%_15%,rgba(0,168,255,0.12),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.05),transparent_30%)]" />

      <div className="relative mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#00e0ff]">Signal // News</p>
          <h1 className="text-3xl font-bold">Realtime Signals & Briefings</h1>
          <p className="text-[#c8d6e5] mt-2">Curated updates across AI, SaaS, infra, and strategy.</p>
        </div>
        <div className="flex gap-2 items-center bg-[#111827] border border-white/10 px-3 py-2 rounded-lg w-full md:w-72">
          <Search size={16} className="text-[#c8d6e5]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search briefs..."
            className="bg-transparent text-sm w-full focus:outline-none text-white placeholder:text-[#6b7280]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
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

      {featured && (
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#10182b] via-[#0f1729] to-[#0b1324] mb-6 p-6 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.8)]"
          whileHover={{ y: -3 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,168,255,0.18),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(255,255,255,0.08),transparent_30%)]" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-[#00a8ff]/20 text-[#00e0ff] border border-[#00e0ff]/30 mb-3">
              <Radio size={14} /> {featured.tag}
            </span>
            <h2 className="text-2xl font-bold mb-2 text-white">{featured.title}</h2>
            <p className="text-[#c8d6e5] max-w-3xl mb-4">{featured.summary}</p>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#00e0ff]">
              Read brief <ArrowRight size={14} />
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {rest.map((item, idx) => (
          <motion.div
            key={item.title + idx}
            className="group rounded-2xl border border-white/10 bg-[#111827]/80 p-4 backdrop-blur"
            whileHover={{ y: -3, scale: 1.003 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-1 text-[11px] rounded-full bg-[#00a8ff]/15 text-[#00d1ff] border border-[#00a8ff]/30">{item.tag}</span>
              <span className="text-[11px] text-[#94a3b8] flex items-center gap-1"><Timer size={12} /> {item.eta}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
            <p className="text-sm text-[#c8d6e5] leading-relaxed mb-3 line-clamp-2">{item.summary}</p>
            <div className="flex items-center gap-1 text-[#00a8ff] text-sm font-semibold opacity-0 group-hover:opacity-100 transition">
              <span>Preview</span>
              <ArrowRight size={14} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#111827]/80 p-4 backdrop-blur">
        <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-white">
          <Flame size={16} className="text-[#ff7b7b]" /> Live Signals
        </div>
        <p className="text-sm text-[#c8d6e5]">Hook this to your newsroom feed, RSS, or CMS when ready. Current list is static placeholder.</p>
      </div>
    </div>
  );
}
