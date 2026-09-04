import React, { useEffect, useState, useCallback } from 'react';
import { Booking, CustomerAddress, CustomerProfile, Service, CartItem } from './types';
import { DEFAULT_ODISHA_LOCATION } from './data/odishaLocations';
import { fetchCustomerBookings } from './lib/supabase';
import { useDeviceStatus } from './lib/useDeviceStatus';
import { isAdminLoggedIn } from './lib/adminStore';
import { DeviceStatusWidget } from './components/DeviceStatusWidget';
import { Navbar } from './components/Navbar';
import { ServiceCatalogView } from './components/ServiceCatalogView';
import { MyBookingsView } from './components/MyBookingsView';
import { HelpSupportView } from './components/HelpSupportView';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { OdishaLocationModal } from './components/OdishaLocationModal';
import { BookingModal } from './components/BookingModal';
import { CartModal } from './components/CartModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { DatabaseVerificationModal } from './components/DatabaseVerificationModal';
import { CATEGORIES_MASTER } from './data/serviceCatalogMaster';
import { CheckCircle2, ShieldCheck, Heart, Sparkles, Shield, Lock, Phone, Mail } from 'lucide-react';

export default function App() {
  // Navigation State & History
  const [activeView, setActiveView] = useState<'catalog' | 'categories' | 'bookings' | 'support' | 'admin'>('catalog');
  const [viewHistory, setViewHistory] = useState<('catalog' | 'categories' | 'bookings' | 'support' | 'admin')[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('doorbly_cart_items');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [isCartModalOpen, setIsCartModalOpen] = useState<boolean>(false);

  const handleAddToCart = (service: Service) => {
    setCartItems(prev => {
      const existing = prev.find(it => it.service.id === service.id);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map(it => it.service.id === service.id ? { ...it, hours: Math.min(service.maximum_hours || 8, it.hours + 1) } : it);
      } else {
        updated = [...prev, { service, hours: service.minimum_hours || 1 }];
      }
      localStorage.setItem('doorbly_cart_items', JSON.stringify(updated));
      return updated;
    });
    setNotificationToast(`Added "${service.name}" to cart!`);
    setTimeout(() => setNotificationToast(null), 3000);
  };

  const handleUpdateCartHours = (serviceId: string, delta: number) => {
    setCartItems(prev => {
      const updated = prev.map(it => {
        if (it.service.id === serviceId) {
          const newHours = Math.max(it.service.minimum_hours || 1, Math.min(it.service.maximum_hours || 8, it.hours + delta));
          return { ...it, hours: newHours };
        }
        return it;
      });
      localStorage.setItem('doorbly_cart_items', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveFromCart = (serviceId: string) => {
    setCartItems(prev => {
      const updated = prev.filter(it => it.service.id !== serviceId);
      localStorage.setItem('doorbly_cart_items', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.removeItem('doorbly_cart_items');
  };

  const navigateTo = (view: 'catalog' | 'categories' | 'bookings' | 'support' | 'admin') => {
    if (view !== activeView) {
      setViewHistory(prev => [...prev, activeView]);
      setActiveView(view);
    }
  };

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn()) {
      navigateTo('admin');
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

  // Shortcut key (Ctrl + Alt + A or Cmd + Option + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        handleOpenAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGoBack = () => {
    if (selectedCategoryFilter !== 'all' && activeView === 'catalog') {
      setSelectedCategoryFilter('all');
      return;
    }
    if (viewHistory.length > 0) {
      const prev = viewHistory[viewHistory.length - 1];
      setViewHistory(history => history.slice(0, -1));
      setActiveView(prev);
    } else {
      setActiveView('catalog');
      setSelectedCategoryFilter('all');
    }
  };

  // Customer Profile State (persisted in localStorage)
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem('doorbly_customer_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.full_name && parsed.full_name !== 'Debabrata Mohapatra') {
          return parsed;
        }
      } catch (e) {}
    }
    return {
      id: 'cust-guest',
      full_name: '',
      email: '',
      phone: '',
      is_logged_in: false
    };
  });

  // Customer Address State (persisted in localStorage)
  const [currentAddress, setCurrentAddress] = useState<CustomerAddress>(() => {
    const saved = localStorage.getItem('doorbly_customer_address');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      address_line: 'Plot No. 124, Saheed Nagar',
      area: 'Saheed Nagar',
      city: 'Bhubaneswar',
      district: 'Khordha',
      state: 'Odisha',
      pincode: '751007',
      is_default: true
    };
  });

  const handleUpdateAddress = useCallback((newAddr: CustomerAddress) => {
    setCurrentAddress(newAddr);
    localStorage.setItem('doorbly_customer_address', JSON.stringify(newAddr));
  }, []);

  // Real-Time Device Location & Network Status Hook
  const {
    networkStatus,
    locationStatus,
    fetchRealLocation,
    startLiveWatch,
    stopLiveWatch
  } = useDeviceStatus(handleUpdateAddress);

  // Modal States
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState<boolean>(false);
  const [serviceToBook, setServiceToBook] = useState<Service | null>(null);

  // Active bookings tracker
  const [activeBookingsCount, setActiveBookingsCount] = useState<number>(0);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const refreshBookingCount = async () => {
    try {
      const bookings = await fetchCustomerBookings(customerProfile.id);
      const active = bookings.filter(b => !['completed', 'cancelled', 'rejected'].includes(b.booking_status));
      setActiveBookingsCount(active.length);
    } catch (e) {}
  };

  useEffect(() => {
    refreshBookingCount();
  }, [customerProfile.id]);

  const handleUpdateProfile = (newProfile: CustomerProfile) => {
    setCustomerProfile(newProfile);
    localStorage.setItem('doorbly_customer_profile', JSON.stringify(newProfile));
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('doorbly_customer_profile');
    setCustomerProfile({
      id: 'cust-guest',
      full_name: '',
      email: '',
      phone: '',
      is_logged_in: false
    });
  };

  const handleBookingSuccess = (booking: Booking) => {
    setNotificationToast(`Booking ${booking.booking_reference} placed successfully! Tracking partner dispatch...`);
    refreshBookingCount();
    navigateTo('bookings');
    setTimeout(() => {
      setNotificationToast(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Offline Alert Banner (shown only when disconnected) */}
      <DeviceStatusWidget networkStatus={networkStatus} />

      {/* Toast notification */}
      {notificationToast && (
        <div className="fixed top-24 right-4 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-slate-700/80 flex items-center gap-3 animate-in slide-in-from-top-3 duration-200 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{notificationToast}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeView={activeView}
        onSelectView={(v) => {
          navigateTo(v);
        }}
        currentAddress={currentAddress}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onAutoDetectLocation={() => fetchRealLocation(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenAdminModal={handleOpenAdmin}
        onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
        customerProfile={customerProfile}
        activeBookingsCount={activeBookingsCount}
        networkStatus={networkStatus}
        locationStatus={locationStatus}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {(activeView === 'catalog' || activeView === 'categories') && (
          <ServiceCatalogView
            currentAddress={currentAddress}
            onOpenLocationModal={() => setIsLocationModalOpen(true)}
            onAutoDetectLocation={() => fetchRealLocation(true)}
            isLocating={locationStatus.isLocating}
            onSelectServiceToBook={(service) => {
              handleAddToCart(service);
              setIsCartModalOpen(true);
            }}
            initialCategorySlug={selectedCategoryFilter}
            onGoBack={selectedCategoryFilter !== 'all' ? handleGoBack : undefined}
            cartItems={cartItems}
            onAddToCart={handleAddToCart}
            onUpdateCartHours={handleUpdateCartHours}
            onOpenCart={() => setIsCartModalOpen(true)}
          />
        )}

        {activeView === 'bookings' && (
          <MyBookingsView
            customerId={customerProfile.id}
            customerProfile={customerProfile}
            onExploreServices={() => {
              setSelectedCategoryFilter('all');
              navigateTo('catalog');
            }}
            onGoBack={handleGoBack}
          />
        )}

        {activeView === 'support' && (
          <HelpSupportView
            onExploreServices={() => {
              setSelectedCategoryFilter('all');
              navigateTo('catalog');
            }}
            onGoBack={handleGoBack}
          />
        )}

        {activeView === 'admin' && (
          <AdminPanel
            onCloseAdmin={() => navigateTo('catalog')}
            onSelectCustomerView={() => navigateTo('catalog')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  D
                </div>
                <span className="font-extrabold text-slate-900 tracking-tight text-xl font-['Outfit']">
                  DOORBLY
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                Odisha's premier hourly doorstep marketplace. Connecting households and businesses with verified electricians, technicians, carpenters, tutors, and cleaners across all 30 districts of Odisha.
              </p>
              <div className="pt-2 flex flex-col gap-1.5 text-xs text-slate-600 font-semibold">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transparent Hourly Billing • Verified Trade Partners</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Customer Helpline: </span>
                  <a href="tel:9938713179" className="text-slate-900 font-bold hover:text-indigo-600 transition-colors">
                    +91 99387 13179
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Email Support: </span>
                  <a href="mailto:support@doorbly.com" className="text-slate-900 font-bold hover:text-indigo-600 transition-colors">
                    support@doorbly.com
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3.5">
                Odisha District Hubs
              </h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li className="hover:text-slate-900 transition-colors">Bhubaneswar (Khordha)</li>
                <li className="hover:text-slate-900 transition-colors">Cuttack Millennium City</li>
                <li className="hover:text-slate-900 transition-colors">Puri & Konark Region</li>
                <li className="hover:text-slate-900 transition-colors">Rourkela (Sundargarh)</li>
                <li className="hover:text-slate-900 transition-colors">Berhampur & Ganjam</li>
                <li className="hover:text-slate-900 transition-colors">Sambalpur & Balasore</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3.5">
                Platform Information
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li>
                  <button
                    onClick={() => setIsDatabaseModalOpen(true)}
                    className="hover:text-indigo-600 font-medium cursor-pointer transition-colors"
                  >
                    Database Schema & Audit
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsLocationModalOpen(true)}
                    className="hover:text-indigo-600 font-medium cursor-pointer transition-colors"
                  >
                    Odisha Operating Zones
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveView('support')}
                    className="hover:text-indigo-600 font-medium cursor-pointer transition-colors"
                  >
                    Customer Support & FAQ
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <div 
              onDoubleClick={handleOpenAdmin}
              className="cursor-default select-none"
              title="Doorbly Technologies"
            >
              © {new Date().getFullYear()} Doorbly Technologies Pvt Ltd. All rights reserved.
            </div>

            <div className="flex items-center gap-1">
              <span>Made with dedication for</span>
              <strong className="text-slate-700 font-bold">Odisha</strong>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AdminLoginModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={() => {
          navigateTo('admin');
        }}
      />
      <OdishaLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentAddress={currentAddress}
        onSelectAddress={handleUpdateAddress}
      />

      <BookingModal
        isOpen={!!serviceToBook}
        onClose={() => setServiceToBook(null)}
        service={serviceToBook}
        customerProfile={customerProfile}
        currentAddress={currentAddress}
        onBookingSuccess={handleBookingSuccess}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cartItems}
        onUpdateHours={handleUpdateCartHours}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        customerProfile={customerProfile}
        currentAddress={currentAddress}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onBookingSuccess={handleBookingSuccess}
        onExploreMore={() => {
          setIsCartModalOpen(false);
          setSelectedCategoryFilter('all');
          navigateTo('catalog');
        }}
        onViewMyBookings={() => {
          setIsCartModalOpen(false);
          navigateTo('bookings');
        }}
      />

      <CustomerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        customerProfile={customerProfile}
        onProfileUpdated={handleUpdateProfile}
        onLogout={handleCustomerLogout}
        onAdminLogin={() => navigateTo('admin')}
      />

      <DatabaseVerificationModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
      />
    </div>
  );
}

