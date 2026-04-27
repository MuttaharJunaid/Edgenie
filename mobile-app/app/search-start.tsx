import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { Menu, Search, ArrowRight, Home, GraduationCap, BarChart2, User } from 'lucide-react-native';
import { Theme } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { searchService } from '../services/search.service';

export default function SearchStartScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [trending, setTrending] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    searchService.getTrending()
        .then(res => {
          const items = res.data.trending || res.data || [];
          setTrending(items.map((item: any) => typeof item === 'string' ? item : item.query || ''));
        })
        .catch(console.error);
  }, []);

  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(() => {
        searchService.getSuggestions(query)
            .then(res => {
              const items = res.data.suggestions || res.data || [];
              setSuggestions(items.map((item: any) => typeof item === 'string' ? item : item.query || ''));
            })
            .catch(console.error);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    router.push({
        pathname: '/search-results',
        params: { query: searchQuery.trim() }
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Navbar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Menu color="#e2e8f0" size={24} />
        </Pressable>
        <Text style={styles.headerLogo}>🧠 Topical Search</Text>
        <Pressable onPress={() => router.push('/profile')}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.profilePic} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleBase}>Ask <Text style={styles.titleItalic}>anything</Text></Text>
          <Text style={styles.subtitle}>Search through 10 years of past papers instantly</Text>
        </View>

        <View style={styles.pillContainer}>
          {trending.length > 0 ? trending.map((item, i) => (
            <Pressable key={i} style={styles.pill} onPress={() => handleSearch(item)}>
              <Text style={[styles.pillText, { color: ['#8bb4f6', '#f5a623', '#d988cc'][i % 3] }]}>{item}</Text>
            </Pressable>
          )) : (
            <>
              <Pressable style={styles.pill} onPress={() => handleSearch('Hard questions on Respiration')}>
                <Text style={[styles.pillText, { color: '#8bb4f6' }]}>Hard questions on Respiration</Text>
              </Pressable>
              <Pressable style={styles.pill} onPress={() => handleSearch('All Algebra 2018–2023')}>
                <Text style={[styles.pillText, { color: '#f5a623' }]}>All Algebra 2018–2023</Text>
              </Pressable>
            </>
          )}
        </View>

        {suggestions.length > 0 && query.length > 0 && (
          <View style={{ marginTop: 24, width: '100%', alignItems: 'center' }}>
             {suggestions.map((s, i) => (
               <Pressable key={i} onPress={() => handleSearch(s)} style={{ paddingVertical: 8 }}>
                 <Text style={{ color: '#e2e8f0' }}>{s}</Text>
               </Pressable>
             ))}
          </View>
        )}
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6b7280" />
          <TextInput 
            style={styles.searchInput}
            placeholder="Enter to search..."
            placeholderTextColor="#6b7280"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch(query)}
            returnKeyType="search"
          />
          <Pressable style={styles.searchActionBtn} onPress={() => handleSearch(query)}>
            <ArrowRight size={20} color="#0c1017" />
          </Pressable>
        </View>
      </View>

      {/* Fixed Bottom Tabs */}
      <View style={styles.bottomTabBar}>
        <Pressable style={styles.tabItem} onPress={() => router.push('/dashboard')}>
          <Home size={22} color="#6b7280" />
          <Text style={styles.tabText}>HOME</Text>
        </Pressable>
        <Pressable style={styles.tabItem}>
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
    marginBottom: 40,
  },
  headerLogo: {
    ...Theme.typography.headlineLg,
    fontSize: 20,
    color: '#e2e8f0',
    fontWeight: 'bold',
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  titleBase: {
    ...Theme.typography.displayMd,
    fontSize: 48,
    color: '#e2e8f0',
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  titleItalic: {
    fontStyle: 'italic',
    color: '#a3c0f7',
  },
  subtitle: {
    ...Theme.typography.bodyLg,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  pillContainer: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  pill: {
    backgroundColor: '#1b1f28',
    borderWidth: 1,
    borderColor: '#2b313a',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  pillText: {
    ...Theme.typography.bodyLg,
    fontWeight: '500',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80, // space for tab bar
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161a22',
    height: 64,
    borderRadius: 32,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#2b313a',
  },
  searchInput: {
    flex: 1,
    ...Theme.typography.bodyLg,
    color: '#ffffff',
    marginLeft: 12,
  },
  searchActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
