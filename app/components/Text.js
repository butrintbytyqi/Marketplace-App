import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { colors, typography } from '../config/theme';

const Text = ({ 
  children, 
  style, 
  variant = 'body',  // 'title1', 'title2', 'title3', 'headline', 'body', 'callout', 'subhead', 'footnote', 'caption1', 'caption2'
  weight = 'regular', // 'regular', 'medium', 'semibold', 'bold'
  color,
  ...otherProps 
}) => {
  return (
    <RNText
      style={[
        styles.text,
        styles[variant],
        styles[weight],
        color && { color },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.text.primary,
  },
  
  // Variants
  title1: {
    fontSize: typography.sizes.title1,
    lineHeight: typography.sizes.title1 * 1.2,
  },
  title2: {
    fontSize: typography.sizes.title2,
    lineHeight: typography.sizes.title2 * 1.2,
  },
  title3: {
    fontSize: typography.sizes.title3,
    lineHeight: typography.sizes.title3 * 1.2,
  },
  headline: {
    fontSize: typography.sizes.headline,
    lineHeight: typography.sizes.headline * 1.3,
  },
  body: {
    fontSize: typography.sizes.body,
    lineHeight: typography.sizes.body * 1.3,
  },
  callout: {
    fontSize: typography.sizes.callout,
    lineHeight: typography.sizes.callout * 1.3,
  },
  subhead: {
    fontSize: typography.sizes.subhead,
    lineHeight: typography.sizes.subhead * 1.3,
  },
  footnote: {
    fontSize: typography.sizes.footnote,
    lineHeight: typography.sizes.footnote * 1.3,
  },
  caption1: {
    fontSize: typography.sizes.caption1,
    lineHeight: typography.sizes.caption1 * 1.3,
  },
  caption2: {
    fontSize: typography.sizes.caption2,
    lineHeight: typography.sizes.caption2 * 1.3,
  },
  
  // Weights
  regular: {
    fontWeight: typography.weights.regular,
  },
  medium: {
    fontWeight: typography.weights.medium,
  },
  semibold: {
    fontWeight: typography.weights.semibold,
  },
  bold: {
    fontWeight: typography.weights.bold,
  },
});

export default Text;
