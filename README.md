# Jain Kirana Stores — Official Website & Lead Management

A production-ready web platform for **Jain Kirana Stores**, a trusted Indian neighbourhood grocery store and artisanal in-house spice/masala brand with 20 years of heritage.

> **Core Philosophy:** "Har Rasoi Ka Apna Bharosa"  
> Authentic Indian taste, in-house roasted & ground masalas, pure unadulterated Salem turmeric, stemless chillies, honest weights, and dependable neighbourhood service.

---

## 1. Features Overview

- **Authentic Brand Experience:** Built with a palette of deep forest green (`#143826`), warm ivory (`#FAF8F5`), turmeric gold (`#D49B28`), and rich chilli red highlights. Pairings of editorial display serif with readable modern typography.
- **Dedicated Signature Product Catalogue:**
  - In-House Garam Masala (slow-roasted 12 whole spices coarsely ground)
  - Handcrafted Chai Masala / Kadha Blend (dry ginger, green cardamom, cinnamon, cloves)
  - Salem Pure Haldi Powder (Curcuma longa with high natural curcumin)
  - Lal Mirch Powder (stemless dried chillies with zero added dye)
  - Dhania Powder (slow dry-roasted coriander seeds)
  - Selected Assam CTC & Orthodox Leaf Chai Patti
  - Whole Spices & Groceries (Sabut Jeera, Asli Hing, Malabar Black Pepper, Dry Fruits)
- **Interactive Pack Size & Pricing Engine:** Instant switching between 50g, 100g, 250g, 500g, and 1kg pack sizes with live pricing updates.
- **One-Tap WhatsApp & Call Order Integration:** Prefills WhatsApp messages with the specific product name, pack weight, and price.
- **Protected Shop Owner Counter Portal (`/admin` / lock icon in footer):**
  - Secured via owner passcode (default: `jainkirana2026`).
  - Search, filter, and track leads through `New` → `Contacted` → `Resolved`.
  - Add counter notes (e.g., "Customer pickup Friday 11 AM").
  - 1-click **Download CSV** for Excel or offline bookkeeping.
- **Local SEO & Google Business Integration:**
  - Schema.org structured data (`GroceryStore`, `LocalBusiness`, `OfferCatalog`, `Product`).
  - Native XML sitemap (`/sitemap.xml`) and crawler instructions (`/robots.txt`).
  - Consistent NAP (Name, Address, Phone) for Durg / Chhattisgarh local search ranking.
  - Live dynamic open/closed badge calculated against store shift timings.

---

## 2. How to Run Locally

### Prerequisites
- Node.js (version 18 or higher)
- npm

### Steps
1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 3. How to Deploy to Production

### Option A: Google Cloud Run (Recommended for AI Studio)
The app is fully configured for Node.js container environments. Run:
```bash
npm run build
npm start
```

### Option B: Node.js VPS / Railway / Render
1. Set the environment variable:
   ```env
   NODE_ENV=production
   PORT=3000
   ADMIN_PASSCODE="your_own_secret_passcode"
   ```
2. Build command:
   ```bash
   npm run build
   ```
3. Start command:
   ```bash
   npm start
   ```

---

## 4. How to Connect a Custom Domain (e.g. `jainkiranastores.com`)

1. Purchase your domain from any registrar (GoDaddy, Namecheap, Google Domains/Squarespace).
2. Go to your DNS management panel.
3. Add the following DNS records pointing to your host:
   - **Type A Record:** Host `@` → Points to your server IP address
   - **CNAME Record:** Host `www` → Points to your app domain
4. Enable free automatic SSL (HTTPS) in your hosting dashboard.

---

## 5. How to Update Products, Prices, and Photos

All product data and store configurations are centralized in simple, human-readable TypeScript files:

1. **Store Profile & Timings:** Edit `src/data/initialData.ts`:
   - Change `storeName`, `phone`, `whatsappNumber`, `address`, or `timings`.
2. **Product Prices & Weights:** Edit the `INITIAL_PRODUCTS` array in `src/data/initialData.ts`:
   - Add new pack sizes or adjust prices under `packs: [{ size: '100g', price: 140, inStock: true }]`.
   - Update descriptions or ingredients as recipes evolve.
3. **Product Photos:** Place new JPG/PNG photos into `src/assets/images/` and reference their paths in `initialData.ts`.

---

## 6. How to Back Up Customer Enquiries

1. Open the website and scroll to the footer.
2. Click **Store Owner Counter Portal**.
3. Enter your passcode (`jainkirana2026`).
4. Click the **Download CSV** button in the top right.
5. Your browser will download an Excel-ready `.csv` file containing all leads, timestamps, phone numbers, requested items, and counter notes.

---

## 7. How to Verify After Deployment

1. **Test Navigation:** Verify that clicking "Signature Masalas", "Our Story", "Store & Timings", and "Enquiry" scrolls smoothly to each section.
2. **Test WhatsApp Link:** Click "WhatsApp Order" on mobile or desktop to confirm the chat opens with prefilled text.
3. **Test Lead Submission:** Submit a test enquiry on the contact form, open the Admin Drawer, and confirm that the lead appears instantly.
4. **Test Rich Results / SEO:** Paste your live domain into the [Google Rich Results Test](https://search.google.com/test/rich-results) to verify the `GroceryStore` Schema.org data.
