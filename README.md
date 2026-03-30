# Liga Pro SaaS (Vanilla JS Edition) ⚽

Plataforma SaaS moderna para la gestión de torneos de fútbol, construida siguiendo principios de modularidad, alto rendimiento y escalabilidad real.

## 🛠️ Tecnologías Aplicadas
- **Core:** HTML5, CSS3, JavaScript (Modulado con ES Modules).
- **Estilos:** Tailwind CSS (Diseño Premium Dark Mode).
- **Backend de Datos:** Supabase (Auth, DB, Realtime, RLS).
- **Bundler:** Vite (Servidor de desarrollo ultra rápido).

## 📁 Estructura del Código
El código está organizado por módulos funcionales dentro de `src/modules`:
- `Auth.js`: Manejo de sesiones con Supabase Auth.
- `Dashboard.js`: Layout principal y Resumen.
- `Tournaments.js`: CRUD de torneos con Soft Delete.
- `Teams.js`: Gestión de equipos y filtros por torneo.
- `Matches.js`: Registro de resultados en tiempo real.
- `Standings.js`: Cálculo dinámico de tabla de posiciones.

## ⚙️ Configuración inicial
1. Instala dependencias: `npm install`.
2. Configura tu `.env` con las claves de Supabase.
3. Ejecuta el script SQL en el panel de Supabase: `supabase_setup.sql`.
4. Inicia desarrollo: `npm run dev`.

**¡Disfruta gestionando tus torneos como un profesional!**
