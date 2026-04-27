import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform, ScrollView, Switch } from 'react-native';
import { Menu, Zap, Flame, Home, Search, GraduationCap, BarChart2, User } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { papersService } from '../services/papers.service';
import { submissionsService } from '../services/submissions.service';

export default function MockExamScreen() {
  const router = useRouter();
  
  const [subjects, setSubjects] = useState<{ id: string; name: string }[]>([]);
  const [activeSubject, setActiveSubject] = useState('');
  const [activeDuration, setActiveDuration] = useState('60min');
  const [focusWeak, setFocusWeak] = useState(true);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    papersService.getSubjects().then(res => {
      const subs = res.data.results || res.data || [];
      setSubjects(subs);
      if (subs.length > 0) setActiveSubject(subs[0].id);
    }).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    if (!activeSubject) return;
    setLoading(true);
    try {
      const duration = parseInt(activeDuration.replace('min', ''));
      const res = await submissionsService.createMockExam({
          subject: activeSubject,
          duration_minutes: duration,
          focus_weak_topics: focusWeak,
          question_count: 25,
      });
      router.push({ pathname: '/mock-exam-active', params: { id: res.data?.id }});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        
        {/* Title */}
        <Text style={styles.pageTitle}>Create Mock Exam</Text>
        <Text style={styles.pageSubtitle}>We'll build a personalized test for you</Text>

        {/* Subjects */}
        <Text style={styles.sectionHeading}>SELECT SUBJECT</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={styles.horizontalContent}>
          {subjects.map(subject => {
            const isActive = activeSubject === subject.id;
            return (
              <Pressable 
                key={subject.id} 
                style={[styles.subjectPill, isActive ? styles.subjectPillActive : styles.subjectPillInactive]}
                onPress={() => setActiveSubject(subject.id)}
              >
                <Text style={[styles.subjectText, isActive ? styles.subjectTextActive : styles.subjectTextInactive]}>
                  {subject.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Duration */}
        <Text style={styles.sectionHeading}>EXAM DURATION</Text>
        <View style={styles.durationGrid}>
          {['30min', '60min', '90min', '120min'].map(duration => {
            const isActive = activeDuration === duration;
            return (
              <Pressable 
                key={duration} 
                style={[styles.durationPill, isActive ? styles.durationPillActive : styles.durationPillInactive]}
                onPress={() => setActiveDuration(duration)}
              >
                <Text style={[styles.durationText, isActive ? styles.durationTextActive : styles.durationTextInactive]}>
                  {duration}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Focus on Weak Topics */}
        <View style={styles.featureCard}>
          <View style={styles.featureHeader}>
            <View style={styles.iconCircleOrange}>
              <Flame size={18} color="#f5a623" />
            </View>
            <Switch 
              value={focusWeak} 
              onValueChange={setFocusWeak}
              trackColor={{ false: '#2b313a', true: '#a3c0f7' }}
              thumbColor={focusWeak ? '#ffffff' : '#9ca3af'}
              ios_backgroundColor="#2b313a"
            />
          </View>
          <Text style={styles.featureTitle}>Focus on weak topics</Text>
          <Text style={styles.featureDesc}>
            AI will prioritize concepts you've struggled with recently.
          </Text>
        </View>

        {/* Questions Slider Card */}
        <View style={styles.sliderCard}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderTitle}>Questions</Text>
            <Text style={styles.sliderValue}>25</Text>
          </View>
          
          <View style={styles.sliderContainer}>
            <View style={styles.trackBackground} />
            <View style={[styles.trackFill, { width: '50%' }]} />
            <View style={[styles.sliderThumb, { left: '50%' }]} />
          </View>

          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>10 QS</Text>
            <Text style={styles.sliderLabelText}>40 QS</Text>
          </View>
        </View>

        {/* Generate Button Wrapper */}
        <View style={styles.generateSection}>
          <View style={styles.submitBtnWrapper}>
            <LinearGradient
              colors={['rgba(143, 172, 251, 0.4)', 'transparent']}
              style={styles.submitBtnGlow}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            <Pressable 
              style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.9 }, (!activeSubject || loading) && { opacity: 0.7 }]}
              onPress={handleGenerate}
              disabled={!activeSubject || loading}
            >
              <LinearGradient
                colors={['#7eabfc', '#5f94f9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitGradient}
              >
                <Zap size={20} color="#0c1017" style={{ marginRight: 8 }} fill="#0c1017" />
                <Text style={styles.submitBtnText}>{loading ? 'Generating...' : 'Generate Exam'}</Text>
              </LinearGradient>
            </Pressable>
          </View>
          
          <View style={styles.difficultyRow}>
            <Text style={styles.difficultyLabel}>ESTIMATED DIFFICULTY: </Text>
            <Text style={styles.difficultyValue}>CHALLENGING</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
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
          <GraduationCap size={24} color="#ffffff" />
          <Text style={[styles.tabText, { color: '#ffffff' }]}>EXAM</Text>
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
    marginBottom: 32,
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
    marginBottom: 40,
  },
  sectionHeading: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    letterSpacing: 2,
    color: '#a1a9b8',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  horizontalScroll: {
    marginHorizontal: -24,
    marginBottom: 40,
  },
  horizontalContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  subjectPill: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectPillActive: {
    backgroundColor: '#a3c0f7',
  },
  subjectPillInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2b313a',
  },
  subjectText: {
    ...Theme.typography.labelMd,
    fontSize: 14,
    fontWeight: 'bold',
  },
  subjectTextActive: {
    color: '#0c1017',
  },
  subjectTextInactive: {
    color: '#d1d5db',
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 40,
  },
  durationPill: {
    width: '48%', // two columns essentially
    paddingVertical: 18,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationPillActive: {
    backgroundColor: '#a3c0f7',
  },
  durationPillInactive: {
    backgroundColor: '#202633',
  },
  durationText: {
    ...Theme.typography.labelMd,
    fontSize: 14,
    fontWeight: 'bold',
  },
  durationTextActive: {
    color: '#0c1017',
  },
  durationTextInactive: {
    color: '#d1d5db',
  },
  featureCard: {
    backgroundColor: '#161a22',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircleOrange: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#332314', // dark orange tint
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTitle: {
    ...Theme.typography.bodyLg,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  featureDesc: {
    ...Theme.typography.labelMd,
    color: '#a1a9b8',
    lineHeight: 20,
    fontSize: 13,
  },
  sliderCard: {
    backgroundColor: '#161a22',
    borderRadius: 24,
    padding: 24,
    marginBottom: 40,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sliderTitle: {
    ...Theme.typography.bodyLg,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  sliderValue: {
    ...Theme.typography.displayMd,
    fontSize: 28,
    color: '#a3c0f7',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  sliderContainer: {
    height: 24,
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  trackBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#2b313a',
    borderRadius: 3,
  },
  trackFill: {
    position: 'absolute',
    left: 0,
    height: 6,
    backgroundColor: '#5f94f9', // Slightly darker blue track behind the thumb
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#a3c0f7',
    marginLeft: -8, // center the thumb on the point
    shadowColor: '#a3c0f7',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabelText: {
    ...Theme.typography.labelMd,
    fontSize: 9,
    color: '#ffffff', // bright white as in mock
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  generateSection: {
    alignItems: 'center',
  },
  submitBtnWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 20,
  },
  submitBtnGlow: {
    position: 'absolute',
    top: -10,
    left: '5%',
    right: '5%',
    height: 60,
    borderRadius: 30,
    filter: 'blur(20px)',
  },
  submitBtn: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  submitGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    ...Theme.typography.bodyLg,
    fontSize: 16,
    color: '#0c1017',
    fontWeight: 'bold',
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyLabel: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    letterSpacing: 1,
    color: '#8a92a1',
  },
  difficultyValue: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    letterSpacing: 1,
    color: '#f5a623',
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
