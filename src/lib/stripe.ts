import { loadStripe } from '@stripe/stripe-js';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as
  | string
  | undefined;

let stripePromise: ReturnType<typeof loadStripe> | null = null;

export function getStripe() {
  if (!publishableKey) return null;
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
}

export function getStripePaymentLinkUrl() {
  return (import.meta.env.VITE_STRIPE_PAYMENT_LINK_URL as string | undefined) ?? '';
}
