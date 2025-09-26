import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCoupons, redeemCoupon, type Coupon } from "../api/coupons";

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }>=({ active, onClick, children })=> (
  <button
    onClick={onClick}
    className={`px-2 pb-2 text-sm font-medium tracking-wide border-b-2 transition ${
      active ? "border-slate-900 text-slate-900" : "border-transparent text-gray-500 hover:text-slate-900"
    }`}
  >
    {children}
  </button>
);

const CouponCard: React.FC<{ data: Coupon; onRedeem: (code: string) => Promise<void> }> = ({ data, onRedeem }) => (
  <div className="relative flex flex-col md:flex-row items-start md:items-stretch gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    {/* Ticket notch effect */}
    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
      <div className="h-4 w-4 rounded-full bg-gray-100 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]" />
    </div>
    <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2">
      <div className="h-4 w-4 rounded-full bg-gray-100 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]" />
    </div>

    <div className="flex min-w-0 flex-1 items-center">
      {/* Brand */}
      <div className="mr-4 flex h-14 w-14 items-center justify-center rounded bg-gray-100">
        <span className="text-xl">🦈</span>
      </div>
      {/* Text */}
      <div className="min-w-0">
        <div className="text-lg font-extrabold text-slate-900">{data.code}</div>
        <div className="text-sm text-slate-700">{data.description}</div>
        <div className="mt-1 text-xs text-gray-500">Puntos: {data.value} · Vence {new Date(data.expirationDate).toLocaleDateString()}</div>
        {data.status === 'active' ? (
          <button onClick={() => onRedeem(data.code)} className="mt-3 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:opacity-95">CANJEAR</button>
        ) : (
          <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${data.status === 'redeemed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>{data.status.toUpperCase()}</span>
        )}
      </div>
    </div>

    {/* Divider */}
    <div className="mx-2 w-px bg-gray-200 hidden md:block" />

    {/* Right benefit */}
    <div className="flex w-full md:min-w-[220px] flex-col justify-center md:w-auto md:ml-0">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-8 w-12 items-center justify-center rounded bg-emerald-100 text-sm font-bold text-emerald-700">{data.value}</span>
        <div className="text-base font-semibold text-slate-900">Beneficio</div>
      </div>
      <div className="text-sm text-slate-700">Estado: {data.status}</div>
      <div className="mt-1 text-xs text-gray-500">Expira: {new Date(data.expirationDate).toLocaleDateString()}</div>
      <button disabled className="mt-3 w-max rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-900 opacity-60">DETALLE</button>
    </div>
  </div>
);

const Coupons: React.FC = () => {
  const userName = (typeof window !== "undefined" && localStorage.getItem("userName")) || "Juan";
  const [tab, setTab] = useState<'disponibles'|'cash'|'usados'>('disponibles');
  const [data, setData] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const statusParam = tab === 'disponibles' ? 'active' : tab === 'usados' ? 'redeemed' : undefined;
        const list = await listCoupons(statusParam ? { status: statusParam as any } : undefined);
        setData(list);
      } catch (e: any) {
        setError(e?.message || 'Error cargando cupones');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const onRedeem = async (code: string) => {
    try {
      await redeemCoupon({ code });
      // Refrescar lista (el backend marca el cupón como redeemed)
      const list = await listCoupons({ status: 'active' as any });
      setData(list);
      alert('Cupón canjeado con éxito');
    } catch (e: any) {
      alert(e?.response?.data?.message || 'No se pudo canjear el cupón');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 overflow-x-hidden">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        {/* Mobile sidebar (drawer) */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="relative h-full w-72 bg-[#0B2450] text-white p-6 flex flex-col justify-between">
              <div>
                <div className="mb-8 text-2xl font-bold tracking-widest">LOGO</div>
                <nav className="space-y-3 text-white">
                  <Link className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10" to="/dashboard" onClick={()=>setMobileOpen(false)}>
                    <span>🏠</span>
                    <span>Inicio</span>
                  </Link>
                  <a className="flex items-center gap-3 rounded-lg px-3 py-2 opacity-60 cursor-not-allowed select-none" onFocus={(e)=>e.currentTarget.blur()}>
                    <span>👤</span>
                    <span>Mi cuenta</span>
                  </a>
                  <a className="flex items-center gap-3 rounded-lg px-3 py-2 opacity-60 cursor-not-allowed select-none" onFocus={(e)=>e.currentTarget.blur()}>
                    <span>🎁</span>
                    <span>Mis beneficios</span>
                  </a>
                  <Link className="flex items-center gap-3 rounded-lg px-3 py-2 bg-white/10" to="/coupons" onClick={()=>setMobileOpen(false)}>
                    <span>🏷️</span>
                    <span>Mis cupones</span>
                  </Link>
                  <a className="flex items-center gap-3 rounded-lg px-3 py-2 opacity-60 cursor-not-allowed select-none" onFocus={(e)=>e.currentTarget.blur()}>
                    <span>💬</span>
                    <span>Recomendá</span>
                  </a>
                </nav>
              </div>
              <div className="space-y-2">
                <div className="text-sm opacity-80">Darkmode</div>
                <button className="w-full rounded-full border border-white/30 px-4 py-2 hover:bg-white/10">🌙</button>
              </div>
            </div>
          </div>
        )}

        <aside className="hidden md:flex w-64 bg-[#0B2450] text-white p-6 flex-col justify-between">
          <div>
            <div className="mb-8 text-2xl font-bold tracking-widest">LOGO</div>
            <nav className="space-y-3 text-white">
              <Link className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10" to="/dashboard">
                <span>🏠</span>
                <span>Inicio</span>
              </Link>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10" href="#">
                <span>👤</span>
                <span>Mi cuenta</span>
              </a>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10" href="#">
                <span>🎁</span>
                <span>Mis beneficios</span>
              </a>
              <Link className="flex items-center gap-3 rounded-lg px-3 py-2 bg-white/10" to="/coupons">
                <span>🏷️</span>
                <span>Mis cupones</span>
              </Link>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10" href="#">
                <span>💬</span>
                <span>Recomendá</span>
              </a>
            </nav>
          </div>
          <div className="space-y-2">
            <div className="text-sm opacity-80">Darkmode</div>
            <button className="w-full rounded-full border border-white/30 px-4 py-2 hover:bg-white/10">🌙</button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 md:p-10">
          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="md:hidden rounded-full bg-white px-3 py-2 shadow" onClick={()=>setMobileOpen(true)}>☰</button>
              <div className="text-xl font-semibold text-[#0B2450]">25Watts</div>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full bg-white px-3 py-2 shadow">🔔</button>
              <img src="https://avatars.githubusercontent.com/u/104174?v=4" className="h-9 w-9 overflow-hidden rounded-full bg-gray-300" />
            </div>
          </div>

          {/* Container card */}
          <section className="rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <h1 className="text-2xl font-bold text-[#0B2450]">Mis cupones</h1>
            <p className="mt-1 text-gray-600 max-w-2xl">
              Una galería con todos los beneficios disponibles para vos por ser parte de la plataforma, {userName}.
            </p>

            {/* Tabs */}
            <div className="mt-6 flex gap-6 border-b border-gray-200">
              <TabButton active={tab==='disponibles'} onClick={()=>setTab('disponibles')}>DISPONIBLES</TabButton>
              <TabButton active={tab==='cash'} onClick={()=>setTab('cash')}>CASH</TabButton>
              <TabButton active={tab==='usados'} onClick={()=>setTab('usados')}>USADOS</TabButton>
            </div>

            {/* Grid of coupons */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {loading && <div className="text-sm text-gray-500">Cargando...</div>}
              {error && <div className="text-sm text-red-600">{error}</div>}
              {!loading && !error && data.length === 0 && (
                <div className="text-sm text-gray-500">No hay cupones para mostrar.</div>
              )}
              {!loading && !error && data.map((c) => (
                <CouponCard key={c.id} data={c} onRedeem={onRedeem} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Coupons;
