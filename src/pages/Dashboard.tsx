import React from "react";
import { Link } from "react-router-dom";
import { listCoupons, type Coupon } from "../api/coupons";
import api from "../api/client";

const Dashboard: React.FC = () => {
  const userName = (typeof window !== "undefined" && localStorage.getItem("userName")) || "Juan Morales";
  const [activeCoupons, setActiveCoupons] = React.useState<Coupon[]>([]);
  const [redeemedPoints, setRedeemedPoints] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const load = async () => {
      try {
        const [couponsRes, redemptionsRes] = await Promise.all([
          listCoupons({ status: 'active' }),
          api.get('/redemptions'),
        ]);
        setActiveCoupons(couponsRes);
        const points = (redemptionsRes.data || []).reduce((acc: number, r: any) => acc + (r.coupon?.value || 0), 0);
        setRedeemedPoints(points);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const level = redeemedPoints >= 500 ? 3 : redeemedPoints >= 200 ? 2 : 1;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Shell */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0B2450] text-white p-6 flex flex-col justify-between">
          <div>
            <div className="mb-8 text-2xl font-bold tracking-widest">LOGO</div>
            <nav className="space-y-3 text-white">
              <a className="flex text-white items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10" href="#">
                <span>🏠</span>
                <span>Inicio</span>
              </a>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10" href="#">
                <span>👤</span>
                <span>Mi cuenta</span>
              </a>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10" href="#">
                <span>🎁</span>
                <span>Mis beneficios</span>
              </a>
              <Link className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10" to="/coupons">
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

        {/* Content */}
        <main className="flex-1 p-6 md:p-10">
          {/* Top bar */}
          <div className="mb-6 flex items-center justify-end gap-4">
            <button className="rounded-full bg-white px-3 py-2 shadow">🔔</button>
            <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Bienvenido, {userName}</h1>
                <p className="mt-1 text-gray-600">
                  Aquí se mostrará un resumen de tu actividad, saldo y beneficios destacados.
                </p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">ÚLTIMA VERSIÓN: 0.1.0</span>
            </div>

            {/* KPI cards */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Points */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-blue-700 p-6 text-white shadow">
                <div className="text-sm uppercase tracking-wider opacity-80">Mis puntos</div>
                <div className="mt-2 text-4xl font-bold">{redeemedPoints} puntos</div>
              </div>

              {/* Level */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 p-6 text-white shadow">
                <div className="text-sm uppercase tracking-wider opacity-80">Mi nivel</div>
                <div className="mt-2 text-4xl font-bold">Nivel {level}</div>
              </div>

              {/* Badges */}
              <div className="rounded-xl bg-[#3B67B3] p-6 text-white shadow">
                <div className="text-2xl font-semibold">0 de 4</div>
                <p className="mt-2 text-sm opacity-90">
                  ¿Querés obtener 200 puntos? Registrá 4 visitas en nuestras tiendas.
                </p>
                <button className="mt-4 w-full rounded-full border border-white/70 px-4 py-2 text-sm hover:bg-white/10">
                  REGISTRAR
                </button>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Beneficios y experiencias</h2>
              <Link to="#" className="text-sm text-indigo-600 hover:underline">
                Ver todo
              </Link>
            </div>

            {/* Cards row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {loading && <div className="text-sm text-gray-500">Cargando beneficios...</div>}
              {!loading && activeCoupons.slice(0,4).map((c) => (
                <div key={c.id} className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                  <div className="relative h-28 w-full bg-gray-200" />
                  <div className="p-4">
                    <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Activo
                    </span>
                    <p className="mt-2 text-sm text-gray-600">
                      {c.code} · {c.description}
                    </p>
                    <div className="mt-1 text-xs text-gray-500">Puntos: {c.value} · Vence {new Date(c.expirationDate).toLocaleDateString()}</div>
                    <Link to="/coupons" className="mt-3 block w-full rounded-full bg-slate-900 px-4 py-2 text-center text-xs font-semibold text-white hover:opacity-95">
                      QUIERO EL CUPÓN
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
