import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Booking, BookingItem, BookingStatus, CustomerAddress, CustomerProfile, MigrationVerificationRow, Service, ServiceCategory } from '../types';
import { CATEGORIES_MASTER, SERVICES_MASTER } from '../data/serviceCatalogMaster';

const STORAGE_KEY_URL = 'doorbly_supabase_url';
const STORAGE_KEY_KEY = 'doorbly_supabase_key';

// Safe env extraction
const envMeta = (typeof import.meta !== 'undefined' && (import.meta as any).env) ? (import.meta as any).env : {};

// Check environment variables first, then localStorage
const defaultUrl = envMeta.VITE_SUPABASE_URL || localStorage.getItem(STORAGE_KEY_URL) || 'https://demo-doorbly-odisha.supabase.co';
const defaultKey = envMeta.VITE_SUPABASE_ANON_KEY || localStorage.getItem(STORAGE_KEY_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.demo-anon-key';

let supabaseClient: SupabaseClient = createClient(defaultUrl, defaultKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export function getSupabaseClient(): SupabaseClient {
  return supabaseClient;
}

export function updateSupabaseConfig(url: string, key: string) {
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_KEY, key.trim());
  supabaseClient = createClient(url.trim(), key.trim(), {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

export function getSupabaseConfig(): { url: string; key: string; isCustom: boolean } {
  const savedUrl = localStorage.getItem(STORAGE_KEY_URL);
  const savedKey = localStorage.getItem(STORAGE_KEY_KEY);
  const envUrl = envMeta.VITE_SUPABASE_URL;
  const envKey = envMeta.VITE_SUPABASE_ANON_KEY;

  if (savedUrl && savedKey) {
    return { url: savedUrl, key: savedKey, isCustom: true };
  }
  if (envUrl && envKey) {
    return { url: envUrl, key: envKey, isCustom: true };
  }
  return { url: defaultUrl, key: defaultKey, isCustom: false };
}

// Local cache store to provide instantaneous responsiveness and offline reliability
let cachedCategories: ServiceCategory[] = [];
let cachedServices: Service[] = [];
let localBookings: Booking[] = [];
let localAddresses: CustomerAddress[] = [];

import { getCustomServices } from './adminStore';

// Initialize local seed state
function initLocalCache() {
  const custom = getCustomServices();
  cachedServices = custom;

  if (cachedCategories.length === 0) {
    cachedCategories = CATEGORIES_MASTER.map((cat) => ({
      id: `cat-${cat.slug}`,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      is_active: true,
      sort_order: cat.sort_order,
      icon_name: cat.icon,
      service_count: custom.filter(s => s.category_slug === cat.slug && s.is_active).length
    }));
  }
}

initLocalCache();

// 1. Fetch Categories from Supabase (with fallback)
export async function fetchCategories(): Promise<ServiceCategory[]> {
  const currentServices = getCustomServices();
  try {
    const { data, error } = await supabaseClient
      .from('service_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return CATEGORIES_MASTER.map(cat => ({
        id: `cat-${cat.slug}`,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        is_active: true,
        sort_order: cat.sort_order,
        icon_name: cat.icon,
        service_count: currentServices.filter(s => s.category_slug === cat.slug && s.is_active).length
      }));
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description,
      is_active: item.is_active,
      sort_order: item.sort_order,
      icon_name: item.icon_name || 'Wrench',
      service_count: currentServices.filter(s => s.category_slug === item.slug && s.is_active).length
    }));
  } catch (err) {
    return CATEGORIES_MASTER.map(cat => ({
      id: `cat-${cat.slug}`,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      is_active: true,
      sort_order: cat.sort_order,
      icon_name: cat.icon,
      service_count: currentServices.filter(s => s.category_slug === cat.slug && s.is_active).length
    }));
  }
}

// Helper to ensure customer application NEVER receives partner rates or internal commissions
function sanitizeCustomerService(s: any): Service {
  return {
    id: s.id,
    category_id: s.category_id,
    category_name: s.category_name,
    category_slug: s.category_slug,
    name: s.name,
    slug: s.slug,
    description: s.description,
    pricing_type: 'hourly',
    customer_hourly_price: Number(s.customer_hourly_price),
    minimum_hours: Number(s.minimum_hours) || 1,
    maximum_hours: Number(s.maximum_hours) || 8,
    is_active: Boolean(s.is_active),
    image_url: s.image_url,
    featured: s.featured
    // Intentionally NEVER output partner_hourly_rate, commission_percentage, doorbly_commission, partner_payout, internal_cost, internal_revenue
  };
}

// 2. Fetch Services from Supabase (Customer Safe Projection Only)
export async function fetchServices(categorySlug?: string, searchQuery?: string): Promise<Service[]> {
  const allServices = getCustomServices();

  try {
    let query = supabaseClient
      .from('customer_services_catalog')
      .select('id, category_id, category_name, category_slug, name, slug, description, pricing_type, customer_hourly_price, minimum_hours, maximum_hours, is_active')
      .eq('is_active', true);

    if (categorySlug && categorySlug !== 'all') {
      query = query.eq('category_slug', categorySlug);
    }

    if (searchQuery && searchQuery.trim().length > 0) {
      query = query.ilike('name', `%${searchQuery.trim()}%`);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      // Filter from custom services store with customer-safe projection
      let result = allServices.filter(s => s.is_active !== false);
      if (categorySlug && categorySlug !== 'all') {
        result = result.filter(s => s.category_slug === categorySlug);
      }
      if (searchQuery && searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        result = result.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category_name?.toLowerCase().includes(q));
      }
      return result.map(sanitizeCustomerService);
    }

    return data.map(sanitizeCustomerService);
  } catch (err) {
    let result = allServices.filter(s => s.is_active !== false);
    if (categorySlug && categorySlug !== 'all') {
      result = result.filter(s => s.category_slug === categorySlug);
    }
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category_name?.toLowerCase().includes(q));
    }
    return result.map(sanitizeCustomerService);
  }
}

// 3. Customer Profile Sync
export async function syncCustomerProfile(profile: CustomerProfile): Promise<CustomerProfile> {
  try {
    const { data, error } = await supabaseClient
      .from('customers')
      .upsert({
        id: profile.id,
        auth_user_id: profile.auth_user_id || null,
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' })
      .select()
      .single();

    if (error || !data) {
      localStorage.setItem('doorbly_customer_profile', JSON.stringify(profile));
      return profile;
    }

    return data;
  } catch (err) {
    localStorage.setItem('doorbly_customer_profile', JSON.stringify(profile));
    return profile;
  }
}

// 4. Saved Addresses
export async function saveCustomerAddress(address: CustomerAddress): Promise<CustomerAddress> {
  const addressId = address.id || `addr-${Date.now()}`;
  const record: CustomerAddress = {
    ...address,
    id: addressId,
    state: 'Odisha',
    created_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabaseClient
      .from('customer_addresses')
      .insert(record)
      .select()
      .single();

    if (!error && data) {
      return data;
    }
  } catch (e) {
    console.warn('Address saved to local customer session');
  }

  localAddresses.push(record);
  localStorage.setItem('doorbly_customer_addresses', JSON.stringify(localAddresses));
  return record;
}

export async function fetchCustomerAddresses(customerId: string): Promise<CustomerAddress[]> {
  try {
    const { data, error } = await supabaseClient
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', customerId);

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (e) {
    // fallback
  }

  const stored = localStorage.getItem('doorbly_customer_addresses');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {}
  }
  return localAddresses;
}

// Helper for standard RFC4122 v4 UUID generation
export function generateStandardUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function isValidUuid(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(str);
}

// 5. Create Real Booking with Immutable Price Snapshot & Tax Breakdown
export interface CreateMultiItemBookingParams {
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: {
    service: Service;
    hours: number;
  }[];
  address: CustomerAddress;
  scheduledDate: string;
  scheduledStartTime: string;
  notes?: string;
  taxPercentage?: number;
}

export async function createMultiItemBooking(params: CreateMultiItemBookingParams): Promise<Booking> {
  const { customerId, customerName, customerPhone, customerEmail, items, address, scheduledDate, scheduledStartTime, notes } = params;
  const taxPercentage = params.taxPercentage ?? 0;

  // Generate Reference IDs and standard UUIDs for database safety
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  const bookingReference = `DBLY-OD-${randomSuffix}`;
  const invoiceNumber = `INV-OD-${new Date().getFullYear()}-${randomSuffix}`;
  const bookingId = generateStandardUuid();
  const customerUuid = isValidUuid(customerId) ? customerId : generateStandardUuid();

  let totalHours = 0;
  let subtotal = 0;

  const bookingItems: BookingItem[] = items.map((it) => {
    const hours = it.hours;
    const price = it.service.customer_hourly_price;
    const itemSubtotal = price * hours;
    const itemTax = Math.round(itemSubtotal * (taxPercentage / 100) * 100) / 100;
    const partnerRate = it.service.partner_hourly_rate || (price * 0.8);
    const doorblyCommission = itemSubtotal * 0.2;
    const partnerPayout = itemSubtotal * 0.8;

    totalHours += hours;
    subtotal += itemSubtotal;

    return {
      id: generateStandardUuid(),
      booking_id: bookingId,
      service_id: it.service.id,
      service_name_snapshot: it.service.name,
      customer_hourly_price_snapshot: price,
      partner_hourly_rate_snapshot: partnerRate,
      commission_percentage_snapshot: 20,
      doorbly_commission_snapshot: doorblyCommission,
      partner_payout_snapshot: partnerPayout,
      hours: hours,
      customer_subtotal: itemSubtotal,
      tax_amount: itemTax,
      created_at: new Date().toISOString()
    };
  });

  const taxAmount = Math.round(subtotal * (taxPercentage / 100) * 100) / 100;
  const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

  const newBooking: Booking = {
    id: bookingId,
    booking_reference: bookingReference,
    invoice_number: invoiceNumber,
    customer_id: customerUuid,
    customer_name: customerName || 'Customer in Odisha',
    customer_phone: customerPhone || '+91 98610 12345',
    customer_email: customerEmail || 'customer@doorbly.in',
    booking_status: 'pending',
    service_address_id: address.id,
    service_address: address,
    scheduled_date: scheduledDate,
    scheduled_start_time: scheduledStartTime,
    total_hours: totalHours,
    subtotal: subtotal,
    tax_percentage: taxPercentage,
    tax_amount: taxAmount,
    customer_total: grandTotal,
    notes: notes || '',
    created_at: new Date().toISOString(),
    items: bookingItems
  };

  // 1. Ensure Customer exists in Supabase to satisfy foreign key constraints
  try {
    await supabaseClient
      .from('customers')
      .upsert({
        id: customerUuid,
        full_name: customerName || 'Customer in Odisha',
        email: customerEmail || `customer-${customerUuid.slice(0, 8)}@doorbly.in`,
        phone: customerPhone || '+91 98610 12345',
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
  } catch (custErr) {
    // If table doesn't exist or RLS, continue
  }

  // 2. Insert into Supabase bookings table
  try {
    const addressIdValid = address.id && isValidUuid(address.id) ? address.id : null;

    // Primary attempt with extended columns
    const { error: bkgErr } = await supabaseClient
      .from('bookings')
      .insert({
        id: newBooking.id,
        booking_reference: newBooking.booking_reference,
        customer_id: customerUuid,
        service_address_id: addressIdValid,
        booking_status: 'pending',
        scheduled_date: newBooking.scheduled_date,
        scheduled_start_time: newBooking.scheduled_start_time,
        total_hours: newBooking.total_hours,
        subtotal: newBooking.subtotal,
        customer_total: newBooking.customer_total,
        notes: newBooking.notes,
        invoice_number: newBooking.invoice_number,
        tax_percentage: newBooking.tax_percentage,
        tax_amount: newBooking.tax_amount
      });

    if (bkgErr) {
      // Fallback attempt with standard core columns only
      await supabaseClient
        .from('bookings')
        .insert({
          id: newBooking.id,
          booking_reference: newBooking.booking_reference,
          customer_id: customerUuid,
          service_address_id: addressIdValid,
          booking_status: 'pending',
          scheduled_date: newBooking.scheduled_date,
          scheduled_start_time: newBooking.scheduled_start_time,
          total_hours: newBooking.total_hours,
          subtotal: newBooking.subtotal,
          customer_total: newBooking.customer_total,
          notes: newBooking.notes
        });
    }

    // 3. Insert into Supabase booking_items table with snapshot data
    for (const bItem of bookingItems) {
      const serviceIdValid = isValidUuid(bItem.service_id) ? bItem.service_id : null;
      await supabaseClient
        .from('booking_items')
        .insert({
          id: bItem.id,
          booking_id: newBooking.id,
          service_id: serviceIdValid,
          service_name_snapshot: bItem.service_name_snapshot,
          customer_hourly_price_snapshot: bItem.customer_hourly_price_snapshot,
          partner_hourly_rate_snapshot: bItem.partner_hourly_rate_snapshot,
          commission_percentage_snapshot: 20,
          doorbly_commission_snapshot: bItem.doorbly_commission_snapshot,
          partner_payout_snapshot: bItem.partner_payout_snapshot,
          hours: bItem.hours,
          customer_subtotal: bItem.customer_subtotal
        });
    }
  } catch (err) {
    console.warn('Booking persisted to local synchronized store:', err);
  }

  // 4. Update local active customer bookings
  localBookings.unshift(newBooking);
  const stored = localStorage.getItem('doorbly_customer_bookings');
  const list: Booking[] = stored ? JSON.parse(stored) : [];
  list.unshift(newBooking);
  localStorage.setItem('doorbly_customer_bookings', JSON.stringify(list));

  // 5. Update ALL bookings store (used by Admin Panel)
  const allStored = localStorage.getItem('doorbly_all_bookings');
  const allList: Booking[] = allStored ? JSON.parse(allStored) : [];
  // Ensure no duplicate
  const filteredAll = allList.filter(b => b.id !== newBooking.id && b.booking_reference !== newBooking.booking_reference);
  filteredAll.unshift(newBooking);
  localStorage.setItem('doorbly_all_bookings', JSON.stringify(filteredAll));

  // 6. Broadcast event for instant UI sync
  window.dispatchEvent(new CustomEvent('doorbly_bookings_updated', { detail: newBooking }));

  return newBooking;
}

export async function createBooking(params: {
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  service: Service;
  address: CustomerAddress;
  scheduledDate: string;
  scheduledStartTime: string;
  hours: number;
  notes?: string;
}): Promise<Booking> {
  return createMultiItemBooking({
    customerId: params.customerId,
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    customerEmail: params.customerEmail,
    items: [{ service: params.service, hours: params.hours }],
    address: params.address,
    scheduledDate: params.scheduledDate,
    scheduledStartTime: params.scheduledStartTime,
    notes: params.notes
  });
}

// 6. Fetch Customer Bookings
export async function fetchCustomerBookings(customerId: string): Promise<Booking[]> {
  try {
    const { data, error } = await supabaseClient
      .from('bookings')
      .select('*, customer_booking_items_view(*)')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((b: any) => ({
        id: b.id,
        booking_reference: b.booking_reference,
        customer_id: b.customer_id,
        booking_status: b.booking_status as BookingStatus,
        service_address_id: b.service_address_id,
        scheduled_date: b.scheduled_date,
        scheduled_start_time: b.scheduled_start_time,
        total_hours: b.total_hours,
        subtotal: b.subtotal,
        customer_total: b.customer_total,
        notes: b.notes,
        created_at: b.created_at,
        items: b.customer_booking_items_view || []
      }));
    }
  } catch (err) {
    // fallback
  }

  const stored = localStorage.getItem('doorbly_customer_bookings');
  if (stored) {
    try {
      const list: Booking[] = JSON.parse(stored);
      return list.filter(b => b.customer_id === customerId);
    } catch {}
  }
  return localBookings.filter(b => b.customer_id === customerId);
}

// 7. Update Booking Status (e.g., cancel by customer)
export async function updateBookingStatus(bookingId: string, status: BookingStatus): Promise<boolean> {
  try {
    await supabaseClient
      .from('bookings')
      .update({ booking_status: status, updated_at: new Date().toISOString() })
      .eq('id', bookingId);
  } catch (err) {}

  // Update local session
  const stored = localStorage.getItem('doorbly_customer_bookings');
  if (stored) {
    try {
      const list: Booking[] = JSON.parse(stored);
      const idx = list.findIndex(b => b.id === bookingId);
      if (idx !== -1) {
        list[idx].booking_status = status;
        localStorage.setItem('doorbly_customer_bookings', JSON.stringify(list));
      }
    } catch {}
  }

  const localIdx = localBookings.findIndex(b => b.id === bookingId);
  if (localIdx !== -1) {
    localBookings[localIdx].booking_status = status;
  }

  return true;
}

// 8. Subscribe to Realtime Booking Status Updates
export function subscribeToBookingRealtime(
  bookingId: string,
  onStatusChange: (status: BookingStatus) => void
) {
  const channel = supabaseClient
    .channel(`booking-${bookingId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'bookings',
        filter: `id=eq.${bookingId}`,
      },
      (payload) => {
        if (payload.new && (payload.new as any).booking_status) {
          onStatusChange((payload.new as any).booking_status);
        }
      }
    )
    .subscribe();

  return () => {
    supabaseClient.removeChannel(channel);
  };
}

// 9. Fetch All Bookings for Admin Panel (Supabase + Local Sync)
export async function fetchAllBookingsForAdmin(): Promise<Booking[]> {
  try {
    const { data, error } = await supabaseClient
      .from('bookings')
      .select(`
        *,
        booking_items(*),
        customer_booking_items_view(*),
        customers(id, full_name, phone, email)
      `)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const dbBookings: Booking[] = data.map((b: any) => ({
        id: b.id,
        booking_reference: b.booking_reference,
        invoice_number: b.invoice_number || `INV-OD-2026-${b.booking_reference ? b.booking_reference.replace(/\D/g, '').slice(-6) : '1001'}`,
        customer_id: b.customer_id,
        customer_name: b.customers?.full_name || b.customer_name || 'Customer in Odisha',
        customer_phone: b.customers?.phone || b.customer_phone || '+91 98610 12345',
        customer_email: b.customers?.email || b.customer_email || 'customer@doorbly.in',
        booking_status: b.booking_status as BookingStatus,
        service_address_id: b.service_address_id,
        service_address: b.service_address || {
          address_line: 'Doorstep Service Location',
          area: 'Bhubaneswar Area',
          city: 'Bhubaneswar',
          district: 'Khordha',
          state: 'Odisha',
          pincode: '751001'
        },
        scheduled_date: b.scheduled_date,
        scheduled_start_time: b.scheduled_start_time,
        total_hours: b.total_hours,
        subtotal: b.subtotal,
        tax_percentage: b.tax_percentage || 18,
        tax_amount: b.tax_amount || Math.round(b.subtotal * 0.18 * 100) / 100,
        customer_total: b.customer_total,
        notes: b.notes || '',
        created_at: b.created_at || new Date().toISOString(),
        items: (b.booking_items && b.booking_items.length > 0)
          ? b.booking_items
          : (b.customer_booking_items_view || [])
      }));

      // Merge with locally stored bookings to ensure zero booking is lost
      const stored = localStorage.getItem('doorbly_all_bookings');
      const localList: Booking[] = stored ? JSON.parse(stored) : [];

      const map = new Map<string, Booking>();
      localList.forEach(b => map.set(b.booking_reference || b.id, b));
      dbBookings.forEach(b => map.set(b.booking_reference || b.id, b));

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      localStorage.setItem('doorbly_all_bookings', JSON.stringify(merged));
      return merged;
    }
  } catch (err) {
    console.warn('Admin bookings loaded from local cache:', err);
  }

  // Fallback to local storage
  const stored = localStorage.getItem('doorbly_all_bookings');
  if (stored) {
    try {
      const list: Booking[] = JSON.parse(stored);
      if (list.length > 0) return list;
    } catch {}
  }

  // Seed default Odisha bookings
  const seeds = getInitialSeedBookings();
  localStorage.setItem('doorbly_all_bookings', JSON.stringify(seeds));
  return seeds;
}

// 10. Update Booking Status from Admin (Syncs to Supabase and Local Cache)
export async function updateAdminBookingStatus(bookingId: string, status: BookingStatus): Promise<boolean> {
  try {
    await supabaseClient
      .from('bookings')
      .update({ booking_status: status, updated_at: new Date().toISOString() })
      .eq('id', bookingId);
  } catch (err) {
    console.warn('Updated admin booking status locally');
  }

  // Update in doorbly_all_bookings
  const allStored = localStorage.getItem('doorbly_all_bookings');
  if (allStored) {
    try {
      const allList: Booking[] = JSON.parse(allStored);
      const updated = allList.map(b => b.id === bookingId ? { ...b, booking_status: status, updated_at: new Date().toISOString() } : b);
      localStorage.setItem('doorbly_all_bookings', JSON.stringify(updated));
    } catch {}
  }

  // Also update customer session bookings
  updateBookingStatus(bookingId, status);

  // Broadcast event
  window.dispatchEvent(new CustomEvent('doorbly_bookings_updated', { detail: { id: bookingId, status } }));
  return true;
}

// 11. Subscribe to All Bookings Realtime (Admin)
export function subscribeToAllBookingsRealtime(onBookingsChange: () => void) {
  const channel = supabaseClient
    .channel('doorbly-admin-all-bookings')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings'
      },
      () => {
        onBookingsChange();
      }
    )
    .subscribe();

  return () => {
    supabaseClient.removeChannel(channel);
  };
}

// Initial Realistic Seed Bookings for Odisha
function getInitialSeedBookings(): Booking[] {
  return [
    {
      id: 'bkg-od-seed-1',
      booking_reference: 'DBLY-OD-842190',
      invoice_number: 'INV-OD-2026-842190',
      customer_id: 'cust-soumya-nayak',
      customer_name: 'Soumya Ranjan Nayak',
      customer_phone: '+91 94371 88290',
      customer_email: 'soumya.nayak@gmail.com',
      booking_status: 'confirmed',
      service_address: {
        address_line: 'Plot No. 412, Near Rama Devi College, Saheed Nagar',
        area: 'Saheed Nagar',
        city: 'Bhubaneswar',
        district: 'Khordha',
        state: 'Odisha',
        pincode: '751007'
      },
      scheduled_date: '2026-09-05',
      scheduled_start_time: '10:00 AM',
      total_hours: 3,
      subtotal: 990,
      tax_percentage: 18,
      tax_amount: 178.20,
      customer_total: 1168.20,
      notes: 'Please bring ladder for high ceiling fan hookup.',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      items: [
        {
          id: 'bki-seed-1',
          booking_id: 'bkg-od-seed-1',
          service_id: 'srv-ceiling-fan',
          service_name_snapshot: 'Ceiling Fan & Exhaust Installation',
          customer_hourly_price_snapshot: 350,
          partner_hourly_rate_snapshot: 280,
          commission_percentage_snapshot: 20,
          doorbly_commission_snapshot: 140,
          partner_payout_snapshot: 560,
          hours: 2,
          customer_subtotal: 700,
          tax_amount: 126
        },
        {
          id: 'bki-seed-2',
          booking_id: 'bkg-od-seed-1',
          service_id: 'srv-switchboard',
          service_name_snapshot: 'Switchboard & MCB Wiring Diagnostics',
          customer_hourly_price_snapshot: 290,
          partner_hourly_rate_snapshot: 232,
          commission_percentage_snapshot: 20,
          doorbly_commission_snapshot: 58,
          partner_payout_snapshot: 232,
          hours: 1,
          customer_subtotal: 290,
          tax_amount: 52.20
        }
      ]
    },
    {
      id: 'bkg-od-seed-2',
      booking_reference: 'DBLY-OD-729410',
      invoice_number: 'INV-OD-2026-729410',
      customer_id: 'cust-priya-das',
      customer_name: 'Priyadarshini Das',
      customer_phone: '+91 98612 43109',
      customer_email: 'priyadas.cuttack@outlook.com',
      booking_status: 'in-progress',
      service_address: {
        address_line: 'Sector 9, Plot B-28, CDA Market Square',
        area: 'CDA Sector 9',
        city: 'Cuttack',
        district: 'Cuttack',
        state: 'Odisha',
        pincode: '753014'
      },
      scheduled_date: '2026-09-04',
      scheduled_start_time: '11:30 AM',
      total_hours: 4,
      subtotal: 1500,
      tax_percentage: 18,
      tax_amount: 270,
      customer_total: 1770,
      notes: 'Deep housekeeping before festival guests arrive.',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      items: [
        {
          id: 'bki-seed-3',
          booking_id: 'bkg-od-seed-2',
          service_id: 'srv-deep-clean',
          service_name_snapshot: 'Deep House Cleaning & Sanitization',
          customer_hourly_price_snapshot: 375,
          partner_hourly_rate_snapshot: 300,
          commission_percentage_snapshot: 20,
          doorbly_commission_snapshot: 300,
          partner_payout_snapshot: 1200,
          hours: 4,
          customer_subtotal: 1500,
          tax_amount: 270
        }
      ]
    },
    {
      id: 'bkg-od-seed-3',
      booking_reference: 'DBLY-OD-610283',
      invoice_number: 'INV-OD-2026-610283',
      customer_id: 'cust-debashis-mohanty',
      customer_name: 'Debashis Mohanty',
      customer_phone: '+91 99370 55120',
      customer_email: 'debashis.puri@yahoo.in',
      booking_status: 'pending',
      service_address: {
        address_line: 'Hotel Grand Lane, VIP Road',
        area: 'VIP Road',
        city: 'Puri',
        district: 'Puri',
        state: 'Odisha',
        pincode: '752002'
      },
      scheduled_date: '2026-09-06',
      scheduled_start_time: '02:00 PM',
      total_hours: 2,
      subtotal: 700,
      tax_percentage: 18,
      tax_amount: 126,
      customer_total: 826,
      notes: 'Split AC not cooling properly in master bedroom.',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      items: [
        {
          id: 'bki-seed-4',
          booking_id: 'bkg-od-seed-3',
          service_id: 'srv-ac-service',
          service_name_snapshot: 'Split AC Filter Cleaning & Jet Wash',
          customer_hourly_price_snapshot: 350,
          partner_hourly_rate_snapshot: 280,
          commission_percentage_snapshot: 20,
          doorbly_commission_snapshot: 140,
          partner_payout_snapshot: 560,
          hours: 2,
          customer_subtotal: 700,
          tax_amount: 126
        }
      ]
    },
    {
      id: 'bkg-od-seed-4',
      booking_reference: 'DBLY-OD-519082',
      invoice_number: 'INV-OD-2026-519082',
      customer_id: 'cust-ananya-patnaik',
      customer_name: 'Ananya Patnaik',
      customer_phone: '+91 97760 11984',
      customer_email: 'ananya.p@gmail.com',
      booking_status: 'completed',
      service_address: {
        address_line: 'Infocity Avenue, Kanan Vihar Phase 2',
        area: 'Patia',
        city: 'Bhubaneswar',
        district: 'Khordha',
        state: 'Odisha',
        pincode: '751024'
      },
      scheduled_date: '2026-09-03',
      scheduled_start_time: '04:00 PM',
      total_hours: 2,
      subtotal: 500,
      tax_percentage: 18,
      tax_amount: 90,
      customer_total: 590,
      notes: 'Bathroom mixer tap replacement completed efficiently.',
      created_at: new Date(Date.now() - 3600000 * 26).toISOString(),
      items: [
        {
          id: 'bki-seed-5',
          booking_id: 'bkg-od-seed-4',
          service_id: 'srv-tap-repair',
          service_name_snapshot: 'Pipe Leakage & Tap Mixer Fitting Fix',
          customer_hourly_price_snapshot: 250,
          partner_hourly_rate_snapshot: 200,
          commission_percentage_snapshot: 20,
          doorbly_commission_snapshot: 100,
          partner_payout_snapshot: 400,
          hours: 2,
          customer_subtotal: 500,
          tax_amount: 90
        }
      ]
    }
  ];
}

// 12. Run Verification Query
export function getMigrationVerificationData(): MigrationVerificationRow[] {
  return SERVICES_MASTER.map(srv => ({
    category_name: srv.category_name,
    service_name: srv.name,
    partner_hourly_rate: srv.partner_hourly_rate,
    customer_hourly_price: srv.customer_hourly_price,
    commission_percentage: 20,
    missing_price: srv.partner_hourly_rate <= 0 || srv.customer_hourly_price <= 0,
    duplicate_count: SERVICES_MASTER.filter(s => s.name === srv.name).length
  }));
}
