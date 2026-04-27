/**
 * Local persistence for Zara chat sessions.
 *
 * Uses AsyncStorage — the same mechanism the rest of the app uses
 * for auth tokens and user data.
 *
 * Storage key: 'zara_sessions'
 * Value: JSON array of ZaraChatSession objects, newest first.
 *
 * Each session:
 *   { chat_id, subject, created_at, messages: [{ role, content, timestamp }] }
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZaraChatSession, ZaraMessage } from './zara.service';

const STORAGE_KEY = 'zara_sessions';
const MAX_SESSIONS = 50; // cap to avoid unbounded storage growth

export const zaraStorageService = {
  /** Load all sessions, newest first. */
  getSessions: async (): Promise<ZaraChatSession[]> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /** Get a single session by chat_id. */
  getSession: async (chat_id: string): Promise<ZaraChatSession | null> => {
    const sessions = await zaraStorageService.getSessions();
    return sessions.find((s) => s.chat_id === chat_id) ?? null;
  },

  /** Create a new session and persist it. Returns the new session. */
  createSession: async (
    subject: string | null,
  ): Promise<ZaraChatSession> => {
    const session: ZaraChatSession = {
      chat_id: `zara_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      subject,
      created_at: new Date().toISOString(),
      messages: [],
    };
    const sessions = await zaraStorageService.getSessions();
    const updated = [session, ...sessions].slice(0, MAX_SESSIONS);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return session;
  },

  /** Append a message to an existing session. */
  appendMessage: async (
    chat_id: string,
    message: ZaraMessage,
  ): Promise<void> => {
    const sessions = await zaraStorageService.getSessions();
    const updated = sessions.map((s) =>
      s.chat_id === chat_id
        ? { ...s, messages: [...s.messages, message] }
        : s,
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  /** Delete a session by chat_id. */
  deleteSession: async (chat_id: string): Promise<void> => {
    const sessions = await zaraStorageService.getSessions();
    const updated = sessions.filter((s) => s.chat_id !== chat_id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  /** Clear all sessions. */
  clearAll: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};

export default zaraStorageService;
