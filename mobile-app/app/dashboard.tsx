import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Platform } from 'react-native';
import { 
  Menu, Search, Bot, ClipboardList, Calculator, 
  Microscope, FlaskConical, Home, GraduationCap, 
  BarChart2, User, ArrowRight 
} from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { RefreshControl } from 'react-native';
import { authService } from '../services/auth.service';
import { analyticsService } from '../services/analytics.service';
import { submissionsService } from '../services/submissions.service';
import { AnalyticsStats, AnalyticsData, Topic, User as UserModel, RecentSubmission } from '../types/models';

export default function DashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [weakTopics, setWeakTopics] = useState<Topic[]>([]);
  const [recentSubs, setRecentSubs] = useState<RecentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState<UserModel | null>(null);

  const loadData = async () => {
    try {
        const u = await authService.getStoredUser();
        setUser(u);
        const [statsRes, analyticsRes, weakRes, subsRes] =
            await Promise.all([
                authService.getStats(),
                analyticsService.getDashboard(),
                analyticsService.getWeakTopics(),
                submissionsService.getMySubmissions(),
            ]);
        setStats(statsRes.data);
        setAnalytics(analyticsRes.data);
        setWeakTopics(weakRes.data?.results || weakRes.data || []);
        setRecentSubs(subsRes.data?.results?.slice(0, 5) || subsRes.data?.slice?.(0, 5) || []);
    } catch (err) {
        console.error('Dashboard load error:', err);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7eabfc" />}
      >
        
        {/* 1. Navbar */}
        <View style={styles.header}>
          <Pressable>
            <Menu color="#e2e8f0" size={24} />
          </Pressable>
          <Text style={styles.headerLogo}>Edgenie</Text>
          <Pressable onPress={() => router.push('/profile')}>
            <Image source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150?img=11' }} style={styles.profilePic} />
          </Pressable>
        </View>

        {/* 2. Hero Banner */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['rgba(74, 114, 206, 0.15)', 'rgba(30, 36, 48, 0.4)']}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Text style={styles.heroTitle}>Good morning,{'\n'}{user?.full_name?.split(' ')[0] || 'Student'} 👋</Text>
          <View style={styles.heroSubtitleRow}>
            <Text style={styles.heroSubtitleBase}>You're on a </Text>
            <Text style={styles.streakEmoji}>🔥 </Text>
            <Text style={styles.highlightText}>{stats?.streak_days || 0}-day streak! </Text>
            <Text style={styles.heroSubtitleBase}>Keep it up.</Text>
          </View>
        </View>

        {/* 3. Stats Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll} contentContainerStyle={styles.statsContainer}>
          <View style={[styles.statCard, { borderTopColor: '#7eabfc', borderTopWidth: 2 }]}>
            <Text style={[styles.statValue, { color: '#7eabfc' }]}>{stats?.total_questions_practiced || 0}</Text>
            <Text style={styles.statLabel}>QUESTIONS</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: '#10b981', borderTopWidth: 2 }]}>
            <Text style={[styles.statValue, { color: '#10b981' }]}>{stats?.overall_accuracy || 0}%</Text>
            <Text style={styles.statLabel}>ACCURACY</Text>
          </View>
          <View style={[styles.statCard, { borderTopColor: '#f5a623', borderTopWidth: 2, marginRight: 24 }]}>
            <Text style={[styles.statValue, { color: '#f5a623' }]}>{stats?.topics_covered_count || 0}</Text>
            <Text style={styles.statLabel}>TOPICS</Text>
          </View>
        </ScrollView>

        {/* 4. Action Buttons */}
        <View style={styles.actionContainer}>
          <Pressable style={[styles.actionBtn, styles.actionPrimary]} onPress={() => router.push('/search-start')}>
            <Search color="#101623" size={24} />
            <View style={styles.actionTextWrapper}>
              <Text style={[styles.actionTitle, { color: '#101623' }]}>Topical Search</Text>
              <Text style={[styles.actionDesc, { color: 'rgba(16, 22, 35, 0.7)' }]}>Find specific concepts fast</Text>
            </View>
          </Pressable>

          <Pressable style={styles.actionBtn}>
            <Bot color="#e6a8ff" size={24} />
            <View style={styles.actionTextWrapper}>
              <Text style={styles.actionTitle}>AI Tutor</Text>
              <Text style={styles.actionDesc}>Instant doubt clearing</Text>
            </View>
          </Pressable>

          <Pressable style={styles.actionBtn} onPress={() => router.push('/mock-exam')}>
            <ClipboardList color="#ffb955" size={24} />
            <View style={styles.actionTextWrapper}>
              <Text style={styles.actionTitle}>Mock Exam</Text>
              <Text style={styles.actionDesc}>Timed test conditions</Text>
            </View>
          </Pressable>
        </View>

        {/* 5. Focus Here */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Focus here 🎯</Text>
          <Text style={styles.viewAnalysis}>View Analysis</Text>
        </View>

        <View style={styles.focusContainer}>
          {weakTopics.length > 0 ? weakTopics.slice(0, 3).map((topic, i) => {
            const colors = [
              { bg: 'rgba(126, 171, 252, 0.15)', text: '#7eabfc', bar: '#f25c54' },
              { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', bar: '#f5a623' },
              { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', bar: '#7eabfc' }
            ];
            const color = colors[i % colors.length];
            return (
              <View key={topic.topic_id || i} style={styles.focusCard}>
                <View style={styles.focusTop}>
                  <View style={[styles.focusBadge, { backgroundColor: color.bg }]}>
                    <Text style={[styles.focusBadgeText, { color: color.text }]}>
                      {(topic.subject_name || 'TOPIC').toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.focusTopic}>{topic.topic_name}</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressBar, { backgroundColor: color.bar, width: `${Math.max(10, topic.accuracy || 0)}%` }]} />
                </View>
                <View style={styles.focusBottom}>
                  <Text style={styles.focusAccuracy}>Current Accuracy: {topic.accuracy}%</Text>
                  <Pressable style={styles.practiceBtn} onPress={() => router.push({ pathname: '/search-results', params: { query: topic.topic_name, subject_id: topic.subject_id }})}>
                    <Text style={styles.practiceBtnText}>Practice</Text>
                    <ArrowRight size={14} color="#101623" />
                  </Pressable>
                </View>
              </View>
            );
          }) : (
            <Text style={[styles.actionDesc, { textAlign: 'center', marginTop: 20 }]}>Keep practicing to find your weak topics!</Text>
          )}
        </View>

        {/* 6. Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <View style={styles.recentContainer}>
          {recentSubs.length > 0 ? recentSubs.map((sub, i) => {
             const date = new Date(sub.submitted_at);
             const now = new Date();
             const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
             let timeAgo = `${diff} mins ago`;
             if (diff > 60) timeAgo = `${Math.floor(diff/60)} hours ago`;
             if (diff > 1440) timeAgo = `${Math.floor(diff/1440)} days ago`;
             
             return (
              <Pressable key={sub.id} style={styles.recentRow} onPress={() => router.push({ pathname: '/question', params: { id: sub.question || sub.question_detail?.id }})}>
                <View style={[styles.recentIconBox, { backgroundColor: 'rgba(126, 171, 252, 0.1)' }]}>
                  <Calculator size={18} color="#7eabfc" />
                </View>
                <View style={styles.recentTextWrapper}>
                  <Text style={styles.recentTitle}>Q{sub.question_number} • {sub.topic || 'General'}</Text>
                  <Text style={styles.recentTime}>{timeAgo} • {sub.grading_status}</Text>
                </View>
                <Text style={[styles.recentScore, { color: (sub.score_percentage || 0) >= 50 ? '#10b981' : '#f25c54' }]}>
                  {sub.score_percentage != null ? `${sub.score_percentage}%` : '...'}
                </Text>
              </Pressable>
             );
          }) : (
            <Text style={[styles.actionDesc, { textAlign: 'center', marginTop: 10 }]}>No recent activity yet.</Text>
          )}
        </View>
        
        {/* Padding for fixed bottom tabs */}
        <View style={{ height: 100 }} />

      </ScrollView>

      {/* 7. Fixed Bottom Tabs (Visual) */}
      <View style={styles.bottomTabBar}>
        <Pressable style={styles.tabItem}>
          <Home size={24} color="#7eabfc" />
          <Text style={[styles.tabText, { color: '#7eabfc' }]}>HOME</Text>
        </Pressable>
        <Pressable style={styles.tabItem}>
          <Search size={22} color="#6b7280" />
          <Text style={styles.tabText}>SEARCH</Text>
        </Pressable>
        <Pressable style={styles.tabItem}>
          <GraduationCap size={24} color="#6b7280" />
          <Text style={styles.tabText}>EXAM</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/analytics')}>
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
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerLogo: {
    ...Theme.typography.displayMd,
    fontSize: 22,
    color: '#e2e8f0',
    fontStyle: 'italic',
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  heroCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    backgroundColor: '#1b1f28',
    marginBottom: 24,
    shadowColor: '#4f8ef7',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  heroTitle: {
    ...Theme.typography.headlineLg,
    fontSize: 26,
    lineHeight: 34,
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 8,
  },
  heroSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  heroSubtitleBase: {
    ...Theme.typography.bodyLg,
    fontSize: 14,
    color: '#d1d5db',
  },
  streakEmoji: {
    fontSize: 14,
  },
  highlightText: {
    ...Theme.typography.bodyLg,
    fontSize: 14,
    color: '#f5a623',
    fontWeight: 'bold',
  },
  statsScroll: {
    marginBottom: 24,
  },
  statsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  statCard: {
    backgroundColor: '#161a22',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    minWidth: 140,
  },
  statValue: {
    ...Theme.typography.displayMd,
    fontSize: 28,
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 4,
  },
  statLabel: {
    ...Theme.typography.labelMd,
    color: '#9ca3af',
    letterSpacing: 1,
    fontSize: 10,
  },
  actionContainer: {
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202630',
    borderRadius: 24,
    padding: 20,
    gap: 16,
  },
  actionPrimary: {
    backgroundColor: '#7eabfc',
  },
  actionTextWrapper: {
    flex: 1,
  },
  actionTitle: {
    ...Theme.typography.labelMd,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700',
    marginBottom: 2,
  },
  actionDesc: {
    ...Theme.typography.labelMd,
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '400',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    ...Theme.typography.headlineLg,
    fontSize: 22,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: '#ffffff',
  },
  viewAnalysis: {
    ...Theme.typography.labelMd,
    color: '#7eabfc',
    fontSize: 12,
  },
  focusContainer: {
    paddingHorizontal: 24,
    gap: 16,
    marginBottom: 32,
  },
  focusCard: {
    backgroundColor: '#161a22',
    borderRadius: 24,
    padding: 20,
  },
  focusTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  focusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  focusBadgeText: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    fontWeight: 'bold',
  },
  focusTopic: {
    ...Theme.typography.bodyLg,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#2b313a',
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  focusBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  focusAccuracy: {
    ...Theme.typography.labelMd,
    color: '#d1d5db',
    fontSize: 12,
  },
  practiceBtn: {
    backgroundColor: '#a3c0f7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  practiceBtnText: {
    ...Theme.typography.labelMd,
    color: '#101623',
    fontWeight: 'bold',
    fontSize: 12,
  },
  recentContainer: {
    paddingHorizontal: 24,
    gap: 8, // Thinner gap as per UI
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161a22', // Assuming card-like wrap or just view
    padding: 16,
    borderRadius: 20,
    marginBottom: 4,
  },
  recentIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recentTextWrapper: {
    flex: 1,
  },
  recentTitle: {
    ...Theme.typography.bodyLg,
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '600',
    marginBottom: 4,
  },
  recentTime: {
    ...Theme.typography.labelMd,
    fontSize: 11,
    color: '#9ca3af',
  },
  recentScore: {
    ...Theme.typography.bodyLg,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: Platform.OS === 'ios' ? 84 : 70,
    backgroundColor: '#0c1017', // Match bg
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
  },
});
