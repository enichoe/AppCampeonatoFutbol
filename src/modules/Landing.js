export const renderLanding = (container) => {
  container.innerHTML = `
    <div class="landing-page min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      <!-- Navbar Glassmorphism -->
      <nav id="navbar" class="fixed top-0 w-full z-[100] transition-all duration-500 border-b border-transparent bg-transparent">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div class="flex items-center gap-3 cursor-pointer group" onclick="window.scrollTo({top:0, behavior:'smooth'})">
            <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40 group-hover:rotate-12 transition-transform duration-300">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <span class="text-2xl font-black italic tracking-tighter text-white uppercase italic">Fútbol App</span>
          </div>

          <div class="hidden md:flex items-center gap-10 text-sm font-bold text-slate-400">
            <a href="#beneficios" class="hover:text-indigo-400 transition-colors">Beneficios</a>
            <a href="#como-funciona" class="hover:text-indigo-400 transition-colors">Cómo funciona</a>
            <a href="#precios" class="hover:text-indigo-400 transition-colors">Precios</a>
            <button onclick="window.navigate('auth')" class="hover:text-indigo-400 transition-all font-bold text-slate-200">Iniciar sesión</button>
            <button onclick="window.navigate('auth')" class="bg-indigo-600 text-white px-8 py-3 rounded-2xl hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95 transition-all font-black text-xs uppercase tracking-widest">
              Empezar ahora
            </button>
          </div>

          <button id="menu-toggle" class="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>

        <!-- Mobile Menu Fullscreen Overlay -->
        <div id="mobile-menu" class="hidden fixed inset-0 z-[120] bg-[#020617]/98 backdrop-blur-2xl md:hidden flex flex-col p-8 transition-all duration-500 opacity-0 translate-y-10">
            <div class="flex justify-between items-center mb-12">
               <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                  <span class="font-black italic text-xl uppercase tracking-tighter">Fútbol App</span>
               </div>
               <button id="menu-close" class="p-3 bg-slate-900 rounded-2xl border border-white/5 text-slate-400"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <nav class="flex flex-col gap-4">
                <a href="#beneficios" class="mobile-link p-6 bg-slate-900/50 rounded-3xl text-2xl font-black italic uppercase border border-white/5">Beneficios</a>
                <a href="#como-funciona" class="mobile-link p-6 bg-slate-900/50 rounded-3xl text-2xl font-black italic uppercase border border-white/5">Cómo funciona</a>
                <a href="#precios" class="mobile-link p-6 bg-slate-900/50 rounded-3xl text-2xl font-black italic uppercase border border-white/5">Precios</a>
                <button onclick="window.navigate('auth')" class="p-6 bg-slate-900/50 rounded-3xl text-2xl font-black italic uppercase border border-white/5 text-left">Iniciar sesión</button>
                <button onclick="window.navigate('auth')" class="mt-8 bg-indigo-600 text-white py-6 rounded-3xl font-black italic uppercase tracking-widest shadow-2xl shadow-indigo-600/30">
                  Registrar mi torneo
                </button>
            </nav>
        </div>
      </nav>

      <!-- Hero Section: Impacto Total -->
      <section class="relative pt-40 pb-20 md:pt-64 md:pb-52 overflow-hidden">
        <!-- Background Orbs -->
        <div class="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 blur-[140px] rounded-full animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-400/10 blur-[120px] rounded-full animate-pulse" style="animation-delay: 2s"></div>
        
        <div class="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <div class="fade-in inline-flex items-center gap-3 px-5 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-10 backdrop-blur-md">
            <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>
            <span class="text-[10px] md:text-sm font-bold text-indigo-400 uppercase tracking-widest">Organiza tu torneo hoy mismo</span>
          </div>

          <h1 class="fade-in text-5xl sm:text-7xl md:text-[9rem] font-[1000] italic tracking-[-0.05em] text-white uppercase leading-[0.8] mb-12 text-center">
            CREA <span class="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">TU LIGA</span> <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 drop-shadow-[0_0_30px_rgba(79,70,229,0.3)]">PROFESIONAL</span>
          </h1>
          
          <p class="fade-in max-w-2xl mx-auto text-slate-400 text-xl md:text-2xl font-medium leading-tight mb-16 text-center lg:px-20">
             Maneja resultados, tablas de posiciones y fixtures automáticos desde una sola plataforma profesional para todo el Perú.
          </p>

          <div class="fade-in flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto px-4 mb-32">
            <button onclick="window.navigate('auth')" class="group relative w-full sm:w-auto bg-indigo-600 text-white h-20 px-12 rounded-3xl font-black italic uppercase tracking-widest shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:shadow-[0_25px_60px_rgba(79,70,229,0.6)] active:scale-95 transition-all duration-300">
              <span class="relative z-10">Crear torneo gratis</span>
              <div class="absolute inset-x-0 bottom-0 top-0 bg-white/20 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-3xl"></div>
            </button>
            <button onclick="window.navigate('torneos')" class="w-full sm:w-auto px-12 h-20 bg-slate-900 border border-white/10 rounded-3xl text-slate-300 font-black italic uppercase tracking-widest hover:bg-slate-800 hover:border-white/20 active:scale-95 transition-all">
               Ver demo en vivo
            </button>
          </div>

          <!-- Hero Mockups (Stacked and Animated) -->
          <div class="slide-up relative w-full max-w-6xl mx-auto mt-20 perspective-1000">
              <div class="absolute -inset-10 bg-indigo-500/20 blur-[100px] rounded-full opacity-30"></div>
              
              <!-- Tablet Display -->
              <div class="relative aspect-video glass rounded-[3rem] p-2 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-white/10">
                  <div class="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 to-transparent"></div>
                  <img src="/img1.png" class="w-full h-full object-cover rounded-[2.5rem]" alt="SaaS Dashboard">
              </div>

              <!-- Mobile Float Piece: Esto se puede simular si tenemos una imagen vertical, pero usaremos la misma con zoom -->
              <div class="hidden lg:block absolute -right-16 -bottom-16 w-80 aspect-[9/16] glass rounded-[3rem] p-3 shadow-2xl border-white/10 rotate-6 translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                  <img src="/img1.png" class="w-full h-full object-cover rounded-[2.5rem] object-top" alt="Vía Móvil">
              </div>
          </div>
        </div>
      </section>

      <!-- Benefits: Minimalista & Poderoso -->
      <section id="beneficios" class="py-32 md:py-52 bg-[#020617] relative">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col lg:flex-row gap-24 items-center">
                <div class="lg:w-1/2">
                    <h2 class="text-xs font-black uppercase tracking-[0.5em] text-indigo-500 mb-8 italic">Tecnología de élite</h2>
                    <h3 class="text-5xl md:text-8xl font-[1000] italic uppercase tracking-tighter text-white leading-[0.85] mb-12">POTENCIA TU <br/> <span class="text-indigo-600">CAPACIDAD</span></h3>
                    
                    <div class="space-y-10">
                        <div class="group flex gap-8 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:bg-white/[0.04]">
                            <div class="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <h4 class="text-xl font-black italic uppercase italic tracking-tighter text-white mb-2">Fixture inteligente</h4>
                                <p class="text-slate-500 text-lg leading-snug">Genera el calendario completo de tu torneo en un segundo. Cero errores, cero estrés.</p>
                            </div>
                        </div>
                        <div class="group flex gap-8 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 transition-all duration-500 hover:bg-white/[0.04]">
                            <div class="w-16 h-16 bg-cyan-400/10 rounded-2xl flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-400/20 group-hover:scale-110 transition-transform">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <h4 class="text-xl font-black italic uppercase italic tracking-tighter text-white mb-2">Sync en Vivo</h4>
                                <p class="text-slate-500 text-lg leading-snug">Actualiza un resultado en la cancha y deja que todo el Perú lo vea por WhatsApp al instante.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:w-1/2 relative">
                    <div class="relative aspect-square glass rounded-[4rem] p-1 overflow-hidden shadow-3xl transform rotate-3">
                        <img src="/img2.png" class="w-full h-full object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-700" alt="Stats">
                    </div>
                    <div class="absolute -left-10 -bottom-10 bg-indigo-600 p-8 rounded-[3rem] shadow-2xl animate-bounce duration-[3000ms]">
                        <span class="text-4xl font-black italic uppercase tracking-tighter text-white">LIVE</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      ${renderRestOfSections()}

    </div>
  `

  // Effects
  const navbar = container.querySelector('#navbar')
  window.onscroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('bg-[#020617]/90', 'backdrop-blur-xl', 'border-white/10', 'py-4')
      navbar.classList.remove('transparent', 'py-0')
    } else {
      navbar.classList.remove('bg-[#020617]/90', 'backdrop-blur-xl', 'border-white/10', 'py-4')
      navbar.classList.add('transparent')
    }
  }

  // Mobile Menu Logic
  const toggleBtn = container.querySelector('#menu-toggle')
  const closeBtn = container.querySelector('#menu-close')
  const mobileMenu = container.querySelector('#mobile-menu')
  const mobileLinks = container.querySelectorAll('.mobile-link')

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden')
    setTimeout(() => {
        mobileMenu.classList.remove('opacity-0', 'translate-y-10')
    }, 10)
  })
  
  const closeMenu = () => {
    mobileMenu.classList.add('opacity-0', 'translate-y-10')
    setTimeout(() => mobileMenu.classList.add('hidden'), 500)
  }
  closeBtn.addEventListener('click', closeMenu)
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu))
}

function renderRestOfSections() {
    return `
      <!-- Steps: Directo y Visual -->
      <section id="como-funciona" class="py-32 bg-[#020617] border-y border-white/5 relative overflow-hidden">
          <div class="absolute -right-64 top-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full"></div>
          <div class="max-w-6xl mx-auto px-6">
              <div class="text-center mb-24">
                  <h3 class="text-5xl md:text-8xl font-[1000] italic uppercase tracking-tight text-white leading-none">DOMINA EL <br/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">PROCESO</span></h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div class="relative group p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-white/[0.04] transition-all">
                      <div class="text-[120px] font-black text-white/5 absolute -top-10 -left-4 leading-none group-hover:text-indigo-500/10 transition-colors">01</div>
                      <h4 class="text-2xl font-black italic uppercase italic tracking-tighter text-white mb-4 mt-12">Cuenta Pro</h4>
                      <p class="text-slate-500 text-base leading-relaxed">Crea tu espacio de trabajo oficial en menos de 1 minuto con tu correo.</p>
                  </div>
                  <div class="relative group p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-white/[0.04] transition-all scale-105 bg-white/[0.03]">
                      <div class="text-[120px] font-black text-white/5 absolute -top-10 -left-4 leading-none group-hover:text-indigo-500/10 transition-colors">02</div>
                      <h4 class="text-2xl font-black italic uppercase italic tracking-tighter text-white mb-4 mt-12">Data Masiva</h4>
                      <p class="text-slate-500 text-base leading-relaxed">Importa tus equipos, logos y sedes. Nuestra IA genera el calendario.</p>
                  </div>
                  <div class="relative group p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-white/[0.04] transition-all">
                      <div class="text-[120px] font-black text-white/5 absolute -top-10 -left-4 leading-none group-hover:text-indigo-500/10 transition-colors">03</div>
                      <h4 class="text-2xl font-black italic uppercase italic tracking-tighter text-white mb-4 mt-12">Impacto Viral</h4>
                      <p class="text-slate-500 text-base leading-relaxed">Lanza tu web pública. Los jugadores se vuelven adictos a las estadísticas.</p>
                  </div>
              </div>
          </div>
      </section>

      <!-- Pricing: Modern SaaS hierarchy -->
      <section id="precios" class="py-32 md:py-64 bg-[#020617]">
          <div class="max-w-7xl mx-auto px-6">
              <div class="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
                  <div class="max-w-2xl">
                      <h3 class="text-5xl md:text-8xl font-[1000] italic uppercase tracking-tighter text-white leading-[0.85]">PLANES A <br/> <span class="text-indigo-500">TU MEDIDA</span></h3>
                  </div>
                  <p class="text-slate-500 text-xl font-bold uppercase italic tracking-widest mb-4">Sin costos ocultos</p>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch max-w-5xl mx-auto">
                  <div class="group relative p-12 bg-white/[0.02] border border-white/5 rounded-[4rem] flex flex-col hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                      <div class="absolute -right-20 -top-20 w-64 h-64 bg-slate-500/10 blur-[80px] rounded-full"></div>
                      <h4 class="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-2 italic">Entusiasta</h4>
                      <div class="text-6xl font-[1000] italic text-white mb-8 tracking-tighter italic">GRATIS</div>
                      <ul class="text-left space-y-6 mb-16 flex-1">
                          <li class="text-slate-400 font-bold uppercase text-xs flex items-center gap-4"><div class="w-2 h-2 bg-indigo-500 rounded-full"></div> 1 Torneo de Prueba</li>
                          <li class="text-slate-400 font-bold uppercase text-xs flex items-center gap-4"><div class="w-2 h-2 bg-indigo-500 rounded-full"></div> Max 8 Equipos</li>
                          <li class="text-slate-400 font-bold uppercase text-xs flex items-center gap-4"><div class="w-2 h-2 bg-indigo-500 rounded-full"></div> Publicidad en Web</li>
                      </ul>
                      <button onclick="window.navigate('auth')" class="w-full py-6 bg-slate-900 border border-white/10 text-white rounded-3xl font-black italic uppercase tracking-widest text-xs hover:bg-slate-800 transition-all">Empezar ahora</button>
                  </div>

                  <div class="group relative p-12 bg-indigo-600 border-2 border-indigo-400 rounded-[4rem] flex flex-col shadow-[0_40px_80px_-15px_rgba(79,70,229,0.5)] transform lg:translate-y-[-2rem] transition-all duration-500 overflow-hidden">
                      <div class="absolute -right-20 -top-20 w-64 h-64 bg-white/20 blur-[80px] rounded-full"></div>
                      <div class="inline-block px-4 py-1.5 bg-white text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest italic mb-6 w-fit shadow-xl">Más popular</div>
                      <h4 class="text-sm font-black uppercase tracking-[0.3em] text-indigo-100 mb-2 italic">Elite Partner</h4>
                      <div class="text-6xl font-[1000] italic text-white mb-2 tracking-tighter italic">S/. 29</div>
                      <p class="text-indigo-200 text-xs font-black uppercase tracking-widest mb-10 italic">Pago mensual sin permanencia</p>
                      <ul class="text-left space-y-6 mb-16 flex-1">
                          <li class="text-white font-bold uppercase text-xs flex items-center gap-4"><div class="w-2 h-2 bg-white rounded-full"></div> Torneos Ilimitados</li>
                          <li class="text-white font-bold uppercase text-xs flex items-center gap-4"><div class="w-2 h-2 bg-white rounded-full"></div> Sin Limite de Equipos</li>
                          <li class="text-white font-bold uppercase text-xs flex items-center gap-4"><div class="w-2 h-2 bg-white rounded-full"></div> Goleadores & Stats</li>
                          <li class="text-white font-bold uppercase text-xs flex items-center gap-4"><div class="w-2 h-2 bg-white rounded-full"></div> Dominio & Branding</li>
                      </ul>
                      <button onclick="window.navigate('auth')" class="w-full py-6 bg-white text-indigo-600 rounded-3xl font-black italic uppercase tracking-widest text-xs shadow-2xl hover:bg-indigo-50 transition-all duration-300">Quiero el Plan Elite</button>
                  </div>
              </div>
          </div>
      </section>

      <!-- Final CTA: Cierre de Venta Agresivo -->
      <section class="py-32 relative bg-[#020617] overflow-hidden">
          <div class="absolute inset-0 bg-indigo-600/5 blur-[150px] rounded-full -translate-y-1/2"></div>
          <div class="max-w-5xl mx-auto px-6 text-center relative z-10">
              <h3 class="text-6xl md:text-[10rem] font-[1000] italic uppercase tracking-[-0.08em] text-white leading-none mb-10">
                CAMBIA EL <br/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 drop-shadow-2xl">JUEGO</span>
              </h3>
              <p class="text-slate-400 text-xl font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
                Únete a los líderes que están profesionalizando el fútbol amateur en todo el Perú. Tu próximo torneo empieza hoy.
              </p>
              <div class="flex flex-col items-center gap-6">
                <button onclick="window.navigate('auth')" class="inline-flex items-center gap-6 bg-indigo-600 text-white px-16 py-8 text-2xl font-[1000] italic uppercase tracking-widest rounded-[2.5rem] shadow-[0_20px_60px_rgba(79,70,229,0.5)] hover:shadow-[0_25px_80px_rgba(79,70,229,0.7)] hover:scale-105 active:scale-95 transition-all duration-300">
                    Empezar gratis
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
                <p class="text-slate-600 text-xs font-bold uppercase tracking-[0.3em] font-black">No se requiere tarjeta de crédito</p>
              </div>
          </div>
      </section>

      <!-- Footer: Elegante & Minimalista -->
      <footer class="py-24 bg-[#020617] border-t border-white/5 text-center px-6">
          <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
              <div class="flex items-center gap-3">
                   <div class="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-white/5"><svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                   <span class="font-black italic text-2xl uppercase tracking-tighter text-white">Fútbol App</span>
              </div>
              <nav class="flex flex-wrap justify-center gap-10">
                  <button onclick="window.navigate('auth')" class="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Iniciar Sesión</button>
                  <a href="#" class="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Privacidad</a>
                  <a href="https://wa.me/51972498691" class="text-xs font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors">Soporte Express</a>
              </nav>
              <p class="text-slate-600 text-[10px] font-bold uppercase tracking-widest">&copy; 2026 Fútbol App - Lima, Perú.</p>
          </div>
      </footer>
    `
}
