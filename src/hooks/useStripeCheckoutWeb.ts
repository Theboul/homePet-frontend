import { useCallback, useMemo, useState } from 'react';
import { getStripe, getStripePaymentLinkUrl } from '#/lib/stripe';

export function useStripeCheckoutWeb() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCheckout = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const stripe = await getStripe()?.catch(() => null);
      if (!stripe) {
        setError('Stripe no esta configurado. Falta VITE_STRIPE_PUBLISHABLE_KEY.');
        return;
      }

      const paymentLink = getStripePaymentLinkUrl();
      if (!paymentLink) {
        setError('Falta VITE_STRIPE_PAYMENT_LINK_URL para iniciar el checkout.');
        return;
      }

      window.location.assign(paymentLink);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return useMemo(
    () => ({
      startCheckout,
      isLoading,
      error,
    }),
    [startCheckout, isLoading, error],
  );
}
