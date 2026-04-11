import { Link, useLocation } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@500&display=swap');

  .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    height: 56px;
    padding: 0 32px;
    background: rgba(10,10,10,0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid #1a1a1a;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    gap: 40px;
  }

  /* Logo */
  .navbar-logo {
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 9px;
    flex-shrink: 0;
  }
  .navbar-logo-icon {
    width: 22px;
    height: 22px;
    background: #00ed64;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .navbar-logo-icon svg {
    width: 13px;
    height: 13px;
    fill: #0a0a0a;
  }
  .navbar-logo-text {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.01em;
  }
  .navbar-logo-text span {
    color: #00ed64;
  }

  /* Divider */
  .navbar-divider {
    width: 1px;
    height: 20px;
    background: #1e1e1e;
    flex-shrink: 0;
  }

  /* Nav links */
  .navbar-links {
    display: flex;
    align-items: center;
    gap: 2px;
    list-style: none;
    padding: 0;
    margin: 0;
    flex: 1;
  }
  .navbar-links a {
    text-decoration: none;
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 12px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    color: #555;
    letter-spacing: 0.01em;
    transition: color 0.15s, background 0.15s;
    position: relative;
  }
  .navbar-links a:hover {
    color: #ccc;
    background: #141414;
  }
  .navbar-links a.active {
    color: #fff;
    background: #141414;
  }
  .navbar-links a.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 12px;
    right: 12px;
    height: 2px;
    background: #00ed64;
    border-radius: 2px 2px 0 0;
  }

  /* Right side */
  .navbar-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .navbar-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 500;
    color: #3a3a3a;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 0 12px;
    height: 28px;
    border: 1px solid #1a1a1a;
    border-radius: 4px;
  }
  .navbar-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #00ed64;
    box-shadow: 0 0 6px #00ed64;
    animation: navPulse 2.5s ease-in-out infinite;
  }
  @keyframes navPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .navbar-version {
    font-family: 'Source Code Pro', monospace;
    font-size: 10px;
    color: #00ed64;
    background: rgba(0, 237, 100, 0.06);
    border: 1px solid rgba(0, 237, 100, 0.15);
    padding: 4px 10px;
    border-radius: 3px;
    letter-spacing: 0.05em;
  }

  /* Get Started button */
  .navbar-cta {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #00ed64;
    color: #0a0a0a;
    border: none;
    border-radius: 4px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    padding: 7px 16px;
    cursor: pointer;
    text-decoration: none;
    transition: opacity 0.15s, transform 0.15s;
    white-space: nowrap;
  }
  .navbar-cta:hover {
    opacity: 0.85;
    transform: translateY(-1px);
  }
`;

const NAV_ITEMS = [
  { to: '/',          label: 'Home'         },
  { to: '/dashboard', label: 'Dashboard'    },
  { to: '/sdk',       label: 'SDK Docs'     },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="5" height="5" rx="1"/>
              <rect x="8" y="1" width="5" height="5" rx="1"/>
              <rect x="1" y="8" width="5" height="5" rx="1"/>
              <rect x="8" y="8" width="5" height="5" rx="1"/>
            </svg>
          </div>
          <span className="navbar-logo-text">Log<span>Help</span></span>
        </Link>

        <div className="navbar-divider" />

        {/* Links */}
        <ul className="navbar-links">
          {NAV_ITEMS.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={location.pathname === to ? 'active' : ''}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right */}
        <div className="navbar-right">
          <div className="navbar-status">
            <div className="navbar-status-dot" />
            All systems operational
          </div>
          <span className="navbar-version">v1.0.0</span>
          <Link to="/login" className="navbar-cta">
            Get Started →
          </Link>
        </div>

      </nav>
    </>
  );
}