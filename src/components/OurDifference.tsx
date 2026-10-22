import React from 'react';
import { Eye, Flame, Layers, PackageCheck } from 'lucide-react';

export const OurDifference: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Hand Inspection & De-stemming',
      description:
        'Commercial mass-market powders often grind chillies with stems, coriander with husk, and whole spices with grit. We hand-sift our raw spices, removing chilli stems and foreign particles before anything touches the grinder.',
      icon: Eye,
    },
    {
      num: '02',
      title: 'Gentle Low-Flame Roasting',
      description:
        'To awaken natural essential aromatic oils without burning delicate flavors, our whole spices are slow-toasted on controlled low flame. This step gives our Garam Masala its signature warm, lingering aroma.',
      icon: Flame,
    },
    {
      num: '03',
      title: 'Dedicated Small-Batch Milling',
      description:
        'Instead of industrial high-friction pulverizers that generate extreme heat and destroy spice flavor, we grind our masalas weekly in small 5–10 kg batches on premises using dedicated cold-milling stone/steel grinders.',
      icon: Layers,
    },
    {
      num: '04',
      title: 'Airtight Fresh Packaging',
      description:
        'Immediately after milling and natural cooling, our masalas are packed into sealed barrier pouches and jars. No product sits on warehouse racks for months; you receive freshness straight from the mill.',
      icon: PackageCheck,
    },
  ];

  return (
    <section id="our-difference" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#143826]">
            <span>Store Craft & Process</span>
            <span aria-hidden="true" className="text-[#D49B28]">·</span>
            <span>Honest In-House Practice</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#143826]">
            How We Prepare Our Masalas
          </h2>

          <p className="text-base text-[#57514A] leading-relaxed">
            The difference between an ordinary dish and a memorable meal is the quality of the spice. Here is how our kitchen-to-counter preparation works every week.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-[#FAF8F5] border border-[#E7E2D8] p-6 rounded-xl space-y-4 hover:border-[#143826]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-[#D49B28] tracking-widest">
                    STEP {step.num}
                  </span>
                  <div className="p-2 bg-[#EFECE6] rounded-md text-[#143826]">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-base font-serif font-bold text-[#143826] leading-snug">
                  {step.title}
                </h3>

                <p className="text-xs text-[#57514A] leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Honest Transparency Callout */}
        <div className="bg-[#143826] text-[#FAF8F5] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <h4 className="font-serif text-lg font-bold text-[#FAF8F5]">
              Our Promise of Unadulterated Taste
            </h4>
            <p className="text-xs text-[#FAF8F5]/80 leading-relaxed">
              We never use synthetic food colorants, spent spice residue, or starch fillers. While our spices are 100% natural and unadulterated, we do not advertise them as certified organic without formal certification documents.
            </p>
          </div>

          <a
            href="#visit-store"
            className="shrink-0 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#143826] bg-[#D49B28] hover:bg-[#e0a838] rounded transition-colors whitespace-nowrap"
          >
            See Our Store
          </a>
        </div>
      </div>
    </section>
  );
};
