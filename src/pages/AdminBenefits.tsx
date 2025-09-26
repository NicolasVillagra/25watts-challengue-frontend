import React, { useMemo, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { listCoupons, createCoupon, deleteCoupon, type Coupon, type CouponStatus } from "../api/coupons";

const StatusPill: React.FC<{ status: CouponStatus }> = ({ status }) => (
  <span
    className={
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold " +
      (status === "active"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-red-100 text-red-600")
    }
  >
    {status.toUpperCase()}
  </span>
);

const AdminBenefits: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"todos" | CouponStatus>("todos");
  const [sort, setSort] = useState<"code" | "value" | "expirationDate">("code");
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [data, setData] = useState<Coupon[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<{ code: string; description: string; value: number; expirationDate: string; status: CouponStatus }>({ code: "", description: "", value: 0, expirationDate: "", status: "active" });

  // Guard simple de rol admin
  React.useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") navigate("/login", { replace: true });
  }, [navigate]);

  React.useEffect(() => {
    (async () => {
      try {
        const list = await listCoupons();
        setData(list);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let rows = data.filter((r) => `${r.code} ${r.description}`.toLowerCase().includes(query.toLowerCase()));
    if (status !== "todos") rows = rows.filter((r) => r.status === status);
    rows.sort((a, b) => {
      if (sort === "code") return a.code.localeCompare(b.code);
      if (sort === "value") return a.value - b.value;
      return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
    });
    return rows;
  }, [query, status, sort, data]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resetToFirst = () => setPage(1);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0B2450] text-white p-6 flex flex-col justify-between">
          <div>
            <div className="mb-8 text-2xl font-bold tracking-widest">25Watts</div>
            <nav className="space-y-3">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10 ${isActive ? 'bg-white/10' : ''}`
                }
              >
                <span>🏠</span>
                <span>Inicio</span>
              </NavLink>
              <button type="button" className="flex items-center gap-3 rounded-lg px-3 py-2 opacity-60 cursor-not-allowed select-none" onFocus={(e)=>e.currentTarget.blur()}>
                <span>👥</span>
                <span>Usuarios</span>
              </button>
              <button type="button" className="flex items-center gap-3 rounded-lg px-3 py-2 opacity-60 cursor-not-allowed select-none" onFocus={(e)=>e.currentTarget.blur()}>
                <span>🛡️</span>
                <span>Roles</span>
              </button>
              <NavLink
                to="/admin/benefits"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10 ${isActive ? 'bg-white/10' : ''}`
                }
              >
                <span>🎁</span>
                <span>Beneficios</span>
              </NavLink>
              <Link className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10" to="/login">
                <span>🚪</span>
                <span>Cerrar Sesión</span>
              </Link>
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
            <div className="text-xl font-semibold text-[#0B2450]">25Watts</div>
            <div className="flex items-center gap-3">
              <button className="rounded-full bg-white px-3 py-2 shadow">🔔</button>
              <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-300" />
            </div>
          </div>

          {/* Content Card */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative w-full max-w-2xl">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                  <input
                    className="w-full rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-300 focus:bg-white"
                    placeholder="Buscador"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); resetToFirst(); }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      className="appearance-none rounded-full border border-gray-200 bg-white px-4 py-2 text-sm pr-8 focus:border-blue-300"
                      value={status}
                      onChange={(e) => { setStatus(e.target.value as any); resetToFirst(); }}
                    >
                      <option value="todos">ESTADO</option>
                      <option value="active">Activos</option>
                      <option value="inactive">Inactivos</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
                  </div>
                  <div className="relative">
                    <select
                      className="appearance-none rounded-full border border-gray-200 bg-white px-4 py-2 text-sm pr-8 focus:border-blue-300"
                      value={sort}
                      onChange={(e) => setSort(e.target.value as any)}
                    >
                      <option value="code">ORDENAR POR</option>
                      <option value="value">Puntos</option>
                      <option value="expirationDate">Fecha de expiración</option>
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">▾</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setIsOpen(true); setForm({ code: "", description: "", value: 0, expirationDate: "", status: "active" }); }}
                  className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  CREAR NUEVO BENEFICIO
                </button>
                <button className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50">
                  ⬚
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="px-6 py-3 font-semibold">Código</th>
                    <th className="px-6 py-3 font-semibold">Descripción</th>
                    <th className="px-6 py-3 font-semibold">Puntos</th>
                    <th className="px-6 py-3 font-semibold">Expira</th>
                    <th className="px-6 py-3 font-semibold">Estado</th>
                    <th className="px-6 py-3 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pageData.map((r) => (
                    <tr key={r.id} className="text-sm">
                      <td className="px-6 py-3">{r.code}</td>
                      <td className="px-6 py-3 text-gray-600">{r.description}</td>
                      <td className="px-6 py-3">{r.value}</td>
                      <td className="px-6 py-3">{new Date(r.expirationDate).toLocaleDateString()}</td>
                      <td className="px-6 py-3"><StatusPill status={r.status} /></td>
                      <td className="px-6 py-3">
                        <div className="flex justify-end gap-3 text-blue-600">
                          <button
                            title="Editar"
                            onClick={() => navigate(`/admin/benefits/${r.id}`, { state: { benefit: r } })}
                          >
                            ✏️
                          </button>
                          <button
                            title="Eliminar"
                            onClick={async () => {
                              if (confirm('¿Eliminar beneficio?')) {
                                await deleteCoupon(r.id)
                                setData((prev) => prev.filter((x) => x.id !== r.id))
                              }
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 text-sm hover:bg-gray-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ←
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-8 w-8 rounded-full text-sm ${
                    page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="grid h-8 w-8 place-items-center rounded-full border border-gray-200 text-sm hover:bg-gray-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                →
              </button>
            </div>
          </section>
          {/* Modal Create Benefit */}
          {isOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <h3 className="text-lg font-semibold text-[#0B2450]">Crear nuevo beneficio</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
                    aria-label="Cerrar"
                  >
                    ✕
                  </button>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const created = await createCoupon({
                      code: form.code,
                      description: form.description,
                      value: form.value,
                      expirationDate: form.expirationDate,
                      status: form.status,
                    });
                    setData((prev) => [created, ...prev]);
                    setIsOpen(false);
                    setPage(1);
                  }}
                >
                  <div className="space-y-4 px-6 py-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Código</label>
                        <input
                          className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-300 focus:bg-white"
                          value={form.code}
                          onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Puntos</label>
                        <input
                          type="number"
                          min={0}
                          className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-300 focus:bg-white"
                          value={form.value}
                          onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                          className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-300 focus:bg-white"
                          rows={3}
                          value={form.description}
                          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Expira</label>
                        <input
                          type="datetime-local"
                          className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-300 focus:bg-white"
                          value={form.expirationDate}
                          onChange={(e) => setForm((f) => ({ ...f, expirationDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
                        <select
                          className="w-full appearance-none rounded-full border border-gray-200 bg-white px-4 py-2 text-sm focus:border-blue-300"
                          value={form.status}
                          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CouponStatus }))}
                        >
                          <option value="active">Activo</option>
                          <option value="inactive">Inactivo</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminBenefits;
