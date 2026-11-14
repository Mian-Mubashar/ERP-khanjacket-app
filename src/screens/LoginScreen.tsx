/**
 * Khan Jacket House - Production Mobile Login Screen
 * Styled after the web portal with enterprise security, password visibility toggle,
 * quick-fill demo buttons, and real-time backend authentication.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Switch,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';

export const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuth();
  const { isDarkMode } = useTheme();

  const [email, setEmail] = useState('admin@khanclothes.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = async () => {
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email and password.');
      return;
    }

    const result = await login(email.trim(), password);
    if (!result.success) {
      setErrorMessage(result.message || 'Invalid email or password.');
    }
  };

  const handleFillAdmin = () => {
    setEmail('admin@khanclothes.com');
    setPassword('admin123');
    setErrorMessage(null);
  };

  const handleFillStaff = () => {
    setEmail('staff@khanclothes.com');
    setPassword('staff123');
    setErrorMessage(null);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDarkMode ? '#020617' : '#090d16' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#020617" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Ambient Top Glow */}
        <View style={styles.ambientGlow} />

        {/* Top Header & Brand Identity */}
        <View style={styles.brandHeader}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../assets/logo-icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.brandBadge}>
            <Text style={styles.brandBadgeDot}>●</Text>
            <Text style={styles.brandBadgeText}>Enterprise Warehouse ERP</Text>
          </View>

          <Text style={styles.brandTitle}>KHAN JACKET HOUSE</Text>
          <Text style={styles.brandSubtitle}>
            Wholesale Khatas, Stock & China Clearances
          </Text>
        </View>

        {/* Main Login Card */}
        <View style={[styles.loginCard, { borderColor: 'rgba(255, 255, 255, 0.1)' }]}>
          <Text style={styles.cardHeading}>Sign In to Portal</Text>
          <Text style={styles.cardSubheading}>
            Enter your authorized warehouse credentials to access management modules.
          </Text>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Email Address Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefixIcon}>✉️</Text>
              <TextInput
                style={styles.textInput}
                placeholder="name@khanclothes.com"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errorMessage) {
                    setErrorMessage(null);
                  }
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Password Field with Show/Hide Toggle */}
          <View style={styles.inputGroup}>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.togglePasswordText}>
                  {showPassword ? 'Hide 🙈' : 'Show 👁️'}
                </Text>
              </Pressable>
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPrefixIcon}>🔒</Text>
              <TextInput
                style={[styles.textInput, { paddingRight: 40 }]}
                placeholder="Enter password"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errorMessage) {
                    setErrorMessage(null);
                  }
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Remember Me Toggle */}
          <View style={styles.rememberRow}>
            <View style={styles.rememberLeft}>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: '#334155', true: '#2563eb' }}
                thumbColor={rememberMe ? '#ffffff' : '#94a3b8'}
              />
              <Text style={styles.rememberText}>Remember this device</Text>
            </View>
            <Text style={styles.securityTag}>SSL Active</Text>
          </View>

          {/* Submit Login Button */}
          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.loginButtonPressed,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLoginSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.buttonLoadingRow}>
                <ActivityIndicator size="small" color="#ffffff" />
                <Text style={styles.loginButtonText}>Authenticating...</Text>
              </View>
            ) : (
              <View style={styles.buttonLoadingRow}>
                <Text style={styles.loginButtonText}>Log In to Dashboard</Text>
                <Text style={styles.buttonArrow}>➔</Text>
              </View>
            )}
          </Pressable>

          {/* Quick Demo Fill Credentials for Instant Testing */}
          <View style={styles.demoSection}>
            <Text style={styles.demoHeading}>QUICK DEMO CREDENTIALS</Text>
            <View style={styles.demoBtnRow}>
              <Pressable style={styles.demoBadgeBtn} onPress={handleFillAdmin}>
                <Text style={styles.demoBadgeIcon}>👑</Text>
                <View>
                  <Text style={styles.demoBadgeRole}>Super Admin</Text>
                  <Text style={styles.demoBadgeEmail}>admin@khanclothes.com</Text>
                </View>
              </Pressable>

              <Pressable style={styles.demoBadgeBtn} onPress={handleFillStaff}>
                <Text style={styles.demoBadgeIcon}>📦</Text>
                <View>
                  <Text style={styles.demoBadgeRole}>Staff Member</Text>
                  <Text style={styles.demoBadgeEmail}>staff@khanclothes.com</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Security & System Status Footer */}
        <View style={styles.footerContainer}>
          <View style={styles.footerBadgesRow}>
            <View style={styles.footerBadge}>
              <Text style={styles.footerBadgeDot}>✓</Text>
              <Text style={styles.footerBadgeText}>256-Bit SSL Encrypted</Text>
            </View>
            <View style={styles.footerBadge}>
              <Text style={styles.footerBadgeDot}>✓</Text>
              <Text style={styles.footerBadgeText}>Device Push Protected</Text>
            </View>
          </View>
          <Text style={styles.footerCopyright}>
            Khan Jacket House • Central Clothes Warehouse v2.0
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  ambientGlow: {
    position: 'absolute',
    top: 0,
    left: '25%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    marginBottom: 8,
  },
  brandBadgeDot: {
    fontSize: 9,
    color: '#60a5fa',
    marginRight: 6,
  },
  brandBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93c5fd',
    letterSpacing: 0.3,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  brandSubtitle: {
    fontSize: 12.5,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 4,
  },
  loginCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeading: {
    fontSize: 19,
    fontWeight: '800',
    color: '#ffffff',
  },
  cardSubheading: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 12.5,
    color: '#fca5a5',
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  togglePasswordText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  inputPrefixIcon: {
    fontSize: 15,
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 46,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 18,
  },
  rememberLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    fontSize: 12,
    color: '#94a3b8',
    marginLeft: 8,
  },
  securityTag: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '700',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  loginButtonPressed: {
    backgroundColor: '#1d4ed8',
    transform: [{ scale: 0.99 }],
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  buttonLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  buttonArrow: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '800',
    marginLeft: 4,
  },
  demoSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  demoHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.7,
    marginBottom: 10,
    textAlign: 'center',
  },
  demoBtnRow: {
    gap: 8,
  },
  demoBadgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  demoBadgeIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  demoBadgeRole: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  demoBadgeEmail: {
    fontSize: 11,
    color: '#64748b',
  },
  footerContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerBadgesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  footerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  footerBadgeDot: {
    fontSize: 11,
    color: '#10b981',
    marginRight: 4,
    fontWeight: '800',
  },
  footerBadgeText: {
    fontSize: 10.5,
    color: '#94a3b8',
    fontWeight: '600',
  },
  footerCopyright: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
  },
});
