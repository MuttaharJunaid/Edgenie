import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
        setError('Please fill in all fields');
        return;
    }
    setLoading(true);
    setError('');
    try {
        const res = await authService.login({ email, password });
        await authService.storeTokens(res.data.access, res.data.refresh);
        await authService.storeUser(res.data.user);
        router.replace('/dashboard');
    } catch (error: unknown) {
        const err = error as any;
        const msg = err.response?.data?.message
            || err.response?.data?.details?.non_field_errors?.[0]
            || 'Invalid email or password';
        setError(msg);
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
        
        {/* Top Header Area */}
        <View style={styles.topSection}>
          <LinearGradient
            colors={['#423a3e', '#1e2025']} // Muddy purple/grey gradient exactly as the screenshot
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.logoContainer}>
             <View style={styles.iconCircleOuter}>
               <View style={styles.iconCircleInner}>
                 <Sparkles size={28} color="#d4ae73" fill="#d4ae73" />
               </View>
             </View>
            <Text style={styles.logoText}>Edgenie</Text>
          </View>
        </View>

        {/* Bottom Sheet Area */}
        <View style={styles.bottomSheet}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Ready to study smarter?</Text>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Mail size={20} color="#8a92a1" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#8a92a1"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Lock size={20} color="#8a92a1" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#8a92a1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                {showPassword ? (
                  <EyeOff size={20} color="#8a92a1" />
                ) : (
                  <Eye size={20} color="#8a92a1" />
                )}
              </Pressable>
            </View>
            
            <View style={styles.forgotPasswordRow}>
                <Pressable>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </Pressable>
            </View>

            {error ? <Text style={{ color: '#ef4444', marginBottom: 16, textAlign: 'center' }}>{error}</Text> : null}

            {/* Sign In Button */}
            <Pressable 
              style={({ pressed }) => [styles.signInButton, pressed && styles.pressedState, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={['#74a3f5', '#74a3f5']} // A flatter light blue to match standard design
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientFill}
              >
                <Text style={styles.signInText}>{loading ? 'Signing in...' : 'Sign in'}</Text>
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Button */}
            <Pressable style={({ pressed }) => [styles.googleButton, pressed && styles.pressedState]}>
              <Image 
                source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>New to Edgenie? </Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text style={styles.footerLink}>Create account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1b1f24', // Base dark color to match bottom sheet just in case
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#1e2025',
  },
  topSection: {
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  iconCircleOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircleInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    ...Theme.typography.displayMd,
    fontSize: 28,
    color: '#e4ecfa',
    fontStyle: 'italic',
    textShadowColor: 'rgba(116, 163, 245, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#14181f', // Dark slate
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    marginTop: -20, // Overlap the gradient
  },
  title: {
    ...Theme.typography.displayMd,
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    ...Theme.typography.bodyLg,
    color: '#d1d5db',
    marginBottom: 32,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b313a',
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...Theme.typography.bodyLg,
    color: '#ffffff',
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPasswordRow: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  forgotPasswordText: {
    ...Theme.typography.labelMd,
    color: '#a3c0f7', // Light blue link color
    fontSize: 13,
  },
  signInButton: {
    width: '100%',
    height: 56,
    borderRadius: Theme.borderRadius.full,
    overflow: 'hidden',
    marginTop: 8,
  },
  gradientFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    ...Theme.typography.labelMd,
    color: '#0d141d',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2b313a',
  },
  dividerText: {
    ...Theme.typography.labelMd,
    color: '#e2e8f0', // Brighter off-white
    paddingHorizontal: 16,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2b313a',
    height: 56,
    borderRadius: Theme.borderRadius.full,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    ...Theme.typography.bodyLg,
    color: '#ffffff',
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    ...Theme.typography.bodyLg,
    color: '#9ca3af',
  },
  footerLink: {
    ...Theme.typography.bodyLg,
    color: '#a3c0f7',
    fontWeight: 'bold',
  },
  pressedState: {
    opacity: 0.8,
  },
});
