// ─────────────────────────────────────────────────────────────
//  config.js  —  All API keys read from Vite env variables
//  Keys are injected at BUILD time via import.meta.env
//  Never hardcode keys here — always use .env file
// ─────────────────────────────────────────────────────────────

export const CONFIG = {
  razorpay: {
    keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SbGnUtKxNY68sn',
    currency: 'INR',
    // Razorpay amounts are in PAISE (multiply ₹ by 100)
    toPaise: (rupees) => Math.round(rupees * 100),
  },
};

// Helper: check if Razorpay key looks real
export const isRazorpayConfigured = () =>
  CONFIG.razorpay.keyId &&
  CONFIG.razorpay.keyId.startsWith('rzp_') &&
  !CONFIG.razorpay.keyId.includes('XXXXX');
