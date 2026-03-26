import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap');

  .it-root {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #e8e8e8;
  }

  /* ── Toolbar ── */
  .it-toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .it-search {
    flex: 1;
    min-width: 200px;
    background: #0d0d0d;
    border: 1px solid #1e1e1e;
    border-radius: 4px;
    padding: 8px 14px 8px 36px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 13px;
    color: #ccc;
    outline: none;
    transition: border-color 0.15s;
  }
  .it-search::placeholder { color: #333; }
  .it-search:focus { border-color: #2e2e2e; }
  .it-search-wrap {
    position: relative;
    flex: 1;
    min-width: 200px;
  }
  .it-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 13px;
    color: #333;
    pointer-events: none;
  }

  .it-filter-btn {
    background: #0d0d0d;
    border: 1px solid #1e1e1e;
    border-radius: 4px;
    padding: 8px 14px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 12px;
    color: #555;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.03em;
    white-space: nowrap;
  }
  .it-filter-btn:hover { border-color: #2a2a2a; color: #888; }
  .it-filter-btn.active { border-color: rgba(0,237,100,0.3); color: #00ed64; background: rgba(0,237,100,0.06); }

  /* ── Table wrapper ── */
  .it-table-wrap {
    background: #0d0d0d;
    border: 1px solid #1a1a1a;
    border-radius: 6px;
    overflow: hidden;
  }

  /* ── Table head ── */
  .it-thead {
    display: grid;
    grid-template-columns: 2fr 80px 80px 100px 120px 110px 90px;
    padding: 0 20px;
    border-bottom: 1px solid #161616;
    background: #0f0f0f;
  }
  .it-th {
    padding: 11px 8px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #333;
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    user-select: none;
    transition: color 0.15s;
    white-space: nowrap;
  }
  .it-th:hover { color: #666; }
  .it-th.sorted { color: #00ed64; }
  .it-th-arrow { font-size: 9px; opacity: 0.6; }

  /* ── Rows ── */
  .it-tbody { }
  .it-row {
    display: grid;
    grid-template-columns: 2fr 80px 80px 100px 120px 110px 90px;
    padding: 0 20px;
    border-bottom: 1px solid #111;
    transition: background 0.12s;
    cursor: pointer;
    align-items: center;
  }
  .it-row:last-child { border-bottom: none; }
  .it-row:hover { background: #111; }

  .it-td {
    padding: 14px 8px;
    font-size: 12.5px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Title cell */
  .it-title-cell { display: flex; flex-direction: column; gap: 3px; overflow: hidden; }
  .it-title-text {
    font-size: 13px;
    color: #ccc;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .it-fingerprint {
    font-family: 'Source Code Pro', monospace;
    font-size: 10px;
    color: #333;
    letter-spacing: 0.04em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Level badge */
  .it-level {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 3px;
    white-space: nowrap;
  }
  .it-level-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .it-level.ERROR  { color: #ff4d4d; background: rgba(255,77,77,0.08);  border: 1px solid rgba(255,77,77,0.15); }
  .it-level.WARN   { color: #f5a623; background: rgba(245,166,35,0.08); border: 1px solid rgba(245,166,35,0.15); }
  .it-level.INFO   { color: #00ed64; background: rgba(0,237,100,0.07);  border: 1px solid rgba(0,237,100,0.15); }
  .it-level.DEBUG  { color: #888;    background: rgba(136,136,136,0.07);border: 1px solid rgba(136,136,136,0.12); }

  /* Status badge */
  .it-status {
    display: inline-flex;
    align-items: center;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 3px;
  }
  .it-status.OPEN     { color: #ff4d4d; background: rgba(255,77,77,0.07);  border: 1px solid rgba(255,77,77,0.12); }
  .it-status.RESOLVED { color: #00ed64; background: rgba(0,237,100,0.06);  border: 1px solid rgba(0,237,100,0.12); }
  .it-status.IGNORED  { color: #444;    background: rgba(68,68,68,0.15);   border: 1px solid #222; }

  /* Occurrence count */
  .it-occurrences {
    font-family: 'Source Code Pro', monospace;
    font-size: 12px;
    color: #888;
    font-weight: 500;
  }
  .it-occurrences.high { color: #ff4d4d; }
  .it-occurrences.med  { color: #f5a623; }

  /* Timestamps */
  .it-time {
    font-family: 'Source Code Pro', monospace;
    font-size: 11px;
    color: #3a3a3a;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .it-time-val { color: #555; font-size: 11.5px; }
  .it-time-ago { color: #2e2e2e; font-size: 10px; }

  /* ── Empty / loading / error states ── */
  .it-state {
    padding: 60px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: #333;
    font-size: 13px;
  }
  .it-state-icon { font-size: 28px; opacity: 0.4; }
  .it-state-title { font-size: 14px; color: #444; font-weight: 600; }
  .it-state-sub { font-size: 12px; color: #2e2e2e; }
  .it-spinner {
    width: 20px; height: 20px;
    border: 2px solid #1e1e1e;
    border-top-color: #00ed64;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Footer bar ── */
  .it-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    border-top: 1px solid #111;
    background: #0f0f0f;
  }
  .it-count {
    font-size: 11px;
    color: #333;
    letter-spacing: 0.04em;
  }
  .it-count span { color: #555; }
  .it-pagination { display: flex; gap: 4px; }
  .it-page-btn {
    width: 28px; height: 28px;
    background: none;
    border: 1px solid #1a1a1a;
    border-radius: 3px;
    color: #444;
    font-size: 11px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.12s;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  .it-page-btn:hover:not(:disabled) { border-color: #2a2a2a; color: #888; }
  .it-page-btn.current { border-color: rgba(0,237,100,0.3); color: #00ed64; background: rgba(0,237,100,0.05); }
  .it-page-btn:disabled { opacity: 0.2; cursor: default; }
`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function timeAgo(epochMs) {
  if (!epochMs) return "—";
  const diff = Date.now() - epochMs;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function fmtDate(epochMs) {
  if (!epochMs) return "—";
  return new Date(epochMs).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function shortFingerprint(fp) {
  if (!fp) return "";
  return fp.length > 20 ? fp.slice(0, 8) + "…" + fp.slice(-6) : fp;
}

function occurrenceClass(n) {
  if (n >= 100) return "high";
  if (n >= 20)  return "med";
  return "";
}

const LEVEL_DOT = { ERROR: "#ff4d4d", WARN: "#f5a623", INFO: "#00ed64", DEBUG: "#555" };
const PAGE_SIZE = 10;

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function IssuesTable({ projectId }) {
  const [issues, setIssues]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [search, setSearch]       = useState("");
  const [levelFilter, setLevel]   = useState("ALL");
  const [statusFilter, setStatus] = useState("ALL");
  const [sortKey, setSortKey]     = useState("lastSeen");
  const [sortDir, setSortDir]     = useState("desc");
  const [page, setPage]           = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://loghelp.onrender.com/api/issues/project/4`, {
      headers: { 'x-api-key': '240c88b3-396b-46dc-92ca-e798e44e11b2' }
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { setIssues(data); setLoading(false); })
      .catch(e  => { setError(e.message); setLoading(false); });
  }, []);

  /* ── Sort ── */
  function toggleSort(key) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
    setPage(1);
  }

  /* ── Filter + sort pipeline ── */
  const filtered = issues
    .filter(i => levelFilter  === "ALL" || i.level  === levelFilter)
    .filter(i => statusFilter === "ALL" || i.status === statusFilter)
    .filter(i => !search || i.title?.toLowerCase().includes(search.toLowerCase()) ||
                             i.fingerprint?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      const av = a[sortKey] ?? 0, bv = b[sortKey] ?? 0;
      if (typeof av === "string") return mul * av.localeCompare(bv);
      return mul * (av - bv);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const LEVEL_FILTERS  = ["ALL", "ERROR", "WARN", "INFO", "DEBUG"];
  const STATUS_FILTERS = ["ALL", "OPEN", "RESOLVED", "IGNORED"];

  function SortArrow({ k }) {
    if (sortKey !== k) return <span className="it-th-arrow">↕</span>;
    return <span className="it-th-arrow">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  function Col({ label, k }) {
    return (
      <div className={`it-th ${sortKey === k ? "sorted" : ""}`} onClick={() => toggleSort(k)}>
        {label} <SortArrow k={k} />
      </div>
    );
  }

  const errorCount    = issues.filter(i => i.level === "ERROR").length;
  const openCount     = issues.filter(i => i.status === "OPEN").length;
  const resolvedCount = issues.filter(i => i.status === "RESOLVED").length;

  return (
    <>
      <style>{styles}</style>
      <div className="it-root">

        {/* ── Summary chips ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {[
            { label: "Total",    val: issues.length,  color: "#555" },
            { label: "Errors",   val: errorCount,     color: "#ff4d4d" },
            { label: "Open",     val: openCount,      color: "#f5a623" },
            { label: "Resolved", val: resolvedCount,  color: "#00ed64" },
          ].map(c => (
            <div key={c.label} style={{
              background: "#0d0d0d",
              border: "1px solid #1a1a1a",
              borderRadius: 4,
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <span style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: c.color }}>{c.val}</span>
              <span style={{ fontSize: 11, color: "#333", letterSpacing: "0.06em", textTransform: "uppercase" }}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="it-toolbar">
          {/* Search */}
          <div className="it-search-wrap">
            <span className="it-search-icon">⌕</span>
            <input
              className="it-search"
              placeholder="Search by title or fingerprint…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* Level filters */}
          {LEVEL_FILTERS.map(l => (
            <button
              key={l}
              className={`it-filter-btn ${levelFilter === l ? "active" : ""}`}
              onClick={() => { setLevel(l); setPage(1); }}
            >{l}</button>
          ))}

          <div style={{ width: 1, height: 24, background: "#1a1a1a", flexShrink: 0 }} />

          {/* Status filters */}
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              className={`it-filter-btn ${statusFilter === s ? "active" : ""}`}
              onClick={() => { setStatus(s); setPage(1); }}
            >{s}</button>
          ))}
        </div>

        {/* ── Table ── */}
        <div className="it-table-wrap">

          {/* Head */}
          <div className="it-thead">
            <Col label="Issue"        k="title"           />
            <Col label="Level"        k="level"           />
            <Col label="Status"       k="status"          />
            <Col label="Occurrences"  k="occurrenceCount" />
            <Col label="First Seen"   k="firstSeen"       />
            <Col label="Last Seen"    k="lastSeen"        />
            <div className="it-th">ID</div>
          </div>

          {/* Body */}
          <div className="it-tbody">
            {loading && (
              <div className="it-state">
                <div className="it-spinner" />
                <span className="it-state-title">Loading issues…</span>
              </div>
            )}

            {error && (
              <div className="it-state">
                <span className="it-state-icon">⚠</span>
                <span className="it-state-title">Failed to load issues</span>
                <span className="it-state-sub">{error}</span>
              </div>
            )}

            {!loading && !error && paginated.length === 0 && (
              <div className="it-state">
                <span className="it-state-icon">✓</span>
                <span className="it-state-title">No issues found</span>
                <span className="it-state-sub">
                  {issues.length > 0 ? "Try adjusting your filters." : "Your application hasn't reported any issues yet."}
                </span>
              </div>
            )}

            {!loading && !error && paginated.map(issue => (
              <div className="it-row" key={issue.id}>

                {/* Title + fingerprint */}
                <div className="it-td">
                  <div className="it-title-cell">
                    <span className="it-title-text" title={issue.title}>{issue.title || "Untitled issue"}</span>
                    <span className="it-fingerprint">{shortFingerprint(issue.fingerprint)}</span>
                  </div>
                </div>

                {/* Level */}
                <div className="it-td">
                  <span className={`it-level ${issue.level}`}>
                    <span className="it-level-dot" style={{ background: LEVEL_DOT[issue.level] || "#555" }} />
                    {issue.level || "—"}
                  </span>
                </div>

                {/* Status */}
                <div className="it-td">
                  <span className={`it-status ${issue.status}`}>{issue.status || "—"}</span>
                </div>

                {/* Occurrences */}
                <div className="it-td">
                  <span className={`it-occurrences ${occurrenceClass(issue.occurrenceCount)}`}>
                    {issue.occurrenceCount?.toLocaleString() ?? "—"}
                  </span>
                </div>

                {/* First seen */}
                <div className="it-td">
                  <span className="it-time">
                    <span className="it-time-val">{fmtDate(issue.firstSeen)}</span>
                  </span>
                </div>

                {/* Last seen */}
                <div className="it-td">
                  <span className="it-time">
                    <span className="it-time-val">{fmtDate(issue.lastSeen)}</span>
                    <span className="it-time-ago">{timeAgo(issue.lastSeen)}</span>
                  </span>
                </div>

                {/* ID */}
                <div className="it-td">
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: "#2e2e2e" }}>#{issue.id}</span>
                </div>

              </div>
            ))}
          </div>

          {/* Footer */}
          {!loading && !error && (
            <div className="it-footer">
              <span className="it-count">
                Showing <span>{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span>{filtered.length}</span> issues
                {filtered.length !== issues.length && <span style={{ color: "#2a2a2a" }}> (filtered from {issues.length})</span>}
              </span>
              <div className="it-pagination">
                <button className="it-page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                  return (
                    <button key={p} className={`it-page-btn ${page === p ? "current" : ""}`} onClick={() => setPage(p)}>{p}</button>
                  );
                })}
                <button className="it-page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}