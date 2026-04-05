# SalesPilot — Frontend Implementation Guide

> **Purpose**: This document maps every backend endpoint, Socket.IO event, Redis-cached response, and PDF receipt flow to its exact frontend implementation. No code — only flows, data shapes, and integration sequences.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Authentication & Session Management](#2-authentication--session-management)
3. [Branch Management](#3-branch-management)
4. [Category Management](#4-category-management)
5. [Product Management](#5-product-management)
6. [Inventory Management](#6-inventory-management)
7. [POS — Order Creation Flow](#7-pos--order-creation-flow)
8. [Order Management & Refunds](#8-order-management--refunds)
9. [Receipt / Invoice PDF Printing](#9-receipt--invoice-pdf-printing)
10. [Customer Management](#10-customer-management)
11. [Coupon Management](#11-coupon-management)
12. [Cash Register](#12-cash-register)
13. [Staff Management](#13-staff-management)
14. [Sales Reports](#14-sales-reports)
15. [Analytics Dashboard](#15-analytics-dashboard)
16. [AI Insights](#16-ai-insights)
17. [Socket.IO — Real-Time Integration](#17-socketio--real-time-integration)
18. [Recommended Implementation Order](#18-recommended-implementation-order)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                     │
│                                                         │
│  Zustand Stores ──► API Service Layer ──► Axios Client  │
│       ▲                                       │         │
│       │                                       ▼         │
│  Socket.IO Client ◄──────────────────── Backend API     │
│                                       (localhost:8040)  │
└─────────────────────────────────────────────────────────┘

Backend Base URL:  http://localhost:8040
API Base URL:      http://localhost:8040/api/v1
Socket.IO URL:     http://localhost:8040 (ws transport)
```

### Key Backend Patterns

| Pattern | How It Works | Frontend Impact |
|---------|-------------|-----------------|
| **JWT Auth** | `accessToken` (200d) + `refreshToken` (200d) in response body & cookies | Store tokens, attach `Authorization: Bearer <token>` header |
| **Redis Caching** | Backend caches products (key-based), inventory (120s TTL), AI insights (1-24h) | Data may be stale by cache TTL; no frontend cache needed for cached endpoints |
| **Socket.IO Rooms** | 3 rooms: `admin`, `branch:{id}`, `cashier:{userId}` | Join appropriate room on login based on user role |
| **Queue + Cron** | Receipt PDFs generated async via Redis queue, processed by cron `/cron/process-queue` | Listen for `receipt_ready` socket event to know when PDF is available |
| **Role-Based Access** | `superadmin`, `admin`, `manager`, `cashier` | Show/hide UI sections based on `user.role` from login response |

---

## 2. Authentication & Session Management

### 2.1 Register (Public)

```
POST /api/v1/auth/register
```

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| fullName | string | ✅ | 2-100 chars |
| username | string | ✅ | 3-30 chars, lowercase |
| email | string | ✅ | valid email |
| password | string | ✅ | min 6 chars |
| confirmPassword | string | ✅ | must match password |

**Response** → `{ data: { user, message } }`

**Frontend Flow:**
1. Show registration form
2. Validate `password === confirmPassword` client-side
3. On success → redirect to login page (email verification pending)
4. On conflict (409) → show "Email already registered" or "Username taken"

---

### 2.2 Login (Public)

```
POST /api/v1/auth/login
```

| Field | Type | Required |
|-------|------|----------|
| email | string | ✅ |
| password | string | ✅ |

**Response** → `{ data: { user, token, refreshToken, expiresIn } }`

```json
{
  "user": {
    "userId": "...",
    "email": "...",
    "username": "...",
    "fullName": "...",
    "role": "superadmin | admin | manager | cashier",
    "avatar": "url | null",
    "branchId": "id | undefined"
  },
  "token": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "expiresIn": "200d"
}
```

**Frontend Flow:**
1. Call login API
2. Store `token` → localStorage/cookie as `accessToken`
3. Store `refreshToken` → localStorage/cookie
4. Store `user` object → Zustand auth store
5. Set Axios default header: `Authorization: Bearer ${token}`
6. **Connect Socket.IO** immediately after login (see [Section 17](#17-socketio--real-time-integration))
7. Join socket room based on role:
   - `superadmin` / `admin` → emit `join_admin_room`
   - `manager` → emit `join_admin_room` + `join_branch_room(branchId)`
   - `cashier` → emit `join_cashier_room(userId)` + `join_branch_room(branchId)`
8. Redirect based on role:
   - Admin/SuperAdmin → Dashboard
   - Manager → Branch Dashboard
   - Cashier → POS Screen

---

### 2.3 Token Refresh

```
POST /api/v1/auth/refresh-token
Body: { "refreshToken": "..." }
```

**Frontend Flow:**
1. Set up Axios interceptor: on **401 response**, call refresh endpoint
2. On success → update stored tokens, retry original request
3. On failure → log user out, redirect to login

---

### 2.4 Logout

```
POST /api/v1/auth/logout
Headers: Authorization: Bearer <token>
```

**Frontend Flow:**
1. Call logout API
2. Disconnect Socket.IO
3. Clear all stored tokens and user data
4. Redirect to login

---

### 2.5 Get Profile

```
GET /api/v1/auth/me
```

**Frontend Flow:** Call on app initialization (if token exists) to validate session and get fresh user data.

---

### 2.6 Update Profile

```
PATCH /api/v1/auth/me/update
```

| Field | Type | Optional |
|-------|------|----------|
| fullName | string | ✅ |
| phone | string | ✅ |
| bio | string | ✅ |
| location | string | ✅ |
| website | string | ✅ |
| socialLinks | object | ✅ |
| preferences | `{ theme, language, timezone, emailNotifications }` | ✅ |

---

### 2.7 Change Password

```
PATCH /api/v1/auth/me/change-password
Body: { currentPassword, newPassword, confirmPassword }
```

---

### 2.8 Upload Avatar

```
POST /api/v1/auth/me/avatar
Content-Type: multipart/form-data
Body: file (field name: "file")
```

**Frontend Flow:**
1. Use `<input type="file" accept="image/*">`
2. Create `FormData`, append file as `file` field
3. Send with `Content-Type: multipart/form-data` (let browser set boundary)
4. Backend uploads to ImgBB → returns URL
5. Update avatar in local store

---

### 2.9 Forgot / Reset Password

```
POST /api/v1/auth/forgot-password   → { email }
POST /api/v1/auth/reset-password    → { token, newPassword, confirmPassword }
```

**Frontend Flow:**
1. Forgot password → user enters email → backend sends reset link to `http://localhost:5173/reset-password?token=xxx`
2. Reset password page → extract `token` from URL query param → submit with new password

---

### 2.10 Two-Factor Authentication (2FA)

```
POST /api/v1/auth/2fa/enable   → Returns { secret, otpauthUrl }
POST /api/v1/auth/2fa/verify   → Body: { token: "123456" }
```

**Frontend Flow:**
1. Enable → show QR code from `otpauthUrl` (use `qrcode.react` library)
2. User scans with Google Authenticator / Authy
3. User enters 6-digit code → call verify endpoint
4. On success → 2FA is active

---

## 3. Branch Management

> **Access**: SuperAdmin (create/update), Admin (read), Manager (own branch)

| Endpoint | Method | Role Required |
|----------|--------|---------------|
| `/api/v1/branches` | POST | SuperAdmin |
| `/api/v1/branches` | GET | Admin+ |
| `/api/v1/branches/:id` | GET | Admin+ |
| `/api/v1/branches/:id` | PATCH | SuperAdmin |
| `/api/v1/branches/:id/performance` | GET | Admin+ |

**Create Branch Body:**
```json
{
  "name": "Branch Name",
  "address": "Full address",
  "phone": "+8801XXXXXXXXX",
  "managerId": "user-object-id"
}
```

**Frontend Flow:**
1. Branch list page → GET all branches
2. Create branch form (SuperAdmin only) → POST with manager dropdown (from staff list)
3. Branch detail page → GET by ID + GET performance
4. Performance shows: total orders, revenue, avg order value for that branch

---

## 4. Category Management

> **Access**: Admin+ for CRUD, all authenticated users for read

| Endpoint | Method | Upload | Role |
|----------|--------|--------|------|
| `/api/v1/categories` | POST | `file` (formdata) | Admin |
| `/api/v1/categories` | GET | — | Any auth |
| `/api/v1/categories/:id` | GET | — | Any auth |
| `/api/v1/categories/:id` | PATCH | `file` (formdata) | Admin |
| `/api/v1/categories/:id` | DELETE | — | Admin |

**Create/Update — FormData fields:**

| Field | Type |
|-------|------|
| name | text (required) |
| description | text (optional) |
| parentId | text (optional, for sub-categories) |
| isActive | text: "true"/"false" (optional) |
| file | file (optional, category image → ImgBB) |

**Frontend Flow:**
1. Category tree view (supports parent/child hierarchy via `parentId`)
2. Create form with image upload (use `FormData`, field name **`file`**)
3. Show category image from `image` field in response (ImgBB URL)

---

## 5. Product Management

> **Access**: Admin (CRUD), Cashier (read-only)

| Endpoint | Method | Body | Role |
|----------|--------|------|------|
| `/api/v1/products` | POST | JSON | Admin |
| `/api/v1/products` | GET | Query params | Cashier+ |
| `/api/v1/products/:id` | GET | — | Cashier+ |
| `/api/v1/products/barcode/:barcode` | GET | — | Cashier+ |
| `/api/v1/products/:id` | PATCH | JSON | Admin |
| `/api/v1/products/:id` | DELETE | — | Admin |
| `/api/v1/products/:id/images` | POST | FormData (`files`) | Admin |
| `/api/v1/products/:id/images?imageUrl=...` | DELETE | — | Admin |

**Create Product Body:**
```json
{
  "name": "Product Name",
  "sku": "SKU-001",
  "barcode": "890123456789",
  "description": "...",
  "categoryId": "category-id",
  "basePrice": 100,
  "costPrice": 80,
  "unit": "pcs|kg|ltr|box|dozen|gallon|gm|ml|packet|roll|set",
  "variants": [
    {
      "variantId": "v1",
      "name": "Variant Name",
      "sku": "SKU-001-V1",
      "barcode": "890123456790",
      "price": 100,
      "costPrice": 80,
      "attributes": { "color": "Black", "size": "128GB" }
    }
  ],
  "isBundle": false,
  "expiryTracking": true,
  "tags": ["tag1", "tag2"]
}
```

**GET Products Query Params:**
`?page=1&limit=20&search=&categoryId=&sortBy=createdAt&sortOrder=desc`

**Barcode Lookup (POS):**
1. Cashier scans barcode → `GET /products/barcode/:barcode`
2. If found → add to cart with product data
3. If 404 → show "Product not found"

**Image Upload:**
- Field name: **`files`** (multiple)
- Max 5 images per upload
- Backend uploads to ImgBB, stores URLs in `images[]` array

---

## 6. Inventory Management

> **Access**: Admin, Manager

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/inventory` | GET | All inventory (paginated, filterable) |
| `/api/v1/inventory/low-stock` | GET | Items below threshold |
| `/api/v1/inventory/movements` | GET | Stock movement history |
| `/api/v1/inventory/valuation` | GET | Total inventory value |
| `/api/v1/inventory/branch/:branchId` | GET | Branch-specific inventory (**Redis cached 120s**) |
| `/api/v1/inventory/adjust` | PATCH | Add/remove stock |
| `/api/v1/inventory/transfer` | POST | Transfer between branches |

**Adjust Inventory Body:**
```json
{
  "productId": "...",
  "branchId": "...",
  "quantity": 50,
  "type": "in | out | adjustment | damaged | expired",
  "note": "Reason for adjustment",
  "variantId": ""
}
```

**Transfer Inventory Body:**
```json
{
  "productId": "...",
  "fromBranchId": "...",
  "toBranchId": "...",
  "quantity": 10
}
```

**Frontend Flow:**
1. Inventory dashboard → show all items with stock levels + color coding (red for low stock)
2. Branch inventory view → GET `/inventory/branch/:branchId` (cached response, fast)
3. Adjust stock modal → type dropdown (in/out/damaged/expired) + quantity + note
4. Transfer modal → select source branch, target branch, product, quantity
5. Valuation card → shows total cost value vs retail value (profit potential)

**Real-Time Updates:**
- Listen for `low_stock_alert` socket event (see Section 17)
- Show toast notification: "⚠️ Low stock: {productName} ({quantity} remaining)"
- Auto-refresh inventory list when `inventory_updated` event received

---

## 7. POS — Order Creation Flow

> **This is the most critical frontend flow.** Access: Cashier

```
POST /api/v1/orders
```

### Prerequisites (must be done first):
1. ✅ User must be logged in as `cashier`
2. ✅ Cash register must be **open** (see Section 12)
3. ✅ Socket connected and joined `cashier:{userId}` room

### Order Creation Body:
```json
{
  "branchId": "cashier's-branch-id",
  "customerId": "optional-customer-id",
  "items": [
    {
      "productId": "product-id",
      "variantId": "optional-variant-id",
      "quantity": 2,
      "discount": 5,
      "discountType": "percent | fixed"
    }
  ],
  "couponCode": "SUMMER25",
  "payments": [
    { "method": "cash", "amount": 50000 },
    { "method": "card", "amount": 40000, "reference": "TXN-12345" }
  ],
  "notes": "Optional order notes"
}
```

### Backend Processing (10 Steps):
```
1. Validate cash register is open
2. Fetch products from DB (backend is price authority — ignores frontend prices)
3. Build order items with DB prices + calculate discounts
4. Validate & apply coupon code (if any)
5. Calculate grand total
6. Validate payment amount ≥ grand total
7. Check inventory & deduct stock (transactional)
8. Create order record
9. Update customer stats (totalOrders, totalSpent, loyaltyPoints)
10. Update cash register running totals
```

### Post-Processing (automatic):
- ✅ Receipt PDF queued for generation (`generate_receipt` job)
- ✅ Socket emits `new_order` to admin room and branch room
- ✅ Redis caches flushed: `analytics*`, `sales*`, `inventory:{branchId}`

### POS Frontend Flow:

```
┌─────────────────────────────────────────────────────┐
│                    POS SCREEN                        │
│                                                      │
│  ┌──────────────┐  ┌─────────────────────────────┐  │
│  │ Product Grid  │  │      Cart / Order Panel     │  │
│  │ or Search Bar │  │                             │  │
│  │              │  │  Item 1    x2    ৳1000      │  │
│  │ [Scan Barcode]│  │  Item 2    x1    ৳500       │  │
│  │              │  │                             │  │
│  │ Category Tabs │  │  Subtotal:     ৳1500       │  │
│  │              │  │  Discount:     -৳100        │  │
│  │              │  │  Coupon:       -৳200        │  │
│  │              │  │  ─────────────────          │  │
│  │              │  │  TOTAL:        ৳1200        │  │
│  │              │  │                             │  │
│  │              │  │  [Customer: Search/Add]     │  │
│  │              │  │  [Coupon Code: _____ ]      │  │
│  │              │  │                             │  │
│  │              │  │  Payment:                   │  │
│  │              │  │  Cash: [1200] Card: [0]     │  │
│  │              │  │                             │  │
│  │              │  │  [  COMPLETE ORDER  ]       │  │
│  └──────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Step-by-step:**

1. **Load Products** → `GET /products?page=1&limit=100` (or by category)
2. **Barcode Scan** → `GET /products/barcode/:barcode` → add to cart
3. **Search Customer** → `GET /customers/search?phone=...` → attach to order
4. **Validate Coupon** → `POST /coupons/validate` → `{ code, orderAmount }`
5. **Calculate totals client-side** (preview only — backend recalculates)
6. **Submit Order** → `POST /orders` with full payload
7. **On Success** → Show order confirmation with change amount
8. **Wait for Receipt** → Listen for `receipt_ready` socket event (see Section 9)
9. **Print Receipt** → Open PDF in new tab or send to thermal printer

> [!IMPORTANT]
> The backend is the **price authority**. Never trust frontend prices. The backend fetches product prices from the database and recalculates everything. Frontend prices are for display only.

---

## 8. Order Management & Refunds

> **Access**: Admin/Manager (view all), Cashier (own orders)

| Endpoint | Method | Query Params |
|----------|--------|-------------|
| `/api/v1/orders` | GET | `page, limit, status, branchId, startDate, endDate` |
| `/api/v1/orders/daily-summary` | GET | `branchId` |
| `/api/v1/orders/:id` | GET | — |
| `/api/v1/orders/:id/refund` | POST | — |

**Refund Body:**
```json
{
  "reason": "Customer returned item — defective",
  "refundAmount": 25000,
  "isPartial": true
}
```

**Refund Backend Processing:**
1. Restore inventory (stock added back)
2. Record stock movements (type: `in`)
3. Update cash register refund totals
4. Set order status to `refunded` or `partial_refund`
5. Emit `order_refunded` to admin and branch rooms

**Frontend Flow:**
1. Order list with filters (date range, status, branch)
2. Order detail page → shows items, payments, customer info
3. Refund button (Admin/Manager only) → modal with reason + partial/full toggle
4. On refund success → order card updates to show refund badge

---

## 9. Receipt / Invoice PDF Printing

### How Receipt Generation Works

```
Order Created
    │
    ▼
Queue Job Enqueued ─── type: "generate_receipt"
    │                   payload: { orderId }
    ▼
Cron Process Queue ─── GET /cron/process-queue (runs every minute on Vercel)
    │
    ▼
PDF Generated ─── 80mm thermal receipt format (226px width)
    │              Uses pdfkit library
    ▼
Receipt Stored ─── Order.receiptUrl = "data:application/pdf;base64,..."
    │
    ▼
Socket Emits ─── "receipt_ready" → cashier:{userId}
                  payload: { orderId, receiptUrl }
```

### Frontend Implementation:

**Option A: Listen for Socket Event (Recommended)**
1. After creating an order, show a "Generating receipt..." spinner
2. Listen for `receipt_ready` event on the socket
3. When received, the `receiptUrl` is a **base64 data URI** of the PDF
4. Open in iframe or new tab for printing

**Option B: Poll the Order (Fallback)**
1. After creating order, poll `GET /orders/:id` every 2-3 seconds
2. Check if `receiptUrl` field is populated
3. When available, use it

**Printing the PDF:**
```
Base64 Data URI (from receiptUrl)
    │
    ▼
Convert to Blob ─── new Blob([base64ToArrayBuffer(data)], { type: 'application/pdf' })
    │
    ▼
Create Object URL ─── URL.createObjectURL(blob)
    │
    ▼
Open in iframe/window ─── window.open(url) or iframe.src = url
    │
    ▼
Call window.print() ─── Triggers browser print dialog
```

**Receipt Contains:**
- Store name, branch name, address, phone
- Receipt number, order number, date/time
- Cashier name, customer name (if any)
- Item list with quantities, prices, discounts
- Subtotal, discounts, coupon, grand total
- Payment breakdown (cash/card/mobile)
- Change given
- "Thank you" footer

> [!TIP]
> For thermal printer integration, you can use libraries like `react-to-print` or directly render the PDF in a hidden iframe and trigger `print()`.

---

## 10. Customer Management

> **Access**: Admin (full CRUD), Cashier (create, read, search)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/customers` | POST | Create customer |
| `/api/v1/customers` | GET | List (paginated) `?page, limit, search, segment` |
| `/api/v1/customers/search` | GET | Search by phone `?phone=...` |
| `/api/v1/customers/:id` | GET | Get by ID |
| `/api/v1/customers/:id/orders` | GET | Customer order history |
| `/api/v1/customers/:id` | PATCH | Update |
| `/api/v1/customers/:id` | DELETE | Delete |

**Create Customer Body:**
```json
{
  "name": "Customer Name",
  "phone": "+8801711111111",
  "email": "optional@email.com",
  "address": "Optional address",
  "notes": "Optional notes"
}
```

**Customer Segments** (auto-assigned by cron):
- `new` — first order within 14 days
- `regular` — 2+ orders in last 30 days
- `vip` — ৳10,000+ spent, 10+ orders in 90 days
- `churn_risk` — no purchase in 60+ days

**Frontend Flow:**
1. Customer list with segment badges (color-coded)
2. Quick search by phone (cashier uses this at POS to attach customer)
3. Customer detail page → profile + order history
4. Loyalty points display (earned: ৳1 per ৳10 spent)

---

## 11. Coupon Management

> **Access**: Admin (CRUD), Cashier (validate only)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/coupons` | POST | Create coupon |
| `/api/v1/coupons` | GET | List `?page, limit` |
| `/api/v1/coupons/:id` | GET | Get by ID |
| `/api/v1/coupons/:id` | PATCH | Update |
| `/api/v1/coupons/:id` | DELETE | Delete |
| `/api/v1/coupons/validate` | POST | **Validate at POS** |

**Create Coupon Body:**
```json
{
  "code": "SUMMER25",
  "type": "percent | fixed",
  "value": 25,
  "minOrderAmount": 500,
  "maxDiscountAmount": 5000,
  "usageLimit": 100,
  "applicableCategories": [],
  "applicableProducts": [],
  "startsAt": "2025-06-01T00:00:00.000Z",
  "expiresAt": "2025-08-31T23:59:59.000Z"
}
```

**Validate at POS:**
```
POST /coupons/validate
Body: { "code": "SUMMER25", "orderAmount": 1500 }
```

**Frontend Flow (POS):**
1. Cashier enters coupon code
2. Frontend calls validate endpoint with current subtotal
3. If valid → show discount preview
4. Send `couponCode` in order payload (backend re-validates during order creation)

---

## 12. Cash Register

> **Access**: Cashier (open/close own), Admin (view all)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/cash-register/open` | POST | Open register |
| `/api/v1/cash-register/close` | POST | Close register |
| `/api/v1/cash-register/current` | GET | Get current open register |
| `/api/v1/cash-register/history` | GET | History `?page, limit, branchId, startDate, endDate` |
| `/api/v1/cash-register/:id` | GET | Get by ID |

**Open Register Body:**
```json
{
  "branchId": "branch-id",
  "openingBalance": 5000,
  "notes": "Opening morning shift"
}
```

**Close Register Body:**
```json
{
  "actualCash": 45000,
  "notes": "Closing evening shift"
}
```

> [!CAUTION]
> Orders **cannot be created** unless a cash register is open for the current cashier + branch + today. Always check register status before showing the POS screen.

**Frontend Flow:**
1. **On Cashier Login** → `GET /cash-register/current`
2. If no open register → show "Open Register" modal (enter opening balance)
3. If register is open → show POS screen
4. End of shift → "Close Register" button → enter actual cash count
5. Backend calculates discrepancy (expected vs actual)
6. Cash register running totals update automatically with each order

---

## 13. Staff Management

> **Access**: Admin, Manager

| Endpoint | Method | Query Params |
|----------|--------|-------------|
| `/api/v1/staff` | GET | `page, limit, branchId, role` |
| `/api/v1/staff/:id` | GET | — |
| `/api/v1/staff/:id/performance` | GET | `startDate, endDate` |

**Frontend Flow:**
1. Staff list with role badges and branch assignment
2. Staff detail → profile info
3. Performance metrics → orders processed, revenue generated (date-filterable)

---

## 14. Sales Reports

> **Access**: Admin, SuperAdmin only

| Endpoint | Method | Query Params |
|----------|--------|-------------|
| `/api/v1/sales/summary` | GET | `startDate, endDate, branchId` |
| `/api/v1/sales/daily` | GET | `startDate, endDate, branchId` |
| `/api/v1/sales/monthly` | GET | `startDate, endDate, branchId` |
| `/api/v1/sales/yearly` | GET | `startDate, endDate, branchId` |
| `/api/v1/sales/by-product` | GET | `startDate, endDate, branchId, limit` |
| `/api/v1/sales/by-category` | GET | `startDate, endDate, branchId` |
| `/api/v1/sales/by-staff` | GET | `startDate, endDate, branchId` |
| `/api/v1/sales/by-branch` | GET | `startDate, endDate, branchId` |
| `/api/v1/sales/top-products` | GET | `startDate, endDate, branchId, limit` |
| `/api/v1/sales/slow-movers` | GET | `startDate, endDate, branchId` |
| `/api/v1/sales/export` | GET | `startDate, endDate, branchId` |

**Frontend Flow:**
1. Reports dashboard with date range picker
2. Summary cards: total revenue, orders, avg order value, discounts
3. Charts:
   - Daily sales line chart
   - Monthly bar chart
   - Sales by category pie chart
   - Sales by staff bar chart
   - Sales by branch comparison
4. Top products table
5. Slow movers table (items to consider discounting/removing)
6. Export button → downloads CSV/Excel

---

## 15. Analytics Dashboard

> **Access**: Admin only

| Endpoint | Method | Query Params |
|----------|--------|-------------|
| `/api/v1/analytics/overview` | GET | `branchId` |
| `/api/v1/analytics/revenue-chart` | GET | `branchId, startDate, endDate, period` |
| `/api/v1/analytics/category-distribution` | GET | `branchId, startDate, endDate` |
| `/api/v1/analytics/hourly-heatmap` | GET | `branchId, startDate, endDate` |
| `/api/v1/analytics/payment-methods` | GET | `branchId, startDate, endDate` |
| `/api/v1/analytics/profit-loss` | GET | `branchId, startDate, endDate` |

**Frontend Flow:**
1. Overview cards: today's revenue, orders, customers, inventory value
2. Revenue chart: line/area chart with period toggle (daily/weekly/monthly)
3. Category distribution: pie/donut chart
4. Hourly heatmap: shows peak sales hours per day of week
5. Payment methods: bar/pie chart (cash vs card vs mobile)
6. Profit & loss: revenue - cost = profit breakdown

---

## 16. AI Insights

> **Access**: Admin only. Uses OpenRouter AI for analysis.

| Endpoint | Method | Description | Cache Duration |
|----------|--------|-------------|----------------|
| `/api/v1/ai/daily-summary` | GET | Yesterday's AI summary | 24h |
| `/api/v1/ai/demand-forecast` | GET | 7-day demand prediction | 24h (weekly) |
| `/api/v1/ai/restock-suggestions` | GET | What to reorder | 24h |
| `/api/v1/ai/slow-movers` | GET | Poor-performing products | 30 days |
| `/api/v1/ai/pricing-suggestions` | GET | Price optimization ideas | 30 days |
| `/api/v1/ai/customer-segments` | GET | Customer analytics | 24h |
| `/api/v1/ai/weekly-report` | GET | Weekly comparison report | 7 days |
| `/api/v1/ai/trending-products` | GET | Rising/falling products | 12h |
| `/api/v1/ai/trigger-analysis` | POST | Force regeneration | — |

**Trigger Manual Analysis Body:**
```json
{
  "type": "daily_summary | demand_forecast | restock_suggestion | slow_mover | pricing_suggestion | customer_segment | weekly_report | trend_report",
  "branchId": "optional"
}
```

**Frontend Flow:**
1. AI Dashboard page with cards for each insight type
2. Each card shows summary + "generated at" timestamp
3. "Refresh" button → calls `trigger-analysis` (clears cache and regenerates)
4. Listen for `ai_insight_ready` socket event → auto-refresh the relevant card
5. Display AI-generated text summaries, charts from numeric data, and tables for lists

**Data Shape Examples:**

- **Daily Summary** → `{ summary (AI text), salesData, topItems, paymentBreakdown }`
- **Demand Forecast** → `{ forecast: [{ productName, predictedDemand7Days, confidence, trend, suggestion }] }`
- **Restock Suggestions** → `{ restockList: [{ productName, currentQty, suggestedOrderQty, priority, daysUntilStockout }] }`
- **Trending Products** → `{ rising: [...], falling: [...], trending: [{ name, recentQty, growthPercent, trend }] }`

---

## 17. Socket.IO — Real-Time Integration

### Connection Setup

```
Connect to: http://localhost:8040
Transport: websocket (with polling fallback)
Credentials: true
```

### When to Connect
- Immediately after successful login
- Reconnect on token refresh

### Room System

| Room | Who Joins | How to Join |
|------|-----------|-------------|
| `admin` | SuperAdmin, Admin | Emit: `join_admin_room` (no args) |
| `branch:{branchId}` | Manager, Cashier of that branch | Emit: `join_branch_room`, arg: `branchId` |
| `cashier:{userId}` | Individual Cashier | Emit: `join_cashier_room`, arg: `userId` |

### Events to Listen For

| Event | Payload | Sent To | When | Frontend Action |
|-------|---------|---------|------|-----------------|
| `new_order` | `{ orderId, orderNumber, grandTotal, cashierId }` | admin, branch | Order created | Show toast, update dashboard |
| `order_refunded` | `{ orderId, refundAmount, reason }` | admin, branch | Order refunded | Show toast, update order list |
| `inventory_updated` | `{ productId, branchId, quantity }` | admin, branch | Stock adjusted | Refresh inventory view |
| `low_stock_alert` | `{ productId, quantity, threshold, branchId }` | admin, branch | Stock below threshold | Show warning toast/badge |
| `receipt_ready` | `{ orderId, receiptUrl }` | cashier | PDF generated | Enable print button |
| `ai_insight_ready` | `{ type, period, summary? }` | admin | AI analysis complete | Refresh AI dashboard card |
| `cash_register_alert` | varies | admin | Register events | Update register status |
| `daily_report_ready` | varies | admin | Daily cron complete | Refresh reports |

### Heartbeat
- Emit `ping` periodically → receive `pong` with `{ timestamp }`
- Use this to detect connection health

---

## 18. Recommended Implementation Order

> Implement in this exact sequence. Each step builds on the previous.

### Phase 1: Foundation (Must Have First)

| # | Module | Why First |
|---|--------|-----------|
| 1 | **Auth (Login/Register/Logout)** | Everything requires authentication |
| 2 | **Axios + Token Interceptor** | All API calls need auth headers + auto-refresh |
| 3 | **Socket.IO Connection** | Connect after login, join rooms |
| 4 | **Route Guards** | Protect pages by role |
| 5 | **Branch Management** (read) | Most features need branch context |

### Phase 2: Core Data Setup (Admin)

| # | Module | Depends On |
|---|--------|------------|
| 6 | **Category CRUD** | — |
| 7 | **Product CRUD** | Categories (for `categoryId`) |
| 8 | **Customer CRUD** | — |
| 9 | **Inventory Adjust** | Products + Branches |
| 10 | **Coupon CRUD** | Categories, Products (for applicable filters) |

### Phase 3: POS (Cashier Experience)

| # | Module | Depends On |
|---|--------|------------|
| 11 | **Cash Register Open/Close** | Branch + Auth |
| 12 | **POS Screen** (product grid, cart, barcode scan) | Products + Inventory |
| 13 | **Customer Search** (at POS) | Customers |
| 14 | **Coupon Validate** (at POS) | Coupons |
| 15 | **Order Creation** | All of above |
| 16 | **Receipt PDF Print** | Orders + Socket `receipt_ready` |

### Phase 4: Reporting & Analytics (Admin)

| # | Module | Depends On |
|---|--------|------------|
| 17 | **Order List + Detail + Refund** | Orders |
| 18 | **Sales Reports** | Orders (needs data) |
| 19 | **Analytics Dashboard** | Orders (needs data) |
| 20 | **Staff Performance** | Auth + Orders |

### Phase 5: AI & Advanced (Admin)

| # | Module | Depends On |
|---|--------|------------|
| 21 | **AI Insights Dashboard** | Sales data + Socket `ai_insight_ready` |
| 22 | **Low Stock Alerts** | Inventory + Socket `low_stock_alert` |
| 23 | **Profile Settings + 2FA** | Auth |
| 24 | **Branch Performance** | Branches + Orders |

---

## Quick Reference: All Endpoints by Role

### 🟢 Cashier Can Access
- Auth: login, logout, me, update profile, change password, avatar, 2FA
- Products: GET all, GET by ID, GET by barcode
- Customers: create, search, GET by ID, GET orders
- Coupons: validate
- Cash Register: open, close, current
- Orders: create, GET all (own), GET by ID, daily summary

### 🔵 Manager Can Access
- Everything Cashier can +
- Inventory: all operations
- Orders: refund
- Staff: GET all, GET by ID, performance

### 🟠 Admin Can Access
- Everything Manager can +
- Categories: full CRUD
- Products: full CRUD + image upload
- Customers: full CRUD
- Coupons: full CRUD
- Sales Reports: all
- Analytics: all
- AI Insights: all
- Staff: all

### 🔴 SuperAdmin Can Access
- Everything Admin can +
- Branches: create, update
- Cron: all endpoints (with `x-cron-secret` header)

---

> **Note**: This guide maps to `sales-pilot-be` at commit state as of Feb 23, 2026. Backend runs on port **8040** with base API path `/api/v1`.
