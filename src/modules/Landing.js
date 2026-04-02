export const renderLanding = (container) => {
  container.innerHTML = `
    <div class="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      <!-- Navbar -->
      <nav id="navbar" class="fixed top-0 w-full z-[100] transition-all duration-300 border-b border-transparent bg-slate-900/80 backdrop-blur-xl">
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
          <div class="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a href="#features" class="hover:text-indigo-400 transition-colors">Características</a>
            <a href="#pricing" class="hover:text-indigo-400 transition-colors">Precios</a>
            <button onclick="window.navigate('auth')" class="hover:text-indigo-400 transition-colors">Ingresar</button>
            <button onclick="window.navigate('auth')" class="bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 active:scale-95 transition-all outline-none">
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

        <!-- Mobile Menu (Full Screen) -->
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
                <a href="#features" class="mobile-link p-6 bg-slate-900/50 border border-white/5 rounded-2xl text-xl font-black italic uppercase tracking-tighter text-slate-100">Características</a>
                <a href="#pricing" class="mobile-link p-6 bg-slate-900/50 border border-white/5 rounded-2xl text-xl font-black italic uppercase tracking-tighter text-slate-100">Precios</a>
                <button onclick="window.navigate('auth')" class="p-6 bg-slate-900/50 border border-white/5 rounded-2xl text-xl font-black italic uppercase tracking-tighter text-slate-100 text-left">Ingresar</button>
                <button onclick="window.navigate('auth')" class="mt-8 bg-indigo-600 text-white py-6 rounded-2xl font-black italic uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 active:scale-95">
                  Crear torneo gratis
                </button>
            </nav>
            <div class="mt-auto text-center">
               <p class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 italic">Hecho en Perú 🇵🇪</p>
            </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative pt-32 pb-20 md:pt-52 md:pb-40 overflow-hidden">
        <!-- Dot Pattern Background (CSS Pure) -->
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(#fff 1px, transparent 0); background-size: 40px 40px;"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        
        <div class="max-w-7xl mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-8">
            <span class="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">⚽ +500 torneos en todo el Perú</span>
          </div>

          <h1 class="text-4xl sm:text-5xl md:text-8xl font-black italic tracking-tighter text-slate-50 uppercase leading-[0.9] mb-8">
            Gestiona tu <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">campeonato</span> <br/>
            como un profesional
          </h1>
          
          <p class="max-w-2xl mx-auto text-slate-400 text-base md:text-xl font-medium leading-relaxed mb-12 px-2 uppercase tracking-tight">
            Crea tu liga, registra equipos, genera el fixture y comparte la tabla de posiciones en tiempo real por WhatsApp. Gratis para empezar.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4">
            <button onclick="window.navigate('auth')" class="w-full sm:w-auto bg-indigo-600 text-white min-h-[52px] px-10 py-4 rounded-2xl font-black italic uppercase tracking-tighter shadow-2xl shadow-indigo-600/30 active:scale-95 transition-all">
              Crear mi torneo gratis
            </button>
            <button onclick="window.navigate('torneos')" class="w-full sm:w-auto px-10 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-slate-300 font-black italic uppercase tracking-tighter hover:bg-slate-700 active:scale-95 transition-all">
               Ver demo en vivo ➔
            </button>
          </div>

          <!-- Social Proof -->
          <div class="mt-20 flex flex-col items-center">
             <p class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 italic">Usado por organizadores en:</p>
             <div class="flex flex-wrap justify-center gap-2 md:gap-4 opacity-70">
                ${['Lima', 'Arequipa', 'Trujillo', 'Cusco', 'Piura', 'Iquitos'].map(city => `
                    <span class="px-4 py-2 bg-slate-800/50 border border-white/5 rounded-full text-[10px] font-bold uppercase tracking-widest">${city}</span>
                `).join('')}
             </div>
             <p class="mt-10 text-xs font-bold text-slate-500 uppercase tracking-widest">+10,000 jugadores registrados a nivel nacional</p>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="py-20 md:py-32 bg-slate-900 relative">
        <div class="max-w-7xl mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="p-10 bg-slate-800/50 border border-white/5 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group">
              <div class="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-8 border border-white/5 shadow-inner">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h4 class="text-xl font-black italic uppercase tracking-tighter text-slate-100 mb-4">Fixture automáticamente</h4>
              <p class="text-slate-400 text-sm font-bold uppercase tracking-tight leading-relaxed">Genera todos los partidos en un solo clic. Liga, eliminación directa o grupos.</p>
            </div>
            <!-- Feature 2 -->
            <div class="p-10 bg-slate-800/50 border border-white/5 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group">
              <div class="w-14 h-14 bg-cyan-400/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-8 border border-white/5 shadow-inner">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
              </div>
              <h4 class="text-xl font-black italic uppercase tracking-tighter text-slate-100 mb-4">Vista pública para jugadores</h4>
              <p class="text-slate-400 text-sm font-bold uppercase tracking-tight leading-relaxed">Comparte el link por WhatsApp. Los jugadores ven sus estadísticas desde cualquier celular.</p>
            </div>
            <!-- Feature 3 -->
            <div class="p-10 bg-slate-800/50 border border-white/5 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group">
              <div class="w-14 h-14 bg-green-400/10 rounded-2xl flex items-center justify-center text-green-400 mb-8 border border-white/5 shadow-inner">
                <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h4 class="text-xl font-black italic uppercase tracking-tighter text-slate-100 mb-4">Estadísticas en tiempo real</h4>
              <p class="text-slate-400 text-sm font-bold uppercase tracking-tight leading-relaxed">Tabla, goleadores y tarjetas actualizadas al instante tras cada pitazo final.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How it Works -->
      <section class="py-20 md:py-32 overflow-hidden bg-slate-950">
        <div class="max-w-4xl mx-auto px-6">
          <div class="text-center mb-20">
             <h2 class="text-indigo-500 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 italic">El Proceso</h2>
             <h3 class="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-50 leading-none">DIFUNDE TU PASIÓN EN <span class="opacity-40">3 PASOS</span></h3>
          </div>

          <div class="space-y-12 relative">
            <div class="absolute top-0 bottom-0 left-[27px] w-px bg-indigo-500/10 hidden md:block"></div>
            
            ${[
              { step: 1, title: 'Registrate gratis en 2 minutos', desc: 'Solo necesitas tu DNI o correo para empezar.' },
              { step: 2, title: 'Agrega tus equipos y genera el fixture', desc: 'Personaliza los grupos y horarios de cada fecha.' },
              { step: 3, title: 'Comparte el link por WhatsApp', desc: 'Obtén tu web pública y deja que los jugadores sigan el torneo.' }
            ].map(i => `
              <div class="flex gap-8 relative items-start group">
                <div class="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl font-black italic shrink-0 transition-transform group-hover:scale-110 shadow-lg shadow-indigo-600/20">${i.step}</div>
                <div class="pt-2">
                  <h4 class="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-slate-100 mb-2">${i.title}</h4>
                  <p class="text-slate-500 font-bold uppercase tracking-widest text-xs">${i.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="py-20 md:py-32 bg-slate-900 border-y border-white/5">
        <div class="max-w-7xl mx-auto px-6">
           <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              ${[
                { n: 'Carlos M.', city: 'Surco, Lima', t: 'Organizo la liga de mi barrio desde hace 3 años. Antes usaba Excel, ahora todo está en Fútbol App.' },
                { n: 'Roberto K.', city: 'Miraflores, Lima', t: 'Manejo 3 torneos empresariales. El plan Pro vale cada sol por el tiempo que me ahorra.' },
                { n: 'Diego T.', city: 'Arequipa', t: 'En Arequipa usamos la app para el torneo inter-barrial. Los jugadores ven la tabla desde su celular.' }
              ].map(test => `
                <div class="p-8 bg-slate-800/30 border border-white/5 rounded-3xl">
                   <p class="text-slate-300 italic mb-6 font-medium leading-relaxed">"${test.t}"</p>
                   <div class="flex items-center gap-3">
                      <div class="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-black italic text-indigo-400 text-xs">${test.n[0]}</div>
                      <div>
                         <p class="text-sm font-black italic uppercase tracking-widest text-slate-100">${test.n}</p>
                         <p class="text-[9px] font-bold uppercase tracking-widest text-indigo-500">${test.city}</p>
                      </div>
                   </div>
                </div>
              `).join('')}
           </div>
        </div>
      </section>

      <!-- Pricing -->
      <section id="pricing" class="py-20 md:py-32 bg-slate-900">
        <div class="max-w-6xl mx-auto px-6 text-center">
          <h2 class="text-green-400 font-bold uppercase tracking-[0.4em] text-[10px] mb-4 italic">Precios Limpios</h2>
          <h3 class="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-50 mb-12">PLANES PARA CADA <span class="opacity-40">NIVEL</span></h3>

          <!-- Toggle -->
          <div class="flex items-center justify-center gap-4 mb-16">
            <span id="label-monthly" class="text-[10px] font-bold uppercase tracking-widest text-slate-300">Mensual</span>
            <button id="billing-toggle" class="w-14 h-7 bg-slate-800 rounded-full relative p-1 transition-colors border border-white/10 group">
                <div id="toggle-knob" class="w-5 h-5 bg-indigo-500 rounded-full transition-transform"></div>
            </button>
            <span id="label-yearly" class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Anual <span class="text-green-400 opacity-100 ml-1">(-20%)</span></span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <!-- Free -->
            <div class="p-10 bg-slate-800/50 border border-white/5 rounded-[2.5rem] flex flex-col items-center">
              <h4 class="text-lg font-black italic uppercase tracking-widest text-slate-400 mb-2">Gratuito</h4>
              <div class="flex items-end gap-1 mb-8">
                 <span class="text-4xl font-black italic">S/. 0</span>
              </div>
              <ul class="text-left space-y-4 mb-10 w-full flex-1">
                 <li class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300"><span class="text-green-400">✓</span> 1 Torneo activo</li>
                 <li class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300"><span class="text-green-400">✓</span> Hasta 8 equipos</li>
                 <li class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300"><span class="text-green-400">✓</span> Fixture automático</li>
                 <li class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500"><span class="text-slate-600">✗</span> Stats de jugadores</li>
              </ul>
              <button onclick="window.navigate('auth')" class="w-full py-4 bg-slate-700 text-white rounded-2xl font-black italic uppercase tracking-widest text-xs active:scale-95 transition-all">Empezar gratis</button>
            </div>

            <!-- Pro -->
            <div class="p-10 bg-slate-800 border-2 border-indigo-500 rounded-[2.5rem] flex flex-col items-center relative shadow-2xl shadow-indigo-600/10">
              <div class="absolute -top-4 right-1/2 translate-x-1/2 bg-indigo-500 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] italic">Recomendado</div>
              <h4 class="text-lg font-black italic uppercase tracking-widest text-indigo-400 mb-2">Plan Pro</h4>
              <div class="flex items-end gap-1 mb-1">
                 <span id="price-pro" class="text-5xl font-black italic">S/. 29</span>
                 <span id="price-pro-period" class="text-[10px] font-bold uppercase text-slate-400 mb-2">/mes</span>
              </div>
              <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-8 italic">"Menos de un café al día"</p>
              <ul class="text-left space-y-4 mb-10 w-full flex-1">
                 <li class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300"><span class="text-green-400">✓</span> Torneos ilimitados</li>
                 <li class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300"><span class="text-green-400">✓</span> Equipos ilimitados</li>
                 <li class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300"><span class="text-green-400">✓</span> Stats completas PRO</li>
                 <li class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300"><span class="text-green-400">✓</span> Soporte WhatsApp</li>
              </ul>
              <button onclick="window.navigate('auth')" class="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black italic uppercase tracking-widest text-xs active:scale-95 transition-all shadow-xl shadow-indigo-600/20 mb-4">Comenzar 14 días gratis</button>
              <p class="text-[8px] font-bold text-slate-600 uppercase tracking-widest">Sin tarjeta de crédito · Cancela cuando quieras</p>
            </div>

            <!-- Club -->
            <div class="p-10 bg-slate-800/50 border border-white/5 rounded-[2.5rem] flex flex-col items-center">
              <h4 class="text-lg font-black italic uppercase tracking-widest text-cyan-400 mb-2">Plan Club</h4>
              <div class="flex items-end gap-1 mb-8">
                 <span class="text-4xl font-black italic">S/. 149</span>
                 <span class="text-[10px] font-bold uppercase text-slate-400 mb-2">/mes</span>
              </div>
              <ul class="text-left space-y-4 mb-10 w-full flex-1">
                 <li class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300"><span class="text-green-400">✓</span> Modo Federación</li>
                 <li class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300"><span class="text-green-400">✓</span> Multi-Administrador</li>
                 <li class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300"><span class="text-green-400">✓</span> Logo personalizado</li>
                 <li class="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-300"><span class="text-green-400">✓</span> Reportes PDF Export</li>
              </ul>
              <button onclick="window.open('https://wa.me/51972498691')" class="w-full py-4 bg-slate-900 border border-slate-700 text-white rounded-2xl font-black italic uppercase tracking-widest text-xs active:scale-95 transition-all">Contactar por WhatsApp</button>
            </div>
          </div>

          <!-- Payment Methods -->
          <div class="mt-16 pt-10 border-t border-white/5">
             <p class="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-6">Aceptamos todos los medios de pago locales</p>
             <div class="flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale contrast-125">
                <span class="text-xs font-black italic">Yape</span>
                <span class="text-xs font-black italic">Plin</span>
                <span class="text-xs font-black italic">BCP</span>
                <span class="text-xs font-black italic">VISA</span>
                <span class="text-xs font-black italic">MASTERCARD</span>
             </div>
             <p class="mt-8 text-[8px] font-bold text-slate-600 uppercase tracking-widest leading-loose">Precios en Soles peruanos (PEN) · IGV incluido · Factura disponible</p>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="py-20 md:py-32 bg-slate-950">
        <div class="max-w-3xl mx-auto px-6">
           <h3 class="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-50 mb-12 text-center">PREGUNTAS <span class="opacity-30">FRECUENTES</span></h3>
           <div class="space-y-4">
              ${[
                { q: '¿Puedo cancelar mi plan en cualquier momento?', a: 'Sí, no hay contratos forzosos. Puedes bajar a plan gratuito o cancelar tu suscripción desde tu panel en un solo clic.' },
                { q: '¿Cómo pago con Yape o Plin?', a: 'Al elegir el plan Pro, selecciona "Pago local Perú". Te daremos un código QR y solo envías el screenshot para activar tu cuenta al instante.' },
                { q: '¿Cuántos equipos puedo tener en el plan gratuito?', a: 'El plan gratuito permite hasta 8 equipos por torneo. Si tu liga es más grande, el plan Pro permite equipos ilimitados.' },
                { q: '¿Los jugadores necesitan crear una cuenta?', a: 'No. El organizador gestiona todo. Los jugadores solo entran al link público del torneo para ver sus tablas y resultados.' },
                { q: '¿Funciona bien en celulares Android?', a: 'Absolutamente. Fútbol App está diseñada bajo el principio "mobile-first". Funciona rápido incluso con conexiones 4G variables.' }
              ].map((faq, i) => `
                <div class="accordion-item bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                   <button class="accordion-trigger w-full p-6 text-left flex justify-between items-center outline-none">
                      <span class="text-sm font-black italic uppercase tracking-widest text-slate-200">${faq.q}</span>
                      <svg class="w-5 h-5 text-indigo-500 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                   </button>
                   <div class="accordion-content hidden p-6 pt-0 border-t border-white/5">
                      <p class="text-sm text-slate-400 font-medium leading-relaxed">${faq.a}</p>
                   </div>
                </div>
              `).join('')}
           </div>
        </div>
      </section>

      <!-- CTA Final -->
      <section class="py-16 md:py-32 bg-indigo-600 relative overflow-hidden">
        <div class="absolute inset-0 bg-slate-950 opacity-20"></div>
        <div class="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 class="text-4xl md:text-7xl font-black italic uppercase tracking-tight text-white mb-10 leading-[0.9]">TU PRÓXIMO CAMPEONATO <br/> EMPIEZA HOY</h3>
          <p class="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-12">Únete a cientos de organizadores en todo el Perú</p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onclick="window.navigate('auth')" class="w-full sm:w-auto bg-white text-indigo-600 min-h-[64px] px-12 py-5 text-lg font-black italic uppercase tracking-tighter rounded-3xl shadow-2xl active:scale-95 transition-all">
              Crear mi torneo gratis
            </button>
            <button onclick="window.open('https://wa.me/51972498691')" class="w-full sm:w-auto bg-green-500 text-white min-h-[64px] px-8 py-5 text-lg font-black italic uppercase tracking-tighter rounded-3xl active:scale-95 transition-all flex items-center justify-center gap-3">
               <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.616.96 3.016 1.44 4.796 1.441 5.438 0 9.861-4.423 9.863-9.864.001-2.63-1.023-5.102-2.883-6.964-1.859-1.859-4.331-2.88-6.964-2.881-5.438 0-9.863 4.423-9.863 9.864 0 2.112.569 3.08 1.484 4.665l-1.003 3.666 3.766-.987zm11.367-7.632c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.174.2-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.871 1.213 3.07c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
               Soporte WhatsApp
            </button>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="py-16 border-t border-white/5 bg-slate-950">
        <div class="max-w-7xl mx-auto px-6 text-center">
           <div class="flex items-center justify-center gap-2 mb-8">
              <div class="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <span class="font-black italic text-xl uppercase tracking-tighter text-slate-100">Fútbol App</span>
           </div>
           
           <div class="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-12">
              <a href="#" class="hover:text-slate-100 transition-colors">Términos</a>
              <a href="#" class="hover:text-slate-100 transition-colors">Privacidad</a>
              <a href="#" class="hover:text-slate-100 transition-colors">Contacto</a>
           </div>

           <div class="h-px w-20 bg-slate-800 mx-auto mb-8"></div>

           <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
             Hecho en Perú 🇵🇪 · Fútbol App 2026
           </p>
        </div>
      </footer>

      <!-- WhatsApp Floating Button -->
      <a href="https://wa.me/51972498691?text=Hola,%20quiero%20saber%20más%20sobre%20Fútbol%20App" 
         target="_blank"
         class="fixed bottom-6 right-6 z-[200] w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-95 transition-all group"
         aria-label="Soporte WhatsApp">
         <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.417z"/></svg>
         
         <!-- Tooltip -->
         <div class="absolute right-full mr-4 bg-slate-950 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest invisible group-hover:visible transition-all whitespace-nowrap border border-white/5 shadow-2xl">
            ¿Necesitas ayuda?
         </div>
      </a>

    </div>
  `

  // --- Lógica de Componentes ---

  // 1. Mobile Menu
  const toggleBtn = container.querySelector('#menu-toggle')
  const closeBtn = container.querySelector('#menu-close')
  const mobileMenu = container.querySelector('#mobile-menu')
  const mobileLinks = container.querySelectorAll('.mobile-link')

  const openMenu = () => {
    mobileMenu.classList.remove('hidden')
    setTimeout(() => mobileMenu.classList.remove('translate-y-[-100%]'), 10)
  }
  const closeMenu = () => {
    mobileMenu.classList.add('translate-y-[-100%]')
    setTimeout(() => mobileMenu.classList.add('hidden'), 300)
  }

  toggleBtn.addEventListener('click', openMenu)
  closeBtn.addEventListener('click', closeMenu)
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu))

  // 2. Pricing Toggle
  const billingBtn = container.querySelector('#billing-toggle')
  const toggleKnob = container.querySelector('#toggle-knob')
  const labelMonthly = container.querySelector('#label-monthly')
  const labelYearly = container.querySelector('#label-yearly')
  const pricePro = container.querySelector('#price-pro')
  const priceProPeriod = container.querySelector('#price-pro-period')

  let isYearly = false

  billingBtn.addEventListener('click', () => {
    isYearly = !isYearly
    toggleKnob.style.transform = isYearly ? 'translateX(28px)' : 'translateX(0)'
    labelYearly.classList.toggle('text-slate-300', isYearly)
    labelYearly.classList.toggle('text-slate-500', !isYearly)
    labelMonthly.classList.toggle('text-slate-500', isYearly)
    labelMonthly.classList.toggle('text-slate-300', !isYearly)
    
    if (isYearly) {
        pricePro.innerText = 'S/. 24' // 290/12 aprox
        priceProPeriod.innerText = '/mes facturado anual'
    } else {
        pricePro.innerText = 'S/. 29'
        priceProPeriod.innerText = '/mes'
    }
  })

  // 3. Accordion
  const triggers = container.querySelectorAll('.accordion-trigger')
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling
      const icon = trigger.querySelector('svg')
      const isOpen = !content.classList.contains('hidden')
      
      // Cerrar otros
      container.querySelectorAll('.accordion-content').forEach(c => c.classList.add('hidden'))
      container.querySelectorAll('.accordion-trigger svg').forEach(i => i.style.transform = 'rotate(0deg)')

      if (!isOpen) {
        content.classList.remove('hidden')
        icon.style.transform = 'rotate(180deg)'
      }
    })
  })

  // 4. Scroll Tracking
  const navbar = container.querySelector('#navbar')
  window.onscroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('bg-slate-950/95', 'border-white/5', 'shadow-2xl')
      navbar.classList.remove('bg-slate-900/80')
    } else {
      navbar.classList.remove('bg-slate-950/95', 'border-white/5', 'shadow-2xl')
      navbar.classList.add('bg-slate-900/80')
    }
  }
}
