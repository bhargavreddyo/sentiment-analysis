import React, { useEffect, useState } from 'react';
import type { NavTab } from './Header';
import './LandingPage.css';

interface LandingPageProps {
  onNavigate: (tab: NavTab) => void;
}

const navigation: { label: string; tab: NavTab }[] = [
  { label: 'Overview', tab: 'dashboard' },
  { label: 'Analyzer', tab: 'analyzer' },
  { label: 'History', tab: 'history' },
];

const technologies = [
  { name: 'DistilBERT', mark: 'distilbert' },
  { name: 'PyTorch', mark: 'pytorch' },
  { name: 'FastAPI', mark: 'fastapi' },
  { name: 'Transformers', mark: 'transformers' },
];

const TechnologyMark: React.FC<{ kind: string }> = ({ kind }) => {
  if (kind === 'distilbert') {
    return (
      <svg viewBox="0 0 30 30" aria-hidden="true">
        <path d="M4 4h22v22H4z" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="18.8" cy="10.8" r="4.3" fill="#050505" />
        <circle cx="18.8" cy="10.8" r="2.6" fill="currentColor" />
      </svg>
    );
  }
  if (kind === 'pytorch') {
    return (
      <svg viewBox="0 0 26 30" aria-hidden="true">
        <path d="M13 3v15" fill="none" stroke="currentColor" strokeWidth="2.7" />
        <circle cx="13" cy="20" r="7" fill="none" stroke="currentColor" strokeWidth="2.7" />
        <circle cx="20.5" cy="5.5" r="2" fill="currentColor" />
      </svg>
    );
  }
  if (kind === 'fastapi') {
    return (
      <svg viewBox="0 0 28 28" aria-hidden="true">
        <circle cx="14" cy="14" r="11.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <path d="M7 17c3-7 11-7 14 0M9 12c2-4 8-4 10 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M3 19c4-7 8-10 12-10s7 3 10 10" fill="currentColor" />
      <path d="M5 22c5-3 13-3 18 0M8 25c4-2 8-2 12 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth / window.innerHeight > 1.1) setMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navigate = (tab: NavTab) => {
    setMenuOpen(false);
    onNavigate(tab);
  };

  return (
    <div className={`landing-stage${menuOpen ? ' is-open' : ''}`}>
      <div className="landing-plate" aria-hidden="true">
        <video className="plate-video" autoPlay muted loop playsInline preload="auto">
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_112712_da9d53df-6d27-4b12-bdf6-aa9dc2622bdf.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      <header className="landing-topbar">
        <nav className="landing-links" aria-label="Primary">
          {navigation.map((item) => (
            <button key={item.tab} onClick={() => navigate(item.tab)}>
              {item.label}
            </button>
          ))}
        </nav>

        <button className="landing-pill landing-nav-cta" onClick={() => navigate('analyzer')}>
          <span>Get Started</span>
        </button>

        <button
          id="landing-burger"
          className="landing-burger"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="landing-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i />
          <i />
        </button>
      </header>

      <nav
        className="landing-menu"
        id="landing-menu"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className="landing-menu-inner">
          <p className="menu-eyebrow">SentiLens</p>
          <ul className="menu-list">
            {navigation.map((item) => (
              <li key={item.tab}>
                <button onClick={() => navigate(item.tab)} tabIndex={menuOpen ? 0 : -1}>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="menu-foot">
            <button className="landing-pill" onClick={() => navigate('analyzer')} tabIndex={menuOpen ? 0 : -1}>
              <span>Get Started</span>
            </button>
            <button className="landing-ghost" onClick={() => navigate('dashboard')} tabIndex={menuOpen ? 0 : -1}>
              View Dashboard
            </button>
          </div>
        </div>
      </nav>

      <main className="landing-hero">
        <h1 className="landing-headline">
          <span>see the sentiment</span>
          <span>behind every word</span>
        </h1>
        <p className="landing-sub">
          <span>Analyse text, understand opinions</span>
          <span>and uncover insights with a distilBERT Model</span>
        </p>
        <div className="landing-actions">
          <button className="landing-pill landing-primary-cta" onClick={() => navigate('analyzer')}>
            <span>Get Started</span>
          </button>
          <button className="landing-ghost landing-desktop-ghost" onClick={() => navigate('dashboard')}>
            View Dashboard
          </button>
        </div>
      </main>

      <div className="landing-logos" aria-label="Powered by the SentiLens technology stack">
        {technologies.map((technology) => (
          <div className={`landing-tech ${technology.mark}`} key={technology.name}>
            <TechnologyMark kind={technology.mark} />
            <span>{technology.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};