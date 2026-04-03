export const renderLanding = (container) => {
  container.innerHTML = `
    <div class="landing-page min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-neon/30 overflow-x-hidden selection:text-white">
      
      <!-- Premium Navbar -->
      <nav id="navbar" class="fixed top-0 w-full z-[100] transition-all duration-700 border-b border-transparent">
        <div class="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          <div class="flex items-center gap-3 cursor-pointer group" onclick="window.scrollTo({top:0, behavior:'smooth'})">
            <div class="w-10 h-10 md:w-12 md:h-12 bg-neon rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.5)] group-hover:rotate-[15deg] transition-all duration-500">
              <svg class="w-6 h-6 md:w-7 md:h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <span class="text-xl md:text-3xl font-[1000] italic tracking-tighter text-white uppercase flex flex-col leading-none">
              <span class="text-neon drop-shadow-[0_0_10px_rgba(0,255,136,0.3)]">FÚTBOL</span>
              <span class="text-[0.6em] tracking-[0.3em] text-slate-500">PLATFORM</span>
            </span>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center gap-12">
            <div class="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
              <a href="#beneficios" class="hover:text-neon transition-all hover:tracking-[0.3em]">Beneficios</a>
              <a href="#como-funciona" class="hover:text-neon transition-all hover:tracking-[0.3em]">Proceso</a>
              <a href="#precios" class="hover:text-neon transition-all hover:tracking-[0.3em]">Precios</a>
            </div>
            <div class="h-8 w-px bg-white/10 mx-2"></div>
            <div class="flex items-center gap-6">
              <button onclick="window.navigate('auth')" class="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Ingresar</button>
              <button onclick="window.navigate('auth')" class="relative group">
                <div class="absolute -inset-1 bg-gradient-to-r from-neon to-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div class="relative px-8 py-3 bg-slate-950 rounded-xl border border-white/10 flex items-center justify-center">
                  <span class="text-[11px] font-black uppercase tracking-widest text-white">Crear Mi Liga Gratis</span>
                </div>
              </button>
            </div>
          </div>

          <button id="menu-toggle" class="lg:hidden p-3 bg-white/5 rounded-xl border border-white/10 text-neon">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>

        <!-- Mobile Nav Menu -->
        <div id="mobile-menu" class="hidden fixed inset-0 z-[120] bg-[#010409] flex flex-col p-8 transition-all duration-500 opacity-0 -translate-y-10">
            <div class="flex justify-between items-center mb-16">
               <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-neon rounded-lg flex items-center justify-center"><svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                  <span class="font-[1000] italic text-2xl uppercase tracking-tighter text-white">FÚTBOL APP</span>
               </div>
               <button id="menu-close" class="p-4 bg-slate-900/50 rounded-2xl border border-white/10 text-neon"><svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <nav class="flex flex-col gap-6">
                <a href="#beneficios" class="mobile-link text-3xl font-[1000] italic uppercase tracking-tighter text-white hover:text-neon transition-all">Beneficios</a>
                <a href="#como-funciona" class="mobile-link text-3xl font-[1000] italic uppercase tracking-tighter text-white hover:text-neon transition-all">Proceso</a>
                <a href="#precios" class="mobile-link text-3xl font-[1000] italic uppercase tracking-tighter text-white hover:text-neon transition-all">Precios</a>
                <div class="h-px bg-white/10 my-4"></div>
                <button onclick="window.navigate('auth')" class="text-left text-xl font-black italic uppercase tracking-widest text-slate-400">Ingresar</button>
                <button onclick="window.navigate('auth')" class="mt-4 bg-neon text-black py-5 rounded-2xl font-[1000] italic uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(0,255,136,0.4)] text-sm">
                  CREAR MI LIGA GRATIS
                </button>
            </nav>
        </div>
      </nav>

      <!-- HERO SECTION -->
      <section class="relative pt-32 pb-20 lg:pt-64 lg:pb-64 overflow-hidden border-b border-white/5">
        <div class="absolute top-0 left-1/4 w-[800px] h-[800px] bg-neon/10 blur-[150px] rounded-full animate-pulse-slow"></div>
        <div class="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-500/10 blur-[150px] rounded-full animate-float"></div>
        
        <div class="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <div class="fade-in-up inline-flex items-center gap-2 px-4 py-1.5 bg-neon/10 border border-neon/20 rounded-full mb-8 backdrop-blur-2xl">
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-neon"></span>
            </span>
            <span class="text-[9px] md:text-xs font-black text-neon uppercase tracking-[0.3em]">+500 torneos activos en todo el Perú</span>
          </div>

          <h1 class="fade-in-up text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-[1000] italic tracking-[-0.04em] text-white uppercase leading-[1.1] mb-8 text-center px-1">
            TU TORNEO<br/>
            <span class="inline-block py-2 px-4 text-transparent bg-clip-text bg-gradient-to-r from-neon via-indigo-400 to-violet-500 drop-shadow-[0_0_20px_rgba(0,255,136,0.2)]">EN TUS MANOS</span>
          </h1>
          
          <p class="fade-in-up max-w-[280px] sm:max-w-xl lg:max-w-2xl mx-auto text-slate-400 text-sm sm:text-lg lg:text-xl font-medium leading-relaxed mb-10 text-center">
            Crea tu liga, registra equipos, genera el fixture y comparte la tabla por WhatsApp. <span class="text-white border-b-2 border-neon/50">Todo desde tu celular, al toque.</span>
          </p>

          <div class="fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16 group">
            <button onclick="window.navigate('auth')" class="relative w-full sm:w-auto h-16 md:h-20 px-8 bg-neon rounded-2xl md:rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,255,136,0.3)] flex items-center justify-center overflow-hidden">
                <span class="relative z-10 text-black text-base md:text-lg font-[1000] italic uppercase tracking-widest leading-none">Crear Mi Torneo Gratis</span>
                <div class="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 italic uppercase"></div>
            </button>
            <button onclick="window.navigate('torneos')" class="w-full sm:w-auto px-12 h-20 md:h-24 bg-slate-900/50 border border-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl text-slate-300 text-xl font-black italic uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all overflow-hidden group/btn">
                <span>Ver Demo en Vivo</span>
            </button>
          </div>

          <!-- Hero Main Mockup -->
          <div class="slide-up relative w-full max-w-6xl mx-auto mt-20">
              <div class="absolute -inset-10 bg-neon/10 blur-[100px] rounded-full opacity-30"></div>
              <div class="relative p-1 md:p-2 bg-gradient-to-b from-white/10 to-transparent rounded-[2rem] md:rounded-[4rem] backdrop-blur-3xl border border-white/20 shadow-3xl overflow-hidden">
                  <div class="bg-slate-950 rounded-[1.5rem] md:rounded-[3.5rem] overflow-hidden">
                    <img src="/dashboard.png" class="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-1000" alt="Panel de control Fútbol App">
                  </div>
              </div>
          </div>
        </div>
      </section>

      <!-- SOCIAL PROOF -->
      <section class="py-12 lg:py-20 bg-slate-950 relative overflow-hidden border-b border-white/5">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="text-center group">
                <div class="text-3xl lg:text-6xl font-[1000] italic text-neon transition-all group-hover:scale-110 tracking-tighter leading-none mb-2">+500</div>
                <div class="text-[9px] uppercase font-black tracking-[0.3em] text-slate-500">TORNEOS CREADOS</div>
            </div>
            <div class="text-center group">
                <div class="text-3xl lg:text-6xl font-[1000] italic text-white transition-all group-hover:scale-110 tracking-tighter leading-none mb-2">10K+</div>
                <div class="text-[9px] uppercase font-black tracking-[0.3em] text-slate-500">JUGADORES</div>
            </div>
            <div class="text-center group">
                <div class="text-3xl lg:text-6xl font-[1000] italic text-indigo-500 transition-all group-hover:scale-110 tracking-tighter leading-none mb-2">Lima+</div>
                <div class="text-[9px] uppercase font-black tracking-[0.3em] text-slate-500">Y PROVINCIAS</div>
            </div>
            <div class="text-center group">
                <div class="text-3xl lg:text-6xl font-[1000] italic text-white transition-all group-hover:scale-110 tracking-tighter leading-none mb-2">S/. 0</div>
                <div class="text-[9px] uppercase font-black tracking-[0.3em] text-slate-500">PARA EMPEZAR</div>
            </div>
        </div>
      </section>

      <!-- CORE FEATURES -->
      <section id="beneficios" class="py-32 lg:py-64 bg-[#020617] relative">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
                <div class="lg:w-1/2">
                    <h2 class="text-[9px] font-black uppercase tracking-[0.4em] text-neon mb-4 italic text-center lg:text-left">Todo lo que necesitas</h2>
                    <h3 class="text-2xl lg:text-6xl font-[1000] italic uppercase tracking-tight text-white leading-tight mb-8 text-center lg:text-left whitespace-nowrap lg:whitespace-normal">ORGANIZA <br class="hidden lg:block"/> COMO UN <span class="inline-block py-1 px-4 text-transparent bg-clip-text bg-gradient-to-r from-neon to-indigo-500">PRO</span></h3>
                    
                    <div class="space-y-4 lg:space-y-6">
                        <div class="group flex flex-col sm:flex-row gap-6 lg:gap-8 p-6 lg:p-10 rounded-3xl lg:rounded-[3rem] bg-white/[0.03] border border-white/5 hover:border-neon/30 hover:bg-neon/[0.02] transition-all duration-500 relative overflow-hidden">
                            <div class="w-12 h-12 lg:w-20 lg:h-20 bg-neon/10 rounded-xl lg:rounded-2xl flex items-center justify-center text-neon border border-neon/20 shrink-0 group-hover:bg-neon group-hover:text-black transition-all">
                                <svg class="w-6 h-6 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div class="text-center sm:text-left">
                                <h4 class="text-xl lg:text-2xl font-[1000] italic uppercase tracking-tighter text-white mb-2 leading-tight">Fixture y tabla al instante</h4>
                                <p class="text-slate-500 text-sm lg:text-lg lg:leading-relaxed">Agrega los equipos y el sistema genera solo el fixture completo. Tú solo registras los resultados desde la cancha.</p>
                            </div>
                            <div class="absolute inset-0 border border-neon/0 group-hover:border-neon/20 rounded-3xl lg:rounded-[3rem] transition-all"></div>
                        </div>

                        <div class="group flex flex-col sm:flex-row gap-6 lg:gap-8 p-6 lg:p-10 rounded-3xl lg:rounded-[3rem] bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition-all duration-500 relative overflow-hidden">
                            <div class="w-12 h-12 lg:w-20 lg:h-20 bg-indigo-500/10 rounded-xl lg:rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                <svg class="w-6 h-6 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            </div>
                            <div class="text-center sm:text-left">
                                <h4 class="text-xl lg:text-2xl font-[1000] italic uppercase tracking-tighter text-white mb-2 leading-tight">Estadísticas que impresionan</h4>
                                <p class="text-slate-500 text-sm lg:text-lg lg:leading-relaxed">Tabla de posiciones, goleadores y tarjetas actualizadas en tiempo real. Los jugadores lo siguen desde su celular sin descargar nada.</p>
                            </div>
                            <div class="absolute inset-0 border border-indigo-500/0 group-hover:border-indigo-500/20 rounded-3xl lg:rounded-[3rem] transition-all"></div>
                        </div>
                        <div class="group flex flex-col sm:flex-row gap-6 lg:gap-8 p-6 lg:p-10 rounded-3xl lg:rounded-[3rem] bg-white/[0.03] border border-white/5 hover:border-cyan-400/30 hover:bg-cyan-400/[0.02] transition-all duration-500 relative overflow-hidden">
    
    <div class="w-12 h-12 lg:w-20 lg:h-20 bg-cyan-400/10 rounded-xl lg:rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-400/20 shrink-0 group-hover:bg-cyan-400 group-hover:text-black transition-all">
        <svg class="w-6 h-6 lg:w-10 lg:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A7 7 0 1118.88 6.196 7 7 0 015.12 17.804zM15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
    </div>

    <div class="text-center sm:text-left">
        <h4 class="text-xl lg:text-2xl font-[1000] italic tracking-tighter text-white mb-2 leading-tight">
            Ficha completa de jugadores
        </h4>
        <p class="text-slate-500 text-sm lg:text-lg lg:leading-relaxed">
            Registra edad, posición, número de camiseta y más. Cada jugador tiene su perfil dentro del torneo.
        </p>
    </div>

    <div class="absolute inset-0 border border-cyan-400/0 group-hover:border-cyan-400/20 rounded-3xl lg:rounded-[3rem] transition-all"></div>
</div>
                    </div>
                </div>
                <div class="lg:w-1/2 relative group">
                    <div class="absolute -inset-10 bg-neon/20 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-duration-1000"></div>
                    <div class="relative glass rounded-[2.5rem] lg:rounded-[4rem] p-4 lg:p-6 overflow-hidden shadow-3xl transform rotate-0 lg:rotate-2 transition-all duration-700 aspect-square lg:aspect-[4/5] bg-slate-900/40">
                        <img src="/futbol.png" class="w-full h-full object-contain rounded-[2rem] lg:rounded-[3.5rem] opacity-100" alt="Jugador con Fútbol App">
                    </div>
                    <div class="absolute -bottom-4 -left-4 lg:-bottom-10 lg:-left-10 p-4 lg:p-8 glass-dark rounded-2xl lg:rounded-[2.5rem] border border-neon/30 animate-float">
                        <div class="text-neon text-2xl lg:text-4xl font-[1000] italic mb-0.5 uppercase leading-none">Listo en 5 minutos</div>
                        <div class="text-slate-400 font-black uppercase text-[7px] lg:text-[10px] tracking-[0.2em] lg:tracking-[0.3em]">SIN COMPLICACIONES</div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <!-- THE PROCESS -->
      <section id="como-funciona" class="py-20 lg:py-40 bg-slate-950 border-y border-white/5 overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <div class="mb-16 lg:mb-24">
                <h3 class="text-4xl lg:text-7xl font-[1000] italic uppercase tracking-tight text-white leading-none">ASÍ DE <span class="text-neon">FÁCIL</span></h3>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-20">
                <div class="relative group">
                    <div class="text-[12rem] font-[1000] text-white/[0.03] absolute -top-24 -left-10 leading-none group-hover:text-neon/[0.05] transition-all">01</div>
                    <div class="relative z-10 p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-neon/50 transition-all duration-500">
                        <h4 class="text-3xl font-[1000] italic uppercase tracking-tighter text-white mb-6">Regístrate gratis</h4>
                        <p class="text-slate-500 text-xl font-medium mb-8">Crea tu cuenta en menos de 2 minutos. Sin tarjeta, sin trámites. Solo tu correo y listo.</p>
                        <div class="w-12 h-px bg-neon"></div>
                    </div>
                </div>
                <div class="relative group mt-10 md:mt-0">
                    <div class="text-[12rem] font-[1000] text-white/[0.03] absolute -top-24 -left-10 leading-none group-hover:text-indigo-500/[0.05] transition-all">02</div>
                    <div class="relative z-10 p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-indigo-500/50 transition-all duration-500 bg-white/[0.04] scale-105">
                        <h4 class="text-3xl font-[1000] italic uppercase tracking-tighter text-white mb-6">Arma tu liga</h4>
                        <p class="text-slate-500 text-xl font-medium mb-8">Agrega tus equipos, sube los escudos y el fixture se genera automático. Así de sencillo, causa.</p>
                        <div class="w-12 h-px bg-indigo-500"></div>
                    </div>
                </div>
                <div class="relative group mt-10 md:mt-0">
                    <div class="text-[12rem] font-[1000] text-white/[0.03] absolute -top-24 -left-10 leading-none group-hover:text-violet-500/[0.05] transition-all">03</div>
                    <div class="relative z-10 p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:border-violet-500/50 transition-all duration-500">
                        <h4 class="text-3xl font-[1000] italic uppercase tracking-tighter text-white mb-6">Comparte por WhatsApp</h4>
                        <p class="text-slate-500 text-xl font-medium mb-8">Manda el link del torneo al grupo. Todos siguen la tabla y los resultados en tiempo real desde su celu.</p>
                        <div class="w-12 h-px bg-violet-500"></div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <!-- PRICING -->
      <section id="precios" class="py-24 lg:py-48 bg-[#020617] relative">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col lg:flex-row justify-between items-end mb-16 lg:mb-32 gap-8">
                <h3 class="text-4xl lg:text-8xl font-[1000] italic uppercase tracking-tighter text-white leading-none">ELIGE TU <br/> <span class="text-neon">PLAN</span></h3>
                <div class="px-6 py-3 border border-white/10 rounded-full backdrop-blur-xl">
                    <span class="text-slate-400 font-black uppercase text-[12px] tracking-[0.3em]">Precios en Soles · IGV incluido</span>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                <!-- Plan Free -->
                <div class="group p-8 lg:p-12 bg-white/[0.02] border border-white/5 rounded-[2.5rem] lg:rounded-[3.5rem] hover:bg-white/[0.04] transition-all duration-500">
                    <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-4 italic leading-none">PLAN GRATUITO</h4>
                    <div class="text-4xl lg:text-7xl font-[1000] italic text-white mb-8 tracking-tight">S/. 0</div>
                    <ul class="space-y-4 mb-10 text-left">
                        <li class="flex items-center gap-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest"><div class="w-1.5 h-1.5 bg-slate-600 rounded-full"></div> 1 torneo activo</li>
                        <li class="flex items-center gap-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest"><div class="w-1.5 h-1.5 bg-slate-600 rounded-full"></div> Hasta 8 equipos</li>
                        <li class="flex items-center gap-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest"><div class="w-1.5 h-1.5 bg-slate-600 rounded-full"></div> Fixture automático</li>
                        <li class="flex items-center gap-3 text-slate-400 font-bold uppercase text-[10px] tracking-widest"><div class="w-1.5 h-1.5 bg-slate-600 rounded-full"></div> Vista pública del torneo</li>
                    </ul>
                    <button onclick="window.navigate('auth')" class="w-full py-5 bg-slate-900 text-white rounded-xl font-black italic uppercase tracking-widest border border-white/5 hover:bg-white hover:text-black transition-all text-xs">Empezar Gratis</button>
                </div>

                <!-- Plan Premium -->
                <div class="relative group mt-12 lg:mt-0">
                    <div class="absolute -inset-1 bg-gradient-to-r from-neon via-indigo-500 to-violet-500 rounded-[2.6rem] lg:rounded-[3.6rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div class="relative p-8 lg:p-12 bg-slate-900 border-2 border-neon/50 rounded-[2.5rem] lg:rounded-[3.5rem] shadow-2xl">
                        <div class="absolute -top-5 left-1/2 -translate-x-1/2 bg-neon text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] italic">EL MÁS ELEGIDO</div>
                        <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-neon mb-4 italic leading-none">PLAN PRO</h4>
                        <div class="flex items-end gap-2 mb-1">
                             <div class="text-4xl lg:text-7xl font-[1000] italic text-white tracking-tight leading-none">S/. 29</div>
                             <div class="text-base font-black text-slate-500 uppercase italic pb-1">/mes</div>
                        </div>
                        <p class="text-neon/70 font-black uppercase text-[8px] tracking-widest mb-8 italic">Menos que una entrada al estadio</p>
                        <ul class="space-y-4 mb-10 text-left">
                            <li class="flex items-center gap-3 text-white font-bold uppercase text-[10px] tracking-widest"><div class="w-1.5 h-1.5 bg-neon rounded-full shadow-[0_0_10px_#00FF88]"></div> Torneos ilimitados</li>
                            <li class="flex items-center gap-3 text-white font-bold uppercase text-[10px] tracking-widest"><div class="w-1.5 h-1.5 bg-neon rounded-full shadow-[0_0_10px_#00FF88]"></div> Equipos ilimitados</li>
                            <li class="flex items-center gap-3 text-white font-bold uppercase text-[10px] tracking-widest"><div class="w-1.5 h-1.5 bg-neon rounded-full shadow-[0_0_10px_#00FF88]"></div> Goleadores y estadísticas</li>
                            <li class="flex items-center gap-3 text-white font-bold uppercase text-[10px] tracking-widest"><div class="w-1.5 h-1.5 bg-neon rounded-full shadow-[0_0_10px_#00FF88]"></div> Sin publicidad</li>
                            <li class="flex items-center gap-3 text-white font-bold uppercase text-[10px] tracking-widest"><div class="w-1.5 h-1.5 bg-neon rounded-full shadow-[0_0_10px_#00FF88]"></div> Soporte por WhatsApp</li>
                        </ul>
                        <button onclick="window.navigate('auth')" class="w-full py-5 bg-neon text-black rounded-xl font-black italic uppercase tracking-widest shadow-[0_15px_40px_rgba(0,255,136,0.2)] hover:scale-105 transition-all text-xs">Probar 14 días gratis</button>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <!-- FINAL CTA -->
      <section class="py-24 lg:py-48 relative bg-[#020617] overflow-hidden text-center">
          <div class="absolute inset-0 bg-gradient-to-b from-transparent via-neon/5 to-transparent"></div>
          <div class="max-w-6xl mx-auto px-6 relative z-10">
              <h3 class="text-4xl sm:text-6xl lg:text-9xl font-[1000] italic uppercase tracking-[-0.05em] text-white leading-tight mb-12">
                TU LIGA <br/> <span class="inline-block py-2 px-4 text-transparent bg-clip-text bg-gradient-to-r from-neon to-violet-500">TE ESPERA</span>
              </h3>
              <div class="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-8">
                <button onclick="window.navigate('auth')" class="group relative bg-neon text-black px-10 py-5 text-lg lg:text-2xl font-[1000] italic uppercase tracking-[0.1em] rounded-2xl shadow-[0_20px_60px_rgba(0,255,136,0.2)] hover:scale-105 transition-all w-full sm:w-auto">
                    CREAR MI TORNEO GRATIS
                </button>
                <a href="https://wa.me/51972498691" target="_blank" class="px-10 py-5 bg-slate-900 border border-white/10 rounded-2xl text-white text-base lg:text-xl font-black italic uppercase tracking-widest hover:border-neon transition-all flex items-center gap-4 group w-full sm:w-auto justify-center">
                    <svg class="w-6 h-6 text-neon group-hover:scale-110 transition-all opacity-80" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.316 1.592 5.43 0 9.856-4.426 9.858-9.855 0-2.63-1.024-5.103-2.884-6.964-1.86-1.86-4.334-2.884-6.964-2.884-5.43 0-9.858 4.426-9.858 9.855 0-2.113.582 3.535 1.577 5.141l-.957 3.498 3.587-.941z"/></svg>
                    Hablar por WhatsApp
                </a>
              </div>
          </div>
      </section>

      <!-- FOOTER -->
      <footer class="bg-slate-950/50 py-16 lg:py-32 border-t border-white/5 relative">
          <div class="max-w-7xl mx-auto px-6">
              <div class="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-20">
                  <div class="max-w-md">
                      <div class="flex items-center gap-3 mb-6">
                          <div class="w-10 h-10 bg-neon rounded-xl flex items-center justify-center shadow-[0_0_20px_#00FF88]"><svg class="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                          <span class="font-[1000] italic text-2xl lg:text-3xl uppercase tracking-tighter text-white leading-none">FÚTBOL <span class="text-neon">APP</span></span>
                      </div>
                      <p class="text-slate-500 text-base lg:text-xl font-medium leading-relaxed italic">
                        La plataforma hecha en Perú para organizar campeonatos de fútbol amateur como los grandes. Simple, rápida y sin complicaciones.
                      </p>
                  </div>
                  <div class="grid grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 w-full lg:w-auto">
                      <div class="space-y-4">
                          <h5 class="text-white font-[1000] italic uppercase text-[10px] tracking-[0.4em]">PRODUCTO</h5>
                          <div class="flex flex-col gap-3 text-slate-500 font-bold uppercase text-[9px] tracking-widest">
                              <a href="#beneficios" class="hover:text-neon transition-all">Beneficios</a>
                              <a href="#precios" class="hover:text-neon transition-all">Precios</a>
                              <a href="#" class="hover:text-neon transition-all">Ver Demo</a>
                          </div>
                      </div>
                      <div class="space-y-4">
                          <h5 class="text-white font-[1000] italic uppercase text-[10px] tracking-[0.4em]">SOPORTE</h5>
                          <div class="flex flex-col gap-3 text-slate-500 font-bold uppercase text-[9px] tracking-widest italic">
                              <a href="https://wa.me/51972498691" class="hover:text-neon transition-all">Centro de ayuda</a>
                              <a href="https://wa.me/51972498691" class="hover:text-neon transition-all">WhatsApp directo</a>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="pt-12 mt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-700 font-black uppercase text-[8px] tracking-[0.4em]">
                  <div>© 2026 FÚTBOL APP · Todos los derechos reservados</div>
                  <div class="flex gap-4">HECHO EN PERÚ 🇵🇪</div>
              </div>
          </div>
      </footer>

    </div>
  `

  // Interactive Logic — Navegación suave y control del menú
  const navbar = container.querySelector('#navbar')
  const mobileMenu = container.querySelector('#mobile-menu')
  const menuBtn = container.querySelector('#menu-toggle')
  const menuClose = container.querySelector('#menu-close')

  // Smooth Scroll para todos los links con href="#"
  const allLinks = container.querySelectorAll('a[href^="#"]')
  allLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const targetId = link.getAttribute('href')
      if (targetId === '#') return
      
      const targetElement = container.querySelector(targetId)
      if (targetElement) {
        // Cerrar menú móvil si está abierto
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          closeMobileMenu()
        }

        // Scroll suave
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset por el navbar fixed
          behavior: 'smooth'
        })
      }
    })
  })

  // Funciones del Menú Móvil
  const openMobileMenu = () => {
    mobileMenu.classList.remove('hidden')
    setTimeout(() => {
      mobileMenu.classList.remove('opacity-0', '-translate-y-10')
    }, 10)
  }

  const closeMobileMenu = () => {
    mobileMenu.classList.add('opacity-0', '-translate-y-10')
    setTimeout(() => {
      mobileMenu.classList.add('hidden')
    }, 500)
  }

  if (menuBtn) menuBtn.onclick = openMobileMenu
  if (menuClose) menuClose.onclick = closeMobileMenu

  // Efecto Scroll en Navbar
  window.onscroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('bg-[#020617]/90', 'backdrop-blur-xl', 'py-4', 'border-white/5')
      navbar.classList.remove('py-8', 'border-transparent')
    } else {
      navbar.classList.remove('bg-[#020617]/90', 'backdrop-blur-xl', 'py-4', 'border-white/5')
      navbar.classList.add('py-8', 'border-transparent')
    }
  }
}
