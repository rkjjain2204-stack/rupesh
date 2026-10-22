import React, { useState, useEffect } from 'react';
import {
  X,
  MessageCircle,
  Phone,
  ShieldCheck,
  Info,
  Package,
  Layers,
  ArrowRight,
  Send,
  HelpCircle,
} from 'lucide-react';
import { Product, StoreConfig } from '../types/store';
import { getWhatsAppUrl } from '../utils/storeHelpers';

interface Props {
  product: Product | null;
  allProducts: Product[];
  initialPackIndex?: number;
  config: StoreConfig;
  onClose: () => void;
  onSelectRelated: (product: Product) => void;
  onEnquireInForm?: (productName: string, packSize: string) => void;
}

export const ProductDetailModal: React.FC<Props> = ({
  product,
  allProducts,
  initialPackIndex = 0,
  config,
  onClose,
  onSelectRelated,
  onEnquireInForm,
}) => {
  const [selectedPackIndex, setSelectedPackIndex] = useState(initialPackIndex);

  useEffect(() => {
    setSelectedPackIndex(initialPackIndex);
  }, [initialPackIndex, product]);

  // Sync document title and meta for SEO when viewing product modal
  useEffect(() => {
    if (!product) return;
    const previousTitle = document.title;
    document.title = `${product.name} — Jain Kirana Stores, Durg`;

    return () => {
      document.title = previousTitle;
    };
  }, [product]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const currentPack = product.packs[selectedPackIndex] || product.packs[0];
  const whatsappMessage = `Namaste ${config.storeName}, I would like to order or enquire about "${product.name}" (${currentPack?.size} - ₹${currentPack?.price}). Please confirm current availability.`;

  // Find related products
  const relatedProducts = allProducts.filter((p) =>
    product.relatedProductIds?.includes(p.id)
  );

  const handleEnquireViaForm = () => {
    onClose();
    if (onEnquireInForm && currentPack) {
      onEnquireInForm(product.name, currentPack.size);
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} details`}
    >
      <div
        className="relative bg-[#FAF8F5] border border-[#E7E2D8] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl my-6 text-[#1C1917] max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Close Button */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-[#E7E2D8] bg-white">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#143826]">
            <span>{product.badge}</span>
            <span aria-hidden="true" className="text-[#D49B28]">·</span>
            <span>{product.isStorePrepared ? 'Store-Ground in Small Batches' : 'Selected Grocery'}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#78716C] hover:text-[#143826] bg-[#FAF8F5] hover:bg-[#EFECE6] rounded-full transition-colors"
            aria-label="Close product view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Product Image & Packaging Overview */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative rounded-xl overflow-hidden aspect-[4/3] md:aspect-square bg-[#EFECE6] border border-[#D9D3C7] shadow-xs">
                <img
                  src={product.image}
                  alt={`${product.name} ${product.hindiName ? `(${product.hindiName})` : ''} - freshly ground in small batches at Jain Kirana Stores, Durg, Chhattisgarh`}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-[#143826] text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow-xs">
                  {product.isStorePrepared ? 'Store Prepared' : 'Curated Grocery'}
                </div>
              </div>

              {/* Packaging Specification */}
              {product.packagingType && (
                <div className="p-3 bg-white border border-[#E7E2D8] rounded-lg text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#143826]">
                    <Package className="w-3.5 h-3.5 text-[#D49B28]" />
                    <span>Packaging Standard</span>
                  </div>
                  <p className="text-[#57514A] text-[11px] leading-relaxed">
                    {product.packagingType}
                  </p>
                </div>
              )}

              {/* Verified Purity Declaration */}
              <div className="p-3.5 bg-[#EFECE6]/80 border border-[#D9D3C7] rounded-lg text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-[#143826]">
                  <ShieldCheck className="w-4 h-4 text-[#143826]" />
                  <span>Verified Quality Fact</span>
                </div>
                <p className="text-[11px] text-[#57514A] leading-relaxed">
                  {product.certificationsOrClaims}
                </p>
              </div>

              {/* Transparent Unconfirmed Placeholders */}
              {product.placeholderNotes && (
                <div className="p-3 bg-[#FAF8F5] border border-dashed border-[#D9D3C7] rounded-lg text-[11px] text-[#78716C] space-y-1">
                  <div className="flex items-center gap-1 font-semibold text-[#8A7148]">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Store Records & Verification Status</span>
                  </div>
                  <p className="leading-relaxed">
                    {product.placeholderNotes}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Product Details, Ingredients, & Selection */}
            <div className="md:col-span-7 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#143826] leading-tight">
                  {product.name}
                </h2>

                {product.hindiName && (
                  <p className="text-sm font-medium text-[#8A7148] mt-1">
                    {product.hindiName}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-[#44403C] mt-3 leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              {/* Preparation Process */}
              {product.preparationProcess && (
                <div className="p-3.5 bg-white border border-[#E7E2D8] rounded-lg text-xs space-y-1">
                  <strong className="font-semibold text-[#143826] flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#C8942A]" />
                    <span>How We Prepare This Item</span>
                  </strong>
                  <p className="text-[#57514A] text-[11px] leading-relaxed">
                    {product.preparationProcess}
                  </p>
                </div>
              )}

              {/* Confirmed Ingredients List */}
              {product.ingredients && product.ingredients.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#143826]">
                    Confirmed Ingredients ({product.ingredients.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {product.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="text-xs bg-[#EFECE6] text-[#292524] px-2.5 py-1 rounded border border-[#D9D3C7]/60"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Storage Instructions */}
              {product.storageInstructions && (
                <div className="flex items-start gap-2 text-xs text-[#57514A] pt-2 border-t border-[#E7E2D8]">
                  <Info className="w-4 h-4 text-[#C8942A] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#292524]">Storage Instructions: </strong>
                    <span>{product.storageInstructions}</span>
                  </div>
                </div>
              )}

              {/* Available Pack Sizes & Pricing Selector */}
              <div className="pt-4 border-t border-[#E7E2D8] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                    Select Available Pack Size:
                  </label>
                  <span className="text-xs font-semibold text-[#143826]">
                    {currentPack?.inStock ? 'In Stock at Counter' : 'Awaiting New Batch'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {product.packs.map((pack, idx) => (
                    <button
                      key={pack.size}
                      type="button"
                      onClick={() => setSelectedPackIndex(idx)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        selectedPackIndex === idx
                          ? 'border-[#143826] bg-[#143826] text-white shadow-xs'
                          : 'border-[#D9D3C7] bg-white text-[#292524] hover:bg-[#EFECE6]'
                      }`}
                    >
                      <div className="text-xs font-semibold">{pack.size}</div>
                      <div className="text-sm font-bold font-mono tabular-nums mt-0.5">
                        ₹{pack.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={getWhatsAppUrl(config.whatsappNumber, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] bg-[#143826] hover:bg-[#1B4332] rounded-md shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#D49B28]" />
                  <span>WhatsApp Order (₹{currentPack?.price})</span>
                </a>

                <button
                  type="button"
                  onClick={handleEnquireViaForm}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-[#143826] bg-white hover:bg-[#EFECE6] border border-[#143826] rounded-md transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enquire on Web Form</span>
                </button>

                <a
                  href={`tel:${config.phone}`}
                  className="inline-flex items-center justify-center p-3 text-[#143826] bg-white hover:bg-[#EFECE6] border border-[#D9D3C7] rounded-md transition-colors"
                  title="Call shop directly"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="pt-8 border-t border-[#E7E2D8] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-serif font-bold text-[#143826]">
                  Frequently Bought Together or Related
                </h4>
                <span className="text-xs text-[#78716C]">
                  {relatedProducts.length} items
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProducts.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => {
                      onSelectRelated(rel);
                      setSelectedPackIndex(0);
                    }}
                    className="p-3 bg-white border border-[#E7E2D8] hover:border-[#143826] rounded-xl text-left transition-all hover:shadow-xs flex items-center gap-3"
                  >
                    <div className="w-14 h-14 rounded-lg bg-[#EFECE6] overflow-hidden shrink-0">
                      <img
                        src={rel.image}
                        alt={rel.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-serif font-bold text-[#143826] truncate">
                        {rel.name}
                      </h5>
                      <span className="text-[11px] text-[#78716C] block mt-0.5">
                        {rel.badge}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#D49B28]">
                        ₹{rel.packs[0]?.price}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#78716C] shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
