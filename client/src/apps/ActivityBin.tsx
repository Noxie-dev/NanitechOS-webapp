import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getIconByName } from "@/assets/Icons";

type Activity = {
  id: string;
  user: string;
  action: string;
  detail: string;
  timestamp: number;
};

const STORAGE_KEY = "nanios_activity_log";

const generateSample = (): Activity[] => {
  const now = Date.now();
  const actions = [
    "Opened Services",
    "Viewed Mission & Values",
    "Launched NaniAssist",
    "Updated settings",
    "Explored Launchpad",
    "Browsed NaniVault",
  ];
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `seed-${i}`,
    user: "Guest",
    action: actions[i % actions.length],
    detail: "Auto-sampled activity",
    timestamp: now - i * 1000 * 60 * 5,
  }));
};

const ActivityBin: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tracking, setTracking] = useState(true);
  const [autoClearOnClose, setAutoClearOnClose] = useState(false);

  // Load persisted state
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setActivities(JSON.parse(stored));
    } else {
      const sample = generateSample();
      setActivities(sample);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
    }
    const autoClear = localStorage.getItem(`${STORAGE_KEY}_autoclear`);
    if (autoClear) setAutoClearOnClose(autoClear === "true");
  }, []);

  // Persist on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    const handler = () => {
      if (autoClearOnClose) {
        localStorage.removeItem(STORAGE_KEY);
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [autoClearOnClose]);

  const recent = useMemo(
    () => activities.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10),
    [activities]
  );

  const clearActivities = () => setActivities([]);

  return (
    <div className="p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-warning">Recent activity</p>
          <h1 className="text-3xl font-black text-white">Activity Bin</h1>
          <p className="text-sm text-light-secondary">
            The last 10 actions per user, with playful visuals and quick controls.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setTracking((t) => !t)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
              tracking ? "border-success text-success" : "border-warning text-warning"
            } bg-white/5 hover:bg-white/10 transition`}
          >
            {tracking ? "Stop Activity Tracker" : "Resume Tracking"}
          </button>
          <button
            onClick={clearActivities}
            className="px-3 py-2 rounded-lg text-xs font-semibold border border-error text-error bg-white/5 hover:bg-white/10 transition"
          >
            Clear Activity
          </button>
          <label className="flex items-center gap-2 text-xs text-light-secondary bg-white/5 px-3 py-2 rounded-lg border border-white/10 cursor-pointer">
            <input
              type="checkbox"
              checked={autoClearOnClose}
              onChange={(e) => {
                setAutoClearOnClose(e.target.checked);
                localStorage.setItem(`${STORAGE_KEY}_autoclear`, String(e.target.checked));
              }}
              className="accent-warning"
            />
            Auto-clear on close
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            {getIconByName("bin", { size: "md", className: "text-error" })}
            <h3 className="text-lg font-semibold text-white">Timeline</h3>
          </div>
          <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
            <AnimatePresence initial={false}>
              {recent.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-start gap-3 rounded-xl border border-white/5 bg-dark/50 p-3 shadow-lg"
                >
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-warning animate-ping" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm font-semibold">{item.action}</span>
                      <span className="text-[10px] text-light-secondary">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-light-secondary mt-1">{item.detail}</p>
                    <p className="text-[10px] text-warning mt-1">User: {item.user}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {!recent.length && <p className="text-light-secondary text-sm">No activity yet.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-accent/10 via-white/5 to-warning/10 backdrop-blur-xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5 blur-3xl opacity-10 pointer-events-none" />
          <div className="relative space-y-3">
            <div className="flex items-center gap-2">
              {getIconByName("services", { size: "md", className: "text-white" })}
              <h3 className="text-lg font-semibold text-white">Live pulse</h3>
            </div>
            <p className="text-sm text-light-secondary">
              Animated stripes visualize the recency of activity. Brighter bars = newer actions.
            </p>
            <div className="grid grid-cols-5 gap-2 mt-4">
              {recent.map((item, idx) => {
                const freshness = Math.max(0.2, 1 - idx * 0.08);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    className="rounded-lg bg-gradient-to-b from-warning to-error origin-bottom h-32 shadow-lg"
                    style={{ opacity: freshness }}
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(30, 100 - idx * 7)}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.05 }}
                      className="w-full bg-white/30 rounded-b-lg"
                    />
                    <p className="text-[10px] text-center text-white/80 mt-1 px-1 line-clamp-2">
                      {item.action}
                    </p>
                  </motion.div>
                );
              })}
              {recent.length === 0 && (
                <div className="col-span-5 text-center text-light-secondary text-sm">
                  No recent activity to visualize.
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-light-secondary mt-3">
              <span className="h-2 w-2 rounded-full bg-warning animate-pulse" /> Tracking is {tracking ? "on" : "paused"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityBin;
