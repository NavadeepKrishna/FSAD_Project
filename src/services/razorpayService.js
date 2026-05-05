// ─────────────────────────────────────────────────────────────
//  razorpayService.js  —  Razorpay Test Mode Integration
//
//  How it works (frontend-only / test mode):
//  1. We load the Razorpay checkout.js script dynamically
//  2. Open the Razorpay popup with test key + amount
//  3. On success, Razorpay returns a payment_id
//  4. We treat that as confirmed (no backend signature verification in test mode)
//
//  Test cards to use:
//    Card Number : 4111 1111 1111 1111
//    Expiry      : Any future date
//    CVV         : Any 3 digits
//    OTP         : 1234 (Razorpay test OTP)
//
//  Test UPI     : success@razorpay
//
//  Setup:
//  1. Go to https://dashboard.razorpay.com
//  2. Sign up (free) → switch to TEST MODE (top-right toggle)
//  3. Settings → API Keys → Generate Test Key
//  4. Copy Key ID (starts with rzp_test_) → paste into .env
// ─────────────────────────────────────────────────────────────

import { CONFIG, isRazorpayConfigured } from '../config.js';

/** Dynamically load the Razorpay checkout script once */
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Opens Razorpay checkout popup.
 *
 * @param {Object} booking  — pending booking object
 * @param {Object} handlers — { onSuccess(paymentId), onFailure(err), onDismiss() }
 * @returns {Promise<void>}
 */
export async function openRazorpayCheckout(booking, { onSuccess, onFailure, onDismiss }) {
  if (!isRazorpayConfigured()) {
    // Razorpay key not set — return a fake success so app still works in demo
    console.info('[Razorpay] Key not configured — using demo mode.');
    setTimeout(() => onSuccess('demo_pay_' + Date.now()), 800);
    return;
  }

  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onFailure(new Error('Could not load Razorpay script. Check your internet connection.'));
    return;
  }

  const options = {
    key:         CONFIG.razorpay.keyId,
    amount:      CONFIG.razorpay.toPaise(booking.total),   // paise
    currency:    CONFIG.razorpay.currency,
    name:        'TechNova 2025',
    description: `${booking.qty} ticket${booking.qty > 1 ? 's' : ''} — ${booking.eventName}`,
    image:       'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&q=80',

    prefill: {
      name:    booking.name,
      email:   booking.email,
      contact: '',                    // optional phone
    },

    notes: {
      booking_id:  booking.bookingId,
      department:  booking.dept,
      event:       booking.eventName,
    },

    theme: {
      color: '#00d4ff',               // matches our accent-cyan
      backdrop_blur: true,
    },

    modal: {
      ondismiss: () => {
        console.info('[Razorpay] Popup dismissed by user.');
        if (onDismiss) onDismiss();
      },
      // Don't close on backdrop click accidentally
      escape: false,
    },

    handler: function (response) {
      // response.razorpay_payment_id — real payment ID from Razorpay
      console.info('[Razorpay] Payment successful:', response.razorpay_payment_id);
      onSuccess(response.razorpay_payment_id);
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      console.error('[Razorpay] Payment failed:', response.error);
      onFailure(new Error(response.error.description || 'Payment failed'));
    });
    rzp.open();
  } catch (err) {
    onFailure(err);
  }
}
