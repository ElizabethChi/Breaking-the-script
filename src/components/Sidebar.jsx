import React, { useRef, useState } from 'react';
import { Bell, LayoutGrid, MessageCircle, Plus, Settings, SlidersHorizontal } from 'lucide-react';
import { BrandMark, HomeFilled } from './icons.jsx';
import { useDismiss } from '../hooks/useDismiss.js';

const ICON = { size: 24, strokeWidth: 1.9 };

function RailButton({ label, y, bottom, active, expanded, onClick, children, className = '' }) {
  const style = bottom != null ? { bottom } : { top: y - 22 };
  return (
    <button
      type="button"
      className={`rail-btn${active ? ' is-active' : ''} ${className}`}
      style={style}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      aria-haspopup={expanded != null ? 'true' : undefined}
      aria-expanded={expanded}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function Sidebar({
  view,
  onHome,
  onSaved,
  onCreate,
  filters,
  onFilters,
  savedCount,
  onClearSaved,
  onClearCache,
}) {
  const [panel, setPanel] = useState(null);
  const navRef = useRef(null);
  useDismiss(navRef, panel !== null, () => setPanel(null));

  const toggle = (name) => () => setPanel((p) => (p === name ? null : name));
  const close = () => setPanel(null);

  return (
    <nav className="sidebar" aria-label="Primary" ref={navRef}>
      <a
        className="rail-btn rail-btn--brand"
        style={{ top: 39 - 22 }}
        href="/"
        aria-label="Home"
        onClick={(e) => {
          e.preventDefault();
          close();
          onHome();
        }}
      >
        <BrandMark size={24} />
      </a>

      <RailButton
        label="Home"
        y={103}
        active={view === 'feed'}
        onClick={() => {
          close();
          onHome();
        }}
      >
        {view === 'feed' ? <HomeFilled size={24} /> : <HomeOutline />}
      </RailButton>

      <RailButton
        label="Saved pins"
        y={168}
        active={view === 'saved'}
        onClick={() => {
          close();
          onSaved();
        }}
      >
        <LayoutGrid {...ICON} fill={view === 'saved' ? 'currentColor' : 'none'} />
      </RailButton>

      <RailButton label="Create" y={233} expanded={panel === 'create'} active={panel === 'create'} onClick={toggle('create')}>
        <Plus {...ICON} strokeWidth={2.2} />
      </RailButton>

      <RailButton label="Notifications" y={298} expanded={panel === 'notifications'} onClick={toggle('notifications')}>
        <Bell {...ICON} />
      </RailButton>

      <RailButton label="Messages" y={363} expanded={panel === 'messages'} onClick={toggle('messages')}>
        <MessageCircle {...ICON} />
      </RailButton>

      <RailButton label="Feed options" y={428} expanded={panel === 'options'} onClick={toggle('options')}>
        <SlidersHorizontal {...ICON} />
      </RailButton>

      <RailButton label="Settings" bottom={19} expanded={panel === 'settings'} onClick={toggle('settings')} className="rail-btn--bottom">
        <Settings {...ICON} />
      </RailButton>

      {panel === 'create' && (
        <div className="rail-panel menu" style={{ top: 233 - 22 }} role="menu" aria-label="Create">
          <button
            type="button"
            role="menuitem"
            className="menu__item"
            onClick={() => {
              close();
              onCreate();
            }}
          >
            Create Pin
          </button>
        </div>
      )}

      {panel === 'notifications' && (
        <div className="rail-panel popover" style={{ top: 298 - 22 }} role="dialog" aria-label="Notifications">
          <h2>Updates</h2>
          <p>You’re all caught up. Activity on your saved pins will show up here.</p>
        </div>
      )}

      {panel === 'messages' && (
        <div className="rail-panel popover" style={{ top: 363 - 22 }} role="dialog" aria-label="Messages">
          <h2>Messages</h2>
          <p>No conversations yet. Messaging isn’t part of this demo.</p>
        </div>
      )}

      {panel === 'options' && (
        <div className="rail-panel popover" style={{ top: 428 - 22 }} role="dialog" aria-label="Feed options">
          <h2>Feed options</h2>
          <fieldset>
            <legend>Image type</legend>
            {[
              ['', 'Everything'],
              ['photograph', 'Photographs'],
              ['illustration', 'Illustrations'],
              ['digitized_artwork', 'Digitized artwork'],
            ].map(([value, label]) => (
              <label key={value || 'all'} className="radio">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === value}
                  onChange={() => onFilters({ ...filters, category: value })}
                />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Licenses</legend>
            {[
              ['commercial', 'Free for commercial use'],
              ['all-cc', 'All Creative Commons'],
            ].map(([value, label]) => (
              <label key={value} className="radio">
                <input
                  type="radio"
                  name="license"
                  checked={filters.licenseType === value}
                  onChange={() => onFilters({ ...filters, licenseType: value })}
                />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>
        </div>
      )}

      {panel === 'settings' && (
        <div className="rail-panel menu rail-panel--bottom" role="menu" aria-label="Settings">
          <button
            type="button"
            role="menuitem"
            className="menu__item"
            onClick={() => {
              close();
              onClearCache();
            }}
          >
            Clear cached results
          </button>
          <button
            type="button"
            role="menuitem"
            className="menu__item"
            disabled={!savedCount}
            onClick={() => {
              close();
              onClearSaved();
            }}
          >
            Clear saved pins{savedCount ? ` (${savedCount})` : ''}
          </button>
          <a
            role="menuitem"
            className="menu__item"
            href="https://openverse.org"
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            About Openverse
          </a>
        </div>
      )}
    </nav>
  );
}

function HomeOutline() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M3 10.6 12 3.5l9 7.1V20a1 1 0 0 1-1 1h-5.2v-6.2a.8.8 0 0 0-.8-.8H10a.8.8 0 0 0-.8.8V21H4a1 1 0 0 1-1-1Z" />
    </svg>
  );
}
