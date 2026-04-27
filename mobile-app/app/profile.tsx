import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Platform, Switch } from 'react-native';
import { 
  Bell, User, BookOpen, HelpCircle, LogOut, ChevronRight, Clock,
  Home, Search, FileText, TrendingUp, CheckCircle2, Sparkles 
} from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth.service';

import { User as UserModel, AnalyticsStats } from '../types/models';

export default function ProfileScreen() {
  const router = useRouter();
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [user, setUser] = useState<UserModel | null>(null);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);

  useEffect(() => {
    authService.getMe().then(res => setUser(res.data)).catch(console.error);
    authService.getStats().then(res => setStats(res.data)).catch(console.error);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerLogo}>Edgenie</Text>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconBtn}>
              <Bell color="#94a3b8" size={20} />
            </Pressable>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
              style={styles.headerProfilePic} 
            />
          </View>
        </View>

        {/* Profile Avatar Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <LinearGradient
              colors={['rgba(126, 171, 252, 0.8)', 'rgba(192, 132, 252, 0.8)']}
              style={styles.avatarRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
                style={styles.mainAvatar}
              />
            </LinearGradient>
            
            {/* Verified Badge */}
            <View style={styles.verifiedBadge}>
              <CheckCircle2 size={12} color="#1d4ed8" />
              <Text style={styles.verifiedText}>VERIFIED</Text>
            </View>
          </View>
          
          <Text style={styles.profileName}>{user?.full_name || 'Student'}</Text>
          <Text style={styles.profileSubtitle}>{user?.board || 'CAIE O-LEVEL'}</Text>
        </View>

        {/* Achievements */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <Pressable>
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll} contentContainerStyle={styles.achievementsContainer}>
          <View style={[styles.achievementPill, { borderColor: 'rgba(245, 166, 35, 0.3)', backgroundColor: 'rgba(245, 166, 35, 0.1)' }]}>
            <Text style={[styles.achievementPillText, { color: '#f5a623' }]}>{stats?.streak_days || 0}-day streak 🔥</Text>
          </View>
          <View style={[styles.achievementPill, { borderColor: 'rgba(126, 171, 252, 0.3)', backgroundColor: 'rgba(126, 171, 252, 0.1)' }]}>
            <Text style={[styles.achievementPillText, { color: '#a3c0f7' }]}>{stats?.total_questions_practiced || 0} questions ✓</Text>
          </View>
          <View style={[styles.achievementPill, { borderColor: 'rgba(16, 185, 129, 0.3)', backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
            <Text style={[styles.achievementPillText, { color: '#10b981' }]}>{stats?.best_subject ? `${stats.best_subject} Wiz 🧬` : 'Learning Wiz 🧠'}</Text>
          </View>
        </ScrollView>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          {/* Total Study Time (Full Width) */}
          <View style={[styles.statCard, { marginBottom: 16 }]}>
            <View style={styles.statFlexRow}>
              <View>
                <Text style={styles.statLabel}>TOTAL STUDY TIME</Text>
                <View style={styles.statValueRow}>
                  <Text style={styles.statValueBig}>{Math.round((stats?.total_practice_time_minutes || 0) / 60)}</Text>
                  <Text style={styles.statValueUnit}>HRS</Text>
                </View>
              </View>
              <View style={styles.timeIconContainer}>
                <Clock size={20} color="#a3c0f7" />
              </View>
            </View>
          </View>

          {/* Two Cols Stats */}
          <View style={styles.statsRow}>
            {/* Accuracy */}
            <View style={[styles.statCard, { flex: 1 }]}>
              <Text style={styles.statLabel}>ACCURACY</Text>
              <Text style={[styles.statValueBig, { color: '#10b981' }]}>{stats?.overall_accuracy || 0}%</Text>
              <View style={styles.statTrendRow}>
                <TrendingUp size={12} color="#10b981" />
                <Text style={styles.statTrendText}>+2% FROM LAST WEEK</Text>
              </View>
            </View>

            {/* Topics */}
            <View style={[styles.statCard, { flex: 1 }]}>
              <Text style={styles.statLabel}>TOPICS</Text>
              <Text style={[styles.statValueBig, { color: '#f5a623' }]}>{stats?.topics_covered_count || 0}</Text>
              <Text style={[styles.statTrendText, { color: '#f5a623', marginTop: 4 }]}>PRACTICED</Text>
            </View>
          </View>
        </View>

        {/* PRO Banner */}
        <View style={styles.proBannerContainer}>
          <LinearGradient
            colors={['#7eabfc', '#a855f7']}
            style={styles.proBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.proPill}>
              <Sparkles size={12} color="#ffffff" />
              <Text style={styles.proPillText}>PRO</Text>
            </View>
            <Text style={styles.proBannerTitle}>Unlock Your Full Potential with Pro</Text>
            <Text style={styles.proBannerDesc}>Get AI-powered insights & exclusive mock exams.</Text>
            <Pressable style={styles.proBannerBtn} onPress={() => router.push('/subscription')}>
              <Text style={styles.proBannerBtnText}>Learn More</Text>
            </Pressable>
          </LinearGradient>
        </View>

        {/* Settings */}
        <Text style={styles.settingsTitle}>Settings</Text>

        <View style={styles.settingsContainer}>
          
          <Pressable style={styles.settingsItem}>
            <View style={styles.settingsIconText}>
              <User size={20} color="#e2e8f0" />
              <Text style={styles.settingsItemText}>Personal Info</Text>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </Pressable>

          <Pressable style={styles.settingsItemBlocks}>
            <View style={styles.settingsItemRow}>
              <View style={styles.settingsIconText}>
                <BookOpen size={20} color="#e2e8f0" />
                <Text style={styles.settingsItemText}>My Subjects</Text>
              </View>
              <ChevronRight size={20} color="#64748b" />
            </View>
            <View style={styles.subjectsSpillBox}>
               {user?.enrollments?.map((enc: { subject: { name: string } }, i: number) => (
                 <View key={i} style={[styles.subjectPill, { backgroundColor: '#293040' }]}>
                   <Text style={styles.subjectPillText}>{enc.subject.name.toUpperCase()}</Text>
                 </View>
               )) || <Text style={{color: '#94a3b8', fontSize: 12}}>No subjects selected</Text>}
            </View>
          </Pressable>

          <View style={styles.settingsItem}>
            <View style={styles.settingsIconText}>
              <Bell size={20} color="#e2e8f0" />
              <Text style={styles.settingsItemText}>Study Reminders</Text>
            </View>
            <Switch
              trackColor={{ false: '#293040', true: '#a3c0f7' }}
              thumbColor={remindersEnabled ? '#1d4ed8' : '#e2e8f0'}
              value={remindersEnabled}
              onValueChange={setRemindersEnabled}
              style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
            />
          </View>

          <Pressable style={styles.settingsItem}>
            <View style={styles.settingsIconText}>
              <HelpCircle size={20} color="#e2e8f0" />
              <Text style={styles.settingsItemText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color="#64748b" />
          </Pressable>

        </View>

        {/* Logout */}
        <View style={styles.logoutContainer}>
          <Pressable style={styles.logoutBtn} onPress={handleLogout}>
             <LogOut size={20} color="#fca5a5" />
             <Text style={styles.logoutText}>Log Out from Account</Text>
          </Pressable>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <Pressable style={styles.tabItem} onPress={() => router.push('/dashboard')}>
          <Home size={24} color="#6b7280" />
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/search-start')}>
          <Search size={22} color="#6b7280" />
        </Pressable>
        <Pressable style={styles.tabItem}>
          <FileText size={22} color="#6b7280" />
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/analytics')}>
          <TrendingUp size={24} color="#6b7280" />
        </Pressable>
        <Pressable style={styles.tabItem}>
          <User size={24} color="#7eabfc" />
          <View style={styles.activeDot} />
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
    color: '#7eabfc',
    fontStyle: 'italic',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBtn: {
    padding: 4,
  },
  headerProfilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarRing: {
    padding: 3,
    borderRadius: 60,
  },
  mainAvatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: '#0c1017',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -4,
    alignSelf: 'center',
    backgroundColor: '#bfd2f8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 2,
    borderColor: '#0c1017',
  },
  verifiedText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1d4ed8',
    letterSpacing: 0.5,
  },
  profileName: {
    ...Theme.typography.displayMd,
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  profileSubtitle: {
    color: '#94a3b8',
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  viewAllText: {
    fontSize: 12,
    color: '#7eabfc',
    fontWeight: '600',
  },
  achievementsScroll: {
    marginBottom: 32,
  },
  achievementsContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  achievementPill: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  achievementPillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#161a22',
    borderRadius: 24,
    padding: 24,
  },
  statFlexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  statValueBig: {
    fontSize: 40,
    fontWeight: '700',
    color: '#a3c0f7',
    fontFamily: 'SpaceGrotesk_700Bold',
    lineHeight: 46,
  },
  statValueUnit: {
    fontSize: 14,
    color: '#a3c0f7',
    fontWeight: '600',
  },
  timeIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#1e293b',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  statTrendText: {
    fontSize: 9,
    color: '#10b981',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  proBannerContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  proBanner: {
    borderRadius: 24,
    padding: 24,
  },
  proPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
    gap: 4,
  },
  proPillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  proBannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 8,
    lineHeight: 28,
  },
  proBannerDesc: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 18,
    paddingRight: 16,
  },
  proBannerBtn: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  proBannerBtnText: {
    color: '#3b82f6',
    fontWeight: '700',
    fontSize: 14,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'SpaceGrotesk_700Bold',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  settingsContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  settingsItemBlocks: {
    paddingVertical: 16,
  },
  settingsItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingsIconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingsItemText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  subjectsSpillBox: {
    flexDirection: 'row',
    gap: 8,
    paddingLeft: 36, // align under text roughly
  },
  subjectPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subjectPillText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  logoutContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(252, 165, 165, 0.2)',
    paddingVertical: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(252, 165, 165, 0.05)',
  },
  logoutText: {
    color: '#fca5a5',
    fontSize: 15,
    fontWeight: '700',
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
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7eabfc',
  }
});
