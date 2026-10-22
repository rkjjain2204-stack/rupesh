# Jain Kirana Stores — Store Owner & Handover Operations Guide

Welcome to your production-ready digital storefront for **Jain Kirana Stores** (जैन किराना स्टोर्स), Dhimar Para, Brahman Para, Durg, Chhattisgarh.

---

## 1. Quick Store Owner Counter Portal

You can manage incoming orders, track customer enquiries, update notes, and export data directly from the website:

1. Scroll to the footer or click **Store Owner Counter Portal** (Lock icon).
2. Enter the store passcode (Default: `jainkirana2026`) or sign in with your Google Account (`rkj.jain2204@gmail.com`).
3. From the portal you can:
   - **View Enquiries:** Filter by `New`, `Contacted`, or `Resolved`.
   - **1-Click WhatsApp Reply:** Prepopulates a polite response with the customer's name and requested product.
   - **1-Click Call:** Dial the customer's number directly.
   - **Internal Notes:** Record pickup times or customer preferences (e.g., *"Customer picking up 500g Chai Masala Friday 5 PM"*).
   - **Export to Excel / CSV:** Click **Download CSV** at the top right to download a spreadsheet for record-keeping.
   - **Manage Products:** Update pack prices, in-stock/out-of-stock badges, and add new products directly from the **Product Catalogue Manager** tab.

---

## 2. How to Update Product Prices & Pack Sizes

### Option A: Via the Web Admin Portal (Instant & Non-Technical)
1. Open the **Store Owner Counter Portal** from the footer.
2. Select the **Catalogue & Pricing** tab.
3. Find the product (e.g. *Special In-House Garam Masala*).
4. Click on any price (e.g. `₹140` for 100g), change the number, and tap **Save Changes**. The price updates immediately across the website and in WhatsApp enquiry buttons.

### Option B: In Code (`src/data/initialData.ts`)
1. Open `src/data/initialData.ts`.
2. Locate `INITIAL_PRODUCTS`.
3. In the `packs` array of each product, update `price` or add a new pack:
   ```ts
   packs: [
     { size: '50g', price: 75, inStock: true },
     { size: '100g', price: 140, inStock: true },
     { size: '250g', price: 330, inStock: true },
   ],
   ```

---

## 3. How to Add a New Product

In `src/data/initialData.ts`, add a new object to `INITIAL_PRODUCTS`:

```ts
{
  id: 'thandai-masala',
  name: 'Special Handcrafted Thandai Masala',
  hindiName: 'ठंडाई मसाला मिश्रण',
  category: 'signature-masala',
  badge: 'Seasonal Special',
  isStorePrepared: true,
  image: '/src/assets/images/hero_spices_masalas_1792611237446.jpg',
  shortDescription: 'Stone-ground cooling blend of almonds, pistachios, fennel, poppy seeds, and green cardamom.',
  fullDescription: 'Crafted traditionally with premium California almonds, green cardamom, fennel seeds, and black pepper. Perfect for summer drinks, festive Holi, and milk.',
  packs: [
    { size: '100g', price: 180, inStock: true },
    { size: '250g', price: 420, inStock: true },
  ],
  ingredients: ['Almonds (Badam)', 'Fennel (Saunf)', 'Green Cardamom (Elaichi)', 'Black Pepper (Kali Mirch)', 'Poppy Seeds (Khus Khus)'],
  certificationsOrClaims: 'Prepared In-House · 100% Pure Nuts & Spices',
  storageInstructions: 'Store in an airtight jar in a cool pantry or refrigerator.',
  isSignature: true,
}
```

---

## 4. How to Update Store Photos

1. Add your photo to `src/assets/images/` (e.g. `shop_counter_front.jpg`).
2. In `src/data/initialData.ts`, update the `IMAGES` constant or the specific product's `image` property:
   ```ts
   export const IMAGES = {
     hero: '/src/assets/images/shop_counter_front.jpg',
     // ...
   };
   ```
3. Run `npm run build` to package the optimized image.

---

## 5. How to Change Store Hours or Address

Open `src/data/initialData.ts` and locate `INITIAL_CONFIG`:

```ts
export const INITIAL_CONFIG: StoreConfig = {
  storeName: 'Jain Kirana Stores',
  phone: '+919811234567',
  whatsappNumber: '919811234567',
  address: {
    line1: 'Dhimar Para, Brahman Para',
    line2: 'Near Brahman Para Chowk',
    locality: 'Brahman Para, Durg',
    city: 'Durg',
    state: 'Chhattisgarh',
    pincode: '491001',
    googleMapsUrl: 'https://share.google/s07ftw5vKGj9HbyvP',
    directionsNote: 'Accessible in ~7-10 minutes from Durg Junction Railway Station and Indira Market.',
  },
  timings: {
    morning: '9:30 AM – 2:00 PM',
    evening: '4:00 PM – 8:30 PM',
    days: 'Monday – Saturday: 9:30 AM – 8:30 PM | Sunday: 10:00 AM – 3:00 PM',
    statusNote: 'Open Today',
  },
  // ...
};
```

---

## 6. Data Backup & Security

* **Local JSON Backup:** Enquiries are automatically written to `data/enquiries.json` on the server.
* **Cloud Database Backup:** Enquiries sync to Cloud Firestore collection `enquiries` in `ai-studio-jainkiranastores-60f21115-e429-4f6d-b4e8-f09c600b1a07`.
* **Spreadsheet Export:** From the Owner Portal, click **Download CSV** at any time to save an offline copy.
* **Passcode Security:** To change the store owner passcode, set the environment variable `ADMIN_PASSCODE` in your hosting dashboard or `.env` file (e.g. `ADMIN_PASSCODE=YourSecureKey2026`).

---

## 7. Connecting a Custom Domain (e.g. `jainkirana.in` or `jainkiranastores.com`)

1. **Purchase Domain:** Register your domain through any accredited registrar (GoDaddy, Google Domains / Squarespace, Namecheap, BigRock).
2. **DNS Configuration:**
   * **A Records:** Add `@` pointing to your host's IP address.
   * **CNAME Record:** Add `www` pointing to your application domain.
3. **SSL / HTTPS:** Cloud Run and Vercel automatically provision a free Let's Encrypt SSL certificate once DNS propagates (usually 15–60 minutes).
4. **Google Search Console & Maps:** Update the canonical URL and Google Business Profile website link to your custom domain.

---

## 8. Remaining External Setup Checklist

1. **Physical Postcard / Video Verification for Google Business Profile:**
   - Check the physical mailbox at Dhimar Para, Brahman Para, Durg for the India Post verification letter containing your 5-digit code, or complete the 1-minute video verification.
2. **Verified Store WhatsApp Number:**
   - Update `phone` and `whatsappNumber` in `INITIAL_CONFIG` to your official store SIM number once configured.
3. **Custom Domain:**
   - Connect your own domain for permanent brand identity.
