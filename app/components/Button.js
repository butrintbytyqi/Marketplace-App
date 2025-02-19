import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../config/theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'filled', // 'filled', 'outlined', 'ghost'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyles = () => {
    const baseStyles = [styles.button, styles[`${size}Button`]];
    
    if (variant === 'filled') {
      baseStyles.push(styles.filledButton);
      if (disabled) baseStyles.push(styles.filledButtonDisabled);
    } else if (variant === 'outlined') {
      baseStyles.push(styles.outlinedButton);
      if (disabled) baseStyles.push(styles.outlinedButtonDisabled);
    } else if (variant === 'ghost') {
      baseStyles.push(styles.ghostButton);
      if (disabled) baseStyles.push(styles.ghostButtonDisabled);
    }
    
    return [...baseStyles, style];
  };

  const getTextStyles = () => {
    const baseStyles = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'filled') {
      baseStyles.push(styles.filledText);
      if (disabled) baseStyles.push(styles.filledTextDisabled);
    } else if (variant === 'outlined') {
      baseStyles.push(styles.outlinedText);
      if (disabled) baseStyles.push(styles.outlinedTextDisabled);
    } else if (variant === 'ghost') {
      baseStyles.push(styles.ghostText);
      if (disabled) baseStyles.push(styles.ghostTextDisabled);
    }
    
    return [...baseStyles, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'filled' ? colors.white : colors.primary} 
          size="small"
        />
      ) : (
        <Text style={getTextStyles()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.m,
  },
  
  // Size variations
  smallButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.m,
    minHeight: 32,
  },
  mediumButton: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    minHeight: 44,
  },
  largeButton: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.xl,
    minHeight: 54,
  },
  
  // Variant styles - Filled
  filledButton: {
    backgroundColor: colors.primary,
  },
  filledButtonDisabled: {
    backgroundColor: colors.text.tertiary,
  },
  filledText: {
    color: colors.white,
  },
  filledTextDisabled: {
    color: colors.text.inverse,
  },
  
  // Variant styles - Outlined
  outlinedButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  outlinedButtonDisabled: {
    borderColor: colors.text.tertiary,
  },
  outlinedText: {
    color: colors.primary,
  },
  outlinedTextDisabled: {
    color: colors.text.tertiary,
  },
  
  // Variant styles - Ghost
  ghostButton: {
    backgroundColor: 'transparent',
  },
  ghostButtonDisabled: {
    opacity: 0.5,
  },
  ghostText: {
    color: colors.primary,
  },
  ghostTextDisabled: {
    color: colors.text.tertiary,
  },
  
  // Text base styles
  text: {
    fontWeight: typography.weights.semibold,
  },
  smallText: {
    fontSize: typography.sizes.subhead,
  },
  mediumText: {
    fontSize: typography.sizes.body,
  },
  largeText: {
    fontSize: typography.sizes.headline,
  },
});

export default Button;
