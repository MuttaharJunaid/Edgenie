import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, Platform, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { Menu, Search, ArrowUp, Home, GraduationCap, BarChart2, User, Sparkles, Lightbulb, X, ArrowRight } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { chatService } from '../services/chat.service';
import { authService } from '../services/auth.service';

export default function SearchChatScreen() {
  const router = useRouter();
  const { id: sessionId } = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);

  const [messages, setMessages] = useState([
    { id: '1', role: 'ai', text: 'Hello! I am PaperMind AI. How can I help you study today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    authService.getStoredUser().then(u => setUser(u));
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMsg = { id: Date.now().toString(), role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText('');
    setLoading(true);

    try {
      // Use the sessionId if provided, fallback to 'default'
      const targetSession = (sessionId as string) || 'default';
      const res = await chatService.sendMessage(targetSession, currentInput);
      const aiMsg = { id: (Date.now() + 1).toString(), role: 'ai', text: res.data.response || res.data.text || res.data };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: 'err', role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Navbar AI Profile */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.push('/profile')}>
            <Image source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150?img=12' }} style={styles.profilePic} />
          </Pressable>
          <View>
            <Text style={styles.headerTitle}>PAPERMIND AI</Text>
            <View style={styles.onlineContainer}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>AI ASSISTANT ONLINE</Text>
            </View>
          </View>
        </View>
        <Pressable onPress={() => router.push('/search-results')}>
          <Menu color="#e2e8f0" size={24} />
        </Pressable>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={msg.role === 'user' ? styles.userBubbleWrapper : styles.aiMessageWrapper}>
            {msg.role === 'ai' && (
              <View style={styles.aiAvatar}>
                <Sparkles size={16} color="#ffffff" />
              </View>
            )}
            
            <View style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
              <Text style={msg.role === 'user' ? styles.userText : styles.aiText}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={styles.aiMessageWrapper}>
            <View style={styles.aiAvatar}>
              <Sparkles size={16} color="#ffffff" />
            </View>
            <View style={[styles.aiBubble, { paddingVertical: 12 }]}>
              <ActivityIndicator color="#7eabfc" />
            </View>
          </View>
        )}
        
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Chat Input */}
      <View style={styles.bottomSection}>
        <View style={styles.searchContainer}>
          <TextInput 
            style={styles.searchInput}
            placeholder="Ask anything..."
            placeholderTextColor="#6b7280"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
          />
          <Pressable style={styles.searchActionBtn} onPress={handleSend}>
            {loading ? <ActivityIndicator size={20} color="#0c1017" /> : <ArrowUp size={20} color="#0c1017" />}
          </Pressable>
        </View>
      </View>

      {/* Fixed Bottom Tabs */}
      <View style={styles.bottomTabBar}>
        <Pressable style={styles.tabItem} onPress={() => router.push('/dashboard')}>
          <Home size={22} color="#6b7280" />
          <Text style={styles.tabText}>HOME</Text>
        </Pressable>
        <Pressable style={styles.tabItem} onPress={() => router.push('/search-start')}>
          <Search size={24} color="#7eabfc" />
          <Text style={[styles.tabText, { color: '#7eabfc' }]}>SEARCH</Text>
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
    backgroundColor: '#11151c',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e2430',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTitle: {
    ...Theme.typography.labelMd,
    color: '#7eabfc',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  onlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  userBubbleWrapper: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  userBubble: {
    backgroundColor: '#1a4bb8', // deep blue
    padding: 16,
    borderRadius: 20,
    borderTopRightRadius: 4,
    maxWidth: '85%',
  },
  userText: {
    ...Theme.typography.bodyLg,
    color: '#ffffff',
    lineHeight: 22,
  },
  aiMessageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 32,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  aiBubble: {
    flex: 1,
    backgroundColor: '#1b1f28',
    padding: 20,
    borderRadius: 20,
    borderTopLeftRadius: 4,
  },
  aiText: {
    ...Theme.typography.bodyLg,
    color: '#e2e8f0',
    lineHeight: 24,
    marginBottom: 16,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#2b313a',
    borderRadius: 12,
    gap: 6,
  },
  filterText: {
    ...Theme.typography.labelMd,
    fontSize: 11,
    color: '#d1d5db',
    fontWeight: '600',
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: 'rgba(126, 171, 252, 0.05)',
    borderLeftWidth: 2,
    borderLeftColor: '#7eabfc',
    borderRadius: 8,
  },
  insightText: {
    flex: 1,
    ...Theme.typography.bodyLg,
    fontSize: 14,
    color: '#a3c0f7',
    lineHeight: 20,
  },
  sectionHeading: {
    ...Theme.typography.labelMd,
    color: '#9ca3af',
    letterSpacing: 2,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questionCard: {
    backgroundColor: '#1b1f28',
    borderRadius: 20,
    padding: 20,
    paddingLeft: 24, // extra for indicator
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  cardIndicatorGreen: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#10b981',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pillRed: {
    backgroundColor: '#f25c54',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillTextRed: {
    ...Theme.typography.labelMd,
    fontSize: 9,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  pillGrey: {
    backgroundColor: '#2b313a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillTextGrey: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#d1d5db',
  },
  metaText: {
    ...Theme.typography.labelMd,
    fontSize: 11,
    color: '#8a92a1',
  },
  matchWrapper: {
    alignItems: 'flex-end',
    gap: 4,
  },
  matchText: {
    ...Theme.typography.labelMd,
    fontSize: 9,
    color: '#e2e8f0',
    fontWeight: 'bold',
  },
  matchBarBase: {
    width: 40,
    height: 3,
    backgroundColor: '#2b313a',
    borderRadius: 1.5,
  },
  matchBarFill: {
    height: '100%',
    backgroundColor: '#7eabfc',
    borderRadius: 1.5,
  },
  questionText: {
    ...Theme.typography.bodyLg,
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btnPractice: {
    backgroundColor: '#8facfb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnPracticeText: {
    ...Theme.typography.labelMd,
    color: '#0c1017',
    fontWeight: 'bold',
    fontSize: 12,
  },
  btnScheme: {
    backgroundColor: '#2b313a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
  },
  btnSchemeText: {
    ...Theme.typography.labelMd,
    color: '#e2e8f0',
    fontWeight: 'bold',
    fontSize: 12,
  },
  bottomSection: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 80,
    width: '100%',
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161a22',
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2b313a',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  searchInput: {
    flex: 1,
    ...Theme.typography.bodyLg,
    color: '#ffffff',
    marginLeft: 8,
  },
  searchActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7eabfc',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#6b7280',
  },
});
