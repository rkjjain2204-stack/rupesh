import React from 'react';
import { StoreConfig } from '../types/store';
import { HeartHandshake, Scale, Shield, Users } from 'lucide-react';

interface Props {
  config: StoreConfig;
}

export const StoreStory: React.FC<Props> = ({ config }) => {
  return (
    <section id="our-story" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image with authentic store visual */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#D9D3C7] bg-[#EFECE6]">
              <img
                src="/src/assets/images/store_heritage_kirana_1792611239670.jpg"
                alt="Inside Jain Kirana Stores at Dhimar Para, Brahman Para, Durg showing traditional whole spice jars and counter service"
                className="w-full h-full object-cover aspect-[4/3] lg:aspect-[4/5]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#FAF8F5]/95 backdrop-blur-md border border-[#E7E2D8] text-xs">
                <span className="font-serif font-bold text-sm text-[#143826] block">
                  Serving Generations in Durg
                </span>
                <p className="text-[11px] text-[#57514A] mt-0.5">
                  Over two decades of dependable service, whole spice roasting, and honest weights in Chhattisgarh.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#143826]">
              <span>Our Heritage</span>
              <span aria-hidden="true" className="text-[#D49B28]">·</span>
              <span>20+ Years in Brahman Para, Durg</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#143826] leading-tight">
              A 20-Year Legacy in Every Handcrafted Pinch
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#44403C] leading-relaxed">
              <p>
                Over two decades ago, <strong>{config.storeName}</strong> was founded at <strong>Dhimar Para, Brahman Para</strong> in Durg, Chhattisgarh with a singular principle: never sell an ingredient we wouldn't use in our own family kitchen.
              </p>
              <p>
                Brahman Para and Dhimar Para have long stood as historic community centres in Durg where families and culinary cooks value uncompromised authenticity. While commercial spice brands shifted towards industrial fillers, artificial red dyes, and sawdust bulkers, we chose to preserve the old-school art of inspecting whole spices, slow pan-roasting, and small-batch stone grinding right in the shop.
              </p>
              <p>
                From family wedding orders and festive celebration hampers to daily pantry dal-chawal, our Durg counter has earned the trust of households across Durg, Bhilai, and surrounding areas.
              </p>
            </div>

            {/* Core Values Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E7E2D8]">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#EFECE6] rounded-md text-[#143826] shrink-0 mt-0.5">
                  <Scale className="w-4 h-4 text-[#C8942A]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1C1917]">Honest Measure & Pricing</h4>
                  <p className="text-xs text-[#57514A] mt-0.5">
                    Clear weights, transparent counter scales, and prices directly reflecting quality.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#EFECE6] rounded-md text-[#143826] shrink-0 mt-0.5">
                  <Shield className="w-4 h-4 text-[#143826]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1C1917]">No Hidden Shortcuts</h4>
                  <p className="text-xs text-[#57514A] mt-0.5">
                    No artificial aromas, dyes, or sawdust bulking agents. Only 100% natural spices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#EFECE6] rounded-md text-[#143826] shrink-0 mt-0.5">
                  <Users className="w-4 h-4 text-[#991B1B]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1C1917]">Neighbourhood Personal Touch</h4>
                  <p className="text-xs text-[#57514A] mt-0.5">
                    We remember our regulars' custom spice preferences and grind requirements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#EFECE6] rounded-md text-[#143826] shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4 text-[#D49B28]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1C1917]">Freshness You Can Smell</h4>
                  <p className="text-xs text-[#57514A] mt-0.5">
                    The moment you open a pack, the natural essential oils speak for themselves.
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
