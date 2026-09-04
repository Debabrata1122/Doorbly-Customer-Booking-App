import React, { useState, useEffect } from 'react';
import { CustomerAddress, CustomerProfile, AppBranding } from '../types';
import { getBranding, isAdminLoggedIn } from '../lib/adminStore';
import { RealNetworkStatus, RealLocationDetails } from '../lib/useDeviceStatus';
import { MapPin, User, CalendarCheck, ShieldCheck, HelpCircle, LayoutGrid, Shield, LogIn, Navigation, LocateFixed, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  activeView: 'catalog' | 'categories' | 'bookings' | 'support' | 'admin';
  onSelectView: (view: 'catalog' | 'categories' | 'bookings' | 'support' | 'admin') => void;
  currentAddress: CustomerAddress;
  onOpenLocationModal: () => void;
  onAutoDetectLocation?: () => void;
  onOpenAuthModal: () => void;
  onOpenDatabaseModal?: () => void;
  onOpenAdminModal: () => void;
  customerProfile: CustomerProfile;
  activeBookingsCount: number;
  networkStatus?: RealNetworkStatus;
  locationStatus?: RealLocationDetails;
  cartCount?: number;
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  currentAddress,
  onOpenLocationModal,
  onAutoDetectLocation,
  onOpenAuthModal,
  onOpenAdminModal,
  customerProfile,
  activeBookingsCount,
  networkStatus,
  locationStatus,
  cartCount = 0,
  onOpenCart
}) => {
  const [branding, setBranding] = useState<AppBranding>(getBranding());
  const [isAdmin, setIsAdmin] = useState<boolean>(isAdminLoggedIn());

  useEffect(() => {
    const handleBrandingSync = () => setBranding(getBranding());
    const handleAdminAuthSync = () => setIsAdmin(isAdminLoggedIn());

    window.addEventListener('doorbly_branding_updated', handleBrandingSync);
    window.addEventListener('doorbly_admin_auth_changed', handleAdminAuthSync);

    return () => {
      window.removeEventListener('doorbly_branding_updated', handleBrandingSync);
      window.removeEventListener('doorbly_admin_auth_changed', handleAdminAuthSync);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectView('catalog')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              {branding.logo_url ? (
                <img
                  src={branding.logo_url}
                  alt={branding.brand_name || 'DOORBLY'}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-contain drop-shadow-xs transition-transform group-hover:scale-105"
                />
              ) : (
                <img
                  src="/doorbly-logo.png"
                  alt="DOORBLY"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-contain drop-shadow-xs transition-transform group-hover:scale-105"
                />
              )}
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-['Outfit'] block leading-none">
                  {branding.brand_name || 'DOORBLY'}
                </span>
                <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase block mt-0.5">
                  {branding.tagline || 'Odisha Doorstep Services'}
                </span>
              </div>
            </button>

            {/* Real Device Location Pill with Auto-Detect trigger */}
            <div className="flex items-center bg-slate-100 hover:bg-emerald-50/90 border border-slate-200/90 hover:border-emerald-200 rounded-full transition-all shadow-2xs">
              <button
                id="btn-location-pill"
                onClick={onOpenLocationModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-800 hover:text-emerald-950 transition-colors cursor-pointer"
                title="Change Odisha Service Location or Sync Device GPS"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div className="flex items-center gap-1.5">
                  <span className="truncate max-w-[85px] sm:max-w-[130px] font-bold">
                    {currentAddress.city || 'Bhubaneswar'}
                  </span>
                  {locationStatus?.coords && (
                    <span className="hidden sm:inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                      GPS Live
                    </span>
                  )}
                </div>
              </button>

              {onAutoDetectLocation && (
                <button
                  type="button"
                  id="btn-nav-auto-detect"
                  onClick={onAutoDetectLocation}
                  disabled={locationStatus?.isLocating}
                  className="pr-2 sm:pr-2.5 pl-1 py-1 text-slate-400 hover:text-emerald-700 cursor-pointer transition-colors"
                  title="Auto-detect location from this device's GPS"
                >
                  <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${locationStatus?.isLocating ? 'animate-spin text-emerald-500' : ''}`} />
                </button>
              )}
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-bold">
            <button
              onClick={() => onSelectView('catalog')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'catalog'
                  ? 'bg-slate-100 text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Services</span>
            </button>

            <button
              onClick={() => onSelectView('bookings')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'bookings'
                  ? 'bg-slate-100 text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>My Bookings</span>
              {activeBookingsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px] font-extrabold">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectView('support')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'support'
                  ? 'bg-slate-100 text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>Help & Support</span>
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Service Cart Button */}
            {onOpenCart && (
              <button
                id="btn-navbar-cart"
                onClick={onOpenCart}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all text-xs font-bold shadow-xs cursor-pointer active:scale-95"
                title="View Service Cart & Tax Invoice"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold font-mono">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Show Admin shortcut indicator ONLY when admin session is already authenticated */}
            {isAdmin && (
              <button
                id="btn-navbar-admin-access"
                onClick={onOpenAdminModal}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                  activeView === 'admin'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border-slate-700 shadow-xs'
                }`}
                title="Admin Control Panel"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline font-bold">Admin</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </button>
            )}

            {/* Customer Account / Login Button */}
            {customerProfile?.is_logged_in || customerProfile?.auth_user_id || customerProfile?.full_name ? (
              <button
                id="btn-customer-profile"
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 active:scale-95 text-slate-900 border border-slate-200 transition-all text-xs font-bold shadow-xs cursor-pointer"
                title="Customer Account"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
                  {customerProfile.full_name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline truncate max-w-[100px]">
                  {customerProfile.full_name?.split(' ')[0] || 'Account'}
                </span>
              </button>
            ) : (
              <button
                id="btn-navbar-login"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white transition-all text-xs font-bold shadow-xs cursor-pointer"
                title="Sign In or Register"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden border-t border-slate-100 py-2 justify-around text-xs font-bold text-slate-600">
          <button
            onClick={() => onSelectView('catalog')}
            className={`px-2.5 py-1 rounded-lg ${activeView === 'catalog' ? 'text-indigo-600 bg-indigo-50' : ''}`}
          >
            Services
          </button>
          <button
            onClick={() => onSelectView('bookings')}
            className={`px-2.5 py-1 rounded-lg relative ${activeView === 'bookings' ? 'text-indigo-600 bg-indigo-50' : ''}`}
          >
            Bookings
            {activeBookingsCount > 0 && (
              <span className="ml-1 px-1 bg-indigo-600 text-white rounded-full text-[10px]">
                {activeBookingsCount}
              </span>
            )}
          </button>
          {onOpenCart && (
            <button
              onClick={onOpenCart}
              className="px-2.5 py-1 rounded-lg relative text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-600 text-white text-[9px] font-mono">
                  {cartCount}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => onSelectView('support')}
            className={`px-2.5 py-1 rounded-lg ${activeView === 'support' ? 'text-indigo-600 bg-indigo-50' : ''}`}
          >
            Support
          </button>
          {isAdmin && (
            <button
              onClick={onOpenAdminModal}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${activeView === 'admin' ? 'text-indigo-600 bg-indigo-50 font-black' : 'text-slate-800'}`}
            >
              <Shield className="w-3 h-3 text-amber-500" />
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

