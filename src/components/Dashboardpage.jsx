import ApiMetrics from './Apimetrics';
import HealthReport from './Healthreport';
import { useState, useEffect } from "react";

const BASE_URL = "https://loghelp.onrender.com";

// Auth helpers
function getToken() { return localStorage.getItem("token") || ""; }
function authHeaders() { return { "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json" }; }

// ✅ FIX 2: redirect to /login (not "/") so LandingRoute doesn't loop back to dashboard
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  window.location.href = "/login";
}

function getUser() { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } }

/* ─────────────────────────────────────────────
   API FETCH (AUTO REFRESH)
───────────────────────────────────────────── */
async function refreshTokenApi() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    localStorage.setItem("token", data.accessToken);
    return true;
  } catch {
    return false;
  }
}

async function apiFetch(url, options = {}) {
  let token = getToken();

  let res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  // 🔥 Token expired — try refresh first
  if (res.status === 401) {
    const refreshed = await refreshTokenApi();

    if (!refreshed) {
      // Both access token and refresh token are dead → force logout
      logout();
      // Return a sentinel so callers can bail out silently
      return null;
    }

    token = getToken();

    // 🔁 Retry with the new token
    res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    // If still 401 after refresh, something is wrong — force logout
    if (res.status === 401) {
      logout();
      return null;
    }
  }

  return res;
}



/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const TABLE_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap');

  .it-root { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e8e8e8; }
  .it-toolbar { display:flex; align-items:center; gap:10px; margin-bottom:16px; flex-wrap:wrap; }
  .it-search-wrap { position:relative; flex:1; min-width:200px; }
  .it-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:13px; color:#333; pointer-events:none; }
  .it-search { width:100%; background:#0d0d0d; border:1px solid #1e1e1e; border-radius:4px; padding:8px 14px 8px 36px; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; font-size:13px; color:#ccc; outline:none; transition:border-color 0.15s; }
  .it-search::placeholder { color:#333; }
  .it-search:focus { border-color:#2e2e2e; }
  .it-filter-btn { background:#0d0d0d; border:1px solid #1e1e1e; border-radius:4px; padding:8px 14px; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; font-size:12px; color:#555; cursor:pointer; transition:all 0.15s; letter-spacing:0.03em; white-space:nowrap; }
  .it-filter-btn:hover { border-color:#2a2a2a; color:#888; }
  .it-filter-btn.active { border-color:rgba(0,237,100,0.3); color:#00ed64; background:rgba(0,237,100,0.06); }
  .it-table-wrap { background:#0d0d0d; border:1px solid #1a1a1a; border-radius:6px; overflow:hidden; }
  .it-thead { display:grid; grid-template-columns:1.6fr 80px 80px 90px 110px 100px 140px; padding:0 20px; border-bottom:1px solid #161616; background:#0f0f0f; }
  .it-th { padding:11px 8px; font-size:10px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#333; display:flex; align-items:center; gap:4px; cursor:pointer; user-select:none; transition:color 0.15s; white-space:nowrap; }
  .it-th:hover { color:#666; }
  .it-th.sorted { color:#00ed64; }
  .it-th-arrow { font-size:9px; opacity:0.6; }
  .it-row { display:grid; grid-template-columns:1.6fr 80px 80px 90px 110px 100px 140px; padding:0 20px; border-bottom:1px solid #111; transition:background 0.12s; align-items:center; }
  .it-row:last-child { border-bottom:none; }
  .it-row:hover { background:#111; }
  .it-td { padding:12px 8px; font-size:12.5px; color:#666; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .it-title-cell { display:flex; flex-direction:column; gap:3px; overflow:hidden; }
  .it-title-text { font-size:13px; color:#ccc; font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .it-fingerprint { font-family:'Source Code Pro',monospace; font-size:10px; color:#333; letter-spacing:0.04em; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .it-level { display:inline-flex; align-items:center; gap:5px; font-size:10px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:3px 8px; border-radius:3px; white-space:nowrap; }
  .it-level-dot { width:5px; height:5px; border-radius:50%; flex-shrink:0; }
  .it-level.ERROR { color:#ff4d4d; background:rgba(255,77,77,0.08); border:1px solid rgba(255,77,77,0.15); }
  .it-level.WARN  { color:#f5a623; background:rgba(245,166,35,0.08); border:1px solid rgba(245,166,35,0.15); }
  .it-level.INFO  { color:#00ed64; background:rgba(0,237,100,0.07);  border:1px solid rgba(0,237,100,0.15); }
  .it-level.DEBUG { color:#888;    background:rgba(136,136,136,0.07);border:1px solid rgba(136,136,136,0.12); }
  .it-status { display:inline-flex; align-items:center; font-size:10px; font-weight:600; letter-spacing:0.07em; text-transform:uppercase; padding:3px 8px; border-radius:3px; }
  .it-status.OPEN     { color:#ff4d4d; background:rgba(255,77,77,0.07);  border:1px solid rgba(255,77,77,0.12); }
  .it-status.RESOLVED { color:#00ed64; background:rgba(0,237,100,0.06);  border:1px solid rgba(0,237,100,0.12); }
  .it-status.IGNORED  { color:#444;    background:rgba(68,68,68,0.15);   border:1px solid #222; }
  .it-occurrences { font-family:'Source Code Pro',monospace; font-size:12px; color:#888; font-weight:500; }
  .it-occurrences.high { color:#ff4d4d; }
  .it-occurrences.med  { color:#f5a623; }
  .it-time { font-family:'Source Code Pro',monospace; font-size:11px; color:#3a3a3a; display:flex; flex-direction:column; gap:2px; }
  .it-time-val { color:#555; font-size:11.5px; }
  .it-time-ago { color:#2e2e2e; font-size:10px; }
  .it-state { padding:60px 24px; display:flex; flex-direction:column; align-items:center; gap:12px; color:#333; font-size:13px; }
  .it-state-icon { font-size:28px; opacity:0.4; }
  .it-state-title { font-size:14px; color:#444; font-weight:600; }
  .it-state-sub { font-size:12px; color:#2e2e2e; }
  .it-spinner { width:20px; height:20px; border:2px solid #1e1e1e; border-top-color:#00ed64; border-radius:50%; animation:itSpin 0.7s linear infinite; }
  @keyframes itSpin { to { transform:rotate(360deg); } }
  .it-footer { display:flex; align-items:center; justify-content:space-between; padding:10px 20px; border-top:1px solid #111; background:#0f0f0f; }
  .it-count { font-size:11px; color:#333; letter-spacing:0.04em; }
  .it-count span { color:#555; }
  .it-pagination { display:flex; gap:4px; }
  .it-page-btn { width:28px; height:28px; background:none; border:1px solid #1a1a1a; border-radius:3px; color:#444; font-size:11px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.12s; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; }
  .it-page-btn:hover:not(:disabled) { border-color:#2a2a2a; color:#888; }
  .it-page-btn.current { border-color:rgba(0,237,100,0.3); color:#00ed64; background:rgba(0,237,100,0.05); }
  .it-page-btn:disabled { opacity:0.2; cursor:default; }

  .it-actions { display:flex; gap:5px; align-items:center; }
  .it-btn-fix {
    background: rgba(0,237,100,0.07);
    border: 1px solid rgba(0,237,100,0.2);
    border-radius: 3px;
    color: #00ed64;
    font-size: 10px;
    font-weight: 700;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 9px;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .it-btn-fix:hover { background:rgba(0,237,100,0.14); border-color:rgba(0,237,100,0.4); }
  .it-btn-root {
    background: rgba(245,166,35,0.07);
    border: 1px solid rgba(245,166,35,0.2);
    border-radius: 3px;
    color: #f5a623;
    font-size: 10px;
    font-weight: 700;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 4px 9px;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .it-btn-root:hover { background:rgba(245,166,35,0.14); border-color:rgba(245,166,35,0.4); }
`;

const DASH_STYLES = `
  * { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --green:#00ed64; --green-dim:rgba(0,237,100,0.07); --green-border:rgba(0,237,100,0.18);
    --bg:#0a0a0a; --bg2:#0d0d0d; --bg3:#111; --border:#1a1a1a;
    --font:'Helvetica Neue',Helvetica,Arial,sans-serif; --mono:'Source Code Pro',monospace;
  }
  body { background:var(--bg); }
  @keyframes fadeIn  { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
  @keyframes slideIn { from{opacity:0;transform:translateX(28px)} to{opacity:1;transform:translateX(0)} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.3} }
  @keyframes spin    { to{transform:rotate(360deg)} }

  .dash-shell { display:flex; height:100vh; overflow:hidden; background:var(--bg); font-family:var(--font); color:#e8e8e8; }

  /* ── Sidebar ── */
  .sidebar { width:220px; flex-shrink:0; background:var(--bg2); border-right:1px solid var(--border); display:flex; flex-direction:column; overflow:hidden; }
  .sidebar-logo { height:56px; display:flex; align-items:center; gap:9px; padding:0 18px; border-bottom:1px solid var(--border); flex-shrink:0; text-decoration:none; }
  .sidebar-logo-box { width:22px; height:22px; background:var(--green); border-radius:4px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .sidebar-logo-box svg { width:12px; height:12px; fill:#0a0a0a; }
  .sidebar-logo-text { font-size:14px; font-weight:700; color:#fff; letter-spacing:-0.01em; }
  .sidebar-logo-text em { color:var(--green); font-style:normal; }
  .sidebar-project { padding:14px 16px; border-bottom:1px solid var(--border); flex-shrink:0; }
  .sidebar-project-label { font-size:9px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#2e2e2e; margin-bottom:8px; padding-left:2px; }
  .sidebar-project-select { width:100%; background:var(--bg); border:1px solid #1e1e1e; border-radius:4px; padding:8px 10px; font-family:var(--font); font-size:12px; color:#888; outline:none; cursor:pointer; appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23333'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 10px center; }
  .sidebar-project-loading { font-size:11px; color:#2e2e2e; padding:8px 2px; font-style:italic; }
  .sidebar-project-empty { display:flex; flex-direction:column; gap:8px; }
  .sidebar-project-none { font-size:11px; color:#333; padding:4px 2px; }
  .sidebar-create-btn { width:100%; background:rgba(0,237,100,0.07); border:1px solid rgba(0,237,100,0.2); border-radius:4px; padding:8px 10px; font-family:var(--font); font-size:12px; color:#00ed64; cursor:pointer; transition:all 0.15s; text-align:left; letter-spacing:0.02em; }
  .sidebar-create-btn:hover { background:rgba(0,237,100,0.13); border-color:rgba(0,237,100,0.35); }
  .sidebar-nav { flex:1; overflow-y:auto; padding:12px 10px; }
  .sidebar-nav::-webkit-scrollbar { width:3px; }
  .sidebar-nav::-webkit-scrollbar-thumb { background:#1e1e1e; border-radius:2px; }
  .sidebar-section-label { font-size:9px; font-weight:700; letter-spacing:0.13em; text-transform:uppercase; color:#2a2a2a; padding:10px 8px 6px; }
  .sidebar-item { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:4px; cursor:pointer; transition:background 0.12s; text-decoration:none; margin-bottom:1px; position:relative; }
  .sidebar-item:hover { background:#131313; }
  .sidebar-item.active { background:var(--green-dim); }
  .sidebar-item-icon { font-size:14px; width:18px; text-align:center; flex-shrink:0; line-height:1; opacity:0.7; }
  .sidebar-item.active .sidebar-item-icon { opacity:1; }
  .sidebar-item-label { font-size:13px; font-weight:500; color:#444; flex:1; transition:color 0.12s; }
  .sidebar-item:hover .sidebar-item-label { color:#888; }
  .sidebar-item.active .sidebar-item-label { color:#ddd; }
  .sidebar-item-badge { font-size:10px; font-weight:700; font-family:var(--mono); color:#ff4d4d; background:rgba(255,77,77,0.08); border:1px solid rgba(255,77,77,0.15); padding:1px 7px; border-radius:10px; min-width:22px; text-align:center; }
  .sidebar-item.active::before { content:''; position:absolute; left:0; top:6px; bottom:6px; width:2px; background:var(--green); border-radius:0 2px 2px 0; }
  .sidebar-item-soon { font-size:9px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:#2e2e2e; border:1px solid #1e1e1e; padding:2px 6px; border-radius:3px; }
  .sidebar-footer { padding:14px 16px; border-top:1px solid var(--border); flex-shrink:0; display:flex; flex-direction:column; gap:8px; }
  .sidebar-status { display:flex; align-items:center; gap:7px; font-size:11px; color:#2e2e2e; }
  .sidebar-status-dot { width:6px; height:6px; border-radius:50%; background:var(--green); box-shadow:0 0 5px var(--green); animation:pulse 2.5s infinite; flex-shrink:0; }
  .sidebar-version { font-family:var(--mono); font-size:10px; color:#222; }

  /* ── Main ── */
  .dash-main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
  .dash-topbar { height:56px; display:flex; align-items:center; justify-content:space-between; padding:0 28px; border-bottom:1px solid var(--border); background:var(--bg2); flex-shrink:0; }
  .dash-topbar-left { display:flex; align-items:center; gap:10px; }
  .dash-page-title { font-size:14px; font-weight:700; color:#ddd; letter-spacing:-0.01em; }
  .dash-page-crumb { font-size:12px; color:#2e2e2e; }
  .dash-topbar-right { display:flex; align-items:center; gap:10px; }
  .dash-live-pill { display:flex; align-items:center; gap:6px; font-size:11px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#2a2a2a; border:1px solid #1a1a1a; padding:5px 12px; border-radius:4px; }
  .dash-live-dot { width:6px; height:6px; border-radius:50%; background:var(--green); box-shadow:0 0 5px var(--green); animation:pulse 2s infinite; }
  .dash-content { flex:1; overflow-y:auto; padding:28px; animation:fadeIn 0.25s ease both; }
  .dash-content::-webkit-scrollbar { width:4px; }
  .dash-content::-webkit-scrollbar-thumb { background:#1a1a1a; border-radius:2px; }

  .content-header { margin-bottom:24px; }
  .content-eyebrow { font-size:10px; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:var(--green); margin-bottom:6px; }
  .content-title { font-size:20px; font-weight:800; letter-spacing:-0.02em; color:#fff; margin-bottom:4px; }
  .content-desc { font-size:12.5px; color:#3a3a3a; line-height:1.6; }
  .summary-chips { display:flex; gap:10px; margin-bottom:20px; flex-wrap:wrap; }
  .chip { background:var(--bg2); border:1px solid var(--border); border-radius:4px; padding:10px 18px; display:flex; align-items:center; gap:10px; min-width:110px; }
  .chip-val { font-family:var(--mono); font-size:20px; font-weight:700; line-height:1; }
  .chip-label { font-size:11px; color:#333; letter-spacing:0.06em; text-transform:uppercase; }

  /* ── No project empty state ── */
  .no-project-state { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; gap:20px; animation:fadeIn 0.3s ease both; }
  .no-project-icon { font-size:48px; opacity:0.2; }
  .no-project-title { font-size:18px; font-weight:700; color:#333; letter-spacing:-0.01em; }
  .no-project-desc { font-size:13px; color:#2a2a2a; text-align:center; max-width:340px; line-height:1.7; }
  .no-project-btn { display:inline-flex; align-items:center; gap:8px; background:rgba(0,237,100,0.08); border:1px solid rgba(0,237,100,0.25); border-radius:5px; color:#00ed64; font-size:13px; font-weight:600; font-family:var(--font); padding:10px 22px; cursor:pointer; transition:all 0.15s; letter-spacing:0.03em; }
  .no-project-btn:hover { background:rgba(0,237,100,0.15); border-color:rgba(0,237,100,0.45); }

  /* ── Modal ── */
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:1000; animation:fadeIn 0.15s ease both; }
  .modal-box { background:#0f0f0f; border:1px solid #1e1e1e; border-radius:8px; width:440px; max-width:92vw; overflow:hidden; animation:slideIn 0.2s cubic-bezier(0.22,1,0.36,1) both; }
  .modal-header { display:flex; align-items:center; justify-content:space-between; padding:18px 24px; border-bottom:1px solid #161616; }
  .modal-title { font-size:14px; font-weight:700; color:#ddd; letter-spacing:-0.01em; }
  .modal-close { background:none; border:none; color:#333; font-size:18px; cursor:pointer; line-height:1; padding:2px 6px; border-radius:3px; transition:color 0.12s; }
  .modal-close:hover { color:#888; }
  .modal-body { padding:24px; display:flex; flex-direction:column; gap:16px; }
  .modal-field { display:flex; flex-direction:column; gap:7px; }
  .modal-label { font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:#333; }
  .modal-input { background:#0a0a0a; border:1px solid #1e1e1e; border-radius:4px; padding:10px 14px; font-family:var(--font); font-size:13px; color:#ccc; outline:none; transition:border-color 0.15s; }
  .modal-input:focus { border-color:#2e2e2e; }
  .modal-input::placeholder { color:#2e2e2e; }
  .modal-error { font-size:11px; color:#ff4d4d; background:rgba(255,77,77,0.07); border:1px solid rgba(255,77,77,0.15); padding:8px 12px; border-radius:4px; }
  .modal-footer { display:flex; gap:8px; justify-content:flex-end; padding:16px 24px; border-top:1px solid #161616; }
  .modal-btn-cancel { background:none; border:1px solid #1e1e1e; border-radius:4px; color:#444; font-size:12px; font-family:var(--font); padding:8px 18px; cursor:pointer; transition:all 0.15s; }
  .modal-btn-cancel:hover { border-color:#2a2a2a; color:#888; }
  .modal-btn-create { background:rgba(0,237,100,0.09); border:1px solid rgba(0,237,100,0.25); border-radius:4px; color:#00ed64; font-size:12px; font-weight:700; font-family:var(--font); padding:8px 20px; cursor:pointer; transition:all 0.15s; letter-spacing:0.04em; display:flex; align-items:center; gap:8px; }
  .modal-btn-create:hover:not(:disabled) { background:rgba(0,237,100,0.16); border-color:rgba(0,237,100,0.4); }
  .modal-btn-create:disabled { opacity:0.4; cursor:default; }
  .modal-spinner { width:12px; height:12px; border:1.5px solid rgba(0,237,100,0.3); border-top-color:#00ed64; border-radius:50%; animation:spin 0.7s linear infinite; }

  /* ── Slide / back ── */
  .view-slide { animation:slideIn 0.28s cubic-bezier(0.22,1,0.36,1) both; }
  .back-btn { display:inline-flex; align-items:center; gap:7px; background:none; border:1px solid #1e1e1e; border-radius:4px; color:#555; font-size:12px; font-family:var(--font); padding:6px 14px; cursor:pointer; transition:all 0.15s; letter-spacing:0.03em; margin-bottom:20px; }
  .back-btn:hover { border-color:#2a2a2a; color:#aaa; }

  /* ── Issue context strip ── */
  .issue-strip { display:flex; align-items:center; gap:12px; padding:14px 20px; background:var(--bg2); border:1px solid var(--border); border-radius:6px; margin-bottom:16px; flex-wrap:wrap; }
  .issue-strip-title { font-size:13px; color:#bbb; font-weight:500; flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .issue-strip-trace { font-family:var(--mono); font-size:10px; color:#2e2e2e; background:#111; border:1px solid #1a1a1a; padding:3px 10px; border-radius:3px; white-space:nowrap; }

  /* ── AI panel ── */
  .ai-panel { background:var(--bg2); border:1px solid var(--border); border-radius:6px; overflow:hidden; }
  .ai-panel-header { display:flex; align-items:center; justify-content:space-between; padding:14px 24px; border-bottom:1px solid #161616; background:#0f0f0f; gap:12px; flex-wrap:wrap; }
  .ai-panel-header-left { display:flex; align-items:center; gap:10px; }
  .ai-type-badge { font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; padding:4px 10px; border-radius:3px; }
  .ai-type-badge.fix  { color:#00ed64; background:rgba(0,237,100,0.08); border:1px solid rgba(0,237,100,0.2); }
  .ai-type-badge.root { color:#f5a623; background:rgba(245,166,35,0.08); border:1px solid rgba(245,166,35,0.2); }
  .ai-panel-sub { font-size:12px; color:#333; }
  .ai-panel-meta { font-family:var(--mono); font-size:10px; color:#252525; }
  .ai-loading { padding:56px 24px; display:flex; flex-direction:column; align-items:center; gap:14px; }
  .ai-loading-spinner { width:26px; height:26px; border:2px solid #1e1e1e; border-top-color:var(--green); border-radius:50%; animation:spin 0.8s linear infinite; }
  .ai-loading-label { font-size:13px; color:#333; }
  .ai-loading-sub   { font-size:11px; color:#222; }
  .ai-err { padding:40px 24px; display:flex; flex-direction:column; align-items:center; gap:10px; }
  .ai-err-icon  { font-size:24px; opacity:0.35; }
  .ai-err-title { font-size:14px; color:#444; font-weight:600; }
  .ai-err-msg   { font-size:11px; color:#2e2e2e; font-family:var(--mono); }

  /* ── Markdown body ── */
  .ai-body { padding:28px 32px; line-height:1.85; font-size:13.5px; color:#777; }
  .ai-body h1,.ai-body h2 { font-size:16px; font-weight:700; color:#ddd; letter-spacing:-0.01em; margin:28px 0 12px; padding-bottom:8px; border-bottom:1px solid #161616; }
  .ai-body h1:first-child,.ai-body h2:first-child { margin-top:0; }
  .ai-body h3 { font-size:14px; font-weight:700; color:#bbb; margin:20px 0 8px; }
  .ai-body h4 { font-size:13px; font-weight:600; color:#999; margin:16px 0 6px; }
  .ai-body p  { margin-bottom:12px; }
  .ai-body ul,.ai-body ol { padding-left:22px; margin-bottom:12px; }
  .ai-body li { margin-bottom:5px; color:#666; }
  .ai-body strong { color:#ccc; font-weight:600; }
  .ai-body em { font-style:italic; }
  .ai-body code { font-family:var(--mono); font-size:12px; color:#00ed64; background:rgba(0,237,100,0.07); border:1px solid rgba(0,237,100,0.12); padding:1px 6px; border-radius:3px; }
  .ai-body pre { background:#0d0d0d; border:1px solid #1e1e1e; border-radius:4px; padding:18px 20px; overflow-x:auto; margin:14px 0; }
  .ai-body pre code { background:none; border:none; padding:0; color:#c8c8c8; font-size:12.5px; line-height:1.75; }
  .ai-body blockquote { border-left:2px solid var(--green); padding:8px 16px; margin:14px 0; background:rgba(0,237,100,0.03); color:#666; font-style:italic; }
  .ai-body hr { border:none; border-top:1px solid #161616; margin:20px 0; }
`;

/* ─────────────────────────────────────────────
   MARKDOWN RENDERER
───────────────────────────────────────────── */
function renderMarkdown(md) {
  if (!md) return "";
  return md
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, _lang, code) =>
      `<pre><code>${code.replace(/</g,"&lt;").replace(/>/g,"&gt;").trim()}</code></pre>`)
    .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^### (.+)$/gm,  "<h3>$1</h3>")
    .replace(/^## (.+)$/gm,   "<h2>$1</h2>")
    .replace(/^# (.+)$/gm,    "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,     "<em>$1</em>")
    .replace(/`([^`]+)`/g,     "<code>$1</code>")
    .replace(/^---$/gm,        "<hr>")
    .replace(/^> (.+)$/gm,     "<blockquote>$1</blockquote>")
    .replace(/^\s*[-*] (.+)$/gm, "<li>$1</li>")
    .replace(/^\s*\d+\. (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    .split("\n\n")
    .map(b => {
      const t = b.trim();
      if (!t) return "";
      if (/^<(h[1-4]|ul|ol|pre|blockquote|hr)/.test(t)) return t;
      return `<p>${t}</p>`;
    })
    .join("\n");
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function timeAgo(ms) {
  if (!ms) return "—";
  const s = Math.floor((Date.now()-ms)/1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s/60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m/60); if (h < 24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}
function fmtDate(ms) {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});
}
function shortFp(fp) {
  if (!fp) return "";
  return fp.length > 20 ? fp.slice(0,8)+"…"+fp.slice(-6) : fp;
}
const LEVEL_DOT = { ERROR:"#ff4d4d", WARN:"#f5a623", INFO:"#00ed64", DEBUG:"#555" };
const PAGE_SIZE = 10;

/* ─────────────────────────────────────────────
   CREATE PROJECT MODAL
───────────────────────────────────────────── */
function CreateProjectModal({ onClose, onCreated }) {
  const [name,    setName]    = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  async function handleCreate() {
    if (!name.trim()) { setError("Project name is required."); return; }
    setLoading(true); setError(null);
    try {
      const res = await apiFetch(`${BASE_URL}/api/projects/create`, {
        method: "POST",
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => `HTTP ${res.status}`);
        throw new Error(msg || `HTTP ${res.status}`);
      }
      const project = await res.json();
      onCreated(project);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">Create New Project</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <label className="modal-label">Project Name</label>
            <input
              className="modal-input"
              placeholder="e.g. my-spring-app"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCreate()}
              autoFocus
            />
          </div>
          {error && <div className="modal-error">⚠ {error}</div>}
        </div>
        <div className="modal-footer">
          <button className="modal-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="modal-btn-create" onClick={handleCreate} disabled={loading}>
            {loading && <span className="modal-spinner" />}
            {loading ? "Creating…" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   AI ANALYSIS VIEW
   ✅ FIX 1: Use correct endpoint per mode
───────────────────────────────────────────── */
function AiAnalysisView({ issue, mode, onBack, apiKey, projectId }) {
  const [content,  setContent]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [resolvedKey, setResolvedKey] = useState(apiKey || null);

  // If apiKey wasn't passed yet, fetch it now from the project endpoint
  useEffect(() => {
    if (resolvedKey || !projectId) return;
    apiFetch(`${BASE_URL}/api/projects/${projectId}/api-key`)
      .then(r => r && r.ok ? r.json() : null)
      .then(data => { if (data?.apiKey) setResolvedKey(data.apiKey); })
      .catch(() => {});
  }, [projectId, resolvedKey]);

  useEffect(() => {
    setLoading(true); setError(null); setContent(null);

    // Use traceId if present, fall back to id
    const traceId = issue.traceId || issue.id;
    if (!traceId) {
      setError("No trace ID found on this issue.");
      setLoading(false);
      return;
    }

    const endpoint = mode === "fix"
      ? `${BASE_URL}/api/logs/fix/${traceId}`
      : `${BASE_URL}/api/logs/root-cause/${traceId}`;

    // Build headers — send BOTH Bearer token AND x-api-key so whichever
    // auth method the backend uses on these routes will match
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
      ...(resolvedKey ? { "x-api-key": resolvedKey } : {}),
    };

    fetch(endpoint, { headers })
      .then(r => {
        if (r.status === 401) {
          // Try refreshing then retry once
          return refreshTokenApi().then(refreshed => {
            if (!refreshed) { logout(); return null; }
            return fetch(endpoint, {
              headers: {
                ...headers,
                "Authorization": `Bearer ${getToken()}`,
              }
            });
          });
        }
        return r;
      })
      .then(r => {
        if (!r) return;
        if (!r.ok) throw new Error(`${r.status} from ${endpoint}`);
        return r.text();
      })
      .then(raw => {
        if (!raw) return;
        try {
          const data = JSON.parse(raw);
          const str = typeof data === "string"
            ? data
            : data.result ?? data.content ?? data.message ?? data.analysis ?? data.fix ?? data.rootCause ?? JSON.stringify(data, null, 2);
          setContent(str);
        } catch {
          setContent(raw);
        }
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  }, [issue.traceId, issue.id, mode, resolvedKey]);

  return (
    <div className="view-slide">
      <button className="back-btn" onClick={onBack}>← Back to Issues</button>
      <div className="issue-strip">
        <span className={`it-level ${issue.level}`}>
          <span className="it-level-dot" style={{ background: LEVEL_DOT[issue.level] || "#555" }} />
          {issue.level}
        </span>
        <span className="issue-strip-title" title={issue.title}>{issue.title}</span>
        <span className="issue-strip-trace">trace: {issue.traceId}</span>
      </div>
      <div className="ai-panel">
        <div className="ai-panel-header">
          <div className="ai-panel-header-left">
            <span className={`ai-type-badge ${mode === "fix" ? "fix" : "root"}`}>
              {mode === "fix" ? "⚡ Fix Suggestion" : "🔍 Root Cause"}
            </span>
            <span className="ai-panel-sub">Powered by Gemini</span>
          </div>
          <span className="ai-panel-meta">Issue #{issue.id} · {fmtDate(issue.lastSeen)}</span>
        </div>
        {loading && (
          <div className="ai-loading">
            <div className="ai-loading-spinner" />
            <span className="ai-loading-label">
              {mode === "fix" ? "Generating fix suggestion…" : "Analyzing root cause…"}
            </span>
            <span className="ai-loading-sub">Gemini is reading your stack trace</span>
          </div>
        )}
        {error && (
          <div className="ai-err">
            <span className="ai-err-icon">⚠</span>
            <span className="ai-err-title">Analysis failed</span>
            <span className="ai-err-msg">{error}</span>
          </div>
        )}
        {!loading && !error && content && (
          <div className="ai-body" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ISSUES TABLE
───────────────────────────────────────────── */
function IssuesTable({ projectId, onCountsReady, onAnalyze }) {
  const [issues,   setIssues]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState("");
  const [lvl,      setLvl]      = useState("ALL");
  const [status,   setStatus]   = useState("ALL");
  const [sortKey,  setSortKey]  = useState("lastSeen");
  const [sortDir,  setSortDir]  = useState("desc");
  const [page,     setPage]     = useState(1);
  const [refresh,  setRefresh]  = useState(0);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true); setError(null);
    apiFetch(`${BASE_URL}/api/issues/project/${projectId}`)
      .then(r => { if (!r || !r.ok) throw new Error(`HTTP ${r?.status}`); return r.json(); })
      .then(d => {
        setIssues(d); setLoading(false);
        onCountsReady?.({
          total:    d.length,
          errors:   d.filter(i => i.level  === "ERROR").length,
          open:     d.filter(i => i.status === "OPEN").length,
          resolved: d.filter(i => i.status === "RESOLVED").length,
        });
      })
      .catch(e => { if (e) { setError(e.message); setLoading(false); } });
  }, [refresh, projectId]);

  function doRefresh() {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 700);
    setRefresh(r => r+1);
  }
  function toggleSort(k) {
    if (sortKey === k) setSortDir(d => d==="asc"?"desc":"asc");
    else { setSortKey(k); setSortDir("desc"); }
    setPage(1);
  }

  const filtered = issues
    .filter(i => lvl    === "ALL" || i.level  === lvl)
    .filter(i => status === "ALL" || i.status === status)
    .filter(i => !search || i.title?.toLowerCase().includes(search.toLowerCase()) ||
                             i.fingerprint?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mul = sortDir==="asc"?1:-1;
      const av=a[sortKey]??0, bv=b[sortKey]??0;
      return typeof av==="string" ? mul*av.localeCompare(bv) : mul*(av-bv);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length/PAGE_SIZE));
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  function SortArrow({ k }) {
    if (sortKey!==k) return <span className="it-th-arrow">↕</span>;
    return <span className="it-th-arrow">{sortDir==="asc"?"↑":"↓"}</span>;
  }
  function Col({ label, k }) {
    return <div className={`it-th ${sortKey===k?"sorted":""}`} onClick={()=>toggleSort(k)}>{label} <SortArrow k={k}/></div>;
  }

  return (
    <div className="it-root">
      <div className="it-toolbar">
        <div className="it-search-wrap">
          <span className="it-search-icon">⌕</span>
          <input className="it-search" placeholder="Search by title or fingerprint…" value={search}
            onChange={e=>{ setSearch(e.target.value); setPage(1); }} />
        </div>
        {["ALL","ERROR","WARN","INFO","DEBUG"].map(l => (
          <button key={l} className={`it-filter-btn ${lvl===l?"active":""}`}
            onClick={()=>{ setLvl(l); setPage(1); }}>{l}</button>
        ))}
        <div style={{ width:1, height:24, background:"#1a1a1a", flexShrink:0 }} />
        {["ALL","OPEN","RESOLVED","IGNORED"].map(s => (
          <button key={s} className={`it-filter-btn ${status===s?"active":""}`}
            onClick={()=>{ setStatus(s); setPage(1); }}>{s}</button>
        ))}
        <button className={`it-filter-btn ${spinning?"active":""}`} onClick={doRefresh}
          style={{ marginLeft:"auto", flexShrink:0 }}>
          <span style={{ display:"inline-block", animation:spinning?"spin 0.7s linear infinite":"none" }}>↺</span>
          {" "}Refresh
        </button>
      </div>

      <div className="it-table-wrap">
        <div className="it-thead">
          <Col label="Issue"       k="title"          />
          <Col label="Level"       k="level"          />
          <Col label="Status"      k="status"         />
          <Col label="Occurrences" k="occurrenceCount"/>
          <Col label="First Seen"  k="firstSeen"      />
          <Col label="Last Seen"   k="lastSeen"       />
          <div className="it-th">Actions</div>
        </div>
        <div>
          {loading && <div className="it-state"><div className="it-spinner"/><span className="it-state-title">Loading issues…</span></div>}
          {error   && <div className="it-state"><span className="it-state-icon">⚠</span><span className="it-state-title">Failed to load</span><span className="it-state-sub">{error}</span></div>}
          {!loading && !error && paginated.length===0 && (
            <div className="it-state">
              <span className="it-state-icon">✓</span>
              <span className="it-state-title">No issues found</span>
              <span className="it-state-sub">{issues.length>0?"Try adjusting your filters.":"No issues reported yet."}</span>
            </div>
          )}
          {!loading && !error && paginated.map(issue => (
            <div className="it-row" key={issue.id}>
              <div className="it-td"><div className="it-title-cell">
                <span className="it-title-text" title={issue.title}>{issue.title||"Untitled"}</span>
                <span className="it-fingerprint">{shortFp(issue.fingerprint)}</span>
              </div></div>
              <div className="it-td"><span className={`it-level ${issue.level}`}>
                <span className="it-level-dot" style={{ background:LEVEL_DOT[issue.level]||"#555" }}/>{issue.level||"—"}
              </span></div>
              <div className="it-td"><span className={`it-status ${issue.status}`}>{issue.status||"—"}</span></div>
              <div className="it-td"><span className={`it-occurrences ${issue.occurrenceCount>=100?"high":issue.occurrenceCount>=20?"med":""}`}>
                {issue.occurrenceCount?.toLocaleString()??"—"}
              </span></div>
              <div className="it-td"><span className="it-time"><span className="it-time-val">{fmtDate(issue.firstSeen)}</span></span></div>
              <div className="it-td"><span className="it-time"><span className="it-time-val">{fmtDate(issue.lastSeen)}</span><span className="it-time-ago">{timeAgo(issue.lastSeen)}</span></span></div>
              <div className="it-td">
                <div className="it-actions">
                  <button className="it-btn-fix"  onClick={()=>onAnalyze(issue,"fix")}>⚡ Fix</button>
                  <button className="it-btn-root" onClick={()=>onAnalyze(issue,"root")}>🔍 Root</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {!loading && !error && (
          <div className="it-footer">
            <span className="it-count">
              Showing <span>{Math.min((page-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(page*PAGE_SIZE,filtered.length)}</span> of <span>{filtered.length}</span>
              {filtered.length!==issues.length&&<span style={{color:"#2a2a2a"}}> (filtered from {issues.length})</span>}
            </span>
            <div className="it-pagination">
              <button className="it-page-btn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>‹</button>
              {Array.from({length:Math.min(totalPages,5)},(_,i)=>{
                const p=totalPages<=5?i+1:page<=3?i+1:page>=totalPages-2?totalPages-4+i:page-2+i;
                return <button key={p} className={`it-page-btn ${page===p?"current":""}`} onClick={()=>setPage(p)}>{p}</button>;
              })}
              <button className="it-page-btn" disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}>›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   NAV CONFIG
───────────────────────────────────────────── */
const NAV = [
  { section:"Monitor", items:[
    { id:"errors",      icon:"⚠",  label:"Errors",        soon:false },
    { id:"performance", icon:"⚡",  label:"Performance",   soon:true  },
    { id:"health",      icon:"💚", label:"Health Report", soon:false },
    { id:"metrics",     icon:"📊", label:"API Metrics",   soon:false },
  ]},
  { section:"Project", items:[
    { id:"settings", icon:"⚙",  label:"Settings", soon:true       },
    { id:"sdk",      icon:"📦", label:"SDK Docs",  soon:false, href:"/sdk" },
  ]},
];

/* ─────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────── */
export default function DashboardPage() {
  const [activeNav,       setActiveNav]       = useState("errors");
  const [projects,        setProjects]        = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectId,       setProjectId]       = useState(null);
  const [counts,          setCounts]          = useState({ total:0, errors:0, open:0, resolved:0 });
  const [analyzing,       setAnalyzing]       = useState(null);
  const [showCreate,      setShowCreate]      = useState(false);
  const [apiKey,          setApiKey]          = useState(null);
  const user = getUser();

  useEffect(() => {
    setProjectsLoading(true);
    apiFetch(`${BASE_URL}/api/projects/me`)
      .then(r => { if (!r || !r.ok) throw new Error(`HTTP ${r?.status}`); return r.json(); })
      .then(data => {
        const list = Array.isArray(data) ? data : (data.projects ?? data.content ?? []);
        setProjects(list);
        if (list.length > 0) setProjectId(list[0].id);
        setProjectsLoading(false);
      })
      .catch(() => {
        setProjects([]);
        setProjectsLoading(false);
      });
  }, []);

  // Auto-fetch API key whenever project changes so AI endpoints work immediately
  useEffect(() => {
    if (!projectId) return;
    setApiKey(null);
    apiFetch(`${BASE_URL}/api/projects/${projectId}/api-key`)
      .then(r => r && r.ok ? r.json() : null)
      .then(data => { if (data?.apiKey) setApiKey(data.apiKey); })
      .catch(() => {});
  }, [projectId]);

  const activeProject = projects.find(p => p.id === projectId);
  const hasProjects   = projects.length > 0;

  function switchNav(id) { setActiveNav(id); setAnalyzing(null); }

  function handleProjectCreated(newProject) {
    setProjects(prev => [...prev, newProject]);
    setProjectId(newProject.id);
    setShowCreate(false);
  }

  function renderSidebarProject() {
    if (projectsLoading) {
      return <span className="sidebar-project-loading">Loading…</span>;
    }
    if (!hasProjects) {
      return (
        <div className="sidebar-project-empty">
          <span className="sidebar-project-none">No projects yet</span>
          <button className="sidebar-create-btn" onClick={() => setShowCreate(true)}>
            + Create project
          </button>
        </div>
      );
    }
    return (
      <select
        className="sidebar-project-select"
        value={projectId ?? ""}
        onChange={e => { setProjectId(Number(e.target.value)); setAnalyzing(null); }}
      >
        {projects.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    );
  }

  async function fetchApiKey() {
    if (!projectId) return;
    try {
      const res = await apiFetch(`${BASE_URL}/api/projects/${projectId}/api-key`);
      if (!res.ok) throw new Error("Failed to fetch key");
      const data = await res.json();
      setApiKey(data.apiKey);
      alert(`Your API Key: ${data.apiKey}\n\nKeep this safe!`);
    } catch (e) {
      alert("Error fetching API Key: " + e.message);
    }
  }

  function renderContent() {
    if (!projectsLoading && !hasProjects) {
      return (
        <div className="no-project-state">
          <span className="no-project-icon">📂</span>
          <span className="no-project-title">No projects yet</span>
          <span className="no-project-desc">
            Create your first project to start tracking errors, viewing health reports, and monitoring API metrics.
          </span>
          <button className="no-project-btn" onClick={() => setShowCreate(true)}>
            + Create your first project
          </button>
        </div>
      );
    }

    switch (activeNav) {
      case "errors":
        return analyzing ? (
          <AiAnalysisView
            issue={analyzing.issue}
            mode={analyzing.mode}
            onBack={() => setAnalyzing(null)}
            apiKey={apiKey}
            projectId={projectId}
          />
        ) : (
          <>
            <div className="content-header">
              <div className="content-eyebrow">Monitor · Errors</div>
              <div className="content-title">Error Tracker</div>
              <div className="content-desc">
                All issues from <strong style={{ color:"#555", fontWeight:600 }}>{activeProject?.name ?? "…"}</strong>
              </div>
            </div>
            <div className="summary-chips">
              {[
                { label:"Total",    val:counts.total,    color:"#555"    },
                { label:"Errors",   val:counts.errors,   color:"#ff4d4d" },
                { label:"Open",     val:counts.open,     color:"#f5a623" },
                { label:"Resolved", val:counts.resolved, color:"#00ed64" },
              ].map(c => (
                <div className="chip" key={c.label}>
                  <span className="chip-val" style={{ color:c.color }}>{c.val}</span>
                  <span className="chip-label">{c.label}</span>
                </div>
              ))}
            </div>
            <IssuesTable
              projectId={projectId}
              onCountsReady={setCounts}
              onAnalyze={(issue,mode) => setAnalyzing({issue,mode})}
            />
          </>
        );

      case "health":
        return (
          <>
            <div className="content-header">
              <div className="content-eyebrow">Monitor · Health</div>
              <div className="content-title">Health Report</div>
              <div className="content-desc">
                AI-generated 24-hour health summary for <strong style={{ color:"#555", fontWeight:600 }}>{activeProject?.name ?? "…"}</strong>
              </div>
            </div>
            {/* ✅ FIX 3: Pass projectId down to HealthReport */}
            <HealthReport projectId={projectId} />
          </>
        );

      case "metrics":
        return (
          <>
            <div className="content-header">
              <div className="content-eyebrow">Monitor · Metrics</div>
              <div className="content-title">API Metrics</div>
              <div className="content-desc">
                Performance and traffic insights for <strong style={{ color:"#555", fontWeight:600 }}>{activeProject?.name ?? "…"}</strong>
              </div>
            </div>
            <ApiMetrics projectId={projectId}/>
          </>
        );

      default:
        return (
          <div style={{ padding:"60px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:16, color:"#2a2a2a", border:"1px dashed #1a1a1a", borderRadius:6, background:"#0d0d0d" }}>
            <span style={{ fontSize:32 }}>🚧</span>
            <span style={{ fontSize:14, fontWeight:600, color:"#333" }}>{activeNav.charAt(0).toUpperCase()+activeNav.slice(1)}</span>
            <span style={{ fontSize:12, color:"#252525" }}>Coming soon</span>
          </div>
        );
    }
  }

  return (
    <>
      <style>{TABLE_STYLES}</style>
      <style>{DASH_STYLES}</style>

      {showCreate && (
        <CreateProjectModal
          onClose={() => setShowCreate(false)}
          onCreated={handleProjectCreated}
        />
      )}

      <div className="dash-shell">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <a href="/" className="sidebar-logo">
            <div className="sidebar-logo-box">
              <svg viewBox="0 0 12 12"><rect x="0.5" y="0.5" width="4" height="4" rx="0.8"/><rect x="7.5" y="0.5" width="4" height="4" rx="0.8"/><rect x="0.5" y="7.5" width="4" height="4" rx="0.8"/><rect x="7.5" y="7.5" width="4" height="4" rx="0.8"/></svg>
            </div>
            <span className="sidebar-logo-text">Log<em>Help</em></span>
          </a>

          <div className="sidebar-project">
            <div className="sidebar-project-label">Project</div>
            {renderSidebarProject()}
            {!projectsLoading && hasProjects && (
              <button className="sidebar-create-btn" style={{ marginTop:8 }} onClick={() => setShowCreate(true)}>
                + New project
              </button>
            )}
          </div>

          <nav className="sidebar-nav">
            {NAV.map(group => (
              <div key={group.section}>
                <div className="sidebar-section-label">{group.section}</div>
                {group.items.map(item =>
                  item.href ? (
                    <a key={item.id} href={item.href} className="sidebar-item">
                      <span className="sidebar-item-icon">{item.icon}</span>
                      <span className="sidebar-item-label">{item.label}</span>
                    </a>
                  ) : (
                    <div key={item.id}
                      className={`sidebar-item ${activeNav===item.id&&!item.soon?"active":""}`}
                      onClick={()=>!item.soon&&switchNav(item.id)}
                      style={{ opacity:item.soon?0.5:1 }}>
                      <span className="sidebar-item-icon">{item.icon}</span>
                      <span className="sidebar-item-label">{item.label}</span>
                      {item.id==="errors"&&counts.open>0&&!item.soon&&(
                        <span className="sidebar-item-badge">{counts.open}</span>
                      )}
                      {item.soon&&<span className="sidebar-item-soon">Soon</span>}
                    </div>
                  )
                )}
              </div>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-status"><div className="sidebar-status-dot"/>All systems operational</div>
            <span className="sidebar-version">v1.0.0</span>
          </div>
        </aside>

        {/* MAIN */}
        <div className="dash-main">
          <div className="dash-topbar">
            <div className="dash-topbar-left">
              <span className="dash-page-crumb">{activeProject?.name ?? "—"}</span>
              <span style={{ color:"#1e1e1e" }}>›</span>
              <span className="dash-page-title">
                {analyzing
                  ? analyzing.mode==="fix" ? "Fix Suggestion" : "Root Cause"
                  : NAV.flatMap(g=>g.items).find(i=>i.id===activeNav)?.label ?? "Dashboard"
                }
              </span>
            </div>
            <div className="dash-topbar-right">
              <div className="dash-live-pill"><div className="dash-live-dot"/>Live</div>
              <button
                onClick={fetchApiKey}
                disabled={!projectId}
                style={{
                  background: "#00ed64",
                  border: "none",
                  borderRadius: 4,
                  color: "#000",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "var(--font)",
                  padding: "5px 12px",
                  cursor: "pointer",
                  marginRight: "8px",
                  opacity: projectId ? 1 : 0.5
                }}
              >
                Get API Key
              </button>
              {user?.picture && (
                <img src={user.picture} alt={user.name}
                  style={{ width:28, height:28, borderRadius:"50%", border:"1px solid #1e1e1e", flexShrink:0 }} />
              )}
              {user?.name && (
                <span style={{ fontSize:12, color:"#444", maxWidth:120, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {user.name}
                </span>
              )}
              <button onClick={logout}
                style={{ background:"none", border:"1px solid #1a1a1a", borderRadius:4, color:"#333", fontSize:11, fontFamily:"var(--font)", padding:"5px 12px", cursor:"pointer", letterSpacing:"0.04em", transition:"all 0.15s" }}
                onMouseOver={e=>{ e.target.style.borderColor="#2a2a2a"; e.target.style.color="#888"; }}
                onMouseOut={e=>{ e.target.style.borderColor="#1a1a1a"; e.target.style.color="#333"; }}>
                Sign out
              </button>
            </div>
          </div>

          <div className="dash-content" key={analyzing?`ai-${analyzing.issue.id}-${analyzing.mode}`:activeNav}>
            {renderContent()}
          </div>
        </div>

      </div>
    </>
  );
}