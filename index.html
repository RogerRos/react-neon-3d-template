import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// =====================================================
//  Connected particle canvas with parallax and RM support
// =====================================================
function ParticlesBackground() {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const dpi = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = canvas.parentElement.offsetWidth;
    let h = canvas.parentElement.offsetHeight;

    function resize() {
      w = canvas.parentElement.offsetWidth;
      h = canvas.parentElement.offsetHeight;
      canvas.width = w * dpi;
      canvas.height = h * dpi;
      ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const PARTICLES = prefersReducedMotion ? 40 : 120;
    const points = [...Array(PARTICLES)].map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.25 : 0.6),
      vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.25 : 0.6),
      r: 1.2 + Math.random() * 2.2,
    }));

    let rafId;
    function draw() {
      ctx.clearRect(0, 0, w, h);

      // subtle background
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "rgba(10, 10, 20, 0.6)");
      grad.addColorStop(1, "rgba(10, 20, 40, 0.6)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      if (!prefersReducedMotion) {
        // update physics
        for (const p of points) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }

        // draw connections
        for (let i = 0; i < points.length; i++) {
          for (let j = i + 1; j < points.length; j++) {
            const a = points[i];
            const b = points[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 120) {
              const alpha = 0.25 * (1 - dist / 120);
              ctx.strokeStyle = `rgba(0, 200, 255, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // draw particles with glow
      for (const p of points) {
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.hypot(dx, dy);
        const pulse = prefersReducedMotion ? 1 : Math.max(0.4, 1.6 - dist / 180);

        ctx.beginPath();
        ctx.fillStyle = `rgba(0, 255, 200, ${0.7 * pulse})`;
        ctx.shadowColor = prefersReducedMotion ? "transparent" : "rgba(0, 255, 200, 0.8)";
        ctx.shadowBlur = prefersReducedMotion ? 0 : 10 * pulse;
        ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafId = requestAnimationFrame(draw);
    }

    function move(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    }

    canvas.addEventListener("mousemove", move);
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", move);
    };
  }, [dpi, useReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 -z-10 opacity-70"
      style={{ filter: "contrast(120%) saturate(120%)" }}
    />
  );
}

// =====================================================
//  3D tilt card with glow
// =====================================================
function TiltCard({ title, subtitle, children }) {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springX = useSpring(rx, { stiffness: 150, damping: 12 });
  const springY = useSpring(ry, { stiffness: 150, damping: 12 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    let ticking = false;
    function onMove(e) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rx.set(py * -14);
        ry.set(px * 14);
        ticking = false;
      });
    }
    function onLeave() {
      rx.set(0);
      ry.set(0);
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [rx, ry, prefersReducedMotion]);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
      className="group relative rounded-2xl p-6 bg-white/5 border border-white/10 shadow-2xl overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -inset-24 bg-gradient-to-tr from-cyan-400/30 via-fuchsia-500/20 to-amber-400/30 blur-3xl" />
      </div>
      <div className="relative" style={{ transform: "translateZ(40px)" }}>
        <h3 className="text-xl font-semibold text-white drop-shadow-[0_0_10px_rgba(0,200,255,0.6)]">{title}</h3>
        <p className="text-white/70 text-sm mt-1">{subtitle}</p>
        <div className="mt-5">{children}</div>
      </div>
    </motion.div>
  );
}

// =====================================================
//  CSS 3D rotating cube
// =====================================================
function RotatingCube() {
  const prefersReducedMotion = useReducedMotion();
  return (
    <div className="w-full flex items-center justify-center" style={{ perspective: 800 }}>
      <div
        className="cube size-28 relative"
        style={{ transformStyle: "preserve-3d", animation: prefersReducedMotion ? "none" : "spin 10s linear infinite" }}
        aria-label="Decorative rotating cube"
      >
        {["#00e5ff", "#7c3aed", "#22d3ee", "#f59e0b", "#10b981", "#ef4444"].map((c, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-xl border border-white/20"
            style={{
              background: `linear-gradient(135deg, ${c}33, transparent)`,
              boxShadow: `0 0 30px ${c}55 inset, 0 0 40px ${c}55`,
              transform: [
                "translateZ(56px)",
                "rotateY(90deg) translateZ(56px)",
                "rotateY(180deg) translateZ(56px)",
                "rotateY(-90deg) translateZ(56px)",
                "rotateX(90deg) translateZ(56px)",
                "rotateX(-90deg) translateZ(56px)"
              ][i]
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes spin { from { transform: rotateX(20deg) rotateY(0deg); } to { transform: rotateX(20deg) rotateY(360deg); } }
      `}</style>
    </div>
  );
}

// =====================================================
//  Demo data generator for the chart
// =====================================================
function useDemoData() {
  return useMemo(() => {
    const data = [];
    let v = 50;
    for (let i = 0; i < 40; i++) {
      v += (Math.random() - 0.4) * 12;
      data.push({ name: `T${i}`, value: Math.max(0, Math.round(v)) });
    }
    return data;
  }, []);
}

// =====================================================
//  Neon button
// =====================================================
function NeonButton({ children, onClick, as = "button", href }) {
  const Tag = as;
  const base = "relative overflow-hidden rounded-2xl px-5 py-3 font-semibold text-white bg-cyan-500/20 border border-cyan-300/30 backdrop-blur-md hover:bg-cyan-500/30 active:scale-95 transition inline-flex items-center gap-2";
  if (as === "a") {
    return (
      <a className={base} href={href} onClick={onClick}>
        <span className="absolute -inset-16 bg-gradient-to-tr from-cyan-400/30 via-fuchsia-500/20 to-amber-400/30 blur-2xl" />
        <span className="relative">{children}</span>
      </a>
    );
  }
  return (
    <Tag onClick={onClick} className={base}>
      <span className="absolute -inset-16 bg-gradient-to-tr from-cyan-400/30 via-fuchsia-500/20 to-amber-400/30 blur-2xl" />
      <span className="relative">{children}</span>
    </Tag>
  );
}

// =====================================================
//  Glitch title
// =====================================================
function GlitchTitle({ text }) {
  return (
    <div className="relative inline-block select-none" aria-label={text} role="heading" aria-level={1}>
      <span className="text-5xl md:text-7xl font-black tracking-tight text-white">
        {text}
      </span>
      <span className="absolute inset-0 text-5xl md:text-7xl font-black text-cyan-400 translate-x-1 translate-y-0.5 mix-blend-screen opacity-50 pointer-events-none" aria-hidden>
        {text}
      </span>
      <span className="absolute inset-0 text-5xl md:text-7xl font-black text-fuchsia-400 -translate-x-1 -translate-y-0.5 mix-blend-screen opacity-40 pointer-events-none" aria-hidden>
        {text}
      </span>
    </div>
  );
}

// =====================================================
//  Interactive hero section
// =====================================================
function Hero() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useTransform(y, [-300, 300], [12, -12]);
  const ry = useTransform(x, [-300, 300], [-12, 12]);
  const rxs = useSpring(rx, { stiffness: 120, damping: 18 });
  const rys = useSpring(ry, { stiffness: 120, damping: 18 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      onMouseMove={(e) => {
        if (prefersReducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX: rxs, rotateY: rys, transformStyle: "preserve-3d" }}
      className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 shadow-2xl overflow-hidden"
    >
      <div className="absolute -inset-32 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.7),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.6),transparent_60%)] blur-3xl" />
      <div className="relative" style={{ transform: "translateZ(50px)" }}>
        <p className="tracking-widest text-xs text-white/70">INTERACTIVE EXPERIENCE</p>
        <div className="mt-3"><GlitchTitle text="NEON PORTAL" /></div>
        <p className="mt-4 text-white/80 max-w-2xl">
          A high impact landing with reactive particles, 3D tilt cards, live-looking charts and a holographic cube. One file template, ready to brand.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <NeonButton onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}>View sections</NeonButton>
          <NeonButton onClick={() => alert("Action triggered")}>Try action</NeonButton>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 -bottom-24 h-48 bg-gradient-to-t from-black/60 to-transparent" />
    </motion.div>
  );
}

// =====================================================
//  Holographic chart
// =====================================================
function HoloChart() {
  const data = useDemoData();
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
              <stop offset="80%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(255,255,255,0.6)" tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ background: "rgba(10,20,30,0.9)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "white" }} />
          <Area type="monotone" dataKey="value" stroke="#22d3ee" fillOpacity={1} fill="url(#g1)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// =====================================================
//  Main layout template
// =====================================================
export default function NeonPortalTemplate() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen w-full bg-black text-white relative overflow-clip">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.12),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.14),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(244,63,94,0.12),transparent_40%)]" />
      <ParticlesBackground />

      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-fuchsia-500 shadow-[0_0_30px_rgba(34,211,238,0.6)]" />
          <span className="font-bold tracking-wide">YourBrand</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-white/70">
          <a href="#sections" className="hover:text-white">Sections</a>
          <a href="#cube" className="hover:text-white">Cube</a>
          <a href="#analytics" className="hover:text-white">Analytics</a>
        </nav>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        <section className="pt-8 md:pt-12">
          <Hero />
        </section>

        <section id="sections" className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <TiltCard title="Parallax card" subtitle="Tilt and glow">
            <p className="text-white/80">Real 3D transforms with dynamic glow and depth.</p>
          </TiltCard>
          <TiltCard title="Interactions" subtitle="Buttons and actions">
            <div className="flex gap-3">
              <NeonButton onClick={() => alert("Primary action")}>Primary action</NeonButton>
              <NeonButton onClick={() => alert("Secondary action")}>Secondary action</NeonButton>
            </div>
          </TiltCard>
          <TiltCard title="Smooth motion" subtitle="Well tuned easing">
            <p className="text-white/80">Framer Motion powered transitions designed to feel crisp.</p>
          </TiltCard>
        </section>

        <section id="cube" className="mt-12 md:mt-20">
          <TiltCard title="Holographic cube" subtitle="CSS 3D with glow">
            <RotatingCube />
          </TiltCard>
        </section>

        <section id="analytics" className="mt-12 md:mt-20">
          <TiltCard title="Holographic chart" subtitle="Synthetic live-like data">
            <HoloChart />
          </TiltCard>
        </section>

        <footer className="py-16 text-center text-white/60">
          <p>Built with Tailwind and Framer Motion. Custom canvas particles included.</p>
        </footer>
      </main>

      {/* subtle visual frame */}
      <div className="pointer-events-none fixed inset-0 border border-white/10 rounded-3xl m-2" />
    </div>
  );
}
