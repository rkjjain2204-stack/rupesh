export interface ProductPack {
  size: string; // e.g. "100g", "250g", "1kg"
  price: number; // in INR ₹
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  category: 'signature-masala' | 'pure-spices' | 'tea-staples' | 'whole-spices-dryfruits';
  badge: string;
  isStorePrepared: boolean; // clearly distinguishing in-house prepared from third-party/selected
  image: string;
  shortDescription: string;
  fullDescription: string;
  packs: ProductPack[];
  ingredients: string[];
  certificationsOrClaims: string; // strictly honest: e.g. "Pure Unadulterated Spices (No artificial colour or fillers)"
  storageInstructions: string;
  preparationProcess?: string; // only for in-house products
  packagingType?: string;
  placeholderNotes?: string; // clearly labelled placeholders for unconfirmed owner details
  relatedProductIds?: string[];
  isSignature: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  enquiryType: 'signature-masala' | 'wholesale-bulk' | 'store-visit' | 'daily-grocery' | 'general';
  productInterest?: string;
  packSize?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Resolved';
  createdAt: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface StoreOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  deliveryType: 'counter-pickup' | 'local-delivery' | 'outstation';
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'Cash' | 'UPI / GPay' | 'Pending';
  paymentStatus: 'Paid' | 'Pending' | 'Due on Pickup';
  orderStatus: 'New' | 'Packed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  orderSource: 'Website' | 'WhatsApp' | 'Counter Walk-In' | 'Phone';
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  subTagline: string;
  legacyYears: number;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    locality: string;
    city: string;
    state?: string;
    pincode: string;
    googleMapsUrl: string;
    directionsNote: string;
  };
  timings: {
    morning: string;
    evening: string;
    days: string;
    statusNote: string;
  };
  announcementText: string;
  showAnnouncement: boolean;
  deliveryPolicy: string;
  ownerName?: string;
  motto?: string;
  emblemImage?: string;
}
