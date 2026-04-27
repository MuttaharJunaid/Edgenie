import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Menu, Home, Search, GraduationCap, BarChart2, User, Bot, Sparkles, BarChart, ChevronRight } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { submissionsService } from '../services/submissions.service';
import { authService } from '../services/auth.service';

const { width } = Dimensions.get('window');

// Circular Progress Component matching the screenshot
const CircularProgress = ({ size, progress, strokeWidth }: { size: number, progress: number, strokeWidth: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

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
        {/* Glow */}
        <Circle
          stroke="rgba(16, 185, 129, 0.4)" 
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth + 12}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          originX={size / 2}
          originY={size / 2}
          rotation="-90"
        />
        {/* Main Progress */}
        <Circle
          stroke="#10b981" 
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
      {/* Inner Content */}
      <View style={styles.circularContent}>
        <Text style={styles.circularScoreBig}>{Math.round(progress)}%</Text>
        <Text style={styles.circularScoreText}>SCORE</Text>
      </View>
    </View>
  );
};

export default function MockExamResultsScreen() {
  const router = useRouter();
  const { id: examId } = useLocalSearchParams();
  
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!examId) return;
    
    authService.getStoredUser().then(u => setUser(u));

    submissionsService.getMockExam(examId as string)
      .then(res => {
        setExam(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [examId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#7eabfc" />
        <Text style={{ color: '#a1a9b8', marginTop: 12 }}>Analyzing results...</Text>
      </View>
    );
  }

  const score = exam?.score_percentage || 0;
  const isGood = score >= 70;
  const isFair = score >= 40 && score < 70;

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
        
        {/* Score Section */}
        <View style={styles.scoreSection}>
          <CircularProgress size={200} progress={score} strokeWidth={16} />
          <Text style={styles.congratsTitle}>
              {isGood ? 'Great job! 🎉' : isFair ? 'Good effort! 👍' : 'Keep practicing! 💪'}
          </Text>
          <Text style={styles.congratsSubtitle}>
              You earned <Text style={styles.congratsHighlight}>{exam?.marks_obtained || 0} / {exam?.total_marks || 0}</Text> marks
          </Text>
        </View>

        {/* Performance Breakdown */}
        {exam?.performance_by_topic && (
          <>
            <View style={styles.breakdownHeader}>
              <BarChart2 size={18} color="#a3c0f7" />
              <Text style={styles.breakdownTitle}>Performance Breakdown</Text>
            </View>

            <View style={styles.breakdownCard}>
              {Object.entries(exam.performance_by_topic).map(([topic, data]: [string, any]) => {
                const topicScore = data.accuracy || 0;
                const statusColor = topicScore >= 80 ? '#10b981' : topicScore >= 50 ? '#f5a623' : '#f25c54';
                return (
                  <View key={topic} style={styles.breakdownItem}>
                    <View style={styles.breakdownLabelRow}>
                      <Text style={styles.topicText}>{topic}</Text>
                      <Text style={[styles.topicScore, { color: statusColor }]}>{Math.round(topicScore)}%</Text>
                    </View>
                    <View style={styles.trackBackground}>
                      <View style={[styles.trackFill, { backgroundColor: statusColor, width: `${topicScore}%` }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* AI Insights */}
        {exam?.ai_feedback && (
          <View style={styles.insightsCard}>
            <View style={styles.insightsHeader}>
              <Bot size={20} color="#a3c0f7" style={{ marginRight: 8 }} />
              <Text style={styles.insightsTitle}>AI Insights</Text>
              <Sparkles size={40} color="rgba(163, 192, 247, 0.1)" style={styles.bgSparkle1} />
              <Sparkles size={24} color="rgba(163, 192, 247, 0.1)" style={styles.bgSparkle2} />
            </View>

            <Text style={styles.insightsSubtitle}>Analysis of your performance:</Text>

            <View style={styles.insightListItem}>
              <Text style={styles.insightText}>{exam.ai_feedback}</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionContainer}>
          <Pressable style={styles.btnPrimaryContainer} onPress={() => router.push('/subjects')}>
            <LinearGradient
              colors={['#8facfb', '#74a3f5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.btnPrimary}
            >
              <Text style={styles.btnPrimaryText}>Practice Weak Topics</Text>
            </LinearGradient>
          </Pressable>

          <Pressable style={styles.btnSecondary} onPress={() => router.push('/mock-exam')}>
            <Text style={styles.btnSecondaryText}>Try Another Exam</Text>
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
    marginBottom: 20,
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
  scoreSection: {
    alignItems: 'center',
    marginBottom: 40,
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
  },
  circularScoreText: {
    ...Theme.typography.labelMd,
    fontSize: 12,
    letterSpacing: 2,
    color: '#9ca3af',
  },
  congratsTitle: {
    ...Theme.typography.displayMd,
    fontSize: 32,
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk_700Bold',
    marginTop: 20,
    marginBottom: 8,
  },
  congratsSubtitle: {
    ...Theme.typography.bodyLg,
    color: '#a1a9b8',
    fontSize: 16,
  },
  congratsHighlight: {
    color: '#a3c0f7',
    fontWeight: 'bold',
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  breakdownTitle: {
    ...Theme.typography.headlineLg,
    fontSize: 18,
    color: '#ffffff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  breakdownCard: {
    backgroundColor: '#161a22',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  breakdownItem: {
    marginBottom: 20,
  },
  breakdownLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  topicText: {
    ...Theme.typography.bodyLg,
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '500',
  },
  topicScore: {
    ...Theme.typography.bodyLg,
    fontSize: 14,
    fontWeight: 'bold',
  },
  trackBackground: {
    height: 8,
    backgroundColor: '#202633',
    borderRadius: 4,
    width: '100%',
  },
  trackFill: {
    height: '100%',
    borderRadius: 4,
  },
  insightsCard: {
    backgroundColor: '#1b1f28',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bgSparkle1: {
    position: 'absolute',
    right: 10,
    top: 0,
    transform: [{ rotate: '15deg'}],
  },
  bgSparkle2: {
    position: 'absolute',
    right: 40,
    top: 40,
  },
  insightsTitle: {
    ...Theme.typography.headlineLg,
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  insightsSubtitle: {
    ...Theme.typography.bodyLg,
    color: '#a3c0f7',
    marginBottom: 16,
  },
  insightListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingRight: 20,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#a3c0f7',
    marginTop: 8,
    marginRight: 12,
  },
  insightText: {
    ...Theme.typography.bodyLg,
    color: '#d1d5db',
    lineHeight: 22,
    fontSize: 14,
  },
  insightBold: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  actionContainer: {
    gap: 16,
  },
  btnPrimaryContainer: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  btnPrimary: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimaryText: {
    ...Theme.typography.labelMd,
    fontSize: 16,
    color: '#0c1017',
    fontWeight: 'bold',
  },
  btnSecondary: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#2b313a',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#11151c',
  },
  btnSecondaryText: {
    ...Theme.typography.labelMd,
    fontSize: 16,
    color: '#e2e8f0',
    fontWeight: 'bold',
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
  },
});
