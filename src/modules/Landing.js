export const renderLanding = (container) => {
  container.innerHTML = `
    <div class="landing-page min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      <!-- Navbar Adaptativo -->
      <nav id="navbar" class="fixed top-0 w-full z-[100] transition-all duration-500 border-b border-transparent bg-transparent">
        <div class="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div class="flex items-center gap-2 md:gap-3 cursor-pointer group" onclick="window.scrollTo({top:0, behavior:'smooth'})">
            <div class="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40 group-hover:rotate-12 transition-transform duration-300">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <span class="text-lg md:text-2xl font-black italic tracking-tighter text-white uppercase">Fútbol App</span>
          </div>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-10 text-sm font-bold text-slate-400">
            <a href="#beneficios" class="hover:text-indigo-400 transition-colors">Beneficios</a>
            <a href="#como-funciona" class="hover:text-indigo-400 transition-colors">Cómo funciona</a>
            <a href="#precios" class="hover:text-indigo-400 transition-colors">Precios</a>
            <button onclick="window.navigate('auth')" class="hover:text-indigo-400 transition-all font-bold text-slate-200 text-sm">Iniciar sesión</button>
            <button onclick="window.navigate('auth')" class="bg-indigo-600 text-white px-8 py-3 rounded-2xl hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all font-black text-xs uppercase tracking-widest">
              Empezar ahora
            </button>
          </div>

          <button id="menu-toggle" class="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>

        <!-- Mobile Menu Fullscreen Overlay -->
        <div id="mobile-menu" class="hidden fixed inset-0 z-[120] bg-[#020617]/98 backdrop-blur-2xl md:hidden flex flex-col p-6 transition-all duration-500 opacity-0 translate-y-10">
            <div class="flex justify-between items-center mb-10">
               <div class="flex items-center gap-2">
                  <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                  <span class="font-black italic text-lg uppercase tracking-tighter">Fútbol App</span>
               </div>
               <button id="menu-close" class="p-3 bg-slate-900 rounded-xl border border-white/5 text-slate-400"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <nav class="flex flex-col gap-3">
                <a href="#beneficios" class="mobile-link p-5 bg-slate-900/50 rounded-2xl text-xl font-black italic uppercase border border-white/5">Beneficios</a>
                <a href="#como-funciona" class="mobile-link p-5 bg-slate-900/50 rounded-2xl text-xl font-black italic uppercase border border-white/5">Cómo funciona</a>
                <a href="#precios" class="mobile-link p-5 bg-slate-900/50 rounded-2xl text-xl font-black italic uppercase border border-white/5">Precios</a>
                <button onclick="window.navigate('auth')" class="p-5 bg-slate-900/50 rounded-2xl text-xl font-black italic uppercase border border-white/5 text-left w-full">Iniciar sesión</button>
                <button onclick="window.navigate('auth')" class="mt-4 bg-indigo-600 text-white py-5 rounded-2xl font-black italic uppercase tracking-widest shadow-2xl shadow-indigo-600/30">
                  Registrar mi torneo
                </button>
            </nav>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative pt-24 pb-12 md:pt-64 md:pb-52 overflow-hidden">
        <div class="absolute top-0 left-1/4 w-full h-[500px] bg-indigo-600/10 blur-[130px] rounded-full animate-pulse"></div>
        
        <div class="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <div class="fade-in inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6 md:mb-10 backdrop-blur-md">
            <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>
            <span class="text-[9px] md:text-sm font-bold text-indigo-400 uppercase tracking-widest">Torneos en todo el Perú</span>
          </div>

          <h1 class="fade-in text-4xl sm:text-7xl md:text-[8rem] lg:text-[9.5rem] font-[1000] italic tracking-[-0.05em] text-white uppercase leading-[0.95] md:leading-[0.8] mb-6 md:mb-12 text-center">
            CREA <span class="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">TU LIGA</span> <br class="hidden md:block"/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 drop-shadow-[0_0_20px_rgba(79,70,229,0.2)]">PROFESIONAL</span>
          </h1>
          
          <p class="fade-in max-w-2xl mx-auto text-slate-400 text-base md:text-2xl font-medium leading-snug md:leading-tight mb-10 md:mb-16 text-center px-4">
              Maneja resultados, tablas y fixtures automáticos desde tu celular en segundos.
          </p>

          <div class="fade-in flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full sm:w-auto px-4 mb-16 md:mb-32">
            <button onclick="window.navigate('auth')" class="group relative w-full sm:w-auto bg-indigo-600 text-white h-16 md:h-20 px-8 md:px-12 rounded-2xl md:rounded-3xl font-black italic uppercase tracking-widest shadow-xl shadow-indigo-600/30 active:scale-95 transition-all">
              Crear gratis ahora
            </button>
            <button onclick="window.navigate('torneos')" class="w-full sm:w-auto px-8 md:px-12 h-16 md:h-20 bg-slate-900 border border-white/10 rounded-2xl md:rounded-3xl text-slate-300 font-black italic uppercase tracking-widest hover:bg-slate-800 transition-all">
                Demo en vivo
            </button>
          </div>

          <!-- Hero Mockup -->
          <div class="slide-up relative w-full max-w-5xl mx-auto mt-8 md:mt-20">
              <div class="absolute -inset-6 md:-inset-10 bg-indigo-500/10 blur-[80px] rounded-full opacity-30"></div>
              <div class="relative glass rounded-2xl md:rounded-[3rem] p-1.5 md:p-2 overflow-hidden shadow-2xl border-white/10">
                  <div class="aspect-video sm:aspect-auto">
                    <img src="/img1.png" class="w-full h-full object-cover rounded-xl md:rounded-[2.5rem] object-top" alt="SaaS Dashboard">
                  </div>
              </div>
          </div>
        </div>
      </section>

      <!-- Stats Section: Prueba Social -->
      <section class="py-12 border-y border-white/5 bg-slate-950/50">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-3xl md:text-5xl font-[1000] italic text-indigo-500">+500</div>
            <div class="text-[10px] uppercase font-black tracking-widest text-slate-500">Ligas Activas</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-5xl font-[1000] italic text-white">10K</div>
            <div class="text-[10px] uppercase font-black tracking-widest text-slate-500">Partidos al mes</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-5xl font-[1000] italic text-indigo-500">24/7</div>
            <div class="text-[10px] uppercase font-black tracking-widest text-slate-500">Soporte Perú</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-5xl font-[1000] italic text-white">100%</div>
            <div class="text-[10px] uppercase font-black tracking-widest text-slate-500">Automatizado</div>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section id="beneficios" class="py-20 md:py-52 bg-[#020617] relative">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex flex-col lg:flex-row gap-16 md:gap-24 items-center">
                <div class="lg:w-1/2">
                    <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-6 italic">Optimización total</h2>
                    <h3 class="text-3xl md:text-8xl font-[1000] italic uppercase tracking-tighter text-white leading-none mb-10">TODO BAJO <br/> <span class="text-indigo-600">CONTROL</span></h3>
                    
                    <div class="space-y-6 md:space-y-10">
                        <div class="group flex gap-4 md:gap-8 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all">
                            <div class="w-12 h-12 md:w-16 md:h-16 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-500/20">
                                <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div>
                                <h4 class="text-lg md:text-xl font-black italic uppercase tracking-tighter text-white mb-1">Fixture en 1 seg</h4>
                                <p class="text-slate-500 text-sm md:text-lg">Genera el calendario completo sin errores manuales.</p>
                            </div>
                        </div>
                        <div class="group flex gap-4 md:gap-8 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-cyan-400/30 transition-all">
                            <div class="w-12 h-12 md:w-16 md:h-16 bg-cyan-400/10 rounded-xl flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-400/20">
                                <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div>
                                <h4 class="text-lg md:text-xl font-black italic uppercase tracking-tighter text-white mb-1">Sync WhatsApp</h4>
                                <p class="text-slate-500 text-sm md:text-lg">Resultados en tiempo real para todos tus delegados.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lg:w-1/2 relative w-full overflow-hidden px-4 md:px-0">
                    <div class="relative glass rounded-[2.5rem] md:rounded-[4rem] p-1 overflow-hidden shadow-3xl rotate-2">
                        <img src="/img2.png" class="w-full h-full object-cover opacity-90 transition-all duration-700" alt="Estadísticas">
                    </div>
                </div>
            </div>
        </div>
      </section>

      <!-- Comparison Section: El Dolor vs La Solución -->
      <section class="py-20 md:py-32 bg-slate-950 border-y border-white/5">
        <div class="max-w-5xl mx-auto px-6">
          <h3 class="text-2xl md:text-6xl font-[1000] italic uppercase tracking-tighter text-white text-center mb-16">ADIÓS AL <span class="text-red-500">EXCEL</span></h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="p-8 rounded-3xl bg-red-500/5 border border-red-500/20">
              <h4 class="text-red-500 font-black italic uppercase mb-6 tracking-widest">Antes (El Caos)</h4>
              <ul class="space-y-4 text-slate-400 text-sm md:text-base font-bold">
                <li class="flex items-center gap-3"><span class="text-red-500">✕</span> Horas pegado a una computadora</li>
                <li class="flex items-center gap-3"><span class="text-red-500">✕</span> Delegados llamando todo el día</li>
                <li class="flex items-center gap-3"><span class="text-red-500">✕</span> Errores en la tabla de posiciones</li>
                <li class="flex items-center gap-3"><span class="text-red-500">✕</span> Fotos borrosas de las actas</li>
              </ul>
            </div>
            <div class="p-8 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 shadow-[0_0_40px_rgba(79,70,229,0.1)]">
              <h4 class="text-indigo-500 font-black italic uppercase mb-6 tracking-widest">Ahora (Fútbol App)</h4>
              <ul class="space-y-4 text-slate-200 text-sm md:text-base font-bold">
                <li class="flex items-center gap-3"><span class="text-indigo-500">✓</span> Todo listo en 3 clicks</li>
                <li class="flex items-center gap-3"><span class="text-indigo-500">✓</span> Link público para todos</li>
                <li class="flex items-center gap-3"><span class="text-indigo-500">✓</span> Tablas que se actualizan solas</li>
                <li class="flex items-center gap-3"><span class="text-indigo-500">✓</span> Gestión profesional desde el sofá</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      ${renderRestOfSections()}

    </div>
  `

  // Navbar Scroll Effect
  const navbar = container.querySelector('#navbar')
  window.onscroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('bg-[#020617]/90', 'backdrop-blur-xl', 'border-white/10', 'py-3')
      navbar.classList.remove('transparent', 'py-0')
    } else {
      navbar.classList.remove('bg-[#020617]/90', 'backdrop-blur-xl', 'border-white/10', 'py-3')
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
      <!-- Steps Section -->
      <section id="como-funciona" class="py-20 md:py-32 bg-[#020617] border-y border-white/5 relative">
          <div class="max-w-6xl mx-auto px-6">
              <div class="text-center mb-16 md:mb-24">
                  <h3 class="text-3xl md:text-8xl font-[1000] italic uppercase tracking-tight text-white leading-none">DOMINA EL <br class="hidden md:block"/> <span class="text-indigo-500">PROCESO</span></h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                  <div class="relative group p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[3rem] transition-all">
                      <div class="text-6xl md:text-[120px] font-black text-white/5 absolute -top-4 md:-top-10 -left-2 leading-none">01</div>
                      <h4 class="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white mb-2 md:mb-4 mt-8 md:mt-12">Registro</h4>
                      <p class="text-slate-500 text-sm md:text-base">Crea tu cuenta pro en 30 segundos gratis.</p>
                  </div>
                  <div class="relative group p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[3rem] transition-all bg-white/[0.03] md:scale-105">
                      <div class="text-6xl md:text-[120px] font-black text-white/5 absolute -top-4 md:-top-10 -left-2 leading-none">02</div>
                      <h4 class="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white mb-2 md:mb-4 mt-8 md:mt-12">Montaje</h4>
                      <p class="text-slate-500 text-sm md:text-base">Sube tus equipos y dispara el fixture automático.</p>
                  </div>
                  <div class="relative group p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-3xl md:rounded-[3rem] transition-all">
                      <div class="text-6xl md:text-[120px] font-black text-white/5 absolute -top-4 md:-top-10 -left-2 leading-none">03</div>
                      <h4 class="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-white mb-2 md:mb-4 mt-8 md:mt-12">Lanzamiento</h4>
                      <p class="text-slate-500 text-sm md:text-base">Link público y viralización por todo WhatsApp.</p>
                  </div>
              </div>
          </div>
      </section>

      <!-- Pricing Section -->
      <section id="precios" class="py-20 md:py-64 bg-[#020617]">
          <div class="max-w-7xl mx-auto px-6 text-center lg:text-left">
              <div class="flex flex-col lg:flex-row justify-between items-end mb-16 md:mb-24 gap-6">
                  <h3 class="text-3xl md:text-8xl font-[1000] italic uppercase tracking-tighter text-white leading-none">PLANES <br/> <span class="text-indigo-500">PRO</span></h3>
                  <p class="text-slate-500 text-xs md:text-xl font-bold uppercase tracking-widest">Precios localizados en Perú</p>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl mx-auto">
                  <div class="p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[2.5rem] md:rounded-[4rem] flex flex-col items-center">
                      <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Pichanga</h4>
                      <div class="text-4xl md:text-6xl font-[1000] italic text-white mb-8 tracking-tighter">GRATIS</div>
                      <ul class="text-left space-y-4 mb-10 flex-1 w-full outline-none">
                          <li class="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-3"><span class="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> 8 Equipos Max</li>
                          <li class="text-slate-400 font-bold uppercase text-[10px] flex items-center gap-3"><span class="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Fixture Base</li>
                      </ul>
                      <button onclick="window.navigate('auth')" class="w-full py-5 bg-slate-900 border border-white/10 text-white rounded-2xl md:rounded-3xl font-black italic uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all">Empezar</button>
                  </div>

                  <div class="p-8 md:p-12 bg-indigo-600 border-2 border-indigo-400 rounded-[2.5rem] md:rounded-[4rem] flex flex-col items-center shadow-2xl relative">
                      <div class="absolute -top-3 bg-white text-indigo-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest italic mb-6">Popular</div>
                      <h4 class="text-[10px] font-black uppercase tracking-widest text-indigo-100 mb-2">Elite Partner</h4>
                      <div class="text-4xl md:text-6xl font-[1000] italic text-white mb-2 tracking-tighter">S/. 29</div>
                      <p class="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-10 italic">Pago mensual</p>
                      <ul class="text-left space-y-4 mb-10 flex-1 w-full">
                          <li class="text-white font-bold uppercase text-[10px] flex items-center gap-3"><span class="w-1.5 h-1.5 bg-white rounded-full"></span> Equipos Ilimitados</li>
                          <li class="text-white font-bold uppercase text-[10px] flex items-center gap-3"><span class="w-1.5 h-1.5 bg-white rounded-full"></span> Goleadores & Stats</li>
                      </ul>
                      <button onclick="window.navigate('auth')" class="w-full py-5 bg-white text-indigo-600 rounded-2xl md:rounded-3xl font-black italic uppercase tracking-widest text-[10px] shadow-2xl hover:bg-slate-50 transition-all">Activar Pro</button>
                  </div>
              </div>
          </div>
      </section>

      <!-- FAQ Section: Objeciones -->
      <section class="py-20 md:py-32 bg-slate-950/30">
        <div class="max-w-4xl mx-auto px-6">
          <h3 class="text-2xl md:text-5xl font-[1000] italic uppercase tracking-tighter text-white text-center mb-16">PREGUNTAS <span class="text-indigo-500">FRECUENTES</span></h3>
          <div class="space-y-4">
            <div class="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <h5 class="text-white font-black italic uppercase text-sm mb-2">¿Cómo pagan los delegados?</h5>
              <p class="text-slate-500 text-sm">Tú cobras como siempre. Fútbol App solo te ayuda a organizar. Si quieres usar nuestra pasarela, escríbenos al soporte.</p>
            </div>
            <div class="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <h5 class="text-white font-black italic uppercase text-sm mb-2">¿Funciona para Fútbol 7 o Futsal?</h5>
              <p class="text-slate-500 text-sm">Sí, es 100% configurable. Puedes ajustar tiempos, número de jugadores y reglas específicas.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA: Ultra Potente -->
      <section class="py-32 md:py-52 relative bg-[#020617] overflow-hidden text-center px-6">
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none"></div>
          <div class="max-w-5xl mx-auto relative z-10">
              <h3 class="text-5xl md:text-[10rem] font-[1000] italic uppercase tracking-[-0.05em] text-white leading-[0.85] mb-12">
                ¿LISTO PARA EL <br/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">SIGUIENTE NIVEL?</span>
              </h3>
              <p class="text-slate-400 text-lg md:text-2xl font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
                Únete a los más de 500 organizadores en Perú que ya digitalizaron su pasión.
              </p>
              <div class="flex flex-col md:flex-row items-center justify-center gap-6">
                <button onclick="window.navigate('auth')" class="group relative bg-indigo-600 text-white px-12 py-8 text-xl font-[1000] italic uppercase tracking-widest rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.4)] hover:scale-105 transition-all w-full md:w-auto">
                    Crear mi liga ahora
                </button>
                <a href="#" class="flex items-center gap-3 px-10 py-8 text-slate-300 font-black italic uppercase tracking-widest border border-white/10 rounded-3xl hover:bg-white/5 transition-all w-full md:w-auto justify-center">
                    <svg class="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.316 1.592 5.43 0 9.856-4.426 9.858-9.855 0-2.63-1.024-5.103-2.884-6.964-1.86-1.86-4.334-2.884-6.964-2.884-5.43 0-9.858 4.426-9.858 9.855 0-2.113.582 3.535 1.577 5.141l-.957 3.498 3.587-.941z"/></svg>
                    Hablar con un experto
                </a>
              </div>
          </div>
      </section>

      <!-- Footer Pro: Máxima Autoridad -->
      <footer class="bg-slate-950 pt-24 pb-12 border-t border-white/5 px-6">
          <div class="max-w-7xl mx-auto">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                  <!-- Brand Col -->
                  <div class="md:col-span-2">
                      <div class="flex items-center gap-3 mb-8">
                           <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20"><svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div>
                           <span class="font-black italic text-3xl uppercase tracking-tighter text-white">Fútbol App</span>
                      </div>
                      <p class="text-slate-500 text-lg font-medium max-w-sm mb-8 leading-relaxed">
                        Transformamos pichangas de barrio en ligas profesionales con tecnología de élite. La plataforma N°1 en gestión deportiva de Perú.
                      </p>
                  </div>

                  <!-- Links Col 1 -->
                  <div>
                      <h4 class="text-white font-black italic uppercase tracking-widest text-xs mb-8">Plataforma</h4>
                      <ul class="space-y-4">
                          <li><a href="#beneficios" class="text-slate-500 hover:text-indigo-400 font-bold uppercase text-[11px] tracking-widest transition-colors">Beneficios</a></li>
                          <li><a href="#como-funciona" class="text-slate-500 hover:text-indigo-400 font-bold uppercase text-[11px] tracking-widest transition-colors">Cómo funciona</a></li>
                          <li><a href="#precios" class="text-slate-500 hover:text-indigo-400 font-bold uppercase text-[11px] tracking-widest transition-colors">Precios</a></li>
                      </ul>
                  </div>

                  <!-- Links Col 2 -->
                  <div>
                      <h4 class="text-white font-black italic uppercase tracking-widest text-xs mb-8">Soporte</h4>
                      <ul class="space-y-4">
                          <li><a href="#" class="text-slate-500 hover:text-indigo-400 font-bold uppercase text-[11px] tracking-widest transition-colors">Centro de ayuda</a></li>
                          <li><a href="#" class="text-slate-500 hover:text-indigo-400 font-bold uppercase text-[11px] tracking-widest transition-colors">WhatsApp Directo</a></li>
                      </ul>
                  </div>
              </div>

              <!-- Bottom Bar -->
              <div class="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div class="flex items-center gap-4">
                    <span class="text-slate-600 text-[10px] font-black uppercase tracking-widest italic">Orgullosamente desarrollado en</span>
                    <div class="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <div class="w-4 h-3 bg-red-600 relative overflow-hidden">
                            <div class="absolute inset-0 left-1/3 right-1/3 bg-white"></div>
                        </div>
                        <span class="text-white text-[9px] font-black uppercase">Perú</span>
                    </div>
                  </div>
                  <p class="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">&copy; 2026 Fútbol App.</p>
              </div>
          </div>
      </footer>
    `
}

