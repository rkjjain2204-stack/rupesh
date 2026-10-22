import React, { useState } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import { StoreConfig } from '../types/store';
import { getWhatsAppUrl } from '../utils/storeHelpers';

interface Props {
  config: StoreConfig;
  onOpenAdmin?: () => void;
  onOpenLocalSeo?: () => void;
}

export const Navbar: React.FC<Props> = ({ config, onOpenLocalSeo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Signature Masalas', href: '#signature-masalas' },
    { label: 'Why In-House', href: '#our-difference' },
    { label: 'Verified Reviews', href: '#reviews' },
    { label: 'Store & Timings', href: '#visit-store' },
    { label: 'Enquiry', href: '#contact' },
  ];

  const defaultWhatsappMessage = `Namaste ${config.storeName}, I would like to enquire about your signature spices and store timings.`;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand wordmark with authentic store seal */}
          <a
            href="/"
            className="flex items-center gap-3 whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
          >
            <img
              src={config.emblemImage || '/assets/aistudio/image_631fe7f8.png'}
              alt="Jain Kirana Stores Seal"
              className="w-10 h-10 rounded-full object-contain border border-[#D49B28]/50 shadow-2xs bg-[#FAF8F5]"
            />
            <div>
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#143826] tracking-tight block leading-tight">
                {config.storeName}
              </span>
              <span className="text-[10px] text-[#8A7148] tracking-wider font-semibold block">
                {config.motto || 'स्वाद भी, संस्कार भी'}
              </span>
            </div>
          </a>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#292524]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#143826] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0 decoration-[#D49B28] decoration-2"
              >
                {link.label}
              </a>
            ))}

            {onOpenLocalSeo && (
              <button
                type="button"
                onClick={onOpenLocalSeo}
                className="text-xs font-semibold text-[#8A7148] hover:text-[#143826] px-2.5 py-1 rounded bg-[#EFECE6]/70 hover:bg-[#EFECE6] border border-[#D9D3C7]/60 transition-colors"
                title="View Technical SEO Audit & Google Business Profile Guide"
              >
                Local SEO & GBP
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <a
              href={getWhatsAppUrl(config.whatsappNumber, defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] bg-[#143826] hover:bg-[#1B4332] rounded-md shadow-sm transition-colors whitespace-nowrap shrink-0"
            >
              <MessageCircle className="w-4 h-4 text-[#D49B28]" />
              <span>WhatsApp Order</span>
            </a>
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#143826] hover:bg-[#EFECE6] rounded-md transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-[#E7E2D8] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-base font-medium text-[#292524] hover:bg-[#EFECE6] hover:text-[#143826] rounded-md transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2 border-t border-[#E7E2D8] flex flex-col gap-2">
            <a
              href={getWhatsAppUrl(config.whatsappNumber, defaultWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold uppercase tracking-wider text-white bg-[#143826] rounded-md"
            >
              <MessageCircle className="w-4 h-4 text-[#D49B28]" />
              <span>Order on WhatsApp</span>
            </a>
            <a
              href={`tel:${config.phone}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#143826] border border-[#143826] rounded-md"
            >
              <span>Call: {config.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
