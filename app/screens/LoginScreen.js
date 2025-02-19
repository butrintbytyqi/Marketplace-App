import React, { useState } from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Screen from '../components/Screen';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Text from '../components/Text';
import { colors, spacing, typography } from '../config/theme';
import authApi from '../api/auth';
import useAuth from '../auth/useAuth';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(4).label('Password'),
});

function LoginScreen({ navigation }) {
  const auth = useAuth();
  const [loginFailed, setLoginFailed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async ({ email, password }) => {
    try {
      setLoginFailed(false);
      setError('');
      
      // Ensure email is lowercase for consistency
      const credentials = {
        email: email.toLowerCase(),
        password
      };
      
      console.log('Attempting login with credentials:', { 
        email: credentials.email,
        password: '****'
      });
      
      const result = await authApi.login(credentials);
      console.log('Login API response:', {
        ok: result.ok,
        status: result.status,
        problem: result.problem
      });
      
      if (!result.ok) {
        setLoginFailed(true);
        const errorMessage = result.data?.error || 
          result.problem === 'NETWORK_ERROR' ? 'Network error - check your connection' :
          result.problem === 'TIMEOUT_ERROR' ? 'Request timed out' :
          result.problem === 'SERVER_ERROR' ? 'Server error' :
          'Invalid email and/or password';
        setError(errorMessage);
        return;
      }

      const token = result.data;
      if (!token) {
        setLoginFailed(true);
        setError('No authentication token received');
        return;
      }

      console.log('Login successful, proceeding with token');
      await auth.logIn(token);
      
    } catch (error) {
      console.log('Login error:', error);
      setLoginFailed(true);
      setError('An unexpected error occurred');
    }
  };

  return (
    <Screen style={styles.screen}>
      <KeyboardAwareScrollView
        enableOnAndroid
        enableAutomaticScroll
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={20}
        contentContainerStyle={styles.scrollContent}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../assets/login.png')}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>Sell What You Don't Need</Text>
          </View>

          <View style={styles.formContainer}>
            <Formik
              initialValues={{ email: '', password: '' }}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              {({ handleChange, handleSubmit, errors, setFieldTouched, touched, values }) => (
                <>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="email"
                    label="Email"
                    onBlur={() => setFieldTouched('email')}
                    onChangeText={handleChange('email')}
                    error={errors.email}
                    touched={touched.email}
                    value={values.email}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                  />
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    icon="lock"
                    label="Password"
                    onBlur={() => setFieldTouched('password')}
                    onChangeText={handleChange('password')}
                    error={errors.password}
                    touched={touched.password}
                    value={values.password}
                    secureTextEntry
                    textContentType="password"
                  />
                  {loginFailed && error && (
                    <Text style={styles.error}>{error}</Text>
                  )}
                  <Button
                    title="Log In"
                    onPress={handleSubmit}
                    style={styles.loginButton}
                  />
                </>
              )}
            </Formik>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Button
                title="Sign Up"
                variant="ghost"
                onPress={() => navigation.navigate('Register')}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: spacing.m,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl * 2,
    marginBottom: spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
  },
  tagline: {
    fontSize: typography.sizes.headline,
    fontWeight: typography.weights.semibold,
    color: colors.text.secondary,
    marginTop: spacing.m,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: spacing.l,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButton: {
    marginTop: spacing.l,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    marginTop: spacing.s,
  },
  footer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
});

export default LoginScreen;
