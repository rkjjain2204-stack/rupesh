import React, { useState, useEffect } from 'react';
import { INITIAL_CONFIG, INITIAL_PRODUCTS } from './data/initialData';
import { Product, StoreConfig } from './types/store';
import { AnnouncementStrip } from './components/AnnouncementStrip';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SignatureShowcase } from './components/SignatureShowcase';
import { OurDifference } from './components/OurDifference';
import { StoreStory } from './components/StoreStory';
import { QualityTrustSection } from './components/QualityTrustSection';
import { CustomerReviews } from './components/CustomerReviews';
import { LocalStoreSection } from './components/LocalStoreSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminDrawer } from './components/AdminDrawer';
import { KiranaChatbot } from './components/KiranaChatbot';
import { LocalSeoModal } from './components/LocalSeoModal';
import { testConnection } from './lib/firebase';

export default function App() {
  const [config, setConfig] = useState<StoreConfig>(INITIAL_CONFIG);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // State for modals & lead prefill
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLocalSeoOpen, setIsLocalSeoOpen] = useState(false);
  const [initialEnquiry, setInitialEnquiry] = useState<{ name: string; packSize?: string } | null>(null);

  // Validate Firestore connection on boot and maintain dynamic canonical tag per applet-seo skill
  useEffect(() => {
    testConnection();
    if (typeof window !== 'undefined') {
      const canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl) {
        canonicalEl.setAttribute('href', window.location.origin + window.location.pathname);
      }
    }
  }, []);

  const handleOpenProduct = (product: Product, packIndex: number) => {
    setSelectedProduct(product);
    setSelectedPackIndex(packIndex);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1917] selection:bg-[#D49B28]/25 selection:text-[#143826]">
      {/* 1. Announcement Strip */}
      <AnnouncementStrip config={config} />

      {/* 2. Premium 3-zone Navigation */}
      <Navbar
        config={config}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLocalSeo={() => setIsLocalSeoOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 3. Hero Section */}
        <HeroSection config={config} />

        {/* 4. Signature Product Showcase */}
        <SignatureShowcase
          products={products}
          config={config}
          onSelectProduct={handleOpenProduct}
        />

        {/* 5. Our Difference (Craft & Milling Process) */}
        <OurDifference />

        {/* 6. Our 20-Year Heritage Story */}
        <StoreStory config={config} />

        {/* 7. Quality & Purity Standards */}
        <QualityTrustSection />

        {/* 8. Verified Customer Reviews & Google Profile */}
        <CustomerReviews
          config={config}
          onOpenLocalSeoGuide={() => setIsLocalSeoOpen(true)}
        />

        {/* 9. Local Store Section (Timings, Address, Live Open Status, Directions) */}
        <LocalStoreSection config={config} />

        {/* 10. Frequently Asked Questions */}
        <FaqSection />

        {/* 11. Contact & Direct Lead Management */}
        <ContactSection
          config={config}
          products={products}
          initialEnquiryProduct={initialEnquiry}
        />
      </main>

      {/* 12. Footer with Local NAP & Owner Portal link */}
      <Footer
        config={config}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLocalSeo={() => setIsLocalSeoOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        allProducts={products}
        initialPackIndex={selectedPackIndex}
        config={config}
        onClose={() => setSelectedProduct(null)}
        onSelectRelated={(relProd) => {
          setSelectedProduct(relProd);
          setSelectedPackIndex(0);
        }}
        onEnquireInForm={(name, packSize) => {
          setInitialEnquiry({ name, packSize });
        }}
      />

      {/* Protected Counter / Store Owner Admin Console */}
      <AdminDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProduct={handleUpdateProduct}
      />

      {/* Local SEO & Technical Health Modal */}
      <LocalSeoModal
        isOpen={isLocalSeoOpen}
        onClose={() => setIsLocalSeoOpen(false)}
        config={config}
      />

      {/* Gemini 3.8 Flash Store Assistant Chatbot */}
      <KiranaChatbot
        config={config}
        onNavigateToContact={() => {
          document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}
