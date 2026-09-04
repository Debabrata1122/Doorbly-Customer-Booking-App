import React, { useState } from 'react';
import { Service } from '../types';
import { getTechnicianVisual } from '../data/technicianVisuals';
import { VfxCard } from './VfxCard';
import { Check } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
  onAddToCart?: (service: Service) => void;
  isInCart?: boolean;
  cartHours?: number;
  onUpdateCartHours?: (serviceId: string, delta: number) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onBook,
  onAddToCart,
  isInCart = false,
  cartHours,
  onUpdateCartHours
}) => {
  const [imageError, setImageError] = useState(false);

  // Retrieve curated technician image & visual assets for this exact trade
  const techVisual = getTechnicianVisual(service.category_slug || 'home-repair-maintenance', service.slug);

  // Active image URL (custom admin image or curated technician trade photo)
  const displayImageUrl = (!imageError && service.image_url) 
    ? service.image_url 
    : techVisual.imageUrl;

  // Format hourly rate
  const formattedPrice = Number.isInteger(service.customer_hourly_price)
    ? `₹${service.customer_hourly_price}`
    : `₹${service.customer_hourly_price.toFixed(2)}`;

  return (
    <VfxCard
      id={`service-card-${service.slug}`}
      glowColor="emerald"
      className="h-full"
    >
      {/* 1. Top Card Image Banner with Technician in Action */}
      <div className="relative h-40 w-full bg-slate-50 overflow-hidden shrink-0 border-b border-slate-100/80">
        <img
          src={displayImageUrl}
          alt={service.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Soft, light ambient gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/10 to-transparent pointer-events-none group-hover:opacity-75 transition-opacity duration-200" />

        {/* Lightweight Technician Role Badge with hover response */}
        <div className={`absolute top-2.5 left-3 text-[10px] font-medium ${techVisual.pillText} ${techVisual.pillBg} backdrop-blur-md px-2.5 py-0.5 rounded-full border ${techVisual.pillBorder} shadow-xs`}>
          <span>{techVisual.badgeLabel}</span>
        </div>

        {/* Lightweight Featured Tag */}
        {service.featured && (
          <span className="absolute top-2.5 right-3 text-[10px] font-medium tracking-wide text-emerald-900 bg-emerald-100/95 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-xs">
            Featured
          </span>
        )}
      </div>

      {/* 2. Card Body with Clean Light Weight Tints */}
      <div className="p-5 flex-1 flex flex-col justify-between relative bg-white transition-colors duration-200">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div>
              <h3 className="text-slate-900 text-lg leading-snug card-title group-hover:text-emerald-700 transition-colors duration-200">
                {service.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 card-subtext">
                {techVisual.tradeRole}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl text-slate-900 tracking-tight card-price group-hover:text-emerald-700 transition-colors duration-200 origin-right">
                {formattedPrice}
              </div>
              <span className="text-xs text-slate-500 font-normal block card-subtext">/ hour</span>
            </div>
          </div>

          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed mb-4 card-text">
            {service.description}
          </p>
        </div>

        {/* 3. Footer Action & Minimum Hours */}
        <div className="pt-3.5 border-t border-slate-100/90 flex items-center justify-between gap-2 mt-auto relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium card-subtext">
            <span>Minimum booking: {service.minimum_hours} {service.minimum_hours === 1 ? 'hour' : 'hours'}</span>
          </div>

          <button
            type="button"
            id={`btn-book-${service.slug}`}
            onClick={() => onBook(service)}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 ${
              isInCart
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>In Cart ({cartHours || service.minimum_hours}h)</span>
              </>
            ) : (
              <span>Book Now</span>
            )}
          </button>
        </div>
      </div>
    </VfxCard>
  );
};

