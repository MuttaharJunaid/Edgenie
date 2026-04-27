import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { ChevronLeft, ArrowRight, CheckCircle2, FlaskConical, Monitor, Sigma, Component } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { papersService } from '../services/papers.service';
import { authService } from '../services/auth.service';

const SUBJECTS = [
  {
    id: 'math',
    title: 'Mathematics',
    subtitle: 'Pure Maths & Stats',
    level: 'CAIE O-LEVEL',
    icon: Sigma,
    iconColor: '#74a3f5',
    iconBg: '#1e2b40',
  },
  {
    id: 'bio',
    title: 'Biology',
    subtitle: 'Human & Plant Biology',
    level: 'CAIE O-LEVEL',
    icon: FlaskConical,
    iconColor: '#101623',
    iconBg: '#a3c0f7',
  },
  {
    id: 'chem',
    title: 'Chemistry',
    subtitle: 'Organic & Physical',
    level: 'CAIE O-LEVEL',
    icon: FlaskConical,
    iconColor: '#101623',
    iconBg: '#a3c0f7',
  },
  {
    id: 'phy',
    title: 'Physics',
    subtitle: 'Mechanics & Energy',
    level: 'CAIE O-LEVEL',
    icon: Component, // Alternatively Beaker, but Component looks like the red base symbol
    iconColor: '#f25c54',
    iconBg: '#361e20',
  },
  {
    id: 'cs',
    title: 'Computer\nScience',
    subtitle: 'Programming & Logic',
    level: 'CAIE O-LEVEL',
    icon: Monitor,
    iconColor: '#a1a9b8',
    iconBg: '#21262d',
  },
];

export default function SubjectsScreen() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    papersService.getSubjects()
        .then(res => setSubjects(res.data.results || res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
  }, []);

  const handleStart = async () => {
    setSaving(true);
    setError('');
    try {
        await authService.updateMe({ subject_ids: Array.from(selectedIds) });
        router.replace('/dashboard');
    } catch (err) {
        setError('Failed to save subjects');
    } finally {
        setSaving(false);
    }
  };

  const toggleSubject = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  return (
    <View style={styles.container}>
      {/* Top Nav */}
      <View style={styles.topNav}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#a1a9b8" />
        </Pressable>

        <View style={styles.stepsContainer}>
          <View style={styles.stepDotInactive} />
          <View style={styles.stepDotActive} />
        </View>
        
        {/* Invisible spacer for center alignment */}
        <View style={{ width: 44, height: 44 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>What are you{'\n'}studying?</Text>
        <Text style={styles.subtitle}>Pick your subjects — we'll personalize everything for your journey.</Text>

        {error ? <Text style={{ color: '#ef4444', marginBottom: 12, textAlign: 'center' }}>{error}</Text> : null}

        <View style={styles.cardsContainer}>
          {loading ? <Text style={{ color: '#a1a9b8', marginTop: 20 }}>Loading subjects...</Text> : null}
          {subjects.map((sub: { id: string; name: string; color_hex?: string; icon?: string; description?: string; board?: string; level?: string; code?: string; }) => {
            const isSelected = selectedIds.has(sub.id);
            // Default icon rendering
            let IconComponent = Component;
            if (sub.name.toLowerCase().includes('math')) IconComponent = Sigma;
            else if (sub.name.toLowerCase().includes('bio') || sub.name.toLowerCase().includes('chem')) IconComponent = FlaskConical;
            else if (sub.name.toLowerCase().includes('computer')) IconComponent = Monitor;

            return (
              <Pressable
                key={sub.id}
                onPress={() => toggleSubject(sub.id)}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected
                ]}
              >
                {/* Check Icon Top Right when Selected */}
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <CheckCircle2 size={24} color="#a3c0f7" fill="#ffffff" />
                  </View>
                )}

                <View style={styles.cardHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: sub.color_hex + '20' }]}>
                    <IconComponent size={24} color={sub.color_hex || '#a1a9b8'} />
                  </View>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{sub.board} {sub.level}</Text>
                  </View>
                </View>

                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{sub.name}</Text>
                  <Text style={styles.cardSubtitle}>{sub.code}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={{ height: 120 }} /* Spacer for footer */ />
      </ScrollView>

      {/* Floating Footer */}
      <View style={styles.footerWrap}>
        <LinearGradient
          colors={['rgba(12,16,23,0)', '#0c1017']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.footerContent}>
          <Pressable 
            style={({ pressed }) => [styles.startButton, pressed && styles.pressedState, saving && { opacity: 0.7 }]}
            onPress={handleStart}
            disabled={saving}
          >
            <LinearGradient
              colors={['#8facfb', '#6392f8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientFill}
            >
              <Text style={styles.startButtonText}>{saving ? 'Saving...' : 'Start learning'}</Text>
              {!saving && <ArrowRight size={20} color="#0c1017" style={{ marginLeft: 8 }} />}
            </LinearGradient>
          </Pressable>

          <Text style={styles.footerStepText}>STEP 2 OF 2: FINALIZE SELECTION</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11151c',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#262b33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepDotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2b313a',
  },
  stepDotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6392f8',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  title: {
    ...Theme.typography.displayMd,
    fontSize: 34,
    lineHeight: 40,
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 16,
  },
  subtitle: {
    ...Theme.typography.bodyLg,
    color: '#a1a9b8',
    marginBottom: 40,
    lineHeight: 24,
  },
  cardsContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#161b22',
    borderRadius: 24,
    padding: 24,
    /* To stack Computer Science properly */
    flexDirection: 'column', 
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: '#7eabfc',
    backgroundColor: '#161b22',
    // Apply a subtle blue box shadow glow
    shadowColor: '#7eabfc',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checkBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelBadge: {
    backgroundColor: '#2e343d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  levelText: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#d1d5db',
    letterSpacing: 1,
  },
  cardTextContainer: {
    justifyContent: 'flex-end',
  },
  cardTitle: {
    ...Theme.typography.headlineLg,
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  cardSubtitle: {
    ...Theme.typography.labelMd,
    color: '#8a92a1',
    fontWeight: '400',
  },
  footerWrap: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    paddingTop: 60,
  },
  footerContent: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  startButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 16,
  },
  gradientFill: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    ...Theme.typography.labelMd,
    fontSize: 16,
    color: '#0c1017',
    fontWeight: 'bold',
  },
  footerStepText: {
    ...Theme.typography.labelMd,
    fontSize: 11,
    color: '#6b7280',
    letterSpacing: 1,
  },
  pressedState: {
    opacity: 0.8,
  },
});
