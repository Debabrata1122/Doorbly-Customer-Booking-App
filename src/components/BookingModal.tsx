import React, { useState } from 'react';
import { Booking, CustomerAddress, CustomerProfile, Service } from '../types';
import { createBooking } from '../lib/supabase';
import { getTechnicianVisual } from '../data/technicianVisuals';
import { VfxCard, GlowColor } from './VfxCard';
import { Calendar, Clock, MapPin, CheckCircle2, ShieldCheck, X, AlertCircle, Sparkles, UserCheck } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  customerProfile: CustomerProfile;
  currentAddress: CustomerAddress;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  service,
  customerProfile,
  currentAddress,
  onBookingSuccess
}) => {
  if (!isOpen || !service) return null;

  // Defaults
  const today = new Date().toISOString().split('T')[0];
  const [scheduledDate, setScheduledDate] = useState<string>(today);
  const [timeSlot, setTimeSlot] = useState<string>('09:00 AM - 12:00 PM');
  const [hours, setHours] = useState<number>(service.minimum_hours || 1);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pricePerHour = service.customer_hourly_price;
  const bookingTotal = pricePerHour * hours;

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 01:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM'
  ];

  const handleHourChange = (delta: number) => {
    const newHours = hours + delta;
    if (newHours >= service.minimum_hours && newHours <= (service.maximum_hours || 8)) {
      setHours(newHours);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const newBooking = await createBooking({
        customerId: customerProfile.id,
        customerName: customerProfile.full_name || 'Customer in Odisha',
        customerPhone: customerProfile.phone || '+91 98610 12345',
        customerEmail: customerProfile.email || 'customer@doorbly.in',
        service: service,
        address: currentAddress,
        scheduledDate,
        scheduledStartTime: timeSlot,
        hours,
        notes
      });

      setIsSubmitting(false);
      onBookingSuccess(newBooking);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Failed to submit booking. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
        <button
          id="btn-close-booking-modal"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Book Hourly Service</h2>
            <p className="text-xs text-slate-500 font-medium">Verified Doorstep Service in {currentAddress.city}, Odisha</p>
          </div>
        </div>

        {/* Service Summary Card with Technician Visual */}
        {(() => {
          const techVisual = getTechnicianVisual(service.category_slug || 'home-repair-maintenance', service.slug);
          const displayImg = service.image_url || techVisual.imageUrl;

          return (
            <div className="mb-4">
              <VfxCard glowColor="emerald" className="group">
                <div className="relative bg-white p-4 overflow-hidden w-full transition-colors duration-200">
                  <div className="relative z-10 flex gap-3.5 items-center">
                    <img
                      src={displayImg}
                      alt={service.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200/80 shadow-xs shrink-0 transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[10px] font-medium uppercase tracking-wider ${techVisual.pillBg} ${techVisual.pillText} border ${techVisual.pillBorder} px-2 py-0.5 rounded-md`}>
                              {service.category_name}
                            </span>
                            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                              {techVisual.badgeLabel}
                            </span>
                          </div>
                          <h3 className="text-sm text-slate-900 truncate card-title group-hover:text-emerald-700 transition-colors">{service.name}</h3>
                          <p className="text-[11px] text-slate-500 truncate card-subtext">{techVisual.tradeRole}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-base text-slate-900 font-mono card-price group-hover:text-emerald-700 transition-all inline-block">
                            ₹{Number.isInteger(pricePerHour) ? pricePerHour : pricePerHour.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal block card-subtext">/ hour</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </VfxCard>
            </div>
          );
        })()}

        {/* Booking Form */}
        <form onSubmit={handleConfirmBooking} className="space-y-4">
          {/* Location details */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-3 flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
            <div className="text-xs leading-snug">
              <span className="font-bold text-slate-800">Doorstep Location: </span>
              <span className="text-slate-700">
                {currentAddress.address_line || `${currentAddress.area}, ${currentAddress.city}`}, {currentAddress.district}, {currentAddress.state} - {currentAddress.pincode}
              </span>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Select Service Date</span>
            </label>
            <input
              type="date"
              id="input-scheduled-date"
              min={today}
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium text-slate-900"
            />
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Select Arrival Time Window</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all text-left cursor-pointer ${
                    timeSlot === slot
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Hours Counter */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Number of Hours (Duration)
              </label>
              <span className="text-xs text-slate-500 font-medium">
                Minimum: {service.minimum_hours} {service.minimum_hours === 1 ? 'hour' : 'hours'}
              </span>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2 justify-between">
              <button
                type="button"
                id="btn-decrement-hours"
                onClick={() => handleHourChange(-1)}
                disabled={hours <= service.minimum_hours}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                -
              </button>

              <div className="text-center">
                <span className="text-xl font-extrabold text-slate-900 font-mono">{hours}</span>
                <span className="text-xs text-slate-500 font-medium ml-1">
                  {hours === 1 ? 'Hour' : 'Hours'}
                </span>
              </div>

              <button
                type="button"
                id="btn-increment-hours"
                onClick={() => handleHourChange(1)}
                disabled={hours >= (service.maximum_hours || 8)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-lg flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                +
              </button>
            </div>
          </div>

          {/* Notes / Instructions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instructions / Task Description for Service Partner (Optional)
            </label>
            <textarea
              id="input-booking-notes"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please bring extra ladder or specific wire type / 2nd floor flat"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all resize-none text-slate-900"
            />
          </div>

          {/* Price Breakdown - CUSTOMER VISIBLE ONLY */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-sm border border-slate-800">
            <div className="flex justify-between items-center text-xs text-slate-300 mb-1">
              <span>Service Hourly Rate</span>
              <span className="font-mono text-white">₹{Number.isInteger(pricePerHour) ? pricePerHour : pricePerHour.toFixed(2)}/hr</span>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-300 mb-2.5">
              <span>Selected Duration</span>
              <span className="font-mono text-white">{hours} {hours === 1 ? 'hour' : 'hours'}</span>
            </div>
            <div className="pt-2.5 border-t border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-sm font-bold text-white block">Booking Total</span>
                <span className="text-[10px] text-slate-400">Pay directly after service completion</span>
              </div>
              <div className="text-2xl font-black text-indigo-400 font-mono tracking-tight">
                ₹{Number.isInteger(bookingTotal) ? bookingTotal : bookingTotal.toFixed(2)}
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              id="btn-cancel-booking-modal"
              className="py-3.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all text-xs cursor-pointer"
            >
              Go Back
            </button>

            <button
              type="submit"
              id="btn-confirm-and-book"
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold rounded-2xl transition-all shadow-md hover:shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Confirming Hourly Booking...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Place Hourly Booking</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Doorbly Verified Odisha Partner Guarantee • Transparent Hourly Billing
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
