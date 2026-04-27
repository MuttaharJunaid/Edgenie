/**
 * Zara Chat Screen — mobile-app/app/zara-chat.tsx
 *
 * The main messaging interface for the Zara O-Level tutor.
 *
 * Features:
 *  - Loads existing session history from AsyncStorage on mount
 *  - User bubbles right-aligned (#1a4bb8), Zara bubbles left-aligned (#1b1f28)
 *  - Zara avatar (Sparkles icon in blue circle) on every bot message
 *  - Subject badge at the top (read-only — set when session was created)
 *  - ActivityIndicator typing indicator while awaiting response
 *  - Sends { message, history, subject, chat_id } to POST /api/chat/zara/
 *  - Persists every message to AsyncStorage via zaraStorageService
 *  - Auto-scrolls to latest message
 *  - KeyboardAvoidingView so input stays above keyboard
 *
 * Design is pixel-matched to search-chat.tsx (the existing chat screen).
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  ArrowLeft,
  ArrowUp,
  Sparkles,
  Home,
  Search,
  GraduationCap,
  BarChart2,
  User,
} from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { zaraService, ZaraMessage } from '../services/zara.service';
import { zaraStorageService } from '../services/zara_storage.service';
import { authService } from '../services/auth.service';

// Subject → accent colour
const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics':            '#7eabfc',
  'Physics':                '#f5a623',
  'English Language':       '#10b981',
  'Business Studies':       '#c084fc',
  'Principles of Accounts': '#f25c54',
  'Chemistry':              '#38bdf8',
};

export default function ZaraChatScreen() {
  const router = useRouter();
  const { chat_id, subject } = useLocalSearchParams<{
    chat_id: string;
    subject: string;
  }>();

  const [messages, setMessages] = useState<ZaraMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const subjectColor = SUBJECT_COLORS[subject ?? ''] ?? '#7eabfc';

  // Load user and existing session history on mount
  useEffect(() => {
    authService.getStoredUser().then(setUser);

    if (chat_id) {
      zaraStorageService.getSession(chat_id).then((session) => {
        if (session && session.messages.length > 0) {
          setMessages(session.messages);
        } else {
          // First message from Zara on a fresh session
          const greeting: ZaraMessage = {
            role: 'assistant',
            content: subject
              ? `Hi! I'm Zara 👋 I'm here to help you with ${subject}. What would you like to work on today?`
              : `Hi! I'm Zara 👋 I'm your O-Level tutor. Ask me anything about Mathematics, Physics, English Language, Business Studies, Principles of Accounts, or Chemistry!`,
            timestamp: new Date().toISOString(),
          };
          setMessages([greeting]);
          if (chat_id) {
            zaraStorageService.appendMessage(chat_id, greeting);
          }
        }
      });
    }
  }, [chat_id, subject]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, loading]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || loading) return;

    const userMsg: ZaraMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputText('');
    setLoading(true);

    // Persist user message
    if (chat_id) {
      await zaraStorageService.appendMessage(chat_id, userMsg);
    }

    try {
      // Build history for the API (exclude the message we just added)
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await zaraService.sendMessage({
        message: text,
        history,
        subject: subject || null,
        chat_id: chat_id ?? '',
      });

      const zaraMsg: ZaraMessage = {
        role: 'assistant',
        content: res.data.reply,
        timestamp: new Date().toISOString(),
      };

      setMessages([...nextMessages, zaraMsg]);

      // Persist Zara's reply
      if (chat_id) {
        await zaraStorageService.appendMessage(chat_id, zaraMsg);
      }
    } catch (err) {
      const errMsg: ZaraMessage = {
        role: 'assistant',
        content:
          "Sorry, I couldn't reach the server. Check your connection and try again! 😊",
        timestamp: new Date().toISOString(),
      };
      setMessages([...nextMessages, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.push('/zara-chat-list')}
        >
          <ArrowLeft size={20} color="#e2e8f0" />
        </Pressable>

        <View style={styles.headerCenter}>
          <View style={styles.zaraAvatar}>
            <Sparkles size={16} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>ZARA</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>AI TUTOR · ONLINE</Text>
            </View>
          </View>
        </View>

        {/* Subject badge */}
        {subject ? (
          <View
            style={[
              styles.subjectBadge,
              { backgroundColor: subjectColor + '20' },
            ]}
          >
            <Text style={[styles.subjectBadgeText, { color: subjectColor }]}>
              {subject.length > 10 ? subject.slice(0, 10) + '…' : subject}
            </Text>
          </View>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {/* ── Messages ── */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={
              msg.role === 'user'
                ? styles.userBubbleWrapper
                : styles.zaraBubbleWrapper
            }
          >
            {msg.role === 'assistant' && (
              <View style={styles.zaraAvatarSmall}>
                <Sparkles size={14} color="#ffffff" />
              </View>
            )}
            <View
              style={
                msg.role === 'user' ? styles.userBubble : styles.zaraBubble
              }
            >
              <Text
                style={
                  msg.role === 'user' ? styles.userText : styles.zaraText
                }
              >
                {msg.content}
              </Text>
            </View>
          </View>
        ))}

        {/* Typing indicator */}
        {loading && (
          <View style={styles.zaraBubbleWrapper}>
            <View style={styles.zaraAvatarSmall}>
              <Sparkles size={14} color="#ffffff" />
            </View>
            <View style={[styles.zaraBubble, styles.typingBubble]}>
              <ActivityIndicator size="small" color="#7eabfc" />
            </View>
          </View>
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* ── Input bar ── */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask Zara anything..."
            placeholderTextColor="#6b7280"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
            maxLength={1000}
          />
          <Pressable
            style={[
              styles.sendBtn,
              { opacity: !inputText.trim() || loading ? 0.4 : 1 },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size={18} color="#0c1017" />
            ) : (
              <ArrowUp size={20} color="#0c1017" />
            )}
          </Pressable>
        </View>
      </View>

      {/* ── Bottom tab bar ── */}
      <View style={styles.bottomTabBar}>
        <Pressable
          style={styles.tabItem}
          onPress={() => router.push('/dashboard')}
        >
          <Home size={22} color="#6b7280" />
          <Text style={styles.tabText}>HOME</Text>
        </Pressable>
        <Pressable
          style={styles.tabItem}
          onPress={() => router.push('/search-start')}
        >
          <Search size={22} color="#6b7280" />
          <Text style={styles.tabText}>SEARCH</Text>
        </Pressable>
        <Pressable
          style={styles.tabItem}
          onPress={() => router.push('/mock-exam')}
        >
          <GraduationCap size={22} color="#6b7280" />
          <Text style={styles.tabText}>EXAM</Text>
        </Pressable>
        <Pressable
          style={styles.tabItem}
          onPress={() => router.push('/zara-chat-list')}
        >
          <Sparkles size={22} color="#7eabfc" />
          <Text style={[styles.tabText, { color: '#7eabfc' }]}>ZARA</Text>
        </Pressable>
        <Pressable
          style={styles.tabItem}
          onPress={() => router.push('/profile')}
        >
          <User size={22} color="#6b7280" />
          <Text style={styles.tabText}>PROFILE</Text>
        </Pressable>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#11151c',
    borderBottomWidth: 1,
    borderBottomColor: '#1e2430',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1b1f28',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginLeft: 12,
  },
  zaraAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Theme.typography.labelMd,
    color: '#7eabfc',
    fontWeight: 'bold',
    letterSpacing: 1.5,
    fontSize: 13,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  onlineText: {
    ...Theme.typography.labelMd,
    fontSize: 9,
    color: '#a1a9b8',
    letterSpacing: 0.5,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  subjectBadgeText: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  // User bubble
  userBubbleWrapper: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  userBubble: {
    backgroundColor: '#1a4bb8',
    padding: 16,
    borderRadius: 20,
    borderTopRightRadius: 4,
    maxWidth: '85%',
  },
  userText: {
    ...Theme.typography.bodyLg,
    color: '#ffffff',
    lineHeight: 22,
    fontSize: 15,
  },
  // Zara bubble
  zaraBubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 24,
  },
  zaraAvatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    flexShrink: 0,
  },
  zaraBubble: {
    flex: 1,
    backgroundColor: '#1b1f28',
    padding: 18,
    borderRadius: 20,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#2b313a',
  },
  zaraText: {
    ...Theme.typography.bodyLg,
    color: '#e2e8f0',
    lineHeight: 24,
    fontSize: 15,
  },
  typingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
  },
  // Input
  inputSection: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 78,
    width: '100%',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161a22',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#2b313a',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    gap: 8,
  },
  textInput: {
    flex: 1,
    ...Theme.typography.bodyLg,
    color: '#ffffff',
    fontSize: 15,
    maxHeight: 100,
    paddingTop: 4,
    paddingBottom: 4,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#7eabfc',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  // Bottom tab bar
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
