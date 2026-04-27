import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform, ScrollView, Dimensions } from 'react-native';
import { Menu, Search, Home, GraduationCap, BarChart2, User, CheckCircle2, Sparkles, ChevronDown, ArrowRight } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Circular Progress Component using SVG
const CircularProgress = ({ size, progress, strokeWidth }: { size: number, progress: number, strokeWidth: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background Circle */}
        <Circle
          stroke="#1e2430"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle with Glow trick via multiple rendering */}
        <Circle
          stroke="rgba(16, 185, 129, 0.3)" // soft glow
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth + 8}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          originX={size / 2}
          originY={size / 2}
          rotation="-90"
        />
        <Circle
          stroke="#10b981" // vibrant green
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          originX={size / 2}
          originY={size / 2}
          rotation="-90"
        />
      </Svg>
      {/* Inner Content Component */}
      <View style={styles.circularContent}>
        <Text style={styles.circularScoreBig}>3/4</Text>
        <Text style={styles.circularScoreText}>75% Accuracy</Text>
      </View>
    </View>
  );
};

export default function FeedbackScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/dashboard')}>
          <Menu color="#e2e8f0" size={24} />
        </Pressable>
        <Text style={styles.headerLogo}>Edgenie</Text>
        <Pressable onPress={() => router.push('/profile')}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.profilePic} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Your Result Header */}
        <View style={styles.resultHeader}>
          <Text style={styles.resultLabel}>YOUR RESULT</Text>
          <View style={styles.resultLine} />
        </View>

        {/* Circular Progress Section */}
        <View style={styles.progressSection}>
          <CircularProgress size={180} progress={75} strokeWidth={12} />
        </View>

        {/* Status Message */}
        <View style={styles.statusBox}>
          <View style={styles.statusPill}>
            <CheckCircle2 size={16} color="#10b981" />
            <Text style={styles.statusPillText}>Well done! Strong answer.</Text>
          </View>
          <Text style={styles.statusDescription}>
            You demonstrated a solid understanding of the molecular bonds in this structure.
          </Text>
        </View>

        {/* AI Feedback Card */}
        <View style={styles.aiFeedbackCard}>
          <LinearGradient
            colors={['#10b981', '#3b82f6']}
            style={styles.aiFeedbackLeftBorder}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <View style={styles.aiFeedbackContent}>
            <View style={styles.aiFeedbackHeader}>
              <View style={styles.aiIconWrapper}>
                <Sparkles size={16} color="#a3c0f7" />
              </View>
              <Text style={styles.aiFeedbackTitle}>AI Feedback</Text>
            </View>

            <Text style={styles.aiFeedbackText}>
              Your explanation of the <Text style={styles.textBlueHighlight}>Hydrogen bonding</Text> was precise and technically accurate. However, you missed mentioning the specific <Text style={styles.textGoldHighlight}>electronegativity difference</Text> between Oxygen and Hydrogen which would have secured that final 4th mark.
            </Text>
          </View>
        </View>

        {/* Areas for Growth */}
        <Text style={styles.growthHeading}>Areas for Growth</Text>
        <View style={styles.growthCardsContainer}>
          
          <View style={styles.growthCard}>
            <View style={styles.growthDot} />
            <View style={styles.growthCardContent}>
              <Text style={styles.growthCardTitle}>Quantify your observations</Text>
              <Text style={styles.growthCardDesc}>
                Use specific numerical values for bond lengths when describing covalent structures.
              </Text>
            </View>
          </View>

          <View style={styles.growthCard}>
            <View style={styles.growthDot} />
            <View style={styles.growthCardContent}>
              <Text style={styles.growthCardTitle}>Link to Polarity</Text>
              <Text style={styles.growthCardDesc}>
                Always conclude molecular structure questions by stating the overall polarity of the molecule.
              </Text>
            </View>
          </View>

        </View>

        {/* Accordion List */}
        <Pressable style={styles.accordionWrap}>
          <Text style={styles.accordionText}>View Marking Scheme</Text>
          <ChevronDown size={20} color="#a1a9b8" />
        </Pressable>

        {/* Action Buttons */}
        <View style={styles.actionsBox}>
          <Pressable style={({ pressed }) => [styles.btnPrimary, pressed && styles.pressed]}>
            <LinearGradient
              colors={['#8facfb', '#74a3f5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnGradient}
            >
              <Text style={styles.btnPrimaryText}>Try similar questions</Text>
              <ArrowRight size={18} color="#0c1017" />
            </LinearGradient>
          </Pressable>

          <Pressable style={({ pressed }) => [styles.btnSecondary, pressed && styles.pressed]}>
            <Text style={styles.btnSecondaryText}>Save to Review Later</Text>
          </Pressable>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Bottom Tabs */}
      <View style={styles.bottomTabBar}>
        <Pressable style={styles.tabItem} onPress={() => router.push('/dashboard')}>
          <Home size={22} color="#6b7280" />
          <Text style={styles.tabText}>HOME</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/search-start')}>
          <Search size={22} color="#6b7280" />
          <Text style={styles.tabText}>SEARCH</Text>
        </Pressable>
        <Pressable style={styles.tabItem}>
          <GraduationCap size={24} color="#e2e8f0" fill="rgba(255, 255, 255, 0.1)" />
          <Text style={[styles.tabText, { color: '#e2e8f0' }]}>EXAM</Text>
        </Pressable>
        <Pressable style={styles.tabItem}>
          <BarChart2 size={22} color="#6b7280" />
          <Text style={styles.tabText}>ANALYTICS</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/profile')}>
          <User size={22} color="#6b7280" />
          <Text style={styles.tabText}>PROFILE</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c1017',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 24,
  },
  headerLogo: {
    ...Theme.typography.headlineLg,
    fontSize: 22,
    color: '#e2e8f0',
    fontStyle: 'italic',
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resultLabel: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#a1a9b8',
    marginBottom: 6,
  },
  resultLine: {
    width: 24,
    height: 2,
    backgroundColor: '#7eabfc',
    borderRadius: 1,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  circularContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularScoreBig: {
    ...Theme.typography.displayMd,
    fontSize: 54,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#ffffff',
    lineHeight: 60,
  },
  circularScoreText: {
    ...Theme.typography.bodyLg,
    fontSize: 14,
    color: '#a3c0f7',
  },
  statusBox: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    marginBottom: 16,
  },
  statusPillText: {
    ...Theme.typography.labelMd,
    color: '#10b981',
    fontWeight: 'bold',
  },
  statusDescription: {
    ...Theme.typography.bodyLg,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 22,
  },
  aiFeedbackCard: {
    flexDirection: 'row',
    backgroundColor: '#161a22',
    borderRadius: 24,
    marginBottom: 32,
    overflow: 'hidden',
  },
  aiFeedbackLeftBorder: {
    width: 4,
  },
  aiFeedbackContent: {
    flex: 1,
    padding: 24,
  },
  aiFeedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  aiIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1b2333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiFeedbackTitle: {
    ...Theme.typography.headlineLg,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  aiFeedbackText: {
    ...Theme.typography.bodyLg,
    color: '#d1d5db',
    lineHeight: 24,
  },
  textBlueHighlight: {
    color: '#a3c0f7',
    fontWeight: '600',
  },
  textGoldHighlight: {
    color: '#f5a623',
    fontWeight: '600',
  },
  growthHeading: {
    ...Theme.typography.headlineLg,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 16,
  },
  growthCardsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  growthCard: {
    flexDirection: 'row',
    backgroundColor: '#161a22',
    padding: 20,
    borderRadius: 20,
    alignItems: 'flex-start',
    gap: 12,
  },
  growthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginTop: 6,
  },
  growthCardContent: {
    flex: 1,
  },
  growthCardTitle: {
    ...Theme.typography.bodyLg,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  growthCardDesc: {
    ...Theme.typography.labelMd,
    color: '#a1a9b8',
    lineHeight: 18,
  },
  accordionWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#161a22',
    padding: 20,
    borderRadius: 20,
    marginBottom: 32,
  },
  accordionText: {
    ...Theme.typography.bodyLg,
    color: '#ffffff',
    fontWeight: '600',
  },
  actionsBox: {
    gap: 16,
  },
  btnPrimary: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnPrimaryText: {
    ...Theme.typography.labelMd,
    fontSize: 15,
    color: '#0c1017',
    fontWeight: 'bold',
  },
  btnSecondary: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#2b313a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSecondaryText: {
    ...Theme.typography.labelMd,
    fontSize: 15,
    color: '#a1a9b8',
  },
  pressed: {
    opacity: 0.8,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: Platform.OS === 'ios' ? 84 : 70,
    backgroundColor: '#0c1017', 
    borderTopWidth: 1,
    borderTopColor: '#1e2430',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
  },
  tabText: {
    ...Theme.typography.labelMd,
    fontSize: 9,
    letterSpacing: 0.5,
    color: '#6b7280',
  },
});
