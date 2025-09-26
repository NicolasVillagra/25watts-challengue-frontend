import React from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { getCoupon, updateCoupon, deleteCoupon, type Coupon, type CouponStatus } from "../api/coupons";

const AdminBenefitEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation() as { state?: { benefit?: Coupon } };
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") navigate("/login", { replace: true });
  }, [navigate]);

  const [form, setForm] = React.useState<Coupon>(() => {
    const fromState = location.state?.benefit;
    if (fromState) return fromState;
    // fallback demo if no state is provided
    return {
      id: Number(id) || 0,
      code: "50%",
      description: "Servicio de estacionamiento",
      value: 120,
      expirationDate: new Date().toISOString(),
      status: "active",
    } as Coupon;
  });

  React.useEffect(() => {
    // If no state benefit provided, fetch from API
    if (!location.state?.benefit && id) {
      (async () => {
        try {
          const data = await getCoupon(Number(id));
          setForm(data);
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [id]);

  const onSave = async () => {
    await updateCoupon(form.id, {
      code: form.code,
      description: form.description,
      value: form.value,
      expirationDate: form.expirationDate,
      status: form.status,
    });
    navigate("/admin/benefits");
  };

  const onDelete = async () => {
    if (confirm("¿Eliminar este beneficio?")) {
      await deleteCoupon(form.id);
      navigate("/admin/benefits");
    }
  };

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("auth");
    navigate("/login");
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
                <div className="mb-8 text-2xl font-bold tracking-widest">25Watts</div>
                <nav className="space-y-3">
                  <NavLink
                    to="/admin"
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10 ${isActive ? 'bg-white/10' : ''}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>🏠</span>
                    <span>Inicio</span>
                  </NavLink>
                  <NavLink
                    to="/admin/benefits"
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10 ${isActive ? 'bg-white/10' : ''}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>🎁</span>
                    <span>Beneficios</span>
                  </NavLink>
                  <button onClick={() => { setMobileOpen(false); logout(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10 text-left">
                    <span>🚪</span>
                    <span>Cerrar Sesión</span>
                  </button>
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
              <NavLink
                to="/admin/benefits"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10 ${isActive ? 'bg-white/10' : ''}`
                }
              >
                <span>🎁</span>
                <span>Beneficios</span>
              </NavLink>
              <button onClick={logout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10 text-left">
                <span>🚪</span>
                <span>Cerrar Sesión</span>
              </button>
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
              <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-300" />
            </div>
          </div>

          {/* Content */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            {/* Breadcrumb & back */}
            <div className="mb-4 flex items-center gap-3 text-sm text-gray-600">
              <button className="rounded-full border border-gray-200 px-3 py-1 hover:bg-gray-50" onClick={() => navigate(-1)}>← Atrás</button>
              <span>Inicio</span>
              <span>·</span>
              <span>Beneficios</span>
              <span>·</span>
              <span>Editar beneficio</span>
            </div>

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold">Beneficio: {form.code}</h1>
                <p className="mt-1 text-gray-500">US.DOMINO · LOREM IPSUM IS A MET.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-blue-600">
                  <span className="text-xs">{form.status === 'active' ? 'ON' : 'OFF'}</span>
                </div>
                <button onClick={onDelete} className="rounded-full border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50">
                  ELIMINAR BENEFICIO
                </button>
              </div>
            </div>

            {/* Tabs faux */}
            <div className="mt-4 rounded-full bg-[#0B2450] px-4 py-2 text-center text-white text-sm font-semibold">Datos del cupón</div>

            {/* Form card */}
            <div className="mt-4 rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-blue-600">Imagen del cupón</h3>
              <div className="mt-3 rounded-2xl border border-dashed border-gray-300 p-6">
                <label className="mb-1 block text-sm text-gray-600">Imagen del cupón</label>
                <div className="flex items-center justify-between gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500">
                  <span>Seleccionar imagen</span>
                  <span>🔍</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nombre*</label>
                  <input
                    className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-300 focus:bg-white"
                    value={form.code}
                    onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Descripción*</label>
                  <input
                    className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-300 focus:bg-white"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Estado*</label>
                  <select
                    className="w-full appearance-none rounded-full border border-gray-200 bg-white px-4 py-2 text-sm focus:border-blue-300"
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CouponStatus }))}
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Puntos*</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-300 focus:bg-white"
                    value={form.value}
                    onChange={(e) => setForm((f) => ({ ...f, value: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Stock*</label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-300 focus:bg-white"
                    value={form.expirationDate?.slice(0, 16) || ""}
                    onChange={(e) => setForm((f) => ({ ...f, expirationDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-blue-600">Vista previa del cupón</h3>
                <div className="mt-3 h-28 w-full rounded-2xl bg-gray-100" />
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-700">
                  <div>{form.code}</div>
                  <div>·</div>
                  <div>{form.description}</div>
                  <div>·</div>
                  <div>Puntos: {form.value}</div>
                  <div>·</div>
                  <div>Expira: {new Date(form.expirationDate).toLocaleString()}</div>
                  <div>·</div>
                  <div>
                    Estado: {" "}
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${form.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                      {form.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex items-center justify-end gap-2">
                <button onClick={() => navigate('/admin/benefits')} className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button onClick={onSave} className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700">Guardar cambios</button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminBenefitEdit;
