import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform, ScrollView, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { ArrowLeft, AlignLeft, Camera, Sparkles } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { papersService } from '../services/papers.service';
import { submissionsService } from '../services/submissions.service';
import { Question } from '../types/models';

export default function QuestionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [inputText, setInputText] = useState('');
  const [q, setQ] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    papersService.getQuestion(id as string)
      .then(res => setQ(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!inputText.trim() || !id) return;
    setSubmitting(true);
    try {
      await submissionsService.submit({
          question: id as string,
          answer_text: inputText
      });
      // Stub: in real world we pass submission ID to feedback
      router.replace('/feedback');
    } catch(err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Top Navbar */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#e2e8f0" />
        </Pressable>
        <View style={styles.headerPills}>
          <View style={styles.pillRed}>
            <Text style={styles.pillTextRed}>{q?.difficulty?.toUpperCase() || 'HARD'}</Text>
          </View>
          <View style={styles.pillGrey}>
            <Text style={styles.pillTextGrey}>{q?.marks || 4} MARKS</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {loading ? (
             <ActivityIndicator color="#8facfb" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Breadcrumb Context */}
            <View style={styles.breadcrumbRow}>
              <Text style={styles.breadcrumbTextMuted}>{(typeof q?.paper?.subject === 'string' ? q?.paper?.subject : q?.paper?.subject?.name)?.toUpperCase() || 'SUBJECT'} {'›'} PAPER {q?.paper?.paper_number || ''} {'›'} </Text>
              <Text style={styles.breadcrumbTextActive}>Q{q?.number}</Text>
            </View>

            {/* Question Title */}
            <Text style={styles.questionTitle}>
              {q?.text || 'Question text unavailable.'}
            </Text>

            {/* Marking Criteria */}
            <View style={styles.criteriaRow}>
              <View style={styles.dotsGroup}>
                {Array.from({length: q?.marks || 4}).map((_, i) => <View key={i} style={styles.dotFilled} />)}
              </View>
              <Text style={styles.criteriaText}>MARKING CRITERIA: {q?.marks || 4} POINTS</Text>
            </View>

            {/* Reference Image */}
            <View style={[styles.imageContainer, { display: q?.image_url ? 'flex' : 'none' }]}>
              {q?.image_url && (
                <Image 
                  source={{ uri: q.image_url }} 
                  style={styles.questionImage} 
                />
              )}
              <LinearGradient 
                colors={['transparent', '#0c1017']} 
                style={styles.imageGradientBottom} 
                locations={[0.5, 1]}
              />
            </View>
          </>
        )}

        {/* Input Interface Card */}
        <View style={styles.inputCard}>
          {/* Tabs */}
          <View style={styles.tabRow}>
            <Pressable style={styles.tabItemActive}>
              <AlignLeft size={16} color="#ffffff" style={styles.tabIconActive} />
              <Text style={styles.tabTextActive}>Type Answer</Text>
              <View style={styles.tabIndicator} />
            </Pressable>
            <Pressable style={styles.tabItemInactive}>
              <Camera size={16} color="#9ca3af" style={styles.tabIconInactive} />
              <Text style={styles.tabTextInactive}>Upload Photo</Text>
            </Pressable>
          </View>

          {/* Text Area */}
          <View style={styles.textAreaWrapper}>
            <TextInput
              style={styles.textArea}
              placeholder="Start typing your explanation here..."
              placeholderTextColor="#6b7280"
              multiline
              textAlignVertical="top"
              value={inputText}
              onChangeText={setInputText}
            />
            <View style={styles.charCountPill}>
              <Text style={styles.charCountText}>{inputText.length} / 2000 characters</Text>
            </View>
          </View>

          {/* AI Notice Box */}
          <View style={styles.aiNoticeBox}>
            <Sparkles size={18} color="#a3c0f7" style={{ marginTop: 2, marginRight: 12 }} />
            <Text style={styles.aiNoticeText}>
              <Text style={styles.aiNoticeBold}>AI Grading Active:</Text> Your submission will be instantly analyzed against the official AQA marking scheme. Ensure you use specific biological terminology like "chromatids", "equator", and "vesicles".
            </Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.submitSection}>
          <View style={styles.submitBtnWrapper}>
            {/* Background Glow */}
            <LinearGradient
              colors={['rgba(143, 172, 251, 0.3)', 'transparent']}
              style={styles.submitBtnGlow}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
            {/* Actual Button */}
            <Pressable 
              style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.9 }, (!inputText.trim() || submitting || loading) && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={!inputText.trim() || submitting || loading}
            >
              <LinearGradient
                colors={['#8facfb', '#74a3f5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitGradient}
              >
                <Text style={styles.submitBtnText}>{submitting ? 'Submitting...' : 'Submit for Review'}</Text>
              </LinearGradient>
            </Pressable>
          </View>
          <Text style={styles.submitWarning}>ONCE SUBMITTED, THIS CANNOT BE EDITED</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2b313a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerPills: {
    flexDirection: 'row',
    gap: 8,
  },
  pillRed: {
    backgroundColor: '#362327',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pillTextRed: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#f25c54',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  pillGrey: {
    backgroundColor: '#1b1f28',
    borderWidth: 1,
    borderColor: '#2b313a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pillTextGrey: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#a3c0f7', // Based on image matching slight blue tint
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  breadcrumbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  breadcrumbTextMuted: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#6b7280',
    letterSpacing: 1.5,
    fontWeight: 'bold',
  },
  breadcrumbTextActive: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#d1d5db',
    letterSpacing: 1.5,
    fontWeight: 'bold',
  },
  questionTitle: {
    ...Theme.typography.bodyLg,
    fontSize: 22,
    color: '#e2e8f0',
    lineHeight: 32,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', // Match the serif aesthetic from mockup slightly
    marginBottom: 20,
  },
  criteriaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  dotsGroup: {
    flexDirection: 'row',
    gap: 4,
  },
  dotFilled: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#a3c0f7',
  },
  dotEmpty: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2b313a',
  },
  criteriaText: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#9ca3af',
    letterSpacing: 1,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 32,
    backgroundColor: '#1b1f28',
  },
  questionImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  imageGradientBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
  },
  inputCard: {
    backgroundColor: '#161a22',
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: '#1e2430',
    marginBottom: 40,
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#2b313a',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  tabItemActive: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  tabIconActive: {
    marginRight: 8,
  },
  tabTextActive: {
    ...Theme.typography.labelMd,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: '#a3c0f7',
    borderRadius: 1,
  },
  tabItemInactive: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  tabIconInactive: {
    marginRight: 8,
  },
  tabTextInactive: {
    ...Theme.typography.labelMd,
    color: '#9ca3af',
    fontWeight: 'bold',
  },
  textAreaWrapper: {
    backgroundColor: '#1c212b',
    borderRadius: 16,
    padding: 16,
    position: 'relative',
    height: 200,
    marginBottom: 16,
  },
  textArea: {
    flex: 1,
    ...Theme.typography.bodyLg,
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 24,
  },
  charCountPill: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#12161c',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  charCountText: {
    ...Theme.typography.labelMd,
    fontSize: 9,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#6b7280',
  },
  aiNoticeBox: {
    flexDirection: 'row',
    backgroundColor: '#1c212b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2b313a',
  },
  aiNoticeBold: {
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  aiNoticeText: {
    flex: 1,
    ...Theme.typography.labelMd,
    color: '#a1a9b8',
    lineHeight: 20,
    fontSize: 12,
  },
  submitSection: {
    alignItems: 'center',
  },
  submitBtnWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 16,
  },
  submitBtnGlow: {
    position: 'absolute',
    top: -20,
    left: '10%',
    right: '10%',
    height: 60,
    borderRadius: 30,
    filter: 'blur(20px)',
  },
  submitBtn: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  submitGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    ...Theme.typography.labelMd,
    fontSize: 16,
    color: '#0c1017',
    fontWeight: 'bold',
  },
  submitWarning: {
    ...Theme.typography.labelMd,
    fontSize: 9,
    letterSpacing: 1.5,
    color: '#6b7280',
    fontWeight: 'bold',
  },
});
