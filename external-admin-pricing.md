# External Admin Guide: Setting Up Payment Gateway

Panduan lengkap untuk admin/owner dalam mengkonfigurasi pembayaran eksternal.

---

## Overview

Sistem Orenax menggunakan **Midtrans** sebagai payment gateway untuk subscription Pro.
Alternatif: Stripe (jika target pasar internasional).

---

## Step 1: Daftar Akun Midtrans

### 1.1 Buat Akun
1. Buka [https://dashboard.midtrans.com/register](https://dashboard.midtrans.com/register)
2. Isi form pendaftaran dengan data bisnis
3. Verifikasi email
4. Login ke dashboard

### 1.2 Lengkapi Data Bisnis
1. Dashboard → Settings → General Settings
2. Isi:
   - Nama Bisnis: "Orenax"
   - Kategori: "Software & SaaS"
   - Alamat bisnis lengkap
   - Nomor telepon

### 1.3 Upload Dokumen
1. KTP pemilik
2. NPWP bisnis (jika ada)
3. Akta perusahaan (jika PT)
4. Screenshot website

> **Note:** Proses verifikasi memakan waktu 1-3 hari kerja.

---

## Step 2: Dapatkan API Keys

### 2.1 Sandbox (Testing)
1. Dashboard → Settings → Access Keys
2. Pilih environment: **Sandbox**
3. Copy:
   - **Server Key**: `SB-Mid-server-xxx...`
   - **Client Key**: `SB-Mid-client-xxx...`

### 2.2 Production (Live)
1. Setelah verifikasi bisnis disetujui
2. Dashboard → Settings → Access Keys
3. Pilih environment: **Production**
4. Copy Server Key dan Client Key

---

## Step 3: Konfigurasi Backend

### 3.1 Environment Variables

Tambahkan ke `.env` backend:

```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=SB-Mid-server-xxx...
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxx...
MIDTRANS_IS_PRODUCTION=false

# Webhook URL (untuk notifikasi pembayaran)
MIDTRANS_WEBHOOK_URL=https://api.orenax.ai/api/v2/payment/webhook
```

### 3.2 Install SDK

```bash
npm install midtrans-client
```

### 3.3 Inisialisasi Client

```typescript
// backend/src/config/midtrans.ts
import midtransClient from 'midtrans-client';

export const snap = new midtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const coreApi = new midtransClient.CoreApi({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});
```

---

## Step 4: Konfigurasi Webhook

### 4.1 Set Webhook URL di Dashboard
1. Dashboard → Settings → Configuration
2. Payment Notification URL: `https://api.orenax.ai/api/v2/payment/webhook`
3. Klik Save

### 4.2 Whitelist IP Midtrans
Jika menggunakan firewall, whitelist IP berikut:
- Sandbox: `103.208.220.0/24`
- Production: `103.127.16.0/24`

---

## Step 5: Frontend Integration

### 5.1 Tambahkan Snap.js

Di `index.html`:

```html
<!-- Sandbox -->
<script src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key="SB-Mid-client-xxx..."></script>

<!-- Production -->
<script src="https://app.midtrans.com/snap/snap.js"
        data-client-key="Mid-client-xxx..."></script>
```

### 5.2 Atau Load Dinamis

```typescript
// utils/midtrans.ts
export const loadMidtransScript = (clientKey: string, isProduction: boolean) => {
  const script = document.createElement('script');
  script.src = isProduction
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js';
  script.setAttribute('data-client-key', clientKey);
  document.body.appendChild(script);
};
```

---

## Step 6: Testing

### 6.1 Test Cards

| Card Number | CVV | Expiry | Result |
|-------------|-----|--------|--------|
| 4811 1111 1111 1114 | 123 | Any future | ✅ Success |
| 4911 1111 1111 1113 | 123 | Any future | ❌ Denied |
| 4411 1111 1111 1118 | 123 | Any future | ⚠️ Challenge |

### 6.2 Test Flow
1. Buka `/pricing`
2. Login dengan test account
3. Klik "Upgrade ke Pro"
4. Gunakan test card di atas
5. Verifikasi:
   - Webhook diterima
   - Subscription status berubah
   - Email konfirmasi dikirim

---

## Step 7: Go Live Checklist

### Sebelum Launch:
- [ ] Verifikasi bisnis disetujui Midtrans
- [ ] Ganti environment ke **Production**
- [ ] Update API keys di backend
- [ ] Update Snap.js script di frontend
- [ ] Test pembayaran nyata dengan nominal kecil
- [ ] Setup monitoring (error tracking)
- [ ] Setup backup database

### Konfigurasi Tambahan:
- [ ] Set refund policy
- [ ] Konfigurasi auto-renewal (jika diperlukan)
- [ ] Setup laporan keuangan

---

## Troubleshooting

### Webhook Tidak Diterima
1. Cek URL webhook di dashboard
2. Pastikan endpoint accessible dari internet
3. Cek firewall/whitelist IP
4. Cek logs untuk error

### Signature Invalid
1. Pastikan Server Key benar
2. Verifikasi algoritma signature (SHA512)
3. Cek format request body

### Payment Always Pending
1. Cek apakah webhook processed
2. Verifikasi transaction_status handling
3. Cek database connection

---

## Support

- Midtrans Support: support@midtrans.com
- Dokumentasi: [https://docs.midtrans.com](https://docs.midtrans.com)
- Status: [https://status.midtrans.com](https://status.midtrans.com)

---

## Alternative: Stripe (International)

Jika butuh pembayaran internasional:

1. Daftar di [https://stripe.com](https://stripe.com)
2. Install: `npm install stripe`
3. Ganti Midtrans dengan Stripe implementation

```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  payment_method_types: ['card'],
  line_items: [{ price: 'price_xxx', quantity: 1 }],
  success_url: 'https://orenax.ai/success',
  cancel_url: 'https://orenax.ai/pricing',
});
```
