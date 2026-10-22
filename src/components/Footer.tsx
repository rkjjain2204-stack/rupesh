import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Lock } from 'lucide-react';
import { StoreConfig } from '../types/store';
import { getWhatsAppUrl } from '../utils/storeHelpers';

interface Props {
  config: StoreConfig;
  onOpenAdmin: () => void;
  onOpenLocalSeo?: () => void;
}

export const Footer: React.FC<Props> = ({ config, onOpenAdmin, onOpenLocalSeo }) => {
  const currentYear = new Date().getFullYear();
  const defaultWhatsappMessage = `Namaste ${config.storeName}, I would like to get in touch.`;

  return (
    <footer className="bg-[#143826] text-[#FAF8F5] pt-16 pb-12 border-t border-[#1f4e36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Store Brand & Value */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={config.emblemImage || '/assets/aistudio/image_631fe7f8.png'}
                alt="Jain Kirana Stores Seal"
                className="w-12 h-12 rounded-full object-contain border border-[#D49B28]/60 bg-[#FAF8F5]"
              />
              <div>
                <h3 className="font-serif text-xl font-bold tracking-tight text-[#FAF8F5]">
                  {config.storeName}
                </h3>
                <span className="text-xs text-[#D49B28] font-medium block">
                  {config.motto || 'स्वाद भी, संस्कार भी'}
                </span>
              </div>
            </div>
            <p className="text-xs text-[#FAF8F5]/80 leading-relaxed">
              {config.subTagline}
            </p>
            <div className="pt-1">
              <span className="text-[11px] text-[#FAF8F5]/60 block">
                Food Purity Guarantee:
              </span>
              <span className="text-[11px] text-[#FAF8F5]/80">
                100% pure whole spices milled on premises without synthetic dyes, starch or chemical fillers.
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D49B28]">
              Catalogue & Spices
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF8F5]/80">
              <li>
                <a href="#signature-masalas" className="hover:text-white transition-colors">
                  In-House Garam Masala
                </a>
              </li>
              <li>
                <a href="#signature-masalas" className="hover:text-white transition-colors">
                  Chai & Kadha Masala Blend
                </a>
              </li>
              <li>
                <a href="#signature-masalas" className="hover:text-white transition-colors">
                  Salem Pure Haldi (Turmeric)
                </a>
              </li>
              <li>
                <a href="#signature-masalas" className="hover:text-white transition-colors">
                  Stemless Lal Mirch Powder
                </a>
              </li>
              <li>
                <a href="#our-difference" className="hover:text-white transition-colors">
                  Slow-Roast Grinding Method
                </a>
              </li>
              <li>
                <a href="#our-story" className="hover:text-white transition-colors">
                  Our 20-Year Legacy in Durg
                </a>
              </li>
              <li>
                <a href="#visit-store" className="hover:text-white transition-colors">
                  Store Directions & Station Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Local NAP & Timings (Critical for Local SEO) */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D49B28]">
              Verified Store NAP & Hours
            </h4>
            <div className="space-y-3 text-xs text-[#FAF8F5]/80">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D49B28] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#FAF8F5] block">
                    {config.timings.days}
                  </span>
                  <span>Mon–Sat: 9:30 AM – 8:30 PM</span>
                  <br />
                  <span>Sunday: 10:00 AM – 3:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D49B28] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#FAF8F5]">{config.address.line1}</span>
                  <br />
                  <span>{config.address.line2}</span>
                  <br />
                  <span>
                    {config.address.locality}, {config.address.city} {config.address.state ? `, ${config.address.state}` : ''} - {config.address.pincode}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Owner Portal */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#D49B28]">
              Contact & Portals
            </h4>
            <div className="space-y-2 text-xs">
              <a
                href={`tel:${config.phone}`}
                className="flex items-center gap-2 text-[#FAF8F5] hover:text-[#D49B28] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D49B28]" />
                <span className="font-mono">{config.phone}</span>
              </a>

              <a
                href={getWhatsAppUrl(config.whatsappNumber, defaultWhatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#FAF8F5] hover:text-[#D49B28] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#D49B28]" />
                <span>WhatsApp: +{config.whatsappNumber}</span>
              </a>
            </div>

            <div className="pt-4 border-t border-[#1f4e36] flex flex-col gap-2">
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-[#FAF8F5]/90 hover:text-white bg-white/10 hover:bg-white/15 rounded transition-colors text-left"
              >
                <Lock className="w-3 h-3 text-[#D49B28]" />
                <span>Store Owner Counter Portal</span>
              </button>

              {onOpenLocalSeo && (
                <button
                  type="button"
                  onClick={onOpenLocalSeo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-[#D49B28] hover:text-white bg-[#D49B28]/10 hover:bg-[#D49B28]/20 border border-[#D49B28]/30 rounded transition-colors text-left"
                >
                  <span>Local SEO Audit & Google Guide</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Quiet Copyright & NAP Confirmation */}
        <div className="pt-8 border-t border-[#1f4e36] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/60">
          <p>
            © {currentYear} {config.storeName}. All rights reserved. Dhimar Para, Brahman Para, Durg, Chhattisgarh 491001.
          </p>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Local SEO: Durg & Bhilai Kirana & Spices</span>
            <span aria-hidden="true">·</span>
            <span>Unadulterated Spice Purity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
