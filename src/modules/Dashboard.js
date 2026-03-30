import { signOut } from '../services/supabase.js'
import { navigate } from '../main.js'
import { renderTournaments } from './Tournaments.js'
import { renderTeams } from './Teams.js'
import { renderMatches } from './Matches.js'
import { renderTournamentDetail } from './TournamentDetail.js'

export const renderDashboard = (container, view, params) => {
  container.innerHTML = `
    <div class="flex h-screen overflow-hidden bg-slate-900">
      <!-- Sidebar -->
      <aside class="w-64 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 transform md:translate-x-0 -translate-x-full fixed md:relative z-40 h-full" id="sidebar">
        <div class="p-6 flex items-center gap-3">
          <div class="p-2 bg-indigo-600 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <span class="text-xl font-bold text-white tracking-tight italic">Liga Pro SaaS</span>
        </div>

        <nav class="flex-grow px-4 mt-6 space-y-1">
          <button id="navDashboard" class="sidebar-item ${view === 'dashboard' ? 'active' : ''}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span>Dashboard</span>
          </button>
          
          <button id="navTournaments" class="sidebar-item ${view === 'torneos' ? 'active' : ''}">
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

          <div class="pt-4 pb-2 px-4">
             <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Negocio</p>
          </div>

          <button id="navPlans" class="sidebar-item ${view === 'planes' ? 'active' : ''}">
            <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Suscripción</span>
          </button>
        </nav>

        <div class="p-4 border-t border-slate-700">
          <button id="btnLogout" class="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all font-medium text-sm">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <!-- Contenido Principal -->
      <main class="flex-grow overflow-y-auto bg-slate-900">
        <!-- Header Superior -->
        <header class="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
          <h2 class="text-xs font-black text-slate-400 uppercase tracking-widest" id="currentViewTitle">${view.replace('_', ' ')}</h2>
          <div class="flex items-center gap-4">
             <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff" alt="User">
             </div>
          </div>
        </header>

        <!-- Área de Renderizado de Módulos -->
        <div id="dashboardContent" class="p-8 fade-in">
           <!-- El contenido dinámico de cada sección se inyecta aquí -->
        </div>
      </main>
    </div>

    <!-- Estilos específicos de la sidebar -->
    <style>
      .sidebar-item {
        @apply flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-slate-700/50 hover:text-white rounded-xl transition-all font-medium text-sm;
      }
      .sidebar-item.active {
        @apply bg-indigo-600/10 text-indigo-400;
      }
    </style>
  `

  // Manejadores de navegación interna
  document.getElementById('navDashboard').onclick = () => navigate('dashboard')
  document.getElementById('navTournaments').onclick = () => navigate('torneos')
  document.getElementById('navTeams').onclick = () => navigate('equipos')
  document.getElementById('navMatches').onclick = () => navigate('partidos')
  document.getElementById('navPlans').onclick = () => navigate('planes')
  document.getElementById('btnLogout').onclick = () => signOut()

  const dashboardContent = document.getElementById('dashboardContent')

  // Renderizado Inteligente por Sub-módulo
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
