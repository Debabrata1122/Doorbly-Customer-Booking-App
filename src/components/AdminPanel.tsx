import React, { useState, useEffect, useRef } from 'react';
import { Service, BannerSlide, AppBranding, ServiceCategory } from '../types';
import {
  getCustomServices,
  saveCustomServices,
  addCustomService,
  updateCustomService,
  deleteCustomService,
  resetServicesToMaster,
  getBannerSlides,
  saveBannerSlides,
  addBannerSlide,
  updateBannerSlide,
  deleteBannerSlide,
  getBranding,
  saveBranding,
  resetBranding,
  setAdminSession,
  ADMIN_EMAIL
} from '../lib/adminStore';
import { CATEGORIES_MASTER } from '../data/serviceCatalogMaster';
import {
  ShieldAlert,
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  X,
  Search,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Layers,
  Upload,
  Eye,
  LogOut,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Check,
  AlertTriangle,
  FileText,
  Clock,
  DollarSign,
  Tag,
  Palette,
  Calendar
} from 'lucide-react';
import { AdminBookingsView } from './AdminBookingsView';
import { fetchAllBookingsForAdmin } from '../lib/supabase';

interface AdminPanelProps {
  onCloseAdmin: () => void;
  onSelectCustomerView?: () => void;
}

// Preset modern deep gradients for banner slides
const GRADIENT_PRESETS = [
  { name: 'Midnight Sapphire', value: 'from-slate-950 via-[#0c142b] to-[#060a17]' },
  { name: 'Deep Emerald Glow', value: 'from-slate-950 via-[#07241e] to-[#041512]' },
  { name: 'Oceanic Abyss', value: 'from-slate-950 via-[#0d1f33] to-[#08121f]' },
  { name: 'Royal Indigo Obsidian', value: 'from-slate-950 via-indigo-950 to-slate-900' },
  { name: 'Midnight Amethyst', value: 'from-slate-950 via-purple-950 to-slate-900' },
  { name: 'Deep Carbon Forest', value: 'from-slate-950 via-emerald-950 to-slate-900' },
];

// Presets for quick service image picking
const SERVICE_IMAGE_PRESETS = [
  { label: 'Electrician', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cleaning & Housekeeping', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80' },
  { label: 'Plumbing & Water', url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80' },
  { label: 'Carpentry & Woodwork', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80' },
  { label: 'AC & Appliance Repair', url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80' },
  { label: 'Painting & Deco', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Farming & Agriculture', url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80' },
  { label: 'Gardening & Landscape', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80' },
  { label: 'Driving & Transportation', url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Moving & Heavy Manpower', url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Beauty & Salon', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80' },
  { label: 'Home Tutor & Education', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80' },
];

export const AdminPanel: React.FC<AdminPanelProps> = ({ onCloseAdmin, onSelectCustomerView }) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'services' | 'banners' | 'branding'>('bookings');
  const [bookingsCount, setBookingsCount] = useState<number>(0);

  // Services State
  const [services, setServices] = useState<Service[]>([]);
  const [searchService, setSearchService] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingService, setIsAddingService] = useState<boolean>(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // Form State for Service Add/Edit
  const [srvName, setSrvName] = useState<string>('');
  const [srvCategory, setSrvCategory] = useState<string>(CATEGORIES_MASTER[0].name);
  const [srvPrice, setSrvPrice] = useState<number>(300);
  const [srvMinHours, setSrvMinHours] = useState<number>(1);
  const [srvMaxHours, setSrvMaxHours] = useState<number>(8);
  const [srvDescription, setSrvDescription] = useState<string>('');
  const [srvImageUrl, setSrvImageUrl] = useState<string>('');
  const [srvIsActive, setSrvIsActive] = useState<boolean>(true);
  const [srvFeatured, setSrvFeatured] = useState<boolean>(false);

  // Banner Slides State
  const [slides, setSlides] = useState<BannerSlide[]>([]);
  const [editingSlide, setEditingSlide] = useState<BannerSlide | null>(null);
  const [isAddingSlide, setIsAddingSlide] = useState<boolean>(false);
  const [slideToDelete, setSlideToDelete] = useState<BannerSlide | null>(null);

  // Form State for Slide Add/Edit
  const [slideTitle, setSlideTitle] = useState<string>('');
  const [slideSubtitle, setSlideSubtitle] = useState<string>('');
  const [slideBadge, setSlideBadge] = useState<string>('');
  const [slideImageUrl, setSlideImageUrl] = useState<string>('');
  const [slideCtaText, setSlideCtaText] = useState<string>('Explore Services');
  const [slideCtaCategory, setSlideCtaCategory] = useState<string>('all');
  const [slideGradient, setSlideGradient] = useState<string>(GRADIENT_PRESETS[0].value);
  const [slideIsActive, setSlideIsActive] = useState<boolean>(true);

  // Branding State
  const [branding, setBranding] = useState<AppBranding>(getBranding());
  const [brandName, setBrandName] = useState<string>(branding.brand_name);
  const [brandTagline, setBrandTagline] = useState<string>(branding.tagline);
  const [brandLogoUrl, setBrandLogoUrl] = useState<string>(branding.logo_url || '');
  const [brandLogoLetter, setBrandLogoLetter] = useState<string>(branding.logo_letter || 'D');
  const [brandAccentColor, setBrandAccentColor] = useState<string>(branding.accent_color || '#4f46e5');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slideFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Load Initial Data
  const refreshAllData = () => {
    setServices(getCustomServices());
    setSlides(getBannerSlides());
    const b = getBranding();
    setBranding(b);
    setBrandName(b.brand_name);
    setBrandTagline(b.tagline);
    setBrandLogoUrl(b.logo_url || '');
    setBrandLogoLetter(b.logo_letter || 'D');
    setBrandAccentColor(b.accent_color || '#4f46e5');
  };

  useEffect(() => {
    refreshAllData();

    const handleServiceSync = () => setServices(getCustomServices());
    const handleBannerSync = () => setSlides(getBannerSlides());
    const handleBrandingSync = () => {
      const b = getBranding();
      setBranding(b);
    };

    const updateBookingsCount = async () => {
      try {
        const bkgs = await fetchAllBookingsForAdmin();
        setBookingsCount(bkgs.length);
      } catch {}
    };
    updateBookingsCount();

    window.addEventListener('doorbly_services_updated', handleServiceSync);
    window.addEventListener('doorbly_banners_updated', handleBannerSync);
    window.addEventListener('doorbly_branding_updated', handleBrandingSync);
    window.addEventListener('doorbly_bookings_updated', updateBookingsCount);

    return () => {
      window.removeEventListener('doorbly_services_updated', handleServiceSync);
      window.removeEventListener('doorbly_banners_updated', handleBannerSync);
      window.removeEventListener('doorbly_branding_updated', handleBrandingSync);
      window.removeEventListener('doorbly_bookings_updated', updateBookingsCount);
    };
  }, []);

  // Handle Logout
  const handleLogout = () => {
    setAdminSession(false);
    onCloseAdmin();
  };

  // ==========================================
  // SERVICE ACTIONS
  // ==========================================
  const handleOpenAddService = () => {
    setEditingService(null);
    setSrvName('');
    setSrvCategory(CATEGORIES_MASTER[0].name);
    setSrvPrice(300);
    setSrvMinHours(1);
    setSrvMaxHours(8);
    setSrvDescription('');
    setSrvImageUrl('');
    setSrvIsActive(true);
    setSrvFeatured(false);
    setIsAddingService(true);
  };

  const handleOpenEditService = (s: Service) => {
    setEditingService(s);
    setSrvName(s.name);
    setSrvCategory(s.category_name || CATEGORIES_MASTER[0].name);
    setSrvPrice(s.customer_hourly_price);
    setSrvMinHours(s.minimum_hours);
    setSrvMaxHours(s.maximum_hours);
    setSrvDescription(s.description);
    setSrvImageUrl(s.image_url || '');
    setSrvIsActive(s.is_active !== false);
    setSrvFeatured(!!s.featured);
    setIsAddingService(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!srvName.trim()) {
      alert('Please provide a service title');
      return;
    }

    const matchedCat = CATEGORIES_MASTER.find(c => c.name === srvCategory) || CATEGORIES_MASTER[0];
    const partnerRate = Math.round(srvPrice * 0.8);

    if (editingService) {
      // Update existing
      updateCustomService(editingService.id, {
        name: srvName.trim(),
        category_name: matchedCat.name,
        category_slug: matchedCat.slug,
        category_id: `cat-${matchedCat.slug}`,
        customer_hourly_price: Number(srvPrice),
        partner_hourly_rate: partnerRate,
        minimum_hours: Number(srvMinHours),
        maximum_hours: Number(srvMaxHours),
        description: srvDescription.trim(),
        image_url: srvImageUrl.trim() || undefined,
        is_active: srvIsActive,
        featured: srvFeatured
      });
      showToast(`Updated service "${srvName.trim()}"`);
    } else {
      // Add new
      addCustomService({
        name: srvName.trim(),
        category_name: matchedCat.name,
        category_slug: matchedCat.slug,
        category_id: `cat-${matchedCat.slug}`,
        description: srvDescription.trim() || 'Professional hourly service with verified doorstep assistance.',
        pricing_type: 'hourly',
        customer_hourly_price: Number(srvPrice),
        partner_hourly_rate: partnerRate,
        commission_percentage: 20,
        minimum_hours: Number(srvMinHours),
        maximum_hours: Number(srvMaxHours),
        is_active: srvIsActive,
        image_url: srvImageUrl.trim() || undefined,
        featured: srvFeatured
      });
      showToast(`Created new service "${srvName.trim()}"`);
    }

    setIsAddingService(false);
    setEditingService(null);
    setServices(getCustomServices());
  };

  const handleDeleteService = (service: Service) => {
    deleteCustomService(service.id);
    setServiceToDelete(null);
    setServices(getCustomServices());
    showToast(`Deleted service "${service.name}"`);
  };

  // Image Upload helper for Service
  const handleServiceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setSrvImageUrl(result);
        showToast("Image loaded from local device");
      }
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // BANNER SLIDES ACTIONS
  // ==========================================
  const handleOpenAddSlide = () => {
    setEditingSlide(null);
    setSlideTitle('');
    setSlideSubtitle('');
    setSlideBadge('Special Offer');
    setSlideImageUrl('');
    setSlideCtaText('Book Now');
    setSlideCtaCategory('all');
    setSlideGradient(GRADIENT_PRESETS[0].value);
    setSlideIsActive(true);
    setIsAddingSlide(true);
  };

  const handleOpenEditSlide = (slide: BannerSlide) => {
    setEditingSlide(slide);
    setSlideTitle(slide.title);
    setSlideSubtitle(slide.subtitle);
    setSlideBadge(slide.badge || '');
    setSlideImageUrl(slide.image_url || '');
    setSlideCtaText(slide.cta_text || 'Explore');
    setSlideCtaCategory(slide.cta_category_slug || 'all');
    setSlideGradient(slide.bg_gradient || GRADIENT_PRESETS[0].value);
    setSlideIsActive(slide.is_active !== false);
    setIsAddingSlide(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideTitle.trim()) {
      alert('Please enter a slide title');
      return;
    }

    if (editingSlide) {
      updateBannerSlide(editingSlide.id, {
        title: slideTitle.trim(),
        subtitle: slideSubtitle.trim(),
        badge: slideBadge.trim() || undefined,
        image_url: slideImageUrl.trim() || undefined,
        cta_text: slideCtaText.trim() || 'Explore',
        cta_category_slug: slideCtaCategory,
        bg_gradient: slideGradient,
        is_active: slideIsActive
      });
      showToast('Banner slide updated successfully');
    } else {
      addBannerSlide({
        title: slideTitle.trim(),
        subtitle: slideSubtitle.trim(),
        badge: slideBadge.trim() || undefined,
        image_url: slideImageUrl.trim() || undefined,
        cta_text: slideCtaText.trim() || 'Explore',
        cta_category_slug: slideCtaCategory,
        bg_gradient: slideGradient,
        is_active: slideIsActive,
        sort_order: slides.length + 1
      });
      showToast('New banner slide added');
    }

    setIsAddingSlide(false);
    setEditingSlide(null);
    setSlides(getBannerSlides());
  };

  const handleDeleteSlide = (slide: BannerSlide) => {
    deleteBannerSlide(slide.id);
    setSlideToDelete(null);
    setSlides(getBannerSlides());
    showToast('Banner slide removed');
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSlides.length) return;

    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;

    // re-assign sort order
    newSlides.forEach((s, idx) => {
      s.sort_order = idx + 1;
    });

    saveBannerSlides(newSlides);
    setSlides(newSlides);
    showToast('Slide display order updated');
  };

  const handleSlideImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setSlideImageUrl(result);
        showToast("Slide image loaded from local device");
      }
    };
    reader.readAsDataURL(file);
  };

  // ==========================================
  // BRANDING & LOGO ACTIONS
  // ==========================================
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppBranding = {
      brand_name: brandName.trim() || 'DOORBLY',
      tagline: brandTagline.trim() || 'Odisha Doorstep Services',
      logo_url: brandLogoUrl.trim() || undefined,
      logo_letter: brandLogoLetter.trim().toUpperCase().slice(0, 2) || 'D',
      accent_color: brandAccentColor
    };
    saveBranding(updated);
    setBranding(updated);
    showToast('Branding & Logo updated across the entire platform!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setBrandLogoUrl(result);
        showToast("Custom logo image loaded");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetBranding = () => {
    if (confirm('Reset branding and logo to default DOORBLY settings?')) {
      resetBranding();
      refreshAllData();
      showToast('Branding reset to default');
    }
  };

  // Filtered services in table
  const filteredServices = services.filter(s => {
    const matchesCat = selectedCategoryFilter === 'all' || s.category_slug === selectedCategoryFilter || s.category_name === selectedCategoryFilter;
    const q = searchService.toLowerCase().trim();
    const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category_name?.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-200 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-xs animate-in slide-in-from-top duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-100" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP ADMIN HEADER */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-inner">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight font-mono">
                ADMIN MASTER CONTROL
              </span>
              <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Super Admin
              </span>
            </div>
            <p className="text-slate-400 text-xs font-mono">
              Logged in as: <strong className="text-indigo-300">{ADMIN_EMAIL}</strong>
            </p>
          </div>
        </div>

        {/* View Switcher & Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              onCloseAdmin();
              if (onSelectCustomerView) onSelectCustomerView();
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
            title="Preview customer storefront"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Customer Storefront</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Log out and close admin"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-300" />
            <span>Exit & Sign Out</span>
          </button>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Customer Bookings ({bookingsCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Services & Pricing ({services.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Banner Slides ({slides.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'branding'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Logo & Branding</span>
          </button>
        </div>

        {/* Quick count interactive metric cards */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs font-mono">
          <div className="bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/80 hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/10 transition-all duration-200 hover:-translate-y-0.5 cursor-default">
            <span className="text-slate-400 mr-1.5">Active Services:</span>
            <strong className="text-emerald-400 font-bold">{services.filter(s => s.is_active !== false).length}</strong>
          </div>
          <div className="bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700/80 hover:border-indigo-500/50 hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-200 hover:-translate-y-0.5 cursor-default">
            <span className="text-slate-400 mr-1.5">With Photo:</span>
            <strong className="text-indigo-400 font-bold">{services.filter(s => !!s.image_url).length}</strong>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-900">
        {/* ========================================== */}
        {/* TAB 1: SERVICES MANAGEMENT */}
        {/* ========================================== */}
        {activeTab === 'services' && (
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Action Bar */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                  <input
                    type="text"
                    value={searchService}
                    onChange={(e) => setSearchService(e.target.value)}
                    placeholder="Search by service name, category..."
                    className="w-full pl-9 pr-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-indigo-500"
                  />
                  {searchService && (
                    <button
                      onClick={() => setSearchService('')}
                      className="absolute right-3 top-2.5 text-slate-500 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 py-2 px-3 focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="all">All 30 Categories</option>
                  {CATEGORIES_MASTER.map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    if (confirm('Reset custom services back to standard master catalog (379+ services)?')) {
                      resetServicesToMaster();
                      setServices(getCustomServices());
                      showToast('Services reset to default catalog');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                  title="Reset to original 379 services"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Reset Catalog</span>
                </button>

                <button
                  onClick={handleOpenAddService}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>
            </div>

            {/* Services Table Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Service & Image</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Customer Rate</th>
                      <th className="py-3 px-4">Hours (Min-Max)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredServices.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          No services found matching your search.
                        </td>
                      </tr>
                    ) : (
                      filteredServices.slice(0, 100).map((srv) => (
                        <tr key={srv.id || srv.slug} className="hover:bg-slate-900/60 transition-colors">
                          {/* Title & Image */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              {srv.image_url ? (
                                <img
                                  src={srv.image_url}
                                  alt={srv.name}
                                  className="w-11 h-11 rounded-lg object-cover bg-slate-800 border border-slate-700 shrink-0"
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                                  <ImageIcon className="w-5 h-5" />
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                  <span>{srv.name}</span>
                                  {srv.featured && (
                                    <span className="px-1.5 py-0.2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-bold rounded">
                                      Featured
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-400 text-xs line-clamp-1 max-w-sm">
                                  {srv.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 bg-slate-800 text-indigo-300 rounded-md font-medium border border-slate-700 text-[11px]">
                              {srv.category_name}
                            </span>
                          </td>

                          {/* Customer Hourly Rate */}
                          <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                            ₹{srv.customer_hourly_price}
                            <span className="text-[11px] text-slate-400 font-normal"> /hr</span>
                          </td>

                          {/* Hours */}
                          <td className="py-3.5 px-4 text-slate-300 font-mono">
                            {srv.minimum_hours} - {srv.maximum_hours} hrs
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => {
                                const newStatus = srv.is_active === false ? true : false;
                                updateCustomService(srv.id, { is_active: newStatus });
                                setServices(getCustomServices());
                                showToast(`Set "${srv.name}" to ${newStatus ? 'Active' : 'Inactive'}`);
                              }}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer border ${
                                srv.is_active !== false
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                                  : 'bg-rose-950/80 text-rose-300 border-rose-700'
                              }`}
                            >
                              {srv.is_active !== false ? '● ACTIVE' : '○ HIDDEN'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditService(srv)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors cursor-pointer"
                                title="Edit Service & Image"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setServiceToDelete(srv)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-rose-400 transition-colors cursor-pointer"
                                title="Delete Service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {filteredServices.length > 100 && (
                <div className="p-3 bg-slate-900 text-center text-xs text-slate-400 border-t border-slate-800">
                  Showing first 100 services out of {filteredServices.length}. Use the search bar to find specific services.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: BANNER SLIDES MANAGEMENT */}
        {/* ========================================== */}
        {activeTab === 'banners' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Main Page Hero Banner Slides</h2>
                <p className="text-xs text-slate-400">
                  Manage the slides, text, background gradients, and images displayed in the main page banner carousel.
                </p>
              </div>

              <button
                onClick={handleOpenAddSlide}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Banner Slide</span>
              </button>
            </div>

            {/* Slides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`group relative rounded-2xl border ${
                    slide.is_active ? 'border-slate-800 hover:border-indigo-500/60' : 'border-dashed border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700'
                  } overflow-hidden flex flex-col shadow-lg hover:shadow-2xl hover:shadow-indigo-950/50 hover:-translate-y-1.5 transition-all duration-300 bg-slate-950`}
                >
                  {/* Subtle Top Accent Highlight on Hover */}
                  <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-indigo-500 via-sky-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30" />

                  {/* Visual Preview */}
                  <div className={`p-5 bg-gradient-to-br ${slide.bg_gradient || GRADIENT_PRESETS[0].value} text-white min-h-[160px] flex flex-col justify-between relative overflow-hidden`}>
                    {slide.image_url && (
                      <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-30 pointer-events-none overflow-hidden">
                        <img
                          src={slide.image_url}
                          alt={slide.title}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                        />
                      </div>
                    )}
                    <div className="relative z-10">
                      {slide.badge && (
                        <span className="inline-block px-2.5 py-0.5 bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 rounded-full text-[10px] font-extrabold uppercase mb-2 group-hover:bg-indigo-500/50 transition-colors">
                          {slide.badge}
                        </span>
                      )}
                      <h4 className="text-base font-extrabold line-clamp-2 leading-tight mb-1 group-hover:text-indigo-200 transition-colors">
                        {slide.title}
                      </h4>
                      <p className="text-slate-300 text-xs line-clamp-2">
                        {slide.subtitle}
                      </p>
                    </div>

                    <div className="relative z-10 mt-3 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-300 bg-black/40 group-hover:bg-black/60 px-2.5 py-1 rounded-lg transition-colors">
                        Button: {slide.cta_text || 'Explore'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Slide #{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Slide Info & Controls */}
                  <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 mt-auto">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleMoveSlide(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Slide Earlier"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(idx, 'down')}
                        disabled={idx === slides.length - 1}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                        title="Move Slide Later"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          const newStatus = !slide.is_active;
                          updateBannerSlide(slide.id, { is_active: newStatus });
                          setSlides(getBannerSlides());
                          showToast(`Slide #${idx + 1} set to ${newStatus ? 'Active' : 'Inactive'}`);
                        }}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ml-1 cursor-pointer ${
                          slide.is_active
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}
                      >
                        {slide.is_active ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditSlide(slide)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 transition-colors cursor-pointer"
                        title="Edit Slide & Image"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSlideToDelete(slide)}
                        className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950 text-rose-400 transition-colors cursor-pointer"
                        title="Delete Slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: BRANDING & LOGO */}
        {/* ========================================== */}
        {activeTab === 'branding' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Logo & Brand Customization</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload a custom logo image, change brand name, tagline, or configure the icon lettermark.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetBranding}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              </div>

              <form onSubmit={handleSaveBranding} className="space-y-6">
                {/* Live Preview Box */}
                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-3">
                    Live Header Logo Preview:
                  </span>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl text-slate-900 shadow-sm inline-flex">
                    {brandLogoUrl ? (
                      <img
                        src={brandLogoUrl}
                        alt="Logo Preview"
                        referrerPolicy="no-referrer"
                        className="h-10 max-w-[140px] object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <img
                        src="/doorbly-logo.png"
                        alt="Default Logo Preview"
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 object-contain rounded-xl"
                      />
                    )}
                    <div>
                      <span className="text-xl font-extrabold tracking-tight text-slate-900 font-['Outfit'] block leading-none">
                        {brandName || 'DOORBLY'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block mt-0.5">
                        {brandTagline || 'Odisha Doorstep Services'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Logo Image Upload or URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Custom Logo Image (PNG / SVG / JPG or Data URL)
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={brandLogoUrl}
                      onChange={(e) => setBrandLogoUrl(e.target.value)}
                      placeholder="Paste image URL (e.g. https://example.com/logo.png) or upload"
                      className="flex-1 min-w-[240px] px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-indigo-500"
                    />

                    <input
                      type="file"
                      ref={logoFileInputRef}
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => logoFileInputRef.current?.click()}
                      className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Upload File</span>
                    </button>

                    {brandLogoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setBrandLogoUrl('');
                          showToast('Logo image cleared');
                        }}
                        className="px-3 py-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Image</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Brand Name & Tagline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. DOORBLY"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Tagline / Subtext
                    </label>
                    <input
                      type="text"
                      value={brandTagline}
                      onChange={(e) => setBrandTagline(e.target.value)}
                      placeholder="e.g. Odisha Doorstep Services"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500 font-medium"
                    />
                  </div>
                </div>

                {/* Icon Lettermark */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Lettermark Symbol (when no image is set)
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={brandLogoLetter}
                      onChange={(e) => setBrandLogoLetter(e.target.value.toUpperCase())}
                      placeholder="D"
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500 font-black text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Accent Color Theme
                    </label>
                    <input
                      type="color"
                      value={brandAccentColor}
                      onChange={(e) => setBrandAccentColor(e.target.value)}
                      className="w-full h-10 p-1 bg-slate-900 border border-slate-700 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save All Branding Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 4: CUSTOMER BOOKINGS & LIVE ORDERS */}
        {/* ========================================== */}
        {activeTab === 'bookings' && (
          <AdminBookingsView onShowToast={showToast} />
        )}
      </main>

      {/* ========================================== */}
      {/* MODAL: ADD / EDIT SERVICE */}
      {/* ========================================== */}
      {isAddingService && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingService ? `Edit Service: ${editingService.name}` : 'Add New Odisha Hourly Service'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingService(false);
                  setEditingService(null);
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Service Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={srvName}
                    onChange={(e) => setSrvName(e.target.value)}
                    placeholder="e.g. Master Carpenter & Woodworker"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={srvCategory}
                    onChange={(e) => setSrvCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500 font-semibold"
                  >
                    {CATEGORIES_MASTER.map(cat => (
                      <option key={cat.slug} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Customer Hourly Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={50}
                    step={10}
                    value={srvPrice}
                    onChange={(e) => setSrvPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono font-bold focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Minimum Booking Hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={srvMinHours}
                    onChange={(e) => setSrvMinHours(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Maximum Booking Hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={srvMaxHours}
                    onChange={(e) => setSrvMaxHours(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Service Description
                </label>
                <textarea
                  rows={2}
                  value={srvDescription}
                  onChange={(e) => setSrvDescription(e.target.value)}
                  placeholder="Detailed scope of hourly work..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500 leading-relaxed"
                />
              </div>

              {/* Image Configuration */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Service Image (URL, Local File Upload, or Preset)
                </label>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={srvImageUrl}
                      onChange={(e) => setSrvImageUrl(e.target.value)}
                      placeholder="Paste image URL (https://...) or upload file below"
                      className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-indigo-500"
                    />

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleServiceImageUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 cursor-pointer shrink-0"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Upload</span>
                    </button>

                    {srvImageUrl && (
                      <button
                        type="button"
                        onClick={() => setSrvImageUrl('')}
                        className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                        title="Remove image from service"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>

                  {/* Image Preview */}
                  {srvImageUrl && (
                    <div className="flex items-center gap-3 p-2 bg-slate-900 rounded-xl border border-slate-800">
                      <img
                        src={srvImageUrl}
                        alt="Service Preview"
                        className="w-16 h-16 object-cover rounded-lg border border-slate-700"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-xs text-slate-400">
                        Image attached. Will display on customer catalog and booking card.
                      </span>
                    </div>
                  )}

                  {/* Quick Preset Selector */}
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">
                      Or pick from curated presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {SERVICE_IMAGE_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setSrvImageUrl(preset.url)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-indigo-950 border border-slate-700 hover:border-indigo-500 rounded-lg text-[10px] text-slate-300 hover:text-indigo-200 transition-colors cursor-pointer"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={srvIsActive}
                    onChange={(e) => setSrvIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                  />
                  <span>Active & Visible to Customers</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={srvFeatured}
                    onChange={(e) => setSrvFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                  />
                  <span>Highlight as "Featured"</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingService(false);
                    setEditingService(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg cursor-pointer"
                >
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: ADD / EDIT BANNER SLIDE */}
      {/* ========================================== */}
      {isAddingSlide && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingSlide ? 'Edit Banner Slide' : 'Add New Hero Banner Slide'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingSlide(false);
                  setEditingSlide(null);
                }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Slide Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={slideTitle}
                  onChange={(e) => setSlideTitle(e.target.value)}
                  placeholder="e.g. Monsoon Home Waterproofing & Repair"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={slideSubtitle}
                  onChange={(e) => setSlideSubtitle(e.target.value)}
                  placeholder="Detailed offer, pricing, or description..."
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Badge Pill Text
                  </label>
                  <input
                    type="text"
                    value={slideBadge}
                    onChange={(e) => setSlideBadge(e.target.value)}
                    placeholder="e.g. Odisha Verified Marketplace"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Button CTA Text
                  </label>
                  <input
                    type="text"
                    value={slideCtaText}
                    onChange={(e) => setSlideCtaText(e.target.value)}
                    placeholder="e.g. Book Now"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500 font-semibold"
                  />
                </div>
              </div>

              {/* Target Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Action Link / Filter Category
                </label>
                <select
                  value={slideCtaCategory}
                  onChange={(e) => setSlideCtaCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-indigo-500 font-semibold"
                >
                  <option value="all">All Services</option>
                  {CATEGORIES_MASTER.map(cat => (
                    <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Gradient Preset */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Background Color Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {GRADIENT_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setSlideGradient(preset.value)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer transition-all ${
                        slideGradient === preset.value
                          ? 'border-indigo-500 bg-slate-800'
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md bg-gradient-to-br ${preset.value} border border-white/20`} />
                      <span className="text-[10px] font-bold text-slate-300 truncate">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slide Image */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Slide Image / Graphic (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={slideImageUrl}
                    onChange={(e) => setSlideImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-indigo-500"
                  />

                  <input
                    type="file"
                    ref={slideFileInputRef}
                    onChange={handleSlideImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => slideFileInputRef.current?.click()}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1 border border-slate-700 cursor-pointer shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Upload</span>
                  </button>

                  {slideImageUrl && (
                    <button
                      type="button"
                      onClick={() => setSlideImageUrl('')}
                      className="px-3 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Active Toggle */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={slideIsActive}
                  onChange={(e) => setSlideIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500"
                />
                <span>Active in Main Banner Carousel</span>
              </label>

              {/* Submit */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingSlide(false);
                    setEditingSlide(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg cursor-pointer"
                >
                  {editingSlide ? 'Update Slide' : 'Create Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* ========================================== */}
      {(serviceToDelete || slideToDelete) && (
        <div className="fixed inset-0 z-70 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="text-base font-bold text-white mb-2">
              {serviceToDelete
                ? `Delete Service "${serviceToDelete.name}"?`
                : `Delete Slide "${slideToDelete?.title}"?`}
            </h4>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              This will remove it from the live catalog immediately. You can re-add it or reset to default later.
            </p>

            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => {
                  setServiceToDelete(null);
                  setSlideToDelete(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (serviceToDelete) handleDeleteService(serviceToDelete);
                  if (slideToDelete) handleDeleteSlide(slideToDelete);
                }}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
