import { useState } from "react";

const API_KEY  = "240c88b3-396b-46dc-92ca-e798e44e11b2";
const BASE_URL = "https://loghelp.onrender.com";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap');

  .hr-root {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #e8e8e8;
    animation: hrFadeIn 0.3s ease both;
  }
  @keyframes hrFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
  @keyframes hrSpin   { to{transform:rotate(360deg)} }
  @keyframes hrPulse  { 0%,100%{opacity:1} 50%{opacity:0.35} }

  /* ── Empty state ── */
  .hr-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 420px;
    gap: 20px;
    border: 1px dashed #1e1e1e;
    border-radius: 6px;
    background: #0d0d0d;
    text-align: center;
    padding: 40px;
  }
  .hr-empty-icon {
    font-size: 36px;
    opacity: 0.3;
    line-height: 1;
  }
  .hr-empty-title {
    font-size: 15px;
    font-weight: 700;
    color: #444;
    letter-spacing: -0.01em;
  }
  .hr-empty-sub {
    font-size: 12.5px;
    color: #2a2a2a;
    line-height: 1.7;
    max-width: 340px;
  }
  .hr-gen-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #00ed64;
    color: #0a0a0a;
    border: none;
    border-radius: 4px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 11px 22px;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.15s;
    margin-top: 4px;
  }
  .hr-gen-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); }
  .hr-gen-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .hr-gen-btn-spinner {
    width: 13px; height: 13px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: #0a0a0a;
    border-radius: 50%;
    animation: hrSpin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* ── Loading overlay (full-page generating state) ── */
  .hr-generating {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 420px;
    gap: 18px;
    border: 1px solid #1a1a1a;
    border-radius: 6px;
    background: #0d0d0d;
  }
  .hr-generating-spinner {
    width: 32px; height: 32px;
    border: 2px solid #1e1e1e;
    border-top-color: #00ed64;
    border-radius: 50%;
    animation: hrSpin 0.9s linear infinite;
  }
  .hr-generating-label { font-size: 14px; color: #444; font-weight: 600; }
  .hr-generating-sub   { font-size: 12px; color: #2a2a2a; }

  /* ── Report header ── */
  .hr-report-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
    flex-wrap: wrap;
  }
  .hr-report-meta { display: flex; flex-direction: column; gap: 6px; }
  .hr-window-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #00ed64;
    background: rgba(0,237,100,0.07);
    border: 1px solid rgba(0,237,100,0.18);
    padding: 4px 12px;
    border-radius: 100px;
    align-self: flex-start;
    margin-bottom: 4px;
  }
  .hr-window-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #00ed64;
    box-shadow: 0 0 5px #00ed64;
    animation: hrPulse 2s infinite;
  }
  .hr-report-title {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #fff;
  }
  .hr-generated-at {
    font-size: 11px;
    font-family: 'Source Code Pro', monospace;
    color: #2e2e2e;
  }
  .hr-regen-btn {
    background: none;
    border: 1px solid #1e1e1e;
    border-radius: 4px;
    color: #444;
    font-size: 11px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 7px 14px;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .hr-regen-btn:hover { border-color: #2a2a2a; color: #888; }

  /* ── Status banner ── */
  .hr-status-banner {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 18px 24px;
    border-radius: 6px;
    margin-bottom: 20px;
    border: 1px solid;
  }
  .hr-status-banner.HEALTHY  { background: rgba(0,237,100,0.04);  border-color: rgba(0,237,100,0.15); }
  .hr-status-banner.DEGRADED { background: rgba(245,166,35,0.04); border-color: rgba(245,166,35,0.15); }
  .hr-status-banner.CRITICAL { background: rgba(255,77,77,0.04);  border-color: rgba(255,77,77,0.15); }
  .hr-status-icon { font-size: 22px; line-height: 1; flex-shrink: 0; }
  .hr-status-body { flex: 1; }
  .hr-status-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .hr-status-label.HEALTHY  { color: #00ed64; }
  .hr-status-label.DEGRADED { color: #f5a623; }
  .hr-status-label.CRITICAL { color: #ff4d4d; }
  .hr-status-overview {
    font-size: 13px;
    color: #777;
    line-height: 1.6;
  }

  /* ── Stats row ── */
  .hr-stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: #1a1a1a;
    border: 1px solid #1a1a1a;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .hr-stat {
    background: #0d0d0d;
    padding: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .hr-stat-val {
    font-family: 'Source Code Pro', monospace;
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  .hr-stat-label {
    font-size: 11px;
    color: #333;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  /* ── Analysis cards ── */
  .hr-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 0;
  }
  .hr-card {
    background: #0d0d0d;
    border: 1px solid #1a1a1a;
    border-radius: 6px;
    overflow: hidden;
  }
  .hr-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 20px;
    border-bottom: 1px solid #111;
    background: #0f0f0f;
  }
  .hr-card-icon { font-size: 14px; line-height: 1; }
  .hr-card-title {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #444;
  }
  .hr-card-badge {
    margin-left: auto;
    font-size: 10px;
    font-weight: 700;
    font-family: 'Source Code Pro', monospace;
    padding: 2px 8px;
    border-radius: 3px;
  }
  .hr-card-badge.error   { color: #ff4d4d; background: rgba(255,77,77,0.08);  border: 1px solid rgba(255,77,77,0.15); }
  .hr-card-badge.warning { color: #f5a623; background: rgba(245,166,35,0.08); border: 1px solid rgba(245,166,35,0.15); }
  .hr-card-body {
    padding: 18px 20px;
    font-size: 13px;
    color: #666;
    line-height: 1.75;
  }
`;

/* ─────────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────────── */
const STATUS_CONFIG = {
  HEALTHY:  { icon: "✅", label: "Healthy" },
  DEGRADED: { icon: "⚠️",  label: "Degraded" },
  CRITICAL: { icon: "🔴", label: "Critical" },
};

/* ─────────────────────────────────────────────
   HEALTH REPORT COMPONENT
───────────────────────────────────────────── */
export default function HealthReport() {
  const [report,     setReport]     = useState(null);   // HealthSummaryResponse
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [generatedAt,setGeneratedAt]= useState(null);

  function generateReport() {
    setLoading(true);
    setError(null);
    fetch(`${BASE_URL}/api/projects/4/health-summary`, {
      headers: { "x-api-key": API_KEY }
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => {
        setReport(data);
        setGeneratedAt(new Date());
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }

  const status = report?.status ?? "HEALTHY";
  const cfg    = STATUS_CONFIG[status] ?? STATUS_CONFIG.HEALTHY;

  return (
    <>
      <style>{STYLES}</style>
      <div className="hr-root">

        {/* ── No report yet ── */}
        {!report && !loading && (
          <div className="hr-empty">
            <span className="hr-empty-icon">📋</span>
            <span className="hr-empty-title">No health report generated</span>
            <span className="hr-empty-sub">
              Generate a 24-hour health report to get an AI-powered overview of your
              application's error trends, warning patterns, and overall status.
            </span>
            {error && (
              <span style={{ fontSize:11, color:"#ff4d4d", fontFamily:"monospace", background:"rgba(255,77,77,0.07)", border:"1px solid rgba(255,77,77,0.15)", padding:"6px 14px", borderRadius:4 }}>
                {error}
              </span>
            )}
            <button className="hr-gen-btn" onClick={generateReport}>
              Generate 24h Health Report
            </button>
          </div>
        )}

        {/* ── Generating ── */}
        {loading && (
          <div className="hr-generating">
            <div className="hr-generating-spinner" />
            <span className="hr-generating-label">Generating report…</span>
            <span className="hr-generating-sub">AI is analyzing the last 24 hours of logs</span>
          </div>
        )}

        {/* ── Report ── */}
        {report && !loading && (
          <>
            {/* Header row */}
            <div className="hr-report-header">
              <div className="hr-report-meta">
                <span className="hr-window-badge">
                  <span className="hr-window-dot" />
                  {report.timeWindow ?? "Last 24 hours"}
                </span>
                <span className="hr-report-title">Health Report</span>
                {generatedAt && (
                  <span className="hr-generated-at">
                    Generated {generatedAt.toLocaleString("en-US", { month:"short", day:"numeric", hour:"2-digit", minute:"2-digit" })}
                  </span>
                )}
              </div>
              <button className="hr-regen-btn" onClick={generateReport}>
                ↺ Regenerate
              </button>
            </div>

            {/* Status banner */}
            <div className={`hr-status-banner ${status}`}>
              <span className="hr-status-icon">{cfg.icon}</span>
              <div className="hr-status-body">
                <div className={`hr-status-label ${status}`}>{cfg.label}</div>
                <div className="hr-status-overview">{report.overview}</div>
              </div>
            </div>

            {/* Stats row */}
            <div className="hr-stats-row">
              <div className="hr-stat">
                <span className="hr-stat-val" style={{ color:"#ccc" }}>
                  {report.totalLogs?.toLocaleString() ?? "—"}
                </span>
                <span className="hr-stat-label">Total Logs</span>
              </div>
              <div className="hr-stat">
                <span className="hr-stat-val" style={{ color: report.errorCount > 0 ? "#ff4d4d" : "#555" }}>
                  {report.errorCount?.toLocaleString() ?? "—"}
                </span>
                <span className="hr-stat-label">Errors</span>
              </div>
              <div className="hr-stat">
                <span className="hr-stat-val" style={{ color: report.warningCount > 0 ? "#f5a623" : "#555" }}>
                  {report.warningCount?.toLocaleString() ?? "—"}
                </span>
                <span className="hr-stat-label">Warnings</span>
              </div>
            </div>

            {/* Analysis cards */}
            <div className="hr-cards">
              <div className="hr-card">
                <div className="hr-card-header">
                  <span className="hr-card-icon">🔴</span>
                  <span className="hr-card-title">Error Analysis</span>
                  <span className="hr-card-badge error">{report.errorCount ?? 0} errors</span>
                </div>
                <div className="hr-card-body">
                  {report.errorAnalysis || "No error analysis available."}
                </div>
              </div>
              <div className="hr-card">
                <div className="hr-card-header">
                  <span className="hr-card-icon">⚠️</span>
                  <span className="hr-card-title">Warning Analysis</span>
                  <span className="hr-card-badge warning">{report.warningCount ?? 0} warnings</span>
                </div>
                <div className="hr-card-body">
                  {report.warningAnalysis || "No warning analysis available."}
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </>
  );
}