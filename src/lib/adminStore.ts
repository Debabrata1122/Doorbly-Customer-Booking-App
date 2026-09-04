import { Service, BannerSlide, AppBranding } from '../types';
import { SERVICES_MASTER, CATEGORIES_MASTER } from '../data/serviceCatalogMaster';

export const ADMIN_EMAIL = 'debabrata.tribune@gmail.com';
export const ADMIN_PASSWORD = 'Devraj@1122';

const STORAGE_KEY_ADMIN_AUTH = 'doorbly_admin_auth_v1';
const STORAGE_KEY_SERVICES = 'doorbly_custom_services_v1';
const STORAGE_KEY_BANNERS = 'doorbly_banner_slides_v3';
const STORAGE_KEY_BRANDING = 'doorbly_custom_branding_v1';

// Default initial banner slides with deep, attractive, stylish colors
export const DEFAULT_BANNER_SLIDES: BannerSlide[] = [
  {
    id: 'slide-1',
    title: 'Book Verified Hourly Helpers & Technicians',
    subtitle: 'Transparent hourly pricing for 379+ doorstep services across all 30 districts of Odisha. Only pay for the exact hours booked.',
    badge: "Odisha's Verified Hourly Marketplace",
    image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Explore All Services',
    cta_category_slug: 'all',
    bg_gradient: 'from-slate-950 via-[#0c142b] to-[#060a17]',
    is_active: true,
    sort_order: 1
  },
  {
    id: 'slide-2',
    title: 'Monsoon & Seasonal Home Deep Care',
    subtitle: 'Certified AC technicians, waterproofing experts, electricians, and deep cleaning professionals ready at your doorstep.',
    badge: 'Seasonal Top Pick',
    image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Book Cleaning & AC',
    cta_category_slug: 'cleaning-household',
    bg_gradient: 'from-slate-950 via-[#07241e] to-[#041512]',
    is_active: true,
    sort_order: 2
  },
  {
    id: 'slide-3',
    title: 'Skilled Agricultural & Rural Manpower',
    subtitle: 'On-demand hourly helpers for farming, tractor driving, harvest, pond maintenance, and rural construction.',
    badge: 'Rural & Agricultural Network',
    image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    cta_text: 'Explore Farm Services',
    cta_category_slug: 'agriculture-farm-work',
    bg_gradient: 'from-slate-950 via-[#0d1f33] to-[#08121f]',
    is_active: true,
    sort_order: 3
  }
];

export const DEFAULT_BRANDING: AppBranding = {
  brand_name: 'DOORBLY',
  tagline: 'Odisha Doorstep Services',
  logo_letter: 'D',
  logo_url: '/doorbly-logo.png',
  accent_color: '#4f46e5'
};

// ==========================================
// 1. ADMIN AUTHENTICATION
// ==========================================
export function verifyAdminCredentials(email: string, pass: string): boolean {
  if (!email || !pass) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && pass.trim() === ADMIN_PASSWORD.trim();
}

export function isAdminLoggedIn(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.is_admin === true && parsed?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  } catch {
    return false;
  }
}

export function setAdminSession(active: boolean): void {
  if (active) {
    localStorage.setItem(
      STORAGE_KEY_ADMIN_AUTH,
      JSON.stringify({
        is_admin: true,
        email: ADMIN_EMAIL,
        logged_in_at: new Date().toISOString()
      })
    );
  } else {
    localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
  }
  window.dispatchEvent(new Event('doorbly_admin_auth_changed'));
}

// ==========================================
// 2. SERVICES CRUD
// ==========================================
export function getCustomServices(): Service[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SERVICES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure all SERVICES_MASTER items (including baby-child-elderly-care) are present
        const existingSlugs = new Set(parsed.map(s => s.slug));
        const missingFromMaster = SERVICES_MASTER.filter(m => !existingSlugs.has(m.slug));
        if (missingFromMaster.length > 0) {
          const appended: Service[] = missingFromMaster.map((s, idx) => ({
            id: `srv-m-${parsed.length + idx + 1}`,
            name: s.name,
            slug: s.slug,
            category_name: s.category_name,
            category_slug: s.category_slug,
            description: s.description,
            pricing_type: 'hourly' as const,
            customer_hourly_price: s.customer_hourly_price,
            partner_hourly_rate: s.partner_hourly_rate,
            commission_percentage: s.commission_percentage,
            minimum_hours: s.minimum_hours,
            maximum_hours: s.maximum_hours,
            is_active: true,
            image_url: undefined
          }));
          const merged = [...parsed, ...appended];
          saveCustomServices(merged);
          return merged;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse custom services:', err);
  }

  // Fallback initialize from master catalog
  const initial: Service[] = SERVICES_MASTER.map((s, idx) => ({
    id: `srv-${idx + 1}`,
    name: s.name,
    slug: s.slug,
    category_name: s.category_name,
    category_slug: s.category_slug,
    description: s.description,
    pricing_type: 'hourly' as const,
    customer_hourly_price: s.customer_hourly_price,
    partner_hourly_rate: s.partner_hourly_rate,
    commission_percentage: s.commission_percentage,
    minimum_hours: s.minimum_hours,
    maximum_hours: s.maximum_hours,
    is_active: true,
    image_url: undefined
  }));

  saveCustomServices(initial);
  return initial;
}

export function saveCustomServices(services: Service[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
    window.dispatchEvent(new Event('doorbly_services_updated'));
  } catch (err) {
    console.error('Failed to save custom services:', err);
  }
}

export function addCustomService(newService: Omit<Service, 'id' | 'slug'> & { slug?: string }): Service {
  const list = getCustomServices();
  const generatedSlug = (newService.slug || newService.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const fullService: Service = {
    ...newService,
    id: `srv-custom-${Date.now()}`,
    slug: `${newService.category_slug || 'general'}--${generatedSlug}`,
    is_active: newService.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const updated = [fullService, ...list];
  saveCustomServices(updated);
  return fullService;
}

export function updateCustomService(id: string, updates: Partial<Service>): Service | null {
  const list = getCustomServices();
  const index = list.findIndex(s => s.id === id || s.slug === id);
  if (index === -1) return null;

  const current = list[index];
  const updatedItem: Service = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString()
  };

  list[index] = updatedItem;
  saveCustomServices(list);
  return updatedItem;
}

export function deleteCustomService(id: string): boolean {
  const list = getCustomServices();
  const filtered = list.filter(s => s.id !== id && s.slug !== id);
  if (filtered.length !== list.length) {
    saveCustomServices(filtered);
    return true;
  }
  return false;
}

export function resetServicesToMaster(): void {
  localStorage.removeItem(STORAGE_KEY_SERVICES);
  getCustomServices();
  window.dispatchEvent(new Event('doorbly_services_updated'));
}

// ==========================================
// 3. BANNER SLIDES CRUD
// ==========================================
export function getBannerSlides(): BannerSlide[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BANNERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const upgraded = parsed.map(s => {
          // If slide had old light gradient, upgrade to deep rich stylish gradient
          const hasLightGradient = !s.bg_gradient || 
            s.bg_gradient.includes('-50') || 
            s.bg_gradient.includes('-100') || 
            s.bg_gradient.includes('-200');

          if (hasLightGradient) {
            if (s.id === 'slide-1') {
              return { ...s, bg_gradient: 'from-slate-950 via-[#0c142b] to-[#060a17]' };
            }
            if (s.id === 'slide-2' || s.title?.toLowerCase().includes('monsoon')) {
              return { ...s, bg_gradient: 'from-slate-950 via-[#07241e] to-[#041512]' };
            }
            if (s.id === 'slide-3') {
              return { ...s, bg_gradient: 'from-slate-950 via-[#0d1f33] to-[#08121f]' };
            }
            return { ...s, bg_gradient: 'from-slate-950 via-[#0c142b] to-[#060a17]' };
          }
          return s;
        });
        return upgraded.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      }
    }
  } catch (err) {
    console.error('Failed to parse banner slides:', err);
  }

  saveBannerSlides(DEFAULT_BANNER_SLIDES);
  return DEFAULT_BANNER_SLIDES;
}

export function saveBannerSlides(slides: BannerSlide[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(slides));
    window.dispatchEvent(new Event('doorbly_banners_updated'));
  } catch (err) {
    console.error('Failed to save banner slides:', err);
  }
}

export function addBannerSlide(slide: Omit<BannerSlide, 'id'>): BannerSlide {
  const slides = getBannerSlides();
  const newSlide: BannerSlide = {
    ...slide,
    id: `slide-${Date.now()}`,
    sort_order: slide.sort_order || slides.length + 1,
    created_at: new Date().toISOString()
  };
  const updated = [...slides, newSlide];
  saveBannerSlides(updated);
  return newSlide;
}

export function updateBannerSlide(id: string, updates: Partial<BannerSlide>): BannerSlide | null {
  const slides = getBannerSlides();
  const index = slides.findIndex(s => s.id === id);
  if (index === -1) return null;

  slides[index] = {
    ...slides[index],
    ...updates
  };
  saveBannerSlides(slides);
  return slides[index];
}

export function deleteBannerSlide(id: string): boolean {
  const slides = getBannerSlides();
  const filtered = slides.filter(s => s.id !== id);
  if (filtered.length !== slides.length) {
    saveBannerSlides(filtered);
    return true;
  }
  return false;
}

// ==========================================
// 4. BRANDING & LOGO
// ==========================================
export function getBranding(): AppBranding {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BRANDING);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_BRANDING,
          ...parsed,
          logo_url: parsed.logo_url && parsed.logo_url.trim() !== '' ? parsed.logo_url : '/doorbly-logo.png'
        };
      }
    }
  } catch (err) {
    console.error('Failed to parse custom branding:', err);
  }
  return DEFAULT_BRANDING;
}

export function saveBranding(branding: AppBranding): void {
  try {
    localStorage.setItem(STORAGE_KEY_BRANDING, JSON.stringify(branding));
    window.dispatchEvent(new Event('doorbly_branding_updated'));
  } catch (err) {
    console.error('Failed to save branding:', err);
  }
}

export function resetBranding(): void {
  localStorage.removeItem(STORAGE_KEY_BRANDING);
  window.dispatchEvent(new Event('doorbly_branding_updated'));
}
