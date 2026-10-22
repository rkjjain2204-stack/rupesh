import React, { useState } from 'react';
import { MapPin, Clock, Phone, MessageCircle, Navigation, Copy, Check, Train, Footprints, Car } from 'lucide-react';
import { StoreConfig } from '../types/store';
import { getWhatsAppUrl, getStoreCurrentStatus } from '../utils/storeHelpers';

interface Props {
  config: StoreConfig;
}

export const LocalStoreSection: React.FC<Props> = ({ config }) => {
  const [copied, setCopied] = useState(false);
  const status = getStoreCurrentStatus();

  const fullAddress = `${config.address.line1}, ${config.address.line2}, ${config.address.locality}, ${config.address.city} - ${config.address.pincode}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const defaultWhatsappDirections = `Namaste ${config.storeName}, I am visiting your store at Dhimar Para, Brahman Para, Durg. Could you please guide me to your shop?`;

  return (
    <section id="visit-store" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#143826]">
            <span>Local Store Location</span>
            <span aria-hidden="true" className="text-[#D49B28]">·</span>
            <span>Dhimar Para, Brahman Para, Durg</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#143826]">
            Visit Jain Kirana Stores in Durg, Chhattisgarh
          </h2>

          <p className="text-base text-[#57514A] leading-relaxed">
            Centrally located in Dhimar Para, Brahman Para, Durg. Smell our freshly roasted spices, view our small-batch stone grinding mills, and pick up your daily groceries right from the shop counter.
          </p>
        </div>

        {/* 2-Column Info & Directions layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Details & Timings Card */}
          <div className="lg:col-span-6 space-y-6">
            {/* Live Timing & Status Box */}
            <div className="p-6 bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-[#E7E2D8]">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      status.isOpen ? 'bg-[#143826]' : 'bg-[#991B1B]'
                    }`}
                  />
                  <div>
                    <span className="font-semibold text-sm text-[#143826]">
                      {status.label}
                    </span>
                    <span className="text-xs text-[#78716C] block">
                      {status.subtext}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-medium text-[#143826] bg-[#EFECE6] px-2.5 py-1 rounded">
                  {config.timings.days}
                </span>
              </div>

              {/* Verified Shift Timings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-[#EFECE6]/60 rounded-lg space-y-1 border border-[#D9D3C7]/60">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#78716C]">
                    Monday – Saturday
                  </span>
                  <div className="text-sm font-bold font-mono text-[#143826]">
                    9:30 AM – 8:30 PM
                  </div>
                  <span className="text-[11px] text-[#57514A]">Full counter service & fresh milling</span>
                </div>

                <div className="p-3.5 bg-[#EFECE6]/60 rounded-lg space-y-1 border border-[#D9D3C7]/60">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#78716C]">
                    Sunday (Half Day)
                  </span>
                  <div className="text-sm font-bold font-mono text-[#143826]">
                    10:00 AM – 3:00 PM
                  </div>
                  <span className="text-[11px] text-[#57514A]">Morning pantry grocery pickup</span>
                </div>
              </div>

              {/* Exact Address details */}
              <div className="pt-2 space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C8942A] shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <strong className="block text-sm font-semibold text-[#1C1917]">
                      Store Address (NAP Confirmed)
                    </strong>
                    <p className="text-xs text-[#44403C] leading-relaxed">
                      {config.address.line1}<br />
                      {config.address.line2}<br />
                      {config.address.locality}, {config.address.city} {config.address.state ? `, ${config.address.state}` : ''} - {config.address.pincode}
                    </p>
                    <p className="text-[11px] text-[#78716C] italic pt-1">
                      {config.address.directionsNote}
                    </p>
                  </div>
                </div>

                {/* Copy address button */}
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#143826] font-medium hover:underline"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#143826]" />
                      <span>Address copied to clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#78716C]" />
                      <span>Copy Full Verified Address</span>
                    </>
                  )}
                </button>
              </div>

              {/* Delivery policy notice */}
              <div className="p-3.5 rounded-lg bg-[#FAF8F5] border border-[#E7E2D8] text-xs text-[#57514A]">
                <strong className="font-semibold text-[#143826] block mb-0.5">
                  Local Service Area & Dispatch
                </strong>
                <span>{config.deliveryPolicy}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${config.phone}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#143826] bg-[#EFECE6] hover:bg-[#E2DDD3] border border-[#D9D3C7] rounded-md transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call: {config.phone}</span>
                </a>

                <a
                  href={getWhatsAppUrl(config.whatsappNumber, defaultWhatsappDirections)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] bg-[#143826] hover:bg-[#1B4332] rounded-md shadow-xs transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#D49B28]" />
                  <span>Ask Directions on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Verified Transit & Landmark Guide + Google Maps Embed */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl overflow-hidden shadow-xs">
              {/* Google Maps Embed for Dhimar Para, Brahman Para, Durg */}
              <div className="relative aspect-[16/10] bg-[#EFECE6] overflow-hidden">
                <iframe
                  title="Jain Kirana Stores Dhimar Para Brahman Para Durg Map"
                  src="https://maps.google.com/maps?q=Jain+Kirana+Stores+Dhimar+Para+Brahman+Para+Durg+Chhattisgarh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded shadow text-xs font-semibold text-[#143826] border border-[#E7E2D8]">
                  {config.storeName} · Dhimar Para, Brahman Para, Durg
                </div>
              </div>

              {/* Map Footer Strip */}
              <div className="p-4 bg-[#FAF8F5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs border-t border-[#E7E2D8]">
                <div>
                  <span className="font-semibold text-[#1C1917] block">
                    Dhimar Para, Brahman Para, Durg
                  </span>
                  <span className="text-[#78716C]">
                    Durg & Bhilai Spices & Grocery Merchant (Pincode: 491001)
                  </span>
                </div>

                <a
                  href={config.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-xs text-[#FAF8F5] bg-[#143826] hover:bg-[#1B4332] rounded transition-colors whitespace-nowrap shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#D49B28]" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>

            {/* How to Reach: Local Transit Landmarks */}
            <div className="p-5 bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#143826] flex items-center gap-2">
                <span>Verified Transit & Directions</span>
                <span className="text-[#D49B28]">·</span>
                <span>Durg, Chhattisgarh</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-[#EFECE6]/70 rounded-lg space-y-1 border border-[#D9D3C7]/60">
                  <div className="flex items-center gap-1.5 font-semibold text-[#143826]">
                    <Train className="w-3.5 h-3.5 text-[#C8942A]" />
                    <span>Durg Junction Station</span>
                  </div>
                  <p className="text-[11px] text-[#57514A]">
                    Approx. 7–10 mins (~2 km). Direct autos and battery rickshaws stop right near Brahman Para Chowk.
                  </p>
                </div>

                <div className="p-3 bg-[#EFECE6]/70 rounded-lg space-y-1 border border-[#D9D3C7]/60">
                  <div className="flex items-center gap-1.5 font-semibold text-[#143826]">
                    <Car className="w-3.5 h-3.5 text-[#143826]" />
                    <span>Indira Market / Station Rd</span>
                  </div>
                  <p className="text-[11px] text-[#57514A]">
                    Quick access from Indira Market, Mohan Nagar, and G.E. Road connecting Durg and Bhilai.
                  </p>
                </div>

                <div className="p-3 bg-[#EFECE6]/70 rounded-lg space-y-1 border border-[#D9D3C7]/60">
                  <div className="flex items-center gap-1.5 font-semibold text-[#143826]">
                    <Footprints className="w-3.5 h-3.5 text-[#991B1B]" />
                    <span>Local Landmark</span>
                  </div>
                  <p className="text-[11px] text-[#57514A]">
                    Walk into Dhimar Para right off the Brahman Para main lane. Landmark: Near Brahman Para Chowk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
