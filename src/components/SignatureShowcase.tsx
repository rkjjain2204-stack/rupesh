import React, { useState } from 'react';
import { Search, Flame, Sparkles, Filter, ChevronRight, CheckCircle2, Package, ArrowUpRight } from 'lucide-react';
import { Product, StoreConfig } from '../types/store';
import { ProductCard } from './ProductCard';

interface Props {
  products: Product[];
  config: StoreConfig;
  onSelectProduct: (product: Product, packIndex: number) => void;
}

export const SignatureShowcase: React.FC<Props> = ({
  products,
  config,
  onSelectProduct,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'signature-masala' | 'pure-spices' | 'tea-staples' | 'whole-spices-dryfruits'
  >('all');
  const [inHouseOnly, setInHouseOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Signature flagship items
  const signatureItems = products.filter((p) => p.isSignature);

  // Filtered catalogue
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'all' || p.category === activeCategory;
    const matchesInHouse = !inHouseOnly || p.isStorePrepared;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.hindiName && p.hindiName.includes(searchQuery)) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesInHouse && matchesSearch;
  });

  const categories = [
    { id: 'all', label: 'All Items', count: products.length },
    {
      id: 'signature-masala',
      label: 'Signature Masalas',
      count: products.filter((p) => p.category === 'signature-masala').length,
    },
    {
      id: 'pure-spices',
      label: 'Pure Ground Spices',
      count: products.filter((p) => p.category === 'pure-spices').length,
    },
    {
      id: 'tea-staples',
      label: 'Tea & Leaf Blends',
      count: products.filter((p) => p.category === 'tea-staples').length,
    },
    {
      id: 'whole-spices-dryfruits',
      label: 'Whole Spices & Nuts',
      count: products.filter((p) => p.category === 'whole-spices-dryfruits').length,
    },
  ];

  return (
    <section id="signature-masalas" className="py-16 sm:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E7E2D8]">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#143826]">
              <span>Handcrafted Catalogue</span>
              <span aria-hidden="true" className="text-[#D49B28]">·</span>
              <span>Prepared In-Store</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#143826] leading-tight">
              Signature Masalas & Authentic Pantry Spices
            </h2>

            <p className="text-base text-[#57514A] leading-relaxed">
              Every blend is made with whole hand-sifted spices, low-flame toasted and ground in small weekly batches. Distinguish store-prepared masalas from curated daily staples with transparent weights and honest prices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#78716C]">
              Showing <strong className="text-[#143826] font-mono">{filteredProducts.length}</strong> verified products
            </span>
          </div>
        </div>

        {/* Flagship Signature Masalas Spotlight */}
        <div className="bg-[#EFECE6]/70 border border-[#D9D3C7] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#143826] text-[#D49B28] rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#143826]">
                  Flagship Store Preparations
                </h3>
                <p className="text-xs text-[#57514A]">
                  Our top 6 freshly milled signature preparations, celebrated by neighbourhood families for 20 years.
                </p>
              </div>
            </div>

            <div className="text-xs text-[#143826] font-medium bg-white px-3 py-1.5 rounded-md border border-[#D9D3C7] self-start sm:self-auto">
              Weekly Small Batches
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {signatureItems.slice(0, 6).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectProduct(item, 0)}
                className="group p-3 bg-white border border-[#E7E2D8] hover:border-[#143826] rounded-xl text-left transition-all hover:shadow-sm flex flex-col justify-between"
              >
                <div className="aspect-square rounded-lg bg-[#FAF8F5] overflow-hidden mb-2 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1 right-1 bg-[#143826] text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-3 h-3 text-[#D49B28]" />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-serif font-bold text-[#143826] line-clamp-1 group-hover:text-[#1B4332]">
                    {item.name}
                  </h4>
                  <div className="text-[11px] font-mono text-[#D49B28] font-bold mt-1">
                    From ₹{item.packs[0]?.price}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Functional Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFECE6] rounded-lg">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeCategory === cat.id
                      ? 'bg-white text-[#143826] shadow-xs font-semibold'
                      : 'text-[#57514A] hover:text-[#1C1917]'
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            {/* In-House Store Prepared Toggle & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <label className="inline-flex items-center gap-2 text-xs font-medium text-[#143826] bg-[#FAF8F5] px-3 py-1.5 border border-[#D9D3C7] rounded-md cursor-pointer hover:bg-[#EFECE6] transition-colors select-none">
                <input
                  type="checkbox"
                  checked={inHouseOnly}
                  onChange={(e) => setInHouseOnly(e.target.checked)}
                  className="rounded text-[#143826] focus:ring-0 cursor-pointer"
                />
                <span>Store-Prepared Only</span>
              </label>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search spices, haldi, ingredients..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#D9D3C7] rounded-md focus:outline-hidden focus:border-[#143826] text-[#1C1917] placeholder-[#78716C]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                config={config}
                onSelect={(prod, packIdx) => onSelectProduct(prod, packIdx)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-[#EFECE6]/50 rounded-xl border border-dashed border-[#D9D3C7] space-y-3">
            <Package className="w-8 h-8 text-[#78716C] mx-auto opacity-50" />
            <p className="text-sm text-[#78716C]">
              No products found matching your filter selection.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setInHouseOnly(false);
              }}
              className="text-xs font-semibold text-[#143826] underline hover:text-[#1B4332]"
            >
              Reset all filters
            </button>
          </div>
        )}

        {/* Clear Packaging & Custom Weight Notice */}
        <div className="p-6 bg-[#FAF8F5] border border-[#E7E2D8] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-[#57514A]">
          <div className="space-y-1 max-w-2xl">
            <strong className="text-sm font-semibold text-[#143826] block">
              Need Custom Weight or Bulk Event Packaging?
            </strong>
            <p>
              Beyond our standard retail packs (50g to 1kg), we provide custom 2kg, 5kg, and 10kg sealed containers for family weddings, temple bhandaras, caterers, and festive gift boxes. Please give us 24–48 hours notice for freshly roasted grinding.
            </p>
          </div>

          <a
            href="#contact"
            className="shrink-0 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] bg-[#143826] hover:bg-[#1B4332] rounded shadow-xs transition-colors whitespace-nowrap"
          >
            Request Bulk Quote
          </a>
        </div>
      </div>
    </section>
  );
};
