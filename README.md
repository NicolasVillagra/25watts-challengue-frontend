# Coupons Frontend (React + Vite + TypeScript)

Aplicación frontend para gestionar y canjear cupones, con vistas de usuario y administración. Construida con - React Router DOM 7
 - Axios (cliente HTTP)
 - ESLint (TS + React Hooks + React Refresh)
 - Vitest + Testing Library (unit/integration)

## Requisitos

- Node.js 18.18+ o 20.x LTS
- npm 9+ (o pnpm/yarn si preferís, ajustando los comandos)
- Git

Verifica tu versión con:
  - Resumen del usuario (puntos canjeados, nivel y beneficios destacados).
  - Carga de datos vía `listCoupons({ status: 'active' })` y `GET /redemptions` utilizando `src/api/client.ts`.

- **Mis Cupones**: `src/pages/Coupons.tsx`
  - Pestañas: Disponibles, Cash, Usados.
  - Lista de cupones desde `listCoupons(...)` con filtros por estado.
  - Canje de cupón con `redeemCoupon({ code })` y refresco de lista.

- **Admin Dashboard**: `src/pages/AdminDashboard.tsx`
  - Guardia simple de rol (redirección a login si no es admin).
  - Accesos rápidos y opción de cerrar sesión.
  - CREDENCIALES DE ADMIN: admin@admin.com contraseña: admin123

- **Administración de Beneficios**: `src/pages/AdminBenefits.tsx`
  - Listado con búsqueda, filtros, orden, paginación.
  - Creación mediante modal (usa `createCoupon`).
  - Edición navega a `/admin/benefits/:id` pasando el beneficio seleccionado en `state`.
  - Eliminación con confirmación (`deleteCoupon`).

- **Edición de Beneficio**: `src/pages/AdminBenefitEdit.tsx`
  - Carga desde `state` o, en su defecto, `getCoupon(id)`.
  - Guardar cambios con `updateCoupon`, eliminar con `deleteCoupon`.
  - Redirecciones a `/admin/benefits` post-acción.
  
## Credenciales de ADMIN
-Email: admin@admin.com
-password:admin123
## Enrutamiento

- `/login` → `Login`
- `/dashboard` → `Dashboard`
- `/coupons` → `Coupons`
- `/admin` → `AdminDashboard` (requiere rol `admin`)
- `/admin/benefits` → `AdminBenefits` (requiere rol `admin`)
- `/admin/benefits/:id` → `AdminBenefitEdit` (requiere rol `admin`)



## Pruebas

- Framework: **Vitest** con entorno **jsdom**.
- Librerías: **@testing-library/react**, **@testing-library/user-event**, **@testing-library/jest-dom**.
- Config: `vitest.config.ts` y `src/setupTests.ts`.
```bash
node -v
npm -v
```
## Instalación y seteo del proyecto

1) Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
```
2) Instalar dependencias

```bash
npm install
```
3) Variables de entorno (opcional)

Crear `.env` o `.env.local` en la raíz si necesitás apuntar a otro backend:

```bash
VITE_API_URL=http://localhost:3000
```
4) Levantar en desarrollo

```bash
npm run dev
```
5) Build de producción y previsualización

```bash
npm run build
npm run preview
```
6) Lint y pruebas

```bash
npm run lint
npm run test
npm run test:watch
npm run test:coverage
