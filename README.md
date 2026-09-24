# MAARO Bihar Clothing — Next.js Commerce Demo

A design-forward e-commerce starter for **MAARO BIHAR Clothing**, built around the brand's positioning: **“Delhi ka rate, ab Patna mein.”**

This version is intentionally a **working presentation + commerce-flow demo** rather than a production marketplace. It includes the complete frontend shopping experience, local catalog management for demo purposes, a server-side order webhook endpoint, and a WhatsApp handoff for order verification.

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Plain CSS with CSS custom properties (no UI kit dependency)
- Browser `localStorage` for the demo cart and Catalog Studio
- Next.js Route Handler for order handoff
- Vercel-compatible deployment

## Pages

- `/` — brand-led homepage with hero, story, featured stock, wholesale section, address/contact and footer.
- `/shop` — searchable-by-category style catalog with sorting, product quick-view, variants and cart.
- `/admin` — **Catalog Studio**. This is deliberately browser-local in the demo so a client can add product information and upload preview images without setting up a database.
- `/api/order` — server-side order intake route. If `ORDER_WEBHOOK_URL` is present, the complete order JSON is POSTed to it.

## Order flow

1. Customer opens `/shop`.
2. Customer chooses a product, size and colour.
3. Customer adds it to the bag.
4. Customer opens the bag and selects **Place Order on WhatsApp**.
5. Customer enters name, phone, address, city, pincode and optional note.
6. Browser POSTs the structured order to `/api/order`.
7. The route optionally forwards the order to `ORDER_WEBHOOK_URL`.
8. Browser redirects to the store's WhatsApp number with a formatted order message.
9. MAARO staff verify stock, final delivery charge and payment/delivery details directly with the customer.

No online payment gateway is included in this first presentation build, which matches the requested manual-verification workflow.

## Environment variables

Copy `.env.example` to `.env.local`.

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=917070080808
ORDER_WEBHOOK_URL=
ORDER_WEBHOOK_SECRET=
NEXT_PUBLIC_STORE_PHONE=+91 70700 80808
NEXT_PUBLIC_STORE_EMAIL=orders@maaro-bihar-clothing.example
```

### Webhook payload

The POST body is JSON shaped approximately like this:

```json
{
  "id": "MB-20260923-ABCDE",
  "createdAt": "2026-09-23T17:30:00.000Z",
  "customer": {
    "name": "Customer Name",
    "phone": "+91XXXXXXXXXX",
    "address": "House / street / landmark",
    "city": "Patna",
    "pincode": "801105",
    "note": "Optional note"
  },
  "items": [
    {
      "id": "mb-heavy-tee",
      "name": "Heavy Cotton Tee",
      "category": "T-Shirts",
      "price": 149,
      "quantity": 2,
      "size": "L",
      "color": "Black"
    }
  ],
  "total": 298
}
```

The webhook receives the optional `x-maaro-secret` header when `ORDER_WEBHOOK_SECRET` is set.

## Vercel deployment

1. Push the project to GitHub.
2. Import the repo into Vercel.
3. Add the environment variables from `.env.local` in **Project Settings → Environment Variables**.
4. Deploy.

The site works without a webhook. Adding a webhook is recommended before a real launch.

## Recommended production upgrade

The current Catalog Studio uses browser storage. That is perfect for a presentation build but is **not a real multi-device admin CMS**. For the production commerce version, replace the local storage layer with:

- **Supabase Postgres** for products, variants, orders and customer/order state.
- **Supabase Storage** for product images.
- A protected `/admin` route with authentication.
- Server-side stock checks before accepting an order.
- Optional Razorpay or Cashfree once online payments are required.
- Order status fields such as `pending`, `confirmed`, `packed`, `out_for_delivery`, `delivered`, `cancelled`.
- WhatsApp Business API or an automation provider if the store eventually needs automated transactional messages instead of the current click-to-WhatsApp flow.

## Editing the catalog demo

For the first client presentation, the easiest workflow is:

1. Open `/admin`.
2. Add a product name, category, price, sizes and colours.
3. Upload a product photo or paste an image URL.
4. Click **Add to Demo Catalog**.
5. Open `/shop` to see the item immediately.

These custom items live only in that browser's local storage. Clearing site data removes them.

## Design system

The UI intentionally avoids generic “AI startup” styling. The visual system uses:

- warm paper / rice backgrounds
- ink-black typography
- vermilion red as the regional brand accent
- restrained brass-like neutrals
- sharp Swiss-inspired grids and borders
- serif Devanagari / editorial accents for Hindi brand lines
- compact uppercase metadata
- short, fast transitions rather than long animation sequences

The central bilingual brand line is:

> **दिल्ली का रेट. अब पटना में.**

## Image licensing note

The demo uses remote Unsplash image URLs as temporary visual placeholders. Replace them with MAARO's own product/store photography before production launch.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production build:

```bash
npm run build
npm start
```

## Project structure

```text
app/
  admin/page.tsx
  api/order/route.ts
  shop/page.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  cart-drawer.tsx
  catalog-studio.tsx
  home-page.tsx
  icons.tsx
  order-modal.tsx
  product-card.tsx
  shop-page.tsx
  site-header.tsx
  store-provider.tsx
lib/
  products.ts
  utils.ts
types/
  catalog.ts
```
