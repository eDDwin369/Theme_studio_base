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
  Settings,
  Plus,
  Minus,
  Crosshair,
  Locate,
  AlertTriangle,
  DollarSign,
  AlertCircle,
  Download,
  ArrowDown,
  FileText,
  Search,
  ChevronLeft,
  ChevronRight
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

  // Dashboard Preview Interactive States
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  const [showLowStockToast, setShowLowStockToast] = useState(true);

  // Previewing Screen State & Selector Card
  const [showPreviewScreenCard, setShowPreviewScreenCard] = useState(true);
  const [previewScreen, setPreviewScreen] = useState('Dashboard');

  // Operations Center Preview States
  const [mapZoom, setMapZoom] = useState(100);
  const [activeMapLayer, setActiveMapLayer] = useState('Default');
  const [isLocating, setIsLocating] = useState(false);
  const [operationsNotifs, setOperationsNotifs] = useState([
    { id: 1, title: 'Camera 04 motion detected — Loading Bay', time: 'just now', type: 'alert', unread: true },
    { id: 2, title: 'Stream reconnected — North Gate feed', time: '4m ago', type: 'success', unread: true },
    { id: 3, title: 'Access request — J. Okoro (Operator)', time: '22m ago', type: 'info', unread: false },
    { id: 4, title: 'Report archive storage 82% full', time: '1h ago', type: 'alert', unread: false },
    { id: 5, title: 'Backup completed — 12,480 clips archived', time: '2h ago', type: 'success', unread: false },
    { id: 6, title: 'Firmware update available — 3 devices', time: '3h ago', type: 'info', unread: false },
    { id: 7, title: 'Camera 02 lens obstruction detected', time: '5h ago', type: 'error', unread: false },
    { id: 8, title: 'Nightly health check passed — all nodes', time: '6h ago', type: 'success', unread: false },
    { id: 9, title: 'New operator invited — M. Fernandez', time: '7h ago', type: 'info', unread: false },
  ]);

  // Orders Preview States
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderPage, setOrderPage] = useState(1);

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

        {/* PREVIEWING SCREEN SELECTOR CARD */}
        {showPreviewScreenCard && (
          <div className="previewing-screen-card" role="region" aria-label="Preview Screen Selector">
            <div className="previewing-screen-header">
              <span className="previewing-screen-title">PREVIEWING SCREEN</span>
              <button
                type="button"
                className="previewing-screen-close-btn"
                onClick={() => setShowPreviewScreenCard(false)}
                aria-label="Close preview screen selector"
                title="Close"
              >
                <X size={12} />
              </button>
            </div>
            <div className="previewing-screen-grid">
              {['Dashboard', 'Operations', 'Cameras', 'Reports', 'Orders', 'Components'].map((screen) => {
                const isSelected = previewScreen === screen;
                return (
                  <button
                    key={screen}
                    type="button"
                    className={`previewing-screen-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setPreviewScreen(screen);
                      if (screen === 'Components') {
                        setActiveNav('Typography');
                      } else {
                        setActiveNav('Cards');
                      }
                    }}
                  >
                    {screen}
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
                    <button
                      type="button"
                      className="sub-icon-btn"
                      title="Preview screen selector"
                      aria-label="Preview screen selector"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPreviewScreenCard((prev) => !prev);
                      }}
                    >
                      <Monitor size={13} className="sub-icon" />
                    </button>
                    <Info size={13} className="sub-icon" title="Component documentation" />
                    {isActive && <span className="chevron-up-icon" title="Active section">▲</span>}
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
            <div
              className="preview-tag clickable"
              onClick={() => setShowPreviewScreenCard((prev) => !prev)}
              title="Click to toggle preview screen selector"
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
            >
              <Monitor size={16} className="device-icon" />
              <span>{`Previewing ${previewScreen}`}</span>
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
          {(activeNav === 'Cards' || previewScreen !== 'Components') ? (() => {
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

            const chartData = [
              { month: 'Jan', revHeight: 38, profHeight: 24, revVal: '$38,200', profVal: '$24,100' },
              { month: 'Feb', revHeight: 54, profHeight: 36, revVal: '$54,500', profVal: '$36,200' },
              { month: 'Mar', revHeight: 42, profHeight: 28, revVal: '$42,000', profVal: '$28,300' },
              { month: 'Apr', revHeight: 56, profHeight: 42, revVal: '$56,800', profVal: '$42,500' },
              { month: 'May', revHeight: 52, profHeight: 38, revVal: '$52,300', profVal: '$38,400' },
              { month: 'Jun', revHeight: 54, profHeight: 40, revVal: '$54,100', profVal: '$40,600' },
            ];

            if (previewScreen === 'Operations') {
              const unreadNotifsCount = operationsNotifs.filter((n) => n.unread).length;

              return (
                <div className="operations-preview-canvas">
                  {/* Operations Center Header */}
                  <div className="operations-header-row">
                    <div className="dashboard-title-wrap">
                      <h1 className="dashboard-page-title">Operations Center</h1>
                      <button
                        type="button"
                        className="dashboard-info-btn"
                        title="Operations Center Overview · Live Surveillance & Security Feeds"
                        aria-label="Operations Center Information"
                      >
                        <Info size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Main Two-Column Layout */}
                  <div className="operations-main-grid">
                    {/* Live Map · Street View Card */}
                    <section
                      className="operations-card live-map-card"
                      style={cardSurfaceStyle}
                      aria-label="Live Map and Street View"
                    >
                      <div
                        className="dashboard-card-header"
                        style={{
                          backgroundColor: previewHeaderStyles.backgroundColor,
                          borderBottom: previewHeaderStyles.borderBottom,
                        }}
                      >
                        <h2 className="dashboard-card-title" style={{ color: previewHeaderStyles.color }}>
                          Live Map · Street View
                        </h2>
                        <div className="live-status-pill" title="Live Surveillance Telemetry Active">
                          <span className="live-pulsing-dot" />
                          <span className="live-status-text">LIVE</span>
                        </div>
                      </div>

                      <div className="live-map-card-body">
                        <div className="live-map-canvas-area">
                          {/* Location Badge */}
                          <div className={`map-location-badge ${isLocating ? 'locating-pulse' : ''}`}>
                            <Crosshair size={13} className="location-target-icon" />
                            <span>40.7128, -74.0060 · Manhattan</span>
                          </div>

                          {/* Center Treatment */}
                          <div className="map-center-watermark">
                            <span className="map-watermark-dot">●</span>
                            <span className="map-watermark-text">
                              {activeMapLayer === 'Satellite' ? 'SATELLITE ORBITAL / HYBRID EMBED' : 'GOOGLE STREET VIEW / EARTH EMBED'}
                            </span>
                          </div>

                          {/* Bottom Floating Map Controls Toolbar */}
                          <div className="map-controls-toolbar" role="toolbar" aria-label="Map Navigation Controls">
                            <div className="map-zoom-buttons">
                              <button
                                type="button"
                                className="map-control-btn zoom-btn primary"
                                onClick={() => setMapZoom((prev) => Math.min(prev + 10, 150))}
                                title="Zoom In"
                                aria-label="Zoom in"
                              >
                                <Plus size={13} strokeWidth={2.6} />
                              </button>
                              <button
                                type="button"
                                className="map-control-btn zoom-btn"
                                onClick={() => setMapZoom((prev) => Math.max(prev - 10, 50))}
                                title="Zoom Out"
                                aria-label="Zoom out"
                              >
                                <Minus size={13} strokeWidth={2.6} />
                              </button>
                            </div>

                            <div className="map-toolbar-divider" />

                            <button
                              type="button"
                              className={`map-control-btn layers-btn ${activeMapLayer === 'Satellite' ? 'active-layer' : ''}`}
                              onClick={() => setActiveMapLayer((prev) => (prev === 'Default' ? 'Satellite' : 'Default'))}
                              title="Toggle Map Layers"
                              aria-label="Toggle map layers"
                            >
                              <Layers size={13} />
                              <span>Layers</span>
                            </button>

                            <div className="map-toolbar-divider" />

                            <button
                              type="button"
                              className="map-control-btn locate-btn"
                              onClick={() => {
                                setIsLocating(true);
                                setTimeout(() => setIsLocating(false), 1200);
                              }}
                              title="Locate Manhattan Operations"
                              aria-label="Locate Manhattan Operations"
                            >
                              <Locate size={13} />
                              <span>Locate</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Notifications Card */}
                    <section
                      className="operations-card notifications-card"
                      style={cardSurfaceStyle}
                      aria-label="System Notifications"
                    >
                      <div
                        className="dashboard-card-header"
                        style={{
                          backgroundColor: previewHeaderStyles.backgroundColor,
                          borderBottom: previewHeaderStyles.borderBottom,
                        }}
                      >
                        <h2 className="dashboard-card-title" style={{ color: previewHeaderStyles.color }}>
                          Notifications
                        </h2>
                        {unreadNotifsCount > 0 && (
                          <span className="notifications-badge-pill">
                            {`${unreadNotifsCount} NEW`}
                          </span>
                        )}
                      </div>

                      <div className="notifications-card-body">
                        <div className="notifications-list" role="feed" aria-label="Operations alerts">
                          {operationsNotifs.map((item) => (
                            <div
                              key={item.id}
                              className={`notif-list-item ${item.unread ? 'is-unread' : ''}`}
                              onClick={() => {
                                setOperationsNotifs((prev) =>
                                  prev.map((n) => (n.id === item.id ? { ...n, unread: !n.unread } : n))
                                );
                              }}
                              role="article"
                              tabIndex={0}
                              title="Click to toggle read status"
                            >
                              <div className={`notif-icon-badge ${item.type}`}>
                                {item.type === 'alert' && <AlertTriangle size={13} strokeWidth={2.4} />}
                                {item.type === 'success' && <Check size={13} strokeWidth={2.6} />}
                                {item.type === 'info' && <Info size={13} strokeWidth={2.4} />}
                                {item.type === 'error' && <AlertCircle size={13} strokeWidth={2.4} />}
                              </div>

                              <div className="notif-text-col">
                                <span className="notif-title-line">{item.title}</span>
                                <span className="notif-time-line">{item.time}</span>
                              </div>

                              {item.unread && (
                                <span className="notif-unread-dot" title="Unread notification" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              );
            }

            if (previewScreen === 'Cameras') {
              const cameraFeeds = [
                { id: 'CAM 01', name: 'Main Lobby', status: 'online', recording: true, time: '14:32:08' },
                { id: 'CAM 02', name: 'North Gate', status: 'online', recording: true, time: '14:32:08' },
                { id: 'CAM 03', name: 'Loading Bay', status: 'online', recording: false, time: '14:32:07' },
                { id: 'CAM 04', name: 'Rooftop', status: 'online', recording: true, time: '14:32:08' },
                { id: 'CAM 05', name: 'Parking Deck', status: 'standby', recording: false, time: null },
                { id: 'CAM 06', name: 'Server Room', status: 'online', recording: true, time: '14:32:08' },
              ];

              const recentDetections = [
                { id: 1, title: 'Motion detected — Rooftop', meta: 'CAM 04 · just now', type: 'alert' },
                { id: 2, title: 'Person identified — North Gate', meta: 'CAM 02 · 6m ago', type: 'info' },
                { id: 3, title: 'Loitering cleared — Main Lobby', meta: 'CAM 01 · 22m ago', type: 'success' },
                { id: 4, title: 'Door forced — Server Room', meta: 'CAM 06 · 34m ago', type: 'alert' },
                { id: 5, title: 'Vehicle detected — Loading Bay', meta: 'CAM 03 · 48m ago', type: 'info' },
                { id: 6, title: 'Signal restored — Parking Deck', meta: 'CAM 05 · 1h ago', type: 'success' },
                { id: 7, title: 'Tailgating flagged — North Gate', meta: 'CAM 02 · 1h ago', type: 'alert' },
                { id: 8, title: 'Crowd density normal — Rooftop', meta: 'CAM 04 · 2h ago', type: 'success' },
                { id: 9, title: 'Object left behind — Main Lobby', meta: 'CAM 01 · 2h ago', type: 'info' },
              ];

              return (
                <div className="cameras-preview-canvas">
                  {/* 1. Header Row */}
                  <div className="cameras-header-row">
                    <div className="dashboard-title-wrap">
                      <h1 className="dashboard-page-title">Camera Surveillance</h1>
                      <button
                        type="button"
                        className="dashboard-info-btn"
                        title="Camera Surveillance System Overview & Live Feeds"
                        aria-label="Camera Surveillance Information"
                      >
                        <Info size={16} />
                      </button>
                    </div>

                    <div className="cameras-header-actions">
                      <div className="live-status-pill" title="Live Video Telemetry Active">
                        <span className="live-pulsing-dot" />
                        <span className="live-status-text">LIVE</span>
                      </div>

                      <button
                        type="button"
                        className="btn-add-camera"
                        title="Add Camera Feed"
                        aria-label="Add Camera"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                        <span>ADD CAMERA</span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Top Row: 4 KPI Cards */}
                  <div className="cameras-kpi-grid">
                    <div className="camera-kpi-card" style={cardSurfaceStyle}>
                      <span className="camera-kpi-label">CAMERAS ONLINE</span>
                      <span className="camera-kpi-val">5/6</span>
                    </div>
                    <div className="camera-kpi-card" style={cardSurfaceStyle}>
                      <span className="camera-kpi-label">RECORDING</span>
                      <span className="camera-kpi-val">4</span>
                    </div>
                    <div className="camera-kpi-card" style={cardSurfaceStyle}>
                      <span className="camera-kpi-label">MOTION ALERTS</span>
                      <span className="camera-kpi-val">2</span>
                    </div>
                    <div className="camera-kpi-card" style={cardSurfaceStyle}>
                      <span className="camera-kpi-label">STORAGE USED</span>
                      <span className="camera-kpi-val">82%</span>
                    </div>
                  </div>

                  {/* 3. Main Split Grid: Camera Wall (left) + Recent Detections (right) */}
                  <div className="cameras-main-grid">
                    {/* Left: Camera Wall */}
                    <section
                      className="camera-card camera-wall-card"
                      style={cardSurfaceStyle}
                      aria-label="Camera Wall Feeds"
                    >
                      <div
                        className="dashboard-card-header"
                        style={{
                          backgroundColor: previewHeaderStyles.backgroundColor,
                          borderBottom: previewHeaderStyles.borderBottom,
                        }}
                      >
                        <h2 className="dashboard-card-title" style={{ color: previewHeaderStyles.color }}>
                          Camera Wall
                        </h2>
                        <span className="camera-grid-meta" style={{ color: previewHeaderStyles.subtitleColor }}>
                          2 × 3 grid
                        </span>
                      </div>

                      <div className="camera-wall-body">
                        <div className="camera-feeds-grid">
                          {cameraFeeds.map((cam) => (
                            <div key={cam.id} className={`camera-feed-tile ${cam.status}`}>
                              {/* Top-left: Camera Name & Status pill */}
                              <div className="cam-tile-top-left">
                                <span className={`cam-status-dot ${cam.status}`} />
                                <span className="cam-id-label">{cam.id}</span>
                              </div>

                              {/* Top-right: REC badge if recording */}
                              {cam.recording && (
                                <div className="cam-rec-badge" title="Recording active">
                                  <span className="cam-rec-dot" />
                                  <span className="cam-rec-text">REC</span>
                                </div>
                              )}

                              {/* Center: Camera Location Watermark */}
                              <div className="cam-center-watermark">
                                <span>{cam.name}</span>
                              </div>

                              {/* Bottom-left: Timestamp */}
                              {cam.time && (
                                <div className="cam-timestamp">
                                  <span>{cam.time}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* Right: Recent Detections */}
                    <section
                      className="camera-card recent-detections-card"
                      style={cardSurfaceStyle}
                      aria-label="Recent Detections"
                    >
                      <div
                        className="dashboard-card-header"
                        style={{
                          backgroundColor: previewHeaderStyles.backgroundColor,
                          borderBottom: previewHeaderStyles.borderBottom,
                        }}
                      >
                        <h2 className="dashboard-card-title" style={{ color: previewHeaderStyles.color }}>
                          Recent Detections
                        </h2>
                      </div>

                      <div className="recent-detections-body">
                        <div className="detections-list" role="feed" aria-label="Camera detection events">
                          {recentDetections.map((item) => (
                            <div key={item.id} className="detection-row" role="article">
                              <div className={`detection-dot-badge ${item.type}`}>
                                <span className="detection-dot" />
                              </div>
                              <div className="detection-info">
                                <span className="detection-title">{item.title}</span>
                                <span className="detection-meta">{item.meta}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              );
            }

            if (previewScreen === 'Reports') {
              const trendData = [
                { month: 'Jan', rev: 44, prof: 22 },
                { month: 'Feb', rev: 68, prof: 32 },
                { month: 'Mar', rev: 54, prof: 26 },
                { month: 'Apr', rev: 78, prof: 36 },
                { month: 'May', rev: 70, prof: 34 },
                { month: 'Jun', rev: 72, prof: 34 },
              ];

              const moduleData = [
                { color: '#3B82F6', height: 52 },
                { color: '#06B6D4', height: 80 },
                { color: '#8B5CF6', height: 34 },
                { color: '#84CC16', height: 48 },
                { color: '#BE123C', height: 72 },
              ];

              const reportsTable = [
                { id: 1, name: 'Q2 Revenue Summary', type: 'Financial', status: 'Ready', date: 'Jun 20' },
                { id: 2, name: 'Camera Uptime Audit', type: 'Operations', status: 'Ready', date: 'Jun 19' },
                { id: 3, name: 'User Access Log', type: 'Security', status: 'Ready', date: 'Jun 18' },
                { id: 4, name: 'Inventory Forecast', type: 'Analytics', status: 'Processing', date: 'Jun 17' },
              ];

              return (
                <div className="reports-preview-canvas">
                  {/* 1. Header Row */}
                  <div className="reports-header-row">
                    <div className="dashboard-title-wrap">
                      <h1 className="dashboard-page-title">Reports</h1>
                      <button
                        type="button"
                        className="dashboard-info-btn"
                        title="Reports & Analytics Overview"
                        aria-label="Reports Information"
                      >
                        <Info size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn-export-pdf"
                      title="Export Comprehensive PDF Report"
                      aria-label="Export PDF"
                    >
                      <ArrowDown size={14} strokeWidth={2.5} />
                      <span>EXPORT PDF</span>
                    </button>
                  </div>

                  {/* 2. Top Row: 4 KPI Cards */}
                  <div className="reports-kpi-grid">
                    <div className="report-kpi-card" style={cardSurfaceStyle}>
                      <span className="report-kpi-label">REPORTS GENERATED</span>
                      <span className="report-kpi-val">248</span>
                    </div>
                    <div className="report-kpi-card" style={cardSurfaceStyle}>
                      <span className="report-kpi-label">AVG GENERATION</span>
                      <span className="report-kpi-val">1.2s</span>
                    </div>
                    <div className="report-kpi-card" style={cardSurfaceStyle}>
                      <span className="report-kpi-label">DATA POINTS</span>
                      <span className="report-kpi-val">84.2K</span>
                    </div>
                    <div className="report-kpi-card" style={cardSurfaceStyle}>
                      <span className="report-kpi-label">SCHEDULED</span>
                      <span className="report-kpi-val">12</span>
                    </div>
                  </div>

                  {/* 3. Middle Row: Two Charts */}
                  <div className="reports-charts-grid">
                    {/* Left: Revenue & Profit Trend */}
                    <section
                      className="reports-card trend-chart-card"
                      style={cardSurfaceStyle}
                      aria-label="Revenue and Profit Trend Chart"
                    >
                      <div
                        className="dashboard-card-header"
                        style={{
                          backgroundColor: previewHeaderStyles.backgroundColor,
                          borderBottom: previewHeaderStyles.borderBottom,
                        }}
                      >
                        <h2 className="dashboard-card-title" style={{ color: previewHeaderStyles.color }}>
                          Revenue & Profit Trend
                        </h2>
                        <span className="reports-card-meta" style={{ color: previewHeaderStyles.subtitleColor }}>
                          6 months
                        </span>
                      </div>

                      <div className="trend-chart-body">
                        <div className="trend-bars-container">
                          {trendData.map((item, idx) => (
                            <div key={idx} className="trend-bar-group">
                              <div className="trend-bar-track">
                                <div className="trend-bar-column">
                                  <div
                                    className="trend-seg-profit"
                                    style={{ height: `${item.prof}px` }}
                                    title={`Profit: ${item.prof * 1000}`}
                                  />
                                  <div
                                    className="trend-seg-revenue"
                                    style={{ height: `${item.rev}px` }}
                                    title={`Revenue: ${item.rev * 1000}`}
                                  />
                                </div>
                              </div>
                              <span className="trend-month-label">{item.month}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* Right: By Module */}
                    <section
                      className="reports-card module-chart-card"
                      style={cardSurfaceStyle}
                      aria-label="By Module Distribution Chart"
                    >
                      <div
                        className="dashboard-card-header"
                        style={{
                          backgroundColor: previewHeaderStyles.backgroundColor,
                          borderBottom: previewHeaderStyles.borderBottom,
                        }}
                      >
                        <h2 className="dashboard-card-title" style={{ color: previewHeaderStyles.color }}>
                          By Module
                        </h2>
                      </div>

                      <div className="module-chart-body">
                        <div className="module-bars-container">
                          {moduleData.map((bar, idx) => (
                            <div
                              key={idx}
                              className="module-bar"
                              style={{
                                height: `${bar.height}%`,
                                backgroundColor: bar.color,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* 4. Bottom Row: Recent Reports Table */}
                  <section
                    className="reports-card reports-table-card"
                    style={cardSurfaceStyle}
                    aria-label="Recent Reports Table"
                  >
                    <div
                      className="dashboard-card-header"
                      style={{
                        backgroundColor: previewHeaderStyles.backgroundColor,
                        borderBottom: previewHeaderStyles.borderBottom,
                      }}
                    >
                      <h2 className="dashboard-card-title" style={{ color: previewHeaderStyles.color }}>
                        Recent Reports
                      </h2>
                    </div>

                    <div className="reports-table-body">
                      <table className="reports-data-table">
                        <thead>
                          <tr>
                            <th className="th-report">REPORT</th>
                            <th className="th-type">TYPE</th>
                            <th className="th-status">STATUS</th>
                            <th className="th-date">DATE</th>
                            <th className="th-action"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportsTable.map((row) => (
                            <tr key={row.id} className="reports-table-row">
                              <td className="td-report-name">{row.name}</td>
                              <td className="td-type">{row.type}</td>
                              <td className="td-status">
                                <span className={`report-status-pill ${row.status.toLowerCase()}`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="td-date">{row.date}</td>
                              <td className="td-action">
                                <button
                                  type="button"
                                  className="btn-pdf-download"
                                  title={`Download ${row.name} as PDF`}
                                  aria-label={`Download ${row.name} PDF`}
                                >
                                  <ArrowDown size={11} strokeWidth={2.4} />
                                  <span>PDF</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              );
            }

            if (previewScreen === 'Orders') {
              const ordersList = [
                { id: 'ORD-1042', customer: 'Acme Corporation', status: 'Delivered', amount: '$12,400', date: 'Jun 18' },
                { id: 'ORD-1041', customer: 'Globex Ltd', status: 'Processing', amount: '$8,750', date: 'Jun 17' },
                { id: 'ORD-1040', customer: 'Initech', status: 'Pending', amount: '$5,200', date: 'Jun 16' },
                { id: 'ORD-1039', customer: 'Umbrella Co', status: 'Shipped', amount: '$22,100', date: 'Jun 15' },
                { id: 'ORD-1038', customer: 'Waystar Royco', status: 'Delivered', amount: '$9,800', date: 'Jun 14' },
                { id: 'ORD-1037', customer: 'Stark Industries', status: 'Processing', amount: '$31,500', date: 'Jun 13' },
                { id: 'ORD-1036', customer: 'Wayne Enterprises', status: 'Delivered', amount: '$18,240', date: 'Jun 12' },
                { id: 'ORD-1035', customer: 'Soylent Corp', status: 'Pending', amount: '$4,120', date: 'Jun 11' },
                { id: 'ORD-1034', customer: 'Hooli Inc', status: 'Shipped', amount: '$27,900', date: 'Jun 10' },
                { id: 'ORD-1033', customer: 'Cyberdyne Systems', status: 'Delivered', amount: '$14,650', date: 'Jun 09' },
                { id: 'ORD-1032', customer: 'Massive Dynamic', status: 'Processing', amount: '$10,300', date: 'Jun 08' },
                { id: 'ORD-1031', customer: 'Tyrell Corp', status: 'Delivered', amount: '$16,780', date: 'Jun 07' },
              ];

              const filteredOrders = ordersList.filter((ord) => {
                const matchesFilter = orderStatusFilter === 'All' || ord.status === orderStatusFilter;
                const matchesSearch =
                  ord.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                  ord.customer.toLowerCase().includes(orderSearch.toLowerCase());
                return matchesFilter && matchesSearch;
              });

              return (
                <div className="orders-preview-canvas">
                  {/* 1. Header Row */}
                  <div className="orders-header-row">
                    <div className="dashboard-title-wrap">
                      <h1 className="dashboard-page-title">Orders</h1>
                      <button
                        type="button"
                        className="dashboard-info-btn"
                        title="Orders & Transaction Overview"
                        aria-label="Orders Information"
                      >
                        <Info size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn-new-order"
                      title="Create New Order Record"
                      aria-label="New Order"
                    >
                      <Plus size={14} strokeWidth={2.5} />
                      <span>NEW ORDER</span>
                    </button>
                  </div>

                  {/* 2. Main Parent Orders Card */}
                  <section
                    className="orders-card"
                    style={cardSurfaceStyle}
                    aria-label="Orders Management Table"
                  >
                    {/* Search & Status Filters Bar */}
                    <div className="orders-toolbar-row">
                      <div className="orders-search-wrap">
                        <Search size={14} className="orders-search-icon" />
                        <input
                          type="text"
                          className="orders-search-input"
                          placeholder="Search orders..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          aria-label="Search orders"
                        />
                      </div>

                      <div className="orders-filter-pills" role="radiogroup" aria-label="Order status filter">
                        {['All', 'Delivered', 'Processing', 'Pending'].map((filter) => {
                          const isActive = orderStatusFilter === filter;
                          return (
                            <button
                              key={filter}
                              type="button"
                              className={`order-filter-pill ${isActive ? 'active' : ''}`}
                              onClick={() => setOrderStatusFilter(filter)}
                              aria-checked={isActive}
                              role="radio"
                            >
                              {filter}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Table Container */}
                    <div className="orders-table-body">
                      <table className="orders-data-table">
                        <thead>
                          <tr>
                            <th className="th-order-id">ORDER ID</th>
                            <th className="th-customer">CUSTOMER</th>
                            <th className="th-order-status">STATUS</th>
                            <th className="th-amount">AMOUNT</th>
                            <th className="th-order-date">DATE</th>
                            <th className="th-order-action"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.map((ord) => (
                            <tr key={ord.id} className="orders-table-row">
                              <td className="td-order-id">
                                <span className="order-id-link">{ord.id}</span>
                              </td>
                              <td className="td-customer">{ord.customer}</td>
                              <td className="td-order-status">
                                <span className={`order-status-pill ${ord.status.toLowerCase()}`}>
                                  {ord.status}
                                </span>
                              </td>
                              <td className="td-amount">{ord.amount}</td>
                              <td className="td-order-date">{ord.date}</td>
                              <td className="td-order-action">
                                <button
                                  type="button"
                                  className="btn-order-view"
                                  title={`View order details for ${ord.id}`}
                                  aria-label={`View order ${ord.id}`}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Footer / Pagination */}
                    <div className="orders-table-footer">
                      <span className="orders-pagination-info">Showing 1–12 of 1,284</span>

                      <div className="orders-pagination-controls" aria-label="Pagination">
                        <button
                          type="button"
                          className="btn-page-nav"
                          disabled={orderPage === 1}
                          onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                          aria-label="Previous page"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <button
                          type="button"
                          className={`btn-page-num ${orderPage === 1 ? 'active' : ''}`}
                          onClick={() => setOrderPage(1)}
                        >
                          1
                        </button>
                        <button
                          type="button"
                          className={`btn-page-num ${orderPage === 2 ? 'active' : ''}`}
                          onClick={() => setOrderPage(2)}
                        >
                          2
                        </button>
                        <button
                          type="button"
                          className="btn-page-nav"
                          disabled={orderPage === 2}
                          onClick={() => setOrderPage((p) => Math.min(2, p + 1))}
                          aria-label="Next page"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              );
            }

            if (previewScreen !== 'Dashboard') {
              return (
                <div className="dashboard-preview-canvas">
                  <div className="dashboard-header-row">
                    <div className="dashboard-title-wrap">
                      <h1 className="dashboard-page-title">{previewScreen}</h1>
                      <button
                        type="button"
                        className="dashboard-info-btn"
                        title={`${previewScreen} Preview`}
                        aria-label={`${previewScreen} Information`}
                      >
                        <Info size={16} />
                      </button>
                    </div>
                  </div>
                  <section className="dashboard-card" style={cardSurfaceStyle}>
                    <div
                      className="dashboard-card-header"
                      style={{
                        backgroundColor: previewHeaderStyles.backgroundColor,
                        borderBottom: previewHeaderStyles.borderBottom,
                      }}
                    >
                      <h2 className="dashboard-card-title" style={{ color: previewHeaderStyles.color }}>
                        {`${previewScreen} Overview`}
                      </h2>
                      <span className="dashboard-card-meta" style={{ color: previewHeaderStyles.subtitleColor }}>
                        Live System
                      </span>
                    </div>
                    <div
                      className="dashboard-card-body"
                      style={{
                        minHeight: '400px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          ...previewNestedStyles,
                          padding: '24px 32px',
                          borderRadius: '12px',
                          textAlign: 'center',
                          maxWidth: '440px',
                        }}
                      >
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                          {`${previewScreen} Module`}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                          Previewing active layout for {previewScreen}. Switch to <strong>Operations</strong> or <strong>Dashboard</strong> to view full live systems.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              );
            }

            return (
              <div className="dashboard-preview-canvas">
                {/* 1. Dashboard Header */}
                <div className="dashboard-header-row">
                  <div className="dashboard-title-wrap">
                    <h1 className="dashboard-page-title">{previewScreen === 'Components' ? 'Dashboard' : previewScreen}</h1>
                    <button
                      type="button"
                      className="dashboard-info-btn"
                      title={`${previewScreen} Overview & Key Performance Metrics`}
                      aria-label="Dashboard Information"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="dashboard-new-action-btn"
                    aria-label="Create New Record"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    <span>NEW</span>
                  </button>
                </div>

                {/* 2. Performance Overview (Large Parent Card) */}
                <section
                  className="dashboard-card perf-overview-card"
                  style={cardSurfaceStyle}
                  aria-label="Performance Overview"
                >
                  <div
                    className="dashboard-card-header"
                    style={{
                      backgroundColor: previewHeaderStyles.backgroundColor,
                      borderBottom: previewHeaderStyles.borderBottom,
                    }}
                  >
                    <h2 className="dashboard-card-title" style={{ color: previewHeaderStyles.color }}>
                      Performance Overview
                    </h2>
                    <span className="dashboard-card-meta" style={{ color: previewHeaderStyles.subtitleColor }}>
                      This month
                    </span>
                  </div>

                  <div className="dashboard-card-body perf-overview-body">
                    <div className="perf-kpi-grid">
                      {/* KPI 1: Revenue */}
                      <div
                        className="perf-kpi-card"
                        style={{
                          ...previewNestedStyles,
                          borderRadius: '10px',
                        }}
                      >
                        <span className="kpi-label">REVENUE</span>
                        <span className="kpi-value">$2.41M</span>
                        <div className="kpi-trend-pill positive">
                          <span className="trend-arrow">▲</span>
                          <span>+12.5%</span>
                        </div>
                      </div>

                      {/* KPI 2: Open Orders */}
                      <div
                        className="perf-kpi-card"
                        style={{
                          ...previewNestedStyles,
                          borderRadius: '10px',
                        }}
                      >
                        <span className="kpi-label">OPEN ORDERS</span>
                        <span className="kpi-value">1,284</span>
                        <div className="kpi-trend-pill positive">
                          <span className="trend-arrow">▲</span>
                          <span>+3.2%</span>
                        </div>
                      </div>

                      {/* KPI 3: Inventory */}
                      <div
                        className="perf-kpi-card"
                        style={{
                          ...previewNestedStyles,
                          borderRadius: '10px',
                        }}
                      >
                        <span className="kpi-label">INVENTORY</span>
                        <span className="kpi-value">8,540</span>
                        <div className="kpi-trend-pill negative">
                          <span className="trend-arrow">▼</span>
                          <span>-1.8%</span>
                        </div>
                      </div>

                      {/* KPI 4: Active Users */}
                      <div
                        className="perf-kpi-card"
                        style={{
                          ...previewNestedStyles,
                          borderRadius: '10px',
                        }}
                      >
                        <span className="kpi-label">ACTIVE USERS</span>
                        <span className="kpi-value">342</span>
                        <div className="kpi-trend-pill positive">
                          <span className="trend-arrow">▲</span>
                          <span>+5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3 & 4. Lower Two-Column Section: Revenue Trend & Recent Activity */}
                <div className="dashboard-lower-grid">
                  {/* Revenue Trend Card */}
                  <section
                    className="dashboard-card revenue-trend-card"
                    style={cardSurfaceStyle}
                    aria-label="Revenue Trend"
                  >
                    <div
                      className="dashboard-card-header"
                      style={{
                        backgroundColor: previewHeaderStyles.backgroundColor,
                        borderBottom: previewHeaderStyles.borderBottom,
                      }}
                    >
                      <h2 className="dashboard-card-title" style={{ color: previewHeaderStyles.color }}>
                        Revenue Trend
                      </h2>
                      <div className="chart-legend">
                        <div className="legend-item">
                          <span className="legend-box legend-box-revenue" />
                          <span className="legend-text" style={{ color: previewHeaderStyles.subtitleColor }}>
                            Revenue
                          </span>
                        </div>
                        <div className="legend-item">
                          <span className="legend-box legend-box-profit" />
                          <span className="legend-text" style={{ color: previewHeaderStyles.subtitleColor }}>
                            Profit
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="dashboard-card-body revenue-trend-body">
                      <div className="bar-chart-container">
                        {/* Horizontal guide lines */}
                        <div className="chart-grid-guides" aria-hidden="true">
                          <div className="chart-guide-line" style={{ bottom: '75%' }} />
                          <div className="chart-guide-line" style={{ bottom: '50%' }} />
                          <div className="chart-guide-line" style={{ bottom: '25%' }} />
                          <div className="chart-guide-line" style={{ bottom: '0%' }} />
                        </div>

                        {/* Stacked bar chart columns */}
                        <div className="chart-bars-row">
                          {chartData.map((item, idx) => {
                            const totalHeight = Math.min(100, item.revHeight + item.profHeight);
                            const profitPercentOfBar = (item.profHeight / (item.revHeight + item.profHeight)) * 100;
                            const revPercentOfBar = 100 - profitPercentOfBar;

                            return (
                              <div
                                key={item.month}
                                className="chart-bar-group"
                                onMouseEnter={() => setHoveredBarIndex(idx)}
                                onMouseLeave={() => setHoveredBarIndex(null)}
                              >
                                <div className="chart-bar-track">
                                  <div
                                    className="chart-bar-column"
                                    style={{ height: `${totalHeight}%` }}
                                  >
                                    <div
                                      className="bar-seg-profit"
                                      style={{ height: `${profitPercentOfBar}%` }}
                                      title={`${item.month} Profit: ${item.profVal}`}
                                    />
                                    <div
                                      className="bar-seg-revenue"
                                      style={{ height: `${revPercentOfBar}%` }}
                                      title={`${item.month} Revenue: ${item.revVal}`}
                                    />
                                  </div>

                                  {hoveredBarIndex === idx && (
                                    <div className="chart-bar-tooltip">
                                      <span className="tooltip-month">{item.month}</span>
                                      <span className="tooltip-line profit">Profit: {item.profVal}</span>
                                      <span className="tooltip-line revenue">Revenue: {item.revVal}</span>
                                    </div>
                                  )}
                                </div>
                                <span className="chart-month-label">{item.month}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Recent Activity Card */}
                  <section
                    className="dashboard-card recent-activity-card"
                    style={cardSurfaceStyle}
                    aria-label="Recent Activity"
                  >
                    <div
                      className="dashboard-card-header"
                      style={{
                        backgroundColor: previewHeaderStyles.backgroundColor,
                        borderBottom: previewHeaderStyles.borderBottom,
                      }}
                    >
                      <h2 className="dashboard-card-title" style={{ color: previewHeaderStyles.color }}>
                        Recent Activity
                      </h2>
                    </div>

                    <div className="dashboard-card-body recent-activity-body">
                      <ul className="activity-list">
                        <li className="activity-item">
                          <div className="activity-icon-badge success" aria-hidden="true">
                            <Check size={13} strokeWidth={2.5} />
                          </div>
                          <div className="activity-details">
                            <span className="activity-text">Order ORD-1042 delivered to Acme Corp</span>
                            <span className="activity-time">2m ago</span>
                          </div>
                        </li>

                        <li className="activity-item">
                          <div className="activity-icon-badge primary" aria-hidden="true">
                            <DollarSign size={13} strokeWidth={2.5} />
                          </div>
                          <div className="activity-details">
                            <span className="activity-text">Invoice #4821 paid — $12,400</span>
                            <span className="activity-time">18m ago</span>
                          </div>
                        </li>

                        <li className="activity-item">
                          <div className="activity-icon-badge warning" aria-hidden="true">
                            <AlertCircle size={13} strokeWidth={2.5} />
                          </div>
                          <div className="activity-details">
                            <span className="activity-text">Low stock alert: Widget Pro (12 left)</span>
                            <span className="activity-time">1h ago</span>
                          </div>
                        </li>

                        <li className="activity-item">
                          <div className="activity-icon-badge info" aria-hidden="true">
                            <Plus size={13} strokeWidth={2.5} />
                          </div>
                          <div className="activity-details">
                            <span className="activity-text">New customer onboarded: Globex Ltd</span>
                            <span className="activity-time">3h ago</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </section>
                </div>

                {/* 5. Low Stock Alert Toast */}
                {showLowStockToast && (
                  <div className="dashboard-toast-container" role="status" aria-live="polite">
                    <div className="dashboard-toast-card">
                      <div className="toast-icon-badge" aria-hidden="true">
                        <AlertCircle size={15} strokeWidth={2.5} />
                      </div>
                      <div className="toast-body">
                        <div className="toast-head-row">
                          <span className="toast-title">Low stock alert</span>
                          <button
                            type="button"
                            className="toast-dismiss-btn"
                            onClick={() => setShowLowStockToast(false)}
                            aria-label="Dismiss low stock alert"
                            title="Dismiss alert"
                          >
                            <X size={13} />
                          </button>
                        </div>
                        <p className="toast-desc">Widget Pro is down to 12 units left.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })() : (
            <>
              {/* Page Title & Context Header */}
              <div className="page-title-row">
                <h1 className="page-title">
                  <span>Component Library</span>
                  <Info
                    size={16}
                    className="info-icon"
                    title="Design System Component Showcase"
                  />
                </h1>
                <span className="badge-counter">
                  {`Active: ${THEME_PRESETS[activePreset].name} (${isDarkMode ? 'Dark' : 'Light'})`}
                </span>
              </div>

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
        </>
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
