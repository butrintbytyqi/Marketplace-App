import React, { useState } from "react";
import { StyleSheet, View, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import Text from "../components/Text";
import usersApi from "../api/users";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import { colors, spacing, shadows, borderRadius } from "../config/theme";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

function RegisterScreen({ navigation }) {
  const auth = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("Attempting registration...");
      const registerResult = await usersApi.register({
        name: formData.name,
        email: formData.email.toLowerCase(),
        password: formData.password
      });
      
      if (!registerResult.ok) {
        console.log("Registration failed:", registerResult.data);
        setError(registerResult.data?.error || "An unexpected error occurred");
        return;
      }

      Alert.alert(
        "Registration Successful! ",
        "Your account has been created. Please login to continue.",
        [
          {
            text: "Login",
            onPress: () => navigation.navigate("Login"),
            style: "default"
          }
        ],
        { 
          cancelable: false,
          userInterfaceStyle: 'light'
        }
      );
      
    } catch (error) {
      console.log("Registration error:", error);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Text variant="title1" weight="bold" style={styles.title}>
              Create Account
            </Text>
            <Text variant="body" color="secondary" style={styles.subtitle}>
              Enter your details to get started
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text variant="body" weight="medium" style={styles.inputLabel}>
                  Full Name
                </Text>
                <Text variant="caption1" color="secondary" style={styles.inputHint}>
                  Enter your name as it appears on your ID
                </Text>
                <TextInput
                  placeholder="John Doe"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  autoCapitalize="words"
                  autoCorrect={false}
                  leftIcon="account"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text variant="body" weight="medium" style={styles.inputLabel}>
                  Email Address
                </Text>
                <Text variant="caption1" color="secondary" style={styles.inputHint}>
                  We'll send you a verification email
                </Text>
                <TextInput
                  placeholder="email@example.com"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  leftIcon="email"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text variant="body" weight="medium" style={styles.inputLabel}>
                  Password
                </Text>
                <Text variant="caption1" color="secondary" style={styles.inputHint}>
                  Must be at least 4 characters long
                </Text>
                <TextInput
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  leftIcon="lock"
                />
              </View>

              {error ? (
                <Text variant="caption1" style={styles.error}>
                  {error}
                </Text>
              ) : null}

              <Button
                title="Create Account"
                onPress={handleSubmit}
                loading={loading}
                style={styles.button}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 0,
    padding: spacing.m,
  },
  container: {
    flex: 0,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.l,
  },
  form: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.m,
    padding: spacing.m,
    ...shadows.small,
  },
  inputGroup: {
    marginBottom: spacing.m,
  },
  inputLabel: {
    marginBottom: spacing.xs,
  },
  inputHint: {
    marginBottom: spacing.s,
  },
  error: {
    color: colors.danger,
    marginTop: spacing.s,
    marginBottom: spacing.s,
  },
  button: {
    marginTop: spacing.m,
  },
});

export default RegisterScreen;
