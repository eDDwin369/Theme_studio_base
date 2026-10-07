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
  Sparkles,
  Edit2,
  ChevronUp,
  Maximize2,
  Settings
} from 'lucide-react';
import oomnieyeLogo from './assets/oomnieye-logo.png';
import allcadLogo from './assets/allcad-logo.png';
import './App.css';

import {
  COLOR_SCHEMES,
  APPEARANCE_MODES,
  deriveTheme,
  getCardShadowForTheme,
  getCardBorderForTheme,
  getCardHeaderStylesForTheme,
  getNestedStylesForTheme,
  getCardTintOverlayForTheme,
  hexToRgba,
} from './themeTokens';

// Theme Presets Specification (Centralized Brand Palettes)
const THEME_PRESETS = COLOR_SCHEMES;

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

export default function App() {
  // Color Scheme Preset (Corporate Blue vs Corporate Green)
  const [activePreset, setActivePreset] = useState('blue');

  // Appearance Mode (Light vs Dark)
  const [themeMode, setThemeMode] = useState('light');
  const isDarkMode = themeMode === 'dark';

  const [brandPrimary, setBrandPrimary] = useState(THEME_PRESETS.blue.primary);
  const [brandSecondary, setBrandSecondary] = useState(THEME_PRESETS.blue.secondary);
  const [brandHighlight, setBrandHighlight] = useState(THEME_PRESETS.blue.highlight);
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
  const [activeNav, setActiveNav] = useState('Cards'); // Default to Cards for Theme Preview!
  const [activeColorTab, setActiveColorTab] = useState('Status'); // Default to Status to show approved 2x2 grid!

  // Cards Theme Studio Component States (Restored Functionality)
  const [cardTab, setCardTab] = useState('Style'); // 'Style' | 'Header' | 'Nested' | 'Tint'

  // Tab 1: Style (Outlined | Soft | Floating)
  const [cardVariant, setCardVariant] = useState('Soft'); // 'Outlined' | 'Soft' | 'Floating'
  const [cardShadowDepth, setCardShadowDepth] = useState(20);
  const [shadowDepthAuto, setShadowDepthAuto] = useState(false);

  // Tab 2: Header (Plain | Tinted | Accent)
  const [cardHeaderStyle, setCardHeaderStyle] = useState('Plain'); // 'Plain' | 'Tinted' | 'Accent'
  const [cardHeaderStrength, setCardHeaderStrength] = useState(0);
  const [headerStrengthAuto, setHeaderStrengthAuto] = useState(true);

  // Tab 3: Nested (Recessed | Flat | Raised)
  const [cardNestedStyle, setCardNestedStyle] = useState('Recessed'); // 'Recessed' | 'Flat' | 'Raised'
  const [cardNestedDepth, setCardNestedDepth] = useState(6);
  const [nestedDepthAuto, setNestedDepthAuto] = useState(true);

  // Tab 4: Tint (None | Low | High)
  const [cardTint, setCardTint] = useState('None'); // 'None' | 'Low' | 'High'
  const [cardTintIntensity, setCardTintIntensity] = useState(0);
  const [tintIntensityAuto, setTintIntensityAuto] = useState(true);

  // Theme-aware helper delegates
  const getCardShadow = (variant, depth) => getCardShadowForTheme(variant, depth, isDarkMode);
  const getCardBorder = (variant) => getCardBorderForTheme(variant, isDarkMode);
  const getCardHeaderStyles = (style, strength) => getCardHeaderStylesForTheme(style, strength, brandPrimary, isDarkMode);
  const getNestedStyles = (style, depth) => getNestedStylesForTheme(style, depth, isDarkMode);
  const getCardTintOverlay = (tint, intensity) => getCardTintOverlayForTheme(tint, intensity, brandPrimary, brandSecondary, isDarkMode);

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

  // Apply Theme Preset (Corporate Blue vs Corporate Green)
  const applyPreset = (presetKey) => {
    const preset = THEME_PRESETS[presetKey];
    if (!preset) return;
    setActivePreset(presetKey);
    setBrandPrimary(preset.primary || preset.brandPrimary);
    setBrandSecondary(preset.secondary || preset.brandSecondary);
    setBrandHighlight(preset.highlight || preset.brandHighlight);
    setCurrentShades(preset.shades);
  };

  // Switch Appearance Mode (Light vs Dark) independently
  const handleToggleThemeMode = (newMode) => {
    if (newMode === themeMode) return;
    setThemeMode(newMode);

    // If cardBgSolid is currently default, transition to new mode's default
    if (cardBgSolid === '#FFFFFF' && newMode === 'dark') {
      setCardBgSolid('#181D27');
      setCardBgGradientStart('#181D27');
      setCardBgGradientEnd('#202632');
    } else if (cardBgSolid === '#181D27' && newMode === 'light') {
      setCardBgSolid('#FFFFFF');
      setCardBgGradientStart('#FFFFFF');
      setCardBgGradientEnd('#F5F7FF');
    }

    if (pageBg === '#F8FAFC' && newMode === 'dark') {
      setPageBg('#11151D');
    } else if (pageBg === '#11151D' && newMode === 'light') {
      setPageBg('#F8FAFC');
    }
  };

  // Synchronize CSS custom properties whenever tokens change
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeMode);
    root.setAttribute('data-color-scheme', activePreset);

    // Centralized Design System Theme Tokens
    const tokens = deriveTheme(activePreset, themeMode);

    // Brand Tokens
    root.style.setProperty('--brand-primary', tokens.accent);
    root.style.setProperty('--brand-primary-hover', tokens.accentHover);
    root.style.setProperty('--brand-primary-active', tokens.accentActive);
    root.style.setProperty('--brand-primary-subtle', tokens.accentSoft);
    root.style.setProperty('--brand-primary-subtle-hover', tokens.accentSoftHover);
    root.style.setProperty('--brand-primary-border', tokens.accentBorder);
    root.style.setProperty('--brand-secondary', tokens.accentSecondary);
    root.style.setProperty('--brand-highlight', tokens.accentHighlight);
    root.style.setProperty('--brand-secondary-subtle', hexToRgba(tokens.accentSecondary, themeMode === 'dark' ? 0.18 : 0.12));
    root.style.setProperty('--brand-highlight-subtle', hexToRgba(tokens.accentHighlight, themeMode === 'dark' ? 0.18 : 0.12));
    root.style.setProperty('--focus-ring', `0 0 0 3px ${hexToRgba(tokens.accent, 0.22)}`);

    // Theme Studio Editor Fixed Surfaces
    root.style.setProperty('--theme-studio-bg', tokens.themeStudioBg);
    root.style.setProperty('--theme-studio-surface', tokens.themeStudioSurface);
    root.style.setProperty('--theme-studio-panel', tokens.themeStudioPanel);
    root.style.setProperty('--theme-studio-control-bg', tokens.themeStudioControlBg);
    root.style.setProperty('--theme-studio-muted', tokens.themeStudioMuted);
    root.style.setProperty('--theme-studio-border', tokens.themeStudioBorder);

    // Standard UI Surfaces
    root.style.setProperty('--bg-canvas', tokens.background);
    root.style.setProperty('--bg-sidebar', tokens.sidebar);
    root.style.setProperty('--bg-header', tokens.themeStudioSurface);
    root.style.setProperty('--bg-card', tokens.cardBackground);
    root.style.setProperty('--bg-card-subtle', tokens.surfaceElevated);
    root.style.setProperty('--bg-muted', tokens.themeStudioMuted);
    root.style.setProperty('--bg-hover', themeMode === 'dark' ? '#1A202C' : '#F8FAFC');
    root.style.setProperty('--bg-active', themeMode === 'dark' ? '#242D3D' : '#EEF2F6');

    // Borders
    root.style.setProperty('--border-subtle', tokens.borderSubtle);
    root.style.setProperty('--border-default', tokens.border);
    root.style.setProperty('--border-strong', tokens.borderStrong);

    // Text Tokens
    root.style.setProperty('--text-primary', tokens.textPrimary);
    root.style.setProperty('--text-secondary', tokens.textSecondary);
    root.style.setProperty('--text-tertiary', tokens.textTertiary);
    root.style.setProperty('--text-disabled', tokens.textDisabled);

    // Shadows
    root.style.setProperty('--shadow-card', tokens.shadowCard);
    root.style.setProperty('--shadow-dropdown', tokens.shadowDropdown);

    // Semantic Status Tokens
    root.style.setProperty('--color-success', tokens.statusSuccess);
    root.style.setProperty('--color-success-bg', tokens.statusSuccessBg);
    root.style.setProperty('--color-success-border', tokens.statusSuccessBorder);
    root.style.setProperty('--color-success-text', tokens.statusSuccessText);

    root.style.setProperty('--color-warning', tokens.statusWarning);
    root.style.setProperty('--color-warning-bg', tokens.statusWarningBg);
    root.style.setProperty('--color-warning-border', tokens.statusWarningBorder);
    root.style.setProperty('--color-warning-text', tokens.statusWarningText);

    root.style.setProperty('--color-info', tokens.statusInfo);
    root.style.setProperty('--color-info-bg', tokens.statusInfoBg);
    root.style.setProperty('--color-info-border', tokens.statusInfoBorder);
    root.style.setProperty('--color-info-text', tokens.statusInfoText);

    root.style.setProperty('--color-error', tokens.statusError);
    root.style.setProperty('--color-error-bg', tokens.statusErrorBg);
    root.style.setProperty('--color-error-border', tokens.statusErrorBorder);
    root.style.setProperty('--color-error-text', tokens.statusErrorText);

    // GLOBAL CARD BACKGROUND PREVIEW TOKEN
    const effectiveCardBg = (cardBgSolid === '#FFFFFF' || cardBgSolid === '#181D27')
      ? tokens.cardBackground
      : cardBgSolid;
    const cardBgValue = cardBgType === 'solid'
      ? effectiveCardBg
      : `linear-gradient(${cardBgGradientDir}, ${cardBgGradientStart}, ${cardBgGradientEnd})`;

    root.style.setProperty('--color-card-background', cardBgValue);
    root.style.setProperty('--color-card-header', cardHeaderBg);
    root.style.setProperty('--color-page-background', tokens.previewBackground);
    root.style.setProperty('--color-notification-background', tokens.surfaceElevated);
  }, [
    themeMode,
    activePreset,
    cardBgType,
    cardBgSolid,
    cardBgGradientStart,
    cardBgGradientEnd,
    cardBgGradientDir,
    cardHeaderBg,
    pageBg,
    notificationBg,
  ]);

  // Reset to Active Preset Defaults
  const handleReset = () => {
    const preset = THEME_PRESETS[activePreset];
    setBrandPrimary(preset.primary || preset.brandPrimary);
    setBrandSecondary(preset.secondary || preset.brandSecondary);
    setBrandHighlight(preset.highlight || preset.brandHighlight);
    setCurrentShades(preset.shades);

    const isDark = themeMode === 'dark';
    setCardBgType('solid');
    setCardBgSolid(isDark ? '#181D27' : '#FFFFFF');
    setCardBgGradientStart(isDark ? '#181D27' : '#FFFFFF');
    setCardBgGradientEnd(isDark ? '#202632' : '#F5F7FF');
    setCardBgGradientDir('to right');

    setCardHeaderBg('transparent');
    setPageBg(isDark ? '#11151D' : '#F8FAFC');
    setNotificationBg(isDark ? '#181D27' : '#FFFFFF');

    setStatusSuccess('#10B981');
    setStatusWarning('#F59E0B');
    setStatusInfo('#0284C7');
    setStatusError('#EF4444');

    setTextPrimary(isDark ? '#F8FAFC' : '#0F172A');
    setTextSecondary('#94A3B8');
    setTextTertiary(isDark ? '#64748B' : '#94A3B8');
    setTextDisabled(isDark ? '#475569' : '#CBD5E1');

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

  // Toggle Fullscreen Mode
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Toggle anchored Card Background popover beside the trigger control
  const handleToggleCardBgPopover = (e, customTarget) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (showCardBgPopover) {
      setShowCardBgPopover(false);
      return;
    }
    const target = customTarget || (e && e.currentTarget) || cardBgBtnRef.current;
    if (target) {
      const rect = target.getBoundingClientRect();
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
    const tokensObj = deriveTheme(activePreset, themeMode);
    const tokens = `/* ==========================================================================
   Enterprise SaaS Design System Tokens
   Theme: ${THEME_PRESETS[activePreset].name} · Appearance: ${themeMode.toUpperCase()}
   ========================================================================== */
:root {
  /* Brand Tokens */
  --brand-primary: ${tokensObj.accent};
  --brand-secondary: ${tokensObj.accentSecondary};
  --brand-highlight: ${tokensObj.accentHighlight};

  /* Global Surface Tokens */
  --color-card-background: ${tokensObj.cardBackground};
  --color-card-header: ${cardHeaderBg};
  --color-page-background: ${tokensObj.previewBackground};
  --color-notification-background: ${tokensObj.surfaceElevated};

  /* Borders */
  --border-default: ${tokensObj.border};
  --border-strong: ${tokensObj.borderStrong};

  /* Semantic Status Tokens */
  --color-success: ${tokensObj.statusSuccess};
  --color-warning: ${tokensObj.statusWarning};
  --color-info: ${tokensObj.statusInfo};
  --color-error: ${tokensObj.statusError};

  /* Typography / Text Tokens */
  --text-primary: ${tokensObj.textPrimary};
  --text-secondary: ${tokensObj.textSecondary};
  --text-tertiary: ${tokensObj.textTertiary};
  --text-disabled: ${tokensObj.textDisabled};

  /* Standard Metrics */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-card: 14px;
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
    <div className="app-root">
      {/* ====================================================================
          GLOBAL TOP APP HEADER (OOMNIEYE / ALLCAD)
          Matches Reference Header Pixel-for-Pixel
          ==================================================================== */}
      <header className="global-app-header" aria-label="Application Header">
        <div className="global-header-left">
          <img
            src={oomnieyeLogo}
            alt="OomniEye Crystal Ball Command Center"
            className="global-header-logo-oomnieye"
          />
        </div>

        <div className="global-header-center">
          <img
            src={allcadLogo}
            alt="AllCAD Innovative Engineering Solutions"
            className="global-header-logo-allcad"
          />
        </div>

        <div className="global-header-right">
          <button
            className="global-header-icon-btn"
            onClick={() => handleToggleThemeMode(themeMode === 'light' ? 'dark' : 'light')}
            title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle dark/light mode"
          >
            {themeMode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button
            className="global-header-icon-btn"
            onClick={handleToggleFullscreen}
            title="Toggle fullscreen"
            aria-label="Toggle fullscreen"
          >
            <Maximize2 size={16} />
          </button>
          <button
            className="global-header-icon-btn"
            title="Theme Settings"
            aria-label="Settings"
            onClick={() => setActiveNav('Theme Settings')}
          >
            <Settings size={16} />
          </button>
          <button
            className="global-header-icon-btn"
            title="Notifications"
            aria-label="Notifications"
            onClick={() => setActiveNav('Notifications')}
          >
            <Bell size={16} />
            <span className="global-header-notif-dot" />
          </button>
          <div
            className="global-header-avatar"
            title="User Profile: Administrator"
            aria-label="User Profile"
          >
            <span>A</span>
          </div>
        </div>
      </header>

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
              onClick={() => handleToggleThemeMode(themeMode === 'light' ? 'dark' : 'light')}
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
                    {item.id === 'Cards' && isActive ? (
                      <>
                        <Monitor size={13} className="sub-icon" title="Preview mode" />
                        <Info size={13} className="sub-icon" title="Component documentation" />
                        <span className="chevron-up-icon" title="Active section">▲</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare size={13} className="sub-icon" title="View comments" />
                        <Info size={13} className="sub-icon" title="Component documentation" />
                      </>
                    )}
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

                        {/* Appearance Mode Selector */}
                        <div className="theme-preset-section" style={{ marginTop: '8px' }}>
                          <div className="theme-preset-title">
                            <span>Appearance Mode</span>
                          </div>

                          <div className="theme-preset-cards">
                            {/* Light Mode Card */}
                            <div
                              className={`theme-preset-card ${themeMode === 'light' ? 'active' : ''}`}
                              onClick={() => handleToggleThemeMode('light')}
                              role="button"
                              tabIndex={0}
                            >
                              <div className="theme-preset-card-header">
                                <span className="theme-preset-name">Light</span>
                                {themeMode === 'light' && <Check size={11} color="var(--brand-primary)" />}
                              </div>
                              <div className="theme-preset-swatches">
                                <span className="preset-mini-swatch" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }} />
                                <span className="preset-mini-swatch" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }} />
                                <span className="preset-mini-swatch" style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0' }} />
                              </div>
                            </div>

                            {/* Dark Mode Card */}
                            <div
                              className={`theme-preset-card ${themeMode === 'dark' ? 'active' : ''}`}
                              onClick={() => handleToggleThemeMode('dark')}
                              role="button"
                              tabIndex={0}
                            >
                              <div className="theme-preset-card-header">
                                <span className="theme-preset-name">Dark</span>
                                {themeMode === 'dark' && <Check size={11} color="var(--brand-primary)" />}
                              </div>
                              <div className="theme-preset-swatches">
                                <span className="preset-mini-swatch" style={{ backgroundColor: '#0F1117', border: '1px solid #2A3240' }} />
                                <span className="preset-mini-swatch" style={{ backgroundColor: '#181D27', border: '1px solid #2A3240' }} />
                                <span className="preset-mini-swatch" style={{ backgroundColor: '#202632', border: '1px solid #2A3240' }} />
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

                {/* Subpanel for Cards (Theme Studio) */}
                {isActive && item.id === 'Cards' && (
                  <div className="sidebar-expanded-section">
                    {/* Subtabs: Style | Header | Nested | Tint */}
                    <div className="cards-subtabs-row" role="tablist">
                      {['Style', 'Header', 'Nested', 'Tint'].map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          role="tab"
                          aria-selected={cardTab === tab}
                          className={`cards-subtab-btn ${cardTab === tab ? 'active' : ''}`}
                          onClick={() => setCardTab(tab)}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab 1: Style */}
                    {cardTab === 'Style' && (
                      <div className="cards-tab-content">
                        {/* Outlined / Soft / Floating pills */}
                        <div className="card-variant-buttons" role="group" aria-label="Card Variant Style">
                          {['Outlined', 'Soft', 'Floating'].map((variant) => (
                            <button
                              key={variant}
                              type="button"
                              className={`card-variant-btn ${cardVariant === variant ? 'active' : ''}`}
                              onClick={() => setCardVariant(variant)}
                            >
                              {variant}
                            </button>
                          ))}
                        </div>

                        {/* Shadow Depth Section */}
                        <div className="shadow-depth-section">
                          <div className="shadow-depth-header">
                            <span className="shadow-depth-label">
                              Shadow depth <Info size={11} className="help-icon" title="Adjust card elevation shadow depth" />
                            </span>
                            <span
                              className={`shadow-depth-badge ${!shadowDepthAuto ? 'edited' : ''}`}
                              title="Click to toggle Auto / Manual"
                              onClick={() => setShadowDepthAuto(!shadowDepthAuto)}
                            >
                              {shadowDepthAuto ? `Auto (${cardShadowDepth}px)` : `${cardShadowDepth}px`} <Edit2 size={10} />
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="60"
                            value={cardShadowDepth}
                            onChange={(e) => {
                              setCardShadowDepth(Number(e.target.value));
                              setShadowDepthAuto(false);
                            }}
                            className="shadow-range-slider"
                            aria-label="Card shadow depth"
                            style={{
                              background: `linear-gradient(to right, var(--brand-primary) 0%, var(--brand-primary) ${(cardShadowDepth / 60) * 100}%, var(--border-default) ${(cardShadowDepth / 60) * 100}%, var(--border-default) 100%)`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Header */}
                    {cardTab === 'Header' && (
                      <div className="cards-tab-content">
                        {/* Plain / Tinted / Accent pills */}
                        <div className="card-variant-buttons" role="group" aria-label="Card Header Style">
                          {['Plain', 'Tinted', 'Accent'].map((hOpt) => (
                            <button
                              key={hOpt}
                              type="button"
                              className={`card-variant-btn ${cardHeaderStyle === hOpt ? 'active' : ''}`}
                              onClick={() => {
                                setCardHeaderStyle(hOpt);
                                if (hOpt === 'Plain') {
                                   setCardHeaderStrength(0);
                                   setHeaderStrengthAuto(true);
                                } else if (hOpt === 'Tinted') {
                                   setCardHeaderStrength(35);
                                   setHeaderStrengthAuto(true);
                                } else if (hOpt === 'Accent') {
                                   setCardHeaderStrength(85);
                                   setHeaderStrengthAuto(true);
                                }
                              }}
                            >
                              {hOpt}
                            </button>
                          ))}
                        </div>

                        {/* Header Strength Slider */}
                        <div className="shadow-depth-section">
                          <div className="shadow-depth-header">
                            <span className="shadow-depth-label">
                              Header strength <Info size={11} className="help-icon" title="Adjust header appearance intensity" />
                            </span>
                            <span
                              className={`shadow-depth-badge ${!headerStrengthAuto ? 'edited' : ''}`}
                              title="Click to toggle Auto / Manual"
                              onClick={() => setHeaderStrengthAuto(!headerStrengthAuto)}
                            >
                              {headerStrengthAuto ? `Auto (${cardHeaderStrength}%)` : `${cardHeaderStrength}%`} <Edit2 size={10} />
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={cardHeaderStrength}
                            onChange={(e) => {
                              setCardHeaderStrength(Number(e.target.value));
                              setHeaderStrengthAuto(false);
                            }}
                            className="shadow-range-slider"
                            aria-label="Header strength"
                            style={{
                              background: `linear-gradient(to right, var(--brand-primary) 0%, var(--brand-primary) ${cardHeaderStrength}%, var(--border-default) ${cardHeaderStrength}%, var(--border-default) 100%)`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Nested */}
                    {cardTab === 'Nested' && (
                      <div className="cards-tab-content">
                        {/* Recessed / Flat / Raised pills */}
                        <div className="card-variant-buttons" role="group" aria-label="Nested Element Style">
                          {['Recessed', 'Flat', 'Raised'].map((nOpt) => (
                            <button
                              key={nOpt}
                              type="button"
                              className={`card-variant-btn ${cardNestedStyle === nOpt ? 'active' : ''}`}
                              onClick={() => {
                                setCardNestedStyle(nOpt);
                                if (nOpt === 'Flat') {
                                   setCardNestedDepth(0);
                                   setNestedDepthAuto(true);
                                } else if (nOpt === 'Recessed') {
                                   setCardNestedDepth(6);
                                   setNestedDepthAuto(true);
                                } else if (nOpt === 'Raised') {
                                   setCardNestedDepth(6);
                                   setNestedDepthAuto(true);
                                }
                              }}
                            >
                              {nOpt}
                            </button>
                          ))}
                        </div>

                        {/* Nested Depth Slider */}
                        <div className="shadow-depth-section">
                          <div className="shadow-depth-header">
                            <span className="shadow-depth-label">
                              Nested depth <Info size={11} className="help-icon" title="Adjust nested elements depth" />
                            </span>
                            <span
                              className={`shadow-depth-badge ${!nestedDepthAuto ? 'edited' : ''}`}
                              title="Click to toggle Auto / Manual"
                              onClick={() => setNestedDepthAuto(!nestedDepthAuto)}
                            >
                              {nestedDepthAuto ? `Auto (${cardNestedDepth}px)` : `${cardNestedDepth}px`} <Edit2 size={10} />
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="16"
                            value={cardNestedDepth}
                            onChange={(e) => {
                              setCardNestedDepth(Number(e.target.value));
                              setNestedDepthAuto(false);
                            }}
                            className="shadow-range-slider"
                            aria-label="Nested depth"
                            style={{
                              background: `linear-gradient(to right, var(--brand-primary) 0%, var(--brand-primary) ${(cardNestedDepth / 16) * 100}%, var(--border-default) ${(cardNestedDepth / 16) * 100}%, var(--border-default) 100%)`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Tab 4: Tint */}
                    {cardTab === 'Tint' && (
                      <div className="cards-tab-content">
                        {/* None / Low / High pills */}
                        <div className="card-variant-buttons" role="group" aria-label="Card Tint Option">
                          {['None', 'Low', 'High'].map((tOpt) => (
                            <button
                              key={tOpt}
                              type="button"
                              className={`card-variant-btn ${cardTint === tOpt ? 'active' : ''}`}
                              onClick={() => {
                                setCardTint(tOpt);
                                if (tOpt === 'None') {
                                   setCardTintIntensity(0);
                                   setTintIntensityAuto(true);
                                } else if (tOpt === 'Low') {
                                   setCardTintIntensity(40);
                                   setTintIntensityAuto(true);
                                } else if (tOpt === 'High') {
                                   setCardTintIntensity(100);
                                   setTintIntensityAuto(true);
                                }
                              }}
                            >
                              {tOpt}
                            </button>
                          ))}
                        </div>

                        {/* Tint Intensity Slider */}
                        <div className="shadow-depth-section">
                          <div className="shadow-depth-header">
                            <span className="shadow-depth-label">
                              Tint intensity <Info size={11} className="help-icon" title="Adjust theme tint intensity" />
                            </span>
                            <span
                              className={`shadow-depth-badge ${!tintIntensityAuto ? 'edited' : ''}`}
                              title="Click to toggle Auto / Manual"
                              onClick={() => setTintIntensityAuto(!tintIntensityAuto)}
                            >
                              {tintIntensityAuto ? `Auto (${cardTintIntensity}%)` : `${cardTintIntensity}%`} <Edit2 size={10} />
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={cardTintIntensity}
                            onChange={(e) => {
                              setCardTintIntensity(Number(e.target.value));
                              setTintIntensityAuto(false);
                            }}
                            className="shadow-range-slider"
                            aria-label="Tint intensity"
                            style={{
                              background: `linear-gradient(to right, var(--brand-primary) 0%, var(--brand-primary) ${cardTintIntensity}%, var(--border-default) ${cardTintIntensity}%, var(--border-default) 100%)`
                            }}
                          />
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

            {/* Appearance Mode Switcher (Light vs Dark) */}
            <div className="header-appearance-switcher" role="group" aria-label="Appearance Mode Switcher">
              <button
                className={`theme-toggle-btn ${themeMode === 'light' ? 'active' : ''}`}
                onClick={() => handleToggleThemeMode('light')}
                title="Switch to Light Appearance"
              >
                <Sun size={12} />
                <span>Light</span>
              </button>
              <button
                className={`theme-toggle-btn ${themeMode === 'dark' ? 'active' : ''}`}
                onClick={() => handleToggleThemeMode('dark')}
                title="Switch to Dark Appearance"
              >
                <Moon size={12} />
                <span>Dark</span>
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
              <span>{activeNav === 'Cards' ? 'Theme Preview' : 'Component Library'}</span>
              <Info
                size={16}
                className="info-icon"
                title={activeNav === 'Cards' ? 'Theme Preview - Representative Card Component' : 'Design System Component Showcase'}
              />
            </h1>
            <span className="badge-counter">
              {activeNav === 'Cards'
                ? `${THEME_PRESETS[activePreset].name} · ${isDarkMode ? 'Dark' : 'Light'} · ${cardVariant}`
                : `Active: ${THEME_PRESETS[activePreset].name} (${isDarkMode ? 'Dark' : 'Light'})`}
            </span>
          </div>

          {activeNav === 'Cards' ? (() => {
            const previewHeaderStyles = getCardHeaderStyles(cardHeaderStyle, cardHeaderStrength);
            const previewNestedStyles = getNestedStyles(cardNestedStyle, cardNestedDepth);
            const previewTintOverlay = getCardTintOverlay(cardTint, cardTintIntensity);

            const effectiveCardBg = cardBgType === 'solid'
              ? ((cardBgSolid === '#FFFFFF' || cardBgSolid === '#181D27') ? (isDarkMode ? '#181D27' : '#FFFFFF') : cardBgSolid)
              : `linear-gradient(${cardBgGradientDir}, ${cardBgGradientStart}, ${cardBgGradientEnd})`;

            const cardSurfaceStyle = {
              boxShadow: getCardShadow(cardVariant, cardShadowDepth),
              border: getCardBorder(cardVariant),
              ...(previewTintOverlay !== 'none'
                ? {
                    backgroundColor: cardBgType === 'solid' ? effectiveCardBg : undefined,
                    backgroundImage: cardBgType === 'solid'
                      ? previewTintOverlay
                      : `${previewTintOverlay}, ${effectiveCardBg}`,
                  }
                : {
                    background: effectiveCardBg,
                  }),
            };

            const badgeTintClass = cardTint === 'High' ? 'tint-vibrant' : (cardTint === 'Low' ? 'tint-soft' : 'tint-neutral');

            return (
              <div className="single-card-preview-area">
                <div className="theme-preview-cards-layout">
                  {/* Column 1: Card 1 — Large (Performance Overview) */}
                  <div className="theme-preview-col-primary">
                    <section
                      className="representative-preview-card card-size-lg"
                      style={cardSurfaceStyle}
                      aria-label="Performance Overview Card"
                    >
                      {/* Card Header */}
                      <div
                        className="rep-card-header"
                        style={{
                          backgroundColor: previewHeaderStyles.backgroundColor,
                          borderBottom: previewHeaderStyles.borderBottom,
                        }}
                      >
                        <div className="rep-card-header-titles">
                          <h2 className="rep-card-title" style={{ color: previewHeaderStyles.color }}>Performance Overview</h2>
                          <span className="rep-card-subtitle" style={{ color: previewHeaderStyles.subtitleColor }}>Monthly Performance</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="rep-card-body">
                        {/* Top Metric Row */}
                        <div className="rep-metric-row">
                          <div className="rep-metric-group">
                            <span className="rep-metric-value">$24,580</span>
                            <span className="rep-metric-label">Revenue</span>
                          </div>

                          {/* Small Positive Status Badge */}
                          <div className={`rep-status-badge ${badgeTintClass}`}>
                            <span>▲</span>
                            <span>+12.5%</span>
                          </div>
                        </div>

                        {/* Revenue Performance Sparkline Visualization */}
                        <div
                          className="rep-sparkline-tile"
                          style={{
                            ...previewNestedStyles,
                            borderRadius: '10px',
                          }}
                        >
                          <div className="rep-sparkline-head">
                            <span className="rep-sparkline-title">Revenue Performance</span>
                            <span className="rep-sparkline-period">Jan → Jun</span>
                          </div>

                          <div className="rep-sparkline-svg-wrap">
                            <svg
                              viewBox="0 0 280 50"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ width: '100%', height: '50px', overflow: 'visible' }}
                            >
                              <defs>
                                <linearGradient id="rep-sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity={cardTint === 'High' ? (isDarkMode ? 0.38 : 0.32) : (cardTint === 'Low' ? (isDarkMode ? 0.22 : 0.18) : (isDarkMode ? 0.16 : 0.12))} />
                                  <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0" />
                                </linearGradient>
                              </defs>

                              {/* Area fill under curve */}
                              <path
                                d="M 12,42 C 38,42 48,36 64,36 C 80,36 98,32 116,32 C 134,32 150,24 168,24 C 186,24 202,16 220,16 C 238,16 252,6 270,6 L 270,48 L 12,48 Z"
                                fill="url(#rep-sparkline-gradient)"
                              />

                              {/* Sparkline curve showing gradual upward trend */}
                              <path
                                d="M 12,42 C 38,42 48,36 64,36 C 80,36 98,32 116,32 C 134,32 150,24 168,24 C 186,24 202,16 220,16 C 238,16 252,6 270,6"
                                stroke="var(--brand-primary)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              {/* Target Point Dot at latest Jun coordinate */}
                              <circle cx="270" cy="6" r="5" fill="var(--brand-primary)" fillOpacity="0.25" />
                              <circle cx="270" cy="6" r="3" fill="var(--brand-primary)" stroke={isDarkMode ? '#181D27' : '#FFFFFF'} strokeWidth="1.5" />
                            </svg>
                          </div>

                          {/* Period labels Jan -> Jun */}
                          <div className="rep-sparkline-labels">
                            <span>Jan</span>
                            <span>Feb</span>
                            <span>Mar</span>
                            <span>Apr</span>
                            <span>May</span>
                            <span>Jun</span>
                          </div>
                        </div>

                        {/* Bottom Row - Nested Elements */}
                        <div className="rep-nested-row">
                          <div
                            className="rep-nested-tile"
                            style={{
                              ...previewNestedStyles,
                              borderRadius: '8px',
                            }}
                          >
                            <span className="rep-nested-val">1,284</span>
                            <span className="rep-nested-label">Orders</span>
                          </div>

                          <div
                            className="rep-nested-tile"
                            style={{
                              ...previewNestedStyles,
                              borderRadius: '8px',
                            }}
                          >
                            <span className="rep-nested-val">342</span>
                            <span className="rep-nested-label">Customers</span>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Column 2: Card 2 — Medium & Card 3 — Small */}
                  <div className="theme-preview-col-secondary">
                    {/* Card 2 — Medium: User Activity */}
                    <section
                      className="representative-preview-card card-size-md"
                      style={cardSurfaceStyle}
                      aria-label="User Activity Card"
                    >
                      <div
                        className="rep-card-header"
                        style={{
                          backgroundColor: previewHeaderStyles.backgroundColor,
                          borderBottom: previewHeaderStyles.borderBottom,
                        }}
                      >
                        <div className="rep-card-header-titles">
                          <h2 className="rep-card-title" style={{ color: previewHeaderStyles.color }}>User Activity</h2>
                          <span className="rep-card-subtitle" style={{ color: previewHeaderStyles.subtitleColor }}>Active Engagement</span>
                        </div>
                      </div>

                      <div className="rep-card-body-md">
                        <div className="rep-metric-row">
                          <div className="rep-metric-group">
                            <span className="rep-metric-value-md">8,420</span>
                            <span className="rep-metric-label">Active Users</span>
                          </div>
                          <div className={`rep-status-badge ${badgeTintClass}`}>
                            <span>▲</span>
                            <span>+8.4%</span>
                          </div>
                        </div>

                        {/* Simple horizontal progress indicator */}
                        <div className="rep-progress-wrap">
                          <div className="rep-progress-bar-head">
                            <span className="rep-progress-caption">Monthly Target</span>
                            <span className="rep-progress-val">84%</span>
                          </div>
                          <div
                            className="rep-progress-track"
                            style={{
                              boxShadow: cardNestedStyle === 'Recessed' ? 'inset 0 1px 2px rgba(15, 23, 42, 0.12)' : 'none',
                            }}
                          >
                            <div
                              className="rep-progress-fill"
                              style={{
                                width: '84%',
                                backgroundColor: 'var(--brand-primary)',
                              }}
                            />
                          </div>
                        </div>

                        {/* Small labels: Weekly, Monthly, Goal */}
                        <div className="rep-sublabels-row">
                          <div
                            className="rep-nested-tile"
                            style={{
                              ...previewNestedStyles,
                              borderRadius: '8px',
                              padding: '7px 9px',
                            }}
                          >
                            <span className="rep-sublabel-title">Weekly</span>
                            <span className="rep-sublabel-val">2,140</span>
                          </div>
                          <div
                            className="rep-nested-tile"
                            style={{
                              ...previewNestedStyles,
                              borderRadius: '8px',
                              padding: '7px 9px',
                            }}
                          >
                            <span className="rep-sublabel-title">Monthly</span>
                            <span className="rep-sublabel-val">8,420</span>
                          </div>
                          <div
                            className="rep-nested-tile"
                            style={{
                              ...previewNestedStyles,
                              borderRadius: '8px',
                              padding: '7px 9px',
                            }}
                          >
                            <span className="rep-sublabel-title">Goal</span>
                            <span className="rep-sublabel-val">10k</span>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Card 3 — Small: System Status */}
                    <section
                      className="representative-preview-card card-size-sm"
                      style={cardSurfaceStyle}
                      aria-label="System Status Card"
                    >
                      <div
                        className="rep-card-header"
                        style={{
                          backgroundColor: previewHeaderStyles.backgroundColor,
                          borderBottom: previewHeaderStyles.borderBottom,
                          padding: '11px 18px 9px 18px',
                        }}
                      >
                        <div className="rep-card-header-titles">
                          <h2 className="rep-card-title" style={{ fontSize: '15px', color: previewHeaderStyles.color }}>System Status</h2>
                        </div>
                      </div>

                      <div className="rep-card-body-sm">
                        <div
                          className="rep-status-banner-row"
                          style={{
                            boxShadow: previewNestedStyles.boxShadow,
                            borderRadius: '8px',
                            padding: '9px 12px',
                          }}
                        >
                          <span className="status-indicator-dot" />
                          <span className="rep-status-text">All Systems Operational</span>
                        </div>

                        <div className="rep-status-footer-row">
                          <div className="rep-status-uptime">
                            <span className="rep-uptime-val">99.9%</span>
                            <span className="rep-uptime-label">Uptime</span>
                          </div>
                          <span className="rep-timestamp-label">Last checked: 2 min ago</span>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            );
          })() : (
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
        )}
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
{(() => {
  const tObj = deriveTheme(activePreset, themeMode);
  return `/* ${THEME_PRESETS[activePreset].name} · ${themeMode.toUpperCase()} Tokens */
:root {
  /* Brand */
  --brand-primary: ${tObj.accent};
  --brand-secondary: ${tObj.accentSecondary};
  --brand-highlight: ${tObj.accentHighlight};

  /* Surfaces */
  --color-card-background: ${tObj.cardBackground};
  --color-page-background: ${tObj.previewBackground};
  --color-notification-background: ${tObj.surfaceElevated};

  /* Borders */
  --border-default: ${tObj.border};
  --border-strong: ${tObj.borderStrong};

  /* Status Colors */
  --color-success: ${tObj.statusSuccess};
  --color-warning: ${tObj.statusWarning};
  --color-info: ${tObj.statusInfo};
  --color-error: ${tObj.statusError};

  /* Text */
  --text-primary: ${tObj.textPrimary};
  --text-secondary: ${tObj.textSecondary};
  --text-tertiary: ${tObj.textTertiary};
  --text-disabled: ${tObj.textDisabled};
}`;
})()}
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
    </div>
  );
}
