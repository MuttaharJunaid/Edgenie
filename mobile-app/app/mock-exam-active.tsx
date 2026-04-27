import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform, ScrollView, TextInput, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { Clock, Bookmark, Paperclip, Sigma, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { submissionsService } from '../services/submissions.service';
import { authService } from '../services/auth.service';

interface Question {
  id: string;
  content: string;
  marks?: number;
  number?: number;
  topic?: { name: string };
  difficulty?: string;
}

export default function MockExamActiveScreen() {
  const router = useRouter();
  const { id: examId } = useLocalSearchParams();
  
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // Default 1 hour in seconds
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);

  // Load Exam Data
  useEffect(() => {
    if (!examId) return;
    
    authService.getStoredUser().then(u => setUser(u));

    submissionsService.getMockExam(examId as string)
      .then(res => {
        setExam(res.data);
        setQuestions(res.data.questions || []);
        if (res.data.duration_minutes) {
          setTimeRemaining(res.data.duration_minutes * 60);
        }
        
        // Populate existing answers if any
        const initialAnswers: Record<string, string> = {};
        (res.data.answers || []).forEach((a: any) => {
          initialAnswers[a.question] = a.answer_text;
        });
        setAnswers(initialAnswers);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Failed to load exam details.');
        router.back();
      });
  }, [examId]);

  // Timer Logic
  useEffect(() => {
    if (loading || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentQuestion?.id] || '';

  const saveAnswer = async (qId: string, text: string) => {
    try {
      await submissionsService.submitMockExamAnswer(examId as string, {
        question: qId,
        answer_text: text
      });
    } catch (err) {
      console.warn('Failed to autosave answer:', err);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      saveAnswer(currentQuestion.id, currentAnswer);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      saveAnswer(currentQuestion.id, currentAnswer);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const jumpToQuestion = (index: number) => {
    saveAnswer(currentQuestion.id, currentAnswer);
    setCurrentIndex(index);
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    const newFlagged = new Set(flagged);
    if (newFlagged.has(currentQuestion.id)) {
      newFlagged.delete(currentQuestion.id);
    } else {
      newFlagged.add(currentQuestion.id);
    }
    setFlagged(newFlagged);
  };

  const handleAutoSubmit = () => {
    Alert.alert('Time Up', 'Your time is up. Submitting your answers...', [
      { text: 'OK', onPress: () => performFinalSubmit() }
    ]);
  };

  const performFinalSubmit = async () => {
    setSubmitting(true);
    try {
      // Save last answer first
      if (currentQuestion) {
        await saveAnswer(currentQuestion.id, currentAnswer);
      }
      await submissionsService.submitMockExam(examId as string);
      router.replace({ pathname: '/mock-exam-results', params: { id: examId }});
    } catch (err) {
      console.error(err);
      Alert.alert('Submission Failed', 'Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#7eabfc" />
        <Text style={{ color: '#a1a9b8', marginTop: 12 }}>Preparing your exam...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.subjectIcon}>
            <Sigma size={14} color="#7eabfc" />
          </View>
          <Text style={styles.subjectTitle}>{exam?.subject_name || 'Mock Exam'}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.timerPill, timeRemaining < 300 && { backgroundColor: '#451a1a' }]}>
            <Clock size={16} color={timeRemaining < 300 ? '#f87171' : '#f25c54'} strokeWidth={2.5} />
            <Text style={[styles.timerText, timeRemaining < 300 && { color: '#f87171' }]}>{formatTime(timeRemaining)}</Text>
          </View>
          <View style={styles.progressTextWrapper}>
            <Text style={styles.progressTextQ}>Q</Text>
            <Text style={styles.progressTextCount}>{currentIndex + 1}/{questions.length}</Text>
          </View>
          <Pressable onPress={() => router.push('/profile')}>
            <Image source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150?img=11' }} style={styles.profilePic} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Question Header */}
        <View style={styles.questionHeaderRow}>
          <View style={styles.qNumberPill}>
            <Text style={styles.qNumberText}>QUESTION {(currentIndex + 1).toString().padStart(2, '0')}</Text>
          </View>
          <Pressable style={styles.flagBtn} onPress={toggleFlag}>
            <Bookmark size={16} color={flagged.has(currentQuestion.id) ? "#f5a623" : "#a1a9b8"} fill={flagged.has(currentQuestion.id) ? "#f5a623" : "transparent"} />
            <Text style={[styles.flagText, flagged.has(currentQuestion.id) && { color: '#f5a623' }]}>Flag question</Text>
          </Pressable>
        </View>

        {/* Question Text */}
        <Text style={styles.questionText}>
          {currentQuestion?.content}
        </Text>
        
        <View style={styles.divider} />

        {/* Response Area */}
        <Text style={styles.responseLabel}>YOUR RESPONSE ({currentQuestion?.marks || 1} MARKS)</Text>
        <View style={styles.responseContainer}>
          <TextInput
            style={styles.responseInput}
            placeholder="Type your derivation here..."
            placeholderTextColor="#4b5563"
            multiline
            textAlignVertical="top"
            value={currentAnswer}
            onChangeText={(txt) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: txt }))}
          />
          <View style={styles.responseToolbar}>
            <Pressable style={styles.toolBtn}>
              <Paperclip size={14} color="#d1d5db" />
            </Pressable>
            <Pressable style={styles.toolBtn}>
              <Sigma size={14} color="#d1d5db" />
            </Pressable>
          </View>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navActionRow}>
          <Pressable 
            style={[styles.navActionBtn, currentIndex === 0 && { opacity: 0.3 }]} 
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} color="#e2e8f0" />
            <Text style={styles.navActionText}>Previous</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.navActionBtn, currentIndex === questions.length - 1 && { opacity: 0.3 }]} 
            onPress={handleNext}
            disabled={currentIndex === questions.length - 1}
          >
            <Text style={styles.navActionText}>Next</Text>
            <ChevronRight size={20} color="#e2e8f0" />
          </Pressable>
        </View>

        {/* Question Navigator */}
        <View style={styles.navigatorSection}>
          <View style={styles.navigatorHeader}>
            <Text style={styles.navigatorTitle}>QUESTION NAVIGATOR</Text>
          </View>
          
          <View style={styles.dotGrid}>
            {questions.map((q, idx) => {
              let btnStyle = styles.dotUnseen;
              let textStyle = styles.dotTextUnseen;
              
              const isAnswered = !!answers[q.id];
              const isCurrent = idx === currentIndex;
              const isFlagged = flagged.has(q.id);

              if (isCurrent) {
                btnStyle = styles.dotCurrent;
                textStyle = styles.dotTextCurrent;
              } else if (isFlagged) {
                btnStyle = styles.dotFlagged;
                textStyle = styles.dotTextAnswered; // dark text on yellow
              } else if (isAnswered) {
                btnStyle = styles.dotAnswered;
                textStyle = styles.dotTextAnswered;
              }

              return (
                <Pressable key={q.id} style={[styles.dotBase, btnStyle]} onPress={() => jumpToQuestion(idx)}>
                  {isFlagged && !isCurrent ? (
                    <Bookmark size={12} color="#1b1f28" fill="#1b1f28" />
                  ) : (
                    <Text style={textStyle}>{idx + 1}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Submit All Button */}
        <View style={styles.submitSection}>
          <LinearGradient
            colors={['rgba(220, 38, 38, 0.4)', 'transparent']}
            style={styles.submitBtnGlow}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
          />
          <Pressable 
            style={[styles.submitAllBtn, submitting && { opacity: 0.7 }]}
            onPress={() => {
              Alert.alert('Submit Exam', 'Are you sure you want to finish the exam?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Submit', onPress: performFinalSubmit }
              ]);
            }}
            disabled={submitting}
          >
            <Text style={styles.submitAllBtnText}>{submitting ? 'SUBMITTING...' : 'SUBMIT ALL ANSWERS'}</Text>
          </Pressable>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2430',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  subjectIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#162032',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectTitle: {
    ...Theme.typography.bodyLg,
    color: '#e2e8f0',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 18,
    flexShrink: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2b1a1a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  timerText: {
    ...Theme.typography.labelMd,
    color: '#f25c54',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 0.5,
    fontSize: 13,
  },
  progressTextWrapper: {
    alignItems: 'center',
  },
  progressTextQ: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#a1a9b8',
    marginBottom: -2,
  },
  progressTextCount: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#e2e8f0',
    fontWeight: 'bold',
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  questionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  qNumberPill: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  qNumberText: {
    ...Theme.typography.labelMd,
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10,
    letterSpacing: 1,
  },
  flagBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flagText: {
    ...Theme.typography.labelMd,
    color: '#a1a9b8',
    fontSize: 12,
  },
  questionText: {
    ...Theme.typography.bodyLg,
    fontSize: 18,
    color: '#e2e8f0',
    lineHeight: 28,
    fontWeight: '400',
  },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: '#3b82f6',
    marginTop: 24,
    marginBottom: 24,
  },
  responseLabel: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#8a92a1',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  responseContainer: {
    backgroundColor: '#161a22',
    borderRadius: 20,
    height: 200,
    padding: 20,
    position: 'relative',
    marginBottom: 24,
  },
  responseInput: {
    flex: 1,
    ...Theme.typography.bodyLg,
    color: '#e2e8f0',
    fontSize: 16,
    lineHeight: 24,
  },
  responseToolbar: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    gap: 8,
  },
  toolBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2b313a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  navActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e2430',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  navActionText: {
    color: '#e2e8f0',
    fontWeight: '600',
    fontSize: 14,
  },
  navigatorSection: {
    marginBottom: 40,
  },
  navigatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  navigatorTitle: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#8a92a1',
    fontWeight: 'bold',
  },
  dotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  dotBase: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dotUnseen: {
    backgroundColor: '#202633',
  },
  dotTextUnseen: {
    ...Theme.typography.labelMd,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  dotAnswered: {
    backgroundColor: '#3b82f6',
  },
  dotTextAnswered: {
    ...Theme.typography.labelMd,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dotCurrent: {
    backgroundColor: '#0c1017',
    borderWidth: 1.5,
    borderColor: '#7eabfc',
  },
  dotTextCurrent: {
    ...Theme.typography.labelMd,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dotFlagged: {
    backgroundColor: '#f5a623',
  },
  submitSection: {
    alignItems: 'center',
    position: 'relative',
  },
  submitBtnGlow: {
    position: 'absolute',
    top: -10,
    left: '10%',
    right: '10%',
    height: 50,
    borderRadius: 25,
  },
  submitAllBtn: {
    width: '100%',
    height: 54,
    backgroundColor: '#990000', 
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  submitAllBtnText: {
    ...Theme.typography.labelMd,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 13,
  },
});

