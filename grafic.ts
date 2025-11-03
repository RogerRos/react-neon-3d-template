import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell
} from "recharts";

// ==============================================
//  AI Training Ops Dashboard v2
//  Single file template. Replace labels and hook real data.
// ==============================================

// Utility: random walk for live-like data
function makeWalker(start = 0, drift = 0, volatility = 1, clampMin = -Infinity, clampMax = Infinity) {
  let v = start;
  return (bias = 0) => {
    const step = (Math.random() - 0.5 + bias) * volatility + drift;
    v = Math.min(clampMax, Math.max(clampMin, v + step));
    return v;
  };
}

// Utility: moving average smoothing
function movingAverage(arr, window = 5) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = arr.slice(start, i + 1);
    out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return out;
}

// Particles background with gentle motion and RM support
function ParticlesBackground({ intensity = 80 }) {
  const canvasRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let frameId;
    let w, h, dpr;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      w = canvas.parentElement.offsetWidth;
      h = canvas.parentElement.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resize();
    window.addEventListener("resize", resize);

    const N = prefersReducedMotion ? Math.floor(intensity * 0.35) : intensity;
    const pts = [...Array(N)].map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.15 : 0.35),
      vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.15 : 0.35),
      r: 0.8 + Math.random() * 1.6
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "rgba(14, 18, 30, 0.8)");
      grad.addColorStop(1, "rgba(8, 10, 18, 0.8)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      for (const p of pts) {
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,255,200,0.35)";
        ctx.shadowColor = "rgba(0,255,200,0.4)";
        ctx.shadowBlur = prefersReducedMotion ? 0 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      frameId = requestAnimationFrame(draw);
    }

    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [intensity, prefersReducedMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 opacity-70" aria-hidden />;
}

// KPI Card with tiny sparkline
function KpiCard({ label, value, unit, trendData = [] }) {
  return (
    <div className="relative rounded-2xl p-5 bg-white/5 border border-white/10 shadow-xl">
      <div className="flex items-baseline justify-between">
        <span className="text-white/70 text-sm">{label}</span>
        <span className="text-xs text-white/50">{unit}</span>
      </div>
      <div className="mt-1 text-2xl font-bold tracking-tight">{value}</div>
      <div className="mt-3 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`spark-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.9} />
                <stop offset="80%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis hide domain={[0, "dataMax + 5"]} />
            <Area type="monotone" dataKey="v" stroke="#22d3ee" fillOpacity={1} fill={`url(#spark-${label})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Round gauge using PieChart
function Gauge({ value = 0, max = 100, label = "GPU Util" }) {
  const pct = Math.max(0, Math.min(1, value / max));
  const data = [
    { name: "used", value: pct },
    { name: "rest", value: 1 - pct }
  ];
  return (
    <div className="rounded-2xl p-5 bg-white/5 border border-white/10 shadow-xl">
      <div className="text-white/70 text-sm">{label}</div>
      <div className="flex items-center justify-center h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              dataKey="value"
            >
              <Cell fill="#22d3ee" />
              <Cell fill="rgba(255,255,255,0.1)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center text-2xl font-bold">{Math.round(pct * 100)}%</div>
    </div>
  );
}

// Synthetic event log item
function LogItem({ time, text, level = "info" }) {
  const color = level === "warn" ? "text-amber-300" : level === "error" ? "text-red-400" : "text-cyan-300";
  return (
    <div className="flex gap-3 items-start py-2 border-b border-white/5">
      <span className="text-white/40 text-xs min-w-16">{time}</span>
      <span className={`text-xs ${color}`}>{text}</span>
    </div>
  );
}

// Main component
export default function AITrainingOpsDashboardV2() {
  const prefersReducedMotion = useReducedMotion();

  // Controls
  const [running, setRunning] = useState(true);
  const [smooth, setSmooth] = useState(4);
  const [rateMs, setRateMs] = useState(1000);
  const [model, setModel] = useState("Llama vNext");
  const [dataset, setDataset] = useState("Mix-Stack v3");

  // Data series states
  const [step, setStep] = useState(0);
  const [loss, setLoss] = useState([]); // [{t, v}]
  const [acc, setAcc] = useState([]);
  const [tps, setTps] = useState([]); // tokens per second
  const [mem, setMem] = useState([]); // VRAM GB used
  const [latency, setLatency] = useState([]); // ms per batch
  const [grad, setGrad] = useState([]); // gradient norm
  const [lr, setLr] = useState([]); // learning rate schedule
  const [gpuUtil, setGpuUtil] = useState(0.6);
  const [logs, setLogs] = useState([]);

  // Random walkers
  const wLoss = useRef(makeWalker(2.4, -0.015, 0.08, 0.05, 5));
  const wAcc = useRef(makeWalker(40, 0.4, 2, 0, 100));
  const wTps = useRef(makeWalker(2000, 50, 300, 200, 6000));
  const wMem = useRef(makeWalker(34, 0.1, 0.6, 20, 80));
  const wLat = useRef(makeWalker(120, -0.5, 10, 30, 300));
  const wGrad = useRef(makeWalker(1.5, -0.01, 0.05, 0.2, 5));
  const wLr = useRef(1e-3);
  const wGpu = useRef(makeWalker(0.65, 0, 0.02, 0.2, 0.98));

  // Visibility pause to avoid CPU use on background tab
  const visibilityHandler = useRef(() => {});
  useEffect(() => {
    const onVis = () => {
      setRunning((r) => (document.hidden ? false : r));
    };
    visibilityHandler.current = onVis;
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // Live data loop
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setStep((s) => s + 1);
      setLoss((arr) => [...arr.slice(-180), { t: Date.now(), v: Math.max(0.02, wLoss.current()) }]);
      setAcc((arr) => [...arr.slice(-180), { t: Date.now(), v: Math.min(100, wAcc.current()) }]);
      setTps((arr) => [...arr.slice(-180), { t: Date.now(), v: Math.max(0, wTps.current()) }]);
      setMem((arr) => [...arr.slice(-180), { t: Date.now(), used: Math.max(0, wMem.current()), free: 80 }]);
      setLatency((arr) => [...arr.slice(-180), { t: Date.now(), v: Math.max(0, wLat.current()) }]);
      setGrad((arr) => [...arr.slice(-180), { t: Date.now(), v: Math.max(0.01, wGrad.current()) }]);

      // cosine decay for LR with warm restarts feel
      const time = Date.now() / 1000;
      const lrNow = 1e-3 * (0.55 + 0.45 * Math.cos((time % 120) / 120 * Math.PI));
      wLr.current = lrNow;
      setLr((arr) => [...arr.slice(-180), { t: Date.now(), v: lrNow }]);

      setGpuUtil(() => wGpu.current());

      // synthetic logs
      const roll = Math.random();
      if (roll > 0.92) {
        setLogs((l) => [
          { time: new Date().toLocaleTimeString(), text: `Step ${step}: validation improved`, level: "info" },
          ...l.slice(0, 49)
        ]);
      } else if (roll < 0.04) {
        setLogs((l) => [
          { time: new Date().toLocaleTimeString(), text: `GPU 3 throttle detected. Fan curve adjusted`, level: "warn" },
          ...l.slice(0, 49)
        ]);
      }
    }, rateMs);
    return () => clearInterval(id);
  }, [running, rateMs, step]);

  // Derived data with smoothing
  const lossSmooth = useMemo(() => {
    const ys = movingAverage(loss.map(d => d.v), smooth);
    return loss.map((d, i) => ({ t: d.t, v: ys[i] }));
  }, [loss, smooth]);

  const accSmooth = useMemo(() => {
    const ys = movingAverage(acc.map(d => d.v), smooth);
    return acc.map((d, i) => ({ t: d.t, v: ys[i] }));
  }, [acc, smooth]);

  const tpsSmooth = useMemo(() => {
    const ys = movingAverage(tps.map(d => d.v), smooth);
    return tps.map((d, i) => ({ t: d.t, v: ys[i] }));
  }, [tps, smooth]);

  // Safe axis ticks
  const timeFmt = (t) => new Date(t).toLocaleTimeString();

  // Header tilt, very subtle to avoid nausea
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useTransform(y, [-150, 150], [6, -6]);
  const ry = useTransform(x, [-150, 150], [-6, 6]);
  const rxs = useSpring(rx, { stiffness: 120, damping: 22 });
  const rys = useSpring(ry, { stiffness: 120, damping: 22 });

  return (
    <div className="min-h-screen w-full bg-black text-white relative">
      <ParticlesBackground intensity={60} />

      <header className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <motion.div
          onMouseMove={(e) => {
            if (prefersReducedMotion) return;
            const rect = e.currentTarget.getBoundingClientRect();
            x.set(e.clientX - rect.left - rect.width / 2);
            y.set(e.clientY - rect.top - rect.height / 2);
          }}
          onMouseLeave={() => { x.set(0); y.set(0); }}
          style={{ rotateX: rxs, rotateY: rys, transformStyle: "preserve-3d" }}
          className="flex items-center gap-3"
        >
          <div className="size-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-fuchsia-500 shadow-[0_0_30px_rgba(34,211,238,0.6)]" />
          <span className="font-bold tracking-wide">YourAI Ops</span>
        </motion.div>
        <div className="flex items-center gap-4 text-white/70">
          <label className="hidden md:flex items-center gap-2">
            <span className="text-xs">Model</span>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="bg-transparent border border-white/20 rounded-md px-2 py-1 text-sm">
              <option>Llama vNext</option>
              <option>Mamba Large</option>
              <option>Transformer XL Pro</option>
            </select>
          </label>
          <label className="hidden md:flex items-center gap-2">
            <span className="text-xs">Dataset</span>
            <select value={dataset} onChange={(e) => setDataset(e.target.value)} className="bg-transparent border border-white/20 rounded-md px-2 py-1 text-sm">
              <option>Mix-Stack v3</option>
              <option>Code-Blend</option>
              <option>WebCorpus Clean</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-xs">Realtime</span>
            <input type="checkbox" checked={running} onChange={(e) => setRunning(e.target.checked)} />
          </label>
          <label className="hidden md:flex items-center gap-2">
            <span className="text-xs">Update</span>
            <select value={rateMs} onChange={(e) => setRateMs(parseInt(e.target.value))} className="bg-transparent border border-white/20 rounded-md px-2 py-1 text-sm">
              <option value={500}>0.5s</option>
              <option value={1000}>1s</option>
              <option value={2000}>2s</option>
              <option value={5000}>5s</option>
            </select>
          </label>
          <label className="hidden md:flex items-center gap-2">
            <span className="text-xs">Smoothing</span>
            <select value={smooth} onChange={(e) => setSmooth(parseInt(e.target.value))} className="bg-transparent border border-white/20 rounded-md px-2 py-1 text-sm">
              <option value={1}>x1</option>
              <option value={3}>x3</option>
              <option value={4}>x4</option>
              <option value={8}>x8</option>
            </select>
          </label>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6">
        {/* KPI Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard label="Training loss" unit={""} value={loss.length ? loss[loss.length - 1].v.toFixed(3) : "-"} trendData={lossSmooth.map((d, i) => ({ t: i, v: d.v }))} />
          <KpiCard label="Accuracy" unit={"%"} value={acc.length ? acc[acc.length - 1].v.toFixed(1) : "-"} trendData={accSmooth.map((d, i) => ({ t: i, v: d.v }))} />
          <KpiCard label="Tokens per sec" unit={"t/s"} value={tps.length ? Math.round(tps[tps.length - 1].v) : "-"} trendData={tpsSmooth.map((d, i) => ({ t: i, v: d.v }))} />
          <KpiCard label="Latency" unit={"ms"} value={latency.length ? Math.round(latency[latency.length - 1].v) : "-"} trendData={latency.map((d, i) => ({ t: i, v: d.v }))} />
        </section>

        {/* Charts grid */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl p-5 bg-white/5 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white/80 font-semibold">Loss and LR</h3>
              <span className="text-white/40 text-xs">lower is better</span>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lossSmooth} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="t" tickFormatter={timeFmt} stroke="rgba(255,255,255,0.6)" />
                  <YAxis yAxisId="left" stroke="rgba(255,255,255,0.6)" />
                  <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.6)" />
                  <Tooltip contentStyle={{ background: "rgba(10,20,30,0.9)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "white" }} />
                  <Line yAxisId="left" type="monotone" dataKey="v" name="loss" stroke="#22d3ee" dot={false} />
                  <Line yAxisId="right" type="monotone" data={lr} dataKey="v" name="lr" stroke="#f472b6" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white/5 border border-white/10 shadow-xl">
            <h3 className="text-white/80 font-semibold mb-3">GPU Utilization</h3>
            <Gauge value={gpuUtil * 100} max={100} />
          </div>

          <div className="rounded-2xl p-5 bg-white/5 border border-white/10 shadow-xl lg:col-span-1">
            <h3 className="text-white/80 font-semibold mb-3">Throughput</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tpsSmooth}>
                  <defs>
                    <linearGradient id="gtps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                      <stop offset="80%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="t" tickFormatter={timeFmt} stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip contentStyle={{ background: "rgba(10,20,30,0.9)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "white" }} />
                  <Area type="monotone" dataKey="v" stroke="#22d3ee" fillOpacity={1} fill="url(#gtps)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white/5 border border-white/10 shadow-xl lg:col-span-1">
            <h3 className="text-white/80 font-semibold mb-3">Latency distribution</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={latency.slice(-60).map((d, i) => ({ t: i, v: d.v }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="t" stroke="rgba(255,255,255,0.6)" tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip contentStyle={{ background: "rgba(10,20,30,0.9)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "white" }} />
                  <Bar dataKey="v" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white/5 border border-white/10 shadow-xl lg:col-span-1">
            <h3 className="text-white/80 font-semibold mb-3">Gradient norm</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={grad}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="t" tickFormatter={timeFmt} stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip contentStyle={{ background: "rgba(10,20,30,0.9)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "white" }} />
                  <Line type="monotone" dataKey="v" stroke="#a78bfa" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white/5 border border-white/10 shadow-xl lg:col-span-2">
            <h3 className="text-white/80 font-semibold mb-3">VRAM usage</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mem}>
                  <defs>
                    <linearGradient id="gmem" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                      <stop offset="80%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="t" tickFormatter={timeFmt} stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip contentStyle={{ background: "rgba(10,20,30,0.9)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, color: "white" }} />
                  <Area type="monotone" dataKey="used" stroke="#34d399" fillOpacity={1} fill="url(#gmem)" name="used GB" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-white/5 border border-white/10 shadow-xl lg:col-span-1">
            <h3 className="text-white/80 font-semibold mb-3">Event log</h3>
            <div className="h-48 overflow-auto pr-2">
              {logs.map((l, i) => (
                <LogItem key={i} time={l.time} text={l.text} level={l.level} />
              ))}
            </div>
          </div>
        </section>

        <footer className="py-14 text-center text-white/60">
          <p>Template ready for real metrics. Replace synthetic generators with your WebSocket or API feed.</p>
        </footer>
      </main>

      {/* soft frame */}
      <div className="pointer-events-none fixed inset-0 border border-white/10 rounded-3xl m-2" />
    </div>
  );
}
