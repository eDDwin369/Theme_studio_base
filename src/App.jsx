import React, { useState, useEffect, useRef } from 'react';
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

// Gradient directions for Card Background
const GRADIENT_DIRECTIONS = [
  { label: '→', value: 'to right', title: 'To Right' },
  { label: '←', value: 'to left', title: 'To Left' },
  { label: '↓', value: 'to bottom', title: 'To Bottom' },
  { label: '↑', value: 'to top', title: 'To Top' },
  { label: '↘', value: 'to bottom right', title: 'To Bottom Right' },
  { label: '↙', value: 'to bottom left', title: 'To Bottom Left' },
  { label: '↗', value: 'to top right', title: 'To Top Right' },
  { label: '↖', value: 'to top left', title: 'To Top Left' },
];

// Utility to convert hex to RGBA
function hexToRgba(hex, alpha = 1) {
  if (!hex || typeof hex !== 'string') return `rgba(79, 107, 255, ${alpha})`;
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

  // Theme & Brand Color State
  const [themeMode, setThemeMode] = useState('light');
  const [brandPrimary, setBrandPrimary] = useState(THEME_PRESETS.blue.brandPrimary);
  const [brandSecondary, setBrandSecondary] = useState(THEME_PRESETS.blue.brandSecondary);
  const [brandHighlight, setBrandHighlight] = useState(THEME_PRESETS.blue.brandHighlight);
  const [currentShades, setCurrentShades] = useState(THEME_PRESETS.blue.shades);

  // Surface Theme Tokens (with Card Background Global Token)
  const [cardBgType, setCardBgType] = useState('solid'); // 'solid' | 'gradient'
  const [cardBgSolid, setCardBgSolid] = useState('#FFFFFF');
  const [cardBgGradientStart, setCardBgGradientStart] = useState('#FFFFFF');
  const [cardBgGradientEnd, setCardBgGradientEnd] = useState('#F5F7FF');
  const [cardBgGradientDir, setCardBgGradientDir] = useState('to right');

  const [cardHeaderBg, setCardHeaderBg] = useState('transparent');
  const [pageBg, setPageBg] = useState('#F8FAFC');
  const [notificationBg, setNotificationBg] = useState('#FFFFFF');

  // Anchored Popover state for Card Background contextual editor
  const [showCardBgPopover, setShowCardBgPopover] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const cardBgBtnRef = useRef(null);
  const cardBgPopoverRef = useRef(null);

  // Semantic Status Color Tokens
  const [statusSuccess, setStatusSuccess] = useState('#10B981');
  const [statusWarning, setStatusWarning] = useState('#F59E0B');
  const [statusInfo, setStatusInfo] = useState('#0284C7');
  const [statusError, setStatusError] = useState('#EF4444');

  // Text Color Tokens
  const [textPrimary, setTextPrimary] = useState('#0F172A');
  const [textSecondary, setTextSecondary] = useState('#475569');
  const [textTertiary, setTextTertiary] = useState('#94A3B8');
  const [textDisabled, setTextDisabled] = useState('#CBD5E1');

  // Active Navigation & Subtabs
  const [activeNav, setActiveNav] = useState('Colour Settings');
  const [activeColorTab, setActiveColorTab] = useState('Status'); // Default to Status to show approved 2x2 grid!

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

  // Apply Theme Preset
  const applyPreset = (presetKey) => {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return;
    setActivePreset(presetKey);
    setBrandPrimary(preset.brandPrimary);
    setBrandSecondary(preset.brandSecondary);
    setBrandHighlight(preset.brandHighlight);
    setCurrentShades(preset.shades);
  };

  // Synchronize CSS custom properties whenever tokens change
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);

    // Brand Tokens
    root.style.setProperty('--brand-primary', brandPrimary);
    root.style.setProperty('--brand-secondary', brandSecondary);
    root.style.setProperty('--brand-highlight', brandHighlight);

    root.style.setProperty('--brand-primary-subtle', hexToRgba(brandPrimary, 0.08));
    root.style.setProperty('--brand-primary-subtle-hover', hexToRgba(brandPrimary, 0.14));
    root.style.setProperty('--brand-primary-border', hexToRgba(brandPrimary, 0.28));
    root.style.setProperty('--brand-secondary-subtle', hexToRgba(brandSecondary, 0.12));
    root.style.setProperty('--brand-highlight-subtle', hexToRgba(brandHighlight, 0.12));
    root.style.setProperty('--focus-ring', `0 0 0 3px ${hexToRgba(brandPrimary, 0.2)}`);

    // GLOBAL CARD BACKGROUND PREVIEW TOKEN
    // Only consumed by actual application preview cards (.ds-card). Theme Studio remains static!
    const cardBgValue = cardBgType === 'solid'
      ? cardBgSolid
      : `linear-gradient(${cardBgGradientDir}, ${cardBgGradientStart}, ${cardBgGradientEnd})`;

    root.style.setProperty('--color-card-background', cardBgValue);

    // Other Preview Surface Tokens
    root.style.setProperty('--color-card-header', cardHeaderBg);
    root.style.setProperty('--color-page-background', pageBg);
    root.style.setProperty('--color-notification-background', notificationBg);

    // Semantic Status Tokens
    root.style.setProperty('--color-success', statusSuccess);
    root.style.setProperty('--color-success-bg', hexToRgba(statusSuccess, 0.12));
    root.style.setProperty('--color-success-border', hexToRgba(statusSuccess, 0.3));
    root.style.setProperty('--color-success-text', statusSuccess);

    root.style.setProperty('--color-warning', statusWarning);
    root.style.setProperty('--color-warning-bg', hexToRgba(statusWarning, 0.12));
    root.style.setProperty('--color-warning-border', hexToRgba(statusWarning, 0.3));
    root.style.setProperty('--color-warning-text', statusWarning);

    root.style.setProperty('--color-info', statusInfo);
    root.style.setProperty('--color-info-bg', hexToRgba(statusInfo, 0.12));
    root.style.setProperty('--color-info-border', hexToRgba(statusInfo, 0.3));
    root.style.setProperty('--color-info-text', statusInfo);

    root.style.setProperty('--color-error', statusError);
    root.style.setProperty('--color-error-bg', hexToRgba(statusError, 0.12));
    root.style.setProperty('--color-error-border', hexToRgba(statusError, 0.3));
    root.style.setProperty('--color-error-text', statusError);

    // Text Tokens
    root.style.setProperty('--text-primary', textPrimary);
    root.style.setProperty('--text-secondary', textSecondary);
    root.style.setProperty('--text-tertiary', textTertiary);
    root.style.setProperty('--text-disabled', textDisabled);
  }, [
    themeMode,
    brandPrimary,
    brandSecondary,
    brandHighlight,
    cardBgType,
    cardBgSolid,
    cardBgGradientStart,
    cardBgGradientEnd,
    cardBgGradientDir,
    cardHeaderBg,
    pageBg,
    notificationBg,
    statusSuccess,
    statusWarning,
    statusInfo,
    statusError,
    textPrimary,
    textSecondary,
    textTertiary,
    textDisabled,
  ]);

  // Reset to Active Preset Defaults
  const handleReset = () => {
    const preset = THEME_PRESETS[activePreset];
    setBrandPrimary(preset.brandPrimary);
    setBrandSecondary(preset.brandSecondary);
    setBrandHighlight(preset.brandHighlight);
    setCurrentShades(preset.shades);

    setCardBgType('solid');
    setCardBgSolid('#FFFFFF');
    setCardBgGradientStart('#FFFFFF');
    setCardBgGradientEnd('#F5F7FF');
    setCardBgGradientDir('to right');

    setCardHeaderBg('transparent');
    setPageBg('#F8FAFC');
    setNotificationBg('#FFFFFF');

    setStatusSuccess('#10B981');
    setStatusWarning('#F59E0B');
    setStatusInfo('#0284C7');
    setStatusError('#EF4444');

    setTextPrimary('#0F172A');
    setTextSecondary('#475569');
    setTextTertiary('#94A3B8');
    setTextDisabled('#CBD5E1');

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

  // Toggle anchored Card Background popover beside the trigger control
  const handleToggleCardBgPopover = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (showCardBgPopover) {
      setShowCardBgPopover(false);
      return;
    }
    if (cardBgBtnRef.current) {
      const rect = cardBgBtnRef.current.getBoundingClientRect();
      const popoverWidth = 290;
      const popoverHeight = cardBgType === 'solid' ? 140 : 255;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Position directly beside (to the right of) the sidebar Card Background control
      let left = rect.right + 10;
      let top = rect.top - 6;

      // Smart repositioning if not enough space on right
      if (left + popoverWidth > viewportWidth - 12) {
        if (rect.bottom + popoverHeight < viewportHeight - 12) {
          left = Math.max(12, rect.left);
          top = rect.bottom + 8;
        } else {
          left = Math.max(12, rect.left - popoverWidth - 10);
        }
      }

      // Keep within vertical bounds of viewport
      if (top + popoverHeight > viewportHeight - 12) {
        top = Math.max(12, viewportHeight - popoverHeight - 12);
      }
      if (top < 12) top = 12;

      setPopoverPos({ top, left });
      setShowCardBgPopover(true);
    }
  };

  // Close popover on outside click, Escape key, or reposition on window resize
  useEffect(() => {
    if (!showCardBgPopover) return;

    const handleClickOutside = (event) => {
      if (
        cardBgPopoverRef.current &&
        !cardBgPopoverRef.current.contains(event.target) &&
        cardBgBtnRef.current &&
        !cardBgBtnRef.current.contains(event.target)
      ) {
        setShowCardBgPopover(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowCardBgPopover(false);
      }
    };

    const handleReposition = () => {
      if (cardBgBtnRef.current) {
        const rect = cardBgBtnRef.current.getBoundingClientRect();
        const popoverWidth = 290;
        const popoverHeight = cardBgType === 'solid' ? 140 : 255;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = rect.right + 10;
        let top = rect.top - 6;

        if (left + popoverWidth > viewportWidth - 12) {
          if (rect.bottom + popoverHeight < viewportHeight - 12) {
            left = Math.max(12, rect.left);
            top = rect.bottom + 8;
          } else {
            left = Math.max(12, rect.left - popoverWidth - 10);
          }
        }

        if (top + popoverHeight > viewportHeight - 12) {
          top = Math.max(12, viewportHeight - popoverHeight - 12);
        }
        if (top < 12) top = 12;

        setPopoverPos({ top, left });
      }
    };

    window.addEventListener('resize', handleReposition);
    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleReposition);
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCardBgPopover, cardBgType]);

  // Computed Card Background for export/preview
  const currentCardBgCss = cardBgType === 'solid'
    ? cardBgSolid
    : `linear-gradient(${cardBgGradientDir}, ${cardBgGradientStart}, ${cardBgGradientEnd})`;

  // Copy CSS Tokens to Clipboard
  const handleCopyTokens = () => {
    const tokens = `/* ==========================================================================
   Enterprise SaaS Design System Tokens (${THEME_PRESETS[activePreset].name})
   ========================================================================== */
:root {
  /* Brand Tokens */
  --brand-primary: ${brandPrimary};
  --brand-secondary: ${brandSecondary};
  --brand-highlight: ${brandHighlight};

  /* Global Surface Tokens */
  --color-card-background: ${currentCardBgCss};
  --color-card-header: ${cardHeaderBg};
  --color-page-background: ${pageBg};
  --color-notification-background: ${notificationBg};

  /* Semantic Status Tokens */
  --color-success: ${statusSuccess};
  --color-warning: ${statusWarning};
  --color-info: ${statusInfo};
  --color-error: ${statusError};

  /* Typography / Text Tokens */
  --text-primary: ${textPrimary};
  --text-secondary: ${textSecondary};
  --text-tertiary: ${textTertiary};
  --text-disabled: ${textDisabled};

  /* Standard Metrics */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-card: 10px;
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
              <RotateCcw size={15} />
            </button>
            <button
              className="icon-btn"
              onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
              title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
              aria-label="Toggle dark/light mode"
            >
              {themeMode === 'light' ? <Moon size={15} /> : <Sun size={15} />}
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
                      <Icon size={16} />
                    </span>
                    <span className="nav-label">{item.label}</span>
                  </div>

                  <div className="nav-item-actions">
                    <MessageSquare size={13} className="sub-icon" title="View comments" />
                    <Info size={13} className="sub-icon" title="Component documentation" />
                  </div>
                </div>

                {/* Subpanel for Colour Settings */}
                {isActive && item.id === 'Colour Settings' && (
                  <div className="sidebar-expanded-section">
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

                    {/* ==========================================================
                        TAB 1: BRAND TOKENS
                        ========================================================== */}
                    {activeColorTab === 'Brand' && (
                      <>
                        {/* Theme Preset Selector */}
                        <div className="theme-preset-section">
                          <div className="theme-preset-title">
                            <span>Theme Presets</span>
                            <Sparkles size={12} style={{ color: 'var(--brand-primary)' }} />
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
                                {activePreset === 'blue' && <Check size={11} color="var(--brand-primary)" />}
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
                                {activePreset === 'green' && <Check size={11} color="var(--brand-primary)" />}
                              </div>
                              <div className="theme-preset-swatches">
                                <span className="preset-mini-swatch" style={{ backgroundColor: '#10B981' }} />
                                <span className="preset-mini-swatch" style={{ backgroundColor: '#F59E0B' }} />
                                <span className="preset-mini-swatch" style={{ backgroundColor: '#2EE59D' }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* BRAND COLOR */}
                        <div className="color-field-group">
                          <div className="color-field-label">
                            <span>Brand Color</span>
                            <Info size={11} className="help-icon" title="Primary UI brand color token" />
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
                            <Info size={11} className="help-icon" title="Secondary accent token" />
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
                            <Info size={11} className="help-icon" title="Highlight accent token" />
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
                      </>
                    )}

                    {/* ==========================================================
                        TAB 2: STATUS & SURFACES (Approved OLD UI 2x2 Grid Layout)
                        Matches Reference Screenshot Exactly
                        ========================================================== */}
                    {activeColorTab === 'Status' && (
                      <>
                        {/* 1. STATUS COLORS (Approved 2x2 Grid) */}
                        <div>
                          <div className="old-ui-section-header">
                            <span>STATUS COLORS</span>
                            <Info size={11} className="help-icon" title="Semantic status colors" />
                          </div>

                          <div className="old-ui-grid-2x2">
                            {/* Success */}
                            <label className="old-ui-card-btn" title="Click to customize Success color">
                              <span className="old-ui-swatch-box" style={{ backgroundColor: statusSuccess }} />
                              <span className="old-ui-card-label">Success</span>
                              <input
                                type="color"
                                className="color-picker-hidden-input"
                                value={statusSuccess}
                                onChange={(e) => setStatusSuccess(e.target.value)}
                                aria-label="Success color picker"
                              />
                            </label>

                            {/* Warning */}
                            <label className="old-ui-card-btn" title="Click to customize Warning color">
                              <span className="old-ui-swatch-box" style={{ backgroundColor: statusWarning }} />
                              <span className="old-ui-card-label">Warning</span>
                              <input
                                type="color"
                                className="color-picker-hidden-input"
                                value={statusWarning}
                                onChange={(e) => setStatusWarning(e.target.value)}
                                aria-label="Warning color picker"
                              />
                            </label>

                            {/* Info */}
                            <label className="old-ui-card-btn" title="Click to customize Info color">
                              <span className="old-ui-swatch-box" style={{ backgroundColor: statusInfo }} />
                              <span className="old-ui-card-label">Info</span>
                              <input
                                type="color"
                                className="color-picker-hidden-input"
                                value={statusInfo}
                                onChange={(e) => setStatusInfo(e.target.value)}
                                aria-label="Info color picker"
                              />
                            </label>

                            {/* Error */}
                            <label className="old-ui-card-btn" title="Click to customize Error color">
                              <span className="old-ui-swatch-box" style={{ backgroundColor: statusError }} />
                              <span className="old-ui-card-label">Error</span>
                              <input
                                type="color"
                                className="color-picker-hidden-input"
                                value={statusError}
                                onChange={(e) => setStatusError(e.target.value)}
                                aria-label="Error color picker"
                              />
                            </label>
                          </div>
                        </div>

                        {/* 2. SURFACES (Approved 2x2 Grid) */}
                        <div>
                          <div className="old-ui-section-header with-margin">
                            <span>SURFACES</span>
                            <Info size={11} className="help-icon" title="Global surface tokens" />
                          </div>

                          <div className="old-ui-grid-2x2">
                            {/* Card Background - Opens Solid / Gradient Anchored Popover! */}
                            <div
                              ref={cardBgBtnRef}
                              className={`old-ui-card-btn surface-btn ${showCardBgPopover ? 'active-trigger' : ''}`}
                              onClick={handleToggleCardBgPopover}
                              title="Click to customize Card background (Solid or Gradient)"
                              role="button"
                              tabIndex={0}
                            >
                              <span
                                className="old-ui-swatch-box surface-swatch"
                                style={{ background: currentCardBgCss }}
                              />
                              <div className="old-ui-card-label-two-line">
                                <span>Card</span>
                                <span>background</span>
                              </div>
                            </div>

                            {/* Card Header */}
                            <label className="old-ui-card-btn surface-btn" title="Click to customize Card header">
                              <span
                                className="old-ui-swatch-box surface-swatch"
                                style={{ backgroundColor: cardHeaderBg === 'transparent' ? '#F8FAFC' : cardHeaderBg }}
                              />
                              <span className="old-ui-card-label">Card header</span>
                              <input
                                type="color"
                                className="color-picker-hidden-input"
                                value={cardHeaderBg === 'transparent' ? '#FFFFFF' : cardHeaderBg}
                                onChange={(e) => setCardHeaderBg(e.target.value)}
                                aria-label="Card header color picker"
                              />
                            </label>

                            {/* Page Background */}
                            <label className="old-ui-card-btn surface-btn" title="Click to customize Page background">
                              <span
                                className="old-ui-swatch-box surface-swatch"
                                style={{ backgroundColor: pageBg }}
                              />
                              <div className="old-ui-card-label-two-line">
                                <span>Page</span>
                                <span>background</span>
                              </div>
                              <input
                                type="color"
                                className="color-picker-hidden-input"
                                value={pageBg}
                                onChange={(e) => setPageBg(e.target.value)}
                                aria-label="Page background color picker"
                              />
                            </label>

                            {/* Notification Background */}
                            <label className="old-ui-card-btn surface-btn" title="Click to customize Notification background">
                              <span
                                className="old-ui-swatch-box surface-swatch"
                                style={{ backgroundColor: notificationBg }}
                              />
                              <div className="old-ui-card-label-two-line">
                                <span>Notification</span>
                                <span>background</span>
                              </div>
                              <input
                                type="color"
                                className="color-picker-hidden-input"
                                value={notificationBg}
                                onChange={(e) => setNotificationBg(e.target.value)}
                                aria-label="Notification background color picker"
                              />
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    {/* ==========================================================
                        TAB 3: TEXT TOKENS
                        ========================================================== */}
                    {activeColorTab === 'Text' && (
                      <div className="color-field-group">
                        <div className="old-ui-section-header">
                          <span>Typography & Text Tokens</span>
                          <Info size={11} className="help-icon" title="Global text color roles" />
                        </div>

                        <div className="old-ui-grid-2x2">
                          <label className="old-ui-card-btn" title="Text Primary">
                            <span className="old-ui-swatch-box" style={{ backgroundColor: textPrimary }} />
                            <span className="old-ui-card-label">Primary</span>
                            <input
                              type="color"
                              className="color-picker-hidden-input"
                              value={textPrimary}
                              onChange={(e) => setTextPrimary(e.target.value)}
                            />
                          </label>

                          <label className="old-ui-card-btn" title="Text Secondary">
                            <span className="old-ui-swatch-box" style={{ backgroundColor: textSecondary }} />
                            <span className="old-ui-card-label">Secondary</span>
                            <input
                              type="color"
                              className="color-picker-hidden-input"
                              value={textSecondary}
                              onChange={(e) => setTextSecondary(e.target.value)}
                            />
                          </label>

                          <label className="old-ui-card-btn" title="Text Tertiary">
                            <span className="old-ui-swatch-box" style={{ backgroundColor: textTertiary }} />
                            <span className="old-ui-card-label">Tertiary</span>
                            <input
                              type="color"
                              className="color-picker-hidden-input"
                              value={textTertiary}
                              onChange={(e) => setTextTertiary(e.target.value)}
                            />
                          </label>

                          <label className="old-ui-card-btn" title="Text Disabled">
                            <span className="old-ui-swatch-box" style={{ backgroundColor: textDisabled }} />
                            <span className="old-ui-card-label">Disabled</span>
                            <input
                              type="color"
                              className="color-picker-hidden-input"
                              value={textDisabled}
                              onChange={(e) => setTextDisabled(e.target.value)}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </aside>

      {/* ====================================================================
          MAIN WORKSPACE & PREVIEW AREA
          All standard cards consume var(--color-card-background)
          ==================================================================== */}
      <main className="main-workspace">
        {/* Top Header with Theme Switcher */}
        <header className="top-header">
          <div className="header-left">
            <div className="preview-tag">
              <Monitor size={16} className="device-icon" />
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
                <ChevronDown size={13} />
              </button>

              {showZoomMenu && (
                <div
                  className="modal-card"
                  style={{
                    position: 'absolute',
                    top: '34px',
                    right: 0,
                    width: '150px',
                    padding: '4px',
                    zIndex: 30,
                  }}
                >
                  {[75, 85, 100, 125].map((lvl) => (
                    <button
                      key={lvl}
                      className={`nav-item ${zoomLevel === lvl ? 'active' : ''}`}
                      style={{ height: '30px', fontSize: '12px' }}
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
              style={{ height: '28px', padding: '0 10px', fontSize: '11px' }}
              onClick={() => setShowExportModal(true)}
            >
              <Share2 size={12} />
              <span>Export Tokens</span>
            </button>
          </div>
        </header>

        {/* Scaled Canvas Wrapper - Zero Scroll */}
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
              <Info size={16} className="info-icon" title="Design System Component Showcase" />
            </h1>
            <span className="badge-counter">
              Active: {THEME_PRESETS[activePreset].name}
            </span>
          </div>

          {/* Standard Cards Grid - All Inherit var(--color-card-background) */}
          <div className="cards-grid">
            {/* ROW 1: Typography Scale (Left) + Selection States (Right) */}
            <div className="grid-row-split">
              {/* STANDARD CARD 1: Typography Scale */}
              <section className="ds-card" aria-labelledby="typography-heading">
                <div className="ds-card-header">
                  <h2 id="typography-heading" className="ds-card-title">
                    Typography Scale
                  </h2>
                </div>
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

              {/* STANDARD CARD 2: Selection States (Activity & Settings Cards) */}
              <section className="ds-card" aria-labelledby="selection-heading">
                <div className="ds-card-header">
                  <h2 id="selection-heading" className="ds-card-title">
                    Selection States
                  </h2>
                </div>

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

            {/* ROW 2: STANDARD CARD 3 - Inputs & Selection */}
            <div className="grid-row-full">
              <section className="ds-card" aria-labelledby="inputs-heading">
                <div className="ds-card-header">
                  <h2 id="inputs-heading" className="ds-card-title">
                    Inputs & Selection
                  </h2>
                </div>

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
                        {checkboxState && <Check size={12} strokeWidth={3} />}
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

            {/* ROW 3: STANDARD CARD 4 (Buttons) + STANDARD CARD 5 (Revenue & Chips) */}
            <div className="grid-row-split-50">
              {/* STANDARD CARD 4: Buttons */}
              <section className="ds-card" aria-labelledby="buttons-heading">
                <div className="ds-card-header">
                  <h2 id="buttons-heading" className="ds-card-title">
                    Buttons
                  </h2>
                </div>

                <div className="buttons-row">
                  <button className="btn btn-contained">CONTAINED</button>
                  <button className="btn btn-outlined">OUTLINED</button>
                  <button className="btn btn-text">TEXT</button>
                  <button className="btn btn-tonal">TONAL</button>
                  <button className="btn btn-rounded">ROUNDED</button>
                  <button className="btn btn-error">ERROR</button>
                </div>
              </section>

              {/* STANDARD CARD 5: Chips, Alerts & Revenue Progress */}
              <section className="ds-card" aria-labelledby="chips-progress-heading">
                <div className="ds-card-header">
                  <h2 id="chips-progress-heading" className="ds-card-title">
                    Chips, Alerts & Progress
                  </h2>
                </div>

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

                  {/* Notification Surface Token Demo */}
                  <div className="notification-banner-sample" title="Consumes --color-notification-background">
                    <div className="notif-left">
                      <span className="notif-dot" />
                      <span>Notification Surface Token</span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Live Token</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* ====================================================================
          ANCHORED CARD BACKGROUND POPOVER (Solid + Gradient)
          Opens directly beside the Card Background control in sidebar
          No full-screen backdrop / overlay!
          ==================================================================== */}
      {showCardBgPopover && (
        <div
          ref={cardBgPopoverRef}
          className="card-bg-anchored-popover"
          style={{
            position: 'fixed',
            top: `${popoverPos.top}px`,
            left: `${popoverPos.left}px`,
          }}
        >
          <div className="card-bg-popover-header">
            <span className="card-bg-popover-title">Card Background</span>
            <button
              type="button"
              className="icon-btn"
              style={{ width: '22px', height: '22px' }}
              onClick={() => setShowCardBgPopover(false)}
              aria-label="Close"
            >
              <X size={13} />
            </button>
          </div>

          {/* Mode Switcher: Solid vs Gradient */}
          <div className="card-bg-mode-tabs" role="tablist">
            <button
              type="button"
              className={`card-bg-mode-btn ${cardBgType === 'solid' ? 'active' : ''}`}
              onClick={() => setCardBgType('solid')}
            >
              Solid
            </button>
            <button
              type="button"
              className={`card-bg-mode-btn ${cardBgType === 'gradient' ? 'active' : ''}`}
              onClick={() => setCardBgType('gradient')}
            >
              Gradient
            </button>
          </div>

          {/* Solid Mode */}
          {cardBgType === 'solid' ? (
            <div className="card-bg-solid-section">
              <label
                className="solid-color-row"
                title="Click to pick solid card background color"
              >
                <span
                  className="solid-color-swatch"
                  style={{ backgroundColor: cardBgSolid }}
                />
                <div className="solid-color-info">
                  <span className="solid-color-label">Solid Color</span>
                  <span className="solid-color-hex">{cardBgSolid.toUpperCase()}</span>
                </div>
                <span className="solid-color-change-hint">Change</span>
                <input
                  type="color"
                  className="color-picker-hidden-input"
                  value={cardBgSolid}
                  onChange={(e) => setCardBgSolid(e.target.value)}
                  aria-label="Solid card background color picker"
                />
              </label>
            </div>
          ) : (
            /* Gradient Mode */
            <div className="card-bg-gradient-section">
              <div className="gradient-picker-inputs">
                {/* Start Color */}
                <label className="gradient-color-field" title="Click to pick start color">
                  <span
                    className="gradient-swatch-box"
                    style={{ backgroundColor: cardBgGradientStart }}
                  />
                  <div className="gradient-color-text">
                    <span className="gradient-field-label">Start Color</span>
                    <span className="gradient-field-hex">{cardBgGradientStart.toUpperCase()}</span>
                  </div>
                  <input
                    type="color"
                    className="color-picker-hidden-input"
                    value={cardBgGradientStart}
                    onChange={(e) => setCardBgGradientStart(e.target.value)}
                    aria-label="Start color picker"
                  />
                </label>

                {/* End Color */}
                <label className="gradient-color-field" title="Click to pick end color">
                  <span
                    className="gradient-swatch-box"
                    style={{ backgroundColor: cardBgGradientEnd }}
                  />
                  <div className="gradient-color-text">
                    <span className="gradient-field-label">End Color</span>
                    <span className="gradient-field-hex">{cardBgGradientEnd.toUpperCase()}</span>
                  </div>
                  <input
                    type="color"
                    className="color-picker-hidden-input"
                    value={cardBgGradientEnd}
                    onChange={(e) => setCardBgGradientEnd(e.target.value)}
                    aria-label="End color picker"
                  />
                </label>
              </div>

              {/* Direction Grid */}
              <div className="gradient-dir-container">
                <span className="gradient-dir-label">Direction</span>
                <div className="gradient-direction-grid">
                  {GRADIENT_DIRECTIONS.map((dir) => (
                    <button
                      key={dir.value}
                      type="button"
                      className={`gradient-dir-btn ${cardBgGradientDir === dir.value ? 'active' : ''}`}
                      onClick={() => setCardBgGradientDir(dir.value)}
                      title={dir.title}
                    >
                      {dir.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gradient Preview Bar */}
              <div
                className="gradient-preview-bar"
                style={{
                  background: `linear-gradient(${cardBgGradientDir}, ${cardBgGradientStart}, ${cardBgGradientEnd})`,
                }}
              />
            </div>
          )}
        </div>
      )}

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
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Export production-ready CSS variables configured in this theme studio session.
            </p>

            <pre className="code-snippet">
{`/* ${THEME_PRESETS[activePreset].name} Tokens */
:root {
  /* Brand */
  --brand-primary: ${brandPrimary};
  --brand-secondary: ${brandSecondary};
  --brand-highlight: ${brandHighlight};

  /* Surfaces */
  --color-card-background: ${currentCardBgCss};
  --color-card-header: ${cardHeaderBg};
  --color-page-background: ${pageBg};
  --color-notification-background: ${notificationBg};

  /* Status Colors */
  --color-success: ${statusSuccess};
  --color-warning: ${statusWarning};
  --color-info: ${statusInfo};
  --color-error: ${statusError};

  /* Text */
  --text-primary: ${textPrimary};
  --text-secondary: ${textSecondary};
  --text-tertiary: ${textTertiary};
  --text-disabled: ${textDisabled};
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
                {copiedTokens ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedTokens ? 'Copied!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
