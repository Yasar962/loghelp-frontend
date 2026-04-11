import React from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    height: 100vh;
    display: flex;
    background: #0a0a0a;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow: hidden;
    position: relative;
  }

  /* ── Animated grid background ── */
  .login-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,237,100,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,237,100,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    animation: gridDrift 20s linear infinite;
  }
  @keyframes gridDrift {
    from { background-position: 0 0; }
    to   { background-position: 48px 48px; }
  }

  /* ── Radial glow ── */
  .login-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,237,100,0.06) 0%, transparent 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    animation: glowPulse 4s ease-in-out infinite;
  }
  @keyframes glowPulse {
    0%,100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    50%      { opacity: 0.6; transform: translate(-50%, -50%) scale(1.08); }
  }

  /* ── Left panel ── */
  .login-left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px 80px;
    position: relative;
    z-index: 1;
  }
  .login-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 64px;
    animation: loginFadeUp 0.5s ease both;
  }
  .login-brand-box {
    width: 28px; height: 28px;
    background: #00ed64;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .login-brand-box svg { width: 14px; height: 14px; fill: #0a0a0a; }
  .login-brand-name {
    font-size: 17px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
  }
  .login-brand-name em { color: #00ed64; font-style: normal; }

  .login-headline {
    font-size: 48px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.04em;
    line-height: 1.1;
    margin-bottom: 20px;
    animation: loginFadeUp 0.5s 0.1s ease both;
    opacity: 0;
  }
  .login-headline-accent { color: #00ed64; }
  .login-subline {
    font-size: 15px;
    color: #333;
    line-height: 1.7;
    max-width: 400px;
    animation: loginFadeUp 0.5s 0.2s ease both;
    opacity: 0;
  }

  /* ── Feature pills ── */
  .login-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 40px;
    animation: loginFadeUp 0.5s 0.3s ease both;
    opacity: 0;
  }
  .login-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border: 1px solid #1a1a1a;
    border-radius: 100px;
    font-size: 11px;
    color: #444;
    letter-spacing: 0.04em;
    background: rgba(255,255,255,0.02);
  }
  .login-pill-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #00ed64;
    flex-shrink: 0;
  }

  /* ── Divider ── */
  .login-divider {
    width: 1px;
    background: linear-gradient(to bottom, transparent, #1e1e1e 20%, #1e1e1e 80%, transparent);
    flex-shrink: 0;
    position: relative;
    z-index: 1;
  }

  /* ── Right panel ── */
  .login-right {
    width: 480px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px 56px;
    position: relative;
    z-index: 1;
  }
  .login-card {
    animation: loginFadeUp 0.5s 0.15s ease both;
    opacity: 0;
  }
  .login-card-eyebrow {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #00ed64;
    margin-bottom: 10px;
  }
  .login-card-title {
    font-size: 26px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
  }
  .login-card-sub {
    font-size: 13px;
    color: #333;
    line-height: 1.6;
    margin-bottom: 40px;
  }

  /* ── Google button ── */
  .login-google-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 14px 20px;
    background: #0d0d0d;
    border: 1px solid #222;
    border-radius: 6px;
    color: #ccc;
    font-size: 14px;
    font-weight: 600;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.01em;
    position: relative;
    overflow: hidden;
  }
  .login-google-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,237,100,0.04), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .login-google-btn:hover {
    border-color: rgba(0,237,100,0.25);
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }
  .login-google-btn:hover::before { opacity: 1; }
  .login-google-btn:active { transform: translateY(0); }

  .login-google-icon {
    width: 18px; height: 18px;
    flex-shrink: 0;
  }

  /* ── Separator ── */
  .login-sep {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0;
  }
  .login-sep-line { flex: 1; height: 1px; background: #161616; }
  .login-sep-text { font-size: 11px; color: #2a2a2a; letter-spacing: 0.06em; }

  /* ── Legal ── */
  .login-legal {
    font-size: 11px;
    color: #222;
    line-height: 1.6;
    text-align: center;
  }

  /* ── Footer ── */
  .login-footer {
    position: absolute;
    bottom: 28px;
    left: 0; right: 0;
    display: flex;
    justify-content: center;
    gap: 24px;
    z-index: 1;
  }
  .login-footer-item {
    font-size: 11px;
    color: #1e1e1e;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Source Code Pro', monospace;
  }
  .login-footer-dot {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #00ed64;
    box-shadow: 0 0 4px #00ed64;
    animation: footerPulse 2s infinite;
  }
  @keyframes footerPulse { 0%,100%{opacity:1} 50%{opacity:0.2} }

  @keyframes loginFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .login-left    { display: none; }
    .login-divider { display: none; }
    .login-right   { width: 100%; padding: 40px 28px; }
  }
`;

const GoogleIcon = () => (
  <svg className="login-google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Login = () => {
  const handleLogin = () => {
    const clientId = "626987750607-3g7csqnf0d8j1ers56tvcolti7fns1aa.apps.googleusercontent.com";
    const redirectUri = "https://loghelp.onrender.com/oauth/google/callback";
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid email profile&access_type=offline`;
    window.location.href = url;
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="login-root">
        <div className="login-grid" />
        <div className="login-glow" />

        {/* Left panel */}
        <div className="login-left">
          <div className="login-brand">
            <div className="login-brand-box">
              <svg viewBox="0 0 12 12">
                <rect x="0.5" y="0.5" width="4" height="4" rx="0.8"/>
                <rect x="7.5" y="0.5" width="4" height="4" rx="0.8"/>
                <rect x="0.5" y="7.5" width="4" height="4" rx="0.8"/>
                <rect x="7.5" y="7.5" width="4" height="4" rx="0.8"/>
              </svg>
            </div>
            <span className="login-brand-name">Log<em>Help</em></span>
          </div>

          <h1 className="login-headline">
            Catch errors<br />
            <span className="login-headline-accent">before users do.</span>
          </h1>
          <p className="login-subline">
            AI-powered log monitoring for Spring Boot. Ingest logs, analyze errors,
            and get actionable fixes — all in one dashboard.
          </p>

          <div className="login-pills">
            {[
              "AI Error Analysis",
              "Real-time Ingestion",
              "Zero Config",
              "Health Reports",
              "API Metrics",
            ].map(f => (
              <div className="login-pill" key={f}>
                <span className="login-pill-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="login-divider" />

        {/* Right panel */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-card-eyebrow">Welcome back</div>
            <div className="login-card-title">Sign in to LogHelp</div>
            <div className="login-card-sub">
              Use your Google account to access your projects and dashboards.
            </div>

            <button className="login-google-btn" onClick={handleLogin}>
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="login-sep">
              <div className="login-sep-line" />
              <span className="login-sep-text">SECURE · ENCRYPTED</span>
              <div className="login-sep-line" />
            </div>

            <div className="login-legal">
              By signing in, you agree to LogHelp's Terms of Service
              and Privacy Policy. Your data is never sold or shared.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          {["All systems operational", "v1.0.0", "Spring Boot SDK"].map((item, i) => (
            <div className="login-footer-item" key={i}>
              {i === 0 && <span className="login-footer-dot" />}
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Login;