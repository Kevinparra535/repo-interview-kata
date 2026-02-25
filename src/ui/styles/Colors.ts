import { hexToRgba } from '@/ui/utils/colorUtils';

const TEXT_PRIMARY_LIGHT = '#111827';
const TEXT_SECONDARY_LIGHT = '#6B7280';
const TEXT_TERTIARY_LIGHT = '#9CA3AF';

const BG_PRIMARY_LIGHT = '#FFFFFF';
const BG_SURFACE_LIGHT = '#FFFFFF';
const BG_ELEVATED_LIGHT = '#F7F8FA';
const BG_HOVER_LIGHT = '#F0F1F4';

const BG_PRIMARY_DARK = '#0F1117';
const BG_SURFACE_DARK = '#222639';
const BG_ELEVATED_DARK = '#1A1D27';
const BG_HOVER_DARK = '#2A2E3F';

const ACCENT_PRIMARY_LIGHT = '#0D9488';
const ACCENT_PRIMARY_HOVER_LIGHT = '#0F766E';
const ACCENT_PRIMARY_SUBTLE_LIGHT = '#CCFBF1';
const ACCENT_PRIMARY_DARK = '#2DD4BF';

const BORDER_SUBTLE_LIGHT = '#E5E7EB';
const BORDER_STRONG_LIGHT = '#D1D5DB';
const BORDER_SUBTLE_DARK = '#2A2E3F';
const BORDER_STRONG_DARK = '#3B4058';

const ERROR_RED = '#EF4444';
const DESTRUCTIVE_MID = '#F87171';
const SUCCESS_GREEN = '#10B981';
const SUCCESS_LIGHT = '#34D399';
const WARNING_PRIMARY = '#F59E0B';
const WARNING_LIGHT = '#FBBF24';

const base = {
  bgPrimary: BG_PRIMARY_LIGHT,
  bgSecondary: BG_ELEVATED_LIGHT,
  bgTertiary: BG_HOVER_LIGHT,
  bgGradientEnd: BG_PRIMARY_DARK,
  navGradientEnd: BG_HOVER_DARK,
  detailGradientEnd: BG_ELEVATED_DARK,
  actionRowBg: BG_ELEVATED_LIGHT,
  bgCard: BG_SURFACE_LIGHT,
  bgSearchBar: BG_SURFACE_LIGHT,
  bgSearchBarBorder: BORDER_SUBTLE_LIGHT,
  bgInfoCard: BG_ELEVATED_LIGHT,

  accent: ACCENT_PRIMARY_LIGHT,
  accentGradientStart: ACCENT_PRIMARY_LIGHT,
  accentGradientEnd: ACCENT_PRIMARY_HOVER_LIGHT,
  accentDeep: ACCENT_PRIMARY_HOVER_LIGHT,
  accentLight: ACCENT_PRIMARY_DARK,
  accentDim: ACCENT_PRIMARY_SUBTLE_LIGHT,
  accentDimBorder: BORDER_STRONG_LIGHT,

  inputBg: BG_SURFACE_LIGHT,
  inputBorder: BORDER_SUBTLE_LIGHT,
  inputErrorBorder: ERROR_RED,
  inputSuccessBorder: SUCCESS_GREEN,

  cardBorder: BORDER_SUBTLE_LIGHT,
  separator: BORDER_SUBTLE_LIGHT,

  textPrimary: TEXT_PRIMARY_LIGHT,
  textSecondary: TEXT_SECONDARY_LIGHT,
  textMuted: TEXT_TERTIARY_LIGHT,
  textPlaceholder: TEXT_TERTIARY_LIGHT,
  textHint: TEXT_TERTIARY_LIGHT,
  textDismiss: TEXT_TERTIARY_LIGHT,

  iconMuted: TEXT_TERTIARY_LIGHT,

  badgeEmpty: BG_ELEVATED_LIGHT,

  dangerPrimary: ERROR_RED,
  dangerDark: '#450A0A',
  destructiveMid: DESTRUCTIVE_MID,
  dangerDim: '#FEE2E2',
  dangerDimBorder: '#FCA5A5',
  dangerGlow: hexToRgba(ERROR_RED, 0.2),

  successLight: SUCCESS_LIGHT,
  warningPrimary: WARNING_PRIMARY,
  warningLight: WARNING_LIGHT,

  modalBackdrop: hexToRgba('#000000', 0.7),
  modalCardBg: BG_SURFACE_DARK,
  modalCardBorder: BORDER_SUBTLE_DARK,
  dividerLight: BORDER_SUBTLE_LIGHT,

  neutralLight: BG_ELEVATED_LIGHT,
  neutralMid: BORDER_STRONG_LIGHT,
  neutralDark: TEXT_TERTIARY_LIGHT,

  iconSavings: ACCENT_PRIMARY_LIGHT,
  iconCredit: '#9B59B6',
  iconLoan: SUCCESS_GREEN,
  iconInsurance: '#E8A030',
  iconDefault: ACCENT_PRIMARY_LIGHT,
};

const Colors = {
  base,

  bank: base,

  semantic: {
    text: {
      primaryDark: TEXT_PRIMARY_LIGHT,
      primaryLight: '#F1F2F6',
    },
    background: {
      light: BG_PRIMARY_LIGHT,
      primary: BG_PRIMARY_DARK,
    },
  },

  brand: {
    primary: base.accent,
    secondary: base.bgPrimary,
    premium: base.accentGradientEnd,
  },

  variants: {
    disabled: '#A0A0A0',
    disabledBackground: '#F0F0F0',
  },

  alerts: {
    check: '#4eaf0d',
    error: ERROR_RED,
    warning: WARNING_PRIMARY,
    softNegative: '#E57373',
  },

  bg: {
    claro: base.bgPrimary,
    oscuro: base.bgGradientEnd,
  },

  mode: {
    light: {
      bgPrimary: BG_PRIMARY_LIGHT,
      bgSurface: BG_SURFACE_LIGHT,
      bgElevated: BG_ELEVATED_LIGHT,
      bgHover: BG_HOVER_LIGHT,
      textPrimary: TEXT_PRIMARY_LIGHT,
      textSecondary: TEXT_SECONDARY_LIGHT,
      textTertiary: TEXT_TERTIARY_LIGHT,
      borderSubtle: BORDER_SUBTLE_LIGHT,
      borderStrong: BORDER_STRONG_LIGHT,
      accentPrimary: ACCENT_PRIMARY_LIGHT,
      accentPrimaryHover: ACCENT_PRIMARY_HOVER_LIGHT,
      accentPrimarySubtle: ACCENT_PRIMARY_SUBTLE_LIGHT,
    },
    dark: {
      bgPrimary: BG_PRIMARY_DARK,
      bgSurface: BG_SURFACE_DARK,
      bgElevated: BG_ELEVATED_DARK,
      bgHover: BG_HOVER_DARK,
      textPrimary: '#F1F2F6',
      textSecondary: '#9CA3AF',
      textTertiary: '#6B7280',
      borderSubtle: BORDER_SUBTLE_DARK,
      borderStrong: BORDER_STRONG_DARK,
      accentPrimary: ACCENT_PRIMARY_DARK,
      accentPrimaryHover: '#5EEAD4',
      accentPrimarySubtle: '#0D3D38',
    },
  },

  claro: base.neutralLight,
  oscuro: base.bgGradientEnd,
} as const;

export default Colors;
