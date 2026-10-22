import React, { useState } from 'react';
import { MessageCircle, Eye, CheckCircle2 } from 'lucide-react';
import { Product, StoreConfig } from '../types/store';
import { getWhatsAppUrl } from '../utils/storeHelpers';

interface Props {
  product: Product;
  config: StoreConfig;
  onSelect: (product: Product, selectedPackIndex: number) => void;
}

export const ProductCard: React.FC<Props> = ({ product, config, onSelect }) => {
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const currentPack = product.packs[selectedPackIndex] || product.packs[0];

  const whatsappMessage = `Namaste ${config.storeName}, I would like to order "${product.name}" (${currentPack?.size} - ₹${currentPack?.price}). Please confirm availability and pickup/delivery.`;

  return (
    <div
      id={`product-${product.id}`}
      className="group relative flex flex-col bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#D49B28]/60 transition-all duration-300 scroll-mt-24"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-[#EFECE6] overflow-hidden">
        <img
          src={product.image}
          alt={`${product.name} ${product.hindiName ? `(${product.hindiName})` : ''} freshly prepared at Jain Kirana Stores, Durg, Chhattisgarh`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            // Graceful fallback if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Fallback pattern in case image is missing */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center p-6 text-center text-xs text-[#78716C] bg-[#F5F2EB]">
          <span>{product.name}</span>
        </div>

        {/* Subtle preparation indicator tag (unboxed or minimal) */}
        <div className="absolute top-3 left-3">
          <span
            className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded shadow-xs ${
              product.isStorePrepared
                ? 'bg-[#143826] text-[#FAF8F5]'
                : 'bg-[#FAF8F5]/90 text-[#3A3530] border border-[#E7E2D8]'
            }`}
          >
            {product.isStorePrepared ? 'Store-Prepared' : 'Selected Grocery'}
          </span>
        </div>

        {/* Quick View Button on hover */}
        <button
          onClick={() => onSelect(product, selectedPackIndex)}
          className="absolute bottom-3 right-3 p-2 bg-[#FAF8F5]/95 hover:bg-white text-[#143826] rounded-full shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          title="View product details"
          aria-label={`View details for ${product.name}`}
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Subtle category line */}
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#78716C] mb-1">
            <span>{product.badge}</span>
            <span aria-hidden="true">·</span>
            <span>{product.isStorePrepared ? 'Small Batch' : 'Standard'}</span>
          </div>

          <h3 className="text-lg font-serif font-bold text-[#143826] group-hover:text-[#1B4332] transition-colors leading-snug">
            {product.name}
          </h3>

          {product.hindiName && (
            <p className="text-xs text-[#8A7148] font-medium mt-0.5">
              {product.hindiName}
            </p>
          )}

          <p className="text-xs text-[#57514A] line-clamp-2 mt-2 leading-relaxed">
            {product.shortDescription}
          </p>
        </div>

        {/* Pack Size Selector */}
        <div>
          <span className="block text-[11px] font-medium text-[#78716C] uppercase tracking-wider mb-1.5">
            Select Pack Weight:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {product.packs.map((pack, idx) => (
              <button
                key={pack.size}
                type="button"
                onClick={() => setSelectedPackIndex(idx)}
                className={`text-xs px-2.5 py-1 rounded transition-colors whitespace-nowrap font-medium ${
                  selectedPackIndex === idx
                    ? 'bg-[#143826] text-[#FAF8F5]'
                    : 'bg-[#EFECE6] text-[#44403C] hover:bg-[#E2DDD3]'
                }`}
              >
                {pack.size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Action Strip */}
        <div className="pt-3 border-t border-[#E7E2D8] flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-[#78716C]">
              Price ({currentPack?.size})
            </span>
            <span className="text-xl font-bold text-[#143826] font-mono tabular-nums">
              ₹{currentPack?.price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(product, selectedPackIndex)}
              className="px-3 py-2 text-xs font-medium text-[#143826] hover:bg-[#EFECE6] rounded transition-colors"
            >
              Details
            </button>

            <a
              href={getWhatsAppUrl(config.whatsappNumber, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#143826] hover:bg-[#1B4332] rounded shadow-xs transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#D49B28]" />
              <span>Order</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
