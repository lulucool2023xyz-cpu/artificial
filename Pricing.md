# Pricing API Documentation untuk Backend

Dokumentasi lengkap untuk implementasi sistem pembayaran subscription.

---

## Overview

Frontend Pricing page sudah siap di `/pricing`. Halaman ini menampilkan 3 paket:
- **Free**: Rp 0 (default)
- **Pro**: Rp 99.000/bulan atau Rp 950.400/tahun (-20%)
- **Enterprise**: Custom (contact sales)

---

## API Endpoints yang Dibutuhkan

### 1. Subscription Status

```typescript
// GET /api/v2/subscription/status
// Headers: Authorization: Bearer <token>

interface SubscriptionStatusResponse {
  isActive: boolean;
  plan: 'free' | 'pro' | 'enterprise';
  expiresAt: string | null;  // ISO 8601
  features: string[];
  daysRemaining: number | null;
}
```

**Example Response:**
```json
{
  "isActive": true,
  "plan": "pro",
  "expiresAt": "2026-01-23T17:30:00Z",
  "features": ["unlimited_messages", "all_models", "50_images_daily"],
  "daysRemaining": 31
}
```

---

### 2. Create Payment Order

```typescript
// POST /api/v2/payment/create-order
// Headers: Authorization: Bearer <token>

interface CreateOrderRequest {
  planId: 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
}

interface CreateOrderResponse {
  orderId: string;
  snapToken: string;      // Midtrans Snap token
  amount: number;         // dalam Rupiah
  currency: 'IDR';
  expiresAt: string;      // Order expiry
}
```

**Frontend akan:**
1. Call API ini ketika user klik "Upgrade ke Pro"
2. Terima `snapToken`
3. Panggil `window.snap.pay(snapToken, callbacks)`

---

### 3. Payment Webhook (dari Midtrans)

```typescript
// POST /api/v2/payment/webhook
// Headers: X-Midtrans-Signature (verify!)

interface MidtransNotification {
  transaction_status: 'capture' | 'settlement' | 'pending' | 'deny' | 'cancel' | 'expire';
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_id: string;
  fraud_status?: string;
}
```

**Backend harus:**
1. Verify signature dari Midtrans
2. Update subscription status di database
3. Send email konfirmasi ke user

---

### 4. Cancel Subscription

```typescript
// POST /api/v2/subscription/cancel
// Headers: Authorization: Bearer <token>

interface CancelResponse {
  success: boolean;
  message: string;
  endsAt: string;  // Subscription tetap aktif sampai tanggal ini
}
```

---

## Database Schema

```sql
-- subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan VARCHAR(20) NOT NULL DEFAULT 'free',
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active, cancelled, expired
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  midtrans_subscription_id VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- payment_orders table
CREATE TABLE payment_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  plan_id VARCHAR(20) NOT NULL,
  billing_cycle VARCHAR(20) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'IDR',
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, expired
  midtrans_transaction_id VARCHAR(100),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- payment_history table  
CREATE TABLE payment_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL,
  payment_method VARCHAR(50),
  status VARCHAR(20) NOT NULL,
  invoice_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Pricing Logic

```typescript
const PRICING = {
  pro: {
    monthly: 99000,      // Rp 99.000
    yearly: 950400,      // Rp 950.400 (99000 * 12 * 0.8)
  },
  enterprise: {
    monthly: null,       // Custom pricing
    yearly: null,
  }
};

function calculatePrice(planId: string, billingCycle: string): number {
  return PRICING[planId]?.[billingCycle] || 0;
}
```

---

## Frontend Integration

### 1. Di Pricing.tsx

```typescript
// Ketika user klik "Upgrade ke Pro"
const handleSubscribe = async (planId: string) => {
  if (!isAuthenticated) {
    // Show login modal
    setIsAuthModalOpen(true);
    return;
  }
  
  // Create order
  const { data } = await apiCall('/api/v2/payment/create-order', {
    method: 'POST',
    body: JSON.stringify({ planId, billingCycle })
  });
  
  // Open Midtrans popup
  window.snap.pay(data.snapToken, {
    onSuccess: (result) => {
      toast.success('Pembayaran berhasil!');
      navigate('/chat');
    },
    onError: (result) => {
      toast.error('Pembayaran gagal');
    },
    onClose: () => {
      toast.info('Anda menutup popup pembayaran');
    }
  });
};
```

### 2. Check Subscription di Protected Pages

```typescript
// Di AuthContext atau custom hook
const { data: subscription } = useQuery({
  queryKey: ['subscription'],
  queryFn: () => apiCall('/api/v2/subscription/status'),
  enabled: isAuthenticated,
});

const isPro = subscription?.plan === 'pro' && subscription?.isActive;
```

---

## Feature Gating

Contoh penggunaan di frontend:

```typescript
// Limit gambar per hari
const canGenerateImage = () => {
  if (subscription.plan === 'pro') return true;
  return dailyImageCount < 3; // Free limit
};

// Akses model tertentu
const canUseModel = (modelId: string) => {
  if (subscription.plan === 'pro') return true;
  return ['gemini-2.0-flash'].includes(modelId); // Free models
};
```

---

## Error Codes

| Code | Message |
|------|---------|
| `ALREADY_SUBSCRIBED` | User sudah memiliki subscription aktif |
| `INVALID_PLAN` | Plan ID tidak valid |
| `PAYMENT_FAILED` | Pembayaran gagal |
| `SUBSCRIPTION_EXPIRED` | Subscription sudah expired |
| `INSUFFICIENT_BALANCE` | Saldo/limit tidak cukup |

---

## Testing

### Test Cards (Midtrans Sandbox)

| Card Number | Result |
|-------------|--------|
| 4811 1111 1111 1114 | Success |
| 4911 1111 1111 1113 | Denied |
| 4411 1111 1111 1118 | Challenge |

---

## Checklist Backend

- [ ] Setup Midtrans Sandbox/Production
- [ ] Implement `/api/v2/subscription/status`
- [ ] Implement `/api/v2/payment/create-order`
- [ ] Implement `/api/v2/payment/webhook`
- [ ] Setup webhook signature verification
- [ ] Create database tables
- [ ] Implement email notifications
- [ ] Add feature gating middleware
