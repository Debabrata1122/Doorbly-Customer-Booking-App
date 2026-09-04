-- ==============================================================================
-- DOORBLY PRODUCTION DATABASE SCHEMA & INITIALIZATION MIGRATION
-- Single Source of Truth for Odisha Hourly Doorstep-Service Marketplace
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PLATFORM SETTINGS
CREATE TABLE IF NOT EXISTS platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market VARCHAR(50) NOT NULL DEFAULT 'Odisha',
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    commission_percentage NUMERIC(5,2) NOT NULL DEFAULT 20.00 CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure default Odisha platform settings record
INSERT INTO platform_settings (market, currency, commission_percentage, is_active)
SELECT 'Odisha', 'INR', 20.00, true
WHERE NOT EXISTS (SELECT 1 FROM platform_settings WHERE market = 'Odisha');

-- 2. SERVICE CATEGORIES
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(100) DEFAULT 'Wrench',
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON service_categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON service_categories(is_active);

-- 3. SERVICES (Internal Master with 20% Commission & Partner Rates)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    pricing_type VARCHAR(20) NOT NULL DEFAULT 'hourly',
    partner_hourly_rate NUMERIC(10,2) NOT NULL CHECK (partner_hourly_rate > 0),
    customer_hourly_price NUMERIC(10,2) NOT NULL CHECK (customer_hourly_price > 0),
    commission_percentage NUMERIC(5,2) NOT NULL DEFAULT 20.00 CHECK (commission_percentage >= 0 AND commission_percentage <= 100),
    minimum_hours INT NOT NULL DEFAULT 1 CHECK (minimum_hours >= 1),
    maximum_hours INT NOT NULL DEFAULT 8 CHECK (maximum_hours >= minimum_hours),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- 4. SERVICE CATEGORY MAP (Supports Many-to-Many Multi-Category Skills)
CREATE TABLE IF NOT EXISTS service_category_map (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(service_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_catmap_service ON service_category_map(service_id);
CREATE INDEX IF NOT EXISTS idx_catmap_category ON service_category_map(category_id);

-- 5. CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_auth ON customers(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- 6. CUSTOMER ADDRESSES (Odisha Validated)
CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    address_line TEXT NOT NULL,
    area VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL DEFAULT 'Odisha',
    pincode VARCHAR(10) NOT NULL,
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON customer_addresses(customer_id);

-- 7. BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_reference VARCHAR(30) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    service_address_id UUID REFERENCES customer_addresses(id) ON DELETE SET NULL,
    booking_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (
        booking_status IN ('pending', 'confirmed', 'assigned', 'partner_on_the_way', 'partner_arrived', 'in_progress', 'completed', 'cancelled', 'rejected')
    ),
    scheduled_date DATE NOT NULL,
    scheduled_start_time VARCHAR(20) NOT NULL,
    scheduled_end_time VARCHAR(20),
    total_hours NUMERIC(4,1) NOT NULL CHECK (total_hours > 0),
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    customer_total NUMERIC(10,2) NOT NULL CHECK (customer_total >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at);

-- 8. BOOKING ITEMS (With Immutable Accounting Snapshots)
CREATE TABLE IF NOT EXISTS booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    service_name_snapshot VARCHAR(150) NOT NULL,
    customer_hourly_price_snapshot NUMERIC(10,2) NOT NULL CHECK (customer_hourly_price_snapshot > 0),
    partner_hourly_rate_snapshot NUMERIC(10,2) NOT NULL CHECK (partner_hourly_rate_snapshot > 0),
    commission_percentage_snapshot NUMERIC(5,2) NOT NULL DEFAULT 20.00,
    doorbly_commission_snapshot NUMERIC(10,2) NOT NULL CHECK (doorbly_commission_snapshot >= 0),
    partner_payout_snapshot NUMERIC(10,2) NOT NULL CHECK (partner_payout_snapshot >= 0),
    hours NUMERIC(4,1) NOT NULL CHECK (hours > 0),
    customer_subtotal NUMERIC(10,2) NOT NULL CHECK (customer_subtotal >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_items_booking_id ON booking_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_items_service_id ON booking_items(service_id);

-- ==============================================================================
-- 9. CUSTOMER-FACING SECURE VIEWS (NO INTERNAL FINANCIAL EXPOSURE)
-- ==============================================================================

-- Customer-facing view for services (Excludes partner_hourly_rate, commission_percentage)
CREATE OR REPLACE VIEW customer_services_catalog AS
SELECT 
    s.id,
    s.category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    s.name,
    s.slug,
    s.description,
    s.pricing_type,
    s.customer_hourly_price,
    s.minimum_hours,
    s.maximum_hours,
    s.is_active,
    s.created_at
FROM services s
LEFT JOIN service_categories c ON s.category_id = c.id
WHERE s.is_active = true;

-- Customer-facing view for booking items (Excludes partner payout & Doorbly commission)
CREATE OR REPLACE VIEW customer_booking_items_view AS
SELECT 
    bi.id,
    bi.booking_id,
    bi.service_id,
    bi.service_name_snapshot,
    bi.customer_hourly_price_snapshot,
    bi.hours,
    bi.customer_subtotal,
    bi.created_at
FROM booking_items bi;

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_category_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_items ENABLE ROW LEVEL SECURITY;

-- Service Categories: Public read for active categories
CREATE POLICY "Public can view active categories" ON service_categories
    FOR SELECT USING (is_active = true);

-- Services: Public read for active services
CREATE POLICY "Public can view active services" ON services
    FOR SELECT USING (is_active = true);

-- Category Mapping: Public read
CREATE POLICY "Public can view category mappings" ON service_category_map
    FOR SELECT USING (true);

-- Platform Settings: Public read
CREATE POLICY "Public can view platform settings" ON platform_settings
    FOR SELECT USING (is_active = true);

-- Customers: Customer can read and modify their own profile
CREATE POLICY "Customers can manage own profile" ON customers
    FOR ALL USING (auth_user_id = auth.uid() OR auth_user_id IS NULL)
    WITH CHECK (auth_user_id = auth.uid() OR auth_user_id IS NULL);

-- Customer Addresses: Customer can read and modify their own addresses
CREATE POLICY "Customers can manage own addresses" ON customer_addresses
    FOR ALL USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL))
    WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL));

-- Bookings: Customer can read and create their own bookings
CREATE POLICY "Customers can view own bookings" ON bookings
    FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL));

CREATE POLICY "Customers can insert own bookings" ON bookings
    FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL));

CREATE POLICY "Customers can update own bookings status (cancel)" ON bookings
    FOR UPDATE USING (customer_id IN (SELECT id FROM customers WHERE auth_user_id = auth.uid() OR auth_user_id IS NULL));

-- Booking Items: Customer can read items for their own bookings
CREATE POLICY "Customers can view own booking items" ON booking_items
    FOR SELECT USING (booking_id IN (SELECT b.id FROM bookings b JOIN customers c ON b.customer_id = c.id WHERE c.auth_user_id = auth.uid() OR c.auth_user_id IS NULL));

CREATE POLICY "Customers can insert own booking items" ON booking_items
    FOR INSERT WITH CHECK (booking_id IN (SELECT b.id FROM bookings b JOIN customers c ON b.customer_id = c.id WHERE c.auth_user_id = auth.uid() OR c.auth_user_id IS NULL));

-- Realtime Publication for Live Booking Status
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
