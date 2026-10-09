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
  ChevronRight,
  ClipboardCheck,
  Clock,
  Activity,
  Camera,
  Video,
  Disc,
  HardDrive,
  Users,
  BarChart2,
  Calendar,
  CalendarCheck,
  Package,
  Shield,
  ArrowRight
} from 'lucide-react';
import oomnieyeLogo from './assets/oomnieye-logo.png';
import allcadLogo from './assets/allcad-logo.png';
import camLobbyImg from './assets/cctv-cam01-lobby.jpg';
import camNorthGateImg from './assets/cctv-cam02-northgate.jpg';
import camLoadingBayImg from './assets/cctv-cam03-loadingbay.jpg';
import camRooftopImg from './assets/cctv-cam04-rooftop.jpg';
import camParkingDeckImg from './assets/cctv-cam05-parkingdeck.jpg';
import camServerRoomImg from './assets/cctv-cam06-serverroom.jpg';
import manhattanSatelliteImg from './assets/manhattan-satellite.jpg';
import manhattanStreetsImg from './assets/manhattan-streets.jpg';
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

/**
 * Approved KPI Summary Card Component
 * Follows Reference Image 2 pixel-for-pixel:
 * - Centered layout
 * - Lightly colored squircle icon container
 * - Large prominent metric value
 * - Small readable label positioned consistently below the value
 * - Action link / trend indicator below label
 * - Active state with brand accent border
 */
function KpiSummaryCard({
  icon: Icon,
  accent = 'blue',
  value,
  label,
  actionText,
  onActionClick,
  trend,
  trendPositive,
  isActive = false,
  onClick,
  style = {},
}) {
  return (
    <div
      className={`app-kpi-summary-card accent-${accent} ${isActive ? 'is-active' : ''}`}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={`kpi-icon-container accent-${accent}`}>
        {Icon && <Icon size={18} strokeWidth={2.4} />}
      </div>
      <span className={`kpi-metric-val ${isActive ? 'active-metric' : ''}`}>
        {value}
      </span>
      <span className="kpi-metric-label">{label}</span>
      {actionText && (
        <span
          className="kpi-action-link"
          onClick={(e) => {
            if (onActionClick) {
              e.stopPropagation();
              onActionClick();
            }
          }}
        >
          {actionText} <ArrowRight size={12} strokeWidth={2.5} />
        </span>
      )}
      {trend && (
        <div className={`kpi-trend-pill ${trendPositive ? 'positive' : 'negative'}`}>
          <span className="trend-arrow">{trendPositive ? '▲' : '▼'}</span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
}

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

  // Live Surveillance Feed Clock
  const [liveCctvTime, setLiveCctvTime] = useState(() => {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setLiveCctvTime(d.toTimeString().split(' ')[0]);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // CCTV Surveillance Active Selected Camera State
  const [selectedCamId, setSelectedCamId] = useState('CAM 02');

  // Operations Center Preview States
  const [mapZoom, setMapZoom] = useState(100);
  const [activeMapLayer, setActiveMapLayer] = useState('Default');
  const [isLocating, setIsLocating] = useState(false);
  const [operationsNotifs, setOperationsNotifs] = useState([
    {
      id: 1,
      actor: 'Alena King and Thomas Partey',
      action: 'commented in',
      target: '',
      time: 'Just now',
      type: 'comment',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      actor: 'Maria Joyce',
      action: 'mentioned you in',
      target: 'Pixel Pulse · Team Acti...',
      time: 'Apr 02',
      type: 'mention',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      actor: 'Priya Nair',
      action: 'mentioned you in',
      target: 'Q3 Roadmap · Team A...',
      time: 'Mar 28',
      type: 'mention',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      actor: 'Daniel Ruiz',
      action: 'commented in',
      target: 'Release Notes v2.4 · Team...',
      time: 'Mar 23',
      type: 'comment',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      actor: 'Sarah Chen',
      action: 'mentioned you in',
      target: 'Incident Log #402 · Ops...',
      time: 'Mar 19',
      type: 'mention',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      actor: 'Marcus Vance',
      action: 'commented in',
      target: 'Perimeter Patrol Logs · Sec...',
      time: 'Mar 14',
      type: 'comment',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
  ]);

  const [cameraDetections, setCameraDetections] = useState([
    {
      id: 1,
      actor: 'Alena King & Sensor AI',
      action: 'flagged motion in',
      target: 'CAM 04 Rooftop · Perimeter',
      time: 'Just now',
      type: 'alert',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      actor: 'Maria Joyce',
      action: 'verified vehicle in',
      target: 'CAM 02 North Gate · Entry Gate',
      time: '6m ago',
      type: 'info',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      actor: 'Priya Nair',
      action: 'cleared loitering in',
      target: 'CAM 01 Main Lobby · Reception',
      time: '22m ago',
      type: 'success',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 4,
      actor: 'Daniel Ruiz',
      action: 'reported door forced in',
      target: 'CAM 06 Server Room · Rack 12',
      time: '34m ago',
      type: 'alert',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 5,
      actor: 'Sarah Chen',
      action: 'logged forklift in',
      target: 'CAM 03 Loading Bay · Dock 4',
      time: '48m ago',
      type: 'info',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 6,
      actor: 'Marcus Vance',
      action: 'restored signal in',
      target: 'CAM 05 Parking Deck · Deck 2',
      time: '1h ago',
      type: 'success',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 7,
      actor: 'Alex Mercer',
      action: 'flagged tailgating in',
      target: 'CAM 02 North Gate · Turnstile',
      time: '1h ago',
      type: 'alert',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 8,
      actor: 'Elena Rostova',
      action: 'confirmed crowd clear in',
      target: 'CAM 04 Rooftop · Heli-pad',
      time: '2h ago',
      type: 'success',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
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
    { id: 'Theme Settings', label: 'Theme Settings', icon: Sliders, tooltip: 'Configure global theme and appearance settings.' },
    { id: 'Colour Settings', label: 'Colour Settings', icon: Palette, active: true, tooltip: 'Configure brand, text, and status color tokens.' },
    { id: 'Typography', label: 'Typography', icon: Type, tooltip: 'Adjust typography styles used across the interface.' },
    { id: 'Cards', label: 'Cards', icon: Square, tooltip: 'Customize the appearance and styling of dashboard cards.' },
    { id: 'Tables', label: 'Tables', icon: Table, tooltip: 'Configure table data display and formatting styles.' },
    { id: 'Surface & Shape', label: 'Surface & Shape', icon: Layers, tooltip: 'Manage surface elevations, borders, and corner radiuses.' },
    { id: 'Notifications', label: 'Notifications', icon: Bell, tooltip: 'Customize notification banners and toast alerts.' },
    { id: 'Login Screen', label: 'Login Screen', icon: LogIn, tooltip: 'Configure login layout and authentication styling.' },
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
                    <span
                      className="app-tooltip-wrap"
                      data-tooltip={item.tooltip}
                      data-tooltip-pos="left"
                    >
                      <Info size={13} className="sub-icon" />
                    </span>
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
                            <span
                              className="app-tooltip-wrap"
                              data-tooltip="Primary UI brand color used for key actions and active states."
                              data-tooltip-pos="top"
                            >
                              <Info size={11} className="help-icon" />
                            </span>
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
                            <span
                              className="app-tooltip-wrap"
                              data-tooltip="Secondary brand color used for accents and visual balance."
                              data-tooltip-pos="top"
                            >
                              <Info size={11} className="help-icon" />
                            </span>
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
                            <span
                              className="app-tooltip-wrap"
                              data-tooltip="Vibrant highlight color for badges and emphasis."
                              data-tooltip-pos="top"
                            >
                              <Info size={11} className="help-icon" />
                            </span>
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
                            <span
                              className="app-tooltip-wrap"
                              data-tooltip="Semantic status colors representing success, warning, info, and error states."
                              data-tooltip-pos="top"
                            >
                              <Info size={11} className="help-icon" />
                            </span>
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
                            <span
                              className="app-tooltip-wrap"
                              data-tooltip="Surface background tokens for page, cards, and elevated containers."
                              data-tooltip-pos="top"
                            >
                              <Info size={11} className="help-icon" />
                            </span>
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
                          <span
                            className="app-tooltip-wrap"
                            data-tooltip="Text hierarchy colors for primary, secondary, tertiary, and disabled copy."
                            data-tooltip-pos="top"
                          >
                            <Info size={11} className="help-icon" />
                          </span>
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
                              Shadow depth{' '}
                              <span
                                className="app-tooltip-wrap"
                                data-tooltip="Adjust card elevation and drop-shadow spread intensity."
                                data-tooltip-pos="top"
                              >
                                <Info size={11} className="help-icon" />
                              </span>
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
                              Header strength{' '}
                              <span
                                className="app-tooltip-wrap"
                                data-tooltip="Adjust card header background opacity and contrast."
                                data-tooltip-pos="top"
                              >
                                <Info size={11} className="help-icon" />
                              </span>
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
                              Nested depth{' '}
                              <span
                                className="app-tooltip-wrap"
                                data-tooltip="Adjust nested container inset or elevation depth."
                                data-tooltip-pos="top"
                              >
                                <Info size={11} className="help-icon" />
                              </span>
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
                              Tint intensity{' '}
                              <span
                                className="app-tooltip-wrap"
                                data-tooltip="Adjust theme color tint intensity across card surfaces."
                                data-tooltip-pos="top"
                              >
                                <Info size={11} className="help-icon" />
                              </span>
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
                        className="dashboard-info-btn app-tooltip-wrap"
                        data-tooltip="Monitor live operations, alerts, and system activity."
                        data-tooltip-pos="bottom"
                        aria-label="Operations Center Information"
                      >
                        <Info size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Operations Telemetry KPI Summary Cards Row (Approved Card UI) */}
                  <div className="operations-kpi-grid">
                    <KpiSummaryCard
                      icon={Shield}
                      accent="blue"
                      value="18"
                      label="Active Dispatches"
                      style={cardSurfaceStyle}
                    />
                    <KpiSummaryCard
                      icon={Clock}
                      accent="yellow"
                      value="3.4m"
                      label="Avg Response Time"
                      style={cardSurfaceStyle}
                    />
                    <KpiSummaryCard
                      icon={AlertTriangle}
                      accent="cyan"
                      value={unreadNotifsCount.toString()}
                      label="Pending Alerts"
                      style={cardSurfaceStyle}
                    />
                    <KpiSummaryCard
                      icon={Activity}
                      accent="green"
                      value="99.8%"
                      label="Network Uptime"
                      style={cardSurfaceStyle}
                    />
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
                          {/* 1. Interactive Zoomable Map Viewport */}
                          <div
                            className={`map-interactive-viewport ${activeMapLayer === 'Satellite' ? 'layer-satellite' : 'layer-streets'}`}
                            style={{
                              transform: `scale(${mapZoom / 100})`,
                              transformOrigin: 'center center',
                            }}
                          >
                            {/* Realistic Base Map Layer */}
                            <img
                              src={activeMapLayer === 'Satellite' ? manhattanSatelliteImg : manhattanStreetsImg}
                              alt="Manhattan Operations Map"
                              className="map-base-layer-img"
                            />

                            {/* Theme Tone Overlay */}
                            <div className="map-theme-tint-overlay" />

                            {/* Geographic Street & Landmark Labels */}
                            <div className="map-labels-layer" aria-hidden="true">
                              <span className="map-geo-label water hudson">HUDSON RIVER</span>
                              <span className="map-geo-label water east">EAST RIVER</span>
                              <span className="map-geo-label road broadway">BROADWAY</span>
                              <span className="map-geo-label road fdr">FDR DRIVE</span>
                              <span className="map-geo-label road west-st">WEST ST</span>
                              <span className="map-geo-label landmark wtc">ONE WORLD TRADE</span>
                              <span className="map-geo-label landmark battery">BATTERY PARK</span>
                              <span className="map-geo-label landmark brooklyn-br">BROOKLYN BRIDGE</span>
                            </div>

                            {/* Operational Route / Path SVG Layer */}
                            <svg className="map-routes-svg" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
                              <defs>
                                <linearGradient id="opRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.85" />
                                  <stop offset="100%" stopColor="var(--brand-highlight, #38BDF8)" stopOpacity="0.95" />
                                </linearGradient>
                              </defs>

                              {/* Route background halo */}
                              <path
                                d="M 310 215 L 340 310 L 380 348 L 460 370 L 640 360"
                                fill="none"
                                stroke="var(--brand-primary)"
                                strokeWidth="6"
                                strokeOpacity="0.22"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              {/* Glowing Animated Dash Route */}
                              <path
                                className="map-animated-route-line"
                                d="M 310 215 L 340 310 L 380 348 L 460 370 L 640 360"
                                fill="none"
                                stroke="url(#opRouteGrad)"
                                strokeWidth="3"
                                strokeDasharray="8 6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              {/* Secondary feeder connecting path */}
                              <path
                                d="M 540 168 L 460 370"
                                fill="none"
                                stroke="var(--brand-secondary, #25C6E8)"
                                strokeWidth="2.5"
                                strokeDasharray="5 5"
                                strokeOpacity="0.75"
                                strokeLinecap="round"
                              />
                            </svg>

                            {/* Operational Marker 1 (Primary Location Marker: 40.7128, -74.0060) */}
                            <div
                              className={`map-op-marker primary-hq ${isLocating ? 'locating-focus' : ''}`}
                              style={{ left: '38%', top: '58%' }}
                              title="HQ · Operations Base (40.7128, -74.0060)"
                            >
                              <div className="marker-beacon-rings">
                                <span className="beacon-ring ring-1" />
                                <span className="beacon-ring ring-2" />
                                <span className="beacon-center-dot" />
                              </div>
                              <div className="marker-callout-pill primary">
                                <span className="marker-title">HQ · Operations Base</span>
                                <span className="marker-coord">40.7128, -74.0060</span>
                              </div>
                            </div>

                            {/* Operational Marker 2: North Gate */}
                            <div
                              className="map-op-marker secondary-gate"
                              style={{ left: '31%', top: '36%' }}
                              title="North Gate Checkpoint"
                            >
                              <div className="marker-dot-badge green">
                                <span className="marker-dot-inner" />
                              </div>
                              <div className="marker-callout-pill">
                                <span className="marker-title">Station 02 · North Gate</span>
                              </div>
                            </div>

                            {/* Operational Marker 3: Terminal Pier 17 */}
                            <div
                              className="map-op-marker secondary-dock"
                              style={{ left: '64%', top: '60%' }}
                              title="Terminal Bay · Loading Pier"
                            >
                              <div className="marker-dot-badge amber">
                                <span className="marker-dot-inner" />
                              </div>
                              <div className="marker-callout-pill">
                                <span className="marker-title">Terminal Bay · Pier 17</span>
                              </div>
                            </div>

                            {/* Operational Marker 4: Patrol Unit #4 */}
                            <div
                              className="map-op-marker secondary-patrol"
                              style={{ left: '54%', top: '28%' }}
                              title="Patrol Unit #4 · Active"
                            >
                              <div className="marker-dot-badge blue">
                                <span className="marker-dot-inner" />
                              </div>
                              <div className="marker-callout-pill">
                                <span className="marker-title">Patrol Unit #4 · Active</span>
                              </div>
                            </div>
                          </div>

                          {/* Location Badge */}
                          <div className={`map-location-badge ${isLocating ? 'locating-pulse' : ''}`}>
                            <Crosshair size={13} className="location-target-icon" />
                            <span>40.7128, -74.0060 · Manhattan</span>
                          </div>

                          {/* Center / Top Context Watermark */}
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
                              {/* Avatar with overlapping sub-badge */}
                              <div className="notif-avatar-wrapper">
                                <div className="notif-avatar-img-wrap">
                                  <img
                                    src={item.avatar}
                                    alt={item.actor}
                                    className="notif-avatar-img"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                                <div className={`notif-avatar-subbadge ${item.type}`}>
                                  {item.type === 'comment' ? (
                                    <MessageSquare size={9.5} strokeWidth={2.4} />
                                  ) : (
                                    <Info size={9.5} strokeWidth={2.4} />
                                  )}
                                </div>
                              </div>

                              {/* Single-line notification text */}
                              <div className="notif-row-text">
                                <span className="notif-actor-name">{item.actor}</span>
                                <span className="notif-action-text"> {item.action} in · </span>
                                <span className="notif-folder-icon" aria-hidden="true">📁</span>
                                {item.target && <span className="notif-target-text"> {item.target} · </span>}
                                <span className="notif-time-text">{item.time}</span>
                              </div>

                              {/* Red unread indicator dot on right */}
                              {item.unread && (
                                <span className="notif-unread-red-dot" title="Unread notification" />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Card Footer matching Reference Image */}
                        <div className="notif-card-footer">
                          <span className="notif-page-info">Page 1 of 1</span>
                          <div className="notif-footer-btns">
                            <button
                              type="button"
                              className="notif-pill-btn"
                              aria-label="Previous notifications page"
                            >
                              PREV
                            </button>
                            <button
                              type="button"
                              className="notif-pill-btn"
                              aria-label="Next notifications page"
                            >
                              NEXT
                            </button>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              );
            }

            if (previewScreen === 'Cameras') {
              const cameraFeeds = [
                { id: 'CAM 01', name: 'Main Lobby', status: 'online', recording: true, time: '14:32:08', image: camLobbyImg, tag: 'PERSON · 0.92', tagType: 'person' },
                { id: 'CAM 02', name: 'North Gate', status: 'online', recording: true, time: '14:32:08', image: camNorthGateImg, tag: 'VEHICLE · 0.96', tagType: 'vehicle' },
                { id: 'CAM 03', name: 'Loading Bay', status: 'online', recording: false, time: '14:32:07', image: camLoadingBayImg, tag: 'FORKLIFT · 0.88', tagType: 'forklift' },
                { id: 'CAM 04', name: 'Rooftop', status: 'online', recording: true, time: '14:32:08', image: camRooftopImg, tag: 'ZONE 4 · SECURE', tagType: 'zone' },
                { id: 'CAM 05', name: 'Parking Deck', status: 'standby', recording: false, time: null, image: camParkingDeckImg, tag: 'STANDBY', tagType: 'standby' },
                { id: 'CAM 06', name: 'Server Room', status: 'online', recording: true, time: '14:32:08', image: camServerRoomImg, tag: 'RACK 10-18 · NORMAL', tagType: 'rack' },
              ];

              const activeCam = cameraFeeds.find((c) => c.id === selectedCamId) || cameraFeeds[1];
              const leftSideCams = [cameraFeeds[0], cameraFeeds[1], cameraFeeds[2]];
              const topRowCams = [cameraFeeds[3], cameraFeeds[4], cameraFeeds[5]];
              const bottomRowCams = [cameraFeeds[0], cameraFeeds[2], cameraFeeds[3]];
              const rightSideCams = [cameraFeeds[3], cameraFeeds[4], cameraFeeds[5]];

              const unreadDetectionsCount = cameraDetections.filter((d) => d.unread).length;

              return (
                <div className="cameras-preview-canvas">
                  {/* 1. Header Row */}
                  <div className="cameras-header-row">
                    <div className="dashboard-title-wrap">
                      <h1 className="dashboard-page-title">Camera Surveillance</h1>
                      <button
                        type="button"
                        className="dashboard-info-btn app-tooltip-wrap"
                        data-tooltip="Monitor connected cameras and recent detection activity."
                        data-tooltip-pos="bottom"
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

                  {/* 2. Top Row: 4 KPI Cards (Approved Reference Image 2 Design) */}
                  <div className="cameras-kpi-grid">
                    <KpiSummaryCard
                      icon={Camera}
                      accent="blue"
                      value="5/6"
                      label="Cameras Online"
                      style={cardSurfaceStyle}
                    />
                    <KpiSummaryCard
                      icon={Disc}
                      accent="yellow"
                      value="4"
                      label="Active Recording"
                      style={cardSurfaceStyle}
                    />
                    <KpiSummaryCard
                      icon={AlertCircle}
                      accent="cyan"
                      value={unreadDetectionsCount.toString()}
                      label="Motion Alerts"
                      style={cardSurfaceStyle}
                    />
                    <KpiSummaryCard
                      icon={HardDrive}
                      accent="green"
                      value="82%"
                      label="Storage Used"
                      style={cardSurfaceStyle}
                    />
                  </div>

                  {/* 3. Main Split Grid: Camera Wall (left) + Recent Detections (right) */}
                  <div className="cameras-main-grid">
                    {/* Left: Camera Wall - Asymmetric Surveillance Center */}
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
                          Surveillance Dashboard · Live Grid
                        </span>
                      </div>

                      <div className="camera-wall-body">
                        <div className="cctv-asymmetric-layout">
                          {/* Left Sidebar: 3 Narrow Vertically Stacked Cards */}
                          <div className="cctv-side-col left-side" role="region" aria-label="West Sector Feeds">
                            {leftSideCams.map((cam, idx) => (
                              <div
                                key={`left-${cam.id}-${idx}`}
                                className={`cctv-side-tile ${cam.id === selectedCamId ? 'is-selected' : ''}`}
                                onClick={() => setSelectedCamId(cam.id)}
                                title={`Focus ${cam.id} (${cam.name}) on main monitor`}
                              >
                                <div className="cctv-footage-wrapper">
                                  <img
                                    src={cam.image}
                                    alt={`${cam.id} — ${cam.name}`}
                                    className={`cctv-footage-img ${cam.id.toLowerCase().replace(' ', '-')}`}
                                  />
                                  <div className="cctv-vignette-overlay" />
                                  <div className="cctv-scanlines" />
                                </div>
                                <div className="cctv-side-meta-top">
                                  <span className={`cam-status-dot ${cam.status}`} />
                                  <span className="cctv-side-cam-id">{cam.id}</span>
                                  {cam.recording && <span className="cam-rec-dot pulse" title="Recording active" />}
                                </div>
                                <div className="cctv-side-name-vertical">
                                  <span>{cam.name}</span>
                                </div>
                                <div className="cctv-side-meta-bottom">
                                  <span className="cctv-side-status-text">{cam.status === 'online' ? 'LIVE' : 'IDLE'}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Center Column: Top Row (3) + Large Main Preview (1) + Bottom Row (3) */}
                          <div className="cctv-center-col">
                            {/* Top Row: 3 Smaller Camera Preview Cards Horizontally */}
                            <div className="cctv-h-row top-row" role="region" aria-label="North Sector Feeds">
                              {topRowCams.map((cam, idx) => (
                                <div
                                  key={`top-${cam.id}-${idx}`}
                                  className={`cctv-h-tile ${cam.id === selectedCamId ? 'is-selected' : ''}`}
                                  onClick={() => setSelectedCamId(cam.id)}
                                  title={`Focus ${cam.id} (${cam.name}) on main monitor`}
                                >
                                  <div className="cctv-footage-wrapper">
                                    <img
                                      src={cam.image}
                                      alt={`${cam.id} — ${cam.name}`}
                                      className={`cctv-footage-img ${cam.id.toLowerCase().replace(' ', '-')}`}
                                    />
                                    <div className="cctv-vignette-overlay" />
                                    <div className="cctv-scanlines" />
                                  </div>
                                  <div className="cctv-h-meta-top">
                                    <div className="cctv-h-id-wrap">
                                      <span className={`cam-status-dot ${cam.status}`} />
                                      <span className="cctv-h-cam-id">{cam.id}</span>
                                    </div>
                                    {cam.recording && (
                                      <div className="cam-rec-badge compact">
                                        <span className="cam-rec-dot" />
                                        <span className="cam-rec-text">REC</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="cctv-h-name-watermark">
                                    <span>{cam.name}</span>
                                  </div>
                                  <div className="cctv-h-meta-bottom">
                                    <span className="cctv-h-time">{liveCctvTime || cam.time}</span>
                                    <span className="cctv-h-res">1080P</span>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Center: Large Main Camera Preview (Focus Panel) */}
                            <div
                              className="cctv-main-preview-panel"
                              role="region"
                              aria-label={`Main Camera Feed: ${activeCam.id} ${activeCam.name}`}
                            >
                              <div className="cctv-footage-wrapper is-main-feed">
                                <img
                                  src={activeCam.image}
                                  alt={`${activeCam.id} — ${activeCam.name} main surveillance view`}
                                  className={`cctv-footage-img is-main-img ${activeCam.id.toLowerCase().replace(' ', '-')}`}
                                />
                                <div className="cctv-vignette-overlay is-main-vignette" />
                                <div className="cctv-scanlines is-main-scanlines" />
                                <div className="cctv-scan-beam" />
                              </div>

                              {/* Target HUD Reticle Brackets */}
                              <div className="cctv-hud-reticle tl" />
                              <div className="cctv-hud-reticle tr" />
                              <div className="cctv-hud-reticle bl" />
                              <div className="cctv-hud-reticle br" />

                              {/* Main Top Header Overlay */}
                              <div className="cctv-main-overlay-top">
                                <div className="cctv-main-tag-box">
                                  <span className={`cam-status-dot ${activeCam.status}`} />
                                  <span className="cctv-main-cam-id">{activeCam.id}</span>
                                  <span className="cctv-main-badge">PRIMARY TARGET FEED</span>
                                </div>
                                <div className="cctv-main-rec-wrap">
                                  {activeCam.recording && (
                                    <div className="cam-rec-badge is-main">
                                      <span className="cam-rec-dot pulse" />
                                      <span className="cam-rec-text">REC · HIGH-RES</span>
                                    </div>
                                  )}
                                  <span className="cctv-main-bitrate">4.8 Mbps</span>
                                </div>
                              </div>

                              {/* Center Location Watermark (Prominently Overlaid) */}
                              <div className="cctv-main-location-pill">
                                <span className="cctv-loc-dot">◉</span>
                                <span className="cctv-loc-title">{activeCam.name.toUpperCase()}</span>
                                <span className="cctv-loc-ch">CH-0{activeCam.id.replace('CAM 0', '')}</span>
                              </div>

                              {/* Object Tracking Overlays (Preserved & Enhanced) */}
                              {activeCam.status === 'online' && activeCam.tag && (
                                <div className={`cctv-hud-tracking is-main-tracking ${activeCam.tagType}`}>
                                  <div className="cctv-track-box">
                                    <span className="cctv-track-label">{activeCam.tag}</span>
                                    <div className="cctv-crosshair-center" />
                                  </div>
                                </div>
                              )}

                              {/* Server Room Rack Blinkers */}
                              {activeCam.id === 'CAM 06' && (
                                <div className="cctv-server-leds is-main-leds" aria-hidden="true">
                                  <span className="server-led green" />
                                  <span className="server-led cyan" />
                                  <span className="server-led green" />
                                  <span className="server-led blue" />
                                </div>
                              )}

                              {/* Standby Banner for CAM 05 */}
                              {activeCam.status === 'standby' && (
                                <div className="cctv-standby-banner is-main-standby">
                                  <span className="standby-pulse-dot" />
                                  <span>MOTION DETECTION STANDBY · RADAR ONLINE</span>
                                </div>
                              )}

                              {/* Main Bottom Footer Overlay */}
                              <div className="cctv-main-overlay-bottom">
                                <div className="cctv-main-timestamp-box">
                                  <span className="cctv-timestamp-clock">{liveCctvTime || activeCam.time}</span>
                                  <span className="cctv-timestamp-tz">UTC-04:00 (EST)</span>
                                </div>
                                <div className="cctv-main-telemetry-box">
                                  <span className="cctv-main-res">{activeCam.status === 'online' ? '1080P · 24FPS' : 'SIGNAL IDLE'}</span>
                                  <span className="cctv-main-codec">H.265 / 60Hz</span>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Row: 3 Smaller Camera Preview Cards Horizontally */}
                            <div className="cctv-h-row bottom-row" role="region" aria-label="South Sector Feeds">
                              {bottomRowCams.map((cam, idx) => (
                                <div
                                  key={`bottom-${cam.id}-${idx}`}
                                  className={`cctv-h-tile ${cam.id === selectedCamId ? 'is-selected' : ''}`}
                                  onClick={() => setSelectedCamId(cam.id)}
                                  title={`Focus ${cam.id} (${cam.name}) on main monitor`}
                                >
                                  <div className="cctv-footage-wrapper">
                                    <img
                                      src={cam.image}
                                      alt={`${cam.id} — ${cam.name}`}
                                      className={`cctv-footage-img ${cam.id.toLowerCase().replace(' ', '-')}`}
                                    />
                                    <div className="cctv-vignette-overlay" />
                                    <div className="cctv-scanlines" />
                                  </div>
                                  <div className="cctv-h-meta-top">
                                    <div className="cctv-h-id-wrap">
                                      <span className={`cam-status-dot ${cam.status}`} />
                                      <span className="cctv-h-cam-id">{cam.id}</span>
                                    </div>
                                    {cam.recording && (
                                      <div className="cam-rec-badge compact">
                                        <span className="cam-rec-dot" />
                                        <span className="cam-rec-text">REC</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="cctv-h-name-watermark">
                                    <span>{cam.name}</span>
                                  </div>
                                  <div className="cctv-h-meta-bottom">
                                    <span className="cctv-h-time">{liveCctvTime || cam.time}</span>
                                    <span className="cctv-h-res">1080P</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right Sidebar: 3 Narrow Vertically Stacked Cards */}
                          <div className="cctv-side-col right-side" role="region" aria-label="East Sector Feeds">
                            {rightSideCams.map((cam, idx) => (
                              <div
                                key={`right-${cam.id}-${idx}`}
                                className={`cctv-side-tile ${cam.id === selectedCamId ? 'is-selected' : ''}`}
                                onClick={() => setSelectedCamId(cam.id)}
                                title={`Focus ${cam.id} (${cam.name}) on main monitor`}
                              >
                                <div className="cctv-footage-wrapper">
                                  <img
                                    src={cam.image}
                                    alt={`${cam.id} — ${cam.name}`}
                                    className={`cctv-footage-img ${cam.id.toLowerCase().replace(' ', '-')}`}
                                  />
                                  <div className="cctv-vignette-overlay" />
                                  <div className="cctv-scanlines" />
                                </div>
                                <div className="cctv-side-meta-top">
                                  <span className={`cam-status-dot ${cam.status}`} />
                                  <span className="cctv-side-cam-id">{cam.id}</span>
                                  {cam.recording && <span className="cam-rec-dot pulse" title="Recording active" />}
                                </div>
                                <div className="cctv-side-name-vertical">
                                  <span>{cam.name}</span>
                                </div>
                                <div className="cctv-side-meta-bottom">
                                  <span className="cctv-side-status-text">{cam.status === 'online' ? 'LIVE' : 'STANDBY'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Right: Recent Detections (Matching Notifications Layout) */}
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
                        {unreadDetectionsCount > 0 && (
                          <span className="notifications-badge-pill">
                            {`${unreadDetectionsCount} NEW`}
                          </span>
                        )}
                      </div>

                      <div className="notifications-card-body">
                        <div className="notifications-list" role="feed" aria-label="Camera detection events">
                          {cameraDetections.map((item) => (
                            <div
                              key={item.id}
                              className={`notif-list-item ${item.unread ? 'is-unread' : ''}`}
                              onClick={() => {
                                setCameraDetections((prev) =>
                                  prev.map((n) => (n.id === item.id ? { ...n, unread: !n.unread } : n))
                                );
                              }}
                              role="article"
                              tabIndex={0}
                              title="Click to toggle read status"
                            >
                              {/* Avatar with overlapping sub-badge */}
                              <div className="notif-avatar-wrapper">
                                <div className="notif-avatar-img-wrap">
                                  <img
                                    src={item.avatar}
                                    alt={item.actor}
                                    className="notif-avatar-img"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                                <div className={`notif-avatar-subbadge ${item.type}`}>
                                  {item.type === 'alert' ? (
                                    <AlertTriangle size={9.5} strokeWidth={2.4} />
                                  ) : item.type === 'success' ? (
                                    <Check size={9.5} strokeWidth={2.4} />
                                  ) : (
                                    <Info size={9.5} strokeWidth={2.4} />
                                  )}
                                </div>
                              </div>

                              {/* Single-line detection text */}
                              <div className="notif-row-text">
                                <span className="notif-actor-name">{item.actor}</span>
                                <span className="notif-action-text"> {item.action} in · </span>
                                <span className="notif-folder-icon" aria-hidden="true">📁</span>
                                {item.target && <span className="notif-target-text"> {item.target} · </span>}
                                <span className="notif-time-text">{item.time}</span>
                              </div>

                              {/* Red unread indicator dot on right */}
                              {item.unread && (
                                <span className="notif-unread-red-dot" title="Unread detection" />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Card Footer matching Reference Image */}
                        <div className="notif-card-footer">
                          <span className="notif-page-info">Page 1 of 1</span>
                          <div className="notif-footer-btns">
                            <button
                              type="button"
                              className="notif-pill-btn"
                              aria-label="Previous detections page"
                            >
                              PREV
                            </button>
                            <button
                              type="button"
                              className="notif-pill-btn"
                              aria-label="Next detections page"
                            >
                              NEXT
                            </button>
                          </div>
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
                        className="dashboard-info-btn app-tooltip-wrap"
                        data-tooltip="View generated reports, trends, and scheduled exports."
                        data-tooltip-pos="bottom"
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

                  {/* 2. Top Row: 4 KPI Cards (Approved Reference Image 2 Design) */}
                  <div className="reports-kpi-grid">
                    <KpiSummaryCard
                      icon={ClipboardCheck}
                      accent="blue"
                      value="248"
                      label="Reports Generated"
                      style={cardSurfaceStyle}
                    />
                    <KpiSummaryCard
                      icon={Clock}
                      accent="yellow"
                      value="1.2s"
                      label="Avg Generation"
                      style={cardSurfaceStyle}
                    />
                    <KpiSummaryCard
                      icon={BarChart2}
                      accent="cyan"
                      value="84.2K"
                      label="Data Points"
                      style={cardSurfaceStyle}
                    />
                    <KpiSummaryCard
                      icon={CalendarCheck}
                      accent="green"
                      value="12"
                      label="Scheduled Jobs"
                      style={cardSurfaceStyle}
                    />
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
                // 12 Pending orders
                { id: 'ORD-1048', customer: 'Nexus Dynamics', status: 'Pending', amount: '$7,840', date: 'Jun 22' },
                { id: 'ORD-1045', customer: 'Saratoga Tech', status: 'Pending', amount: '$11,200', date: 'Jun 20' },
                { id: 'ORD-1040', customer: 'Initech Systems', status: 'Pending', amount: '$5,200', date: 'Jun 16' },
                { id: 'ORD-1035', customer: 'Soylent Corp', status: 'Pending', amount: '$4,120', date: 'Jun 11' },
                { id: 'ORD-1029', customer: 'Pied Piper Cloud', status: 'Pending', amount: '$15,400', date: 'Jun 05' },
                { id: 'ORD-1026', customer: 'Dunder Mifflin Paper', status: 'Pending', amount: '$3,890', date: 'Jun 02' },
                { id: 'ORD-1022', customer: 'Starlight Media', status: 'Pending', amount: '$9,150', date: 'May 28' },
                { id: 'ORD-1018', customer: 'Aperture Science', status: 'Pending', amount: '$14,200', date: 'May 24' },
                { id: 'ORD-1014', customer: 'Omni Consumer Tech', status: 'Pending', amount: '$6,750', date: 'May 20' },
                { id: 'ORD-1009', customer: 'Tyrell Aerospace', status: 'Pending', amount: '$8,320', date: 'May 16' },
                { id: 'ORD-1005', customer: 'Black Mesa Labs', status: 'Pending', amount: '$12,600', date: 'May 12' },
                { id: 'ORD-1001', customer: 'Vehement Capital', status: 'Pending', amount: '$5,980', date: 'May 08' },

                // 12 Processing orders
                { id: 'ORD-1049', customer: 'Hyperion Energy', status: 'Processing', amount: '$19,400', date: 'Jun 22' },
                { id: 'ORD-1046', customer: 'Vandelay Industries', status: 'Processing', amount: '$6,450', date: 'Jun 21' },
                { id: 'ORD-1041', customer: 'Globex Corporation', status: 'Processing', amount: '$8,750', date: 'Jun 17' },
                { id: 'ORD-1037', customer: 'Stark Industries', status: 'Processing', amount: '$31,500', date: 'Jun 13' },
                { id: 'ORD-1032', customer: 'Massive Dynamic', status: 'Processing', amount: '$10,300', date: 'Jun 08' },
                { id: 'ORD-1028', customer: 'Wonka Confections', status: 'Processing', amount: '$7,620', date: 'Jun 04' },
                { id: 'ORD-1024', customer: 'Bluth Development', status: 'Processing', amount: '$13,800', date: 'May 30' },
                { id: 'ORD-1020', customer: 'Kavinsky Logistics', status: 'Processing', amount: '$9,400', date: 'May 26' },
                { id: 'ORD-1016', customer: 'Morozov Analytics', status: 'Processing', amount: '$22,900', date: 'May 22' },
                { id: 'ORD-1011', customer: 'Zephyr Networks', status: 'Processing', amount: '$11,100', date: 'May 18' },
                { id: 'ORD-1007', customer: 'Hansen Robotics', status: 'Processing', amount: '$16,350', date: 'May 14' },
                { id: 'ORD-1003', customer: 'Prestige Worldwide', status: 'Processing', amount: '$8,800', date: 'May 10' },

                // 12 Delivered orders
                { id: 'ORD-1050', customer: 'Sterling Cooper Media', status: 'Delivered', amount: '$14,800', date: 'Jun 23' },
                { id: 'ORD-1047', customer: 'Wayne Enterprises', status: 'Delivered', amount: '$28,400', date: 'Jun 21' },
                { id: 'ORD-1042', customer: 'Acme Corporation', status: 'Delivered', amount: '$12,400', date: 'Jun 18' },
                { id: 'ORD-1038', customer: 'Waystar Royco', status: 'Delivered', amount: '$9,800', date: 'Jun 14' },
                { id: 'ORD-1036', customer: 'Wayne Global HQ', status: 'Delivered', amount: '$18,240', date: 'Jun 12' },
                { id: 'ORD-1033', customer: 'Cyberdyne Systems', status: 'Delivered', amount: '$14,650', date: 'Jun 09' },
                { id: 'ORD-1031', customer: 'Tyrell Corp Global', status: 'Delivered', amount: '$16,780', date: 'Jun 07' },
                { id: 'ORD-1027', customer: 'Gringotts Financial', status: 'Delivered', amount: '$21,300', date: 'Jun 03' },
                { id: 'ORD-1023', customer: 'Oceanic Transport', status: 'Delivered', amount: '$10,950', date: 'May 29' },
                { id: 'ORD-1019', customer: 'Gekko & Co Partners', status: 'Delivered', amount: '$34,600', date: 'May 25' },
                { id: 'ORD-1015', customer: 'Sovereign Solutions', status: 'Delivered', amount: '$15,120', date: 'May 21' },
                { id: 'ORD-1012', customer: 'Strickland Propane', status: 'Delivered', amount: '$7,250', date: 'May 19' },

                // 12 Shipped orders
                { id: 'ORD-1044', customer: 'LexCorp International', status: 'Shipped', amount: '$38,200', date: 'Jun 19' },
                { id: 'ORD-1039', customer: 'Umbrella Corporation', status: 'Shipped', amount: '$22,100', date: 'Jun 15' },
                { id: 'ORD-1034', customer: 'Hooli Inc Technologies', status: 'Shipped', amount: '$27,900', date: 'Jun 10' },
                { id: 'ORD-1030', customer: 'Los Pollos Hermanos', status: 'Shipped', amount: '$9,650', date: 'Jun 06' },
                { id: 'ORD-1025', customer: 'Oscorp BioSciences', status: 'Shipped', amount: '$41,200', date: 'May 31' },
                { id: 'ORD-1021', customer: 'Nakatomi Trading Co', status: 'Shipped', amount: '$17,500', date: 'May 27' },
                { id: 'ORD-1017', customer: 'Monsters Energy Corp', status: 'Shipped', amount: '$12,800', date: 'May 23' },
                { id: 'ORD-1013', customer: 'Chum Bucket Foods', status: 'Shipped', amount: '$4,920', date: 'May 20' },
                { id: 'ORD-1010', customer: 'Krusty Krab Enterprises', status: 'Shipped', amount: '$18,700', date: 'May 17' },
                { id: 'ORD-1006', customer: 'Spectre Holdings', status: 'Shipped', amount: '$33,400', date: 'May 13' },
                { id: 'ORD-1002', customer: 'Monolith Productions', status: 'Shipped', amount: '$14,100', date: 'May 09' },
                { id: 'ORD-1000', customer: 'Cyberdyne Robotics', status: 'Shipped', amount: '$19,800', date: 'May 05' },
              ];

              const filteredOrders = ordersList.filter((ord) => {
                const matchesFilter = orderStatusFilter === 'All' || ord.status === orderStatusFilter;
                const matchesSearch =
                  ord.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                  ord.customer.toLowerCase().includes(orderSearch.toLowerCase());
                return matchesFilter && matchesSearch;
              });

              const PAGE_SIZE = 12;
              const totalFiltered = filteredOrders.length;
              const totalPages = Math.max(1, Math.ceil(totalFiltered / PAGE_SIZE));
              const safePage = Math.min(orderPage, totalPages);
              const displayedOrders = filteredOrders.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

              return (
                <div className="orders-preview-canvas">
                  {/* 1. Header Row */}
                  <div className="orders-header-row">
                    <div className="dashboard-title-wrap">
                      <h1 className="dashboard-page-title">Orders</h1>
                      <button
                        type="button"
                        className="dashboard-info-btn app-tooltip-wrap"
                        data-tooltip="Track customer orders, fulfillment status, and transaction history."
                        data-tooltip-pos="bottom"
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

                  {/* 2. Orders Summary KPI Cards Row (All Cards Same & Clean) */}
                  <div className="orders-kpi-grid">
                    <KpiSummaryCard
                      icon={ClipboardCheck}
                      accent="blue"
                      value="12"
                      label="For Review"
                      onClick={() => { setOrderStatusFilter('Pending'); setOrderPage(1); }}
                      style={cardSurfaceStyle}
                    />
                    <KpiSummaryCard
                      icon={Clock}
                      accent="yellow"
                      value="12"
                      label="For Follow up"
                      onClick={() => { setOrderStatusFilter('Processing'); setOrderPage(1); }}
                      style={cardSurfaceStyle}
                    />
                    <KpiSummaryCard
                      icon={AlertCircle}
                      accent="cyan"
                      value="48"
                      label="For Info"
                      onClick={() => { setOrderStatusFilter('All'); setOrderPage(1); }}
                      style={cardSurfaceStyle}
                    />
                    <KpiSummaryCard
                      icon={Activity}
                      accent="green"
                      value="12"
                      label="For Monitoring"
                      onClick={() => { setOrderStatusFilter('Delivered'); setOrderPage(1); }}
                      style={cardSurfaceStyle}
                    />
                  </div>

                  {/* 3. Main Parent Orders Card */}
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
                          onChange={(e) => { setOrderSearch(e.target.value); setOrderPage(1); }}
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
                              onClick={() => { setOrderStatusFilter(filter); setOrderPage(1); }}
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
                          {displayedOrders.map((ord) => (
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
                      <span className="orders-pagination-info">
                        Showing {displayedOrders.length > 0 ? (safePage - 1) * PAGE_SIZE + 1 : 0}–{(safePage - 1) * PAGE_SIZE + displayedOrders.length} of {orderStatusFilter === 'All' ? '1,284' : totalFiltered}
                      </span>

                      <div className="orders-pagination-controls" aria-label="Pagination">
                        <button
                          type="button"
                          className="btn-page-nav"
                          disabled={safePage === 1}
                          onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                          aria-label="Previous page"
                        >
                          <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((pageNum) => (
                          <button
                            key={pageNum}
                            type="button"
                            className={`btn-page-num ${safePage === pageNum ? 'active' : ''}`}
                            onClick={() => setOrderPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="btn-page-nav"
                          disabled={safePage >= totalPages}
                          onClick={() => setOrderPage((p) => Math.min(totalPages, p + 1))}
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
                        className="dashboard-info-btn app-tooltip-wrap"
                        data-tooltip={`Overview of ${previewScreen} modules and system telemetry.`}
                        data-tooltip-pos="bottom"
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
                      className="dashboard-info-btn app-tooltip-wrap"
                      data-tooltip="Overview of your dashboard performance and key metrics."
                      data-tooltip-pos="bottom"
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
                      <KpiSummaryCard
                        icon={DollarSign}
                        accent="blue"
                        value="$2.41M"
                        label="Revenue"
                        trend="+12.5%"
                        trendPositive={true}
                        style={{ ...previewNestedStyles, borderRadius: '14px' }}
                      />
                      <KpiSummaryCard
                        icon={Clock}
                        accent="yellow"
                        value="1,284"
                        label="Open Orders"
                        trend="+3.2%"
                        trendPositive={true}
                        style={{ ...previewNestedStyles, borderRadius: '14px' }}
                      />
                      <KpiSummaryCard
                        icon={AlertCircle}
                        accent="cyan"
                        value="8,540"
                        label="Inventory"
                        trend="-1.8%"
                        trendPositive={false}
                        style={{ ...previewNestedStyles, borderRadius: '14px' }}
                      />
                      <KpiSummaryCard
                        icon={Activity}
                        accent="green"
                        value="342"
                        label="Active Users"
                        trend="+5"
                        trendPositive={true}
                        style={{ ...previewNestedStyles, borderRadius: '14px' }}
                      />
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

                  {/* Card 3 — Order Statistics (Dummy Analytics Card) */}
                  <section
                    className="dashboard-card order-statistics-card"
                    style={cardSurfaceStyle}
                    aria-label="Order Statistics"
                  >
                    <div
                      className="dashboard-card-header"
                      style={{
                        backgroundColor: previewHeaderStyles.backgroundColor,
                        borderBottom: previewHeaderStyles.borderBottom,
                      }}
                    >
                      <h2 className="dashboard-card-title" style={{ color: previewHeaderStyles.color }}>
                        Order Statistics
                      </h2>
                      <span className="order-stats-badge" title="Fulfillment efficiency rate">
                        85.8%
                      </span>
                    </div>

                    <div className="dashboard-card-body order-statistics-body">
                      {/* Metric Header with Mini Donut Visualization */}
                      <div className="order-stats-top-row">
                        <div className="order-stats-total-box">
                          <span className="order-stats-kpi-label">Total Orders</span>
                          <span className="order-stats-kpi-val">1,284</span>
                        </div>

                        {/* Donut-style visualization */}
                        <div className="order-stats-donut-container" title="85.8% Completed, 14.2% Pending">
                          <svg className="order-stats-donut-svg" viewBox="0 0 36 36">
                            <path
                              className="donut-bg-ring"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="donut-pending-segment"
                              strokeDasharray="14.2, 100"
                              strokeDashoffset="-85.8"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="donut-completed-segment"
                              strokeDasharray="85.8, 100"
                              strokeDashoffset="0"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <span className="order-stats-donut-pct">86%</span>
                        </div>
                      </div>

                      {/* Compact Progress Bars Group */}
                      <div className="order-stats-progress-group">
                        {/* Progress Bar 1: Fulfillment Rate */}
                        <div className="order-stats-progress-wrap">
                          <div className="order-stats-bar-track">
                            <div
                              className="order-stats-bar-completed"
                              style={{ width: '85.8%' }}
                              title="Completed: 1,102 (85.8%)"
                            />
                            <div
                              className="order-stats-bar-pending"
                              style={{ width: '14.2%' }}
                              title="Pending: 182 (14.2%)"
                            />
                          </div>
                          <div className="order-stats-bar-subtext">
                            <span>Fulfillment Rate</span>
                            <span className="rate-num">85.8%</span>
                          </div>
                        </div>

                        {/* Progress Bar 2: On-Time Delivery */}
                        <div className="order-stats-progress-wrap">
                          <div className="order-stats-bar-track">
                            <div
                              className="order-stats-bar-ontime"
                              style={{ width: '92.4%' }}
                              title="On-Time: 1,186 (92.4%)"
                            />
                            <div
                              className="order-stats-bar-delayed"
                              style={{ width: '7.6%' }}
                              title="Delayed: 98 (7.6%)"
                            />
                          </div>
                          <div className="order-stats-bar-subtext">
                            <span>On-Time Delivery</span>
                            <span className="rate-num">92.4%</span>
                          </div>
                        </div>
                      </div>

                      {/* Small Status Indicators Breakdown */}
                      <div className="order-stats-status-list">
                        <div className="order-stats-status-item">
                          <div className="status-item-left">
                            <span className="order-status-dot completed" />
                            <span className="order-status-name">Completed</span>
                          </div>
                          <div className="status-item-right">
                            <span className="order-status-count">1,102</span>
                            <span className="order-status-pct">85.8%</span>
                          </div>
                        </div>

                        <div className="order-stats-status-item">
                          <div className="status-item-left">
                            <span className="order-status-dot pending" />
                            <span className="order-status-name">Pending</span>
                          </div>
                          <div className="status-item-right">
                            <span className="order-status-count">182</span>
                            <span className="order-status-pct">14.2%</span>
                          </div>
                        </div>
                      </div>
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
                  <span
                    className="app-tooltip-wrap"
                    data-tooltip="Explore reusable design system components, typography, and controls."
                    data-tooltip-pos="bottom"
                  >
                    <Info
                      size={16}
                      className="info-icon"
                    />
                  </span>
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

                {selectionTab === 'Overview' && (
                  <>
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

                    {/* Dummy Content Panel - Fills white space */}
                    <div className="selection-dummy-section">
                      <div className="selection-dummy-header">
                        <div className="selection-dummy-title-wrap">
                          <span className="selection-dummy-dot" />
                          <span className="selection-dummy-title">Selection Summary</span>
                        </div>
                        <span className="selection-dummy-status">Live Sync</span>
                      </div>
                      <p className="selection-dummy-description">
                        Selected rows consume active theme tokens with subtle brand tints, radio fill animations, and contextual status badges.
                      </p>
                      <div className="selection-dummy-stats">
                        <div className="selection-dummy-stat">
                          <span className="dummy-stat-label">Active</span>
                          <span className="dummy-stat-value">{selectedItems.length}</span>
                        </div>
                        <div className="selection-dummy-stat">
                          <span className="dummy-stat-label">Inactive</span>
                          <span className="dummy-stat-value">{selectionRows.length - selectedItems.length}</span>
                        </div>
                        <div className="selection-dummy-stat">
                          <span className="dummy-stat-label">Token</span>
                          <span className="dummy-stat-value">Primary</span>
                        </div>
                        <div className="selection-dummy-stat">
                          <span className="dummy-stat-label">Mode</span>
                          <span className="dummy-stat-value">Multi</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {selectionTab === 'Activity' && (
                  <div className="selection-activity-list">
                    <div className="selection-activity-item">
                      <div className="activity-dot active" />
                      <div className="activity-content">
                        <div className="activity-title">Item 1 toggled to Active state</div>
                        <div className="activity-time">2 minutes ago · User action</div>
                      </div>
                    </div>
                    <div className="selection-activity-item">
                      <div className="activity-dot" />
                      <div className="activity-content">
                        <div className="activity-title">Primary brand theme tokens applied</div>
                        <div className="activity-time">14 minutes ago · Theme Engine</div>
                      </div>
                    </div>
                    <div className="selection-activity-item">
                      <div className="activity-dot active" />
                      <div className="activity-content">
                        <div className="activity-title">Item 5 toggled to Active state</div>
                        <div className="activity-time">32 minutes ago · User action</div>
                      </div>
                    </div>
                    <div className="selection-activity-item">
                      <div className="activity-dot" />
                      <div className="activity-content">
                        <div className="activity-title">Selection group initialized with defaults</div>
                        <div className="activity-time">1 hour ago · System</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectionTab === 'Settings' && (
                  <div className="selection-settings-list">
                    <div className="selection-setting-row">
                      <div className="setting-info">
                        <span className="setting-name">Multi-select Mode</span>
                        <span className="setting-desc">Permit multiple rows to be toggled concurrently</span>
                      </div>
                      <span className="setting-badge">Enabled</span>
                    </div>
                    <div className="selection-setting-row">
                      <div className="setting-info">
                        <span className="setting-name">Show Status Badges</span>
                        <span className="setting-desc">Display active badge pill next to selected items</span>
                      </div>
                      <span className="setting-badge">Enabled</span>
                    </div>
                    <div className="selection-setting-row">
                      <div className="setting-info">
                        <span className="setting-name">Theme Accent Highlighting</span>
                        <span className="setting-desc">Apply brand subtle background color to active rows</span>
                      </div>
                      <span className="setting-badge">Enabled</span>
                    </div>
                  </div>
                )}

                {/* Selection Footer Row */}
                <div className="selection-footer-row">
                  <div className="selection-footer-badge">
                    <span>{selectedItems.length} selected items</span>
                  </div>
                  {selectionTab === 'Overview' && (
                    <div className="selection-footer-actions">
                      <button
                        type="button"
                        className="selection-footer-action-btn"
                        onClick={() => setSelectedItems(selectionRows.map((_, i) => i))}
                        title="Select all rows"
                      >
                        Select All
                      </button>
                      <button
                        type="button"
                        className="selection-footer-action-btn"
                        onClick={() => setSelectedItems([])}
                        title="Deselect all rows"
                      >
                        Clear
                      </button>
                    </div>
                  )}
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
