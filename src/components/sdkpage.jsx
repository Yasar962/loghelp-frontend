import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .gs-root {
    background: #0a0a0a;
    min-height: 100vh;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #e8e8e8;
    padding: 60px 40px;
  }

  .gs-container {
    max-width: 820px;
    margin: 0 auto;
  }

  /* Breadcrumb */
  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #555;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 40px;
  }
  .breadcrumb .active { color: #00ed64; }

  /* Page header */
  .gs-header {
    margin-bottom: 56px;
  }
  .gs-header-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #00ed64;
    margin-bottom: 14px;
  }
  .gs-header h1 {
    font-size: 32px;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: #fff;
    margin-bottom: 14px;
    line-height: 1.2;
  }
  .gs-header p {
    font-size: 14px;
    color: #666;
    line-height: 1.8;
    max-width: 580px;
  }

  /* Timeline progress bar */
  .progress-track {
    display: flex;
    align-items: center;
    gap: 0;
    margin-bottom: 56px;
    background: #111;
    border: 1px solid #1a1a1a;
    border-radius: 6px;
    padding: 0;
    overflow: hidden;
  }
  .progress-step {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 20px;
    border-right: 1px solid #1a1a1a;
    cursor: default;
    position: relative;
  }
  .progress-step:last-child { border-right: none; }
  .progress-step.done .ps-num {
    background: #00ed64;
    color: #0a0a0a;
    border-color: #00ed64;
  }
  .progress-step.done .ps-label { color: #aaa; }
  .ps-num {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 1.5px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    color: #444;
    flex-shrink: 0;
  }
  .ps-label {
    font-size: 12px;
    font-weight: 500;
    color: #3a3a3a;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  /* Steps */
  .steps { display: flex; flex-direction: column; gap: 2px; }

  .step-card {
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 28px;
  }

  .step-header {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 24px;
    border-bottom: 1px solid #161616;
  }
  .step-number {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 1.5px solid #00ed64;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #00ed64;
    flex-shrink: 0;
  }
  .step-meta { flex: 1; }
  .step-title {
    font-size: 13px;
    font-weight: 600;
    color: #ddd;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .step-subtitle {
    font-size: 12px;
    color: #444;
  }
  .step-badge {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #00ed64;
    background: rgba(0, 237, 100, 0.08);
    border: 1px solid rgba(0, 237, 100, 0.2);
    padding: 3px 10px;
    border-radius: 3px;
  }

  .step-body { padding: 24px; }
  .step-desc {
    font-size: 13px;
    color: #666;
    line-height: 1.8;
    margin-bottom: 20px;
  }

  /* Action card (create project CTA) */
  .action-card {
    border: 1px dashed #2a2a2a;
    border-radius: 6px;
    padding: 28px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    background: #0d0d0d;
  }
  .action-card-text h3 {
    font-size: 14px;
    font-weight: 600;
    color: #ccc;
    margin-bottom: 6px;
  }
  .action-card-text p {
    font-size: 12.5px;
    color: #555;
    line-height: 1.6;
    max-width: 400px;
  }
  .action-btn {
    flex-shrink: 0;
    background: #00ed64;
    color: #0a0a0a;
    border: none;
    border-radius: 4px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 10px 20px;
    cursor: pointer;
    transition: opacity 0.15s;
    white-space: nowrap;
  }
  .action-btn:hover { opacity: 0.85; }

  /* API key display */
  .apikey-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #0d0d0d;
    border: 1px solid #1e1e1e;
    border-radius: 4px;
    padding: 12px 16px;
    margin-top: 16px;
  }
  .apikey-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #444;
    flex-shrink: 0;
  }
  .apikey-value {
    font-family: 'Source Code Pro', monospace;
    font-size: 12px;
    color: #00ed64;
    flex: 1;
    letter-spacing: 0.06em;
  }
  .apikey-icon {
    font-size: 13px;
    color: #333;
  }

  /* Code block */
  .code-block {
    background: #0d0d0d;
    border: 1px solid #1e1e1e;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 16px;
  }
  .code-block:last-child { margin-bottom: 0; }
  .code-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 16px;
    border-bottom: 1px solid #161616;
    background: #0f0f0f;
  }
  .code-lang {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #3a3a3a;
  }
  .copy-btn {
    background: none;
    border: 1px solid #222;
    border-radius: 3px;
    color: #444;
    font-size: 11px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 4px 12px;
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: all 0.15s;
  }
  .copy-btn:hover { border-color: #00ed64; color: #00ed64; background: rgba(0,237,100,0.04); }
  .copy-btn.copied { border-color: #00ed64; color: #00ed64; background: rgba(0,237,100,0.08); }
  .code-content { padding: 20px; overflow-x: auto; }
  .code-content pre {
    font-family: 'Source Code Pro', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.85;
    color: #c8c8c8;
    white-space: pre;
  }
  .xml-tag { color: #00ed64; }
  .xml-value { color: #ce9178; }
  .prop-key { color: #9cdcfe; }
  .prop-val { color: #ce9178; }
  .prop-comment { color: #444; font-style: italic; }

  /* Divider label */
  .section-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
  }
  .section-divider span {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #333;
    white-space: nowrap;
  }
  .section-divider::before, .section-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #1a1a1a;
  }

  /* Info box */
  .info-box {
    display: flex;
    gap: 12px;
    background: rgba(0, 237, 100, 0.03);
    border: 1px solid rgba(0, 237, 100, 0.12);
    border-radius: 4px;
    padding: 14px 18px;
    margin-top: 16px;
  }
  .info-icon { color: #00ed64; font-size: 13px; flex-shrink: 0; margin-top: 2px; }
  .info-text { font-size: 12.5px; color: #555; line-height: 1.7; }
  .info-text a { color: #00ed64; text-decoration: none; }
  .info-text a:hover { text-decoration: underline; }
  .info-text code {
    font-family: 'Source Code Pro', monospace;
    font-size: 11.5px;
    color: #00ed64;
    background: rgba(0,237,100,0.08);
    padding: 1px 6px;
    border-radius: 3px;
  }

  /* What happens next */
  .next-card {
    background: #0d0d0d;
    border: 1px solid #1e1e1e;
    border-radius: 6px;
    overflow: hidden;
    margin-top: 40px;
  }
  .next-card-header {
    padding: 16px 24px;
    border-bottom: 1px solid #161616;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .next-card-header-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #00ed64;
    box-shadow: 0 0 8px #00ed64;
    animation: pulse 2.5s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
  .next-card-header span {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #555;
  }
  .next-card-body {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .next-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    border: 1px solid #1a1a1a;
    border-radius: 5px;
    background: #111;
  }
  .next-item-icon {
    font-size: 18px;
    line-height: 1;
  }
  .next-item h4 {
    font-size: 12.5px;
    font-weight: 600;
    color: #ccc;
    letter-spacing: 0.01em;
  }
  .next-item p {
    font-size: 11.5px;
    color: #444;
    line-height: 1.6;
  }

  /* Footer */
  .footer-note {
    margin-top: 48px;
    padding-top: 24px;
    border-top: 1px solid #161616;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .footer-note span { font-size: 12px; color: #333; letter-spacing: 0.04em; }
  .version-tag {
    font-size: 11px;
    font-family: 'Source Code Pro', monospace;
    color: #00ed64;
    background: rgba(0,237,100,0.06);
    border: 1px solid rgba(0,237,100,0.15);
    padding: 4px 12px;
    border-radius: 3px;
  }
`;

function CodeBlock({ lang, raw, children }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(raw || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span className="code-lang">{lang}</span>
        <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={handleCopy}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <div className="code-content">
        <pre dangerouslySetInnerHTML={{ __html: children }} />
      </div>
    </div>
  );
}

// ── Raw strings for clipboard ──────────────────────────────────────────────
const rawJitpack = `<repositories>
  <repository>
    <id>jitpack.io</id>
    <url>https://jitpack.io</url>
  </repository>
</repositories>`;

const rawDep = `<dependency>
  <groupId>com.loghelp</groupId>
  <artifactId>loghelp-spring-boot-starter</artifactId>
  <version>1.0.0</version>
</dependency>`;

const rawProps = `loghelp.summarizer.url=https://loghelp.onrender.com/api/logs/ingest
loghelp.summarizer.api-key=YOUR_API_KEY`;

// ── Highlighted HTML ───────────────────────────────────────────────────────
const htmlJitpack = `<span class="xml-tag">&lt;repositories&gt;</span>
  <span class="xml-tag">&lt;repository&gt;</span>
    <span class="xml-tag">&lt;id&gt;</span><span class="xml-value">jitpack.io</span><span class="xml-tag">&lt;/id&gt;</span>
    <span class="xml-tag">&lt;url&gt;</span><span class="xml-value">https://jitpack.io</span><span class="xml-tag">&lt;/url&gt;</span>
  <span class="xml-tag">&lt;/repository&gt;</span>
<span class="xml-tag">&lt;/repositories&gt;</span>`;

const htmlDep = `<span class="xml-tag">&lt;dependency&gt;</span>
  <span class="xml-tag">&lt;groupId&gt;</span><span class="xml-value">com.loghelp</span><span class="xml-tag">&lt;/groupId&gt;</span>
  <span class="xml-tag">&lt;artifactId&gt;</span><span class="xml-value">loghelp-spring-boot-starter</span><span class="xml-tag">&lt;/artifactId&gt;</span>
  <span class="xml-tag">&lt;version&gt;</span><span class="xml-value">1.0.0</span><span class="xml-tag">&lt;/version&gt;</span>
<span class="xml-tag">&lt;/dependency&gt;</span>`;

const htmlProps = `<span class="prop-comment"># LogHelp configuration — add to application.properties</span>

<span class="prop-key">loghelp.summarizer.url</span>=<span class="prop-val">https://loghelp.onrender.com/api/logs/ingest</span>
<span class="prop-key">loghelp.summarizer.api-key</span>=<span class="prop-val">YOUR_API_KEY</span>`;

export default function GettingStartedPage() {
  return (
    <>
      <style>{styles}</style>
      <div className="gs-root">
        <div className="gs-container">

          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span>Docs</span>
            <span>›</span>
            <span>Getting Started</span>
            <span>›</span>
            <span className="active">Quick Start</span>
          </div>

          {/* Page header */}
          <div className="gs-header">
            <div className="gs-header-eyebrow">Quick Start</div>
            <h1>Up and running in minutes</h1>
            <p>
              LogHelp automatically captures, ships, and analyzes your Spring Boot application logs.
              Follow the three steps below — no code changes required beyond configuration.
            </p>
          </div>

          {/* Progress track */}
          <div className="progress-track">
            {[
              { n: "1", label: "Create a project" },
              { n: "2", label: "Install the SDK" },
              { n: "3", label: "Configure & deploy" },
            ].map((s, i) => (
              <div className="progress-step done" key={i}>
                <div className="ps-num">{s.n}</div>
                <span className="ps-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* ── STEP 1 ── */}
          <div className="step-card">
            <div className="step-header">
              <div className="step-number">1</div>
              <div className="step-meta">
                <div className="step-title">Create a Project</div>
                <div className="step-subtitle">Generates your unique API key</div>
              </div>
              <span className="step-badge">Dashboard</span>
            </div>
            <div className="step-body">
              <p className="step-desc">
                Each project gets its own API key used to authenticate log ingestion.
                Head to your dashboard, create a new project, and copy the key — you'll need it in Step 3.
              </p>
              <div className="action-card">
                <div className="action-card-text">
                  <h3>Create your first project</h3>
                  <p>Give it a name that matches your Spring Boot service. The key is generated instantly and shown once — save it somewhere safe.</p>
                </div>
                <button className="action-btn" onClick={() => window.location.href = '/dashboard'}>
                  Open Dashboard →
                </button>
              </div>
              <div className="apikey-row" style={{ marginTop: 16 }}>
                <span className="apikey-label">API Key</span>
                <span className="apikey-value">lh_••••••••••••••••••••••••••••••••</span>
                <span className="apikey-icon">🔑</span>
              </div>
            </div>
          </div>

          {/* ── STEP 2 ── */}
          <div className="step-card">
            <div className="step-header">
              <div className="step-number">2</div>
              <div className="step-meta">
                <div className="step-title">Install the SDK</div>
                <div className="step-subtitle">Add two entries to pom.xml</div>
              </div>
              <span className="step-badge">pom.xml</span>
            </div>
            <div className="step-body">
              <p className="step-desc">
                The SDK is hosted on JitPack. You need to register the JitPack repository first, then add the LogHelp dependency.
              </p>

              <div className="section-divider"><span>Repository</span></div>
              <CodeBlock lang="XML" raw={rawJitpack}>{htmlJitpack}</CodeBlock>

              <div className="section-divider"><span>Dependency</span></div>
              <CodeBlock lang="XML" raw={rawDep}>{htmlDep}</CodeBlock>

              <div className="info-box">
                <span className="info-icon">↗</span>
                <span className="info-text">
                  The starter is published on{" "}
                  <a href="https://jitpack.io/#com.loghelp/loghelp-spring-boot-starter" target="_blank" rel="noreferrer">
                    jitpack.io
                  </a>
                  . JitPack builds directly from the GitHub release — no separate registry account needed.
                </span>
              </div>
            </div>
          </div>

          {/* ── STEP 3 ── */}
          <div className="step-card">
            <div className="step-header">
              <div className="step-number">3</div>
              <div className="step-meta">
                <div className="step-title">Configure Your Application</div>
                <div className="step-subtitle">Set the endpoint and API key</div>
              </div>
              <span className="step-badge">application.properties</span>
            </div>
            <div className="step-body">
              <p className="step-desc">
                Add the two properties below to your <code style={{ fontFamily: 'monospace', color: '#00ed64', fontSize: '12px' }}>application.properties</code> (or <code style={{ fontFamily: 'monospace', color: '#00ed64', fontSize: '12px' }}>application.yml</code>).
                Replace <code style={{ fontFamily: 'monospace', color: '#00ed64', fontSize: '12px' }}>YOUR_API_KEY</code> with the key you copied in Step 1.
                That's it — no additional code required.
              </p>

              <CodeBlock lang="Properties" raw={rawProps}>{htmlProps}</CodeBlock>

              <div className="info-box">
                <span className="info-icon">⚡</span>
                <span className="info-text">
                  Once these properties are set and the app restarts, the SDK auto-configures a log appender.
                  All <code>ERROR</code> and <code>WARN</code> level logs are automatically forwarded to the ingest endpoint and surfaced in your dashboard.
                </span>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="next-card">
            <div className="next-card-header">
              <div className="next-card-header-dot" />
              <span>What happens after setup</span>
            </div>
            <div className="next-card-body">
              <div className="next-item">
                <div className="next-item-icon">📡</div>
                <h4>Logs are forwarded</h4>
                <p>The SDK intercepts your Spring Boot log pipeline and ships logs in real time to the ingest API.</p>
              </div>
              <div className="next-item">
                <div className="next-item-icon">🤖</div>
                <h4>Errors are analyzed</h4>
                <p>LogHelp AI processes each error, identifies root causes, and groups related exceptions automatically.</p>
              </div>
              <div className="next-item">
                <div className="next-item-icon">📊</div>
                <h4>View in Dashboard</h4>
                <p>Head to your project dashboard to see live logs, error trends, and AI-generated summaries.</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="footer-note">
            <span>LogHelp Spring Boot Starter · Apache 2.0</span>
            <span className="version-tag">v1.0.0</span>
          </div>

        </div>
      </div>
    </>
  );
}