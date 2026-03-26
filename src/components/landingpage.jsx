import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   FAKE LOG STREAM DATA
───────────────────────────────────────────── */
const LOG_LINES = [
  { level: "ERROR", msg: "NullPointerException at UserService.java:142", time: "10:42:01" },
  { level: "WARN",  msg: "Connection pool exhausted — retrying in 2s",   time: "10:42:03" },
  { level: "INFO",  msg: "GET /api/orders 200 OK (34ms)",                 time: "10:42:04" },
  { level: "ERROR", msg: "StackOverflowError in RecursiveParser.java:88", time: "10:42:06" },
  { level: "INFO",  msg: "Scheduled task 'cleanup' executed",             time: "10:42:07" },
  { level: "WARN",  msg: "Slow query detected: 1240ms on orders table",   time: "10:42:09" },
  { level: "ERROR", msg: "Failed to connect to Redis: timeout",           time: "10:42:11" },
  { level: "INFO",  msg: "POST /api/auth/login 200 OK (11ms)",            time: "10:42:12" },
  { level: "WARN",  msg: "JWT expiry window < 5 minutes",                 time: "10:42:14" },
  { level: "ERROR", msg: "OutOfMemoryError: Java heap space",             time: "10:42:15" },
  { level: "INFO",  msg: "Cache hit ratio: 94.2%",                        time: "10:42:16" },
  { level: "ERROR", msg: "IllegalStateException in PaymentGateway.java",  time: "10:42:18" },
];

const LEVEL_COLOR = {
  ERROR: "#ff4d4d",
  WARN:  "#f5a623",
  INFO:  "#00ed64",
};

/* ─────────────────────────────────────────────
   LOG STREAM COMPONENT
───────────────────────────────────────────── */
function LogStream() {
  const [visible, setVisible] = useState([]);
  const [analysed, setAnalysed] = useState([]);
  const idx = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const line = LOG_LINES[idx.current % LOG_LINES.length];
      setVisible(prev => [...prev.slice(-10), { ...line, id: Date.now() }]);
      if (line.level === "ERROR") {
        setTimeout(() => {
          setAnalysed(prev => [...prev.slice(-3), { ...line, id: Date.now() }]);
        }, 800);
      }
      idx.current++;
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%", maxWidth: 760 }}>
      {/* Raw log panel */}
      <div style={{
        background: "#0d0d0d",
        border: "1px solid #1e1e1e",
        borderRadius: 6,
        overflow: "hidden",
        fontFamily: "'Source Code Pro', monospace",
      }}>
        <div style={{
          padding: "10px 16px",
          borderBottom: "1px solid #1a1a1a",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#0f0f0f",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
          <span style={{ marginLeft: 8, fontSize: 10, color: "#3a3a3a", letterSpacing: "0.1em", textTransform: "uppercase" }}>spring-boot · stdout</span>
        </div>
        <div style={{ padding: "14px 16px", minHeight: 240, display: "flex", flexDirection: "column", gap: 5 }}>
          {visible.map((l) => (
            <div key={l.id} style={{ display: "flex", gap: 10, alignItems: "baseline", animation: "fadeIn 0.3s ease", fontSize: 11, lineHeight: 1.5 }}>
              <span style={{ color: "#333", flexShrink: 0 }}>{l.time}</span>
              <span style={{ color: LEVEL_COLOR[l.level], fontWeight: 700, width: 38, flexShrink: 0 }}>{l.level}</span>
              <span style={{ color: l.level === "ERROR" ? "#ff8080" : l.level === "WARN" ? "#c9874e" : "#555", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.msg}</span>
            </div>
          ))}
          <span style={{ display: "inline-block", width: 7, height: 14, background: "#00ed64", animation: "blink 1s step-end infinite", marginTop: 2 }} />
        </div>
      </div>

      {/* AI analysis panel */}
      <div style={{
        background: "#0d0d0d",
        border: "1px solid #1e1e1e",
        borderRadius: 6,
        overflow: "hidden",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}>
        <div style={{
          padding: "10px 16px",
          borderBottom: "1px solid #1a1a1a",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "#0f0f0f",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ed64", boxShadow: "0 0 6px #00ed64", animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 10, color: "#3a3a3a", letterSpacing: "0.1em", textTransform: "uppercase" }}>LogHelp AI · analysis</span>
        </div>
        <div style={{ padding: "14px 16px", minHeight: 240, display: "flex", flexDirection: "column", gap: 10 }}>
          {analysed.length === 0 && (
            <span style={{ fontSize: 11, color: "#2a2a2a", fontFamily: "monospace" }}>Waiting for errors...</span>
          )}
          {analysed.map((l) => (
            <div key={l.id} style={{
              background: "rgba(255,77,77,0.04)",
              border: "1px solid rgba(255,77,77,0.12)",
              borderRadius: 4,
              padding: "10px 12px",
              animation: "slideIn 0.35s ease",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ff4d4d", background: "rgba(255,77,77,0.1)", padding: "2px 7px", borderRadius: 3 }}>Error Detected</span>
              </div>
              <p style={{ fontSize: 11, color: "#888", lineHeight: 1.6, marginBottom: 6 }}>{l.msg}</p>
              <p style={{ fontSize: 11, color: "#00ed64", lineHeight: 1.6 }}>
                ↳ {l.msg.includes("Null") ? "Possible uninitialized bean. Check @Autowired fields." :
                    l.msg.includes("Redis") ? "Redis host unreachable. Verify REDIS_URL env var." :
                    l.msg.includes("heap")  ? "Heap exhausted. Increase -Xmx or check for memory leaks." :
                    l.msg.includes("Stack") ? "Recursive call depth exceeded. Add base case check." :
                    "Review stack trace. Add null-safety guards."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN LANDING PAGE
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #00ed64;
    --green-dim: rgba(0,237,100,0.08);
    --green-border: rgba(0,237,100,0.18);
    --bg: #0a0a0a;
    --bg2: #0d0d0d;
    --bg3: #111;
    --border: #1a1a1a;
    --text: #e8e8e8;
    --muted: #555;
    --font: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    --mono: 'Source Code Pro', monospace;
  }

  body { background: var(--bg); }

  .lp-root {
    background: var(--bg);
    font-family: var(--font);
    color: var(--text);
    overflow-x: hidden;
  }

  /* ── Keyframes ── */
  @keyframes fadeIn   { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @keyframes slideIn  { from { opacity: 0; transform: translateX(8px); } to { opacity: 1; transform: none; } }
  @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes gridMove { from { background-position: 0 0; } to { background-position: 60px 60px; } }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes revealUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:none; } }

  /* ── HERO ── */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 40px 80px;
    overflow: hidden;
    text-align: center;
  }

  /* Animated grid background */
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,237,100,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,237,100,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridMove 8s linear infinite;
    pointer-events: none;
  }

  /* Radial glow */
  .hero::after {
    content: '';
    position: absolute;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 700px;
    background: radial-gradient(circle, rgba(0,237,100,0.07) 0%, transparent 65%);
    pointer-events: none;
  }

  .hero-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--green);
    background: var(--green-dim);
    border: 1px solid var(--green-border);
    padding: 6px 16px;
    border-radius: 100px;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
    animation: revealUp 0.6s ease both;
  }
  .hero-eyebrow-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 6px var(--green);
    animation: pulse 2s infinite;
  }

  .hero h1 {
    font-size: clamp(36px, 6vw, 68px);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.05;
    color: #fff;
    max-width: 800px;
    margin-bottom: 24px;
    position: relative;
    z-index: 1;
    animation: revealUp 0.6s 0.1s ease both;
  }
  .hero h1 .accent { color: var(--green); }

  .hero-sub {
    font-size: 17px;
    color: #666;
    line-height: 1.8;
    max-width: 520px;
    margin-bottom: 44px;
    position: relative;
    z-index: 1;
    animation: revealUp 0.6s 0.2s ease both;
  }

  .hero-actions {
    display: flex;
    gap: 12px;
    margin-bottom: 72px;
    position: relative;
    z-index: 1;
    animation: revealUp 0.6s 0.3s ease both;
  }

  .btn-primary {
    background: var(--green);
    color: #0a0a0a;
    border: none;
    border-radius: 5px;
    font-family: var(--font);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 13px 28px;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.15s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-primary:hover { opacity: 0.85; transform: translateY(-1px); }

  .btn-ghost {
    background: transparent;
    color: #666;
    border: 1px solid #222;
    border-radius: 5px;
    font-family: var(--font);
    font-size: 13px;
    font-weight: 500;
    padding: 13px 28px;
    cursor: pointer;
    transition: all 0.15s;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn-ghost:hover { border-color: #444; color: #aaa; transform: translateY(-1px); }

  .hero-log-wrap {
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    animation: revealUp 0.7s 0.4s ease both;
  }

  /* fade bottom of log window */
  .hero-log-wrap::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 80px;
    background: linear-gradient(transparent, #0a0a0a);
    pointer-events: none;
  }

  /* ── STATS STRIP ── */
  .stats-strip {
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: var(--bg2);
  }
  .stat-item {
    padding: 32px 24px;
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .stat-item:last-child { border-right: none; }
  .stat-val {
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #fff;
    font-family: var(--mono);
  }
  .stat-val span { color: var(--green); }
  .stat-label { font-size: 12px; color: var(--muted); letter-spacing: 0.04em; }

  /* ── SECTIONS ── */
  .section {
    padding: 100px 40px;
    max-width: 1100px;
    margin: 0 auto;
  }

  .section-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--green);
    margin-bottom: 16px;
  }
  .section-title {
    font-size: clamp(26px, 3.5vw, 40px);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #fff;
    line-height: 1.15;
    margin-bottom: 16px;
  }
  .section-desc {
    font-size: 14px;
    color: #555;
    line-height: 1.8;
    max-width: 480px;
    margin-bottom: 48px;
  }

  /* ── HOW IT WORKS ── */
  .how-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }
  .how-card {
    background: var(--bg3);
    padding: 32px 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    transition: background 0.2s;
  }
  .how-card:hover { background: #131313; }
  .how-num {
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 600;
    color: var(--green);
    letter-spacing: 0.1em;
  }
  .how-icon {
    font-size: 28px;
    line-height: 1;
  }
  .how-card h3 {
    font-size: 15px;
    font-weight: 700;
    color: #ddd;
    letter-spacing: -0.01em;
  }
  .how-card p {
    font-size: 13px;
    color: #444;
    line-height: 1.7;
  }
  .how-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #222;
    padding: 20px 0;
  }

  /* ── FEATURES ── */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .feature-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: border-color 0.2s;
  }
  .feature-card:hover { border-color: #2a2a2a; }
  .feature-card.wide { grid-column: 1 / -1; }
  .feature-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--green-dim);
    border: 1px solid var(--green-border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }
  .feature-card h3 {
    font-size: 15px;
    font-weight: 700;
    color: #ccc;
    letter-spacing: -0.01em;
  }
  .feature-card p {
    font-size: 13px;
    color: #444;
    line-height: 1.7;
  }
  .feature-tag {
    align-self: flex-start;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--green);
    background: var(--green-dim);
    border: 1px solid var(--green-border);
    padding: 3px 9px;
    border-radius: 3px;
  }

  /* ── CTA BANNER ── */
  .cta-banner {
    margin: 0 40px 100px;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 60px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 40px;
    position: relative;
    overflow: hidden;
  }
  .cta-banner::before {
    content: '';
    position: absolute;
    top: -120px; right: -120px;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(0,237,100,0.06) 0%, transparent 60%);
    pointer-events: none;
  }
  .cta-banner h2 {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #fff;
    margin-bottom: 10px;
  }
  .cta-banner p {
    font-size: 14px;
    color: #555;
    line-height: 1.7;
    max-width: 460px;
  }
  .cta-banner-actions { display: flex; gap: 12px; flex-shrink: 0; }

  /* ── FOOTER ── */
  .lp-footer {
    border-top: 1px solid var(--border);
    padding: 28px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #333;
    letter-spacing: 0.04em;
  }
  .lp-footer-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
  }
  .lp-footer-logo-box {
    width: 18px; height: 18px;
    background: var(--green);
    border-radius: 3px;
    display: flex; align-items: center; justify-content: center;
  }
  .lp-footer-logo-box svg { width: 10px; height: 10px; fill: #0a0a0a; }
  .lp-footer-logo span { font-size: 13px; font-weight: 700; color: #fff; }
  .lp-footer-logo span em { color: var(--green); font-style: normal; }
  .lp-footer-links { display: flex; gap: 24px; }
  .lp-footer-links a {
    color: #333;
    text-decoration: none;
    font-size: 12px;
    transition: color 0.15s;
  }
  .lp-footer-links a:hover { color: #888; }
`;

export default function LandingPage() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="lp-root">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            Spring Boot Observability
          </div>

          <h1>
            Stop guessing.<br />
            <span className="accent">Fix errors faster.</span>
          </h1>

          <p className="hero-sub">
            LogHelp automatically ships your Spring Boot logs to an AI that identifies root causes, groups related exceptions, and surfaces them in a clean dashboard — zero code changes.
          </p>

          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary">
              Get Started Free →
            </Link>
            <Link to="/sdk" className="btn-ghost">
              View SDK Docs
            </Link>
          </div>

          <div className="hero-log-wrap">
            <LogStream />
          </div>
        </section>

        {/* ── STATS ── */}
        <div className="stats-strip">
          {[
            { val: "<1", unit: "s",   label: "Log ingestion latency" },
            { val: "3",  unit: " steps", label: "To full integration" },
            { val: "AI", unit: "",    label: "Powered error analysis" },
            { val: "0",  unit: " lines", label: "Of code changes needed" },
          ].map((s, i) => (
            <div className="stat-item" key={i}>
              <div className="stat-val">{s.val}<span>{s.unit}</span></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── HOW IT WORKS ── */}
        <section className="section">
          <div className="section-eyebrow">How it works</div>
          <div className="section-title">Three steps to full observability</div>
          <div className="section-desc">
            No agents. No sidecar containers. Just a Maven dependency and two properties.
          </div>

          <div className="how-grid">
            {[
              {
                n: "01",
                icon: "🗂️",
                title: "Create a Project",
                desc: "Sign up, create a project in the dashboard, and receive a unique API key tied to your service.",
              },
              {
                n: "02",
                icon: "📦",
                title: "Add the SDK",
                desc: "Drop two entries into your pom.xml — a JitPack repository and the loghelp-spring-boot-starter dependency.",
              },
              {
                n: "03",
                icon: "⚙️",
                title: "Set Two Properties",
                desc: "Add your endpoint URL and API key to application.properties. Restart — that's it. Logs flow automatically.",
              },
            ].map((c, i) => (
              <div className="how-card" key={i}>
                <span className="how-num">{c.n}</span>
                <span className="how-icon">{c.icon}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-eyebrow">Features</div>
          <div className="section-title">Everything you need,<br />nothing you don't</div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrap">🤖</div>
              <span className="feature-tag">AI-Powered</span>
              <h3>Automatic Root Cause Analysis</h3>
              <p>Every ERROR log is sent to our AI pipeline which identifies the likely cause, references the relevant class and line, and suggests a fix — without you opening a single log file.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">📡</div>
              <span className="feature-tag">Real-Time</span>
              <h3>Live Log Ingestion</h3>
              <p>Logs are forwarded in real time via a non-blocking appender. No batching delays, no missed exceptions — errors hit your dashboard within milliseconds.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">📊</div>
              <span className="feature-tag">Dashboard</span>
              <h3>Unified Error Dashboard</h3>
              <p>All your services in one place. Filter by project, severity, or time range. See error frequency trends and track whether your fixes actually worked.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrap">🔒</div>
              <span className="feature-tag">Secure</span>
              <h3>API Key Authentication</h3>
              <p>Each project gets its own isolated API key. Log data is scoped per project — no cross-contamination between services or environments.</p>
            </div>

            <div className="feature-card wide">
              <div className="feature-icon-wrap">⚡</div>
              <span className="feature-tag">Zero Config</span>
              <h3>Spring Boot Auto-Configuration</h3>
              <p>
                The starter leverages Spring Boot's auto-configuration mechanism. Once the dependency is on the classpath and the two properties are set, a Logback appender is automatically wired in.
                No beans to declare. No XML to configure. No <code style={{ fontFamily: "monospace", fontSize: 12, color: "#00ed64" }}>@EnableLogHelp</code> annotation needed.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="cta-banner">
          <div>
            <h2>Ready to ship with confidence?</h2>
            <p>Add LogHelp to your Spring Boot app in under 5 minutes. No credit card required — start with a free project today.</p>
          </div>
          <div className="cta-banner-actions">
            <Link to="/sdk" className="btn-ghost">Read the Docs</Link>
            <Link to="/dashboard" className="btn-primary">Start for Free →</Link>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <a href="/" className="lp-footer-logo">
            <div className="lp-footer-logo-box">
              <svg viewBox="0 0 10 10"><rect x="0.5" y="0.5" width="3.5" height="3.5" rx="0.7"/><rect x="6" y="0.5" width="3.5" height="3.5" rx="0.7"/><rect x="0.5" y="6" width="3.5" height="3.5" rx="0.7"/><rect x="6" y="6" width="3.5" height="3.5" rx="0.7"/></svg>
            </div>
            <span>Log<em>Help</em></span>
          </a>
          <div className="lp-footer-links">
            <a href="/sdk">Docs</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/health">Health</a>
          </div>
          <span>© 2025 LogHelp · Apache 2.0</span>
        </footer>

      </div>
    </>
  );
}