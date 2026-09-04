import React, { useState } from 'react';
import { CartItem, CustomerAddress, CustomerProfile, Booking } from '../types';
import { createMultiItemBooking } from '../lib/supabase';
import { TaxInvoice, TaxInvoiceData } from './TaxInvoice';
import { getTechnicianVisual } from '../data/technicianVisuals';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  X,
  Calendar,
  Clock,
  MapPin,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Receipt,
  Navigation
} from 'lucide-react';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateHours: (serviceId: string, delta: number) => void;
  onRemoveItem: (serviceId: string) => void;
  onClearCart: () => void;
  customerProfile: CustomerProfile;
  currentAddress: CustomerAddress;
  onOpenLocationModal: () => void;
  onBookingSuccess: (booking: Booking) => void;
  onExploreMore: () => void;
  onViewMyBookings?: () => void;
}

type CheckoutStep = 'cart' | 'invoice' | 'confirmed';

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateHours,
  onRemoveItem,
  onClearCart,
  customerProfile,
  currentAddress,
  onOpenLocationModal,
  onBookingSuccess,
  onExploreMore,
  onViewMyBookings
}) => {
  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const [scheduledDate, setScheduledDate] = useState<string>(today);
  const [timeSlot, setTimeSlot] = useState<string>('09:00 AM - 12:00 PM');
  const [notes, setNotes] = useState<string>('');
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [generatedInvoiceData, setGeneratedInvoiceData] = useState<TaxInvoiceData | null>(null);

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 01:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 06:00 PM',
    '06:00 PM - 08:00 PM'
  ];

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.service.customer_hourly_price * item.hours);
  }, 0);
  const totalHours = cartItems.reduce((acc, item) => acc + item.hours, 0);
  const taxPercentage = 18; // 9% CGST + 9% SGST
  const taxAmount = Math.round(subtotal * (taxPercentage / 100) * 100) / 100;
  const grandTotal = Math.round((subtotal + taxAmount) * 100) / 100;

  // Step 1 -> Step 2: Confirm Order & Create Invoice
  const handleConfirmAndCreateInvoice = () => {
    if (cartItems.length === 0) return;

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const invoiceNumber = `INV-OD-${new Date().getFullYear()}-${randomSuffix}`;
    const bookingRef = `DBLY-OD-${randomSuffix}`;

    const invoiceData: TaxInvoiceData = {
      invoiceNumber,
      bookingReference: bookingRef,
      invoiceDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      customerProfile,
      customerAddress: currentAddress,
      scheduledDate,
      scheduledStartTime: timeSlot,
      items: cartItems.map(it => ({
        serviceName: it.service.name,
        hourlyPrice: it.service.customer_hourly_price,
        hours: it.hours,
        subtotal: it.service.customer_hourly_price * it.hours,
        taxAmount: Math.round((it.service.customer_hourly_price * it.hours * 0.18) * 100) / 100
      })),
      subtotal,
      taxPercentage,
      taxAmount,
      grandTotal,
      paymentStatus: 'pay_on_completion'
    };

    setGeneratedInvoiceData(invoiceData);
    setStep('invoice');
  };

  // Step 2 -> Step 3: Proceed & Place Order
  const handleProceedToPlaceOrder = async () => {
    if (!generatedInvoiceData || cartItems.length === 0) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const newBooking = await createMultiItemBooking({
        customerId: customerProfile.id,
        customerName: customerProfile.full_name || 'Customer in Odisha',
        customerPhone: customerProfile.phone || '+91 98610 12345',
        customerEmail: customerProfile.email || 'customer@doorbly.in',
        items: cartItems.map(item => ({
          service: item.service,
          hours: item.hours
        })),
        address: currentAddress,
        scheduledDate,
        scheduledStartTime: timeSlot,
        notes,
        taxPercentage
      });

      // Update invoice data with final booking reference
      setGeneratedInvoiceData({
        ...generatedInvoiceData,
        bookingReference: newBooking.booking_reference,
        invoiceNumber: newBooking.invoice_number || generatedInvoiceData.invoiceNumber
      });

      setConfirmedBooking(newBooking);
      onBookingSuccess(newBooking);
      onClearCart();
      setIsSubmitting(false);
      setStep('confirmed');
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Failed to place booking order. Please try again.');
    }
  };

  const handleResetAndClose = () => {
    setStep('cart');
    setConfirmedBooking(null);
    setGeneratedInvoiceData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className={`bg-white rounded-3xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto transition-all ${
          step === 'invoice' ? 'max-w-4xl' : 'max-w-2xl'
        }`}
      >
        {/* Close Button */}
        <button
          id="btn-close-cart-modal"
          onClick={handleResetAndClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer z-10"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: CART ITEMS & BOOKING SCHEDULE */}
        {step === 'cart' && (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Your Service Cart</h2>
                <p className="text-xs text-slate-500 font-medium">
                  {cartItems.length} {cartItems.length === 1 ? 'service item' : 'different service items'} selected • Doorstep Odisha
                </p>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                  Select and book any technician service from our catalog across Odisha. You can combine multiple different services in one booking!
                </p>
                <button
                  type="button"
                  id="btn-cart-explore-empty"
                  onClick={() => {
                    onClose();
                    onExploreMore();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Browse & Add Services</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Cart Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider px-1">
                    <span>Selected Services ({cartItems.length})</span>
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {cartItems.map((item) => {
                      const visual = getTechnicianVisual(item.service.category_slug || 'home-repair-maintenance', item.service.slug);
                      const itemSubtotal = item.service.customer_hourly_price * item.hours;

                      return (
                        <div
                          key={item.service.id}
                          className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-200 transition-colors"
                        >
                          <img
                            src={item.service.image_url || visual.imageUrl}
                            alt={item.service.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                            referrerPolicy="no-referrer"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-sm font-bold text-slate-900 truncate">
                                  {item.service.name}
                                </h4>
                                <p className="text-[11px] text-slate-500">
                                  ₹{item.service.customer_hourly_price}/hr • {visual.tradeRole}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-mono font-bold text-slate-900 text-sm">
                                  ₹{itemSubtotal}
                                </span>
                              </div>
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-slate-500">Hours:</span>
                                <div className="inline-flex items-center bg-white rounded-lg border border-slate-200 p-0.5 shadow-2xs">
                                  <button
                                    type="button"
                                    onClick={() => onUpdateHours(item.service.id, -1)}
                                    disabled={item.hours <= (item.service.minimum_hours || 1)}
                                    className="p-1 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                                    title="Decrease hours"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-6 text-center text-xs font-bold text-slate-900 font-mono">
                                    {item.hours}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => onUpdateHours(item.service.id, 1)}
                                    disabled={item.hours >= (item.service.maximum_hours || 8)}
                                    className="p-1 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                                    title="Increase hours"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.service.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Remove service"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add more services button */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onExploreMore();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add another service to this order</span>
                    </button>
                  </div>
                </div>

                {/* Scheduling & Doorstep Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  {/* Service Location */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        Doorstep Location
                      </span>
                      <button
                        type="button"
                        onClick={onOpenLocationModal}
                        className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                      >
                        Change / GPS
                      </button>
                    </div>
                    <p className="text-xs text-slate-800 font-medium leading-snug">
                      {currentAddress.address_line}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {currentAddress.area ? `${currentAddress.area}, ` : ''}
                      {currentAddress.city} ({currentAddress.district} Dist.), PIN: {currentAddress.pincode}
                    </p>
                  </div>

                  {/* Date & Slot */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      Schedule Date & Time
                    </span>
                    <div className="space-y-1.5">
                      <input
                        type="date"
                        min={today}
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                      >
                        {timeSlots.map((ts) => (
                          <option key={ts} value={ts}>{ts}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Special Instructions for Technician (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Bring extra copper wire, door bell is on left side, call before arriving..."
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 resize-none"
                  />
                </div>

                {/* Pricing Breakdown Summary */}
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-700">
                    <span>Items Subtotal ({totalHours} total hours):</span>
                    <span className="font-mono font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="flex items-center gap-1">
                      <span>GST (18% Govt. Tax):</span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-bold">9% CGST + 9% SGST</span>
                    </span>
                    <span className="font-mono font-semibold text-emerald-900">₹{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t border-emerald-200/80 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-bold text-emerald-950 block">Grand Total Payable</span>
                      <span className="text-[10px] text-emerald-700">Includes all applicable Odisha taxes</span>
                    </div>
                    <span className="text-xl font-extrabold text-emerald-950 font-mono">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

                {/* Step 1 CTA: Confirm & Create Invoice */}
                <div className="pt-2">
                  <button
                    type="button"
                    id="btn-confirm-create-invoice"
                    onClick={handleConfirmAndCreateInvoice}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm shadow-md hover:shadow-lg hover:shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>Confirm Order & Create Tax Invoice</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Review your official GST tax invoice before final confirmation. Pay after doorstep completion.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: FORMAL TAX INVOICE REVIEW */}
        {step === 'invoice' && generatedInvoiceData && (
          <div className="space-y-6">
            {/* Step Navigation Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Edit Cart</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Invoice Created with 18% Tax</span>
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            {/* Render Full Tax Invoice Component */}
            <TaxInvoice data={generatedInvoiceData} showPrintButton={true} />

            {/* Bottom Proceed Action Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-300">Total Verified Payable Amount</div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  ₹{grandTotal} <span className="text-xs text-slate-400 font-normal">(Incl. ₹{taxAmount} Tax)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Edit Items
                </button>

                <button
                  type="button"
                  id="btn-proceed-place-order"
                  onClick={handleProceedToPlaceOrder}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-bold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>{isSubmitting ? 'Placing Booking Order...' : 'Proceed & Place Order'}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ORDER CONFIRMED & INVOICE ACCESS */}
        {step === 'confirmed' && confirmedBooking && (
          <div className="text-center py-6 sm:py-8 space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm animate-in zoom-in-50 duration-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Booking Order Placed Successfully!
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Your service order has been confirmed and broadcast to verified doorstep technicians in {currentAddress.city}, Odisha.
              </p>
            </div>

            {/* Reference & Invoice Card */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Booking Reference:</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">
                  {confirmedBooking.booking_reference}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Invoice Number:</span>
                <span className="font-mono font-bold text-slate-900">
                  {confirmedBooking.invoice_number || generatedInvoiceData?.invoiceNumber}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Services Booked:</span>
                <span className="font-bold text-slate-900">
                  {confirmedBooking.items?.length || 1} Service(s) ({confirmedBooking.total_hours} hrs)
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Scheduled Window:</span>
                <span className="font-bold text-slate-900">
                  {confirmedBooking.scheduled_date} ({confirmedBooking.scheduled_start_time})
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-slate-500 font-medium">Total Payable (with 18% Tax):</span>
                <span className="font-mono font-extrabold text-base text-emerald-700">
                  ₹{confirmedBooking.customer_total}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                id="btn-view-confirmed-invoice"
                onClick={() => setStep('invoice')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>View & Print Tax Invoice</span>
              </button>

              {onViewMyBookings && (
                <button
                  type="button"
                  id="btn-track-in-my-bookings"
                  onClick={() => {
                    handleResetAndClose();
                    onViewMyBookings();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Track in My Bookings</span>
                </button>
              )}

              <button
                type="button"
                id="btn-book-more-services"
                onClick={() => {
                  handleResetAndClose();
                  onExploreMore();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Book More Services</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
