import { useEffect, useRef, useState } from 'react';

interface SectionMetrics {
  enterTime: number | null;
  totalDwellTime: number;
  visits: number;
}

interface InteractionMetrics {
  pageStartTime: number;
  totalTime: number;
  maxScrollPercent: number;
  clickCount: number;
  hoverCount: number;
  interactiveClicks: number;
  sectionMetrics: Record<string, SectionMetrics>;
  events: Array<{ type: string; data?: Record<string, unknown>; ts: number }>;
}

export interface AnalyticsResult {
  engagementScore: number;
  classification: string;
  timeOnPage: string;
  maxScroll: string;
  interactiveClicks: number;
  topSection: string;
  simulatedConversion: string;
}

export function useBehavioralAnalytics(pageKey: string = "default") {
  const [showModal, setShowModal] = useState(false);
  const [analyticsResult, setAnalyticsResult] = useState<AnalyticsResult | null>(null);
  const [eventLog, setEventLog] = useState<Array<{ type: string; data?: Record<string, unknown>; ts: number }>>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const metricsRef = useRef<InteractionMetrics>({
    pageStartTime: Date.now(),
    totalTime: 0,
    maxScrollPercent: 0,
    clickCount: 0,
    hoverCount: 0,
    interactiveClicks: 0,
    sectionMetrics: {},
    events: []
  });

  // Reset metrics when the pageKey changes (e.g., route change)
  useEffect(() => {
    metricsRef.current = {
      pageStartTime: Date.now(),
      totalTime: 0,
      maxScrollPercent: 0,
      clickCount: 0,
      hoverCount: 0,
      interactiveClicks: 0,
      sectionMetrics: {},
      events: []
    };
    setShowModal(false);
    setAnalyticsResult(null);
    setEventLog([]);
    setSessionId(null);
  }, [pageKey]);

  useEffect(() => {
    const metrics = metricsRef.current;
    metrics.pageStartTime = Date.now();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const scrollPercent = (scrollTop / docHeight) * 100;
        metrics.maxScrollPercent = Math.max(metrics.maxScrollPercent, scrollPercent);
      }
    };

    const handleClick = (e: MouseEvent) => {
      metrics.clickCount++;
      const target = e.target as HTMLElement;
      if (target.closest('[data-interactive="true"]')) {
        metrics.interactiveClicks++;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-interactive="true"]')) {
        metrics.hoverCount++;
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClick);
    document.addEventListener('mouseover', handleMouseOver);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        if (!id) return;
        
        if (!metrics.sectionMetrics[id]) {
          metrics.sectionMetrics[id] = {
            enterTime: null,
            totalDwellTime: 0,
            visits: 0
          };
        }

        if (entry.isIntersecting) {
          metrics.sectionMetrics[id].enterTime = Date.now();
          metrics.sectionMetrics[id].visits++;
        } else {
          if (metrics.sectionMetrics[id].enterTime) {
            metrics.sectionMetrics[id].totalDwellTime += 
              (Date.now() - metrics.sectionMetrics[id].enterTime!) / 1000;
            metrics.sectionMetrics[id].enterTime = null;
          }
        }
      });
    }, { threshold: 0.5 });

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      const sections = document.querySelectorAll('[data-track-section]');
      sections.forEach(s => observer.observe(s));
    }, 100);

    const triggerMiniAIE = () => {
      if (showModal) return; // Already showing
      
      // Calculate final time
      metrics.totalTime = (Date.now() - metrics.pageStartTime) / 1000;
      
      // Close any open section timers
      Object.values(metrics.sectionMetrics).forEach((s: SectionMetrics) => {
        if (s.enterTime) {
          s.totalDwellTime += (Date.now() - s.enterTime) / 1000;
          s.enterTime = null;
        }
      });

      const result = computeResults(metrics);
      setAnalyticsResult(result);
      setShowModal(true);
      metrics.events.push({ type: 'aie_modal_shown', ts: Date.now(), data: result as unknown as Record<string, unknown> });
      setEventLog([...metrics.events]);
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        triggerMiniAIE();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerMiniAIE();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
    };
  }, [showModal]);

  const trackEvent = (type: string, data?: Record<string, unknown>) => {
    const next = { type, data, ts: Date.now() };
    metricsRef.current.events.push(next);
    setEventLog([...metricsRef.current.events]);
  };

  const flushEvents = async () => {
    if (metricsRef.current.events.length === 0) return;
    try {
      const res = await fetch('/api/behavioral-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          pageKey,
          sessionId,
          events: metricsRef.current.events,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const body = await res.json();
      if (body.sessionId && !sessionId) setSessionId(body.sessionId);
      // clear events after successful send
      metricsRef.current.events = [];
    } catch (err) {
      console.error('Failed to flush behavioral events', err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      flushEvents();
    }, 5000);

    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    const beforeUnload = () => {
      navigator.sendBeacon(
        '/api/behavioral-events',
        new Blob([
          JSON.stringify({ pageKey, sessionId, events: metricsRef.current.events })
        ], { type: 'application/json' })
      );
    };

    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [sessionId]);

  return { showModal, setShowModal, analyticsResult, trackEvent, eventLog, sessionId };
}

function normalizeTime(seconds: number) {
  const maxTime = 180; // 3 min cap
  return Math.min(100, (seconds / maxTime) * 100);
}

function normalizeScroll(scrollPercent: number) {
  return Math.min(100, scrollPercent);
}

function normalizeInteraction(clicks: number, seconds: number) {
  if (seconds === 0) return 0;
  const perMinute = clicks / (seconds / 60);
  const maxDensity = 20;
  return Math.min(100, (perMinute / maxDensity) * 100);
}

function calculateFocusScore(sectionMetrics: Record<string, SectionMetrics>) {
  const totalDwell = Object.values(sectionMetrics)
    .reduce((acc, s) => acc + s.totalDwellTime, 0);

  if (totalDwell === 0) return 0;

  const highValueSections = ["revenueEngine", "leadIntelligence", "aie-core"];

  const weighted = Object.entries(sectionMetrics)
    .reduce((acc, [id, s]) => {
      const weight = highValueSections.includes(id) ? 1.5 : 1;
      return acc + (s.totalDwellTime * weight);
    }, 0);

  return Math.min(100, (weighted / totalDwell) * 100);
}

function calculateRevisitScore(sectionMetrics: Record<string, SectionMetrics>) {
  const revisits = Object.values(sectionMetrics)
    .filter(s => s.visits > 1).length;

  return Math.min(100, revisits * 20);
}

function classifyUser(score: number) {
  if (score >= 75) return "High Intent Prospect";
  if (score >= 50) return "Solution Evaluator";
  if (score >= 30) return "Early Exploration";
  return "Initial Discovery";
}

function simulateConversionProbability(score: number) {
  return Math.round(score * 0.85);
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

function computeResults(metrics: InteractionMetrics): AnalyticsResult {
  const T = normalizeTime(metrics.totalTime);
  const S = normalizeScroll(metrics.maxScrollPercent);
  const I = normalizeInteraction(metrics.clickCount, metrics.totalTime);
  const F = calculateFocusScore(metrics.sectionMetrics);
  const R = calculateRevisitScore(metrics.sectionMetrics);

  const score = Math.round(
    (T * 0.20) +
    (S * 0.20) +
    (I * 0.25) +
    (F * 0.25) +
    (R * 0.10)
  );

  const finalScore = Math.min(100, score);

  let topSection = "None";
  let maxDwell = 0;
  Object.entries(metrics.sectionMetrics).forEach(([id, s]) => {
    if (s.totalDwellTime > maxDwell) {
      maxDwell = s.totalDwellTime;
      topSection = id;
    }
  });

  const formattedTopSection = topSection
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/-/g, ' ');

  return {
    engagementScore: finalScore,
    classification: classifyUser(finalScore),
    timeOnPage: formatTime(metrics.totalTime),
    maxScroll: `${Math.round(metrics.maxScrollPercent)}%`,
    interactiveClicks: metrics.interactiveClicks,
    topSection: maxDwell > 0 ? formattedTopSection : "N/A",
    simulatedConversion: `${simulateConversionProbability(finalScore)}%`
  };
}
