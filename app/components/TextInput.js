import React, { useState } from 'react';
import { View, TextInput as RNTextInput, StyleSheet, Text, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../config/theme';

const TextInput = ({ 
  icon,
  label,
  error,
  touched,
  width = '100%',
  ...otherProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [labelAnimation] = useState(new Animated.Value(otherProps.value ? 1 : 0));

  const animateLabel = (toValue) => {
    Animated.timing(labelAnimation, {
      toValue,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleFocus = () => {
    setIsFocused(true);
    animateLabel(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!otherProps.value) {
      animateLabel(0);
    }
  };

  const labelStyle = {
    position: 'absolute',
    left: icon ? 50 : spacing.m,
    top: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [spacing.m, spacing.xs],
    }),
    fontSize: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [typography.sizes.body, typography.sizes.caption1],
    }),
    color: labelAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.text.tertiary, colors.primary],
    }),
  };

  return (
    <View style={[styles.container, { width }]}>
      <Animated.Text style={[styles.label, labelStyle]}>
        {label}
      </Animated.Text>
      <View style={[
        styles.inputContainer,
        { borderColor: error && touched ? colors.danger : isFocused ? colors.primary : colors.border }
      ]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color={error && touched ? colors.danger : isFocused ? colors.primary : colors.text.tertiary}
            style={styles.icon}
          />
        )}
        <RNTextInput
          style={[styles.input, { color: colors.text.primary }]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={colors.text.tertiary}
          {...otherProps}
        />
      </View>
      {error && touched && (
        <Text style={styles.error}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.s,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    flexDirection: 'row',
    padding: spacing.m,
    borderWidth: 1,
    alignItems: 'center',
    minHeight: 56,
  },
  icon: {
    marginRight: spacing.s,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.regular,
  },
  error: {
    color: colors.danger,
    fontSize: typography.sizes.caption1,
    marginTop: spacing.xs,
    marginLeft: spacing.s,
  },
});

export default TextInput;
