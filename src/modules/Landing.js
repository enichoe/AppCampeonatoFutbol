export const renderLanding = (container) => {
  container.innerHTML = `
    <div class="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      <!-- Navbar -->
      <nav class="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <span class="text-2xl font-black italic uppercase tracking-tighter">Fútbol App</span>
          </div>
          <div class="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
            <a href="#features" class="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#how-it-works" class="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#pricing" class="hover:text-white transition-colors">Precios</a>
          </div>
          <div class="flex items-center gap-4">
            <button onclick="navigate('auth')" class="hidden md:block text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Ingresar</button>
            <button onclick="navigate('auth')" class="btn-primary !py-3 !px-6 !text-[10px] uppercase tracking-widest font-black">Crear Campeonato Gratis</button>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative pt-40 pb-20 overflow-hidden">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
            <span class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Nuevo: Sistema de Grupos Automático</span>
          </div>
          <h1 class="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-8">
            CREA Y GESTIONA TU <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">CAMPEONATO</span> 
            EN MINUTOS
          </h1>
          <p class="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl font-medium leading-relaxed mb-12 uppercase tracking-tight">
            La plataforma definitiva para organizar ligas de fútbol. <br class="hidden md:block"/>
            Tablas automáticas, fixtures inteligentes y una web pública para tu torneo.
          </p>
          <div class="flex flex-col md:flex-row items-center justify-center gap-6">
            <button onclick="navigate('auth')" class="btn-primary !py-5 !px-12 !text-sm uppercase tracking-[0.2em] font-black shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-transform">
              EMPEZAR AHORA — ES GRATIS
            </button>
            <button onclick="navigate('torneos')" class="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase italic hover:bg-white/10 transition-all tracking-[0.2em]">
               Explorar Torneos ➔
            </button>
          </div>
        </div>

        <!-- Dashboard Preview -->
        <div class="max-w-6xl mx-auto px-6 mt-20 relative">
          <div class="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-500/20 group">
             <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
             <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=2000" alt="App Preview" class="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105 opacity-60">
             <div class="absolute bottom-10 left-10 right-10 z-20 flex flex-col items-center">
                <div class="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
                    <div class="text-center">
                        <p class="text-4xl font-black italic mb-1 uppercase tracking-tighter">+5,000</p>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Torneos Creados</p>
                    </div>
                    <div class="text-center">
                        <p class="text-4xl font-black italic mb-1 uppercase tracking-tighter">100%</p>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Automatizado</p>
                    </div>
                    <div class="text-center">
                        <p class="text-4xl font-black italic mb-1 uppercase tracking-tighter">HD</p>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Web Pública Premium</p>
                    </div>
                    <div class="text-center">
                        <p class="text-4xl font-black italic mb-1 uppercase tracking-tighter">FREE</p>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Primer Torneo</p>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-32 bg-slate-900/30">
        <div class="max-w-7xl mx-auto px-6">
          <div class="mb-20 text-center">
             <h2 class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4 italic">Características</h2>
             <h3 class="text-4xl md:text-6xl font-black italic uppercase tracking-tighter font-black italic uppercase tracking-tighter">TODO LO QUE NECESITAS <br/> PARA <span class="text-indigo-400">ORGANIZAR TU CAMPEONATO</span></h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-10 bg-slate-900 border border-white/5 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group">
              <div class="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-8 border border-white/5">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              </div>
              <h4 class="text-xl font-black italic uppercase tracking-tighter mb-4">Fixture Automático</h4>
              <p class="text-slate-400 text-sm font-medium leading-relaxed uppercase tracking-tight">Genera el calendario completo en segundos. Liga, eliminación o grupos. Tú eliges.</p>
            </div>
            <div class="p-10 bg-slate-900 border border-white/5 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group">
              <div class="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-8 border border-white/5">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h4 class="text-xl font-black italic uppercase tracking-tighter mb-4">Estadísticas PRO</h4>
              <p class="text-slate-400 text-sm font-medium leading-relaxed uppercase tracking-tight">Tabla de posiciones, goleadores, tarjetas y más, actualizado en tiempo real después de cada partido.</p>
            </div>
            <div class="p-10 bg-slate-900 border border-white/5 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group">
              <div class="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-8 border border-white/5">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
              </div>
              <h4 class="text-xl font-black italic uppercase tracking-tighter mb-4">Web Pública Mobile</h4>
              <p class="text-slate-400 text-sm font-medium leading-relaxed uppercase tracking-tight">Comparte un link único con jugadores y fans. Diseño ultra-responsivo optimizado para móviles.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How it works -->
      <section id="how-it-works" class="py-32">
        <div class="max-w-4xl mx-auto px-6 text-center">
          <h2 class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.4em] mb-4 italic">El Proceso</h2>
          <h3 class="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-20 font-black italic uppercase tracking-tighter">DIFUNDE TU PASIÓN EN <span class="text-indigo-400">3 PASOS</span></h3>
          
          <div class="relative">
            <div class="absolute top-0 bottom-0 left-[27px] w-px bg-indigo-500/20 hidden md:block"></div>
            
            <div class="flex gap-10 mb-16 relative">
              <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black italic z-10 shrink-0">1</div>
              <div class="text-left">
                <h4 class="text-2xl font-black italic uppercase tracking-tighter mb-2">Regístrate en Segundos</h4>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Solo necesitas tu email para empezar.</p>
              </div>
            </div>

            <div class="flex gap-10 mb-16 relative">
              <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black italic z-10 shrink-0">2</div>
              <div class="text-left">
                <h4 class="text-2xl font-black italic uppercase tracking-tighter mb-2">Configura tu Torneo</h4>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Ponle nombre, elige el formato y añade los equipos.</p>
              </div>
            </div>

            <div class="flex gap-10 relative">
              <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black italic z-10 shrink-0">3</div>
              <div class="text-left">
                <h4 class="text-2xl font-black italic uppercase tracking-tighter mb-2">¡Comparte y Disfruta!</h4>
                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">Obtén tu link público y deja que el sistema gestione el resto.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Final -->
      <section class="py-32 bg-indigo-600 relative overflow-hidden">
        <div class="absolute inset-0 bg-slate-950 opacity-20"></div>
        <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 class="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-10 font-black italic uppercase tracking-tighter">¿LISTO PARA COMENZAR TU <br/><span class="opacity-50">HISTORIA DEPORTIVA?</span></h3>
          <button onclick="navigate('auth')" class="bg-white text-indigo-600 !py-6 !px-16 !text-lg uppercase tracking-[0.3em] font-black rounded-3xl hover:scale-105 transition-transform shadow-2xl">
            CREAR MI TORNEO GRATIS
          </button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-10 border-t border-white/5 text-center">
        <p class="text-xs font-bold text-slate-500 uppercase tracking-[0.3em]">© ${new Date().getFullYear()} Fútbol App — Hecho para los amantes del fútbol.</p>
      </footer>
    </div>
  `
}
