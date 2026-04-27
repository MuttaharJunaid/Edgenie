import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Menu, Home, Search, GraduationCap, BarChart2, User, TrendingUp, Flame, Check } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle } from 'react-native-svg';
import { analyticsService } from '../services/analytics.service';
import { authService } from '../services/auth.service';

import { AnalyticsData } from '../types/models';

export default function AnalyticsScreen() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('7 days');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    authService.getStoredUser().then(u => setUser(u));
    analyticsService.getDashboard()
        .then(res => setData(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/dashboard')}>
          <Menu color="#e2e8f0" size={24} />
        </Pressable>
        <Text style={styles.headerLogo}>Edgenie</Text>
        <Pressable onPress={() => router.push('/profile')}>
          <Image source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150?img=11' }} style={styles.profilePic} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Title & Subtitle */}
        <Text style={styles.pageTitle}>Your Progress</Text>
        <Text style={styles.pageSubtitle}>
          You've practiced {data?.total_questions_practiced || 0} questions so far. Keep it up!
        </Text>

        {/* Time Range Toggle */}
        <View style={styles.timeToggleContainer}>
          {['7 days', '30 days', '90 days'].map((range) => {
            const isActive = timeRange === range;
            return (
              <Pressable 
                key={range} 
                style={[styles.timeToggleBtn, isActive && styles.timeToggleBtnActive]}
                onPress={() => setTimeRange(range)}
              >
                <Text style={[styles.timeToggleText, isActive && styles.timeToggleTextActive]}>
                  {range}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* STUDY TIME CHART */}
        <View style={styles.chartCard}>
          {loading ? <ActivityIndicator color="#8bb4f6" style={{marginVertical: 20}}/> : (
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartLabel}>STUDY TIME</Text>
                <View style={styles.chartValueRow}>
                  <Text style={styles.chartValueBig}>{data?.total_time_minutes || 0}</Text>
                  <Text style={styles.chartValueUnit}>mins</Text>
                </View>
              </View>
              <View style={styles.trendPill}>
                <TrendingUp size={12} color="#10b981" />
                <Text style={styles.trendText}>+12%</Text>
              </View>
            </View>
          )}

          <View style={styles.svgContainer}>
            <Svg height="120" width="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
              <Defs>
                <SvgLinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="#8bb4f6" stopOpacity="0.3" />
                  <Stop offset="1" stopColor="#8bb4f6" stopOpacity="0.0" />
                </SvgLinearGradient>
              </Defs>
              {/* Area */}
              <Path 
                d="M 0 90 C 40 85, 60 20, 100 35 C 130 45, 140 85, 160 80 C 180 75, 200 10, 220 10 C 240 10, 260 85, 300 60 L 300 100 L 0 100 Z" 
                fill="url(#grad)" 
              />
              {/* Stroke */}
              <Path 
                d="M 0 90 C 40 85, 60 20, 100 35 C 130 45, 140 85, 160 80 C 180 75, 200 10, 220 10 C 240 10, 260 85, 300 60" 
                fill="none" 
                stroke="#8bb4f6" 
                strokeWidth="3" 
              />
              {/* Data points visually matching original a bit */}
              <Circle cx="100" cy="35" r="3" fill="#ffffff" />
              <Circle cx="160" cy="80" r="3" fill="#ffffff" />
              <Circle cx="220" cy="10" r="3" fill="#ffffff" />
            </Svg>
          </View>

          <View style={styles.xAxisRow}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <Text key={day} style={styles.xAxisText}>{day}</Text>
            ))}
          </View>
        </View>

        {/* ACCURACY TREND */}
        <View style={styles.chartCard}>
          <Text style={styles.chartLabel}>ACCURACY TREND</Text>
          <Text style={styles.accuracyValueBig}>{data?.overall_accuracy || 0}%</Text>

          <View style={styles.barChartContainer}>
            {[45, 55, 65, 75, 60, 50, 95].map((height, index) => {
              const isLast = index === 6;
              return (
                <View key={index} style={styles.barWrapper}>
                  {/* Outer glow container for the last one */}
                  <View style={[
                    styles.barFill, 
                    { height: `${height}%` },
                    isLast ? styles.barFillActive : styles.barFillInactive
                  ]} />
                </View>
              );
            })}
          </View>

          <Text style={styles.accuracyFooter}>
            Higher than <Text style={styles.footerBold}>94%</Text> of students in your region.
          </Text>
        </View>

        {/* SUBJECT PERFORMANCE */}
        <View style={styles.performanceCard}>
          <View style={styles.performanceHeader}>
            <Text style={styles.performanceLabel}>SUBJECT{'\n'}PERFORMANCE</Text>
            <View style={styles.legendRow}>
              {(data?.subjects || []).slice(0,3).map((sub: any, i: number) => {
                 const colors = ['#8bb4f6', '#10b981', '#f5a623'];
                 const subjName = typeof sub.subject === 'string' ? sub.subject : (sub.subject?.name || 'Topic');
                 return (
                   <View key={i} style={styles.legendItem}>
                     <View style={[styles.legendDot, { backgroundColor: colors[i] }]} />
                     <Text style={styles.legendText}>{subjName.length > 8 ? subjName.slice(0,8) + '..' : subjName}</Text>
                   </View>
                 );
              })}
            </View>
          </View>

          {/* Subjects Bars */}
          {data?.subjects?.map((sub: any, i: number) => {
             const colors = ['#8bb4f6', '#10b981', '#f5a623'];
             const color = colors[i % colors.length];
             const subjName = typeof sub.subject === 'string' ? sub.subject : (sub.subject?.name || 'Topic');
             return (
              <View key={i} style={styles.subjectRow}>
                <View style={styles.subjectRowTop}>
                  <Text style={styles.subjectTitle}>{subjName}</Text>
                  <Text style={[styles.subjectScore, { color }]}>{sub.accuracy}%</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressBar, { backgroundColor: color, width: `${sub.accuracy}%` }]} />
                </View>
              </View>
             );
          })}
        </View>


        {/* ACHIEVEMENTS */}
        <Text style={styles.achievementsHeading}>ACHIEVEMENTS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll} contentContainerStyle={styles.achievementsContent}>
          <View style={styles.achievementCard}>
            <View style={styles.achievementIconBox}>
              <Flame size={24} color="#f5a623" fill="#f5a623" />
            </View>
            <Text style={styles.achievementTitle}>{data?.streak_days || 0}-day streak</Text>
            <Text style={styles.achievementDesc}>Consistency King</Text>
          </View>

          <View style={styles.achievementCard}>
            <View style={styles.achievementIconBox}>
              <Check size={24} color="#ffffff" strokeWidth={3} />
            </View>
            <Text style={styles.achievementTitle}>100 questions</Text>
            <Text style={styles.achievementDesc}>Knowledge Hunter</Text>
          </View>
        </ScrollView>

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
        <Pressable style={styles.tabItem} onPress={() => router.push('/mock-exam')}>
          <GraduationCap size={22} color="#6b7280" />
          <Text style={styles.tabText}>EXAM</Text>
        </Pressable>
        <Pressable style={styles.tabItem}>
          <View style={styles.activeTabWrapper}>
            <BarChart2 size={24} color="#ffffff" />
            <Text style={[styles.tabText, { color: '#ffffff' }]}>ANALYTICS</Text>
            <View style={styles.activeTabDot} />
          </View>
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
  pageTitle: {
    ...Theme.typography.displayMd,
    fontSize: 32,
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 8,
  },
  pageSubtitle: {
    ...Theme.typography.bodyLg,
    color: '#a1a9b8',
    marginBottom: 24,
    lineHeight: 22,
  },
  timeToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#161a22',
    borderRadius: 20,
    padding: 4,
    marginBottom: 32,
  },
  timeToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 16,
  },
  timeToggleBtnActive: {
    backgroundColor: '#a3c0f7',
  },
  timeToggleText: {
    ...Theme.typography.labelMd,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8a92a1',
  },
  timeToggleTextActive: {
    color: '#0c1017',
  },
  chartCard: {
    backgroundColor: '#161a22',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  chartLabel: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#a1a9b8',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chartValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  chartValueBig: {
    ...Theme.typography.displayMd,
    fontSize: 32,
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  chartValueUnit: {
    ...Theme.typography.bodyLg,
    color: '#6b7280',
    fontSize: 14,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginTop: 4,
  },
  trendText: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#10b981',
    fontWeight: 'bold',
  },
  svgContainer: {
    height: 120,
    width: '100%',
    marginBottom: 8,
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  xAxisText: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#6b7280',
  },
  accuracyValueBig: {
    ...Theme.typography.displayMd,
    fontSize: 48,
    color: '#10b981',
    fontFamily: 'SpaceGrotesk_700Bold',
    marginVertical: 4,
  },
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    marginVertical: 20,
  },
  barWrapper: {
    width: '12%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  barFillInactive: {
    backgroundColor: '#1b322a', // dark muted green
  },
  barFillActive: {
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 4,
  },
  accuracyFooter: {
    ...Theme.typography.labelMd,
    color: '#a1a9b8',
    fontSize: 12,
  },
  footerBold: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  performanceCard: {
    backgroundColor: '#161a22',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  performanceLabel: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#a1a9b8',
    fontWeight: 'bold',
    lineHeight: 14,
  },
  legendRow: {
    flexDirection: 'row',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    ...Theme.typography.labelMd,
    fontSize: 9,
    color: '#e2e8f0',
  },
  subjectRow: {
    marginBottom: 20,
  },
  subjectRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subjectTitle: {
    ...Theme.typography.bodyLg,
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '500',
  },
  subjectScore: {
    ...Theme.typography.labelMd,
    fontWeight: 'bold',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#2b313a',
    borderRadius: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  achievementsHeading: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#a1a9b8',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  achievementsScroll: {
    marginHorizontal: -24,
  },
  achievementsContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  achievementCard: {
    backgroundColor: '#161a22',
    borderWidth: 1,
    borderColor: '#1e2430',
    borderRadius: 24,
    padding: 20,
    width: 150,
    alignItems: 'center',
  },
  achievementIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#202633',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementTitle: {
    ...Theme.typography.bodyLg,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
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
  activeTabWrapper: {
    alignItems: 'center',
    position: 'relative',
    gap: 4,
  },
  activeTabDot: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#a3c0f7',
  },
  tabText: {
    ...Theme.typography.labelMd,
    fontSize: 9,
    letterSpacing: 0.5,
  },
});
