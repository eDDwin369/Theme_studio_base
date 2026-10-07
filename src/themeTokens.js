// ---------------------------------------------------------
// Centralized Enterprise Design System Theme Tokens
// Supports:
//   Color Schemes: 'blue' (Corporate Blue) | 'green' (Corporate Green)
//   Appearances:   'light' | 'dark'
// Combinations:
//   1. Blue Theme + Light
//   2. Blue Theme + Dark
//   3. Green Theme + Light
//   4. Green Theme + Dark
// ---------------------------------------------------------

export function hexToRgba(hex, alpha = 1) {
  if (!hex || typeof hex !== 'string') return `rgba(79, 107, 255, ${alpha})`;
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const COLOR_SCHEMES = {
  blue: {
    id: 'blue',
    name: 'Corporate Blue',
    primary: '#4F6BFF',
    primaryHover: '#3E58EB',
    primaryActive: '#3146C7',
    secondary: '#25C6E8',
    highlight: '#6B7FF2',
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
    primary: '#10B981',
    primaryHover: '#059669',
    primaryActive: '#047857',
    secondary: '#F59E0B',
    highlight: '#2EE59D',
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

export const APPEARANCE_MODES = {
  light: {
    id: 'light',
    name: 'Light',
    // Surfaces
    background: '#F8FAFC',
    sidebar: '#FFFFFF',
    previewBackground: '#F8FAFC',
    cardBackground: '#FFFFFF',
    nestedCard: '#F1F5F9',
    surfaceElevated: '#FFFFFF',
    themeStudioSurface: '#FFFFFF',
    themeStudioPanel: '#FFFFFF',
    themeStudioControlBg: '#FFFFFF',
    themeStudioMuted: '#F1F5F9',
    themeStudioBorder: '#E2E8F0',

    // Borders
    border: '#E2E8F0',
    borderSubtle: '#F1F5F9',
    borderStrong: '#CBD5E1',

    // Typography
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',
    textDisabled: '#CBD5E1',

    // Semantic Status
    statusSuccess: '#10B981',
    statusSuccessBg: '#ECFDF5',
    statusSuccessBorder: '#A7F3D0',
    statusSuccessText: '#065F46',

    statusWarning: '#F59E0B',
    statusWarningBg: '#FFFBEB',
    statusWarningBorder: '#FDE68A',
    statusWarningText: '#92400E',

    statusError: '#EF4444',
    statusErrorBg: '#FEF2F2',
    statusErrorBorder: '#FECACA',
    statusErrorText: '#991B1B',

    statusInfo: '#0284C7',
    statusInfoBg: '#F0F9FF',
    statusInfoBorder: '#BAE6FD',
    statusInfoText: '#0369A1',

    // Shadows
    shadowCard: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)',
    shadowDropdown: '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)',
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    // Surfaces
    background: '#0F1117',
    sidebar: '#151922',
    previewBackground: '#11151D',
    cardBackground: '#181D27',
    nestedCard: '#202632',
    surfaceElevated: '#1F2633',
    themeStudioSurface: '#151922',
    themeStudioPanel: '#181D27',
    themeStudioControlBg: '#151922',
    themeStudioMuted: '#202632',
    themeStudioBorder: '#2A3240',

    // Borders
    border: '#2A3240',
    borderSubtle: '#1C2330',
    borderStrong: '#3A4456',

    // Typography
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textDisabled: '#475569',

    // Semantic Status
    statusSuccess: '#10B981',
    statusSuccessBg: 'rgba(16, 185, 129, 0.15)',
    statusSuccessBorder: 'rgba(16, 185, 129, 0.35)',
    statusSuccessText: '#34D399',

    statusWarning: '#F59E0B',
    statusWarningBg: 'rgba(245, 158, 11, 0.15)',
    statusWarningBorder: 'rgba(245, 158, 11, 0.35)',
    statusWarningText: '#FBBF24',

    statusError: '#EF4444',
    statusErrorBg: 'rgba(239, 68, 68, 0.15)',
    statusErrorBorder: 'rgba(239, 68, 68, 0.35)',
    statusErrorText: '#F87171',

    statusInfo: '#0284C7',
    statusInfoBg: 'rgba(2, 132, 199, 0.15)',
    statusInfoBorder: 'rgba(2, 132, 199, 0.35)',
    statusInfoText: '#38BDF8',

    // Shadows
    shadowCard: '0 2px 8px 0 rgba(0, 0, 0, 0.45)',
    shadowDropdown: '0 12px 24px -4px rgba(0, 0, 0, 0.65)',
  },
};

/**
 * Derives the unified theme token object from (colorScheme, appearance)
 */
export function deriveTheme(colorSchemeKey = 'blue', appearanceKey = 'light') {
  const scheme = COLOR_SCHEMES[colorSchemeKey] || COLOR_SCHEMES.blue;
  const appearance = APPEARANCE_MODES[appearanceKey] || APPEARANCE_MODES.light;
  const isDark = appearanceKey === 'dark';

  return {
    colorScheme: colorSchemeKey,
    colorSchemeName: scheme.name,
    appearance: appearanceKey,
    isDark,

    // Primary & Accent Brand Tokens
    accent: scheme.primary,
    accentHover: scheme.primaryHover,
    accentActive: scheme.primaryActive,
    accentSecondary: scheme.secondary,
    accentHighlight: scheme.highlight,
    accentSoft: hexToRgba(scheme.primary, isDark ? 0.16 : 0.08),
    accentSoftHover: hexToRgba(scheme.primary, isDark ? 0.24 : 0.14),
    accentBorder: hexToRgba(scheme.primary, isDark ? 0.35 : 0.22),
    shades: scheme.shades,

    // Neutral Surfaces
    background: appearance.background,
    sidebar: appearance.sidebar,
    previewBackground: appearance.previewBackground,
    cardBackground: appearance.cardBackground,
    nestedCard: appearance.nestedCard,
    surfaceElevated: appearance.surfaceElevated,

    // Theme Studio Editor Fixed Surfaces
    themeStudioBg: appearance.background,
    themeStudioSurface: appearance.themeStudioSurface,
    themeStudioPanel: appearance.themeStudioPanel,
    themeStudioControlBg: appearance.themeStudioControlBg,
    themeStudioMuted: appearance.themeStudioMuted,
    themeStudioBorder: appearance.themeStudioBorder,

    // Borders
    border: appearance.border,
    borderSubtle: appearance.borderSubtle,
    borderStrong: appearance.borderStrong,

    // Typography
    textPrimary: appearance.textPrimary,
    textSecondary: appearance.textSecondary,
    textTertiary: appearance.textTertiary,
    textDisabled: appearance.textDisabled,

    // Status Tokens
    statusSuccess: appearance.statusSuccess,
    statusSuccessBg: appearance.statusSuccessBg,
    statusSuccessBorder: appearance.statusSuccessBorder,
    statusSuccessText: appearance.statusSuccessText,

    statusWarning: appearance.statusWarning,
    statusWarningBg: appearance.statusWarningBg,
    statusWarningBorder: appearance.statusWarningBorder,
    statusWarningText: appearance.statusWarningText,

    statusError: appearance.statusError,
    statusErrorBg: appearance.statusErrorBg,
    statusErrorBorder: appearance.statusErrorBorder,
    statusErrorText: appearance.statusErrorText,

    statusInfo: appearance.statusInfo,
    statusInfoBg: appearance.statusInfoBg,
    statusInfoBorder: appearance.statusInfoBorder,
    statusInfoText: appearance.statusInfoText,

    // Shadows
    shadowCard: appearance.shadowCard,
    shadowDropdown: appearance.shadowDropdown,
  };
}

/**
 * Calculates Card Shadows adapted for Light / Dark surfaces
 */
export function getCardShadowForTheme(variant, depth, isDark = false) {
  if (variant === 'Outlined') {
    return 'none';
  }
  if (variant === 'Floating') {
    const yOffset = Math.max(4, Math.round(depth * 0.45));
    const blur = Math.max(10, Math.round(depth * 1.15));
    const spread = -Math.round(depth * 0.12);
    if (isDark) {
      const alpha = Math.min(0.68, 0.35 + (depth / 60) * 0.32);
      return `0 ${yOffset}px ${blur}px ${spread}px rgba(0, 0, 0, ${alpha}), 0 2px 6px -1px rgba(0, 0, 0, 0.45)`;
    }
    const alpha = Math.min(0.26, 0.08 + (depth / 60) * 0.18);
    return `0 ${yOffset}px ${blur}px ${spread}px rgba(15, 23, 42, ${alpha}), 0 2px 6px -1px rgba(15, 23, 42, 0.07)`;
  }
  // Soft variant (default)
  const yOffset = Math.max(2, Math.round(depth * 0.25));
  const blur = Math.max(5, Math.round(depth * 0.7));
  const spread = -Math.round(depth * 0.1);
  if (isDark) {
    const alpha = Math.min(0.5, 0.22 + (depth / 60) * 0.25);
    return `0 ${yOffset}px ${blur}px ${spread}px rgba(0, 0, 0, ${alpha}), 0 1px 4px rgba(0, 0, 0, 0.35)`;
  }
  const alpha = Math.min(0.16, 0.04 + (depth / 60) * 0.12);
  return `0 ${yOffset}px ${blur}px ${spread}px rgba(15, 23, 42, ${alpha}), 0 1px 3px rgba(15, 23, 42, 0.04)`;
}

/**
 * Calculates Card Borders adapted for Light / Dark surfaces
 */
export function getCardBorderForTheme(variant, isDark = false) {
  if (variant === 'Outlined') {
    return isDark ? '1.5px solid #3A4456' : '1.5px solid var(--border-strong, #CBD5E1)';
  }
  if (variant === 'Floating') {
    return isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(226, 232, 240, 0.8)';
  }
  // Soft variant
  return isDark ? '1px solid #2A3240' : '1px solid var(--border-default, #E2E8F0)';
}

/**
 * Calculates Card Header styles adapted for Light / Dark surfaces
 */
export function getCardHeaderStylesForTheme(style, strength, brandPrimary, isDark = false) {
  const factor = (strength ?? 0) / 100;
  if (style === 'Tinted') {
    const alpha = isDark ? Math.max(0.1, 0.1 + factor * 0.26) : 0.04 + factor * 0.22;
    return {
      backgroundColor: hexToRgba(brandPrimary, alpha),
      borderBottom: `1px solid ${hexToRgba(brandPrimary, isDark ? 0.25 + factor * 0.25 : 0.12 + factor * 0.2)}`,
      color: isDark ? '#F8FAFC' : 'var(--text-primary)',
      subtitleColor: isDark ? '#94A3B8' : 'var(--text-secondary)',
    };
  }
  if (style === 'Accent') {
    const alpha = 0.25 + factor * 0.75;
    const isStrongDark = alpha > 0.45;
    return {
      backgroundColor: hexToRgba(brandPrimary, alpha),
      borderBottom: `1px solid ${isStrongDark ? 'transparent' : hexToRgba(brandPrimary, 0.4)}`,
      color: isStrongDark ? '#FFFFFF' : (isDark ? '#F8FAFC' : 'var(--text-primary)'),
      subtitleColor: isStrongDark ? 'rgba(255, 255, 255, 0.88)' : (isDark ? '#CBD5E1' : 'var(--text-secondary)'),
      isAccentDark: isStrongDark,
    };
  }
  // Plain
  return {
    backgroundColor: 'transparent',
    borderBottom: `1px solid ${isDark ? '#2A3240' : 'var(--border-default)'}`,
    color: isDark ? '#F8FAFC' : 'var(--text-primary)',
    subtitleColor: isDark ? '#94A3B8' : 'var(--text-secondary)',
  };
}

/**
 * Calculates Nested Elements styling adapted for Light / Dark surfaces
 */
export function getNestedStylesForTheme(style, depth, isDark = false) {
  const d = Math.max(0, depth);
  if (style === 'Recessed') {
    const blur = Math.max(2, Math.round(d * 0.8));
    const spread = Math.max(0, Math.round(d * 0.2));
    if (isDark) {
      const alpha = 0.28 + (d / 16) * 0.35;
      return {
        boxShadow: d > 0
          ? `inset 0 2px ${blur}px ${spread}px rgba(0, 0, 0, ${alpha}), inset 0 1px 2px rgba(0, 0, 0, 0.3)`
          : 'none',
        backgroundColor: '#151922',
        border: '1px solid #232B38',
      };
    }
    const alpha = 0.08 + (d / 16) * 0.14;
    return {
      boxShadow: d > 0
        ? `inset 0 2px ${blur}px ${spread}px rgba(15, 23, 42, ${alpha}), inset 0 1px 2px rgba(15, 23, 42, 0.06)`
        : 'none',
      backgroundColor: 'rgba(241, 245, 249, 0.85)',
      border: '1px solid rgba(226, 232, 240, 0.9)',
    };
  }
  if (style === 'Raised') {
    const y = Math.max(1, Math.round(d * 0.35));
    const blur = Math.max(2, Math.round(d * 0.9));
    if (isDark) {
      const alpha = 0.38 + (d / 16) * 0.35;
      return {
        boxShadow: d > 0
          ? `0 ${y}px ${blur}px rgba(0, 0, 0, ${alpha}), 0 1px 3px rgba(0, 0, 0, 0.25)`
          : 'none',
        backgroundColor: '#202632',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      };
    }
    const alpha = 0.08 + (d / 16) * 0.12;
    return {
      boxShadow: d > 0
        ? `0 ${y}px ${blur}px rgba(15, 23, 42, ${alpha}), 0 1px 2px rgba(15, 23, 42, 0.06)`
        : 'none',
      backgroundColor: '#FFFFFF',
      border: '1px solid rgba(226, 232, 240, 0.85)',
    };
  }
  // Flat
  if (isDark) {
    return {
      boxShadow: 'none',
      backgroundColor: '#202632',
      border: '1px solid #2A3240',
    };
  }
  return {
    boxShadow: 'none',
    backgroundColor: 'rgba(248, 250, 252, 0.65)',
    border: '1px solid var(--border-default, #E2E8F0)',
  };
}

/**
 * Calculates Card Tint overlay adapted for Light / Dark surfaces
 */
export function getCardTintOverlayForTheme(tint, intensity, brandPrimary, brandSecondary, isDark = false) {
  if (tint === 'None' || intensity === 0) return 'none';
  const factor = (intensity ?? 100) / 100;
  if (tint === 'Low') {
    const alpha = isDark ? Math.max(0.06, factor * 0.16) : Math.max(0.02, factor * 0.08);
    return `linear-gradient(135deg, ${hexToRgba(brandPrimary, alpha)}, transparent 80%)`;
  }
  if (tint === 'High') {
    const alpha1 = isDark ? Math.max(0.14, factor * 0.32) : Math.max(0.06, factor * 0.22);
    const alpha2 = isDark ? Math.max(0.08, factor * 0.18) : Math.max(0.03, factor * 0.12);
    return `linear-gradient(135deg, ${hexToRgba(brandPrimary, alpha1)}, ${hexToRgba(brandSecondary, alpha2)} 90%)`;
  }
  return 'none';
}
