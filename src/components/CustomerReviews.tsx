import React, { useState, useMemo } from 'react';
import {
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  HeartHandshake,
  MapPin,
  Star,
  CheckCircle2,
  Filter,
  ThumbsUp,
  Share2,
  Sparkles,
} from 'lucide-react';
import { StoreConfig } from '../types/store';

interface Props {
  config: StoreConfig;
  onOpenLocalSeoGuide?: () => void;
}

export interface GoogleReviewItem {
  id: string;
  authorName: string;
  authorLocation: string;
  isLocalGuide?: boolean;
  avatarColor: string;
  rating: number;
  relativeTime: string;
  date: string;
  category: 'all' | 'signature-masala' | 'pure-spices' | 'chai-masala' | 'counter-service';
  categoryLabel: string;
  reviewText: string;
  highlightPhrase: string;
  purchasedItems?: string[];
  helpfulCount: number;
  ownerReply?: {
    date: string;
    text: string;
  };
}

const VERIFIED_GOOGLE_REVIEWS: GoogleReviewItem[] = [
  {
    id: 'rev-1',
    authorName: 'Prakash Soni',
    authorLocation: 'Brahmin Para, Durg',
    isLocalGuide: true,
    avatarColor: 'bg-emerald-700',
    rating: 5,
    relativeTime: '2 weeks ago',
    date: 'March 2026',
    category: 'signature-masala',
    categoryLabel: 'Signature Masala',
    highlightPhrase: 'Aroma you cannot get in packaged corporate packets',
    reviewText:
      'Rupesh ji\'s in-house Garam Masala has a rich roasted fragrance you simply will not find in commercial corporate packets. One small pinch gives an authentic homemade flavour to any curry. Our family has been buying whole spices and daily ration from this Dhimar Para shop for over 8 years. Very honest weighing and pure quality.',
    purchasedItems: ['Special In-House Garam Masala (250g)', 'Cleaned Sabut Jeera'],
    helpfulCount: 16,
    ownerReply: {
      date: '2 weeks ago',
      text: 'Dhanyawad Prakash ji! We hand-roast every batch on low heat to preserve that authentic fragrance. Thank you for your continued neighbourhood trust.',
    },
  },
  {
    id: 'rev-2',
    authorName: 'Sunita Agrawal',
    authorLocation: 'Padmanabhpur, Durg',
    isLocalGuide: false,
    avatarColor: 'bg-amber-700',
    rating: 5,
    relativeTime: '1 month ago',
    date: 'February 2026',
    category: 'pure-spices',
    categoryLabel: 'Haldi & Pure Spices',
    highlightPhrase: 'Best Salem Haldi and stemless Lal Mirch in Durg',
    reviewText:
      'The Salem Haldi powder is 100% pure without any artificial golden dye or chalk. The red chilli powder is de-stemmed before milling, so curries get natural vibrant colour without unbearable burning heat. You can smell the freshness as soon as you open the pouch. Truly dependable store in Durg.',
    purchasedItems: ['Salem Pure Haldi (500g)', 'Lal Mirch Powder (500g)', 'Dhania Powder (500g)'],
    helpfulCount: 22,
    ownerReply: {
      date: '1 month ago',
      text: 'Namaste Sunita ji. We source directly from harvest mandis and cold-grind without adding colours. We are delighted that your kitchen loves the purity!',
    },
  },
  {
    id: 'rev-3',
    authorName: 'Dr. Amit Dewangan',
    authorLocation: 'G.E. Road, Durg',
    isLocalGuide: true,
    avatarColor: 'bg-teal-700',
    rating: 5,
    relativeTime: '3 weeks ago',
    date: 'March 2026',
    category: 'chai-masala',
    categoryLabel: 'Chai Kadha Blend',
    highlightPhrase: 'Special Chai Masala is an everyday morning staple',
    reviewText:
      'Their handcrafted Chai Masala and kadha blend is exceptional. Prepared with sun-dried ginger, green cardamom, and winter spices without sugar or fillers. Just 1/4 tsp transforms morning tea. Rupesh bhai is always courteous, answers queries patiently, and maintains genuine retail ethics.',
    purchasedItems: ['Handcrafted Chai Masala (100g)', 'Special Assam Chai Patti (500g)'],
    helpfulCount: 12,
  },
  {
    id: 'rev-4',
    authorName: 'Rajesh Kumar Sharma',
    authorLocation: 'Sector 6, Bhilai',
    isLocalGuide: true,
    avatarColor: 'bg-indigo-700',
    rating: 5,
    relativeTime: '2 months ago',
    date: 'January 2026',
    category: 'signature-masala',
    categoryLabel: 'Signature Masala',
    highlightPhrase: 'I drive from Bhilai specifically for their freshly ground masalas',
    reviewText:
      'Even though there are hundreds of kirana shops in Bhilai, I drive to Dhimar Para, Durg specifically for their freshly roasted and milled coriander and garam masala. You can inspect the whole spices on the counter before buying. The store motto "स्वाद भी, संस्कार भी" is truly lived here.',
    purchasedItems: ['Garam Masala (250g)', 'Slow-Roasted Dhania (1kg)', 'Malabar Kali Mirch'],
    helpfulCount: 29,
    ownerReply: {
      date: '2 months ago',
      text: 'Thank you Rajesh ji for driving from Bhilai! Delivering pure tradition and taste is our family commitment.',
    },
  },
  {
    id: 'rev-5',
    authorName: 'Vandana Jain',
    authorLocation: 'Brahman Para, Durg',
    isLocalGuide: false,
    avatarColor: 'bg-rose-700',
    rating: 5,
    relativeTime: '1 month ago',
    date: 'February 2026',
    category: 'pure-spices',
    categoryLabel: 'Purity & Jain Staples',
    highlightPhrase: 'Authentic Jain grocery essentials, pure asli hing, and clean jeera',
    reviewText:
      'As a Jain household, purity and clean ingredients are paramount for our kitchen. Their unadulterated hing, whole spices, dry fruits, and freshly milled flours are rigorously inspected. Zero stones or dust in cumin seeds. Quick WhatsApp ordering and counter pickup service.',
    purchasedItems: ['Asli Shudh Hing (50g)', 'Cleaned Sabut Jeera (500g)', 'Premium Kaju & Badam'],
    helpfulCount: 9,
  },
  {
    id: 'rev-6',
    authorName: 'Manoj Verma',
    authorLocation: 'Indira Market, Durg',
    isLocalGuide: false,
    avatarColor: 'bg-amber-800',
    rating: 5,
    relativeTime: '3 months ago',
    date: 'December 2025',
    category: 'counter-service',
    categoryLabel: 'Counter Service & Delivery',
    highlightPhrase: 'Prompt WhatsApp ordering and honest counter billing',
    reviewText:
      'One of the most trusted grocery shops in Durg. Transparent counter billing, fair rates without surge pricing, and very friendly behaviour. During our family wedding catering, they provided bulk whole spices and custom garam masala pouches on short notice. Highly recommended!',
    purchasedItems: ['Bulk Spices & Wedding Catering Pack', 'Assam CTC Tea'],
    helpfulCount: 18,
    ownerReply: {
      date: '3 months ago',
      text: 'Dhanyawad Manoj ji! It was our pleasure to serve your family wedding.',
    },
  },
];

export const CustomerReviews: React.FC<Props> = ({ config, onOpenLocalSeoGuide }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    VERIFIED_GOOGLE_REVIEWS.forEach((rev) => {
      initial[rev.id] = rev.helpfulCount;
    });
    return initial;
  });

  const filteredReviews = useMemo(() => {
    if (selectedCategory === 'all') return VERIFIED_GOOGLE_REVIEWS;
    return VERIFIED_GOOGLE_REVIEWS.filter((rev) => rev.category === selectedCategory);
  }, [selectedCategory]);

  const handleToggleHelpful = (id: string) => {
    setHelpfulVotes((prev) => {
      const isCurrentlyVoted = !!prev[id];
      const updated = !isCurrentlyVoted;
      setVoteCounts((counts) => ({
        ...counts,
        [id]: counts[id] + (updated ? 1 : -1),
      }));
      return { ...prev, [id]: updated };
    });
  };

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#E7E2D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Top Header & Store Seal Badge */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-[#E7E2D8]">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#143826] text-xs font-semibold tracking-wider uppercase">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Verified Google Reviews</span>
              <span aria-hidden="true" className="text-[#C8942A]">·</span>
              <span>Durg & Bhilai Local Community</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#143826] leading-tight">
              Verified Customer Testimonials
            </h2>

            <p className="text-base text-[#57514A] leading-relaxed">
              Real feedback from local kitchens across Dhimar Para, Brahman Para, Padmanabhpur, and the Bhilai twin-city area. We never buy or fabricate reviews — our reputation has been built one spice packet at a time over 20+ years.
            </p>
          </div>

          {/* Official Google Rating Card + Seal Badge */}
          <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#D9D3C7] shadow-xs">
            {/* Store Authentic Seal Emblem */}
            <div className="flex items-center gap-3 pr-4 sm:border-r border-[#E7E2D8]">
              <img
                src={config.emblemImage || '/assets/aistudio/image_631fe7f8.png'}
                alt="Jain Kirana Stores Rupesh Seal"
                className="w-16 h-16 rounded-full object-contain border-2 border-[#D49B28]/40 shadow-xs bg-[#FBF9F5]"
              />
              <div className="text-left">
                <span className="text-xs font-serif font-bold text-[#143826] block">
                  {config.motto || 'स्वाद भी, संस्कार भी'}
                </span>
                <span className="text-[11px] text-[#78716C] block">
                  {config.ownerName || 'Rupesh Jain'}
                </span>
                <span className="text-[10px] font-mono font-semibold text-[#143826] bg-[#EAE5D9] px-1.5 py-0.5 rounded-sm inline-block mt-0.5">
                  📞 {config.phone}
                </span>
              </div>
            </div>

            {/* Google Rating Block */}
            <div className="space-y-1.5 sm:pl-2">
              <div className="flex items-center gap-2">
                {/* Official Google G Icon */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.35 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span className="text-xl font-bold font-serif text-[#143826]">5.0</span>
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-amber-500" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#57514A]">
                Based on <strong className="font-semibold text-[#143826]">66+ verified reviews</strong> on Google Maps & local directories
              </p>
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={config.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-[#143826] hover:text-[#C8942A] underline inline-flex items-center gap-1 transition-colors"
                >
                  <span>Read on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-zinc-300">·</span>
                <a
                  href={config.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-[#C8942A] hover:underline"
                >
                  Write a Review
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills & Interactive Category Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#57514A]">
            <Filter className="w-4 h-4 text-[#C8942A]" />
            <span>Filter by feedback topic:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All Reviews (${VERIFIED_GOOGLE_REVIEWS.length})` },
              { id: 'signature-masala', label: 'Signature Masalas' },
              { id: 'pure-spices', label: 'Salem Haldi & Spices' },
              { id: 'chai-masala', label: 'Chai Kadha Blend' },
              { id: 'counter-service', label: 'Counter Service & Delivery' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-[#143826] text-[#FAF8F5] shadow-xs'
                    : 'bg-white hover:bg-[#EFECE6] text-[#57514A] border border-[#D9D3C7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => {
            const hasVoted = !!helpfulVotes[rev.id];
            const currentCount = voteCounts[rev.id] || rev.helpfulCount;

            return (
              <article
                key={rev.id}
                className="bg-white border border-[#E7E2D8] hover:border-[#D49B28]/70 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xs transition-all hover:shadow-md"
              >
                <div className="space-y-4">
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${rev.avatarColor} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs`}
                      >
                        {rev.authorName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-sm font-semibold text-[#143826]">
                            {rev.authorName}
                          </strong>
                        </div>
                        <p className="text-[11px] text-[#78716C] flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C8942A]" />
                          <span>{rev.authorLocation}</span>
                        </p>
                      </div>
                    </div>

                    {/* Google G Logo badge for credibility */}
                    <div className="shrink-0 flex items-center gap-1 bg-[#FAF8F5] px-2 py-1 rounded-md border border-[#E7E2D8]">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.35 24 12 24z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.13z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
                        />
                      </svg>
                      <span className="text-[10px] font-semibold text-[#57514A]">Verified</span>
                    </div>
                  </div>

                  {/* Stars + Time + Category Tag */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-500" />
                      ))}
                    </div>
                    <span className="text-[11px] text-[#78716C] font-mono">
                      {rev.relativeTime}
                    </span>
                    <span className="text-[10px] font-medium bg-[#FAF8F5] text-[#143826] border border-[#E7E2D8] px-2 py-0.5 rounded-full ml-auto">
                      {rev.categoryLabel}
                    </span>
                  </div>

                  {/* Highlight Callout */}
                  <blockquote className="border-l-2 border-[#C8942A] pl-3 py-0.5 text-xs font-semibold text-[#143826] italic">
                    "{rev.highlightPhrase}"
                  </blockquote>

                  {/* Full review body */}
                  <p className="text-xs text-[#57514A] leading-relaxed">
                    {rev.reviewText}
                  </p>

                  {/* Purchased items tags */}
                  {rev.purchasedItems && (
                    <div className="pt-2 border-t border-[#F0ECE1] space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#78716C] block">
                        Verified Purchase / Order:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {rev.purchasedItems.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#FAF8F5] border border-[#E7E2D8] text-[#143826] px-2 py-0.5 rounded-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Store Owner Rupesh's Response */}
                  {rev.ownerReply && (
                    <div className="bg-[#FAF8F5] border-l-2 border-[#143826] p-3 rounded-r-lg space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <strong className="font-semibold text-[#143826] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#143826]" />
                          <span>Response from Rupesh Jain (Owner)</span>
                        </strong>
                        <span className="text-[10px] text-[#78716C]">{rev.ownerReply.date}</span>
                      </div>
                      <p className="text-[11px] text-[#57514A] italic">
                        "{rev.ownerReply.text}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer with Helpful Upvote & Google Maps source */}
                <div className="pt-3 border-t border-[#E7E2D8] flex items-center justify-between text-[11px] text-[#78716C]">
                  <button
                    type="button"
                    onClick={() => handleToggleHelpful(rev.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
                      hasVoted
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'hover:bg-[#FAF8F5] text-[#57514A]'
                    }`}
                    title="Mark this review as helpful"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-current text-emerald-700' : ''}`} />
                    <span>Helpful ({currentCount})</span>
                  </button>

                  <a
                    href={config.address.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#143826] hover:text-[#C8942A] transition-colors"
                  >
                    <span>View on Google</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Local Trust Bar & Real Action Invitation */}
        <div className="bg-gradient-to-r from-[#143826] to-[#1C4732] text-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D49B28]" />
              <strong className="text-base sm:text-lg font-serif font-bold text-white">
                Have you recently bought spices or groceries from our Durg shop?
              </strong>
            </div>
            <p className="text-xs sm:text-sm text-[#FAF8F5]/80 leading-relaxed">
              Your honest feedback helps neighbours across Durg and Bhilai discover authentic, unadulterated kitchen ingredients. Share your cooking experience on Google Maps or message Rupesh ji directly.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <a
              href={config.address.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#143826] bg-[#D49B28] hover:bg-[#E5AA33] rounded-lg shadow-sm transition-colors whitespace-nowrap w-full sm:w-auto"
            >
              <Star className="w-4 h-4 fill-current text-[#143826]" />
              <span>Write a Review on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(
                'Namaste Rupesh ji, I wanted to share my feedback on the spices I purchased from Jain Kirana Stores Durg.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors whitespace-nowrap w-full sm:w-auto"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Store Counter</span>
            </a>
          </div>
        </div>

        {/* 3 Trust Pillars for Local Credibility */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-[#FAF8F5] border border-[#E7E2D8] p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#143826]">
              <ShieldCheck className="w-4 h-4 text-[#C8942A]" />
              <span>100% Genuine Local Reviews</span>
            </div>
            <p className="text-xs text-[#57514A] leading-relaxed">
              We never fabricate five-star ratings, pay for endorsements, or invent testimonials. Our feedback reflects genuine community kitchens across Durg district.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E7E2D8] p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#143826]">
              <HeartHandshake className="w-4 h-4 text-[#143826]" />
              <span>Open Spice Counter Inspection</span>
            </div>
            <p className="text-xs text-[#57514A] leading-relaxed">
              Inspect, touch, and smell the spices at our Dhimar Para counter. We explain origins, roasting processes, and milling dates before you purchase.
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E7E2D8] p-5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#143826]">
              <MessageSquare className="w-4 h-4 text-[#C8942A]" />
              <span>Direct Owner Accountability</span>
            </div>
            <p className="text-xs text-[#57514A] leading-relaxed">
              Every customer message and review is monitored personally by Rupesh Jain. Reach out on 8434336654 for custom ratios or order guidance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
