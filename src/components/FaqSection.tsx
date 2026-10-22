import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FREQUENT_QUESTIONS } from '../data/initialData';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#E7E2D8] relative">
      <div id="faq" className="absolute -top-12 left-0" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#143826]">
            <span>Frequently Asked Questions</span>
            <span aria-hidden="true" className="text-[#D49B28]">·</span>
            <span>Honest Answers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#143826]">
            Common Inquiries & Store Policies
          </h2>

          <p className="text-base text-[#57514A] max-w-2xl mx-auto">
            Everything you need to know about our in-house grinding, raw sourcing, packaging, and local delivery.
          </p>
        </div>

        <div className="space-y-3">
          {FREQUENT_QUESTIONS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-[#E7E2D8] rounded-xl overflow-hidden bg-[#FAF8F5] transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-6 flex items-center justify-between text-left gap-4 hover:bg-[#EFECE6]/50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-serif font-bold text-[#143826]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8A7148] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#44403C] leading-relaxed border-t border-[#E7E2D8]/60 bg-[#FAF8F5]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
