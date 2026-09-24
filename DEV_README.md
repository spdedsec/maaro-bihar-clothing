# MAARO BIHAR CLOTHING — Developer Handoff README

This file is the **developer-facing handoff**, separate from the client-facing `README.md`.

## 01 — Goal

The presentation build should demonstrate that MAARO can become a real local commerce destination rather than a brochure website.

The intended product journey is:

`Landing → Catalog → Product / Variant → Cart → Customer Details → API webhook → WhatsApp → human confirmation → delivery`

The build intentionally does not lock MAARO into a payment provider or database yet.

## 02 — Non-negotiable UX direction

Do not replace the current visual direction with a generic template.

Keep:

- minimal Swiss/editorial layout
- strong typographic hierarchy
- warm paper background
- black / vermilion / neutral palette
- Hindi + English brand voice
- sharp rectangular components
- short, useful motion
- mobile-first catalog interaction
- direct WhatsApp ordering

Avoid:

- excessive gradients
- glassmorphism
- oversized rounded cards
- blue/purple “SaaS” styling
- long entrance animations
- cluttered mega menus

## 03 — Data model to use in production

### `products`

```text
id
slug
name
category
description
price
compare_at_price
active
featured
created_at
updated_at
```

### `product_variants`

```text
id
product_id
size
color
sku
stock_qty
```

### `product_images`

```text
id
product_id
storage_path
sort_order
alt_text
```

### `orders`

```text
id
customer_name
customer_phone
address_line
city
pincode
note
subtotal
delivery_fee
total
status
created_at
updated_at
```

### `order_items`

```text
id
order_id
product_id
product_name_snapshot
unit_price_snapshot
quantity
size
color
```

Take price/name snapshots into `order_items`; do not rely on future product edits when displaying historical orders.

## 04 — Supabase migration plan

### Storage

Create:

```text
maaro-product-images
```

Keep public product image URLs if the store's content is public. If the admin must also store private operational files, create a separate private bucket.

### Auth

Protect `/admin` with Supabase Auth. Do not use a browser-local secret or a hard-coded admin password.

### RLS

Customers should not receive arbitrary write access to the products table. Product mutations should be limited to authenticated admin users.

A safe pattern is:

```text
public users → read active products
admin users → CRUD catalog
public order endpoint → insert validated order through server route
admin users → read/update orders
```

Validate every order on the server. Never trust prices, totals, or stock quantities sent by the browser.

## 05 — Order route upgrade

Current route: `app/api/order/route.ts`.

Current behavior:

- validates basic customer fields
- creates a server-side order reference
- forwards payload to optional webhook
- returns JSON

Production behavior should also:

1. load current product + variant records
2. confirm variant exists
3. confirm stock is available
4. calculate subtotal on the server
5. create order + order_items transactionally
6. decrement/reserve stock
7. send notification
8. return order id/status

The browser can still be redirected to WhatsApp after this route succeeds.

## 06 — Automation options

### n8n / Make

Use `ORDER_WEBHOOK_URL` to receive order JSON. Route it to:

`Webhook → Google Sheet / Supabase → WhatsApp/email notification → internal log`

### Email

Do not send mail directly from client-side React. Keep mail delivery server-side using Resend, Postmark, Amazon SES, or the client's existing provider.

### WhatsApp

The current build uses `wa.me` click-to-chat because it requires no Business API onboarding. A later upgrade can replace this with the WhatsApp Business Cloud API or an approved provider.

## 07 — Image handling

Current demo images are remote URLs and browser data URLs.

Production workflow:

```text
Admin selects image
→ client validates file type + size
→ server/storage upload
→ Supabase Storage URL
→ product_images row
→ product page reads image URL
```

Add resizing/compression before storage. Product-card images should not ship as 6–10 MB originals.

## 08 — SEO

Before launch add:

- `metadataBase`
- canonical URLs
- Open Graph image
- Twitter card metadata
- `sitemap.ts`
- `robots.ts`
- Product JSON-LD
- LocalBusiness JSON-LD
- Organization JSON-LD

Recommended title pattern:

`MAARO BIHAR Clothing | Men’s Wear & Wholesale Rates in Patna`

## 09 — Local business content

The current presentation copy uses the business information supplied for the project:

**Location**

Above Rudra Marriage Hall, Tribhuvan Modh
Mustafapur / Raut City / Saguna More Road
Jamsaut, Danapur, Patna, Bihar — 801105

**Phone**

+91 70700 80808
+91 96312 34524
+91 82925 05050

Use verified business details again before production launch, especially address spelling and social URLs.

## 10 — Content replacement checklist

Before showing the final website publicly:

- replace all placeholder Unsplash images
- add MAARO's own logo/mark if final logo differs
- replace sample product prices with verified live prices
- remove demo catalog warning from customer-facing page if desired
- connect real social URLs
- connect actual order inbox/webhook
- verify WhatsApp destination number
- confirm delivery areas and delivery fee policy
- add privacy policy / terms / refund policy
- configure analytics only after client approval

## 11 — Testing checklist

### Customer

- `/` works without JS errors
- `/shop` filters correctly
- sorting does not mutate the base catalog unexpectedly
- product modal changes size and color
- add-to-cart creates a distinct line for distinct variant combinations
- quantity controls work at 1 and above
- cart survives a page refresh
- light/dark mode survives refresh
- order form validates
- `/api/order` returns a usable order id
- WhatsApp text contains every item, size, color, quantity, customer and address field

### Mobile

Test at minimum around:

- 360 × 800
- 390 × 844
- 430 × 932

### Production

- webhook secret configured
- no sensitive keys exposed through `NEXT_PUBLIC_*`
- Supabase RLS verified if added
- image upload constraints verified
- order total calculated on server
- stock race conditions handled

## 12 — Recommended next sprint

The first production sprint should convert the current demo into:

`Supabase catalog + Supabase Storage + protected admin + server-side stock validation + order database + order dashboard + WhatsApp notification`

Only after that should online payments, coupons, customer accounts and advanced analytics be layered in.

## 13 — Git conventions

Suggested branches:

```text
main
staging
feature/supabase-catalog
feature/admin-auth
feature/order-workflow
feature/whatsapp-api
```

Use conventional commits where practical:

```text
feat: add supabase product catalog
fix: validate server-side order totals
chore: update production metadata
```
