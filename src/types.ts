export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'partner_on_the_way'
  | 'partner_arrived'
  | 'in_progress'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  icon_name?: string;
  service_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  category_id?: string;
  category_name?: string;
  category_slug?: string;
  name: string;
  slug: string;
  description: string;
  pricing_type: 'hourly';
  // Customer-facing price only
  customer_hourly_price: number;
  minimum_hours: number;
  maximum_hours: number;
  is_active: boolean;
  image_url?: string;
  featured?: boolean;
  // Internal fields (never shown in customer UI, optional in types)
  partner_hourly_rate?: number;
  commission_percentage?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  image_url?: string;
  cta_text?: string;
  cta_category_slug?: string;
  bg_gradient?: string; // CSS gradient class or hex
  is_active: boolean;
  sort_order: number;
  created_at?: string;
}

export interface AppBranding {
  brand_name: string;
  tagline: string;
  logo_url?: string; // Custom uploaded or remote logo image
  logo_letter?: string;
  accent_color?: string;
}

export interface CustomerAddress {
  id?: string;
  customer_id?: string;
  address_line: string;
  area: string;
  city: string;
  district: string;
  state: string; // 'Odisha'
  pincode: string;
  latitude?: number | null;
  longitude?: number | null;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CustomerProfile {
  id: string;
  auth_user_id?: string;
  full_name: string;
  email: string;
  phone: string;
  is_logged_in?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BookingItem {
  id?: string;
  booking_id?: string;
  service_id: string;
  service_name_snapshot: string;
  customer_hourly_price_snapshot: number;
  hours: number;
  customer_subtotal: number;
  tax_amount?: number;
  // Internal accounting snapshots (stored in DB for backend only)
  partner_hourly_rate_snapshot?: number;
  commission_percentage_snapshot?: number;
  doorbly_commission_snapshot?: number;
  partner_payout_snapshot?: number;
  created_at?: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  booking_reference?: string;
  invoice_number?: string;
  booking_status: BookingStatus;
  service_address_id?: string;
  service_address?: CustomerAddress;
  scheduled_date: string;
  scheduled_start_time: string;
  scheduled_end_time?: string;
  total_hours: number;
  subtotal: number;
  tax_percentage?: number;
  tax_amount?: number;
  customer_total: number;
  notes?: string;
  items?: BookingItem[];
  created_at: string;
  updated_at?: string;
}

export interface CartItem {
  id: string;
  service: Service;
  hours: number;
}

export interface PlatformSettings {
  id: string;
  market: string;
  currency: string;
  commission_percentage: number;
  is_active: boolean;
}

export interface MigrationVerificationRow {
  category_name: string;
  service_name: string;
  partner_hourly_rate: number;
  customer_hourly_price: number;
  commission_percentage: number;
  missing_price: boolean;
  duplicate_count: number;
}
