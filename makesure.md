# API V2 Documentation (Gemini API)

Complete documentation for OrenaX Backend API V2 using **Gemini API**.

> **Frontend Framework**: Vite + React + TypeScript (TSX)

## 📋 Quick Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v2/chat` | POST | Chat (streaming/non-streaming) |
| `/api/v2/chat/stream` | POST | Force streaming chat |
| `/api/v2/image/generate` | POST | Generate images |
| `/api/v2/video/generate` | POST | Text-to-video |
| `/api/v2/video/image-to-video` | POST | Image-to-video |
| `/api/v2/music/generate` | POST | Generate music |
| `/api/v2/tts/single` | POST | Single speaker TTS |
| `/api/v2/tts/multi` | POST | Multi-speaker TTS |
| `/api/v2/tts/voices` | GET | List voices |

## 📚 Documentation Files

| File | Description |
|------|-------------|
| [chat-stream.md](./chat-stream.md) | Chat streaming with SSE |
| [thinking-guide.md](./thinking-guide.md) | Thinking mode configuration |
| [tools-guide.md](./tools-guide.md) | Google Search, function calling, code execution |
| [image-guide.md](./image-guide.md) | Image generation |
| [video-guide.md](./video-guide.md) | Video generation (Veo) |
| [music-guide.md](./music-guide.md) | Music generation (Lyria) |
| [tts-guide.md](./tts-guide.md) | Text-to-Speech |
| [frontend-guide.md](./frontend-guide.md) | Complete Vite/TSX integration |

---

## Base URL & Authentication

```
Base URL: https://your-backend.com/api/v2
```

**All endpoints require JWT authentication:**
```
Authorization: Bearer <access_token>
```

---

## Vite + TSX Setup

### 1. Project Structure

```
src/
├── api/
│   ├── client.ts           # Base HTTP client
│   ├── auth.ts             # Auth API
│   ├── chat.ts             # Chat API
│   ├── image.ts            # Image API
│   ├── video.ts            # Video API
│   ├── music.ts            # Music API
│   └── tts.ts              # TTS API
├── hooks/
│   ├── useAuth.ts
│   ├── useChat.ts
│   └── useMediaGeneration.ts
├── types/
│   └── api.types.ts        # All TypeScript interfaces
├── context/
│   └── AuthContext.tsx
└── components/
    └── Chat/
```

### 2. Install Dependencies

```bash
npm install axios
```

### 3. Base API Client (`src/api/client.ts`)

```typescript
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_V2_BASE_URL = import.meta.env.VITE_API_URL + '/api/v2';

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_V2_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth interceptor
    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });
  }

  setToken(token: string | null) {
    this.accessToken = token;
  }

  getToken(): string | null {
    return this.accessToken;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  // For SSE streaming
  async postStream(url: string, data: unknown): Promise<Response> {
    const response = await fetch(`${API_V2_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
      },
      body: JSON.stringify(data),
    });
    return response;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
```

### 4. TypeScript Interfaces (`src/types/api.types.ts`)

```typescript
// ============= CHAT TYPES =============
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ThinkingConfig {
  thinkingBudget?: number;      // For Gemini 2.5: 0-24576
  thinkingLevel?: 'low' | 'high'; // For Gemini 3
  includeThoughts?: boolean;
}

export interface GenerationConfig {
  temperature?: number;         // 0-2
  topP?: number;                // 0-1
  topK?: number;                // 1-40
  maxOutputTokens?: number;     // Max tokens
}

export interface Tool {
  googleSearch?: { enabled: boolean };
  codeExecution?: Record<string, never>;
  functionDeclarations?: FunctionDeclaration[];
}

export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string }>;
    required?: string[];
  };
}

export interface ChatRequest {
  prompt?: string;
  messages?: ChatMessage[];
  model?: string;
  stream?: boolean;
  thinkingConfig?: ThinkingConfig;
  generationConfig?: GenerationConfig;
  tools?: Tool[];
}

export interface UsageMetadata {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
  thoughtsTokenCount?: number;
}

export interface GroundingChunk {
  web?: { uri: string; title: string };
}

export interface GroundingMetadata {
  webSearchQueries?: string[];
  groundingChunks?: GroundingChunk[];
  searchEntryPoint?: { renderedContent: string };
}

export interface FunctionCall {
  name: string;
  args: Record<string, unknown>;
}

export interface ChatResponse {
  message: ChatMessage;
  usageMetadata?: UsageMetadata;
  conversationId?: string;
  thoughts?: string[];
  groundingMetadata?: GroundingMetadata;
  functionCalls?: FunctionCall[];
}

export interface ChatStreamChunk {
  text?: string;
  thought?: string;
  done: boolean;
  finishReason?: string;
  usageMetadata?: UsageMetadata;
  groundingMetadata?: GroundingMetadata;
  functionCall?: FunctionCall;
}

// ============= IMAGE TYPES =============
export interface ImageRequest {
  prompt: string;
  model?: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  numberOfImages?: number;
}

export interface GeneratedImage {
  url: string;
  gcsUri?: string;
  filename?: string;
  mimeType?: string;
}

export interface ImageResponse {
  success: boolean;
  model: string;
  images: GeneratedImage[];
}

// ============= VIDEO TYPES =============
export interface VideoRequest {
  prompt: string;
  model?: string;
  negativePrompt?: string;
  aspectRatio?: '16:9' | '9:16';
  durationSeconds?: number;
  generateAudio?: boolean;
}

export interface ImageToVideoRequest {
  prompt: string;
  image: {
    bytesBase64Encoded: string;
    mimeType: string;
  };
  durationSeconds?: number;
  generateAudio?: boolean;
}

export interface VideoResponse {
  success: boolean;
  url: string;
  gcsUri?: string;
  filename?: string;
  model: string;
  duration: number;
  aspectRatio: string;
  hasAudio: boolean;
}

// ============= MUSIC TYPES =============
export interface WeightedPrompt {
  text: string;
  weight?: number;
}

export interface MusicRequest {
  prompts: WeightedPrompt[];
  durationSeconds?: number;
  bpm?: number;
  temperature?: number;
}

export interface MusicResponse {
  success: boolean;
  url: string;
  gcsUri?: string;
  filename?: string;
  model: string;
  durationSeconds: number;
}

// ============= TTS TYPES =============
export interface SingleTtsRequest {
  text: string;
  voiceName?: string;
  model?: string;
}

export interface SpeakerConfig {
  speakerName: string;
  voiceName: string;
}

export interface MultiTtsRequest {
  text: string;
  speakerConfigs: SpeakerConfig[];
}

export interface TtsResponse {
  success: boolean;
  url: string;
  gcsUri?: string;
  filename?: string;
  mimeType?: string;
}

export interface VoiceInfo {
  name: string;
  description?: string;
}
```

---

## Models Reference

### Chat Models
| Model | Thinking | Best For |
|-------|----------|----------|
| `gemini-2.5-flash` | thinkingBudget (0-24576) | Fast + capable |
| `gemini-2.5-pro` | thinkingBudget (128-32768) | Complex reasoning |
| `gemini-3-pro-preview` | thinkingLevel (low/high) | Latest features |
| `gemini-2.0-flash` | ❌ | Production |

### Image Models
| Model | Description |
|-------|-------------|
| `imagen-4.0-generate-001` | Latest Imagen |
| `gemini-2.5-flash-image` | Gemini native |

### Video Models
| Model | Features |
|-------|----------|
| `veo-3.1-generate-preview` | 8s, audio |

### Music Models
| Model | Description |
|-------|-------------|
| `lyria-realtime-exp` | WebSocket, configurable duration |

### TTS Models
| Model | Description |
|-------|-------------|
| `gemini-2.5-flash-preview-tts` | 30 voices, 24kHz |


# Chat Streaming Guide (API V2)

Complete SSE streaming implementation for Vite + React + TypeScript.

## Endpoint

```
POST /api/v2/chat/stream
POST /api/v2/chat (with stream: true)
```

## Request Format

```typescript
interface ChatRequest {
  prompt?: string;                    // Simple text prompt
  messages?: ChatMessage[];           // Multi-turn conversation
  model?: string;                     // Default: 'gemini-2.5-flash'
  stream?: boolean;                   // true for streaming
  thinkingConfig?: ThinkingConfig;    // Thinking mode
  generationConfig?: GenerationConfig;
  tools?: Tool[];                     // Google Search, code execution
}

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface ThinkingConfig {
  thinkingBudget?: number;            // 0-24576 for Gemini 2.5
  thinkingLevel?: 'low' | 'high';     // For Gemini 3
  includeThoughts?: boolean;          // Return thoughts in response
}

interface GenerationConfig {
  temperature?: number;               // 0-2, default 1.0
  topP?: number;                      // 0-1, default 0.95
  topK?: number;                      // 1-40, default 40
  maxOutputTokens?: number;           // Default 8192
}
```

## SSE Response Format

Each SSE event is `data: <JSON>\n\n`:

```typescript
interface ChatStreamChunk {
  text?: string;                      // Text content
  thought?: string;                   // Thinking content
  done: boolean;                      // Stream complete
  finishReason?: string;              // 'STOP', 'MAX_TOKENS', etc.
  usageMetadata?: UsageMetadata;      // Token usage (final chunk)
  groundingMetadata?: GroundingMetadata;  // Search results
  functionCall?: FunctionCall;        // Function to call
  codeExecutionResult?: CodeResult;   // Code execution output
}
```

Final event: `data: [DONE]\n\n`

---

## Complete Vite + TSX Implementation

### 1. Chat API Service (`src/api/chat.ts`)

```typescript
import apiClient from './client';
import type { ChatRequest, ChatResponse, ChatStreamChunk } from '../types/api.types';

export const chatApi = {
  /**
   * Non-streaming chat
   */
  async send(request: ChatRequest): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>('/chat', {
      ...request,
      stream: false,
    });
  },

  /**
   * Streaming chat - returns async generator
   */
  async *stream(request: ChatRequest): AsyncGenerator<ChatStreamChunk> {
    const response = await apiClient.postStream('/chat/stream', {
      ...request,
      stream: true,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Stream request failed');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') return;
            if (data) {
              try {
                yield JSON.parse(data) as ChatStreamChunk;
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  },
};

export default chatApi;
```

### 2. useChat Hook (`src/hooks/useChat.ts`)

```typescript
import { useState, useCallback, useRef } from 'react';
import chatApi from '../api/chat';
import type { ChatMessage, ChatRequest, ChatStreamChunk, ThinkingConfig } from '../types/api.types';

interface UseChatOptions {
  model?: string;
  thinkingConfig?: ThinkingConfig;
  onChunk?: (chunk: ChatStreamChunk) => void;
  onThought?: (thought: string) => void;
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
}

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  currentThought: string;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  sendMessageStream: (content: string) => Promise<void>;
  clearMessages: () => void;
  stopStreaming: () => void;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentThought, setCurrentThought] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);

    try {
      const request: ChatRequest = {
        messages: [...messages, userMessage],
        model: options.model || 'gemini-2.5-flash',
        thinkingConfig: options.thinkingConfig,
      };

      const response = await chatApi.send(request);
      
      setMessages(prev => [...prev, response.message]);
      options.onComplete?.(response.message.content);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      setError(message);
      options.onError?.(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [messages, options]);

  const sendMessageStream = useCallback(async (content: string) => {
    setIsLoading(true);
    setIsStreaming(true);
    setError(null);
    setCurrentThought('');
    abortRef.current = false;

    const userMessage: ChatMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);

    let fullText = '';

    try {
      const request: ChatRequest = {
        messages: [...messages, userMessage],
        model: options.model || 'gemini-2.5-flash',
        thinkingConfig: options.thinkingConfig,
        stream: true,
      };

      // Add placeholder for assistant message
      setMessages(prev => [...prev, { role: 'model', content: '' }]);

      for await (const chunk of chatApi.stream(request)) {
        if (abortRef.current) break;

        options.onChunk?.(chunk);

        if (chunk.thought) {
          setCurrentThought(prev => prev + chunk.thought);
          options.onThought?.(chunk.thought);
        }

        if (chunk.text) {
          fullText += chunk.text;
          // Update the last message (assistant)
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: 'model', content: fullText };
            return updated;
          });
        }

        if (chunk.done) {
          options.onComplete?.(fullText);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Streaming failed';
      setError(message);
      options.onError?.(err as Error);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [messages, options]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setCurrentThought('');
  }, []);

  const stopStreaming = useCallback(() => {
    abortRef.current = true;
    setIsStreaming(false);
  }, []);

  return {
    messages,
    isLoading,
    isStreaming,
    currentThought,
    error,
    sendMessage,
    sendMessageStream,
    clearMessages,
    stopStreaming,
  };
}

export default useChat;
```

### 3. Chat Component (`src/components/Chat/ChatBox.tsx`)

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';

interface ChatBoxProps {
  model?: string;
  enableThinking?: boolean;
  thinkingBudget?: number;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  model = 'gemini-2.5-flash',
  enableThinking = false,
  thinkingBudget = 1024,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isStreaming,
    currentThought,
    error,
    sendMessageStream,
    stopStreaming,
  } = useChat({
    model,
    thinkingConfig: enableThinking
      ? { thinkingBudget, includeThoughts: true }
      : undefined,
    onComplete: (text) => {
      console.log('Complete:', text);
    },
  });

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentThought]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');
    await sendMessageStream(message);
  };

  return (
    <div className="chat-container">
      {/* Messages */}
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <div className="message-content">{msg.content}</div>
          </div>
        ))}

        {/* Thinking indicator */}
        {isStreaming && currentThought && (
          <div className="thinking">
            <span className="thinking-label">🧠 Thinking...</span>
            <div className="thinking-content">{currentThought}</div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && !isStreaming && (
          <div className="loading">Loading...</div>
        )}

        {/* Error */}
        {error && <div className="error">{error}</div>}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        {isStreaming ? (
          <button type="button" onClick={stopStreaming}>
            Stop
          </button>
        ) : (
          <button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </button>
        )}
      </form>
    </div>
  );
};

export default ChatBox;
```

### 4. CSS Styles (`src/components/Chat/ChatBox.css`)

```css
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
  background: #007bff;
  color: white;
}

.message.model {
  align-self: flex-start;
  background: #f0f0f0;
  color: #333;
}

.thinking {
  align-self: flex-start;
  background: #fff3cd;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  max-width: 80%;
  font-style: italic;
}

.thinking-label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.input-form {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #ddd;
}

.input-form input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.input-form button {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.input-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  padding: 0.5rem;
}
```

---

## Example Usage

### Basic Chat
```tsx
<ChatBox />
```

### With Thinking Mode
```tsx
<ChatBox
  model="gemini-2.5-flash"
  enableThinking={true}
  thinkingBudget={2048}
/>
```

### With Google Search
```typescript
const request: ChatRequest = {
  prompt: "What's the latest news about AI?",
  model: 'gemini-2.5-flash',
  tools: [
    { googleSearch: { enabled: true } }
  ],
};
```

### With Code Execution
```typescript
const request: ChatRequest = {
  prompt: "Calculate the first 10 Fibonacci numbers",
  model: 'gemini-2.5-flash',
  tools: [
    { codeExecution: {} }
  ],
};
```
# Frontend Integration Guide

## Overview

This guide provides complete TypeScript/JavaScript examples for integrating the OrenaX API V2 into your frontend application.

---

## TypeScript Interfaces

```typescript
// === Request Types ===

interface ChatRequest {
  prompt?: string;
  messages?: Array<{ role: 'user' | 'model'; content: string }>;
  contents?: ContentPart[];
  model?: string;
  stream?: boolean;
  systemInstruction?: string;
  generationConfig?: GenerationConfig;
  thinkingConfig?: ThinkingConfig;
  tools?: Tool[];
  toolConfig?: ToolConfig;
  safetySettings?: SafetySetting[];
}

interface GenerationConfig {
  temperature?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  responseMimeType?: 'text/plain' | 'application/json';
  responseSchema?: object;
}

interface ThinkingConfig {
  thinkingLevel?: 'low' | 'high';
  thinkingBudget?: number;
  includeThoughts?: boolean;
}

interface Tool {
  googleSearch?: {};
  codeExecution?: {};
  functionDeclarations?: FunctionDeclaration[];
}

// === Response Types ===

interface StreamChunk {
  text?: string;
  thought?: string;
  functionCall?: { name: string; args: Record<string, unknown> };
  codeExecutionResult?: { code: string; language: string; output: string };
  groundingMetadata?: GroundingMetadata;
  done: boolean;
  finishReason?: string;
  usageMetadata?: UsageMetadata;
}

interface GroundingMetadata {
  groundingChunks?: Array<{ web?: { uri: string; title: string } }>;
  webSearchQueries?: string[];
}

interface UsageMetadata {
  promptTokenCount: number;
  candidatesTokenCount: number;
  thoughtsTokenCount?: number;
  totalTokenCount: number;
}

interface ImageResult {
  images: Array<{ url?: string; base64Data?: string; mimeType: string }>;
  prompt: string;
  model: string;
  generatedAt: string;
}

interface VideoResult {
  success: boolean;
  url: string;
  gcsUri: string;
  filename: string;
  prompt: string;
  model: string;
  duration: number;
  resolution: string;
  aspectRatio: string;
  hasAudio: boolean;
  generatedAt: string;
  operationId: string;
}
```

---

## API Client Class

```typescript
class OrenaXClient {
  private baseUrl: string;
  private token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  private headers() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  // === Chat Streaming ===
  async *streamChat(request: ChatRequest): AsyncGenerator<StreamChunk> {
    const response = await fetch(`${this.baseUrl}/api/v2/chat/stream`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          
          try {
            yield JSON.parse(data) as StreamChunk;
          } catch {}
        }
      }
    }
  }

  // === Non-Streaming Chat ===
  async chat(request: ChatRequest): Promise<ChatResponse> {
    request.stream = false;
    const response = await fetch(`${this.baseUrl}/api/v2/chat`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(request),
    });
    return response.json();
  }

  // === Image Generation ===
  async generateImage(request: ImageGenerationRequest): Promise<ImageResult> {
    const response = await fetch(`${this.baseUrl}/api/v2/image/generate`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(request),
    });
    return response.json();
  }

  // === Video Generation ===
  async generateVideo(request: VideoGenerationRequest): Promise<VideoResult> {
    const response = await fetch(`${this.baseUrl}/api/v2/video/generate`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(request),
    });
    return response.json();
  }
}
```

---

## React Hook Example

```typescript
import { useState, useCallback } from 'react';

interface UseStreamChatResult {
  response: string;
  thoughts: string[];
  isLoading: boolean;
  error: string | null;
  groundingMetadata: GroundingMetadata | null;
  sendMessage: (prompt: string, options?: ChatOptions) => Promise<void>;
}

export function useStreamChat(client: OrenaXClient): UseStreamChatResult {
  const [response, setResponse] = useState('');
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groundingMetadata, setGroundingMetadata] = useState<GroundingMetadata | null>(null);

  const sendMessage = useCallback(async (prompt: string, options?: ChatOptions) => {
    setIsLoading(true);
    setError(null);
    setResponse('');
    setThoughts([]);
    setGroundingMetadata(null);

    try {
      for await (const chunk of client.streamChat({
        prompt,
        model: options?.model || 'gemini-2.0-flash',
        thinkingConfig: options?.enableThinking ? {
          thinkingBudget: 8192,
          includeThoughts: true,
        } : undefined,
        tools: options?.enableSearch ? [{ googleSearch: {} }] : undefined,
      })) {
        if (chunk.text) {
          setResponse(prev => prev + chunk.text);
        }
        if (chunk.thought) {
          setThoughts(prev => [...prev, chunk.thought!]);
        }
        if (chunk.groundingMetadata) {
          setGroundingMetadata(chunk.groundingMetadata);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  return { response, thoughts, isLoading, error, groundingMetadata, sendMessage };
}
```

---

## React Component Examples

### Chat Interface
```tsx
function ChatInterface() {
  const client = useMemo(() => new OrenaXClient(API_URL, token), [token]);
  const { response, thoughts, isLoading, groundingMetadata, sendMessage } = useStreamChat(client);
  const [input, setInput] = useState('');
  
  const handleSubmit = () => {
    sendMessage(input, { enableSearch: true });
    setInput('');
  };

  return (
    <div className="chat-container">
      {/* Thinking Panel */}
      {thoughts.length > 0 && (
        <div className="thinking-panel">
          <h4>💭 Thinking</h4>
          {thoughts.map((t, i) => <p key={i}>{t}</p>)}
        </div>
      )}
      
      {/* Response */}
      <div className="response">
        <ReactMarkdown>{response}</ReactMarkdown>
      </div>
      
      {/* Citations */}
      {groundingMetadata?.groundingChunks && (
        <div className="citations">
          <h4>Sources</h4>
          {groundingMetadata.groundingChunks.map((c, i) => (
            <a key={i} href={c.web?.uri} target="_blank">
              [{i + 1}] {c.web?.title}
            </a>
          ))}
        </div>
      )}
      
      {/* Input */}
      <div className="input-area">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSubmit()}
          disabled={isLoading}
        />
        <button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
```

### Image Generator
```tsx
function ImageGenerator() {
  const client = useMemo(() => new OrenaXClient(API_URL, token), [token]);
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<ImageResult['images']>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    setIsLoading(true);
    try {
      const result = await client.generateImage({
        prompt,
        aspectRatio: '16:9',
      });
      setImages(result.images);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input value={prompt} onChange={e => setPrompt(e.target.value)} />
      <button onClick={generate} disabled={isLoading}>Generate</button>
      
      <div className="image-grid">
        {images.map((img, i) => (
          <img 
            key={i}
            src={img.url || `data:${img.mimeType};base64,${img.base64Data}`}
            alt={`Generated ${i}`}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Error Handling

```typescript
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function handleAPIError(response: Response) {
  if (!response.ok) {
    const text = await response.text();
    let message = text;
    
    try {
      const json = JSON.parse(text);
      message = json.message || json.error || text;
    } catch {}
    
    throw new APIError(response.status, message);
  }
}

// Usage
try {
  const result = await client.chat({ prompt: 'Hello' });
} catch (e) {
  if (e instanceof APIError) {
    if (e.status === 401) showLogin();
    else if (e.status === 429) showRateLimitError();
    else showError(e.message);
  }
}
```

---

## Best Practices

1. **Use streaming for chat**: Better UX with real-time updates
2. **Handle errors gracefully**: Show user-friendly messages
3. **Display thinking process**: Builds trust and transparency
4. **Show citations**: Important for grounded responses
5. **Loading states**: Clear feedback during generation
6. **Cancel requests**: Allow users to stop long operations
7. **Retry logic**: Handle transient failures
8. **Token management**: Refresh tokens before expiry
# Image Generation Guide (API V2)

Complete image generation implementation for Vite + React + TypeScript.

## Endpoint

```
POST /api/v2/image/generate
```

## Request Format

```typescript
interface ImageRequest {
  prompt: string;                     // Required: Image description
  model?: string;                     // Default: 'imagen-4.0-generate-001'
  negativePrompt?: string;            // What to avoid
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  numberOfImages?: number;            // 1-8
  outputFormat?: 'png' | 'jpeg' | 'webp';
}
```

## Response Format

```typescript
interface ImageResponse {
  success: boolean;
  model: string;
  images: GeneratedImage[];
}

interface GeneratedImage {
  url: string;                        // Public URL
  gcsUri?: string;                    // GCS URI
  filename?: string;
  mimeType?: string;
}
```

---

## Complete Vite + TSX Implementation

### 1. Image API Service (`src/api/image.ts`)

```typescript
import apiClient from './client';

export interface ImageRequest {
  prompt: string;
  model?: string;
  negativePrompt?: string;
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  numberOfImages?: number;
  outputFormat?: 'png' | 'jpeg' | 'webp';
}

export interface GeneratedImage {
  url: string;
  gcsUri?: string;
  filename?: string;
  mimeType?: string;
}

export interface ImageResponse {
  success: boolean;
  model: string;
  images: GeneratedImage[];
}

export const imageApi = {
  /**
   * Generate images from text prompt
   */
  async generate(request: ImageRequest): Promise<ImageResponse> {
    return apiClient.post<ImageResponse>('/image/generate', request);
  },
};

export default imageApi;
```

### 2. useImageGeneration Hook (`src/hooks/useImageGeneration.ts`)

```typescript
import { useState, useCallback } from 'react';
import imageApi, { ImageRequest, ImageResponse, GeneratedImage } from '../api/image';

interface UseImageGenerationReturn {
  images: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
  progress: string;
  generate: (request: ImageRequest) => Promise<void>;
  clearImages: () => void;
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('');

  const generate = useCallback(async (request: ImageRequest) => {
    setIsLoading(true);
    setError(null);
    setProgress('Generating images...');

    try {
      const response = await imageApi.generate(request);

      if (response.success) {
        setImages(response.images);
        setProgress(`Generated ${response.images.length} image(s)`);
      } else {
        throw new Error('Image generation failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);
      setProgress('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    setError(null);
    setProgress('');
  }, []);

  return {
    images,
    isLoading,
    error,
    progress,
    generate,
    clearImages,
  };
}

export default useImageGeneration;
```

### 3. ImageGenerator Component (`src/components/Image/ImageGenerator.tsx`)

```tsx
import React, { useState } from 'react';
import { useImageGeneration } from '../../hooks/useImageGeneration';
import './ImageGenerator.css';

const ASPECT_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'] as const;
const MODELS = [
  { id: 'imagen-4.0-generate-001', name: 'Imagen 4.0' },
  { id: 'imagen-3.0-generate-001', name: 'Imagen 3.0' },
  { id: 'gemini-2.5-flash-image', name: 'Gemini Flash Image' },
];

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<typeof ASPECT_RATIOS[number]>('1:1');
  const [model, setModel] = useState(MODELS[0].id);
  const [numberOfImages, setNumberOfImages] = useState(1);

  const { images, isLoading, error, progress, generate, clearImages } = useImageGeneration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    await generate({
      prompt,
      negativePrompt: negativePrompt || undefined,
      aspectRatio,
      model,
      numberOfImages,
    });
  };

  return (
    <div className="image-generator">
      <h2>Image Generator</h2>

      <form onSubmit={handleSubmit} className="generator-form">
        {/* Prompt */}
        <div className="form-group">
          <label>Prompt *</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            rows={3}
            required
          />
        </div>

        {/* Negative Prompt */}
        <div className="form-group">
          <label>Negative Prompt</label>
          <textarea
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="What to avoid in the image..."
            rows={2}
          />
        </div>

        {/* Settings Row */}
        <div className="settings-row">
          {/* Model */}
          <div className="form-group">
            <label>Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Aspect Ratio */}
          <div className="form-group">
            <label>Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as typeof ASPECT_RATIOS[number])}
            >
              {ASPECT_RATIOS.map((ratio) => (
                <option key={ratio} value={ratio}>
                  {ratio}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Images */}
          <div className="form-group">
            <label>Images</label>
            <input
              type="number"
              min={1}
              max={8}
              value={numberOfImages}
              onChange={(e) => setNumberOfImages(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" disabled={isLoading || !prompt.trim()}>
          {isLoading ? 'Generating...' : 'Generate Images'}
        </button>
      </form>

      {/* Progress */}
      {progress && <div className="progress">{progress}</div>}

      {/* Error */}
      {error && <div className="error">{error}</div>}

      {/* Generated Images */}
      {images.length > 0 && (
        <div className="images-container">
          <div className="images-header">
            <h3>Generated Images</h3>
            <button onClick={clearImages} className="clear-btn">
              Clear
            </button>
          </div>
          <div className="images-grid">
            {images.map((img, i) => (
              <div key={i} className="image-card">
                <img src={img.url} alt={`Generated ${i + 1}`} />
                <a href={img.url} download={img.filename} className="download-btn">
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
```

### 4. CSS Styles (`src/components/Image/ImageGenerator.css`)

```css
.image-generator {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.generator-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  font-size: 0.875rem;
}

.form-group textarea,
.form-group select,
.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.settings-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.generator-form button {
  padding: 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.generator-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.images-container {
  margin-top: 2rem;
}

.images-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.image-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-card img {
  width: 100%;
  height: auto;
  display: block;
}

.image-card .download-btn {
  display: block;
  text-align: center;
  padding: 0.75rem;
  background: #f8f9fa;
  text-decoration: none;
  color: #333;
}

.error {
  color: #dc3545;
  padding: 1rem;
  background: #f8d7da;
  border-radius: 8px;
}

.progress {
  color: #0c5460;
  padding: 1rem;
  background: #d1ecf1;
  border-radius: 8px;
}
```

---

## Models

| Model | Description |
|-------|-------------|
| `imagen-4.0-generate-001` | Latest Imagen, best quality |
| `imagen-4.0-fast-generate-001` | Faster generation |
| `imagen-3.0-generate-001` | Stable, production-ready |
| `gemini-2.5-flash-image` | Gemini native image gen |

---

## Example Requests

### Basic Generation
```typescript
await imageApi.generate({
  prompt: 'A serene mountain landscape at sunset with snow-capped peaks',
});
```

### With All Options
```typescript
await imageApi.generate({
  prompt: 'A futuristic city with flying cars and neon lights',
  negativePrompt: 'blurry, low quality, text, watermark',
  model: 'imagen-4.0-generate-001',
  aspectRatio: '16:9',
  numberOfImages: 4,
  outputFormat: 'png',
});
```
# Music Generation Guide (API V2)

Complete music generation implementation for Vite + React + TypeScript using Lyria RealTime.

## Endpoint

```
POST /api/v2/music/generate
GET /api/v2/music/status
```

## Request Format

```typescript
interface WeightedPrompt {
  text: string;                       // Music description
  weight?: number;                    // Importance (0-1, default 1.0)
}

interface MusicRequest {
  prompts: WeightedPrompt[];          // Required: Music descriptions
  durationSeconds?: number;           // 5-120, default 30
  bpm?: number;                       // Tempo
  temperature?: number;               // Creativity (0-1)
  scale?: 'MAJOR' | 'MINOR' | 'CHROMATIC';
  density?: 'LOW' | 'MEDIUM' | 'HIGH';
  brightness?: 'LOW' | 'MEDIUM' | 'HIGH';
}
```

## Response Format

```typescript
interface MusicResponse {
  success: boolean;
  url: string;                        // Public audio URL
  gcsUri?: string;
  filename?: string;
  model: string;
  durationSeconds: number;
  sampleRate: number;
  mimeType: string;
}
```

---

## Complete Vite + TSX Implementation

### 1. Music API Service (`src/api/music.ts`)

```typescript
import apiClient from './client';

export interface WeightedPrompt {
  text: string;
  weight?: number;
}

export interface MusicRequest {
  prompts: WeightedPrompt[];
  durationSeconds?: number;
  bpm?: number;
  temperature?: number;
  scale?: 'MAJOR' | 'MINOR' | 'CHROMATIC';
  density?: 'LOW' | 'MEDIUM' | 'HIGH';
  brightness?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface MusicResponse {
  success: boolean;
  url: string;
  gcsUri?: string;
  filename?: string;
  model: string;
  durationSeconds: number;
  sampleRate: number;
  mimeType: string;
}

export const musicApi = {
  /**
   * Generate music from prompts
   */
  async generate(request: MusicRequest): Promise<MusicResponse> {
    return apiClient.post<MusicResponse>('/music/generate', request);
  },

  /**
   * Get service status
   */
  async getStatus(): Promise<{
    available: boolean;
    model: string;
    features: {
      maxDuration: string;
      sampleRate: string;
      format: string;
    };
  }> {
    return apiClient.get('/music/status');
  },
};

export default musicApi;
```

### 2. useMusicGeneration Hook (`src/hooks/useMusicGeneration.ts`)

```typescript
import { useState, useCallback } from 'react';
import musicApi, { MusicRequest, MusicResponse } from '../api/music';

interface UseMusicGenerationReturn {
  music: MusicResponse | null;
  isLoading: boolean;
  error: string | null;
  progress: string;
  generate: (request: MusicRequest) => Promise<void>;
  clearMusic: () => void;
}

export function useMusicGeneration(): UseMusicGenerationReturn {
  const [music, setMusic] = useState<MusicResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('');

  const generate = useCallback(async (request: MusicRequest) => {
    setIsLoading(true);
    setError(null);
    setProgress('Generating music... This may take 30-60 seconds.');

    try {
      const response = await musicApi.generate(request);

      if (response.success) {
        setMusic(response);
        setProgress('Music generated successfully!');
      } else {
        throw new Error('Music generation failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);
      setProgress('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMusic = useCallback(() => {
    setMusic(null);
    setError(null);
    setProgress('');
  }, []);

  return {
    music,
    isLoading,
    error,
    progress,
    generate,
    clearMusic,
  };
}

export default useMusicGeneration;
```

### 3. MusicGenerator Component (`src/components/Music/MusicGenerator.tsx`)

```tsx
import React, { useState } from 'react';
import { useMusicGeneration } from '../../hooks/useMusicGeneration';
import type { WeightedPrompt } from '../../api/music';
import './MusicGenerator.css';

const SCALES = ['MAJOR', 'MINOR', 'CHROMATIC'] as const;
const DENSITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
const BRIGHTNESSES = ['LOW', 'MEDIUM', 'HIGH'] as const;

export const MusicGenerator: React.FC = () => {
  // Primary prompt
  const [primaryPrompt, setPrimaryPrompt] = useState('');
  const [primaryWeight, setPrimaryWeight] = useState(1.0);
  
  // Secondary prompt (optional)
  const [secondaryPrompt, setSecondaryPrompt] = useState('');
  const [secondaryWeight, setSecondaryWeight] = useState(0.5);
  
  // Settings
  const [duration, setDuration] = useState(30);
  const [bpm, setBpm] = useState(120);
  const [temperature, setTemperature] = useState(0.7);
  const [scale, setScale] = useState<typeof SCALES[number]>('MAJOR');
  const [density, setDensity] = useState<typeof DENSITIES[number]>('MEDIUM');
  const [brightness, setBrightness] = useState<typeof BRIGHTNESSES[number]>('MEDIUM');

  const { music, isLoading, error, progress, generate, clearMusic } =
    useMusicGeneration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryPrompt.trim() || isLoading) return;

    const prompts: WeightedPrompt[] = [
      { text: primaryPrompt, weight: primaryWeight },
    ];

    if (secondaryPrompt.trim()) {
      prompts.push({ text: secondaryPrompt, weight: secondaryWeight });
    }

    await generate({
      prompts,
      durationSeconds: duration,
      bpm,
      temperature,
      scale,
      density,
      brightness,
    });
  };

  return (
    <div className="music-generator">
      <h2>Music Generator</h2>

      <form onSubmit={handleSubmit} className="generator-form">
        {/* Primary Prompt */}
        <div className="prompt-group">
          <div className="form-group flex-1">
            <label>Primary Music Description *</label>
            <textarea
              value={primaryPrompt}
              onChange={(e) => setPrimaryPrompt(e.target.value)}
              placeholder="e.g., Upbeat electronic dance music with heavy bass"
              rows={2}
              required
            />
          </div>
          <div className="form-group weight-input">
            <label>Weight</label>
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={primaryWeight}
              onChange={(e) => setPrimaryWeight(parseFloat(e.target.value) || 1)}
            />
          </div>
        </div>

        {/* Secondary Prompt */}
        <div className="prompt-group">
          <div className="form-group flex-1">
            <label>Secondary Description (optional)</label>
            <textarea
              value={secondaryPrompt}
              onChange={(e) => setSecondaryPrompt(e.target.value)}
              placeholder="e.g., Add soft piano melodies"
              rows={2}
            />
          </div>
          <div className="form-group weight-input">
            <label>Weight</label>
            <input
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={secondaryWeight}
              onChange={(e) => setSecondaryWeight(parseFloat(e.target.value) || 0.5)}
            />
          </div>
        </div>

        {/* Settings Grid */}
        <div className="settings-grid">
          <div className="form-group">
            <label>Duration (seconds)</label>
            <input
              type="number"
              min={5}
              max={120}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
            />
          </div>

          <div className="form-group">
            <label>BPM</label>
            <input
              type="number"
              min={60}
              max={200}
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value) || 120)}
            />
          </div>

          <div className="form-group">
            <label>Creativity</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
            />
            <span>{temperature}</span>
          </div>

          <div className="form-group">
            <label>Scale</label>
            <select value={scale} onChange={(e) => setScale(e.target.value as typeof scale)}>
              {SCALES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Density</label>
            <select value={density} onChange={(e) => setDensity(e.target.value as typeof density)}>
              {DENSITIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Brightness</label>
            <select value={brightness} onChange={(e) => setBrightness(e.target.value as typeof brightness)}>
              {BRIGHTNESSES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" disabled={isLoading || !primaryPrompt.trim()}>
          {isLoading ? 'Generating...' : 'Generate Music'}
        </button>
      </form>

      {/* Progress */}
      {progress && <div className="progress">{progress}</div>}

      {/* Error */}
      {error && <div className="error">{error}</div>}

      {/* Generated Music */}
      {music && (
        <div className="music-result">
          <div className="music-header">
            <h3>Generated Music</h3>
            <button onClick={clearMusic} className="clear-btn">
              Clear
            </button>
          </div>
          <audio controls className="audio-player">
            <source src={music.url} type={music.mimeType} />
          </audio>
          <div className="music-info">
            <p><strong>Model:</strong> {music.model}</p>
            <p><strong>Duration:</strong> {music.durationSeconds}s</p>
            <p><strong>Sample Rate:</strong> {music.sampleRate}Hz</p>
          </div>
          <a href={music.url} download={music.filename} className="download-btn">
            Download Audio
          </a>
        </div>
      )}
    </div>
  );
};

export default MusicGenerator;
```

### 4. CSS (`src/components/Music/MusicGenerator.css`)

```css
.music-generator {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.prompt-group {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.prompt-group .flex-1 {
  flex: 1;
}

.prompt-group .weight-input {
  width: 80px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1rem 0;
}

.form-group input[type="range"] {
  width: 100%;
}

.audio-player {
  width: 100%;
  margin: 1rem 0;
}

.music-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  padding: 1rem;
  background: #f8f9fa;
}
```

---

## Model

| Model | Duration | Sample Rate | Format |
|-------|----------|-------------|--------|
| `lyria-realtime-exp` | 5-120s | 48kHz | WAV |

---

## Example Requests

### Simple Music
```typescript
await musicApi.generate({
  prompts: [{ text: 'Calm ambient piano music' }],
  durationSeconds: 30,
});
```

### Complex with Weighted Prompts
```typescript
await musicApi.generate({
  prompts: [
    { text: 'Epic orchestral soundtrack', weight: 1.0 },
    { text: 'Electronic synth elements', weight: 0.3 },
  ],
  durationSeconds: 60,
  bpm: 100,
  scale: 'MINOR',
  density: 'HIGH',
  brightness: 'MEDIUM',
});
```
# Thinking Mode Guide (API V2)

Complete thinking mode implementation for Vite + React + TypeScript.

## Overview

Thinking Mode enables Gemini models to "think through" complex problems before responding. Available in Gemini 2.5+ and Gemini 3 models.

## Supported Models

| Model | Config Type | Range | Default |
|-------|-------------|-------|---------|
| `gemini-2.5-flash` | thinkingBudget | 0-24576 | 0 (off) |
| `gemini-2.5-pro` | thinkingBudget | 128-32768 | 0 (off) |
| `gemini-2.5-flash-lite` | thinkingBudget | 0-8192 | 0 (off) |
| `gemini-3-pro-preview` | thinkingLevel | 'low' \| 'high' | 'low' |

## Request Format

```typescript
interface ThinkingConfig {
  // For Gemini 2.5 models (budget-based)
  thinkingBudget?: number;            // Token budget for thinking
                                      // -1 = dynamic (model decides)
  
  // For Gemini 3 models (level-based)
  thinkingLevel?: 'low' | 'high';
  
  // Common
  includeThoughts?: boolean;          // Return thoughts in response
}

interface ChatRequest {
  prompt?: string;
  messages?: ChatMessage[];
  model: string;
  thinkingConfig?: ThinkingConfig;
  // ... other fields
}
```

## Response with Thoughts

```typescript
interface ChatResponse {
  message: ChatMessage;
  thoughts?: string[];                // Thinking process
  usageMetadata?: UsageMetadata;
}

interface UsageMetadata {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
  thoughtsTokenCount?: number;        // Tokens used for thinking
}
```

---

## Complete Vite + TSX Implementation

### 1. Types (`src/types/thinking.types.ts`)

```typescript
export type ThinkingLevel = 'low' | 'high';

export interface ThinkingConfig {
  thinkingBudget?: number;
  thinkingLevel?: ThinkingLevel;
  includeThoughts?: boolean;
}

export interface ThinkingPreset {
  id: string;
  name: string;
  description: string;
  config: ThinkingConfig;
  models: string[];
}

// Recommended presets
export const THINKING_PRESETS: ThinkingPreset[] = [
  {
    id: 'off',
    name: 'Off',
    description: 'No thinking mode',
    config: {},
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Quick reasoning (512 tokens)',
    config: { thinkingBudget: 512, includeThoughts: true },
    models: ['gemini-2.5-flash', 'gemini-2.5-pro'],
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'Standard reasoning (2048 tokens)',
    config: { thinkingBudget: 2048, includeThoughts: true },
    models: ['gemini-2.5-flash', 'gemini-2.5-pro'],
  },
  {
    id: 'deep',
    name: 'Deep',
    description: 'Complex reasoning (8192 tokens)',
    config: { thinkingBudget: 8192, includeThoughts: true },
    models: ['gemini-2.5-flash', 'gemini-2.5-pro'],
  },
  {
    id: 'maximum',
    name: 'Maximum',
    description: 'Extensive reasoning (24576 tokens)',
    config: { thinkingBudget: 24576, includeThoughts: true },
    models: ['gemini-2.5-flash'],
  },
  {
    id: 'dynamic',
    name: 'Dynamic',
    description: 'Model decides budget (-1)',
    config: { thinkingBudget: -1, includeThoughts: true },
    models: ['gemini-2.5-flash', 'gemini-2.5-pro'],
  },
  {
    id: 'gemini3-low',
    name: 'Gemini 3 Low',
    description: 'Low thinking level',
    config: { thinkingLevel: 'low', includeThoughts: true },
    models: ['gemini-3-pro-preview'],
  },
  {
    id: 'gemini3-high',
    name: 'Gemini 3 High',
    description: 'High thinking level',
    config: { thinkingLevel: 'high', includeThoughts: true },
    models: ['gemini-3-pro-preview'],
  },
];

export function getPresetsForModel(model: string): ThinkingPreset[] {
  return THINKING_PRESETS.filter((preset) => preset.models.includes(model));
}

export function getDefaultPresetForModel(model: string): ThinkingPreset {
  const presets = getPresetsForModel(model);
  return presets.find((p) => p.id === 'medium') || presets[0];
}
```

### 2. ThinkingSelector Component (`src/components/Chat/ThinkingSelector.tsx`)

```tsx
import React from 'react';
import type { ThinkingConfig, ThinkingPreset } from '../../types/thinking.types';
import { getPresetsForModel, THINKING_PRESETS } from '../../types/thinking.types';
import './ThinkingSelector.css';

interface ThinkingSelectorProps {
  model: string;
  value: ThinkingConfig | undefined;
  onChange: (config: ThinkingConfig | undefined) => void;
  showCustom?: boolean;
}

export const ThinkingSelector: React.FC<ThinkingSelectorProps> = ({
  model,
  value,
  onChange,
  showCustom = false,
}) => {
  const presets = getPresetsForModel(model);
  const [isCustom, setIsCustom] = React.useState(false);
  const [customBudget, setCustomBudget] = React.useState(1024);

  const handlePresetChange = (presetId: string) => {
    if (presetId === 'custom') {
      setIsCustom(true);
      onChange({ thinkingBudget: customBudget, includeThoughts: true });
      return;
    }

    setIsCustom(false);
    const preset = THINKING_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      onChange(preset.config.thinkingBudget !== undefined || preset.config.thinkingLevel !== undefined
        ? preset.config
        : undefined);
    }
  };

  const handleCustomBudgetChange = (budget: number) => {
    setCustomBudget(budget);
    onChange({ thinkingBudget: budget, includeThoughts: true });
  };

  // Determine current preset
  const currentPresetId = isCustom
    ? 'custom'
    : presets.find(
        (p) =>
          (p.config.thinkingBudget === value?.thinkingBudget &&
           p.config.thinkingLevel === value?.thinkingLevel) ||
          (!value && p.id === 'off')
      )?.id || 'off';

  // Get max budget for model
  const maxBudget = model.includes('pro') ? 32768 : 24576;

  return (
    <div className="thinking-selector">
      <label>Thinking Mode</label>
      
      {/* Preset Buttons */}
      <div className="preset-buttons">
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            className={`preset-btn ${currentPresetId === preset.id ? 'active' : ''}`}
            onClick={() => handlePresetChange(preset.id)}
            title={preset.description}
          >
            {preset.name}
          </button>
        ))}
        {showCustom && (
          <button
            type="button"
            className={`preset-btn ${currentPresetId === 'custom' ? 'active' : ''}`}
            onClick={() => handlePresetChange('custom')}
          >
            Custom
          </button>
        )}
      </div>

      {/* Custom Budget Slider */}
      {isCustom && (
        <div className="custom-budget">
          <label>
            Budget: {customBudget} tokens
          </label>
          <input
            type="range"
            min={0}
            max={maxBudget}
            step={256}
            value={customBudget}
            onChange={(e) => handleCustomBudgetChange(parseInt(e.target.value))}
          />
          <div className="budget-markers">
            <span>0</span>
            <span>{maxBudget / 2}</span>
            <span>{maxBudget}</span>
          </div>
        </div>
      )}

      {/* Current Config Display */}
      {value && (
        <div className="current-config">
          {value.thinkingBudget !== undefined && (
            <span className="config-badge">
              Budget: {value.thinkingBudget === -1 ? 'Dynamic' : value.thinkingBudget}
            </span>
          )}
          {value.thinkingLevel && (
            <span className="config-badge">
              Level: {value.thinkingLevel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ThinkingSelector;
```

### 3. CSS (`src/components/Chat/ThinkingSelector.css`)

```css
.thinking-selector {
  margin: 1rem 0;
}

.thinking-selector > label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.preset-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.preset-btn:hover {
  border-color: #007bff;
}

.preset-btn.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.custom-budget {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.custom-budget input[type="range"] {
  width: 100%;
  margin: 0.5rem 0;
}

.budget-markers {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #666;
}

.current-config {
  margin-top: 0.5rem;
}

.config-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background: #e9ecef;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-right: 0.5rem;
}
```

### 4. ThoughtDisplay Component (`src/components/Chat/ThoughtDisplay.tsx`)

```tsx
import React, { useState } from 'react';
import './ThoughtDisplay.css';

interface ThoughtDisplayProps {
  thoughts: string[];
  isStreaming?: boolean;
  currentThought?: string;
}

export const ThoughtDisplay: React.FC<ThoughtDisplayProps> = ({
  thoughts,
  isStreaming = false,
  currentThought = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const allThoughts = currentThought
    ? [...thoughts, currentThought]
    : thoughts;

  if (allThoughts.length === 0) {
    return null;
  }

  return (
    <div className={`thought-display ${isStreaming ? 'streaming' : ''}`}>
      <div
        className="thought-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="thought-icon">🧠</span>
        <span className="thought-title">
          {isStreaming ? 'Thinking...' : 'Thought Process'}
        </span>
        <span className="thought-toggle">
          {isExpanded ? '▼' : '▶'}
        </span>
      </div>

      {isExpanded && (
        <div className="thought-content">
          {allThoughts.map((thought, index) => (
            <div key={index} className="thought-item">
              <span className="thought-number">{index + 1}.</span>
              <span className="thought-text">{thought}</span>
            </div>
          ))}
          {isStreaming && (
            <div className="thought-cursor">▌</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThoughtDisplay;
```

---

## Usage in Chat

```tsx
import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { ThinkingSelector } from './ThinkingSelector';
import { ThoughtDisplay } from './ThoughtDisplay';
import type { ThinkingConfig } from '../types/thinking.types';

function ChatWithThinking() {
  const [model, setModel] = useState('gemini-2.5-flash');
  const [thinkingConfig, setThinkingConfig] = useState<ThinkingConfig | undefined>();

  const {
    messages,
    isStreaming,
    currentThought,
    sendMessageStream,
  } = useChat({
    model,
    thinkingConfig,
    onThought: (thought) => {
      console.log('Received thought:', thought);
    },
  });

  return (
    <div>
      {/* Model Selector */}
      <select value={model} onChange={(e) => setModel(e.target.value)}>
        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
        <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
        <option value="gemini-3-pro-preview">Gemini 3 Pro Preview</option>
      </select>

      {/* Thinking Selector */}
      <ThinkingSelector
        model={model}
        value={thinkingConfig}
        onChange={setThinkingConfig}
        showCustom
      />

      {/* Messages with Thoughts */}
      {messages.map((msg, i) => (
        <div key={i}>
          {msg.role === 'model' && msg.thoughts && (
            <ThoughtDisplay thoughts={msg.thoughts} />
          )}
          <div className="message">{msg.content}</div>
        </div>
      ))}

      {/* Streaming Thoughts */}
      {isStreaming && currentThought && (
        <ThoughtDisplay
          thoughts={[]}
          isStreaming
          currentThought={currentThought}
        />
      )}
    </div>
  );
}
```

---

## Budget Guidelines

| Task Type | Recommended Budget |
|-----------|-------------------|
| Simple Q&A | 0 (off) |
| Basic math | 512-1024 |
| Multi-step problems | 1024-2048 |
| Code analysis | 2048-4096 |
| Complex reasoning | 4096-8192 |
| Research tasks | 8192+ |
| Let model decide | -1 (dynamic) |
# Tools & Function Calling Guide (API V2)

Complete tools implementation for Vite + React + TypeScript including Google Search, Function Calling, and Code Execution.

## Available Tools

| Tool | Description | Use Case |
|------|-------------|----------|
| Google Search | Web search grounding | Real-time info, news |
| Code Execution | Run Python code | Calculations, data processing |
| Function Calling | Custom functions | API integrations, actions |

## Request Format

```typescript
interface Tool {
  // Google Search
  googleSearch?: {
    enabled: boolean;
  };
  
  // Code Execution
  codeExecution?: Record<string, never>;  // Empty object to enable
  
  // Custom Function
  functionDeclarations?: FunctionDeclaration[];
}

interface FunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: 'string' | 'number' | 'boolean' | 'array' | 'object';
      description: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

interface ChatRequest {
  prompt?: string;
  messages?: ChatMessage[];
  model: string;
  tools?: Tool[];
  // ... other fields
}
```

## Response with Tools

```typescript
interface ChatResponse {
  message: ChatMessage;
  // Google Search results
  groundingMetadata?: GroundingMetadata;
  // Function calls to execute
  functionCalls?: FunctionCall[];
  // Code execution result
  codeExecutionResult?: CodeResult;
}

interface GroundingMetadata {
  webSearchQueries?: string[];
  groundingChunks?: Array<{
    web?: { uri: string; title: string };
  }>;
  searchEntryPoint?: { renderedContent: string };
}

interface FunctionCall {
  name: string;
  args: Record<string, unknown>;
}

interface CodeResult {
  outcome: 'OUTCOME_OK' | 'OUTCOME_FAILED';
  output?: string;
}
```

---

## Complete Vite + TSX Implementation

### 1. Tools Types (`src/types/tools.types.ts`)

```typescript
export interface GoogleSearchConfig {
  enabled: boolean;
}

export interface FunctionParameter {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: string[];
  items?: FunctionParameter;
  properties?: Record<string, FunctionParameter>;
}

export interface FunctionDeclaration {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, FunctionParameter>;
    required?: string[];
  };
}

export interface Tool {
  googleSearch?: GoogleSearchConfig;
  codeExecution?: Record<string, never>;
  functionDeclarations?: FunctionDeclaration[];
}

export interface FunctionCall {
  name: string;
  args: Record<string, unknown>;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface GroundingMetadata {
  webSearchQueries?: string[];
  groundingChunks?: GroundingChunk[];
  searchEntryPoint?: {
    renderedContent: string;
  };
  groundingSupports?: Array<{
    segment: { startIndex: number; endIndex: number };
    groundingChunkIndices: number[];
    confidenceScores: number[];
  }>;
}

export interface CodeExecutionResult {
  outcome: 'OUTCOME_OK' | 'OUTCOME_FAILED';
  output?: string;
}

// Pre-built function declarations
export const BUILT_IN_FUNCTIONS: FunctionDeclaration[] = [
  {
    name: 'get_weather',
    description: 'Get the current weather for a location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City name, e.g., "Jakarta" or "New York"',
        },
        unit: {
          type: 'string',
          description: 'Temperature unit',
          enum: ['celsius', 'fahrenheit'],
        },
      },
      required: ['location'],
    },
  },
  {
    name: 'search_products',
    description: 'Search for products in the catalog',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        category: {
          type: 'string',
          description: 'Product category',
          enum: ['electronics', 'clothing', 'books', 'home'],
        },
        maxPrice: {
          type: 'number',
          description: 'Maximum price filter',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'create_reminder',
    description: 'Create a reminder for the user',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Reminder title',
        },
        date: {
          type: 'string',
          description: 'Reminder date in ISO format',
        },
        priority: {
          type: 'string',
          description: 'Priority level',
          enum: ['low', 'medium', 'high'],
        },
      },
      required: ['title', 'date'],
    },
  },
];
```

### 2. ToolsSelector Component (`src/components/Chat/ToolsSelector.tsx`)

```tsx
import React from 'react';
import type { Tool, FunctionDeclaration } from '../../types/tools.types';
import { BUILT_IN_FUNCTIONS } from '../../types/tools.types';
import './ToolsSelector.css';

interface ToolsSelectorProps {
  value: Tool[];
  onChange: (tools: Tool[]) => void;
}

export const ToolsSelector: React.FC<ToolsSelectorProps> = ({
  value,
  onChange,
}) => {
  // Check which tools are enabled
  const isGoogleSearchEnabled = value.some((t) => t.googleSearch?.enabled);
  const isCodeExecutionEnabled = value.some((t) => t.codeExecution);
  const enabledFunctions = value.flatMap((t) => t.functionDeclarations || []);

  const toggleGoogleSearch = () => {
    if (isGoogleSearchEnabled) {
      onChange(value.filter((t) => !t.googleSearch));
    } else {
      onChange([...value, { googleSearch: { enabled: true } }]);
    }
  };

  const toggleCodeExecution = () => {
    if (isCodeExecutionEnabled) {
      onChange(value.filter((t) => !t.codeExecution));
    } else {
      onChange([...value, { codeExecution: {} }]);
    }
  };

  const toggleFunction = (func: FunctionDeclaration) => {
    const isEnabled = enabledFunctions.some((f) => f.name === func.name);
    
    if (isEnabled) {
      // Remove this function
      const newTools = value.map((t) => {
        if (t.functionDeclarations) {
          return {
            ...t,
            functionDeclarations: t.functionDeclarations.filter(
              (f) => f.name !== func.name
            ),
          };
        }
        return t;
      }).filter((t) => !t.functionDeclarations || t.functionDeclarations.length > 0);
      onChange(newTools);
    } else {
      // Add this function
      const existingFuncTool = value.find((t) => t.functionDeclarations);
      if (existingFuncTool) {
        onChange(
          value.map((t) =>
            t === existingFuncTool
              ? {
                  ...t,
                  functionDeclarations: [...(t.functionDeclarations || []), func],
                }
              : t
          )
        );
      } else {
        onChange([...value, { functionDeclarations: [func] }]);
      }
    }
  };

  return (
    <div className="tools-selector">
      <label>Tools</label>

      <div className="tools-grid">
        {/* Google Search */}
        <div
          className={`tool-card ${isGoogleSearchEnabled ? 'active' : ''}`}
          onClick={toggleGoogleSearch}
        >
          <div className="tool-icon">🔍</div>
          <div className="tool-name">Google Search</div>
          <div className="tool-desc">Real-time web search</div>
        </div>

        {/* Code Execution */}
        <div
          className={`tool-card ${isCodeExecutionEnabled ? 'active' : ''}`}
          onClick={toggleCodeExecution}
        >
          <div className="tool-icon">💻</div>
          <div className="tool-name">Code Execution</div>
          <div className="tool-desc">Run Python code</div>
        </div>
      </div>

      {/* Function Declarations */}
      <div className="functions-section">
        <label>Functions</label>
        <div className="functions-list">
          {BUILT_IN_FUNCTIONS.map((func) => {
            const isEnabled = enabledFunctions.some((f) => f.name === func.name);
            return (
              <div
                key={func.name}
                className={`function-item ${isEnabled ? 'active' : ''}`}
                onClick={() => toggleFunction(func)}
              >
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => {}}
                />
                <div className="function-info">
                  <div className="function-name">{func.name}</div>
                  <div className="function-desc">{func.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ToolsSelector;
```

### 3. GroundingDisplay Component (`src/components/Chat/GroundingDisplay.tsx`)

```tsx
import React from 'react';
import type { GroundingMetadata } from '../../types/tools.types';
import './GroundingDisplay.css';

interface GroundingDisplayProps {
  metadata: GroundingMetadata;
}

export const GroundingDisplay: React.FC<GroundingDisplayProps> = ({
  metadata,
}) => {
  if (!metadata.groundingChunks?.length && !metadata.webSearchQueries?.length) {
    return null;
  }

  return (
    <div className="grounding-display">
      <div className="grounding-header">
        <span className="grounding-icon">🔗</span>
        <span className="grounding-title">Sources</span>
      </div>

      {/* Search Queries */}
      {metadata.webSearchQueries && metadata.webSearchQueries.length > 0 && (
        <div className="search-queries">
          <span className="label">Searched:</span>
          {metadata.webSearchQueries.map((query, i) => (
            <span key={i} className="query-badge">
              {query}
            </span>
          ))}
        </div>
      )}

      {/* Source Links */}
      {metadata.groundingChunks && metadata.groundingChunks.length > 0 && (
        <div className="source-links">
          {metadata.groundingChunks.map((chunk, i) => (
            chunk.web && (
              <a
                key={i}
                href={chunk.web.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                <span className="source-number">{i + 1}</span>
                <span className="source-title">{chunk.web.title}</span>
              </a>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default GroundingDisplay;
```

### 4. FunctionCallDisplay Component (`src/components/Chat/FunctionCallDisplay.tsx`)

```tsx
import React, { useState } from 'react';
import type { FunctionCall } from '../../types/tools.types';
import './FunctionCallDisplay.css';

interface FunctionCallDisplayProps {
  functionCall: FunctionCall;
  onExecute?: (result: unknown) => void;
}

export const FunctionCallDisplay: React.FC<FunctionCallDisplayProps> = ({
  functionCall,
  onExecute,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<unknown>(null);

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      // Simulate function execution
      // In real app, call your actual function implementations
      const mockResult = await executeMockFunction(functionCall);
      setResult(mockResult);
      onExecute?.(mockResult);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="function-call-display">
      <div className="function-call-header">
        <span className="function-icon">⚡</span>
        <span className="function-name">{functionCall.name}</span>
      </div>

      <div className="function-args">
        <pre>{JSON.stringify(functionCall.args, null, 2)}</pre>
      </div>

      {!result && (
        <button
          className="execute-btn"
          onClick={handleExecute}
          disabled={isExecuting}
        >
          {isExecuting ? 'Executing...' : 'Execute Function'}
        </button>
      )}

      {result && (
        <div className="function-result">
          <label>Result:</label>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

// Mock function executor
async function executeMockFunction(call: FunctionCall): Promise<unknown> {
  await new Promise((r) => setTimeout(r, 500)); // Simulate delay

  switch (call.name) {
    case 'get_weather':
      return {
        location: call.args.location,
        temperature: Math.floor(Math.random() * 20) + 20,
        condition: 'Partly cloudy',
        humidity: Math.floor(Math.random() * 30) + 60,
      };
    case 'search_products':
      return {
        results: [
          { id: 1, name: 'Product A', price: 99.99 },
          { id: 2, name: 'Product B', price: 149.99 },
        ],
        total: 2,
      };
    case 'create_reminder':
      return {
        id: Date.now(),
        title: call.args.title,
        date: call.args.date,
        created: true,
      };
    default:
      return { executed: true, args: call.args };
  }
}

export default FunctionCallDisplay;
```

### 5. CodeExecutionDisplay Component (`src/components/Chat/CodeExecutionDisplay.tsx`)

```tsx
import React from 'react';
import type { CodeExecutionResult } from '../../types/tools.types';
import './CodeExecutionDisplay.css';

interface CodeExecutionDisplayProps {
  result: CodeExecutionResult;
}

export const CodeExecutionDisplay: React.FC<CodeExecutionDisplayProps> = ({
  result,
}) => {
  const isSuccess = result.outcome === 'OUTCOME_OK';

  return (
    <div className={`code-execution-display ${isSuccess ? 'success' : 'error'}`}>
      <div className="code-header">
        <span className="code-icon">{isSuccess ? '✅' : '❌'}</span>
        <span className="code-title">Code Execution</span>
        <span className={`status-badge ${isSuccess ? 'success' : 'error'}`}>
          {isSuccess ? 'Success' : 'Failed'}
        </span>
      </div>

      {result.output && (
        <div className="code-output">
          <label>Output:</label>
          <pre>{result.output}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeExecutionDisplay;
```

### 6. CSS Files

**ToolsSelector.css:**
```css
.tools-selector {
  margin: 1rem 0;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.tool-card {
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
}

.tool-card:hover {
  border-color: #007bff;
}

.tool-card.active {
  border-color: #007bff;
  background: #e7f1ff;
}

.tool-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.tool-name {
  font-weight: 600;
}

.tool-desc {
  font-size: 0.75rem;
  color: #666;
}

.functions-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.function-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
}

.function-item.active {
  border-color: #007bff;
  background: #f0f7ff;
}

.function-name {
  font-weight: 600;
  font-family: monospace;
}

.function-desc {
  font-size: 0.875rem;
  color: #666;
}
```

---

## Usage Examples

### Google Search
```typescript
const request: ChatRequest = {
  prompt: "What are the latest news about AI today?",
  model: 'gemini-2.5-flash',
  tools: [
    { googleSearch: { enabled: true } }
  ],
};
```

### Code Execution
```typescript
const request: ChatRequest = {
  prompt: "Calculate the first 20 prime numbers using Python",
  model: 'gemini-2.5-flash',
  tools: [
    { codeExecution: {} }
  ],
};
```

### Function Calling
```typescript
const request: ChatRequest = {
  prompt: "What's the weather in Jakarta?",
  model: 'gemini-2.5-flash',
  tools: [
    {
      functionDeclarations: [{
        name: 'get_weather',
        description: 'Get weather for a location',
        parameters: {
          type: 'object',
          properties: {
            location: { type: 'string', description: 'City name' },
          },
          required: ['location'],
        },
      }],
    }
  ],
};
```
# TTS (Text-to-Speech) Guide (API V2)

Complete TTS implementation for Vite + React + TypeScript using Gemini TTS.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v2/tts/single` | Single speaker synthesis |
| POST | `/api/v2/tts/multi` | Multi-speaker dialogue |
| GET | `/api/v2/tts/voices` | List available voices |
| GET | `/api/v2/tts/status` | Service status |

## Request Formats

### Single Speaker

```typescript
interface SingleTtsRequest {
  text: string;                       // Required: Text to synthesize
  voiceName?: string;                 // Default: 'Kore'
  model?: string;                     // Default: 'gemini-2.5-flash-preview-tts'
}
```

### Multi-Speaker Dialogue

```typescript
interface SpeakerConfig {
  speakerName: string;                // Speaker identifier in text
  voiceName: string;                  // Voice to use
}

interface MultiTtsRequest {
  text: string;                       // Text with speaker lines
  speakerConfigs: SpeakerConfig[];    // Voice assignments
  model?: string;
}
```

## Response Format

```typescript
interface TtsResponse {
  success: boolean;
  url: string;                        // Public audio URL
  gcsUri?: string;
  filename?: string;
  mimeType: string;                   // 'audio/wav'
  voiceName?: string;
  speakerCount?: number;
}
```

## Available Voices (30 voices)

```
Aoede, Charon, Fenrir, Kore, Puck, Zephyr, Harmony, Aurora, 
Ember, River, Sage, Creek, Meadow, Willow, Cloud, Fern,
Brook, Finch, Moon, Star, Ocean, Sandy, Dusty, Sparrow,
Ridge, Coral, Haven, Ivy, Aspen, Jasper
```

---

## Complete Vite + TSX Implementation

### 1. TTS API Service (`src/api/tts.ts`)

```typescript
import apiClient from './client';

export interface SingleTtsRequest {
  text: string;
  voiceName?: string;
  model?: string;
}

export interface SpeakerConfig {
  speakerName: string;
  voiceName: string;
}

export interface MultiTtsRequest {
  text: string;
  speakerConfigs: SpeakerConfig[];
  model?: string;
}

export interface TtsResponse {
  success: boolean;
  url: string;
  gcsUri?: string;
  filename?: string;
  mimeType: string;
  voiceName?: string;
  speakerCount?: number;
}

export interface VoiceInfo {
  name: string;
  description?: string;
}

export const ttsApi = {
  /**
   * Get available voices
   */
  async getVoices(): Promise<VoiceInfo[]> {
    const response = await apiClient.get<{ voices: VoiceInfo[] }>('/tts/voices');
    return response.voices;
  },

  /**
   * Single speaker TTS
   */
  async synthesizeSingle(request: SingleTtsRequest): Promise<TtsResponse> {
    return apiClient.post<TtsResponse>('/tts/single', request);
  },

  /**
   * Multi-speaker dialogue TTS
   */
  async synthesizeMulti(request: MultiTtsRequest): Promise<TtsResponse> {
    return apiClient.post<TtsResponse>('/tts/multi', request);
  },

  /**
   * Get service status
   */
  async getStatus(): Promise<{
    available: boolean;
    model: string;
    voiceCount: number;
  }> {
    return apiClient.get('/tts/status');
  },
};

export default ttsApi;
```

### 2. useTts Hook (`src/hooks/useTts.ts`)

```typescript
import { useState, useCallback, useEffect } from 'react';
import ttsApi, {
  SingleTtsRequest,
  MultiTtsRequest,
  TtsResponse,
  VoiceInfo,
} from '../api/tts';

interface UseTtsReturn {
  audio: TtsResponse | null;
  voices: VoiceInfo[];
  isLoading: boolean;
  error: string | null;
  synthesizeSingle: (request: SingleTtsRequest) => Promise<void>;
  synthesizeMulti: (request: MultiTtsRequest) => Promise<void>;
  loadVoices: () => Promise<void>;
  clearAudio: () => void;
}

export function useTts(): UseTtsReturn {
  const [audio, setAudio] = useState<TtsResponse | null>(null);
  const [voices, setVoices] = useState<VoiceInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVoices = useCallback(async () => {
    try {
      const voiceList = await ttsApi.getVoices();
      setVoices(voiceList);
    } catch (err) {
      console.error('Failed to load voices:', err);
    }
  }, []);

  // Load voices on mount
  useEffect(() => {
    loadVoices();
  }, [loadVoices]);

  const synthesizeSingle = useCallback(async (request: SingleTtsRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ttsApi.synthesizeSingle(request);

      if (response.success) {
        setAudio(response);
      } else {
        throw new Error('TTS synthesis failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Synthesis failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const synthesizeMulti = useCallback(async (request: MultiTtsRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ttsApi.synthesizeMulti(request);

      if (response.success) {
        setAudio(response);
      } else {
        throw new Error('Multi-speaker TTS failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Synthesis failed';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearAudio = useCallback(() => {
    setAudio(null);
    setError(null);
  }, []);

  return {
    audio,
    voices,
    isLoading,
    error,
    synthesizeSingle,
    synthesizeMulti,
    loadVoices,
    clearAudio,
  };
}

export default useTts;
```

### 3. TtsGenerator Component (`src/components/TTS/TtsGenerator.tsx`)

```tsx
import React, { useState } from 'react';
import { useTts } from '../../hooks/useTts';
import type { SpeakerConfig } from '../../api/tts';
import './TtsGenerator.css';

type Mode = 'single' | 'multi';

export const TtsGenerator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('single');
  
  // Single speaker state
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  
  // Multi-speaker state
  const [dialogueText, setDialogueText] = useState(
    'Alice: Hi Bob, how are you today?\nBob: I am doing great, thanks for asking!'
  );
  const [speakerConfigs, setSpeakerConfigs] = useState<SpeakerConfig[]>([
    { speakerName: 'Alice', voiceName: 'Aurora' },
    { speakerName: 'Bob', voiceName: 'Charon' },
  ]);

  const { audio, voices, isLoading, error, synthesizeSingle, synthesizeMulti, clearAudio } =
    useTts();

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    await synthesizeSingle({
      text,
      voiceName: selectedVoice,
    });
  };

  const handleMultiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dialogueText.trim() || isLoading) return;

    await synthesizeMulti({
      text: dialogueText,
      speakerConfigs,
    });
  };

  const updateSpeakerVoice = (index: number, voiceName: string) => {
    setSpeakerConfigs((prev) =>
      prev.map((config, i) => (i === index ? { ...config, voiceName } : config))
    );
  };

  const addSpeaker = () => {
    const name = `Speaker${speakerConfigs.length + 1}`;
    setSpeakerConfigs((prev) => [...prev, { speakerName: name, voiceName: 'Kore' }]);
  };

  const removeSpeaker = (index: number) => {
    if (speakerConfigs.length > 2) {
      setSpeakerConfigs((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="tts-generator">
      <h2>Text-to-Speech</h2>

      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={mode === 'single' ? 'active' : ''}
          onClick={() => setMode('single')}
        >
          Single Speaker
        </button>
        <button
          className={mode === 'multi' ? 'active' : ''}
          onClick={() => setMode('multi')}
        >
          Multi-Speaker
        </button>
      </div>

      {/* Single Speaker Form */}
      {mode === 'single' && (
        <form onSubmit={handleSingleSubmit} className="tts-form">
          <div className="form-group">
            <label>Text to Synthesize *</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label>Voice</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={isLoading || !text.trim()}>
            {isLoading ? 'Synthesizing...' : 'Generate Speech'}
          </button>
        </form>
      )}

      {/* Multi-Speaker Form */}
      {mode === 'multi' && (
        <form onSubmit={handleMultiSubmit} className="tts-form">
          <div className="form-group">
            <label>Dialogue Text *</label>
            <textarea
              value={dialogueText}
              onChange={(e) => setDialogueText(e.target.value)}
              placeholder="Speaker1: Hello there&#10;Speaker2: Hi, how are you?"
              rows={6}
              required
            />
            <small>Format: SpeakerName: Text (one per line)</small>
          </div>

          <div className="speakers-config">
            <div className="speakers-header">
              <label>Speaker Voice Assignments</label>
              <button type="button" onClick={addSpeaker} className="add-btn">
                + Add Speaker
              </button>
            </div>

            {speakerConfigs.map((config, index) => (
              <div key={index} className="speaker-row">
                <input
                  type="text"
                  value={config.speakerName}
                  onChange={(e) =>
                    setSpeakerConfigs((prev) =>
                      prev.map((c, i) =>
                        i === index ? { ...c, speakerName: e.target.value } : c
                      )
                    )
                  }
                  placeholder="Speaker name"
                />
                <select
                  value={config.voiceName}
                  onChange={(e) => updateSpeakerVoice(index, e.target.value)}
                >
                  {voices.map((voice) => (
                    <option key={voice.name} value={voice.name}>
                      {voice.name}
                    </option>
                  ))}
                </select>
                {speakerConfigs.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeSpeaker(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <button type="submit" disabled={isLoading || !dialogueText.trim()}>
            {isLoading ? 'Synthesizing...' : 'Generate Dialogue'}
          </button>
        </form>
      )}

      {/* Error */}
      {error && <div className="error">{error}</div>}

      {/* Generated Audio */}
      {audio && (
        <div className="audio-result">
          <div className="audio-header">
            <h3>Generated Audio</h3>
            <button onClick={clearAudio} className="clear-btn">
              Clear
            </button>
          </div>
          <audio controls autoPlay className="audio-player">
            <source src={audio.url} type={audio.mimeType} />
          </audio>
          <div className="audio-info">
            {audio.voiceName && <p><strong>Voice:</strong> {audio.voiceName}</p>}
            {audio.speakerCount && <p><strong>Speakers:</strong> {audio.speakerCount}</p>}
          </div>
          <a href={audio.url} download={audio.filename} className="download-btn">
            Download Audio
          </a>
        </div>
      )}
    </div>
  );
};

export default TtsGenerator;
```

### 4. CSS (`src/components/TTS/TtsGenerator.css`)

```css
.tts-generator {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.mode-toggle {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.mode-toggle button {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  cursor: pointer;
}

.mode-toggle button.active {
  background: #007bff;
  color: white;
}

.tts-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.speakers-config {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}

.speakers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.speaker-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.speaker-row input {
  flex: 1;
}

.speaker-row select {
  flex: 1;
}

.add-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.remove-btn {
  background: #dc3545;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
}

.audio-player {
  width: 100%;
  margin: 1rem 0;
}
```

---

## Model

| Model | Voices | Format | Sample Rate |
|-------|--------|--------|-------------|
| `gemini-2.5-flash-preview-tts` | 30 | WAV | 24kHz |

---

## Example Requests

### Single Speaker
```typescript
await ttsApi.synthesizeSingle({
  text: 'Hello! Welcome to our application.',
  voiceName: 'Zephyr',
});
```

### Multi-Speaker Dialogue
```typescript
await ttsApi.synthesizeMulti({
  text: `Alice: Good morning, how can I help you?
Bob: I would like to book a table for two.
Alice: Certainly! What time would you prefer?`,
  speakerConfigs: [
    { speakerName: 'Alice', voiceName: 'Aurora' },
    { speakerName: 'Bob', voiceName: 'Charon' },
  ],
});
```
# Video Generation Guide (API V2)

Complete video generation implementation for Vite + React + TypeScript.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v2/video/generate` | Text-to-video |
| POST | `/api/v2/video/image-to-video` | Image-to-video |
| POST | `/api/v2/video/extend` | Extend video |
| GET | `/api/v2/video/status` | Service status |

## Request Formats

### Text-to-Video

```typescript
interface VideoRequest {
  prompt: string;                     // Required
  model?: string;                     // Default: 'veo-3.1-generate-preview'
  negativePrompt?: string;
  aspectRatio?: '16:9' | '9:16';
  durationSeconds?: number;           // 5-8
  generateAudio?: boolean;            // Include audio
  resolution?: string;                // '720p', '1080p'
}
```

### Image-to-Video

```typescript
interface ImageToVideoRequest {
  prompt: string;
  image: {
    bytesBase64Encoded: string;       // Base64 image data
    mimeType: string;                 // 'image/png', 'image/jpeg'
  };
  durationSeconds?: number;
  generateAudio?: boolean;
  aspectRatio?: '16:9' | '9:16';
}
```

## Response Format

```typescript
interface VideoResponse {
  success: boolean;
  url: string;                        // Public video URL
  gcsUri?: string;                    // GCS URI
  filename?: string;
  model: string;
  duration: number;
  aspectRatio: string;
  hasAudio: boolean;
  generatedAt: string;
}
```

---

## Complete Vite + TSX Implementation

### 1. Video API Service (`src/api/video.ts`)

```typescript
import apiClient from './client';

export interface VideoRequest {
  prompt: string;
  model?: string;
  negativePrompt?: string;
  aspectRatio?: '16:9' | '9:16';
  durationSeconds?: number;
  generateAudio?: boolean;
  resolution?: string;
}

export interface ImageToVideoRequest {
  prompt: string;
  image: {
    bytesBase64Encoded: string;
    mimeType: string;
  };
  durationSeconds?: number;
  generateAudio?: boolean;
  aspectRatio?: '16:9' | '9:16';
}

export interface VideoResponse {
  success: boolean;
  url: string;
  gcsUri?: string;
  filename?: string;
  model: string;
  duration: number;
  aspectRatio: string;
  hasAudio: boolean;
  generatedAt: string;
}

export const videoApi = {
  /**
   * Generate video from text prompt
   */
  async generate(request: VideoRequest): Promise<VideoResponse> {
    return apiClient.post<VideoResponse>('/video/generate', request);
  },

  /**
   * Generate video from image
   */
  async imageToVideo(request: ImageToVideoRequest): Promise<VideoResponse> {
    return apiClient.post<VideoResponse>('/video/image-to-video', request);
  },

  /**
   * Extend existing video
   */
  async extend(request: {
    prompt: string;
    videoUrl: string;
    extensionSeconds?: number;
    generateAudio?: boolean;
  }): Promise<VideoResponse> {
    return apiClient.post<VideoResponse>('/video/extend', request);
  },

  /**
   * Get service status
   */
  async getStatus(): Promise<{
    available: boolean;
    defaultModel: string;
    supportedModels: string[];
  }> {
    return apiClient.get('/video/status');
  },
};

export default videoApi;
```

### 2. useVideoGeneration Hook (`src/hooks/useVideoGeneration.ts`)

```typescript
import { useState, useCallback } from 'react';
import videoApi, { VideoRequest, ImageToVideoRequest, VideoResponse } from '../api/video';

interface UseVideoGenerationReturn {
  video: VideoResponse | null;
  isLoading: boolean;
  error: string | null;
  progress: string;
  generate: (request: VideoRequest) => Promise<void>;
  imageToVideo: (request: ImageToVideoRequest) => Promise<void>;
  clearVideo: () => void;
}

export function useVideoGeneration(): UseVideoGenerationReturn {
  const [video, setVideo] = useState<VideoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState('');

  const generate = useCallback(async (request: VideoRequest) => {
    setIsLoading(true);
    setError(null);
    setProgress('Generating video... This may take 1-2 minutes.');

    try {
      const response = await videoApi.generate(request);

      if (response.success) {
        setVideo(response);
        setProgress('Video generated successfully!');
      } else {
        throw new Error('Video generation failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Generation failed';
      setError(message);
      setProgress('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const imageToVideo = useCallback(async (request: ImageToVideoRequest) => {
    setIsLoading(true);
    setError(null);
    setProgress('Converting image to video...');

    try {
      const response = await videoApi.imageToVideo(request);

      if (response.success) {
        setVideo(response);
        setProgress('Video generated successfully!');
      } else {
        throw new Error('Image-to-video conversion failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Conversion failed';
      setError(message);
      setProgress('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearVideo = useCallback(() => {
    setVideo(null);
    setError(null);
    setProgress('');
  }, []);

  return {
    video,
    isLoading,
    error,
    progress,
    generate,
    imageToVideo,
    clearVideo,
  };
}

export default useVideoGeneration;
```

### 3. VideoGenerator Component (`src/components/Video/VideoGenerator.tsx`)

```tsx
import React, { useState, useRef } from 'react';
import { useVideoGeneration } from '../../hooks/useVideoGeneration';
import './VideoGenerator.css';

type Mode = 'text' | 'image';

export const VideoGenerator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('text');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [duration, setDuration] = useState(8);
  const [generateAudio, setGenerateAudio] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { video, isLoading, error, progress, generate, imageToVideo, clearVideo } =
    useVideoGeneration();

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      setImageBase64(base64);
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    if (mode === 'text') {
      await generate({
        prompt,
        negativePrompt: negativePrompt || undefined,
        aspectRatio,
        durationSeconds: duration,
        generateAudio,
      });
    } else if (imageBase64) {
      await imageToVideo({
        prompt,
        image: {
          bytesBase64Encoded: imageBase64,
          mimeType: 'image/png',
        },
        durationSeconds: duration,
        generateAudio,
        aspectRatio,
      });
    }
  };

  return (
    <div className="video-generator">
      <h2>Video Generator</h2>

      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={mode === 'text' ? 'active' : ''}
          onClick={() => setMode('text')}
        >
          Text-to-Video
        </button>
        <button
          className={mode === 'image' ? 'active' : ''}
          onClick={() => setMode('image')}
        >
          Image-to-Video
        </button>
      </div>

      <form onSubmit={handleSubmit} className="generator-form">
        {/* Image Upload (for image mode) */}
        {mode === 'image' && (
          <div className="form-group">
            <label>Source Image *</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            )}
          </div>
        )}

        {/* Prompt */}
        <div className="form-group">
          <label>
            {mode === 'text' ? 'Video Description *' : 'Motion Description *'}
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              mode === 'text'
                ? 'Describe the video you want to generate...'
                : 'Describe how the image should animate...'
            }
            rows={3}
            required
          />
        </div>

        {/* Negative Prompt (text mode only) */}
        {mode === 'text' && (
          <div className="form-group">
            <label>Negative Prompt</label>
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              placeholder="What to avoid..."
            />
          </div>
        )}

        {/* Settings */}
        <div className="settings-row">
          <div className="form-group">
            <label>Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')}
            >
              <option value="16:9">16:9 (Landscape)</option>
              <option value="9:16">9:16 (Portrait)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Duration (seconds)</label>
            <input
              type="number"
              min={5}
              max={8}
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 8)}
            />
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={generateAudio}
                onChange={(e) => setGenerateAudio(e.target.checked)}
              />
              Generate Audio
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={
            isLoading || !prompt.trim() || (mode === 'image' && !imageBase64)
          }
        >
          {isLoading ? 'Generating...' : 'Generate Video'}
        </button>
      </form>

      {/* Progress */}
      {progress && <div className="progress">{progress}</div>}

      {/* Error */}
      {error && <div className="error">{error}</div>}

      {/* Generated Video */}
      {video && (
        <div className="video-result">
          <div className="video-header">
            <h3>Generated Video</h3>
            <button onClick={clearVideo} className="clear-btn">
              Clear
            </button>
          </div>
          <video controls autoPlay loop className="video-player">
            <source src={video.url} type="video/mp4" />
          </video>
          <div className="video-info">
            <p>
              <strong>Model:</strong> {video.model}
            </p>
            <p>
              <strong>Duration:</strong> {video.duration}s
            </p>
            <p>
              <strong>Aspect Ratio:</strong> {video.aspectRatio}
            </p>
            <p>
              <strong>Audio:</strong> {video.hasAudio ? 'Yes' : 'No'}
            </p>
          </div>
          <a href={video.url} download={video.filename} className="download-btn">
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;
```

### 4. CSS Styles (`src/components/Video/VideoGenerator.css`)

```css
.video-generator {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.mode-toggle {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.mode-toggle button {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-toggle button.active {
  background: #007bff;
  color: white;
}

.generator-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.checkbox {
  flex-direction: row;
  align-items: center;
}

.form-group.checkbox label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.image-preview {
  max-width: 300px;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.settings-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  align-items: end;
}

.video-result {
  margin-top: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
}

.video-player {
  width: 100%;
  display: block;
}

.video-info {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.download-btn {
  display: block;
  text-align: center;
  padding: 1rem;
  background: #28a745;
  color: white;
  text-decoration: none;
}
```

---

## Models

| Model | Duration | Audio | Description |
|-------|----------|-------|-------------|
| `veo-3.1-generate-preview` | 8s | ✅ | Latest, best quality |
| `veo-3.0-generate-preview` | 8s | ✅ | Stable |
| `veo-2.0-generate-001` | 8s | ❌ | Legacy |

---

## Example Requests

### Text-to-Video
```typescript
await videoApi.generate({
  prompt: 'A drone flying over a mountain landscape at sunset',
  aspectRatio: '16:9',
  durationSeconds: 8,
  generateAudio: true,
});
```

### Image-to-Video
```typescript
await videoApi.imageToVideo({
  prompt: 'The camera slowly zooms out, clouds move across the sky',
  image: {
    bytesBase64Encoded: base64ImageData,
    mimeType: 'image/png',
  },
  durationSeconds: 8,
  generateAudio: true,
});
```
