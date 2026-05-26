import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '#/components/ui/button';
import { TrialBanner } from '#/components/TrialBanner';
import { useUpgradeDemo } from '#/hooks/useUpgradeDemo';
import { useAppSelector } from '#/store/hooks';

export const Route = createFileRoute('/_admin/billing')({
  component: BillingPage,
});

function BillingPage() {
  const plan = useAppSelector((state) => state.tenant.plan as any);
  const { start, confirm, isLoading, error } = useUpgradeDemo();
  const [planId, setPlanId] = useState(1);
  const [checkoutToken, setCheckoutToken] = useState('');

  const planStatus = useMemo(() => {
    return plan?.estado_suscripcion || plan?.subscription_status || plan?.estado || 'TRIAL';
  }, [plan]);

  const onStart = async (e: FormEvent) => {
    e.preventDefault();
    const data = await start(planId);
    setCheckoutToken(data.checkout_token);
  };

  const onConfirm = async () => {
    if (!checkoutToken) return;
    await confirm(checkoutToken);
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <TrialBanner />
      <div className="rounded-xl bg-white p-6 text-slate-900">
        <h1 className="text-2xl font-bold">Facturacion</h1>
        <p className="mt-2">Estado de suscripcion: <strong>{String(planStatus).toUpperCase()}</strong></p>

        <form onSubmit={onStart} className="mt-6 space-y-3">
          <label className="block text-sm font-medium">Plan a comprar</label>
          <select
            value={planId}
            onChange={(e) => setPlanId(Number(e.target.value))}
            className="w-full rounded-md border border-slate-300 px-3 py-2"
          >
            <option value={1}>Basico</option>
            <option value={2}>Pro</option>
            <option value={3}>Enterprise</option>
          </select>
          <Button disabled={isLoading} type="submit" className="w-full bg-[#F97316] hover:bg-[#EA580C]">
            Comprar plan
          </Button>
        </form>

        {checkoutToken ? (
          <Button disabled={isLoading} onClick={onConfirm} className="mt-3 w-full" variant="outline">
            Confirmar upgrade demo
          </Button>
        ) : null}

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      </div>
    </main>
  );
}
