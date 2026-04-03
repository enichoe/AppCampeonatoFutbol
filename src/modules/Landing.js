export const renderLanding = (container) => {
  container.innerHTML = `
    <div class="landing-page min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      <!-- Navbar -->
      <nav id="navbar" class="fixed top-0 w-full z-[100] transition-all duration-300 border-b border-transparent bg-slate-950/80 backdrop-blur-xl">
        <div class="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center gap-2 cursor-pointer" onclick="window.scrollTo({top:0, behavior:'smooth'})">
            <div class="w-8 h-8 md:w-9 md:h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <span class="text-xl font-black italic tracking-tighter text-slate-50 uppercase">Fútbol App</span>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#beneficios" class="hover:text-indigo-400 transition-colors">Beneficios</a>
            <a href="#como-funciona" class="hover:text-indigo-400 transition-colors">Cómo funciona</a>
            <a href="#precios" class="hover:text-indigo-400 transition-colors">Precios</a>
            <button onclick="window.navigate('auth')" class="hover:text-indigo-400 transition-colors text-white font-black">Iniciar Sesión</button>
            <button onclick="window.navigate('auth')" class="bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all outline-none font-black uppercase">
              Crear torneo gratis
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button id="menu-toggle" class="md:hidden p-2 text-slate-400 active:bg-slate-800 rounded-lg transition-colors" aria-label="Abrir menú">
            <svg id="menu-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden fixed inset-0 z-[120] bg-slate-950 md:hidden flex flex-col p-8 transform translate-y-[-100%] transition-transform duration-500 ease-in-out border-b border-white/10">
            <div class="flex justify-between items-center mb-16">
               <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <span class="font-black italic text-lg uppercase tracking-tighter text-slate-100">Fútbol App</span>
               </div>
               <button id="menu-close" class="p-3 text-slate-400 bg-slate-900 rounded-full border border-white/5">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
               </button>
            </div>
            <nav class="flex flex-col gap-6">
                <a href="#beneficios" class="mobile-link p-6 bg-slate-900/50 border border-white/5 rounded-2xl text-xl font-black italic uppercase tracking-tighter text-slate-100">Beneficios</a>
                <a href="#como-funciona" class="mobile-link p-6 bg-slate-900/50 border border-white/5 rounded-2xl text-xl font-black italic uppercase tracking-tighter text-slate-100">Cómo funciona</a>
                <a href="#precios" class="mobile-link p-6 bg-slate-900/50 border border-white/5 rounded-2xl text-xl font-black italic uppercase tracking-tighter text-slate-100">Precios</a>
                <button onclick="window.navigate('auth')" class="p-6 bg-slate-900/50 border border-white/5 rounded-2xl text-xl font-black italic uppercase tracking-tighter text-slate-100 text-left">Iniciar Sesión</button>
                <button onclick="window.navigate('auth')" class="mt-8 bg-indigo-600 text-white py-6 rounded-2xl font-black italic uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 active:scale-95">
                  Crear torneo gratis
                </button>
            </nav>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative pt-32 pb-20 md:pt-52 md:pb-40 overflow-hidden text-center">
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(#fff 1px, transparent 0); background-size: 40px 40px;"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        
        <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
            <span class="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">⚽ +500 torneos en todo el Perú</span>
          </div>

          <h1 class="text-4xl sm:text-5xl md:text-8xl font-black italic tracking-tighter text-slate-50 uppercase leading-[0.9] mb-8">
            Deja el excel y <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">organiza tu torneo</span> <br/>
            como un profesional
          </h1>
          
          <p class="max-w-2xl mx-auto text-slate-400 text-base md:text-xl font-medium leading-relaxed mb-12 uppercase tracking-tight">
             Fútbol App automatiza tu fixture, calcula tablas de posiciones y permite que los jugadores sigan los resultados por WhatsApp en tiempo real.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 mb-20">
            <button onclick="window.navigate('auth')" class="w-full sm:w-auto bg-indigo-600 text-white min-h-[60px] px-10 py-4 rounded-2xl font-black italic uppercase tracking-widest shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all">
              Crear mi torneo gratis
            </button>
            <button onclick="window.navigate('torneos')" class="w-full sm:w-auto px-10 min-h-[60px] bg-slate-900 border border-white/10 rounded-2xl text-slate-300 font-black italic uppercase tracking-widest hover:bg-slate-800 active:scale-95 transition-all">
               Ver demo en vivo ➔
            </button>
          </div>

          <!-- Hero Image (Img 1) -->
          <div class="relative w-full max-w-5xl mx-auto group">
              <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-400 blur opacity-20 transition-opacity"></div>
              <div class="relative aspect-video bg-slate-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                  <img src="/img1.png" class="w-full h-full object-cover" alt="Vista del sistema">
              </div>
          </div>
        </div>
      </section>

      <!-- Benefits & Stat Image (Img 2) -->
      <section id="beneficios" class="py-20 md:py-32 bg-slate-950">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div>
                    <h2 class="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-50 leading-none mb-8">TODO EL CONTROL <br/> EN <span class="text-indigo-500">TU CELULAR</span></h2>
                    <ul class="space-y-6">
                        <li class="flex gap-4">
                            <div class="w-10 h-10 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-500/20">✓</div>
                            <div class="pt-1">
                                <h4 class="font-black italic uppercase text-slate-100 text-sm tracking-wide">Fixture Automático Pro</h4>
                                <p class="text-slate-500 text-xs font-bold uppercase tracking-tight mt-1 leading-relaxed">Sube tus equipos y el sistema genera todas las fechas en segundos.</p>
                            </div>
                        </li>
                        <li class="flex gap-4">
                            <div class="w-10 h-10 bg-cyan-400/10 rounded-xl flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-400/20">✓</div>
                            <div class="pt-1">
                                <h4 class="font-black italic uppercase text-slate-100 text-sm tracking-wide">Update en Tiempo Real</h4>
                                <p class="text-slate-500 text-xs font-bold uppercase tracking-tight mt-1 leading-relaxed">Tocas un botón al terminar el partido y los delegados ven el resultado al instante.</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="relative slide-up">
                    <div class="aspect-[4/3] bg-gradient-to-tr from-indigo-600 to-indigo-900 rounded-[3rem] p-1 shadow-2xl relative overflow-hidden">
                        <img src="/img2.png" class="w-full h-full object-cover opacity-80" alt="Dashboard stats">
                    </div>
                </div>
            </div>
        </div>
      </section>

      <!-- Rest of sections remain same... -->
      ${renderRestOfSections()}

    </div>
  `

  // Logic
  const navbar = container.querySelector('#navbar')
  window.onscroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('bg-slate-950/95', 'border-white/5', 'shadow-2xl')
      navbar.classList.remove('bg-slate-950/80')
    } else {
      navbar.classList.remove('bg-slate-950/95', 'border-white/5', 'shadow-2xl')
      navbar.classList.add('bg-slate-950/80')
    }
  }

  // Mobile Menu
  const toggleBtn = container.querySelector('#menu-toggle')
  const closeBtn = container.querySelector('#menu-close')
  const mobileMenu = container.querySelector('#mobile-menu')
  const mobileLinks = container.querySelectorAll('.mobile-link')

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden')
    setTimeout(() => mobileMenu.classList.remove('translate-y-[-100%]'), 10)
  })
  
  const closeMenu = () => {
    mobileMenu.classList.add('translate-y-[-100%]')
    setTimeout(() => mobileMenu.classList.add('hidden'), 300)
  }
  closeBtn.addEventListener('click', closeMenu)
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu))
}

function renderRestOfSections() {
    return `
      <!-- Cómo Funciona -->
      <section id="como-funciona" class="py-20 bg-slate-900/40 border-y border-white/5">
                <div class="max-w-4xl mx-auto px-6">
                    <div class="text-center mb-16">
                        <h2 class="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 italic mb-4 text-center">Empieza hoy</h2>
                        <h3 class="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-100 text-center">EN SOLO <span class="opacity-40">3 PASOS</span></h3>
                    </div>
                    <div class="space-y-12 relative max-w-lg mx-auto">
                        <div class="absolute top-0 bottom-0 left-[27px] w-px bg-indigo-500/10 hidden md:block"></div>
                        <div class="flex gap-8 relative items-start group">
                            <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black italic shrink-0 shadow-xl shadow-indigo-600/20">1</div>
                            <div>
                                <h4 class="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-slate-100 mb-2">Crea tu cuenta</h4>
                                <p class="text-slate-500 font-bold uppercase tracking-widest text-xs">Gratis en 30 segundos.</p>
                            </div>
                        </div>
                        <div class="flex gap-8 relative items-start group">
                            <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black italic shrink-0 shadow-xl shadow-indigo-600/20">2</div>
                            <div>
                                <h4 class="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-slate-100 mb-2">Sube tus equipos</h4>
                                <p class="text-slate-500 font-bold uppercase tracking-widest text-xs">Generamos el fixture por ti.</p>
                            </div>
                        </div>
                        <div class="flex gap-8 relative items-start group">
                            <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black italic shrink-0 shadow-xl shadow-indigo-600/20">3</div>
                            <div>
                                <h4 class="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-slate-100 mb-2">Comparte el link</h4>
                                <p class="text-slate-500 font-bold uppercase tracking-widest text-xs">Manda el enlace por WhatsApp.</p>
                            </div>
                        </div>
                    </div>
                </div>
      </section>

      <!-- Precios -->
      <section id="precios" class="py-20 md:py-32 bg-slate-950">
                <div class="max-w-4xl mx-auto px-6 text-center">
                    <h3 class="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-50 mb-12">PLANES PARA CADA <span class="opacity-40">LIGA</span></h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-2xl mx-auto">
                        <div class="p-10 bg-slate-900 border border-white/5 rounded-[2.5rem] flex flex-col items-center">
                            <h4 class="text-lg font-black italic uppercase tracking-widest text-slate-400 mb-2">Gratis</h4>
                            <div class="text-4xl font-black italic mb-8">S/. 0</div>
                            <button onclick="window.navigate('auth')" class="w-full py-4 bg-slate-800 text-white rounded-2xl font-black italic uppercase tracking-widest text-[10px] active:scale-95 transition-all">Empezar gratis</button>
                        </div>
                        <div class="p-10 bg-slate-900 border-2 border-indigo-600 rounded-[2.5rem] flex flex-col items-center relative shadow-2xl shadow-indigo-600/20">
                            <h4 class="text-lg font-black italic uppercase tracking-widest text-indigo-400 mb-2">Plan Pro</h4>
                            <div class="text-4xl font-black italic mb-8">S/. 29<span class="text-xs text-slate-500">/mes</span></div>
                            <button onclick="window.navigate('auth')" class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black italic uppercase tracking-widest text-[10px] hover:bg-indigo-500 transition-all active:scale-95 shadow-xl shadow-indigo-600/20">Prueba gratis</button>
                        </div>
                    </div>
                </div>
      </section>

      <!-- Footer -->
      <footer class="py-16 bg-slate-950 border-t border-white/5 text-center px-6">
                <div class="flex items-center justify-center gap-2 mb-8">
                     <span class="font-black italic text-xl uppercase tracking-tighter text-slate-100">Fútbol App</span>
                </div>
                <nav class="flex flex-wrap justify-center gap-8 mb-12">
                    <button onclick="window.navigate('auth')" class="text-[10px] font-black uppercase tracking-widest text-white hover:text-indigo-400 transition-colors">Iniciar Sesión</button>
                    <a href="#" class="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-100 transition-colors">Términos</a>
                    <a href="https://wa.me/51972498691" class="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-100 transition-colors">Soporte</a>
                </nav>
      </footer>
    `
}
