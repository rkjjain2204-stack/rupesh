import React from 'react';
import { ArrowRight, MapPin, ShieldCheck, Sparkles, Coffee } from 'lucide-react';
import { StoreConfig } from '../types/store';

interface Props {
  config: StoreConfig;
}

export const HeroSection: React.FC<Props> = ({ config }) => {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Brand & Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* Clean unboxed metadata kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#143826]">
              <span>Dhimar Para, Brahman Para, Durg</span>
              <span aria-hidden="true" className="text-[#D49B28]">·</span>
              <span>In-House Ground Masalas</span>
              <span aria-hidden="true" className="text-[#D49B28]">·</span>
              <span>Est. 20+ Years</span>
            </div>

            {/* Headline with balanced wrap and semantic locality targeting */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#143826] leading-[1.15] text-balance">
              {config.tagline}
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-sans font-medium text-[#8A7148] mt-2">
                Pure Handcrafted Masalas & Kirana Store in Durg
              </span>
            </h1>

            {/* Supporting authentic copy */}
            <p className="text-lg sm:text-xl text-[#3A3530] font-normal leading-relaxed max-w-2xl">
              {config.subTagline}
            </p>

            <p className="text-sm text-[#57514A] leading-relaxed max-w-xl">
              From our stone-ground 12-spice Garam Masala and warming Chai Masala to pure Salem turmeric, stemless red chilli, and daily kitchen staples — prepared with traditional heritage, honest counter weights, and zero artificial coloring.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <a
                href="#signature-masalas"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-[#FAF8F5] bg-[#143826] hover:bg-[#1B4332] rounded-md shadow-sm transition-all whitespace-nowrap"
              >
                <span>Explore Our Masalas</span>
                <ArrowRight className="w-4 h-4 text-[#D49B28]" />
              </a>

              <a
                href="#visit-store"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#143826] bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#143826] rounded-md transition-all whitespace-nowrap"
              >
                <MapPin className="w-4 h-4 text-[#C8942A]" />
                <span>Visit Our Store</span>
              </a>
            </div>

            {/* Trust statement & genuine quality indicators */}
            <div className="pt-6 border-t border-[#E7E2D8] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#57514A]">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#143826] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1C1917] font-semibold">Store-Ground Purity</strong>
                  <span>Whole spices ground weekly in small lots</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C8942A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1C1917] font-semibold">Zero Fillers</strong>
                  <span>No synthetic colours, starch, or chalk</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Coffee className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#1C1917] font-semibold">Honest Pricing</strong>
                  <span>Direct retail pricing aligned with quality</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero High-Impact Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#D9D3C7] bg-[#EFECE6]">
              <img
                src="/src/assets/images/hero_spices_masalas_1792611237446.jpg"
                alt="Handcrafted Indian spices, whole cardamom, cinnamon, and freshly ground masalas at Jain Kirana Stores, Durg, Chhattisgarh"
                className="w-full h-full object-cover object-center aspect-[4/3] lg:aspect-[1/1] hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Verified Google Rating & Seal Badge */}
              <a
                href="#reviews"
                className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#D9D3C7] shadow-lg flex items-center gap-2.5 transition-transform hover:scale-105"
                title="View verified Google reviews for Jain Kirana Stores"
              >
                <img
                  src={config.emblemImage || '/assets/aistudio/image_631fe7f8.png'}
                  alt="Rupesh Seal"
                  className="w-9 h-9 rounded-full object-contain border border-[#C8942A]/40 bg-[#FAF8F5]"
                />
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold font-serif text-[#143826]">5.0</span>
                    <span className="text-amber-500 text-xs">★★★★★</span>
                  </div>
                  <span className="text-[10px] text-[#57514A] font-semibold block">
                    66+ Google Reviews
                  </span>
                </div>
              </a>

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#FAF8F5]/90 backdrop-blur-md border border-white/50 text-xs text-[#292524] shadow-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif font-bold text-sm text-[#143826]">
                    Freshly Ground This Week
                  </span>
                  <span className="text-[11px] font-medium text-[#143826] bg-[#D49B28]/20 px-2 py-0.5 rounded">
                    Batch #42
                  </span>
                </div>
                <p className="text-[11px] text-[#57514A]">
                  Whole cardamom, cinnamon, cloves & Salem turmeric ready for kitchen staples.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
