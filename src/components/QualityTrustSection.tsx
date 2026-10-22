import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, AlertTriangle, Scale, Heart } from 'lucide-react';

export const QualityTrustSection: React.FC = () => {
  const standards = [
    {
      title: 'Zero Synthetic Coloring or Dyes',
      description:
        'We never treat our Lal Mirch with artificial red oil polish or adulterate Haldi with lead chromate or metanil yellow. What you see is 100% natural crop color.',
      status: 'Verified In-Store Practice',
    },
    {
      title: 'Whole Unpolished Spices Only',
      description:
        'Every masala batch begins with whole spice pods, whole cinnamon bark, and intact turmeric rhizomes — never spent spice dust, husks, or starch fillers.',
      status: 'Cleaned & Sifted by Hand',
    },
    {
      title: 'Slow Low-Flame Roasting',
      description:
        'Whole spices are gently pan-toasted on controlled low flame to awaken volatile aromatic oils before cold-grinding, retaining maximum aroma and pungency.',
      status: 'Small-Batch Weekly Grinding',
    },
    {
      title: 'Transparent Counter Scales',
      description:
        'Every customer purchase is measured on government-stamped precision digital scales right in front of your eyes. Honest weight is our 20-year foundation.',
      status: 'Zero Weight Discrepancy',
    },
  ];

  return (
    <section id="quality" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#143826]">
              <span>Purity & Safety</span>
              <span aria-hidden="true" className="text-[#D49B28]">·</span>
              <span>Our Quality Standards</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#143826]">
              The Jain Kirana Quality Commitment
            </h2>

            <p className="text-base text-[#57514A]">
              We believe quality is proven in the aroma of your tadka, not through decorative marketing badges or unsupported claims.
            </p>
          </div>

          <div className="shrink-0 p-3.5 bg-[#EFECE6] border border-[#D9D3C7] rounded-xl text-xs text-[#143826] font-medium flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#D49B28] shrink-0" />
            <span>Pure & Unadulterated · Est. 2004</span>
          </div>
        </div>

        {/* 4 Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {standards.map((std, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F5] border border-[#E7E2D8] p-6 rounded-xl flex flex-col justify-between space-y-4 hover:border-[#143826]/40 transition-colors"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-mono font-bold text-[#D49B28] uppercase tracking-wider block">
                  STANDARD {idx + 1}
                </span>

                <h3 className="text-base font-serif font-bold text-[#143826] leading-snug">
                  {std.title}
                </h3>

                <p className="text-xs text-[#57514A] leading-relaxed">
                  {std.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E7E2D8] flex items-center gap-2 text-[11px] font-semibold text-[#143826]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#143826]" />
                <span>{std.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Honest Certification Notice Box */}
        <div className="bg-[#EFECE6]/80 border border-[#D9D3C7] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs text-[#44403C]">
          <div className="flex items-start gap-3.5 max-w-3xl">
            <div className="p-2 bg-white rounded-lg text-[#8A7148] shrink-0 mt-0.5 shadow-xs">
              <Scale className="w-4 h-4 text-[#C8942A]" />
            </div>
            <div className="space-y-1">
              <strong className="text-sm font-semibold text-[#143826] block">
                Our Transparent Position on "Organic" Claims
              </strong>
              <p className="text-[#57514A] leading-relaxed">
                Many modern brands mislabel regular spices as "certified organic" without certification. At Jain Kirana Stores, we source the highest grade natural crops, de-stem and stone-grind them purely without chemicals. However, we do not claim formal third-party organic certification without active certificates. You get 100% honesty with every purchase.
              </p>
            </div>
          </div>

          <a
            href="#visit-store"
            className="shrink-0 px-4 py-2.5 text-xs font-semibold text-[#143826] bg-white border border-[#D9D3C7] hover:bg-[#FAF8F5] rounded transition-colors whitespace-nowrap"
          >
            Visit Counter & Inspect
          </a>
        </div>
      </div>
    </section>
  );
};
