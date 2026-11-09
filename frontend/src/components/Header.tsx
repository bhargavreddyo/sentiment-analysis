import React from 'react';
import { HealthResponse } from '../types';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export type NavTab = 'dashboard' | 'analyzer' | 'history';

interface HeaderProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onBackToLanding: () => void;
  health: HealthResponse | null;
  healthLoading: boolean;
  onRefreshHealth: () => void;
}

const navItems: { id: NavTab; label: string }[] = [
  { id: 'dashboard', label: 'Overview' },
  { id: 'analyzer', label: 'Analyzer' },
  { id: 'history', label: 'History' },
];

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onBackToLanding,
  health,
  healthLoading,
  onRefreshHealth,
}) => {
  const isHealthy = health?.status === 'healthy' && health?.model_loaded;

  return (
    <header className="workspace-header">
      <div className="workspace-header-inner">
        <button
          onClick={onBackToLanding}
          className="workspace-back"
          aria-label="Back to landing page"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span>Back to landing</span>
        </button>

        <nav className="workspace-nav" aria-label="Primary">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={isActive ? 'is-active' : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="workspace-header-actions">
          <button
            className="workspace-status"
            onClick={onRefreshHealth}
            disabled={healthLoading}
            title={isHealthy ? `DistilBERT inference model live (${health?.device || 'cpu'})` : 'Model service offline'}
            aria-label={`Model service ${isHealthy ? 'ready' : 'offline'}; refresh status`}
          >
            <span className={`workspace-status-dot${isHealthy ? ' is-ready' : ''}`} />
            <span className="workspace-status-label">{isHealthy ? 'Model ready' : 'Service offline'}</span>
            <RefreshCw size={13} className={healthLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    </header>
  );
};
