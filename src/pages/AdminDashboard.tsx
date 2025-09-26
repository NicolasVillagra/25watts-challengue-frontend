import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AccessCard: React.FC<{ title: string; to: string }>=({ title, to })=> (
  <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">👤</div>
    <h3 className="mt-4 text-lg font-semibold text-blue-600">{title}</h3>
    <p className="mt-1 text-sm text-gray-600">Añadir y gestionar los {title.toLowerCase()} de los usuarios</p>
    <Link
      to={to}
      className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
    >
      IR A {title.toUpperCase()} <span>→</span>
    </Link>
  </div>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const userName = (typeof window !== "undefined" && localStorage.getItem("userName")) || "Admin";

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0B2450] text-white p-6 flex flex-col justify-between">
          <div>
            <div className="mb-8 text-2xl font-bold tracking-widest">25Watts</div>
            <nav className="space-y-3">
              <Link className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10" to="/admin">
                <span>🏠</span>
                <span>Inicio</span>
              </Link>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10" href="#">
                <span>👥</span>
              </a>
              <a className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10" href="#">
                <span>🛡️</span>
                <span>Roles</span>
              </a>
              <Link className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10 bg-white/10" to="/admin/benefits">
                <span>🎁</span>
                <span>Beneficios</span>
              </Link>
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
            <div className="text-xl font-semibold text-[#0B2450]">25Watts</div>
            <div className="flex items-center gap-3">
              <button className="rounded-full bg-white px-3 py-2 shadow">🔔</button>
              <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-300" />
            </div>
          </div>

          {/* Welcome card */}
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Te damos la bienvenida a Beneficios 25Watts</h1>
                <p className="mt-1 text-gray-600">Desde aquí podrás gestionar fácilmente los usuarios, configuraciones y más. Hola {userName}.</p>
              </div>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">ÚLTIMA VERSIÓN: 0.1.0</span>
            </div>

            <h2 className="mt-8 text-lg font-semibold text-blue-600">Accesos</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AccessCard title="Roles" to="#" />
              <AccessCard title="Usuarios" to="#" />
              <AccessCard title="Roles" to="#" />
              <AccessCard title="Usuarios" to="#" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
