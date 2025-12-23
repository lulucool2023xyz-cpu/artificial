# 📋 FRONT-END Integration Specs untuk Backend Team

> **PENTING**: Dokumen ini berisi spesifikasi lengkap API yang dibutuhkan frontend.
> Backend team harus mengimplementasikan sesuai spec ini agar integrasi berjalan lancar.

**Last Updated:** 2025-12-23
**Frontend Framework:** Vite + React + TypeScript
**Base URL:** `${API_BASE_URL}` (dari environment variable)

---

## 📑 Daftar Isi
1. [Payment Integration](#1-payment-integration-midtransstripe)
2. [Email Verification](#2-email-verification-flow)
3. [Media History API](#3-media-history--gallery-api)
4. [User API Keys](#4-user-api-keys)
5. [Share & Collaboration](#5-share--collaboration)
6. [Prompt Marketplace](#6-prompt-templates-marketplace)
7. [Global Conventions](#-global-conventions)
8. [Database Schema Suggestions](#-database-schema-suggestions)

---

## 1. Payment Integration (Midtrans/Stripe)

### Frontend sudah siap:
- ✅ UI subscription page di `/pricing`
- ✅ Tombol "Upgrade ke Pro" (planId: `pro`) dan "Hubungi Sales" (planId: `enterprise`)
- ✅ Toggle bulanan/tahunan
- ✅ Price display (Pro: Rp 99.000/bulan, Rp 950.400/tahun)

### Endpoints:

#### `POST /api/v2/payment/create-order`
Membuat order baru untuk pembayaran subscription.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```typescript
interface CreateOrderRequest {
  planId: 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
}
```

**Example Request:**
```json
{
  "planId": "pro",
  "billingCycle": "monthly"
}
```

**Response (200 OK):**
```typescript
interface CreateOrderResponse {
  orderId: string;
  snapToken: string;      // Untuk Midtrans Snap popup
  clientSecret?: string;  // Untuk Stripe Elements (alternative)
  amount: number;
  currency: 'IDR';
  expiresAt: string;      // Order expiry time
}
```

**Example Response:**
```json
{
  "orderId": "ORD-2025122301234",
  "snapToken": "66e4fa55-fdac-4ef9-91b5-7...",
  "amount": 99000,
  "currency": "IDR",
  "expiresAt": "2025-12-23T18:30:00Z"
}
```

**Error Responses:**
| Status | Code | Message |
|--------|------|---------|
| 400 | `INVALID_PLAN` | Plan ID tidak valid |
| 401 | `UNAUTHORIZED` | Token tidak valid |
| 409 | `ALREADY_SUBSCRIBED` | User sudah memiliki subscription aktif |

---

#### `POST /api/v2/payment/verify`
Verifikasi pembayaran setelah user selesai bayar.

**Request Body:**
```typescript
interface VerifyPaymentRequest {
  orderId: string;
  transactionId: string;  // Dari Midtrans callback
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "subscription": {
    "planId": "pro",
    "expiresAt": "2026-01-23T17:30:00Z",
    "status": "active"
  },
  "message": "Pembayaran berhasil! Subscription aktif."
}
```

---

#### `GET /api/v2/subscription/status`
Cek status subscription user saat ini.

**Response (200 OK):**
```json
{
  "isActive": true,
  "plan": "pro",
  "expiresAt": "2026-01-23T17:30:00Z",
  "features": [
    "unlimited_messages",
    "all_models",
    "50_images_daily",
    "10_videos_daily",
    "voice_unlimited",
    "deep_thinking",
    "priority_support"
  ],
  "daysRemaining": 31
}
```

---

## 2. Email Verification Flow

### Frontend sudah siap:
- ✅ Signup form dengan validasi
- ✅ Success message: "Silakan cek email Anda untuk verifikasi"
- ✅ Button "Kirim Ulang Email Verifikasi"
- ✅ Handler untuk `/auth/callback?type=email_verification`

### Endpoints:

#### `POST /api/v2/auth/resend-verification`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verifikasi telah dikirim",
  "retryAfter": 60
}
```

**Error Responses:**
| Status | Code | Message |
|--------|------|---------|
| 400 | `ALREADY_VERIFIED` | Email sudah terverifikasi |
| 429 | `RATE_LIMITED` | Tunggu 60 detik sebelum mencoba lagi |
| 404 | `USER_NOT_FOUND` | Email tidak terdaftar |

---

#### `GET /api/v2/auth/verify-email`

**Query Parameters:**
- `token` (required): Token verifikasi dari email

**Success:** Redirect ke `{FRONTEND_URL}/auth/callback?verified=true`

**Failed:** Redirect ke `{FRONTEND_URL}/auth/callback?verified=false&error=INVALID_TOKEN`

### Supabase Configuration Required:
```
Authentication > Email Templates > Confirm signup:
- Subject: "Verifikasi Email Orenax"
- Redirect URL: {FRONTEND_URL}/auth/callback?type=email_verification
- Enable "Confirm email" in Settings
```

---

## 3. Media History / Gallery API

### Frontend sudah siap:
- ✅ Gallery grid di Creative page
- ✅ Download button dengan nama file
- ✅ Delete button dengan konfirmasi
- ✅ Infinite scroll (page-based)
- ✅ Filter by type (image/video/music)

### Endpoints:

#### `GET /api/v2/media/history`

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| type | string | - | Filter: `image`, `video`, `music` |
| page | number | 1 | Page number (1-indexed) |
| limit | number | 20 | Items per page (max 50) |

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "media_abc123",
      "type": "image",
      "url": "https://storage.example.com/images/abc123.png",
      "thumbnailUrl": "https://storage.example.com/thumbnails/abc123.jpg",
      "prompt": "A beautiful sunset over Indonesian rice fields",
      "model": "imagen-4.0",
      "createdAt": "2025-12-23T17:00:00Z",
      "metadata": {
        "width": 1024,
        "height": 1024,
        "format": "png",
        "size": 2048576
      }
    },
    {
      "id": "media_def456",
      "type": "video",
      "url": "https://storage.example.com/videos/def456.mp4",
      "thumbnailUrl": "https://storage.example.com/thumbnails/def456.jpg",
      "prompt": "Dancing traditional Javanese dancer",
      "model": "veo-3.1",
      "createdAt": "2025-12-23T16:00:00Z",
      "metadata": {
        "width": 1280,
        "height": 720,
        "duration": 8.5,
        "format": "mp4"
      }
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20,
  "hasMore": true
}
```

---

#### `DELETE /api/v2/media/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Media berhasil dihapus"
}
```

**Error:**
| Status | Code | Message |
|--------|------|---------|
| 404 | `MEDIA_NOT_FOUND` | Media tidak ditemukan |
| 403 | `FORBIDDEN` | Bukan pemilik media |

---

## 4. User API Keys

### Frontend sudah siap:
- ✅ Settings page section "Developer API"
- ✅ Generate API Key form (name input)
- ✅ API key list dengan prefix display
- ✅ Copy button (one-time full key display)
- ✅ Delete/Revoke button
- ✅ Usage meter charts

### Endpoints:

#### `GET /api/v2/user/api-keys`

**Response (200 OK):**
```json
{
  "keys": [
    {
      "id": "key_123abc",
      "name": "Production App",
      "prefix": "sk-prod-...7f3a",
      "createdAt": "2025-12-01T10:00:00Z",
      "lastUsed": "2025-12-23T15:30:00Z",
      "usageCount": 1523
    },
    {
      "id": "key_456def",
      "name": "Development",
      "prefix": "sk-dev-...2b1c",
      "createdAt": "2025-12-20T14:00:00Z",
      "lastUsed": null,
      "usageCount": 0
    }
  ],
  "limit": 5,
  "remaining": 3
}
```

---

#### `POST /api/v2/user/api-keys`

**Request Body:**
```json
{
  "name": "My New App"
}
```

**Response (201 Created):**
```json
{
  "id": "key_789ghi",
  "name": "My New App",
  "key": "sk-prod-abc123def456ghi789jkl012mno345pqr678stu901vwx",
  "prefix": "sk-prod-...901vwx",
  "message": "⚠️ Simpan key ini sekarang! Tidak akan ditampilkan lagi."
}
```

**Error:**
| Status | Code | Message |
|--------|------|---------|
| 400 | `NAME_REQUIRED` | Nama API key wajib diisi |
| 403 | `KEY_LIMIT_REACHED` | Batas maksimal API key tercapai (5) |

---

#### `DELETE /api/v2/user/api-keys/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "API key berhasil dihapus"
}
```

---

#### `GET /api/v2/user/api-usage`

**Query Parameters:**
- `period`: `daily` | `monthly` (default: `daily`)

**Response (200 OK):**
```json
{
  "period": "daily",
  "date": "2025-12-23",
  "usage": {
    "chat": 45,
    "image": 12,
    "video": 3,
    "music": 0,
    "tts": 8
  },
  "limits": {
    "chat": 100,
    "image": 50,
    "video": 10,
    "music": 5,
    "tts": 20
  },
  "percentUsed": {
    "chat": 45,
    "image": 24,
    "video": 30,
    "music": 0,
    "tts": 40
  }
}
```

---

## 5. Share & Collaboration

### Frontend sudah siap:
- ✅ Share button di setiap conversation
- ✅ Modal dengan share link dan expiry options
- ✅ Copy to clipboard
- ✅ Public shared chat view page (`/shared/:shareId`)

### Endpoints:

#### `POST /api/v2/chat/share`

**Request Body:**
```json
{
  "conversationId": "conv_abc123",
  "expiresIn": 168
}
```
> `expiresIn`: hours (168 = 7 days), `null` = never expires

**Response (201 Created):**
```json
{
  "shareId": "sh_xyz789",
  "shareUrl": "https://orenax.ai/shared/sh_xyz789",
  "expiresAt": "2025-12-30T17:30:00Z",
  "isPublic": true
}
```

---

#### `GET /api/v2/shared/:shareId`
> ⚠️ **PUBLIC ENDPOINT** - No authentication required!

**Response (200 OK):**
```json
{
  "id": "sh_xyz789",
  "title": "Diskusi tentang Batik",
  "messages": [
    {
      "role": "user",
      "content": "Ceritakan sejarah batik Indonesia",
      "timestamp": "2025-12-23T10:00:00Z"
    },
    {
      "role": "model",
      "content": "Batik adalah warisan budaya Indonesia yang...",
      "timestamp": "2025-12-23T10:00:30Z"
    }
  ],
  "messageCount": 12,
  "createdAt": "2025-12-23T10:00:00Z",
  "author": {
    "name": "Arief",
    "avatar": "https://storage.example.com/avatars/arief.jpg"
  }
}
```

**Error:**
| Status | Code | Message |
|--------|------|---------|
| 404 | `SHARE_NOT_FOUND` | Link tidak ditemukan |
| 410 | `SHARE_EXPIRED` | Link sudah kadaluarsa |

---

#### `DELETE /api/v2/chat/share/:shareId`
Revoke shared link.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Link share berhasil dihapus"
}
```

---

## 6. Prompt Templates Marketplace

### Frontend sudah siap:
- ✅ My Prompts page (`/chat/prompts`)
- ✅ Prompt editor dengan preview
- ✅ Browse public prompts marketplace
- ✅ Use/copy prompt to chat
- ✅ Save/unsave prompts

### Endpoints:

#### `GET /api/v2/prompts/marketplace`

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| category | string | - | Category filter |
| search | string | - | Search in title/description |
| sort | string | `popular` | `popular`, `recent`, `rating` |
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |

**Response (200 OK):**
```json
{
  "prompts": [
    {
      "id": "prompt_abc123",
      "title": "SEO Blog Writer",
      "description": "Generate SEO-optimized blog posts in Indonesian",
      "prompt": "Kamu adalah penulis blog SEO ahli. Tulis artikel tentang {topic} dengan kata kunci {keywords}...",
      "category": "writing",
      "author": {
        "id": "user_xyz",
        "name": "ContentPro",
        "avatar": "https://storage.example.com/avatars/xyz.jpg"
      },
      "uses": 1234,
      "rating": 4.8,
      "ratingCount": 89,
      "isPublic": true,
      "isSaved": false,
      "createdAt": "2025-12-01T10:00:00Z"
    }
  ],
  "total": 156,
  "page": 1,
  "hasMore": true,
  "categories": ["writing", "coding", "marketing", "education", "creative", "business"]
}
```

---

#### `GET /api/v2/prompts/mine`
Get user's own prompts.

**Response:** Same structure as marketplace.

---

#### `POST /api/v2/prompts`

**Request Body:**
```json
{
  "title": "Email Response Generator",
  "description": "Generate professional email responses",
  "prompt": "Kamu adalah asisten profesional. Bantu saya membalas email berikut dengan nada {tone}...",
  "category": "business",
  "isPublic": true
}
```

**Response (201 Created):**
```json
{
  "id": "prompt_newid",
  "title": "Email Response Generator",
  "message": "Prompt berhasil dibuat"
}
```

---

#### `PUT /api/v2/prompts/:id`
Update existing prompt.

---

#### `DELETE /api/v2/prompts/:id`
Delete prompt (only owner).

---

#### `POST /api/v2/prompts/:id/save`
Save/bookmark a prompt.

**Response:**
```json
{
  "success": true,
  "isSaved": true
}
```

---

#### `POST /api/v2/prompts/:id/use`
Record usage and get prompt content.

**Response:**
```json
{
  "success": true,
  "prompt": "Full prompt text here...",
  "variables": ["topic", "keywords"]
}
```

---

## 🔧 Global Conventions

### Authentication
```
Authorization: Bearer <access_token>
```
Semua endpoint (kecuali yang ditandai PUBLIC) membutuhkan header ini.

### Error Response Format
```typescript
interface ErrorResponse {
  error: true;
  code: string;          // Machine-readable code (e.g., "INVALID_TOKEN")
  message: string;       // Human-readable message (Indonesian)
  details?: Record<string, string>; // Field-specific errors for validation
}
```

**Example:**
```json
{
  "error": true,
  "code": "VALIDATION_ERROR",
  "message": "Data tidak valid",
  "details": {
    "email": "Format email tidak valid",
    "password": "Password minimal 8 karakter"
  }
}
```

### HTTP Status Codes
| Status | Usage |
|--------|-------|
| 200 | Success (GET, PUT, DELETE) |
| 201 | Created (POST) |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (token invalid/missing) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 409 | Conflict (duplicate, already exists) |
| 410 | Gone (expired) |
| 429 | Rate Limited |
| 500 | Internal Server Error |

### Pagination
```typescript
interface PaginatedRequest {
  page?: number;   // 1-indexed, default: 1
  limit?: number;  // default: 20, max: 50
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
```

### Timestamps
- Format: **ISO 8601** (`2025-12-23T17:30:00Z`)
- Timezone: **UTC**

---

## 🗄️ Database Schema Suggestions

### subscriptions
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL DEFAULT 'free',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  midtrans_subscription_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### user_api_keys
```sql
CREATE TABLE user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  prefix VARCHAR(20) NOT NULL,
  last_used_at TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### media_history
```sql
CREATE TABLE media_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  prompt TEXT,
  model VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### shared_chats
```sql
CREATE TABLE shared_chats (
  id VARCHAR(20) PRIMARY KEY,
  conversation_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### prompts
```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  category VARCHAR(50),
  is_public BOOLEAN DEFAULT false,
  uses_count INTEGER DEFAULT 0,
  rating_sum DECIMAL DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE prompt_saves (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, prompt_id)
);
```

---

## ❓ Pertanyaan untuk Backend Team

Jika ada yang kurang jelas, silakan tanyakan ke tim frontend:
1. Apakah format response sudah sesuai?
2. Apakah ada field yang perlu ditambahkan?
3. Apakah rate limit yang disarankan?

---

**Contact:** Frontend Team  
**File ini dibuat oleh:** AI Assistant (Claude)  
**Review status:** ✅ Ready for backend implementation
