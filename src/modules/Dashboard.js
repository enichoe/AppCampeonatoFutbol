import { signOut } from '../services/supabase.js'
import { navigate } from '../main.js'
import { renderTournaments } from './Tournaments.js'
import { renderTeams } from './Teams.js'
import { renderMatches } from './Matches.js'
import { renderTournamentDetail } from './TournamentDetail.js'

export const renderDashboard = (container, view, params) => {
  container.innerHTML = `
    <div class="flex h-screen overflow-hidden bg-slate-950">
      <!-- Sidebar Desktop -->
      <aside class="w-72 bg-slate-900 border-r border-white/5 flex flex-col transition-all duration-300 transform md:translate-x-0 -translate-x-full fixed md:relative z-50 h-full" id="sidebar">
        <div class="p-8 flex items-center gap-4">
          <div class="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div>
            <span class="text-xl font-black text-white tracking-tighter italic block">LIGA APP</span>
            <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest -mt-1 block">Admin Panel</span>
          </div>
          <button id="closeSidebar" class="md:hidden ml-auto p-2 text-slate-500">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <nav class="flex-grow px-6 mt-4 space-y-2 no-scrollbar overflow-y-auto">
          <button id="navDashboard" class="sidebar-item ${view === 'dashboard' ? 'active' : ''}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span>Dashboard</span>
          </button>
          
          <button id="navTournaments" class="sidebar-item ${view === 'torneos' || view === 'detalle_torneo' ? 'active' : ''}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            <span>Torneos</span>
          </button>

          <button id="navTeams" class="sidebar-item ${view === 'equipos' ? 'active' : ''}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <span>Equipos</span>
          </button>

          <button id="navMatches" class="sidebar-item ${view === 'partidos' ? 'active' : ''}">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             <span>Partidos</span>
          </button>

          <div class="pt-8 pb-2 px-4">
             <p class="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Suscripción</p>
          </div>

          <button id="navPlans" class="sidebar-item ${view === 'planes' ? 'active' : ''}">
            <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Mi Plan</span>
          </button>
        </nav>

        <div class="p-6">
          <button id="btnLogout" class="flex items-center gap-4 w-full px-5 py-4 text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all font-bold text-sm tracking-tight border border-transparent hover:border-red-500/10">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <!-- Contenido Principal -->
      <main class="flex-grow overflow-y-auto bg-slate-950 pb-20 md:pb-0 relative">
        <!-- Header Superior -->
        <header class="h-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-between px-6 md:px-10 sticky top-0 z-40">
          <div class="flex items-center gap-4">
            <button id="toggleSidebar" class="md:hidden p-2.5 bg-slate-900 rounded-xl border border-white/5 text-slate-400">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
            <h2 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]" id="currentViewTitle">${view.replace('_', ' ')}</h2>
          </div>
          
          <div class="flex items-center gap-4">
             <div class="hidden md:block text-right">
                <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Administrador</p>
                <p class="text-xs font-bold text-white mt-1">Super User</p>
             </div>
             <div class="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden shadow-lg shadow-indigo-600/20">
                <img src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff" alt="User">
             </div>
          </div>
        </header>

        <!-- Área de Renderizado -->
        <div id="dashboardContent" class="p-5 md:p-10 fade-in max-w-7xl mx-auto">
           <!-- El contenido dinámico se inyecta aquí -->
        </div>
      </main>

      <!-- Bottom Navigation Mobile -->
      <nav class="bottom-nav">
          <button id="bottomDashboard" class="bottom-nav-item ${view === 'dashboard' ? 'active' : ''}">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <span>Inicio</span>
          </button>
          <button id="bottomTournaments" class="bottom-nav-item ${view === 'torneos' || view === 'detalle_torneo' ? 'active' : ''}">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              <span>Torneos</span>
          </button>
          <button id="bottomTeams" class="bottom-nav-item ${view === 'equipos' ? 'active' : ''}">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              <span>Equipos</span>
          </button>
          <button id="bottomMatches" class="bottom-nav-item ${view === 'partidos' ? 'active' : ''}">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span>Partidos</span>
          </button>
      </nav>
    </div>

    <!-- Estilos específicos de la sidebar -->
    <style>
      .sidebar-item {
        @apply flex items-center gap-4 w-full px-5 py-4 text-slate-500 hover:bg-white/5 hover:text-white rounded-[1.25rem] transition-all font-bold text-sm tracking-tight border border-transparent;
      }
      .sidebar-item.active {
        @apply bg-indigo-600/10 text-indigo-400 border-indigo-500/20;
      }
    </style>
  `

  // Manejadores de navegación
  const bindNav = (ids, target) => {
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) el.onclick = () => navigate(target)
    })
  }

  bindNav(['navDashboard', 'bottomDashboard'], 'dashboard')
  bindNav(['navTournaments', 'bottomTournaments'], 'torneos')
  bindNav(['navTeams', 'bottomTeams'], 'equipos')
  bindNav(['navMatches', 'bottomMatches'], 'partidos')
  bindNav(['navPlans'], 'planes')
  
  document.getElementById('btnLogout').onclick = () => signOut()

  // Sidebar Toggle logic
  const sidebar = document.getElementById('sidebar')
  const toggleBtn = document.getElementById('toggleSidebar')
  const closeBtn = document.getElementById('closeSidebar')

  if (toggleBtn) {
    toggleBtn.onclick = () => sidebar.classList.remove('-translate-x-full')
  }
  if (closeBtn) {
    closeBtn.onclick = () => sidebar.classList.add('-translate-x-full')
  }

  const dashboardContent = document.getElementById('dashboardContent')

  // Renderizado Inteligente
  switch (view) {
    case 'dashboard':
      renderSummary(dashboardContent)
      break
    case 'torneos':
      renderTournaments(dashboardContent)
      break
    case 'equipos':
      renderTeams(dashboardContent)
      break
    case 'partidos':
      renderMatches(dashboardContent)
      break
    case 'planes':
      renderPlans(dashboardContent)
      break
    case 'detalle_torneo':
      renderTournamentDetail(dashboardContent, params)
      break
    default:
      dashboardContent.innerHTML = `<h2 class="text-3xl font-bold">Próximamente: ${view}</h2>`
  }
}

const renderPlans = (container) => {
  container.innerHTML = `
    <div class="max-w-5xl mx-auto py-10 fade-in">
        <div class="text-center mb-16">
            <h2 class="text-4xl font-black text-white mb-4 italic tracking-tighter uppercase">Escala tu Liga al Siguiente Nivel</h2>
            <p class="text-slate-400">Elige el plan que mejor se adapte a tu organización deportiva.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Plan Amateur -->
            <div class="card border-slate-700 flex flex-col items-center">
                <span class="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Plan Amateur</span>
                <h3 class="text-4xl font-black mb-6">Gratis</h3>
                <ul class="space-y-4 text-sm text-slate-400 w-full mb-10">
                    <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg> Hasta 1 Torneo Activo</li>
                    <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg> 16 Equipos Máx</li>
                    <li class="flex items-center gap-2 text-slate-600 italic"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg> Sin Branding</li>
                </ul>
                <button class="btn-secondary w-full py-3">Tu plan actual</button>
            </div>

            <!-- Plan Pro -->
            <div class="card border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5 flex flex-col items-center relative scale-105">
                <div class="absolute -top-4 bg-indigo-500 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-tighter">Más popular</div>
                <span class="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-4">Plan Profesional</span>
                <h3 class="text-4xl font-black mb-2">$19<span class="text-base text-slate-500">/mes</span></h3>
                <p class="text-xs text-slate-500 mb-6 font-bold uppercase">Torneos Ilimitados</p>
                <ul class="space-y-4 text-sm text-slate-300 w-full mb-10">
                    <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg> Branding Personalizado</li>
                    <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg> Gestión de Árbitros/Sedes</li>
                    <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg> Estadísticas de Jugadores</li>
                    <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg> Soporte Prioritario WhatsApp</li>
                </ul>
                <button class="btn-primary w-full py-4 text-xs font-black">ADQUIRIR PLAN PRO</button>
            </div>

            <!-- Plan Enterprise -->
            <div class="card border-slate-700 flex flex-col items-center">
                <span class="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-4">Plan Centros</span>
                <h3 class="text-4xl font-black mb-6">$49<span class="text-base text-slate-500">/mes</span></h3>
                <ul class="space-y-4 text-sm text-slate-400 w-full mb-10">
                    <li class="flex items-center gap-2 font-bold text-white italic tracking-tighter underline decoration-indigo-500">Multitenant Staff Access</li>
                    <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg> App Móvil (White Label)</li>
                    <li class="flex items-center gap-2"><svg class="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg> Pagos Online de Inscripciones</li>
                </ul>
                <button class="btn-secondary w-full py-3">Hablar con Ventas</button>
            </div>
        </div>
    </div>
  `
}

const renderSummary = (container) => {
  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div class="card bg-gradient-to-br from-indigo-600/20 to-transparent">
        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Torneos Activos</p>
        <h3 class="text-4xl font-black mt-2 italic">12</h3>
      </div>
      <div class="card bg-gradient-to-br from-emerald-600/20 to-transparent">
        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Equipos Inscritos</p>
        <h3 class="text-4xl font-black mt-2 italic">48</h3>
      </div>
      <div class="card bg-gradient-to-br from-amber-600/20 to-transparent">
        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Partidos de Hoy</p>
        <h3 class="text-4xl font-black mt-2 italic">5</h3>
      </div>
      <div class="card bg-gradient-to-br from-pink-600/20 to-transparent">
        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Jugadores Totales</p>
        <h3 class="text-4xl font-black mt-2 italic">840</h3>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
       <div class="lg:col-span-2 card border-slate-800">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
            <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            Partidos en Vivo
          </h3>
          <div class="space-y-4">
             <div class="flex items-center justify-between p-4 bg-slate-900 rounded-2xl border border-slate-800">
                <div class="flex-1 text-right font-black text-sm">Arsenal FC</div>
                <div class="px-6 flex items-center gap-4">
                   <span class="text-3xl font-black text-white">2</span>
                   <span class="text-slate-700 font-bold">-</span>
                   <span class="text-3xl font-black text-white">1</span>
                </div>
                <div class="flex-1 text-left font-black text-sm">Manchester City</div>
             </div>
          </div>
       </div>

       <div class="card border-slate-800">
          <h3 class="text-xl font-bold mb-6">Actividad Reciente</h3>
          <ul class="space-y-4">
             <li class="flex items-center gap-4">
                <div class="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                </div>
                <div>
                  <p class="text-sm font-bold">Nuevo torneo creado</p>
                  <p class="text-[10px] text-slate-500 uppercase font-black">Copa Verano 2026</p>
                </div>
             </li>
          </ul>
       </div>
    </div>
  `
}
