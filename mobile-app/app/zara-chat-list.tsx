/**
 * Zara Chat List Screen — mobile-app/app/zara-chat-list.tsx
 *
 * Shows all past Zara chat sessions stored in AsyncStorage.
 * Each row shows: subject badge, first message preview, timestamp.
 * "New Chat" button opens a subject picker then navigates to the chat screen.
 * Tapping a session opens it with its full history loaded.
 *
 * Design matches the existing app: dark bg #0c1017, cards #161a22,
 * primary accent #7eabfc, SpaceGrotesk headings, Inter body text,
 * manual bottom tab bar identical to all other screens.
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Modal,
  Image,
} from 'react-native';
import {
  Home,
  Search,
  GraduationCap,
  BarChart2,
  User,
  Plus,
  MessageSquare,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { useRouter, useFocusEffect } from 'expo-router';
import { zaraStorageService } from '../services/zara_storage.service';
import { ZaraChatSession } from '../services/zara.service';

const SUBJECTS = [
  'Mathematics',
  'Physics',
  'English Language',
  'Business Studies',
  'Principles of Accounts',
  'Chemistry',
];

// Subject → accent colour (matches existing app palette)
const SUBJECT_COLORS: Record<string, string> = {
  'Mathematics':            '#7eabfc',
  'Physics':                '#f5a623',
  'English Language':       '#10b981',
  'Business Studies':       '#c084fc',
  'Principles of Accounts': '#f25c54',
  'Chemistry':              '#38bdf8',
};

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ZaraChatListScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ZaraChatSession[]>([]);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  // Reload sessions every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      zaraStorageService.getSessions().then(setSessions);
    }, []),
  );

  const handleNewChat = () => setShowSubjectPicker(true);

  const handleSelectSubject = async (subject: string) => {
    setShowSubjectPicker(false);
    const session = await zaraStorageService.createSession(subject);
    router.push({
      pathname: '/zara-chat',
      params: { chat_id: session.chat_id, subject },
    });
  };

  const handleOpenSession = (session: ZaraChatSession) => {
    router.push({
      pathname: '/zara-chat',
      params: { chat_id: session.chat_id, subject: session.subject ?? '' },
    });
  };

  return (
    <View style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.zaraAvatarSmall}>
            <Sparkles size={16} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Ask Zara</Text>
            <Text style={styles.headerSub}>O-LEVEL AI TUTOR</Text>
          </View>
        </View>
        <Pressable style={styles.newChatBtn} onPress={handleNewChat}>
          <Plus size={18} color="#0c1017" />
          <Text style={styles.newChatBtnText}>New Chat</Text>
        </Pressable>
      </View>

      {/* ── Session list ── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {sessions.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <MessageSquare size={36} color="#2b313a" />
            </View>
            <Text style={styles.emptyTitle}>No chats yet</Text>
            <Text style={styles.emptyDesc}>
              Tap "New Chat" to start a session with Zara, your O-Level tutor.
            </Text>
            <Pressable style={styles.emptyBtn} onPress={handleNewChat}>
              <Text style={styles.emptyBtnText}>Start your first chat</Text>
            </Pressable>
          </View>
        ) : (
          sessions.map((session) => {
            const color = SUBJECT_COLORS[session.subject ?? ''] ?? '#7eabfc';
            const preview =
              session.messages.length > 0
                ? session.messages[0].content.slice(0, 60) +
                  (session.messages[0].content.length > 60 ? '…' : '')
                : 'No messages yet';
            return (
              <Pressable
                key={session.chat_id}
                style={styles.sessionCard}
                onPress={() => handleOpenSession(session)}
              >
                {/* Subject colour indicator */}
                <View
                  style={[styles.sessionIndicator, { backgroundColor: color }]}
                />
                <View style={styles.sessionBody}>
                  <View style={styles.sessionTop}>
                    <View
                      style={[
                        styles.subjectBadge,
                        { backgroundColor: color + '20' },
                      ]}
                    >
                      <Text style={[styles.subjectBadgeText, { color }]}>
                        {session.subject ?? 'General'}
                      </Text>
                    </View>
                    <Text style={styles.sessionTime}>
                      {formatRelativeTime(session.created_at)}
                    </Text>
                  </View>
                  <Text style={styles.sessionPreview} numberOfLines={2}>
                    {preview}
                  </Text>
                  <Text style={styles.sessionMsgCount}>
                    {session.messages.length} message
                    {session.messages.length !== 1 ? 's' : ''}
                  </Text>
                </View>
                <ChevronRight size={18} color="#424753" />
              </Pressable>
            );
          })
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Subject picker modal ── */}
      <Modal
        visible={showSubjectPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSubjectPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSubjectPicker(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose a subject</Text>
              <Pressable onPress={() => setShowSubjectPicker(false)}>
                <X size={20} color="#94a3b8" />
              </Pressable>
            </View>
            <Text style={styles.modalSub}>
              Zara will focus her answers on this subject.
            </Text>
            {SUBJECTS.map((subject) => {
              const color = SUBJECT_COLORS[subject] ?? '#7eabfc';
              return (
                <Pressable
                  key={subject}
                  style={styles.subjectRow}
                  onPress={() => handleSelectSubject(subject)}
                >
                  <View
                    style={[
                      styles.subjectDot,
                      { backgroundColor: color },
                    ]}
                  />
                  <Text style={styles.subjectRowText}>{subject}</Text>
                  <ChevronRight size={16} color="#424753" />
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>

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
        <Pressable style={styles.tabItem}>
          <View style={styles.activeTabWrapper}>
            <Sparkles size={22} color="#7eabfc" />
            <Text style={[styles.tabText, { color: '#7eabfc' }]}>ZARA</Text>
            <View style={styles.activeTabDot} />
          </View>
        </Pressable>
        <Pressable
          style={styles.tabItem}
          onPress={() => router.push('/profile')}
        >
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
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2430',
    backgroundColor: '#11151c',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  zaraAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Theme.typography.headlineLg,
    fontSize: 20,
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  headerSub: {
    ...Theme.typography.labelMd,
    fontSize: 9,
    color: '#6b7280',
    letterSpacing: 1,
    marginTop: 1,
  },
  newChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7eabfc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  newChatBtnText: {
    ...Theme.typography.labelMd,
    fontSize: 13,
    color: '#0c1017',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#161a22',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    ...Theme.typography.headlineLg,
    fontSize: 22,
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 12,
  },
  emptyDesc: {
    ...Theme.typography.bodyLg,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyBtn: {
    backgroundColor: '#7eabfc',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 24,
  },
  emptyBtnText: {
    ...Theme.typography.labelMd,
    fontSize: 14,
    color: '#0c1017',
    fontWeight: '700',
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161a22',
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  sessionIndicator: {
    width: 4,
    alignSelf: 'stretch',
  },
  sessionBody: {
    flex: 1,
    padding: 16,
  },
  sessionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  subjectBadgeText: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  sessionTime: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#6b7280',
  },
  sessionPreview: {
    ...Theme.typography.bodyLg,
    fontSize: 13,
    color: '#d1d5db',
    lineHeight: 18,
    marginBottom: 6,
  },
  sessionMsgCount: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#6b7280',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#161a22',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    paddingTop: 16,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2b313a',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    ...Theme.typography.headlineLg,
    fontSize: 20,
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  modalSub: {
    ...Theme.typography.bodyLg,
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 24,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2430',
    gap: 14,
  },
  subjectDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  subjectRowText: {
    ...Theme.typography.bodyLg,
    flex: 1,
    fontSize: 15,
    color: '#e2e8f0',
    fontWeight: '500',
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
    backgroundColor: '#7eabfc',
  },
  tabText: {
    ...Theme.typography.labelMd,
    fontSize: 9,
    letterSpacing: 0.5,
    color: '#6b7280',
  },
});
