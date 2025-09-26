import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Hook into your auth API
    console.log({ email, password, remember });
    // Simulate successful login
    const isAdmin = email === "admin@admin.com" && password === "admin123";
    const displayName = email.split("@")[0] ? email.split("@")[0].replace(/\b\w/g, c => c.toUpperCase()) : "Usuario";
    localStorage.setItem("userName", isAdmin ? "Admin" : displayName);
    localStorage.setItem("role", isAdmin ? "admin" : "user");
    if (remember) {
      localStorage.setItem("rememberMe", "true");
      localStorage.setItem("auth", "true");
    }
    navigate(isAdmin ? "/admin" : "/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="w-full">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between py-6">
            <div className="flex-1" />
            {/* Centered logo text */}
            <div className="flex-1 text-center">
              <span className="text-2xl font-semibold tracking-widest text-gray-800">LOGO</span>
            </div>
            {/* Right controls */}
            <div className="flex flex-1 items-center justify-end gap-3">
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-full bg-slate-900 px-4 text-white shadow hover:opacity-90"
                aria-label="Modo oscuro"
              >
                <span className="text-sm">🌙</span>
              </button>
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-slate-900 px-4 text-white shadow hover:opacity-90"
                  aria-haspopup="listbox"
                  aria-expanded="false"
                >
                  <span className="text-sm">🌐</span>
                  <span className="text-sm">Esp</span>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="opacity-80">
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.127l3.71-3.896a.75.75 0 111.08 1.04l-4.24 4.46a.75.75 0 01-1.08 0l-4.24-4.46a.75.75 0 01.02-1.06z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4">
        <div className="mx-auto flex max-w-6xl justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <div className="mb-6 text-center">
              <h1 className="text-lg font-semibold tracking-wide text-gray-900">INICIÁ SESIÓN</h1>
              <p className="mt-1 text-sm text-gray-500">
                Iniciá sesión escribiendo tu correo electrónico y contraseña.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@gmail.com"
                    className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                    required
                  />
                  {/* Right icon placeholder */}
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    ✉️
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <a href="#" className="text-xs text-gray-500 hover:text-slate-700">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 pr-10 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                    placeholder="••••••••••"
                    required
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    🔒
                  </div>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1">
                <label className="inline-flex cursor-pointer items-center gap-3">
                  <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                  </span>
                  <span className="text-sm text-gray-600">Recuérdame</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold tracking-wide text-white shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                INICIÁ SESIÓN
              </button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-gray-500">
              ¿No tienes una cuenta?{' '}
              <a href="#" className="font-semibold text-slate-900 hover:underline">
                REGISTRARME
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
