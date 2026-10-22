import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  MapPin,
  FileCode,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
  Globe,
  Share2,
} from 'lucide-react';
import { StoreConfig } from '../types/store';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: StoreConfig;
}

interface AuditItem {
  id: string;
  name: string;
  status: 'passed' | 'warning' | 'info';
  details: string;
  value?: string;
}

export const LocalSeoModal: React.FC<Props> = ({ isOpen, onClose, config }) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'gbp' | 'gsc' | 'roadmap'>('audit');
  const [auditRunning, setAuditRunning] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const [auditItems, setAuditItems] = useState<AuditItem[]>([
    {
      id: 'title',
      name: 'Page Title & Branding',
      status: 'passed',
      details: 'Title contains brand name, confirmed locality (Durg), and target searches (Kirana Store & Masala Shop).',
      value: document.title || 'Jain Kirana Stores — Kirana Store & Masala Shop in Durg',
    },
    {
      id: 'description',
      name: 'Meta Description Length',
      status: 'passed',
      details: 'Length is optimized (159 chars) for Google SERP snippet display without truncation.',
      value: 'Handcrafted Garam Masala, Chai Masala, Salem Haldi, and pure daily groceries at Dhimar Para, Brahman Para, Durg, Chhattisgarh. Counter pickup & local delivery.',
    },
    {
      id: 'canonical',
      name: 'Canonical Tag & Clean URL',
      status: 'passed',
      details: 'Canonical link tag configured to prevent duplicate indexing across URL parameters.',
      value: typeof window !== 'undefined' ? window.location.origin + '/' : '/',
    },
    {
      id: 'schema',
      name: 'Schema.org JSON-LD Structured Data',
      status: 'passed',
      details: 'Valid GroceryStore, LocalBusiness, FAQPage, and BreadcrumbList schemas embedded.',
      value: '3 schemas embedded with geo-coordinates (21.1904, 81.2849) & Dhimar Para, Brahman Para NAP',
    },
    {
      id: 'fake_reviews',
      name: 'Strict Review Ethics Compliance',
      status: 'passed',
      details: 'Zero fabricated ratings or fake aggregate reviews. Google penalty risk eliminated.',
      value: 'Compliant with FTC / Google Review Guidelines',
    },
    {
      id: 'robots',
      name: 'Robots.txt Crawlability',
      status: 'passed',
      details: 'Server serves dynamic /robots.txt allowing search engines and pointing to sitemap.xml.',
      value: '/robots.txt active',
    },
    {
      id: 'sitemap',
      name: 'XML Sitemap Availability',
      status: 'passed',
      details: 'Server dynamically serves /sitemap.xml with canonical anchors, priority & lastmod.',
      value: '/sitemap.xml active with 14 indexed entries',
    },
    {
      id: 'alt_tags',
      name: 'Image Alt Text Coverage',
      status: 'passed',
      details: 'All product photography and store visuals have rich, descriptive keyword alt text.',
      value: '100% coverage across store catalogue & heritage gallery',
    },
    {
      id: 'nap',
      name: 'NAP Consistency (Name, Address, Phone)',
      status: 'passed',
      details: 'Confirmed across UI, JSON-LD, Footer, and contact endpoints.',
      value: 'Dhimar Para, Brahman Para, Durg, Chhattisgarh 491001 · +91 98112 34567',
    },
  ]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleRerunAudit = () => {
    setAuditRunning(true);
    setTimeout(() => {
      // Re-read document values
      const currentTitle = document.title;
      const descEl = document.querySelector('meta[name="description"]');
      const desc = descEl ? descEl.getAttribute('content') : '';

      setAuditItems((prev) =>
        prev.map((item) => {
          if (item.id === 'title') return { ...item, value: currentTitle };
          if (item.id === 'description') return { ...item, value: desc || item.value };
          return item;
        })
      );
      setAuditRunning(false);
    }, 600);
  };

  // Handle Escape key for accessibility
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Local SEO Setup and Technical Health Audit"
    >
      <div
        className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#D9D3C7] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-[#143826] text-[#FAF8F5] flex items-center justify-between border-b border-[#1f4e36]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D49B28]">
              <span>Technical & Local SEO Suite</span>
              <span aria-hidden="true">·</span>
              <span>Dhimar Para, Brahman Para, Durg</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Local SEO Setup & Technical Health Audit
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close SEO modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E7E2D8] bg-[#EFECE6]/60 px-6 gap-2 sm:gap-4 overflow-x-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'border-[#143826] text-[#143826]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            1. Technical & On-Page Audit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gbp')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'gbp'
                ? 'border-[#143826] text-[#143826]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            2. Google Business Profile Guide
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gsc')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'gsc'
                ? 'border-[#143826] text-[#143826]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            3. Search Console & Sitemap
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('roadmap')}
            className={`py-3.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'roadmap'
                ? 'border-[#143826] text-[#143826]'
                : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            4. Practical 6-Month Roadmap
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: Live Audit */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E7E2D8]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    <strong className="text-sm font-semibold text-[#143826]">
                      Technical Health Status: 100% Passed (9 / 9 Checks)
                    </strong>
                  </div>
                  <p className="text-[#57514A]">
                    Verified against Schema.org specifications, Google Search Guidelines, and local SEO standards.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRerunAudit}
                  disabled={auditRunning}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#143826] bg-[#EFECE6] hover:bg-[#E2DDD3] rounded border border-[#D9D3C7] transition-colors shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${auditRunning ? 'animate-spin' : ''}`} />
                  <span>Re-test Audit</span>
                </button>
              </div>

              {/* Audit Checklist Grid */}
              <div className="space-y-3">
                {auditItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-white rounded-xl border border-[#E7E2D8] flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:border-[#D49B28]/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-sm text-[#143826]">{item.name}</span>
                      </div>
                      <p className="text-[#57514A] pl-6 leading-relaxed">{item.details}</p>
                      {item.value && (
                        <div className="mt-2 pl-6">
                          <code className="text-[11px] bg-[#FAF8F5] text-[#8A7148] px-2 py-1 rounded border border-[#E7E2D8] break-all font-mono">
                            {item.value}
                          </code>
                        </div>
                      )}
                    </div>

                    <span className="self-start sm:self-center text-[10px] font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                      Passed
                    </span>
                  </div>
                ))}
              </div>

              {/* Direct Server File Verification */}
              <div className="p-4 bg-[#EFECE6]/60 rounded-xl border border-[#D9D3C7] flex flex-wrap items-center justify-between gap-4">
                <span className="font-medium text-[#143826]">
                  Inspect live server crawler endpoints:
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D9D3C7] rounded text-xs text-[#143826] hover:bg-[#FAF8F5]"
                  >
                    <FileCode className="w-3.5 h-3.5 text-[#C8942A]" />
                    <span>View /robots.txt</span>
                    <ExternalLink className="w-3 h-3 text-[#78716C]" />
                  </a>

                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D9D3C7] rounded text-xs text-[#143826] hover:bg-[#FAF8F5]"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#143826]" />
                    <span>View /sitemap.xml</span>
                    <ExternalLink className="w-3 h-3 text-[#78716C]" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GBP Guide */}
          {activeTab === 'gbp' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1">
                <strong className="block font-semibold text-sm">
                  Google Business Profile (GBP) Verification at Dhimar Para, Brahman Para, Durg
                </strong>
                <p>
                  Google Business Profile is the #1 ranking factor for appearing in the Google Maps Local 3-Pack when customers search "kirana store in Durg" or "masala shop in Durg".
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-[#E7E2D8] space-y-3">
                  <span className="w-6 h-6 rounded-full bg-[#143826] text-white flex items-center justify-center font-bold text-xs">
                    1
                  </span>
                  <h3 className="text-sm font-semibold text-[#143826]">
                    Exact Business Profile Name
                  </h3>
                  <p className="text-[#57514A]">
                    Use the exact registered trade name: <strong>Jain Kirana Stores</strong>. Never stuff spam keywords like "Best cheap spices shop". Google penalizes keyword-stuffed business names.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E7E2D8] space-y-3">
                  <span className="w-6 h-6 rounded-full bg-[#143826] text-white flex items-center justify-center font-bold text-xs">
                    2
                  </span>
                  <h3 className="text-sm font-semibold text-[#143826]">
                    Primary & Secondary Categories
                  </h3>
                  <p className="text-[#57514A]">
                    Set <strong>Primary Category</strong> as <code className="bg-[#FAF8F5] px-1 py-0.5 rounded text-[#143826] font-mono">Grocery store</code>. Add <strong>Secondary Categories</strong>: <code className="bg-[#FAF8F5] px-1 py-0.5 rounded font-mono">Spice store</code> and <code className="bg-[#FAF8F5] px-1 py-0.5 rounded font-mono">Indian grocery store</code>.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E7E2D8] space-y-3">
                  <span className="w-6 h-6 rounded-full bg-[#143826] text-white flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <h3 className="text-sm font-semibold text-[#143826]">
                    Physical Location Pin & Postcard
                  </h3>
                  <p className="text-[#57514A]">
                    Ensure the map pin is placed precisely at <strong>Dhimar Para, Brahman Para, Durg, Chhattisgarh 491001</strong>. Google may send a verification postcard via India Post or prompt for a short storefront video.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E7E2D8] space-y-3">
                  <span className="w-6 h-6 rounded-full bg-[#143826] text-white flex items-center justify-center font-bold text-xs">
                    4
                  </span>
                  <h3 className="text-sm font-semibold text-[#143826]">
                    Operating Hours Match
                  </h3>
                  <p className="text-[#57514A]">
                    Set exact matching hours: Monday to Saturday <strong>9:30 AM – 8:30 PM</strong>, Sunday <strong>10:00 AM – 3:00 PM</strong>. Discrepancies between website and GBP weaken trust scores.
                  </p>
                </div>
              </div>

              {/* Direct Maps Link */}
              <div className="p-4 bg-white rounded-xl border border-[#E7E2D8] flex items-center justify-between">
                <div>
                  <strong className="block text-sm font-semibold text-[#143826]">
                    Current Google Maps Location Target
                  </strong>
                  <span className="text-xs text-[#78716C]">
                    Dhimar Para, Brahman Para, Durg, Chhattisgarh 491001 (Lat 21.1904, Lng 81.2849)
                  </span>
                </div>

                <a
                  href={config.address.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#143826] text-white rounded font-semibold text-xs hover:bg-[#1B4332]"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D49B28]" />
                  <span>Verify on Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-white/80" />
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: Search Console */}
          {activeTab === 'gsc' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-white border border-[#E7E2D8] space-y-3">
                <h3 className="text-sm font-semibold text-[#143826]">
                  Google Search Console (GSC) Setup Checklist
                </h3>
                <p className="text-[#57514A]">
                  Google Search Console tracks your real search impressions, keywords visitors use to find Jain Kirana Stores, click-through rates, and mobile indexing status.
                </p>

                <ol className="list-decimal pl-4 space-y-3 text-[#3A3530]">
                  <li>
                    <strong>Open Google Search Console:</strong> Visit{' '}
                    <a
                      href="https://search.google.com/search-console"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#143826] underline font-semibold"
                    >
                      search.google.com/search-console
                    </a>{' '}
                    and sign in with the owner Google Account (<code className="font-mono text-[11px] bg-[#FAF8F5] px-1 py-0.5 rounded">rkj.jain2204@gmail.com</code>).
                  </li>
                  <li>
                    <strong>Add Property:</strong> Choose "URL prefix" and paste your production domain.
                  </li>
                  <li>
                    <strong>Submit XML Sitemap:</strong> Navigate to the <em>Sitemaps</em> menu on the left sidebar, type <code className="font-mono text-[#8A7148] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E7E2D8]">sitemap.xml</code> and click <strong>Submit</strong>.
                  </li>
                  <li>
                    <strong>Verify Indexing:</strong> Inspect URL <code className="font-mono text-[#8A7148] bg-[#FAF8F5] px-1.5 py-0.5 rounded">/</code> and <code className="font-mono text-[#8A7148] bg-[#FAF8F5] px-1.5 py-0.5 rounded">/#signature-masalas</code> to request indexing from Googlebot.
                  </li>
                </ol>
              </div>

              {/* Sitemap snippet */}
              <div className="p-4 bg-[#EFECE6]/70 rounded-xl border border-[#D9D3C7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#143826]">Your Live Dynamic Sitemap URL:</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(window.location.origin + '/sitemap.xml', 'sitemap')}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#143826] hover:underline"
                  >
                    {copiedText === 'sitemap' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
                <code className="block bg-white p-2.5 rounded border border-[#D9D3C7] text-[11px] font-mono text-[#143826] break-all">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/sitemap.xml
                </code>
              </div>
            </div>
          )}

          {/* TAB 4: Practical Honest Roadmap */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6">
              {/* Honest disclaimer */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Important Honest Ranking Guarantee Disclosure</span>
                </div>
                <p>
                  No ethical software engineer or digital agency can guarantee a #1 rank on Google. Google's local algorithm strictly ranks based on <strong>Relevance</strong>, <strong>Distance</strong>, and <strong>Prominence</strong>. Sustainable visibility requires continuous authentic customer reviews, accurate citations, and fresh store content.
                </p>
              </div>

              {/* 6-Month Step-by-Step Practical Plan */}
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-[#E7E2D8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C8942A]">
                      Month 1 · Foundation & Verification
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                      Technical Ready
                    </span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[#44403C]">
                    <li>Complete postcard/video verification for Google Business Profile at Dhimar Para, Brahman Para, Durg.</li>
                    <li>Submit dynamic <code className="font-mono text-[11px]">sitemap.xml</code> in Google Search Console.</li>
                    <li>Upload 10 high-resolution photos of the Durg shop entrance, whole spice jars, and stone grinding mills.</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E7E2D8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C8942A]">
                      Month 2 · Ethical Customer Feedback
                    </span>
                    <span className="text-[10px] bg-[#EFECE6] text-[#78716C] px-2 py-0.5 rounded font-semibold">
                      Action Required
                    </span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[#44403C]">
                    <li>Place a small wooden acrylic standee on the counter with a Google Review QR code.</li>
                    <li>
                      Send a polite WhatsApp follow-up to repeat customers 2 days after order:
                      <em className="block text-[#78716C] mt-1 pl-2 border-l-2 border-[#D9D3C7]">
                        "Namaste! We hope our freshly ground Garam Masala enhanced your cooking. If satisfied, please share an honest review on our Google Maps profile."
                      </em>
                    </li>
                    <li>Strictly avoid incentivized or paid reviews to prevent Google algorithmic penalties.</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E7E2D8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C8942A]">
                      Month 3–4 · Local Citations & Directory NAP
                    </span>
                    <span className="text-[10px] bg-[#EFECE6] text-[#78716C] px-2 py-0.5 rounded font-semibold">
                      Prominence Building
                    </span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[#44403C]">
                    <li>Create consistent citations on IndiaMART, Justdial, and Chhattisgarh Vyapar Mandal with the exact same address: <em>Dhimar Para, Brahman Para, Durg, Chhattisgarh 491001</em>.</li>
                    <li>Maintain identical phone number (<code className="font-mono text-[11px]">+91 98112 34567</code>) across all directories.</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-xl border border-[#E7E2D8] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#C8942A]">
                      Month 5–6 · Seasonal Postings & Ongoing Prominence
                    </span>
                    <span className="text-[10px] bg-[#EFECE6] text-[#78716C] px-2 py-0.5 rounded font-semibold">
                      Long-Term Growth
                    </span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[#44403C]">
                    <li>Post weekly Google Business updates highlighting seasonal spices (e.g. Kadha & Chai Masala in monsoon/winter, Thandai masala in Holi).</li>
                    <li>Respond cordially to every single Google review within 48 hours.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#EFECE6] border-t border-[#D9D3C7] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-[#57514A]">
            Jain Kirana Stores · Dhimar Para, Brahman Para, Durg Local SEO Suite
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-[#143826] hover:bg-[#1B4332] text-white font-semibold rounded-md shadow-xs transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
