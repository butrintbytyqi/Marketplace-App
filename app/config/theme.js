export const colors = {
  // Primary colors
  primary: '#007AFF',  // iOS blue
  secondary: '#5856D6', // iOS purple
  
  // Neutrals
  black: '#000000',
  white: '#FFFFFF',
  background: '#F2F2F7', // iOS light gray background
  
  // Semantic colors
  success: '#34C759', // iOS green
  danger: '#FF3B30',  // iOS red
  warning: '#FF9500', // iOS orange
  info: '#5856D6',    // iOS purple
  
  // Text colors
  text: {
    primary: '#000000',
    secondary: '#6C6C6C',
    tertiary: '#8E8E93',
    inverse: '#FFFFFF',
  },
  
  // Border colors
  border: '#E5E5EA',
  
  // Card colors
  card: {
    background: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.05)',
  }
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

export const typography = {
  // Font sizes
  sizes: {
    title1: 34,
    title2: 28,
    title3: 24,
    headline: 17,
    body: 17,
    callout: 16,
    subhead: 15,
    footnote: 13,
    caption1: 12,
    caption2: 11,
  },
  
  // Font weights
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const borderRadius = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 28,
};

export const shadows = {
  small: {
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: colors.card.shadow,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 6.27,
    elevation: 6,
  },
};
