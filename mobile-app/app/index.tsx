import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/theme';
import { useRouter } from 'expo-router';


const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      {/* Background with floating elements */}
      <View style={StyleSheet.absoluteFill}>
        <Text style={[styles.floatingMath, { top: height * 0.2, left: width * 0.15, transform: [{ rotate: '-15deg' }] }]}>∑</Text>
        <Text style={[styles.floatingMath, { top: height * 0.25, right: width * 0.15, transform: [{ rotate: '15deg' }, { scale: 1.2 }] }]}>⚗</Text>
        <Text style={[styles.floatingMath, { top: height * 0.55, left: width * 0.2, transform: [{ rotate: '-20deg' }, { scale: 1.1 }] }]}>📐</Text>
        <Text style={[styles.floatingMath, { top: height * 0.62, right: width * 0.15, transform: [{ rotate: '25deg' }, { scale: 1.3 }] }]}>DNA</Text>
      </View>

      <View style={styles.content}>
        
        <View style={styles.topSection}>
          <Text style={styles.logoText}>Edgenie</Text>
          <Text style={styles.subtitleText}>YOUR AI EXAM COACH</Text>
        </View>

        <View style={styles.middleSection}>
          <View style={styles.avatarGlowContainer}>
            <View style={styles.avatarInnerContainer}>
              <Image 
                source={require('../assets/images/ai-avatar.png')} 
                style={styles.avatarImage} 
                resizeMode="cover" 
              />
            </View>
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Pressable 
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressedState]}
            onPress={() => router.push('/dashboard')}
          >
            <LinearGradient
              colors={['#74a3f5', '#5a8df2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientFill}
            >
              <Text style={styles.primaryButtonText}>Get started</Text>
            </LinearGradient>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressedState]}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.secondaryButtonText}>I have an account</Text>
          </Pressable>

          <Text style={styles.footerText}>EMPOWERING THE NEXT GENERATION OF SCHOLARS</Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F17', // Very dark blue/black
  },
  floatingMath: {
    position: 'absolute',
    ...Theme.typography.displayMd,
    color: '#1a2333', 
    opacity: 0.6,
  },
  content: {
    flex: 1,
    paddingHorizontal: Theme.spacing.l,
    paddingTop: height * 0.15,
    paddingBottom: Theme.spacing.xl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  logoText: {
    ...Theme.typography.displayMd,
    color: '#e4ecfa',
    fontStyle: 'italic',
    textShadowColor: 'rgba(116, 163, 245, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 4,
  },
  subtitleText: {
    ...Theme.typography.labelMd,
    color: Theme.colors.onSurfaceVariant,
    letterSpacing: 1.5,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  avatarGlowContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(21, 28, 37, 0.3)', // Subtle outer ring
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInnerContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    backgroundColor: Theme.colors.surfaceContainerLow,
    shadowColor: '#4F8EF7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8, // Make it blend better with the dark theme
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    gap: Theme.spacing.m,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: Theme.borderRadius.full,
    overflow: 'hidden',
  },
  gradientFill: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    ...Theme.typography.labelMd,
    color: '#0d141d', // Dark text on light blue button
    fontSize: 14,
    fontWeight: 'bold',
  },
  secondaryButton: {
    width: '100%',
    height: 56,
    borderRadius: Theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(21, 28, 37, 0.4)', // Slightly transparent
    borderWidth: 1,
    borderColor: 'rgba(66, 71, 83, 0.3)',
  },
  secondaryButtonText: {
    ...Theme.typography.labelMd,
    color: '#c2c6d5',
    fontSize: 14,
  },
  pressedState: {
    opacity: 0.8,
  },
  footerText: {
    ...Theme.typography.labelMd,
    color: '#424753',
    fontSize: 8,
    letterSpacing: 1.2,
    marginTop: Theme.spacing.l,
    textTransform: 'uppercase',
  },
});
