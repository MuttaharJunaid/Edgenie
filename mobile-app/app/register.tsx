import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth.service';

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async () => {
    setLoading(true);
    setErrors({});
    try {
        const res = await authService.register({
            email, full_name: fullName,
            password, confirm_password: confirmPassword,
        });
        await authService.storeTokens(res.data.access, res.data.refresh);
        await authService.storeUser(res.data.user);
        router.replace('/subjects');
    } catch (error: unknown) {
        const err = error as any;
        const details = err.response?.data?.details || err.response?.data || {};
        if (typeof details === 'object' && !Array.isArray(details)) {
           setErrors(details);
        } else {
           setErrors({ non_field: 'Registration failed. Try again.' });
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
        
        {/* Top Header Row */}
        <View style={styles.topRow}>
          <View style={styles.stepsContainer}>
            <View style={[styles.stepDot, styles.stepDotActive]} />
            <View style={styles.stepDot} />
          </View>
          <Text style={styles.stepText}>01 / 02</Text>
        </View>

        {/* Header Texts */}
        <View style={styles.header}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Let’s get you set up</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          
          <View style={styles.inputGroup}>
            <User size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#6b7280"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
          {errors.full_name ? <Text style={{ color: '#ef4444', marginBottom: 12 }}>{errors.full_name}</Text> : null}

          <View style={styles.inputGroup}>
            <Mail size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email ? <Text style={{ color: '#ef4444', marginBottom: 12 }}>{errors.email}</Text> : null}

          <View style={styles.passwordContainer}>
            <View style={styles.inputGroup}>
              <Lock size={20} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#6b7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? (
                  <EyeOff size={20} color="#6b7280" />
                ) : (
                  <Eye size={20} color="#6b7280" />
                )}
              </Pressable>
            </View>

            {/* Password Strength Indicator */}
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBars}>
                <View style={[styles.strengthBar, { backgroundColor: '#ff9a8a' }]} />
                <View style={styles.strengthBar} />
                <View style={styles.strengthBar} />
              </View>
              <Text style={styles.strengthText}>TOO WEAK</Text>
            </View>
          </View>
          {errors.password ? <Text style={{ color: '#ef4444', marginBottom: 12 }}>{errors.password}</Text> : null}

          <View style={styles.inputGroup}>
            <Lock size={20} color="#6b7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#6b7280"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
            />
          </View>
          {errors.non_field ? <Text style={{ color: '#ef4444', marginBottom: 12, textAlign: 'center' }}>{errors.non_field}</Text> : null}

        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Pressable 
            style={({ pressed }) => [styles.continueButton, pressed && styles.pressedState, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.continueButtonText}>{loading ? 'Creating...' : 'Continue'}</Text>
            <ArrowRight size={20} color="#6b7280" />
          </Pressable>

          <Text style={styles.termsText}>
             By continuing you agree to our <Text style={styles.linkText}>Terms</Text> & <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c1017', // Very dark blue theme to match screenshot
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80, // Adding extra padding to simulate safe area manually or to match screenshot margin
    paddingBottom: 40,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepDot: {
    height: 4,
    width: 20,
    borderRadius: 2,
    backgroundColor: '#2b313a',
  },
  stepDotActive: {
    width: 24,
    backgroundColor: '#4f8ef7',
  },
  stepText: {
    ...Theme.typography.labelMd,
    color: '#9ca3af',
    letterSpacing: 1.2,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    ...Theme.typography.displayMd,
    fontSize: 26,
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk_700Bold', 
    marginBottom: 8,
  },
  subtitle: {
    ...Theme.typography.bodyLg,
    color: '#d1d5db',
    fontSize: 15,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1f28', // pill background
    borderRadius: 24, // heavily rounded
    height: 56,
    paddingHorizontal: 20,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...Theme.typography.bodyLg,
    color: '#ffffff',
    fontSize: 15,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  passwordContainer: {
    marginBottom: 8, // slight extra gap below strength
  },
  strengthContainer: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    backgroundColor: '#2b313a',
    borderRadius: 1.5,
  },
  strengthText: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#ff9a8a',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bottomSection: {
    marginTop: 48, 
    alignItems: 'center',
    gap: 24,
  },
  continueButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#242833', // inactive button color matching screenshot
    width: '100%',
    height: 56,
    borderRadius: 28,
    gap: 8,
  },
  continueButtonText: {
    ...Theme.typography.labelMd,
    fontSize: 16,
    color: '#6b7280', 
    fontWeight: 'bold',
  },
  termsText: {
    ...Theme.typography.labelMd,
    color: '#8a92a1',
    textAlign: 'center',
    fontSize: 12,
  },
  linkText: {
    color: '#4f8ef7',
    fontWeight: '600',
  },
  pressedState: {
    opacity: 0.8,
  },
});
