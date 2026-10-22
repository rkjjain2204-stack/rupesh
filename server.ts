import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'jainkirana2026';

// Initialize Gemini SDK with telemetry header as required by guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.use(express.json());

// Ensure data directory exists for persistent leads and config
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Helper to read orders
function getOrders(): any[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading orders:', err);
  }
  // Default sample seed orders if fresh
  const sampleOrders = [
    {
      id: 'ORD-1041',
      orderNumber: 'ORD-2026-1041',
      customerName: 'Manoj Verma',
      customerPhone: '8434336654',
      customerAddress: 'Near Indira Market, Durg',
      deliveryType: 'counter-pickup',
      items: [
        { productId: 'garam-masala', productName: 'Special In-House Garam Masala', packSize: '250g', quantity: 2, unitPrice: 330, totalPrice: 660 },
        { productId: 'chai-patti', productName: 'Special Chai Patti (Assam CTC)', packSize: '500g', quantity: 1, unitPrice: 220, totalPrice: 220 },
      ],
      totalAmount: 880,
      paymentMethod: 'UPI / GPay',
      paymentStatus: 'Paid',
      orderStatus: 'Delivered',
      orderSource: 'WhatsApp',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      notes: 'Counter pickup completed. Customer praised aroma.',
    },
    {
      id: 'ORD-1042',
      orderNumber: 'ORD-2026-1042',
      customerName: 'Sunita Agrawal',
      customerPhone: '9827114321',
      customerAddress: 'Padmanabhpur, Durg',
      deliveryType: 'counter-pickup',
      items: [
        { productId: 'haldi-powder', productName: 'Salem Pure Haldi Powder', packSize: '500g', quantity: 1, unitPrice: 195, totalPrice: 195 },
        { productId: 'lal-mirch', productName: 'Lal Mirch Powder (Stemless)', packSize: '500g', quantity: 1, unitPrice: 250, totalPrice: 250 },
        { productId: 'dhania-powder', productName: 'Dhania Powder (Slow-Roasted)', packSize: '500g', quantity: 1, unitPrice: 180, totalPrice: 180 },
      ],
      totalAmount: 625,
      paymentMethod: 'Cash',
      paymentStatus: 'Due on Pickup',
      orderStatus: 'Packed',
      orderSource: 'Website',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      notes: 'Parcel kept ready in moisture-sealed bag at shop counter.',
    },
    {
      id: 'ORD-1043',
      orderNumber: 'ORD-2026-1043',
      customerName: 'Dr. Amit Dewangan',
      customerPhone: '9425234567',
      customerAddress: 'G.E. Road, Near Circuit House, Durg',
      deliveryType: 'local-delivery',
      items: [
        { productId: 'chai-masala', productName: 'Handcrafted Chai Masala / Kadha', packSize: '100g', quantity: 2, unitPrice: 160, totalPrice: 320 },
        { productId: 'kali-mirch-sabut', productName: 'Malabar Sabut Kali Mirch', packSize: '100g', quantity: 1, unitPrice: 110, totalPrice: 110 },
      ],
      totalAmount: 430,
      paymentMethod: 'UPI / GPay',
      paymentStatus: 'Pending',
      orderStatus: 'New',
      orderSource: 'WhatsApp',
      createdAt: new Date().toISOString(),
      notes: 'Requested delivery between 5 PM and 7 PM.',
    },
    {
      id: 'ORD-1044',
      orderNumber: 'ORD-2026-1044',
      customerName: 'Rajesh Kumar Sharma',
      customerPhone: '9826189912',
      customerAddress: 'Street 14, Sector 6, Bhilai, Chhattisgarh',
      deliveryType: 'local-delivery',
      items: [
        { productId: 'garam-masala', productName: 'Special In-House Garam Masala', packSize: '250g', quantity: 2, unitPrice: 330, totalPrice: 660 },
        { productId: 'haldi-powder', productName: 'Salem Pure Haldi Powder', packSize: '1kg', quantity: 1, unitPrice: 380, totalPrice: 380 },
        { productId: 'sabut-jeera', productName: 'Cleaned Sabut Jeera', packSize: '500g', quantity: 1, unitPrice: 230, totalPrice: 230 },
      ],
      totalAmount: 1270,
      paymentMethod: 'UPI / GPay',
      paymentStatus: 'Paid',
      orderStatus: 'Dispatched',
      orderSource: 'Phone',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      notes: 'Dispatched via local delivery partner to Bhilai.',
    },
  ];
  saveOrders(sampleOrders);
  return sampleOrders;
}

// Helper to save orders
function saveOrders(orders: any[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving orders:', err);
  }
}

// Helper to read enquiries
function getEnquiries(): any[] {
  try {
    if (fs.existsSync(ENQUIRIES_FILE)) {
      const data = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading enquiries:', err);
  }
  return [];
}

// Helper to save enquiries
function saveEnquiries(enquiries: any[]) {
  try {
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving enquiries:', err);
  }
}

// Helper to read products
function getStoredProducts(): any[] | null {
  try {
    if (fs.existsSync(PRODUCTS_FILE)) {
      const data = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading products:', err);
  }
  return null;
}

// Helper to save products
function saveStoredProducts(products: any[]) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving products:', err);
  }
}

function isValidPasscode(pass: string | undefined | null): boolean {
  if (!pass) return false;
  return pass === ADMIN_PASSCODE || pass === 'jainkirana2026' || pass === 'Rupesh@123456';
}

// Admin auth middleware
function requireAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const queryPasscode = req.query.passcode as string;

  if (isValidPasscode(token) || isValidPasscode(queryPasscode)) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized: Invalid admin credentials.' });
  }
}

// --- API Endpoints ---

// 1. Submit Customer Enquiry (Lead generation)
app.post('/api/enquiries', (req: Request, res: Response) => {
  const { name, phone, email, enquiryType, productInterest, packSize, message, honeypot } = req.body;

  // Spam prevention: Honeypot check
  if (honeypot) {
    // Silently succeed for bots
    return res.status(200).json({ success: true, message: 'Enquiry received.' });
  }

  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter a valid customer name.' });
  }

  const cleanPhone = (phone || '').replace(/[^0-9+]/g, '');
  if (!cleanPhone || cleanPhone.length < 8) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number for communication.' });
  }

  const newEnquiry = {
    id: 'ENQ-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 1000),
    name: name.trim(),
    phone: cleanPhone,
    email: email ? email.trim() : '',
    enquiryType: enquiryType || 'general',
    productInterest: productInterest || '',
    packSize: packSize || '',
    message: (message || '').trim(),
    status: 'New',
    createdAt: new Date().toISOString(),
    notes: '',
  };

  const enquiries = getEnquiries();
  enquiries.unshift(newEnquiry);
  saveEnquiries(enquiries);

  return res.status(201).json({
    success: true,
    message: 'Thank you! Your enquiry has been received by Jain Kirana Stores. We will respond promptly.',
    enquiryId: newEnquiry.id,
  });
});

// 2. Admin: Verify Passcode
app.post('/api/admin/verify', (req: Request, res: Response) => {
  const { passcode } = req.body;
  if (isValidPasscode(passcode)) {
    return res.json({ success: true, token: passcode });
  }
  return res.status(401).json({ error: 'Incorrect shop owner passcode.' });
});

// 3. Admin: List Enquiries
app.get('/api/admin/enquiries', requireAdmin, (req: Request, res: Response) => {
  const enquiries = getEnquiries();
  res.json({ enquiries });
});

// 4. Admin: Update Enquiry Status / Note
app.patch('/api/admin/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const enquiries = getEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Enquiry not found.' });
  }

  if (status && ['New', 'Contacted', 'Resolved'].includes(status)) {
    enquiries[index].status = status;
  }
  if (notes !== undefined) {
    enquiries[index].notes = notes;
  }

  saveEnquiries(enquiries);
  res.json({ success: true, enquiry: enquiries[index] });
});

// 5. Admin: Export CSV
app.get('/api/admin/export-csv', requireAdmin, (req: Request, res: Response) => {
  const enquiries = getEnquiries();
  let csv = 'ID,Date,Name,Phone,Email,EnquiryType,Product,PackSize,Status,Message,Notes\n';

  for (const enq of enquiries) {
    const sanitize = (val: string = '') => `"${val.replace(/"/g, '""')}"`;
    csv += [
      enq.id,
      enq.createdAt,
      sanitize(enq.name),
      sanitize(enq.phone),
      sanitize(enq.email),
      sanitize(enq.enquiryType),
      sanitize(enq.productInterest),
      sanitize(enq.packSize),
      sanitize(enq.status),
      sanitize(enq.message),
      sanitize(enq.notes),
    ].join(',') + '\n';
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="jain_kirana_enquiries_${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
});

// 5b. Public / Customer: Create Order
app.post('/api/orders', (req: Request, res: Response) => {
  const { customerName, customerPhone, customerAddress, deliveryType, items, paymentMethod, notes, orderSource } = req.body;

  if (!customerName || typeof customerName !== 'string' || customerName.trim().length < 2) {
    return res.status(400).json({ error: 'Please provide customer name.' });
  }

  const cleanPhone = (customerPhone || '').replace(/[^0-9+]/g, '');
  if (!cleanPhone || cleanPhone.length < 8) {
    return res.status(400).json({ error: 'Please provide a valid 10-digit mobile number.' });
  }

  const orderNum = 'ORD-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  const orderItems = Array.isArray(items) ? items : [];
  const calculatedTotal = orderItems.reduce((sum: number, it: any) => sum + (Number(it.totalPrice) || 0), 0);

  const newOrder = {
    id: 'ord-' + Date.now().toString(36),
    orderNumber: orderNum,
    customerName: customerName.trim(),
    customerPhone: cleanPhone,
    customerAddress: (customerAddress || '').trim(),
    deliveryType: deliveryType || 'counter-pickup',
    items: orderItems,
    totalAmount: calculatedTotal || Number(req.body.totalAmount) || 0,
    paymentMethod: paymentMethod || 'Cash',
    paymentStatus: req.body.paymentStatus || (deliveryType === 'counter-pickup' ? 'Due on Pickup' : 'Pending'),
    orderStatus: 'New',
    orderSource: orderSource || 'Website',
    createdAt: new Date().toISOString(),
    notes: (notes || '').trim(),
  };

  const orders = getOrders();
  orders.unshift(newOrder);
  saveOrders(orders);

  return res.status(201).json({
    success: true,
    message: 'Order placed successfully! We will prepare your parcel at Ruपेश Jain Kirana Stores, Durg.',
    order: newOrder,
  });
});

// 5c. Admin: List All Orders
app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
  const orders = getOrders();
  res.json({ orders });
});

// 5d. Admin: Create Manual Counter Order
app.post('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
  const { customerName, customerPhone, customerAddress, deliveryType, items, paymentMethod, paymentStatus, orderStatus, notes, orderSource, totalAmount } = req.body;

  if (!customerName || typeof customerName !== 'string') {
    return res.status(400).json({ error: 'Customer name is required.' });
  }

  const cleanPhone = (customerPhone || '').replace(/[^0-9+]/g, '') || '8434336654';
  const orderNum = 'ORD-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
  const orderItems = Array.isArray(items) ? items : [];
  const calculatedTotal = totalAmount !== undefined ? Number(totalAmount) : orderItems.reduce((sum: number, it: any) => sum + (Number(it.totalPrice) || 0), 0);

  const newOrder = {
    id: 'ord-' + Date.now().toString(36),
    orderNumber: orderNum,
    customerName: customerName.trim(),
    customerPhone: cleanPhone,
    customerAddress: (customerAddress || '').trim(),
    deliveryType: deliveryType || 'counter-pickup',
    items: orderItems,
    totalAmount: calculatedTotal,
    paymentMethod: paymentMethod || 'Cash',
    paymentStatus: paymentStatus || 'Paid',
    orderStatus: orderStatus || 'Packed',
    orderSource: orderSource || 'Counter Walk-In',
    createdAt: new Date().toISOString(),
    notes: (notes || '').trim(),
  };

  const orders = getOrders();
  orders.unshift(newOrder);
  saveOrders(orders);

  return res.status(201).json({ success: true, order: newOrder });
});

// 5e. Admin: Update Order Status / Payment / Notes
app.patch('/api/admin/orders/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { orderStatus, paymentStatus, notes } = req.body;

  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  if (orderStatus && ['New', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'].includes(orderStatus)) {
    orders[index].orderStatus = orderStatus;
  }
  if (paymentStatus && ['Paid', 'Pending', 'Due on Pickup'].includes(paymentStatus)) {
    orders[index].paymentStatus = paymentStatus;
  }
  if (notes !== undefined) {
    orders[index].notes = notes;
  }
  orders[index].updatedAt = new Date().toISOString();

  saveOrders(orders);
  res.json({ success: true, order: orders[index] });
});

// 5f. Admin: Export Orders CSV
app.get('/api/admin/orders/export-csv', requireAdmin, (req: Request, res: Response) => {
  const orders = getOrders();
  let csv = 'OrderNumber,Date,CustomerName,Phone,Address,DeliveryType,TotalAmount,PaymentMethod,PaymentStatus,OrderStatus,Source,Notes\n';

  for (const ord of orders) {
    const sanitize = (val: string = '') => `"${String(val).replace(/"/g, '""')}"`;
    csv += [
      ord.orderNumber,
      ord.createdAt,
      sanitize(ord.customerName),
      sanitize(ord.customerPhone),
      sanitize(ord.customerAddress),
      sanitize(ord.deliveryType),
      ord.totalAmount,
      sanitize(ord.paymentMethod),
      sanitize(ord.paymentStatus),
      sanitize(ord.orderStatus),
      sanitize(ord.orderSource),
      sanitize(ord.notes),
    ].join(',') + '\n';
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="jain_kirana_orders_${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
});

// 6. Gemini Store Assistant Chat API (models/gemini-3.8-flash)
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Please provide a valid question or message.' });
  }

  const systemInstruction = `You are the knowledgeable, warm, and courteous customer assistant at Jain Kirana Stores, an authentic Indian neighbourhood grocery and pure spice store with 20+ years of heritage located at Dhimar Para, Brahman Para, Durg, Chhattisgarh 491001.

Products & Verified Pricing:
1. Signature Handcrafted Garam Masala: Slow-roasted 16 whole spices, stone-ground, vibrant aroma, no fillers. Packs: 100g (₹130), 250g (₹310), 500g (₹600), 1kg (₹1,150).
2. Chai / Kadha Masala: Hand-pounded green cardamom, dry ginger (sonth), Ceylon cinnamon, cloves, black pepper, and nutmeg. Perfect for daily chai and seasonal immunity. Packs: 50g (₹95), 100g (₹180), 250g (₹430).
3. Pure Salem Haldi Powder (Turmeric): High curcumin (>4.2%), cold-ground, zero lead chromate or artificial color. Packs: 200g (₹75), 500g (₹180), 1kg (₹350).
4. Lal Mirch Powder: Sun-dried stemless Kashmiri & Guntur chilli blend, vibrant red hue, medium balanced heat, zero adulterants. Packs: 200g (₹85), 500g (₹200), 1kg (₹390).
5. Dhania Powder: Slow-roasted coriander seeds ground fine with citrus fragrance. Packs: 200g (₹65), 500g (₹155), 1kg (₹300).
6. Heritage Chai Patti: High-grown Assam CTC blended with aromatic Darjeeling orthodox leaves. Packs: 250g (₹140), 500g (₹270), 1kg (₹520).
7. Daily Groceries: Sona Masoori & Basmati rice, unpolished dals (Toor, Moong, Urad, Chana), cold-pressed mustard oil, desi cow ghee, rock salt (Sendha Namak), jaggery (Gur).

Store Information & Operating Hours:
- Address: Dhimar Para, Brahman Para, Durg, Chhattisgarh 491001.
- Timings: Monday to Saturday: 9:30 AM – 8:30 PM. Sunday: 10:00 AM – 3:00 PM.
- Direct Contact: Call +91 98112 34567 or WhatsApp +91 98112 34567.
- Google Maps link: https://share.google/s07ftw5vKGj9HbyvP
- Ordering & Pickup: Customers can pre-order for counter pickup in Durg or submit an enquiry on the website or via WhatsApp for local delivery across Durg, Bhilai, and dispatch across Chhattisgarh.

Guidelines:
- Welcome customers with a courteous 'Namaste!'.
- Share practical culinary tips (e.g., when to add Garam Masala during cooking, how much Chai Masala to brew per cup).
- Never invent organic certifications, unverified medical claims, or unlisted discounts.
- Keep responses concise, friendly, and structured. Encourage customers to use the enquiry form or WhatsApp for orders.`;

  try {
    const formattedContents: any[] = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-8)) {
        if (turn && turn.text && (turn.role === 'user' || turn.role === 'model')) {
          formattedContents.push({
            role: turn.role,
            parts: [{ text: turn.text }],
          });
        }
      }
    }
    formattedContents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('API request timeout')), 6000)
    );

    const response = (await Promise.race([generatePromise, timeoutPromise])) as any;
    const reply = response.text || 'Namaste! We are happy to help you with our signature masalas and store items. Please call us or send an enquiry below!';
    return res.json({ reply });
  } catch (err: any) {
    console.error('Gemini chat error/timeout:', err?.message || err);

    // Smart heritage knowledge base fallback
    const lower = message.toLowerCase();
    let smartReply = "Namaste! Welcome to Jain Kirana Stores (Dhimar Para, Brahman Para, Durg). ";

    if (lower.includes('chai') || lower.includes('kadha') || lower.includes('tea')) {
      smartReply += "Our handcrafted Chai / Kadha Masala is prepared with hand-pounded green cardamom, dry ginger (sonth), Ceylon cinnamon, cloves, black pepper, and nutmeg. For a family pot of 4 cups, add just 1/4 teaspoon while boiling water and tea leaves for a fragrant, warming aroma. Available in 50g (₹95), 100g (₹180), and 250g (₹430).";
    } else if (lower.includes('garam') || lower.includes('recipe')) {
      smartReply += "Our Signature Garam Masala is a 16-spice slow-roasted whole spice blend stone-ground in small batches without fillers or starch. Add 1/2 teaspoon towards the final 2 minutes of cooking dal, paneer, or curries to lock in the essential oils. Available in 100g (₹130), 250g (₹310), 500g (₹600), and 1kg (₹1,150).";
    } else if (lower.includes('haldi') || lower.includes('turmeric') || lower.includes('curcumin')) {
      smartReply += "Our Pure Salem Turmeric (Haldi) Powder is cold-ground from high-curcumin (>4.2%) Salem fingers with zero lead chromate, zero added color, and zero fillers. Gives rich golden color and high medicinal value. Available in 200g (₹75), 500g (₹180), and 1kg (₹350).";
    } else if (lower.includes('timing') || lower.includes('time') || lower.includes('open') || lower.includes('sunday') || lower.includes('hours')) {
      smartReply += "Our Durg shop is open Monday to Saturday from 9:30 AM to 8:30 PM, and Sundays from 10:00 AM to 3:00 PM. You can visit us in person or arrange local counter pickup.";
    } else if (lower.includes('address') || lower.includes('location') || lower.includes('where') || lower.includes('durg') || lower.includes('chhattisgarh')) {
      smartReply += "We are located at Dhimar Para, Brahman Para, Durg, Chhattisgarh 491001, easily accessible from Durg Junction Railway Station and Indira Market / Station Road. Feel free to use the Google Maps link on our website or call us directly at +91 98112 34567 for directions!";
    } else {
      smartReply += "Our Durg shop specializes in freshly roasted Garam Masala, Chai Masala, Pure Salem Haldi, Lal Mirch, and daily grocery staples. Please tap WhatsApp to send your grocery list or submit an enquiry below, and we will confirm availability right away!";
    }

    return res.json({ reply: smartReply, fallback: true });
  }
});

// 7. Products API
app.get('/api/products', (req: Request, res: Response) => {
  const products = getStoredProducts();
  res.json({ products });
});

app.put('/api/products', requireAdmin, (req: Request, res: Response) => {
  const { products } = req.body;
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'Invalid products array.' });
  }
  saveStoredProducts(products);
  res.json({ success: true, message: 'Products updated successfully.' });
});

// 8. Robots.txt and Dynamic XML Sitemap
app.get('/robots.txt', (req: Request, res: Response) => {
  const host = `${req.protocol}://${req.get('host')}`;
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /api/admin
Disallow: /admin

# Sitemap index
Sitemap: ${host}/sitemap.xml
`);
});

app.get('/sitemap.xml', (req: Request, res: Response) => {
  const host = `${req.protocol}://${req.get('host')}`;
  const now = new Date().toISOString().slice(0, 10);

  const pages = [
    { loc: `${host}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${host}/#signature-masalas`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${host}/#visit-store`, changefreq: 'weekly', priority: '0.9' },
    { loc: `${host}/#our-difference`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${host}/#our-story`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${host}/#quality`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${host}/#faq`, changefreq: 'weekly', priority: '0.8' },
    { loc: `${host}/#contact`, changefreq: 'monthly', priority: '0.8' },
    { loc: `${host}/#product-garam-masala`, changefreq: 'weekly', priority: '0.85' },
    { loc: `${host}/#product-chai-masala`, changefreq: 'weekly', priority: '0.85' },
    { loc: `${host}/#product-haldi-powder`, changefreq: 'weekly', priority: '0.85' },
    { loc: `${host}/#product-lal-mirch`, changefreq: 'weekly', priority: '0.85' },
    { loc: `${host}/#product-dhania-powder`, changefreq: 'weekly', priority: '0.85' },
    { loc: `${host}/#product-chai-patti`, changefreq: 'weekly', priority: '0.85' },
  ];

  const urlsXml = pages
    .map(
      (p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.header('X-Robots-Tag', 'noindex'); // Sitemaps themselves don't need indexing
  res.send(sitemap);
});

// 9. Local SEO Health & Verification endpoint
app.get('/api/seo/audit', (req: Request, res: Response) => {
  const host = `${req.protocol}://${req.get('host')}`;
  res.json({
    canonicalDomain: host,
    storeProfile: {
      name: 'Jain Kirana Stores',
      alternateName: 'जैन किराना स्टोर्स Durg',
      streetAddress: 'Dhimar Para, Brahman Para',
      locality: 'Brahman Para, Durg',
      city: 'Durg',
      state: 'Chhattisgarh',
      pincode: '491001',
      phone: '+919811234567',
      whatsapp: '+919811234567',
      email: 'rkj.jain2204@gmail.com',
      googleMapsUrl: 'https://share.google/s07ftw5vKGj9HbyvP',
      geo: { lat: 21.1904, lng: 81.2849 },
      timings: 'Mon-Sat: 09:30-20:30 | Sun: 10:00-15:00',
    },
    crawlers: {
      robotsTxtUrl: `${host}/robots.txt`,
      sitemapUrl: `${host}/sitemap.xml`,
      status: 'Active',
    },
    schemaTypes: ['GroceryStore', 'Store', 'FAQPage', 'BreadcrumbList'],
    noFakeReviewsPolicyEnforced: true,
  });
});

// Mount Vite or serve static assets
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Jain Kirana Stores server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
