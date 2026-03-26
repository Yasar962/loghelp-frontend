import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const API_KEY  = "240c88b3-396b-46dc-92ca-e798e44e11b2";
const BASE_URL = "https://loghelp.onrender.com";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap');

  .am-root {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #e8e8e8;
    animation: amFade 0.3s ease both;
  }
  @keyframes amFade { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
  @keyframes amSpin { to{transform:rotate(360deg)} }

  /* ── Tab bar ── */
  .am-tabs {
    display: flex;
    gap: 2px;
    margin-bottom: 24px;
    background: #0d0d0d;
    border: 1px solid #1a1a1a;
    border-radius: 6px;
    padding: 4px;
    flex-wrap: wrap;
  }
  .am-tab {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    color: #444;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.02em;
    border: none;
    background: none;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    white-space: nowrap;
  }
  .am-tab:hover { color: #888; background: #111; }
  .am-tab.active { background: #111; color: #ddd; border: 1px solid #222; }
  .am-tab.active .am-tab-dot { background: #00ed64; box-shadow: 0 0 5px #00ed64; }
  .am-tab-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: #2a2a2a;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  /* ── Chart card ── */
  .am-card {
    background: #0d0d0d;
    border: 1px solid #1a1a1a;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .am-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid #111;
    background: #0f0f0f;
    gap: 12px;
  }
  .am-card-header-left { display:flex; align-items:center; gap:10px; }
  .am-card-icon { font-size: 14px; line-height: 1; }
  .am-card-title {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #555;
  }
  .am-card-subtitle {
    font-size: 11px;
    color: #2e2e2e;
  }
  .am-card-body { padding: 24px 20px; }

  /* ── Loading / error ── */
  .am-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 220px;
    gap: 12px;
    color: #333;
    font-size: 13px;
  }
  .am-spinner {
    width: 18px; height: 18px;
    border: 2px solid #1e1e1e;
    border-top-color: #00ed64;
    border-radius: 50%;
    animation: amSpin 0.7s linear infinite;
    flex-shrink: 0;
  }
  .am-error {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 180px;
    flex-direction: column;
    gap: 8px;
  }
  .am-error-icon  { font-size: 22px; opacity: 0.3; }
  .am-error-msg   { font-size: 12px; color: #333; font-family: monospace; }

  /* ── Two-col grid ── */
  .am-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* ── Endpoint health table ── */
  .am-table-wrap { overflow-x: auto; }
  .am-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12.5px;
  }
  .am-table th {
    padding: 9px 14px;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #333;
    border-bottom: 1px solid #161616;
    white-space: nowrap;
  }
  .am-table td {
    padding: 12px 14px;
    border-bottom: 1px solid #111;
    color: #666;
    white-space: nowrap;
  }
  .am-table tr:last-child td { border-bottom: none; }
  .am-table tr:hover td { background: #111; }
  .am-ep-name {
    font-family: 'Source Code Pro', monospace;
    font-size: 12px;
    color: #00ed64;
  }
  .am-err-rate {
    font-family: 'Source Code Pro', monospace;
    font-size: 12px;
    font-weight: 500;
  }
  .am-err-rate.low  { color: #00ed64; }
  .am-err-rate.mid  { color: #f5a623; }
  .am-err-rate.high { color: #ff4d4d; }
  .am-duration {
    font-family: 'Source Code Pro', monospace;
    font-size: 12px;
    color: #888;
  }
  .am-duration.slow { color: #f5a623; }
  .am-duration.vslow { color: #ff4d4d; }

  /* ── Custom tooltip ── */
  .am-tooltip {
    background: #111;
    border: 1px solid #222;
    border-radius: 4px;
    padding: 9px 14px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 12px;
  }
  .am-tooltip-label { color: #444; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 5px; }
  .am-tooltip-val   { color: #ddd; font-family: 'Source Code Pro', monospace; }

  /* ── Status code colors ── */
  .sc-2xx { fill: #00ed64; }
  .sc-3xx { fill: #3b82f6; }
  .sc-4xx { fill: #f5a623; }
  .sc-5xx { fill: #ff4d4d; }
`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function fmtTime(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}
function fmtMs(ms) {
  if (ms == null) return "—";
  return ms >= 1000 ? `${(ms/1000).toFixed(1)}s` : `${Math.round(ms)}ms`;
}
function fmtPct(r) {
  if (r == null) return "—";
  return `${(r * 100).toFixed(1)}%`;
}
function statusGroup(code) {
  if (code < 300) return "2xx";
  if (code < 400) return "3xx";
  if (code < 500) return "4xx";
  return "5xx";
}
function statusColor(code) {
  if (code < 300) return "#00ed64";
  if (code < 400) return "#3b82f6";
  if (code < 500) return "#f5a623";
  return "#ff4d4d";
}
function errRateClass(r) {
  if (r < 0.02) return "low";
  if (r < 0.1)  return "mid";
  return "high";
}
function durationClass(ms) {
  if (ms > 500) return "vslow";
  if (ms > 200) return "slow";
  return "";
}

/* ─────────────────────────────────────────────
   CUSTOM TOOLTIP
───────────────────────────────────────────── */
function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="am-tooltip">
      <div className="am-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div className="am-tooltip-val" key={i} style={{ color: p.color || "#ddd" }}>
          {formatter ? formatter(p.value, p.name) : `${p.name}: ${p.value}`}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FETCH HOOK
───────────────────────────────────────────── */
function useMetric(path) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true); setError(null);
    fetch(`${BASE_URL}${path}?projectId=4`, {
      headers: { "x-api-key": API_KEY }
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [path]);

  return { data, loading, error };
}

/* ─────────────────────────────────────────────
   CHART WRAPPER
───────────────────────────────────────────── */
function ChartCard({ icon, title, subtitle, loading, error, height = 220, children }) {
  return (
    <div className="am-card">
      <div className="am-card-header">
        <div className="am-card-header-left">
          <span className="am-card-icon">{icon}</span>
          <span className="am-card-title">{title}</span>
        </div>
        {subtitle && <span className="am-card-subtitle">{subtitle}</span>}
      </div>
      <div className="am-card-body">
        {loading && (
          <div className="am-loading">
            <div className="am-spinner" /> Fetching data…
          </div>
        )}
        {error && (
          <div className="am-error">
            <span className="am-error-icon">⚠</span>
            <span className="am-error-msg">{error}</span>
          </div>
        )}
        {!loading && !error && (
          <div style={{ height }}>{children}</div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   VIEWS
───────────────────────────────────────────── */

/* 1. Response Time Trend */
function ResponseTimeTrend() {
  const { data, loading, error } = useMetric("/api/metrics/response-time");
  const formatted = data?.map(d => ({ ...d, time: fmtTime(d.timestamp) })) ?? [];
  return (
    <ChartCard icon="📈" title="Response Time Trend" subtitle="Avg latency over time" loading={loading} error={error} height={240}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#161616" />
          <XAxis dataKey="time" tick={{ fill:"#333", fontSize:10 }} axisLine={{ stroke:"#1e1e1e" }} tickLine={false} />
          <YAxis tick={{ fill:"#333", fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}ms`} />
          <Tooltip content={<ChartTooltip formatter={(v) => `${v.toFixed(1)}ms`} />} />
          <Line type="monotone" dataKey="avgDuration" stroke="#00ed64" strokeWidth={2}
            dot={false} activeDot={{ r:4, fill:"#00ed64", strokeWidth:0 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* 2. Slowest Endpoints */
function SlowestEndpoints() {
  const { data, loading, error } = useMetric("/api/metrics/slow-endpoints");
  return (
    <ChartCard icon="🐢" title="Slowest Endpoints" subtitle="Ranked by avg latency" loading={loading} error={error} height={240}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data ?? []} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#161616" horizontal={false} />
          <XAxis type="number" tick={{ fill:"#333", fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}ms`} />
          <YAxis type="category" dataKey="endpoint" tick={{ fill:"#555", fontSize:10, fontFamily:"monospace" }}
            axisLine={false} tickLine={false} width={130} />
          <Tooltip content={<ChartTooltip formatter={(v) => `${v.toFixed(1)}ms`} />} />
          <Bar dataKey="avgDuration" fill="#00ed64" radius={[0,3,3,0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* 3. Traffic Over Time */
function TrafficOverTime() {
  const { data, loading, error } = useMetric("/api/metrics/traffic");
  const formatted = data?.map(d => ({ ...d, time: fmtTime(d.timestamp) })) ?? [];
  return (
    <ChartCard icon="📡" title="Request Traffic" subtitle="Volume over time" loading={loading} error={error} height={240}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formatted} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#161616" />
          <XAxis dataKey="time" tick={{ fill:"#333", fontSize:10 }} axisLine={{ stroke:"#1e1e1e" }} tickLine={false} />
          <YAxis tick={{ fill:"#333", fontSize:10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip formatter={(v) => `${v} requests`} />} />
          <Bar dataKey="count" fill="#00ed64" opacity={0.7} radius={[2,2,0,0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* 4. Top Endpoints */
function TopEndpoints() {
  const { data, loading, error } = useMetric("/api/metrics/top-endpoints");
  return (
    <ChartCard icon="🏆" title="Top Endpoints" subtitle="By request count" loading={loading} error={error} height={240}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data ?? []} layout="vertical" margin={{ top: 4, right: 40, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#161616" horizontal={false} />
          <XAxis type="number" tick={{ fill:"#333", fontSize:10 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="endpoint" tick={{ fill:"#555", fontSize:10, fontFamily:"monospace" }}
            axisLine={false} tickLine={false} width={130} />
          <Tooltip content={<ChartTooltip formatter={(v) => `${v.toLocaleString()} requests`} />} />
          <Bar dataKey="count" fill="#3b82f6" radius={[0,3,3,0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* 5. Status Code Distribution */
function StatusDistribution() {
  const { data, loading, error } = useMetric("/api/metrics/status-distribution");

  const grouped = data?.reduce((acc, d) => {
    const g = statusGroup(d.statusCode);
    acc[g] = (acc[g] || 0) + d.count;
    return acc;
  }, {}) ?? {};
  const pieData = Object.entries(grouped).map(([name, value]) => ({ name, value }));
  const COLORS  = { "2xx":"#00ed64", "3xx":"#3b82f6", "4xx":"#f5a623", "5xx":"#ff4d4d" };

  return (
    <ChartCard icon="🥧" title="Status Distribution" subtitle="HTTP response codes" loading={loading} error={error} height={240}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
            dataKey="value" paddingAngle={3}>
            {pieData.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.name] || "#555"} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip formatter={(v, n) => `${n}: ${v.toLocaleString()}`} />} />
          <Legend iconType="circle" iconSize={8}
            formatter={(v) => <span style={{ color:"#555", fontSize:11 }}>{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* 6. Error Rate Over Time */
function ErrorRateOverTime() {
  const { data, loading, error } = useMetric("/api/metrics/error-rate");
  const formatted = data?.map(d => ({ ...d, time: fmtTime(d.timestamp), pct: +(d.errorRate * 100).toFixed(2) })) ?? [];
  return (
    <ChartCard icon="📉" title="Error Rate" subtitle="% of requests over time" loading={loading} error={error} height={240}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#161616" />
          <XAxis dataKey="time" tick={{ fill:"#333", fontSize:10 }} axisLine={{ stroke:"#1e1e1e" }} tickLine={false} />
          <YAxis tick={{ fill:"#333", fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`} />
          <Tooltip content={<ChartTooltip formatter={(v) => `${v}% error rate`} />} />
          <Line type="monotone" dataKey="pct" stroke="#ff4d4d" strokeWidth={2}
            dot={false} activeDot={{ r:4, fill:"#ff4d4d", strokeWidth:0 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* 7. Endpoint Health Table */
function EndpointHealthTable() {
  const { data, loading, error } = useMetric("/api/metrics/endpoint-health");
  return (
    <ChartCard icon="🩺" title="Endpoint Health" subtitle="Per-endpoint overview" loading={loading} error={error} height="auto">
      <div className="am-table-wrap">
        <table className="am-table">
          <thead>
            <tr>
              <th>Endpoint</th>
              <th>Requests</th>
              <th>Avg Duration</th>
              <th>Error Rate</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((row, i) => (
              <tr key={i}>
                <td><span className="am-ep-name">{row.endpoint}</span></td>
                <td style={{ fontFamily:"monospace", fontSize:12, color:"#888" }}>
                  {row.totalRequests?.toLocaleString() ?? "—"}
                </td>
                <td>
                  <span className={`am-duration ${durationClass(row.avgDuration)}`}>
                    {fmtMs(row.avgDuration)}
                  </span>
                </td>
                <td>
                  <span className={`am-err-rate ${errRateClass(row.errorRate)}`}>
                    {fmtPct(row.errorRate)}
                  </span>
                </td>
                <td style={{ fontFamily:"monospace", fontSize:11, color:"#2e2e2e" }}>
                  {row.lastSeen ? new Date(row.lastSeen).toLocaleString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}) : "—"}
                </td>
              </tr>
            ))}
            {!loading && !error && (data ?? []).length === 0 && (
              <tr><td colSpan={5} style={{ textAlign:"center", color:"#2a2a2a", padding:"32px" }}>No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}

/* ─────────────────────────────────────────────
   TABS CONFIG
───────────────────────────────────────────── */
const TABS = [
  { id:"overview",   label:"Overview",          icon:"⚡" },
  { id:"latency",    label:"Response Time",      icon:"📈" },
  { id:"traffic",    label:"Traffic",            icon:"📡" },
  { id:"errors",     label:"Error Rate",         icon:"📉" },
  { id:"status",     label:"Status Codes",       icon:"🥧" },
  { id:"endpoints",  label:"Endpoint Health",    icon:"🩺" },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function ApiMetrics() {
  const [activeTab, setActiveTab] = useState("overview");

  function renderTab() {
    switch (activeTab) {
      case "overview":
        return (
          <>
            <div className="am-grid-2">
              <ResponseTimeTrend />
              <TrafficOverTime />
            </div>
            <div className="am-grid-2">
              <StatusDistribution />
              <ErrorRateOverTime />
            </div>
            <EndpointHealthTable />
          </>
        );
      case "latency":
        return (
          <>
            <ResponseTimeTrend />
            <SlowestEndpoints />
          </>
        );
      case "traffic":
        return (
          <>
            <TrafficOverTime />
            <TopEndpoints />
          </>
        );
      case "errors":
        return <ErrorRateOverTime />;
      case "status":
        return <StatusDistribution />;
      case "endpoints":
        return (
          <>
            <EndpointHealthTable />
            <div className="am-grid-2">
              <SlowestEndpoints />
              <TopEndpoints />
            </div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="am-root">
        {/* Tab bar */}
        <div className="am-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`am-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="am-tab-dot" />
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {renderTab()}
      </div>
    </>
  );
}