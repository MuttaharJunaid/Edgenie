/**
 * Zara chatbot service — O-Level AI tutor for the mobile app.
 *
 * Uses the shared axios instance from api.ts (JWT auth, auto-refresh).
 * Stateless — history is managed in local state and sent with every call.
 */
import api from './api';

export interface ZaraMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO string
}

export interface ZaraChatSession {
  chat_id: string;
  subject: string | null;
  created_at: string;
  messages: ZaraMessage[];
}

export interface ZaraChatRequest {
  message: string;
  history: Array<{ role: 'user' | 'assistant'; content: string }>;
  subject: string | null;
  chat_id: string;
}

export interface ZaraChatResponse {
  reply: string;
}

export const zaraService = {
  /**
   * Send a message to Zara and get a reply.
   * History is the full conversation so far (excluding the current message).
   */
  sendMessage: (payload: ZaraChatRequest) =>
    api.post<ZaraChatResponse>('/api/chat/zara/', payload),
};

export default zaraService;
