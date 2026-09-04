import React, { useEffect, useState, useTransition, useRef } from 'react';
import { CustomerAddress, Service, ServiceCategory, BannerSlide, CartItem } from '../types';
import { fetchCategories, fetchServices } from '../lib/supabase';
import { getBannerSlides } from '../lib/adminStore';
import { getTechnicianVisual } from '../data/technicianVisuals';
import { CATEGORIES_MASTER } from '../data/serviceCatalogMaster';
import { CategoryIcon } from './CategoryIcon';
import { ServiceCard } from './ServiceCard';
import { VfxCard, GlowColor } from './VfxCard';
import { Search, MapPin, Sparkles, Filter, X, ArrowRight, ArrowLeft, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight, Navigation } from 'lucide-react';

interface ServiceCatalogViewProps {
  currentAddress: CustomerAddress;
  onOpenLocationModal: () => void;
  onAutoDetectLocation?: () => void;
  isLocating?: boolean;
  onSelectServiceToBook: (service: Service) => void;
  initialCategorySlug?: string;
  onGoBack?: () => void;
  cartItems?: CartItem[];
  onAddToCart?: (service: Service) => void;
  onUpdateCartHours?: (serviceId: string, delta: number) => void;
  onOpenCart?: () => void;
}

export const ServiceCatalogView: React.FC<ServiceCatalogViewProps> = ({
  currentAddress,
  onOpenLocationModal,
  onAutoDetectLocation,
  isLocating,
  onSelectServiceToBook,
  initialCategorySlug,
  onGoBack,
  cartItems = [],
  onAddToCart,
  onUpdateCartHours,
  onOpenCart
}) => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  // Banner Carousel State
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isHoveringBanner, setIsHoveringBanner] = useState<boolean>(false);

  // Load Categories & Slides on mount
  useEffect(() => {
    async function loadCats() {
      const data = await fetchCategories();
      setCategories(data);
    }
    loadCats();

    const loadSlides = () => {
      const allSlides = getBannerSlides();
      const activeOnly = allSlides.filter(s => s.is_active !== false);
      setBannerSlides(activeOnly.length > 0 ? activeOnly : allSlides);
    };
    loadSlides();

    const handleBannerUpdate = () => loadSlides();
    const handleServiceUpdate = () => {
      fetchServices(selectedCategory, searchQuery).then(setServices);
    };

    window.addEventListener('doorbly_banners_updated', handleBannerUpdate);
    window.addEventListener('doorbly_services_updated', handleServiceUpdate);

    return () => {
      window.removeEventListener('doorbly_banners_updated', handleBannerUpdate);
      window.removeEventListener('doorbly_services_updated', handleServiceUpdate);
    };
  }, []);

  // Carousel Auto-Advancing Timer
  useEffect(() => {
    if (bannerSlides.length <= 1 || isHoveringBanner) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerSlides.length, isHoveringBanner]);

  // Update selectedCategory if initialCategorySlug changes
  useEffect(() => {
    if (initialCategorySlug) {
      setSelectedCategory(initialCategorySlug);
    }
  }, [initialCategorySlug]);

  // Fetch services when category or search changes
  useEffect(() => {
    let isCurrent = true;
    setLoading(true);

    const timer = setTimeout(() => {
      fetchServices(selectedCategory, searchQuery)
        .then((data) => {
          if (isCurrent) {
            setServices(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isCurrent) setLoading(false);
        });
    }, 150);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery]);

  const activeCategoryObj = categories.find(c => c.slug === selectedCategory);
  const activeSlide = bannerSlides[currentSlideIndex] || bannerSlides[0];

  const getCategoryGlow = (slug: string): GlowColor => {
    if (slug.includes('electrical') || slug.includes('tech') || slug.includes('appliance')) return 'cyan';
    if (slug.includes('clean') || slug.includes('agri') || slug.includes('garden') || slug.includes('farm') || slug.includes('livestock')) return 'emerald';
    if (slug.includes('paint') || slug.includes('event') || slug.includes('handicraft') || slug.includes('tailor') || slug.includes('beauty')) return 'amber';
    return 'indigo';
  };

  const handleNextSlide = () => {
    if (bannerSlides.length > 1) {
      setCurrentSlideIndex((prev) => (prev + 1) % bannerSlides.length);
    }
  };

  const handlePrevSlide = () => {
    if (bannerSlides.length > 1) {
      setCurrentSlideIndex((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    }
  };

  const handleSlideCtaClick = (slide: BannerSlide) => {
    if (slide.cta_category_slug) {
      setSelectedCategory(slide.cta_category_slug);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      {/* Back button if viewing filtered category */}
      {(selectedCategory !== 'all' || onGoBack) && (
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              if (selectedCategory !== 'all') {
                setSelectedCategory('all');
              } else if (onGoBack) {
                onGoBack();
              }
            }}
            id="btn-goback-catalog"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-emerald-700 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{selectedCategory !== 'all' ? 'Back to All Services' : 'Go Back'}</span>
          </button>
        </div>
      )}

      {/* Main Page Banner Carousel Slides */}
      {activeSlide && (
        <div
          onMouseEnter={() => setIsHoveringBanner(true)}
          onMouseLeave={() => setIsHoveringBanner(false)}
          className={`group bg-gradient-to-br ${
            activeSlide.bg_gradient || 'from-slate-950 via-[#0c142b] to-[#060a17]'
          } rounded-3xl p-6 sm:p-8 lg:p-10 mb-8 relative overflow-hidden border border-white/10 shadow-2xl shadow-slate-950/70 transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5`}
        >
          {/* Deep Ambient Lighting & Glow Orbs */}
          <div className="pointer-events-none absolute -top-24 -right-16 w-80 sm:w-96 h-80 sm:h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-12 w-64 sm:w-80 h-64 sm:h-80 bg-emerald-500/15 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_70%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Optional Right Slide Background Image with subtle cinematic zoom and blend */}
          {activeSlide.image_url && (
            <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 pointer-events-none overflow-hidden">
              <img
                src={activeSlide.image_url}
                alt={activeSlide.title}
                className="w-full h-full object-cover object-center opacity-30 sm:opacity-45 mix-blend-luminosity transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 sm:via-slate-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent sm:hidden" />
            </div>
          )}

          <div className="relative z-10 max-w-2xl">
            {activeSlide.badge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3.5 bg-white/10 backdrop-blur-md border border-white/15 text-emerald-300 shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="tracking-wide">{activeSlide.badge}</span>
              </div>
            )}

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3 drop-shadow-sm">
              {activeSlide.title}
            </h2>

            <p className="text-xs sm:text-sm md:text-base leading-relaxed text-slate-300 mb-5 max-w-xl font-normal">
              {activeSlide.subtitle}
            </p>

            {/* Micro Feature Tags for Style & Trust */}
            <div className="flex flex-wrap items-center gap-2 mb-6 text-[11px] text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>⚡ 15-Min Fast Dispatch</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>🛡️ 100% Background Verified</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>★ 4.9/5 Rated Odisha Helpers</span>
              </span>
            </div>

            {/* Location & CTA Chips */}
            <div className="flex flex-wrap items-center gap-3">
              {activeSlide.cta_text && (
                <button
                  onClick={() => handleSlideCtaClick(activeSlide)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 active:scale-95 text-slate-950 rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/40 cursor-pointer"
                >
                  <span>{activeSlide.cta_text}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onOpenLocationModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-sm hover:border-white/25"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  Service Area: <strong className="text-white font-semibold">{currentAddress.area || currentAddress.city}, {currentAddress.district} (Odisha)</strong>
                </span>
                <span className="text-[10px] text-emerald-400 underline ml-1 font-semibold">Change</span>
              </button>
            </div>
          </div>

          {/* Carousel Arrows & Dot Indicators */}
          {bannerSlides.length > 1 && (
            <div className="relative z-10 flex items-center justify-between mt-6 pt-4 border-t border-white/10">
              {/* Dot indicators */}
              <div className="flex items-center gap-2">
                {bannerSlides.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    onClick={() => setCurrentSlideIndex(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentSlideIndex
                        ? 'w-8 bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm shadow-emerald-400/50'
                        : 'w-2 bg-white/25 hover:bg-white/50'
                    }`}
                    title={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevSlide}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  title="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/15 backdrop-blur-md transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                  title="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search & Category Filter Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 mb-8 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            id="input-service-search"
            placeholder="Search verified hourly skills (e.g. Babysitter, Electrician, Carpenter, Cleaning, AC Technician)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium text-slate-900 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 p-0.5 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Category Filter Tabs (Single non-repeating filter) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-3 pt-3 border-t border-slate-100 no-scrollbar">
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all' && !searchQuery
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => { setSelectedCategory(cat.slug); setSearchQuery(''); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.slug
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {selectedCategory !== 'all' && activeCategoryObj && (
          <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-xs">
            <span className="text-slate-600">
              Filtered Category: <strong className="text-slate-900">{activeCategoryObj.name}</strong>
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
            >
              Show All Categories
            </button>
          </div>
        )}
      </div>

      {/* View Mode: If searching or category is filtered, show the filtered service list. Otherwise show Category Grid & Featured Services */}
      {selectedCategory !== 'all' || searchQuery ? (
        <div className="animate-in fade-in duration-200">
          {/* Filtered Services Count & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {activeCategoryObj ? activeCategoryObj.name : 'Search Results'}
              </h2>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                {loading ? 'Searching catalog...' : `Showing ${services.length} verified hourly ${services.length === 1 ? 'service' : 'services'} in Odisha`}
                {searchQuery && <span> matching "<strong className="text-slate-800">{searchQuery}</strong>"</span>}
              </div>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2.5 py-1 rounded-full">
                Transparent Hourly Rates
              </span>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
              >
                View All Categories
              </button>
            </div>
          </div>

          {/* Services Grid for filtered search/category */}
          {loading ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading verified services...
            </div>
          ) : services.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No services found</h3>
              <p className="text-xs text-slate-500 mb-4">
                No service partner is currently listed for "{searchQuery}". Try searching for electrical, carpentry, cleaning, tutoring, or general helper.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Clear Search & View Categories
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4.5">
              {services.map((service) => {
                const cItem = cartItems.find(it => it.service.id === service.id);
                return (
                  <ServiceCard
                    key={service.id || service.slug}
                    service={service}
                    onBook={onSelectServiceToBook}
                    isInCart={!!cItem}
                    cartHours={cItem?.hours}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Default Main Page: Structured Category Explorer & Featured Services */
        <div className="space-y-10 animate-in fade-in duration-200">
          {/* Category Exploration Section */}
          <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Explore by Service Category
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Select a trade or service to view verified Odisha professionals & transparent hourly pricing
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full hidden sm:inline-block">
                {categories.length} Trade Categories
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const masterDef = CATEGORIES_MASTER.find(m => m.slug === cat.slug);
                const iconName = masterDef?.icon || 'Wrench';

                return (
                  <VfxCard
                    key={cat.slug}
                    id={`cat-card-${cat.slug}`}
                    onClick={() => setSelectedCategory(cat.slug)}
                    glowColor="emerald"
                    className="h-full"
                  >
                    <div className="p-5 h-full flex flex-col justify-between relative bg-white transition-colors duration-200">
                      <div className="relative z-10">
                        {/* Category Icon Badge with hover reaction */}
                        <div className="flex items-center justify-between mb-3.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-700 border border-slate-200/80 group-hover:border-emerald-200 flex items-center justify-center transition-all duration-200 shadow-xs">
                            <CategoryIcon name={iconName} className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-700 bg-slate-100 group-hover:bg-emerald-50 px-2.5 py-0.5 rounded-full border border-slate-200/60 group-hover:border-emerald-200 transition-all duration-200">
                            {cat.service_count || 12} Skills
                          </span>
                        </div>

                        <h3 className="text-slate-900 text-base card-title leading-snug mb-1.5 group-hover:text-emerald-700 transition-colors duration-200">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 card-text">
                          {cat.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100/90 flex items-center justify-between text-xs relative z-10">
                        <span className="text-slate-500 text-[11px] card-subtext">
                          Hourly verified
                        </span>
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors card-action">
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </VfxCard>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
