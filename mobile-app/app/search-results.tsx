import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { Menu, Search, Home, GraduationCap, BarChart2, User, Sparkles, X, ArrowRight, ArrowDownUp, ExternalLink } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { searchService } from '../services/search.service';
import { Question } from '../types/models';

export default function SearchResultsScreen() {
  const router = useRouter();
  const { query, subject_id, year, difficulty } = useLocalSearchParams();
  const [results, setResults] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    searchService.search({ 
        query: (query as string) || '', 
        subject_id: subject_id as string,
        year_from: year ? parseInt(year as string) : undefined,
        difficulty: (difficulty as string)
    })
    .then((res: { data: { results?: any[]; data?: any[] } | any[] }) => {
      const data = res.data as any;
      setResults(data.results || data || []);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  }, [query, subject_id, year, difficulty]);

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
        
        {/* User Intent Bubble */}
        <View style={styles.intentBubbleWrapper}>
          <View style={styles.intentBubble}>
            <Text style={styles.intentText}>{query ? (query as string) : 'All accessible questions'}</Text>
          </View>
        </View>

        {/* AI Summary Box */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryHeader}>
            <Sparkles size={16} color="#a3c0f7" />
            <Text style={styles.summaryTitle}>
              Found {loading ? '...' : results.length} questions matching your search
            </Text>
          </View>
          
          <View style={styles.filterChipsRow}>
            {difficulty && (
              <View style={[styles.filterChip, { backgroundColor: '#362327' }]}>
                <Text style={[styles.filterText, { color: '#f25c54' }]}>{difficulty} </Text>
                <X size={12} color="#f25c54" />
              </View>
            )}
            {subject_id && (
              <View style={[styles.filterChip, { backgroundColor: '#133329' }]}>
                <Text style={[styles.filterText, { color: '#10b981' }]}>Sub: {subject_id} </Text>
                <X size={12} color="#10b981" />
              </View>
            )}
            {year && (
              <View style={styles.filterChip}>
                <Text style={styles.filterText}>{year} </Text>
                <X size={12} color="#a1a9b8" />
              </View>
            )}
          </View>
          {(!difficulty && !subject_id && !year) && <Text style={{color: '#a1a9b8', fontSize: 12}}>No active filters</Text>}
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeaderRow}>
          <View>
            <Text style={styles.resultsLabel}>RESULTS</Text>
            <Text style={styles.resultsFoundTitle}>{loading ? 'Searching...' : `${results.length} questions\nfound`}</Text>
          </View>
          <Pressable style={styles.btnSort}>
            <ArrowDownUp size={14} color="#d1d5db" />
            <Text style={styles.btnSortText}>Sort</Text>
          </Pressable>
        </View>

        {loading ? (
             <ActivityIndicator size="large" color="#7eabfc" style={{ marginTop: 40 }} />
        ) : results.length > 0 ? results.map((q) => (
            <View key={q.id} style={styles.questionCard}>
              <View style={styles.cardIndicatorGreen} />
              
              <View style={styles.cardHeader}>
                <View style={styles.metaRow}>
                  <View style={styles.pillRed}><Text style={styles.pillTextRed}>{(q.difficulty || 'MEDIUM').toUpperCase()}</Text></View>
                  <View style={styles.pillGrey}><Text style={styles.pillTextGrey}>{q.marks || 1} MARKS</Text></View>
                  <Text style={styles.metaText}>{q.paper?.year || '20??'} • {q.paper?.season || 'M/J'} • P{q.paper?.paper_number || 1}</Text>
                </View>
              </View>

              <View style={styles.relevanceRow}>
                <Text style={styles.relevanceLabel}>Relevance</Text>
                <View style={styles.relevanceBarBase}><View style={[styles.relevanceBarFill, { width: '90%' }]} /></View>
              </View>

              <Text style={styles.questionText}>
                {q.text || `Question ${q.number} text not available in preview.`}
              </Text>

              <View style={styles.actionRowPrimary}>
                <Pressable style={styles.btnPractice} onPress={() => router.push({ pathname: '/question', params: { id: q.id }})}>
                  <Text style={styles.btnPracticeText}>Practice</Text>
                  <ArrowRight size={14} color="#0c1017" />
                </Pressable>
                <Pressable style={styles.btnScheme}>
                  <Text style={styles.btnSchemeText}>Mark Scheme</Text>
                </Pressable>
              </View>
            </View>
        )) : (
            <Text style={{color: '#9ca3af', textAlign: 'center', marginTop: 40}}>No questions matched your search criteria.</Text>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

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
    paddingHorizontal: 20,
  },
  intentBubbleWrapper: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  intentBubble: {
    backgroundColor: '#7eabfc',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
    maxWidth: '85%',
  },
  intentText: {
    ...Theme.typography.bodyLg,
    color: '#0c1017',
    fontWeight: '600',
  },
  summaryBox: {
    backgroundColor: '#161a22',
    padding: 24,
    borderRadius: 24,
    marginBottom: 32,
  },
  summaryHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryTitle: {
    flex: 1,
    ...Theme.typography.headlineLg,
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 22,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
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
  relatedHeading: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#8a92a1',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  relatedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relatedChip: {
    backgroundColor: '#12161c',
    borderWidth: 1,
    borderColor: '#2b313a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  relatedText: {
    ...Theme.typography.labelMd,
    fontSize: 12,
    color: '#e2e8f0',
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  resultsLabel: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    letterSpacing: 1.5,
    color: '#8a92a1',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultsFoundTitle: {
    ...Theme.typography.displayMd,
    fontSize: 32,
    lineHeight: 36,
    color: '#ffffff',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  btnSort: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#161a22',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnSortText: {
    ...Theme.typography.labelMd,
    color: '#e2e8f0',
  },
  questionCard: {
    backgroundColor: '#1b1f28',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  cardIndicatorGreen: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#10b981',
  },
  cardHeader: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
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
    fontSize: 9,
    color: '#d1d5db',
    fontWeight: 'bold',
  },
  metaText: {
    ...Theme.typography.labelMd,
    fontSize: 11,
    color: '#8a92a1',
  },
  relevanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  relevanceLabel: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#a1a9b8',
  },
  relevanceBarBase: {
    flex: 1,
    height: 4,
    backgroundColor: '#2b313a',
    borderRadius: 2,
  },
  relevanceBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  relevanceScore: {
    ...Theme.typography.labelMd,
    fontSize: 10,
    color: '#10b981',
    fontWeight: 'bold',
  },
  questionText: {
    ...Theme.typography.bodyLg,
    color: '#ffffff',
    lineHeight: 26,
    marginBottom: 20,
    fontSize: 16,
  },
  actionRowPrimary: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
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
  actionRowSecondary: {
    flexDirection: 'row',
  },
  btnPdf: {
    backgroundColor: '#222631',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  btnPdfText: {
    ...Theme.typography.labelMd,
    fontSize: 11,
    color: '#d1d5db',
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
    color: '#6b7280',
  },
});
