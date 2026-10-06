import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Palette,
  Type,
  Square,
  Table,
  Layers,
  Bell,
  LogIn,
  RotateCcw,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
  Info,
  MessageSquare,
  Check,
  Share2,
  Copy,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import './App.css';

// ---------------------------------------------------------
// Theme Presets Specification
// ---------------------------------------------------------
const THEME_PRESETS = {
  blue: {
    id: 'blue',
    name: 'Corporate Blue',
    brandPrimary: '#4F6BFF',
    brandSecondary: '#25C6E8',
    brandHighlight: '#6B7FF2',
    shades: [
      '#EEF2FF',
      '#E0E7FF',
      '#C7D2FE',
      '#A5B4FC',
      '#818CF8',
      '#6366F1',
      '#4F6BFF',
      '#4338CA',
      '#3730A3',
    ],
  },
  green: {
    id: 'green',
    name: 'Corporate Green',
    brandPrimary: '#10B981',
    brandSecondary: '#F59E0B',
    brandHighlight: '#2EE59D',
    shades: [
      '#ECFDF5',
      '#D1FAE5',
      '#A7F3D0',
      '#6EE7B7',
      '#34D399',
      '#10B981',
      '#059669',
      '#047857',
      '#064E3B',
    ],
  },
};

// Utility to convert hex to RGBA
function hexToRgba(hex, alpha = 1) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function App() {
  // Theme Presets (Blue vs Green)
  const [activePreset, setActivePreset] = useState('blue');

  // Theme & Color State
  const [themeMode, setThemeMode] = useState('light');
  const [brandPrimary, setBrandPrimary] = useState(THEME_PRESETS.blue.brandPrimary);
  const [brandSecondary, setBrandSecondary] = useState(THEME_PRESETS.blue.brandSecondary);
  const [brandHighlight, setBrandHighlight] = useState(THEME_PRESETS.blue.brandHighlight);
  const [currentShades, setCurrentShades] = useState(THEME_PRESETS.blue.shades);

  // Active Navigation & Subtabs
  const [activeNav, setActiveNav] = useState('Colour Settings');
  const [activeColorTab, setActiveColorTab] = useState('Brand');

  // Header & Canvas Controls
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedTokens, setCopiedTokens] = useState(false);

  // Selection States Component State
  const [selectionTab, setSelectionTab] = useState('Overview');
  const [selectedItems, setSelectedItems] = useState([0, 4]); // indices 0 and 4 are selected as in reference image

  // Inputs & Selection Controls State
  const [outlinedInputVal, setOutlinedInputVal] = useState('');
  const [focusedInputVal, setFocusedInputVal] = useState('Active value');
  const [checkboxState, setCheckboxState] = useState(true);
  const [radioState, setRadioState] = useState(true);
  const [switchState, setSwitchState] = useState(true);

  // Revenue Goal Progress State
  const [progressVal, setProgressVal] = useState(74);

  // Apply Presets
  const applyPreset = (presetKey) => {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return;
    setActivePreset(presetKey);
    setBrandPrimary(preset.brandPrimary);
    setBrandSecondary(preset.brandSecondary);
    setBrandHighlight(preset.brandHighlight);
    setCurrentShades(preset.shades);
  };

  // Synchronize CSS custom properties whenever theme or colors change
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);
    root.style.setProperty('--brand-primary', brandPrimary);
    root.style.setProperty('--brand-secondary', brandSecondary);
    root.style.setProperty('--brand-highlight', brandHighlight);

    // Dynamic contrast & tinted tokens
    root.style.setProperty('--brand-primary-subtle', hexToRgba(brandPrimary, 0.08));
    root.style.setProperty('--brand-primary-subtle-hover', hexToRgba(brandPrimary, 0.14));
    root.style.setProperty('--brand-primary-border', hexToRgba(brandPrimary, 0.28));
    root.style.setProperty('--brand-secondary-subtle', hexToRgba(brandSecondary, 0.12));
    root.style.setProperty('--brand-highlight-subtle', hexToRgba(brandHighlight, 0.12));
    root.style.setProperty('--focus-ring', `0 0 0 3px ${hexToRgba(brandPrimary, 0.2)}`);
  }, [themeMode, brandPrimary, brandSecondary, brandHighlight]);

  // Reset to Active Preset Defaults
  const handleReset = () => {
    const preset = THEME_PRESETS[activePreset];
    setBrandPrimary(preset.brandPrimary);
    setBrandSecondary(preset.brandSecondary);
    setBrandHighlight(preset.brandHighlight);
    setCurrentShades(preset.shades);
    setZoomLevel(100);
    setSelectedItems([0, 4]);
    setCheckboxState(true);
    setRadioState(true);
    setSwitchState(true);
    setProgressVal(74);
  };

  // Toggle Row Selection
  const toggleRowSelection = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((i) => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  // Copy CSS Tokens to Clipboard
  const handleCopyTokens = () => {
    const tokens = `/* ${THEME_PRESETS[activePreset].name} Tokens */
:root {
  --brand-primary: ${brandPrimary};
  --brand-secondary: ${brandSecondary};
  --brand-highlight: ${brandHighlight};
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #0284C7;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-card: 12px;
  --font-sans: 'Inter', sans-serif;
}`;
    navigator.clipboard.writeText(tokens);
    setCopiedTokens(true);
    setTimeout(() => setCopiedTokens(false), 2000);
  };

  const navItems = [
    { id: 'Theme Settings', label: 'Theme Settings', icon: Sliders },
    { id: 'Colour Settings', label: 'Colour Settings', icon: Palette, active: true },
    { id: 'Typography', label: 'Typography', icon: Type },
    { id: 'Cards', label: 'Cards', icon: Square },
    { id: 'Tables', label: 'Tables', icon: Table },
    { id: 'Surface & Shape', label: 'Surface & Shape', icon: Layers },
    { id: 'Notifications', label: 'Notifications', icon: Bell },
    { id: 'Login Screen', label: 'Login Screen', icon: LogIn },
  ];

  const selectionRows = [
    'Selected item',
    'Unselected item',
    'Unselected item',
    'Unselected item',
    'Selected item',
    'Unselected item',
  ];

  return (
    <div className="app-container">
      {/* ====================================================================
          SIDEBAR NAVIGATION
          ==================================================================== */}
      <aside className="sidebar" aria-label="Design System Navigation">
        {/* Sidebar Header with Theme Indicator */}
        <div className="sidebar-header">
          <div
            className="brand-badge-group"
            onClick={() => applyPreset(activePreset === 'blue' ? 'green' : 'blue')}
            title="Click to toggle between Blue and Green themes"
          >
            <div className="brand-logo-icon" aria-hidden="true">
              <span className="brand-dot primary" />
              <span className="brand-dot secondary" />
            </div>
            <span className="brand-title">{THEME_PRESETS[activePreset].name}</span>
          </div>

          <div className="sidebar-header-actions">
            <button
              className="icon-btn"
              onClick={handleReset}
              title="Reset current theme to defaults"
              aria-label="Reset defaults"
            >
              <RotateCcw size={16} />
            </button>
            <button
              className="icon-btn"
              onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
              title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
              aria-label="Toggle dark/light mode"
            >
              {themeMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="sidebar-content">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <React.Fragment key={item.id}>
                <div
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveNav(item.id)}
                  role="button"
                  tabIndex={0}
                  aria-selected={isActive}
                >
                  <div className="nav-item-left">
                    <span className="nav-icon">
                      <Icon size={18} />
                    </span>
                    <span className="nav-label">{item.label}</span>
                  </div>

                  <div className="nav-item-actions">
                    <MessageSquare size={14} className="sub-icon" title="View comments" />
                    <Info size={14} className="sub-icon" title="Component documentation" />
                  </div>
                </div>

                {/* Subpanel for Colour Settings */}
                {isActive && item.id === 'Colour Settings' && (
                  <div className="sidebar-expanded-section">
                    {/* Theme Preset Selector */}
                    <div className="theme-preset-section">
                      <div className="theme-preset-title">
                        <span>Theme Presets</span>
                        <Sparkles size={13} style={{ color: 'var(--brand-primary)' }} />
                      </div>

                      <div className="theme-preset-cards">
                        {/* Blue Preset Card */}
                        <div
                          className={`theme-preset-card ${activePreset === 'blue' ? 'active' : ''}`}
                          onClick={() => applyPreset('blue')}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="theme-preset-card-header">
                            <span className="theme-preset-name">Blue Theme</span>
                            {activePreset === 'blue' && <Check size={12} color="var(--brand-primary)" />}
                          </div>
                          <div className="theme-preset-swatches">
                            <span className="preset-mini-swatch" style={{ backgroundColor: '#4F6BFF' }} />
                            <span className="preset-mini-swatch" style={{ backgroundColor: '#25C6E8' }} />
                            <span className="preset-mini-swatch" style={{ backgroundColor: '#6B7FF2' }} />
                          </div>
                        </div>

                        {/* Green Preset Card */}
                        <div
                          className={`theme-preset-card ${activePreset === 'green' ? 'active' : ''}`}
                          onClick={() => applyPreset('green')}
                          role="button"
                          tabIndex={0}
                        >
                          <div className="theme-preset-card-header">
                            <span className="theme-preset-name">Green Theme</span>
                            {activePreset === 'green' && <Check size={12} color="var(--brand-primary)" />}
                          </div>
                          <div className="theme-preset-swatches">
                            <span className="preset-mini-swatch" style={{ backgroundColor: '#10B981' }} />
                            <span className="preset-mini-swatch" style={{ backgroundColor: '#F59E0B' }} />
                            <span className="preset-mini-swatch" style={{ backgroundColor: '#2EE59D' }} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Segmented Subtabs: [Brand] [Text] [Status] */}
                    <div className="segmented-control" role="tablist">
                      {['Brand', 'Text', 'Status'].map((subtab) => (
                        <button
                          key={subtab}
                          role="tab"
                          aria-selected={activeColorTab === subtab}
                          className={`segmented-tab ${activeColorTab === subtab ? 'active' : ''}`}
                          onClick={() => setActiveColorTab(subtab)}
                        >
                          {subtab}
                        </button>
                      ))}
                    </div>

                    {/* BRAND COLOR */}
                    <div className="color-field-group">
                      <div className="color-field-label">
                        <span>Brand Color</span>
                        <Info size={12} className="help-icon" title="Primary UI brand color token" />
                      </div>

                      <div
                        className="color-picker-pill"
                        style={{ backgroundColor: brandPrimary }}
                        title="Click to customize brand color"
                      >
                        <span>{brandPrimary.toUpperCase()} · tap to change</span>
                        <input
                          type="color"
                          className="color-picker-hidden-input"
                          value={brandPrimary}
                          onChange={(e) => setBrandPrimary(e.target.value)}
                          aria-label="Primary brand color picker"
                        />
                      </div>

                      {/* Monochromatic Shade Ramp */}
                      <div className="shade-ramp" title="Click swatch to pick shade">
                        {currentShades.map((shade, idx) => (
                          <div
                            key={idx}
                            className="shade-swatch"
                            style={{ backgroundColor: shade }}
                            onClick={() => setBrandPrimary(shade)}
                            title={`Set primary to ${shade}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* SECONDARY / ACCENT */}
                    <div className="color-field-group">
                      <div className="color-field-label">
                        <span>Secondary / Accent</span>
                        <Info size={12} className="help-icon" title="Secondary accent token" />
                      </div>

                      <div
                        className="color-picker-pill"
                        style={{ backgroundColor: brandSecondary }}
                        title="Click to customize secondary accent color"
                      >
                        <span>{brandSecondary.toUpperCase()}</span>
                        <input
                          type="color"
                          className="color-picker-hidden-input"
                          value={brandSecondary}
                          onChange={(e) => setBrandSecondary(e.target.value)}
                          aria-label="Secondary accent color picker"
                        />
                      </div>
                    </div>

                    {/* HIGHLIGHT COLOUR */}
                    <div className="color-field-group">
                      <div className="color-field-label">
                        <span>Highlight Colour</span>
                        <Info size={12} className="help-icon" title="Highlight accent token" />
                      </div>

                      <div
                        className="color-picker-pill"
                        style={{ backgroundColor: brandHighlight }}
                        title="Click to customize highlight color"
                      >
                        <span>{brandHighlight.toUpperCase()}</span>
                        <input
                          type="color"
                          className="color-picker-hidden-input"
                          value={brandHighlight}
                          onChange={(e) => setBrandHighlight(e.target.value)}
                          aria-label="Highlight color picker"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </aside>

      {/* ====================================================================
          MAIN WORKSPACE & PREVIEW AREA
          ==================================================================== */}
      <main className="main-workspace">
        {/* Top Header with Theme Switcher */}
        <header className="top-header">
          <div className="header-left">
            <div className="preview-tag">
              <Monitor size={18} className="device-icon" />
              <span>Previewing Components</span>
            </div>

            {/* Quick 2-Theme Switcher in Top Header */}
            <div className="header-theme-switcher" role="group" aria-label="Theme Version Switcher">
              <button
                className={`theme-toggle-btn ${activePreset === 'blue' ? 'active' : ''}`}
                onClick={() => applyPreset('blue')}
              >
                <span className="theme-dot-indicator blue" />
                <span>Blue Theme</span>
              </button>
              <button
                className={`theme-toggle-btn ${activePreset === 'green' ? 'active' : ''}`}
                onClick={() => applyPreset('green')}
              >
                <span className="theme-dot-indicator green" />
                <span>Green Theme</span>
              </button>
            </div>
          </div>

          <div className="header-right">
            {/* Zoom / View Selector */}
            <div style={{ position: 'relative' }}>
              <button
                className="zoom-dropdown-trigger"
                onClick={() => setShowZoomMenu(!showZoomMenu)}
                aria-expanded={showZoomMenu}
                aria-label="Select canvas zoom level"
              >
                <span>Fit ({zoomLevel}%)</span>
                <ChevronDown size={14} />
              </button>

              {showZoomMenu && (
                <div
                  className="modal-card"
                  style={{
                    position: 'absolute',
                    top: '38px',
                    right: 0,
                    width: '160px',
                    padding: '6px',
                    zIndex: 30,
                  }}
                >
                  {[75, 85, 100, 125].map((lvl) => (
                    <button
                      key={lvl}
                      className={`nav-item ${zoomLevel === lvl ? 'active' : ''}`}
                      style={{ height: '32px', fontSize: '13px' }}
                      onClick={() => {
                        setZoomLevel(lvl);
                        setShowZoomMenu(false);
                      }}
                    >
                      {lvl}% {lvl === 100 ? '(Default)' : ''}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="btn btn-outlined"
              style={{ height: '32px', padding: '0 12px', fontSize: '12px' }}
              onClick={() => setShowExportModal(true)}
            >
              <Share2 size={13} />
              <span>Export Tokens</span>
            </button>
          </div>
        </header>

        {/* Scaled Canvas Wrapper */}
        <div
          className="canvas-wrapper"
          style={{
            transform: zoomLevel !== 100 ? `scale(${zoomLevel / 100})` : 'none',
          }}
        >
          {/* Page Title & Context Header */}
          <div className="page-title-row">
            <h1 className="page-title">
              <span>Component Library</span>
              <Info size={18} className="info-icon" title="Design System Component Showcase" />
            </h1>
            <span className="badge-counter">
              Active: {THEME_PRESETS[activePreset].name}
            </span>
          </div>

          {/* Cards Grid */}
          <div className="cards-grid">
            {/* ROW 1: Typography Scale (Left) + Selection States (Right) */}
            <div className="grid-row-split">
              {/* CARD 1: Typography Scale */}
              <section className="ds-card" aria-labelledby="typography-heading">
                <h2 id="typography-heading" className="ds-card-title">
                  Typography Scale
                </h2>
                <div className="typography-table">
                  <div className="type-row">
                    <span className="type-sample sample-h1">Dashboard Overview</span>
                    <span className="type-meta">H1 · 28</span>
                  </div>

                  <div className="type-row">
                    <span className="type-sample sample-h2">Revenue Report</span>
                    <span className="type-meta">H2 · 25</span>
                  </div>

                  <div className="type-row">
                    <span className="type-sample sample-h3">Performance Overview</span>
                    <span className="type-meta">H3 · 22</span>
                  </div>

                  <div className="type-row">
                    <span className="type-sample sample-h4">Active Users</span>
                    <span className="type-meta">H4 · 20</span>
                  </div>

                  <div className="type-row">
                    <span className="type-sample sample-h5">Last updated 2m ago</span>
                    <span className="type-meta">H5 · 17</span>
                  </div>

                  <div className="type-row">
                    <span className="type-sample sample-h6">Status · Live</span>
                    <span className="type-meta">H6 · 14</span>
                  </div>

                  <div className="type-row">
                    <span className="type-sample sample-body">
                      Body text — the quick brown fox jumps over the lazy dog
                    </span>
                    <span className="type-meta">Body · 15</span>
                  </div>

                  <div className="type-row">
                    <span className="type-sample sample-caption">
                      Caption & helper text style
                    </span>
                    <span className="type-meta">Caption · 12</span>
                  </div>
                </div>
              </section>

              {/* CARD 2: Selection States */}
              <section className="ds-card" aria-labelledby="selection-heading">
                <h2 id="selection-heading" className="ds-card-title">
                  Selection States
                </h2>

                {/* Subtabs: Overview | Activity | Settings */}
                <div className="selection-tabs" role="tablist">
                  {['Overview', 'Activity', 'Settings'].map((tab) => (
                    <button
                      key={tab}
                      role="tab"
                      aria-selected={selectionTab === tab}
                      className={`selection-tab-btn ${selectionTab === tab ? 'active' : ''}`}
                      onClick={() => setSelectionTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Selectable Rows List */}
                <div className="selection-list" role="listbox" aria-multiselectable="true">
                  {selectionRows.map((label, idx) => {
                    const isSelected = selectedItems.includes(idx);
                    return (
                      <div
                        key={idx}
                        className={`selection-item-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleRowSelection(idx)}
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            toggleRowSelection(idx);
                          }
                        }}
                      >
                        <div className="selection-item-left">
                          <div className="custom-radio">
                            <span className="custom-radio-inner" />
                          </div>
                          <span className="selection-item-text">
                            {isSelected ? 'Selected item' : 'Unselected item'}
                          </span>
                        </div>

                        {isSelected && <span className="active-pill-tag">Active</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Selection Footer Badge */}
                <div className="selection-footer-badge">
                  <span>{selectedItems.length} selected items</span>
                </div>
              </section>
            </div>

            {/* ROW 2: Inputs & Selection */}
            <div className="grid-row-full">
              <section className="ds-card" aria-labelledby="inputs-heading">
                <h2 id="inputs-heading" className="ds-card-title">
                  Inputs & Selection
                </h2>

                <div className="inputs-controls-container">
                  {/* Two Text Inputs Row */}
                  <div className="inputs-row">
                    {/* Outlined Input */}
                    <div className="floating-input-wrapper">
                      <input
                        id="outlined-demo-input"
                        type="text"
                        className="floating-input"
                        placeholder="Placeholder..."
                        value={outlinedInputVal}
                        onChange={(e) => setOutlinedInputVal(e.target.value)}
                      />
                      <label htmlFor="outlined-demo-input" className="floating-label">
                        Outlined
                      </label>
                    </div>

                    {/* Focused Input */}
                    <div className="floating-input-wrapper">
                      <input
                        id="focused-demo-input"
                        type="text"
                        className="floating-input is-focused-demo"
                        value={focusedInputVal}
                        onChange={(e) => setFocusedInputVal(e.target.value)}
                      />
                      <label htmlFor="focused-demo-input" className="floating-label">
                        Focused
                      </label>
                    </div>
                  </div>

                  {/* Selection Controls Row: Checkbox, Radio, Switch */}
                  <div className="controls-row">
                    {/* Checkbox */}
                    <label className="ds-checkbox-label">
                      <div
                        className={`ds-checkbox-box ${checkboxState ? 'checked' : ''}`}
                        onClick={() => setCheckboxState(!checkboxState)}
                      >
                        {checkboxState && <Check size={13} strokeWidth={3} />}
                      </div>
                      <span onClick={() => setCheckboxState(!checkboxState)}>Checkbox</span>
                    </label>

                    {/* Radio */}
                    <label className="ds-radio-label" onClick={() => setRadioState(!radioState)}>
                      <div className={`ds-radio-circle ${radioState ? 'checked' : ''}`}>
                        {radioState && <span className="ds-radio-dot" />}
                      </div>
                      <span>Radio</span>
                    </label>

                    {/* Switch */}
                    <label className="ds-switch-label" onClick={() => setSwitchState(!switchState)}>
                      <div className={`ds-switch-track ${switchState ? 'checked' : ''}`}>
                        <div className="ds-switch-thumb" />
                      </div>
                      <span>Switch</span>
                    </label>
                  </div>
                </div>
              </section>
            </div>

            {/* ROW 3: Buttons (Left) + Chips, Alerts & Progress (Right) */}
            <div className="grid-row-split-50">
              {/* CARD 4: Buttons */}
              <section className="ds-card" aria-labelledby="buttons-heading">
                <h2 id="buttons-heading" className="ds-card-title">
                  Buttons
                </h2>

                <div className="buttons-row">
                  <button className="btn btn-contained">CONTAINED</button>
                  <button className="btn btn-outlined">OUTLINED</button>
                  <button className="btn btn-text">TEXT</button>
                  <button className="btn btn-tonal">TONAL</button>
                  <button className="btn btn-rounded">ROUNDED</button>
                  <button className="btn btn-error">ERROR</button>
                </div>
              </section>

              {/* CARD 5: Chips, Alerts & Progress */}
              <section className="ds-card" aria-labelledby="chips-progress-heading">
                <h2 id="chips-progress-heading" className="ds-card-title">
                  Chips, Alerts & Progress
                </h2>

                <div className="chips-progress-container">
                  {/* Semantic Chips Row */}
                  <div className="chips-row">
                    <span className="ds-chip primary">
                      <span className="chip-dot" />
                      Primary
                    </span>
                    <span className="ds-chip success">
                      <span className="chip-dot" />
                      Success
                    </span>
                    <span className="ds-chip warning">
                      <span className="chip-dot" />
                      Warning
                    </span>
                    <span className="ds-chip info">
                      <span className="chip-dot" />
                      Info
                    </span>
                    <span className="ds-chip error">
                      <span className="chip-dot" />
                      Error
                    </span>
                  </div>

                  {/* Revenue Goal Progress */}
                  <div className="progress-section">
                    <div className="progress-header">
                      <span className="progress-label">Revenue goal</span>
                      <span className="progress-percentage">{progressVal}%</span>
                    </div>

                    <div
                      className="progress-track"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        const newPct = Math.round((clickX / rect.width) * 100);
                        setProgressVal(Math.max(0, Math.min(100, newPct)));
                      }}
                      title="Click along track to interactively adjust progress"
                    >
                      <div
                        className="progress-fill"
                        style={{ width: `${progressVal}%` }}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Export Tokens Modal */}
      {showExportModal && (
        <div className="modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Design Tokens ({THEME_PRESETS[activePreset].name})</h3>
              <button
                className="icon-btn"
                onClick={() => setShowExportModal(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Export production-ready CSS variables configured in this theme studio session.
            </p>

            <pre className="code-snippet">
{`/* ${THEME_PRESETS[activePreset].name} Tokens */
:root {
  --brand-primary: ${brandPrimary};
  --brand-secondary: ${brandSecondary};
  --brand-highlight: ${brandHighlight};
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #0284C7;
  --radius-card: 12px;
  --font-sans: 'Inter', sans-serif;
}`}
            </pre>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                className="btn btn-outlined"
                onClick={() => setShowExportModal(false)}
              >
                Close
              </button>
              <button
                className="btn btn-contained"
                onClick={handleCopyTokens}
              >
                {copiedTokens ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedTokens ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
