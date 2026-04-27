import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Platform } from 'react-native';
import { Menu, CheckCircle2, Check, X, BookOpen, HelpCircle, BarChart2, Award, Star } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function SubscriptionScreen() {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Menu color="#e2e8f0" size={24} />
          </Pressable>
          <Text style={styles.headerLogo}>Edgenie</Text>
          <View style={styles.headerRight}>
            <Text style={styles.headerProText}>Pro</Text>
            <Pressable onPress={() => router.push('/profile')}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.profilePic} />
            </Pressable>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Unlock your <Text style={{ color: '#a3c0f7' }}>full potential</Text>
          </Text>
          <Text style={styles.subtitle}>
            Join thousands of students using AI-powered insights to master their exams in half the time.
          </Text>
        </View>

        {/* Toggle */}
        <View style={styles.toggleWrapper}>
          <Text style={[styles.toggleText, !isAnnual ? styles.toggleTextActive : {}]}>Monthly</Text>
          
          <Pressable 
            style={styles.toggleTrack} 
            onPress={() => setIsAnnual(!isAnnual)}
          >
            <View style={[styles.toggleThumb, isAnnual ? styles.toggleThumbRight : styles.toggleThumbLeft]} />
          </Pressable>

          <View style={styles.annualWrapper}>
            <Text style={[styles.toggleText, isAnnual ? styles.toggleTextActive : {}]}>Annual</Text>
            <View style={styles.saveBadge}>
              <Text style={styles.saveBadgeText}>SAVE 20%</Text>
            </View>
          </View>
        </View>

        {/* Cards Wrapper */}
        <View style={styles.cardsContainer}>
          
          {/* Pro Card (Glowing) */}
          <View style={styles.proCardGlowLayer}>
            <LinearGradient
              colors={['rgba(126, 171, 252, 0.4)', 'rgba(126, 171, 252, 0)']}
              style={[StyleSheet.absoluteFillObject, styles.proCardGlowEffect]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <View style={styles.proCard}>
              <View style={styles.proHeader}>
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>MOST POPULAR</Text>
                </View>
                {/* Custom Award Ribbon Icon */}
                <View style={styles.ribbonIcon}>
                  <Award size={24} color="#e2e8f0" fill="rgba(226, 232, 240, 0.2)" />
                </View>
              </View>

              <Text style={styles.planTitle}>Edgenie Pro</Text>
              
              <View style={styles.priceContainer}>
                <Text style={styles.priceNum}>${isAnnual ? '79.99' : '9.99'}</Text>
                <Text style={styles.pricePeriod}>{isAnnual ? '/yr' : '/mo'}</Text>
              </View>
              <Text style={styles.priceSubtext}>
                {isAnnual ? 'Billed annually. Equivalent to $6.66/mo' : 'Billed monthly. Cancel anytime.'}
              </Text>

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <Text style={styles.featureText}>Unlimited AI Tutor credits</Text>
                </View>
                <View style={styles.featureItem}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <Text style={styles.featureText}>Advanced Topic Analytics</Text>
                </View>
                <View style={styles.featureItem}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <Text style={styles.featureText}>Priority Mock Exam generation</Text>
                </View>
                <View style={styles.featureItem}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <Text style={styles.featureText}>Ad-free experience</Text>
                </View>
                <View style={styles.featureItem}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <Text style={styles.featureText}>Export to PDF</Text>
                </View>
              </View>

              <Pressable style={styles.upgradeBtn}>
                <LinearGradient
                  colors={['#7eabfc', '#4f8ef7']}
                  style={[StyleSheet.absoluteFillObject, styles.upgradeBtnInner]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.upgradeBtnText}>Upgrade to Pro</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          {/* Free Card */}
          <View style={styles.freeCard}>
            <Text style={styles.planTitle}>Free</Text>
            <Text style={styles.freeSubtext}>Essentials for getting started.</Text>
            
            <View style={styles.priceContainer}>
              <Text style={styles.priceNum}>$0</Text>
              <Text style={styles.pricePeriod}>/mo</Text>
            </View>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Check size={16} color="#94a3b8" />
                <Text style={[styles.featureText, { color: '#94a3b8' }]}>Basic Topic Analytics</Text>
              </View>
              <View style={styles.featureItem}>
                <Check size={16} color="#94a3b8" />
                <Text style={[styles.featureText, { color: '#94a3b8' }]}>5 AI Credits per day</Text>
              </View>
              <View style={styles.featureItem}>
                <X size={16} color="#94a3b8" />
                <Text style={[styles.featureText, { color: '#64748b' }]}>No PDF Exports</Text>
              </View>
            </View>

            <Pressable style={styles.currentBtn} onPress={() => router.push('/dashboard')}>
              <Text style={styles.currentBtnText}>Current Plan</Text>
            </Pressable>
          </View>

        </View>

        {/* Social Proof */}
        <View style={styles.socialProofContainer}>
          <View style={styles.avatarGroup}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=33' }} style={[styles.socialAvatar, { zIndex: 3 }]} />
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=44' }} style={[styles.socialAvatar, { zIndex: 2, marginLeft: -12 }]} />
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=55' }} style={[styles.socialAvatar, { zIndex: 1, marginLeft: -12 }]} />
            <View style={[styles.socialAvatar, styles.socialPill, { zIndex: 0, marginLeft: -12 }]}>
              <Text style={styles.socialPillText}>+10k</Text>
            </View>
          </View>
          <Text style={styles.socialProofText}>
            Trusted by <Text style={{ color: '#fff', fontWeight: 'bold' }}>10k+ students</Text> worldwide for exam excellence.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomTabBar}>
        <Pressable style={styles.tabItem} onPress={() => router.push('/dashboard')}>
          <BookOpen size={24} color="#6b7280" />
          <Text style={styles.tabText}>STUDY</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/search-start')}>
          <HelpCircle size={22} color="#6b7280" />
          <Text style={styles.tabText}>PRACTICE</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/analytics')}>
          <BarChart2 size={24} color="#6b7280" />
          <Text style={styles.tabText}>INSIGHTS</Text>
        </Pressable>
        <Pressable style={styles.tabItem}>
          <View style={styles.proTabIcon}>
            <Award size={22} color="#7eabfc" />
          </View>
          <Text style={[styles.tabText, { color: '#7eabfc', marginTop: 4 }]}>PRO</Text>
          <View style={styles.proDot} />
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
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  headerLogo: {
    ...Theme.typography.displayMd,
    fontSize: 22,
    color: '#e2e8f0',
    fontStyle: 'italic',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerProText: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  titleContainer: {
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    ...Theme.typography.displayMd,
    fontSize: 32,
    lineHeight: 40,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  subtitle: {
    ...Theme.typography.bodyLg,
    color: '#d1d5db',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
  },
  toggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 16,
  },
  toggleText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  toggleTrack: {
    width: 48,
    height: 24,
    backgroundColor: '#293040',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    backgroundColor: '#a3c0f7',
    borderRadius: 10,
    position: 'absolute',
  },
  toggleThumbLeft: {
    left: 2,
  },
  toggleThumbRight: {
    right: 2,
  },
  annualWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveBadge: {
    backgroundColor: 'rgba(245, 166, 35, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(245, 166, 35, 0.3)',
  },
  saveBadgeText: {
    color: '#f5a623',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  cardsContainer: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  proCardGlowLayer: {
    borderRadius: 26,
    padding: 2,
    position: 'relative',
    backgroundColor: '#1b1f28',
    elevation: 10,
    shadowColor: '#a3c0f7',
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
  },
  proCardGlowEffect: {
    borderRadius: 26,
    opacity: 0.5,
  },
  proCard: {
    backgroundColor: '#1b1f28',
    borderRadius: 24,
    padding: 24,
  },
  proHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  popularBadge: {
    backgroundColor: '#293040',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#a3c0f7',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  ribbonIcon: {
    padding: 4,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  priceNum: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'SpaceGrotesk_700Bold',
    letterSpacing: -1,
  },
  pricePeriod: {
    fontSize: 16,
    color: '#94a3b8',
    marginLeft: 4,
  },
  priceSubtext: {
    color: '#7eabfc',
    fontSize: 12,
    marginBottom: 24,
  },
  featuresList: {
    gap: 16,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    color: '#e2e8f0',
    fontSize: 14,
  },
  upgradeBtn: {
    shadowColor: '#4f8ef7',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  upgradeBtnInner: {
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeBtnText: {
    color: '#101623',
    fontWeight: 'bold',
    fontSize: 16,
  },
  freeCard: {
    backgroundColor: '#161a22',
    borderRadius: 24,
    padding: 24,
  },
  freeSubtext: {
    color: '#e2e8f0',
    fontSize: 12,
    marginBottom: 16,
  },
  currentBtn: {
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#293040',
  },
  currentBtnText: {
    color: '#e2e8f0',
    fontWeight: 'bold',
    fontSize: 14,
  },
  socialProofContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  avatarGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  socialAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#0c1017',
  },
  socialPill: {
    backgroundColor: '#1c212c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialPillText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  socialProofText: {
    color: '#94a3b8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: Platform.OS === 'ios' ? 90 : 70,
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
    position: 'relative',
  },
  tabText: {
    ...Theme.typography.labelMd,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  proTabIcon: {
    backgroundColor: 'rgba(126, 171, 252, 0.1)',
    width: 48,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -4,
  },
  proDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7eabfc',
    position: 'absolute',
    bottom: -8,
  }
});
