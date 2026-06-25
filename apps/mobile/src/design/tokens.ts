import { TextStyle } from 'react-native';

export const colors = {
  bg:              '#12131a',
  surface:         '#1a1b22',
  surfaceAlt:      '#1e1f26',
  border:          '#2e3048',
  accent:          '#fde400',
  error:           '#ef4444',
  textPrimary:     '#ffffff',
  textMuted:       '#5a5c72',
  textLabel:       '#c6c5d8',
  textPlaceholder: '#6b7280',
  textOnAccent:    '#12131a',
  accentSubtle:    'rgba(253,228,0,0.08)',
  online:          '#4ade80',
  away:            '#fb923c',
  danger:          '#f87171',
  dangerSubtle:    'rgba(248,113,113,0.19)',
  card:            '#25273a',
  accentBorder:    'rgba(253,228,0,0.25)',
  onlineSubtle:    'rgba(74,222,128,0.13)',
} as const;

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
} as const;

export const radii = {
  input:  12,
  button: 12,
  logo:   8,
} as const;

export const typography = {
  displayLg: {
    fontFamily:    'Syne_800ExtraBold',
    fontSize:      32,
    textTransform: 'uppercase',
    letterSpacing: -0.8,
  } satisfies TextStyle,
  body: {
    fontFamily: 'Syne_400Regular',
    fontSize:   16,
  } satisfies TextStyle,
  bodySmall: {
    fontFamily: 'Syne_400Regular',
    fontSize:   14,
  } satisfies TextStyle,
  button: {
    fontFamily:    'Syne_400Regular',
    fontSize:      18,
    textTransform: 'uppercase',
    letterSpacing: 0.45,
  } satisfies TextStyle,
  buttonSm: {
    fontFamily:    'Syne_400Regular',
    fontSize:      16,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  label: {
    fontFamily:    'IBMPlexMono_400Regular',
    fontSize:      12,
    textTransform: 'uppercase',
    letterSpacing: 0.24,
  } satisfies TextStyle,
  sectionTitle: {
    fontFamily:    'Syne_700Bold',
    fontSize:      13,
    textTransform: 'uppercase',
    letterSpacing: 0.65,
  } satisfies TextStyle,
  caption: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize:   10,
    letterSpacing: 1,
  } satisfies TextStyle,
  navLabel: {
    fontFamily:    'IBMPlexMono_600SemiBold',
    fontSize:      14,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  } satisfies TextStyle,
} as const;
