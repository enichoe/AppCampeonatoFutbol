import { supabase, getCurrentUser } from './services/supabase.js'
import { renderAuth } from './modules/Auth.js'
import { renderDashboard } from './modules/Dashboard.js'

const appContainer = document.getElementById('app')
const loader = document.getElementById('loader')

// Estado Global
export const state = {
  user: null,
  currentView: 'landing', // Cambiado de 'home' a 'landing'
  params: null
}

// Router Simple
export const navigate = async (view, params = null, pushState = true) => {
  state.currentView = view
  state.params = params
  
  appContainer.innerHTML = ''
  
  // Manejo de URL limpia para torneos públicos
  if (pushState) {
    if (view === 'public_torneo') {
        const path = `/torneo/${params?.slug || params}`
        if (window.location.pathname !== path) {
            window.history.pushState({ view, params }, '', path)
        }
    } else if (view === 'landing') {
        window.history.pushState({ view, params }, '', '/')
    } else {
        // Para dashboard y otros, mantenemos la lógica simple o resetamos path
        if (window.location.pathname !== '/') {
            window.history.pushState({ view, params }, '', '/')
        }
    }
  }

  switch (view) {
    case 'landing':
      const { renderLanding } = await import('./modules/Landing.js')
      renderLanding(appContainer)
      break
    case 'torneos':
      const { renderPublicExplorer } = await import('./modules/PublicExplorer.js')
      renderPublicExplorer(appContainer)
      if (pushState) window.history.pushState({ view, params }, '', '/torneos')
      break
    case 'auth':
      renderAuth(appContainer)
      break
    case 'public_torneo':
      const { renderPublicTournament } = await import('./modules/PublicTournament.js')
      renderPublicTournament(appContainer, params)
      break
    case 'dashboard':
    case 'torneos':
    case 'equipos':
    case 'partidos':
    case 'jugadores':
    case 'detalle_torneo':
    case 'planes':
      if (!state.user) { 
        navigate('auth')
        return
      }
      renderDashboard(appContainer, view, params)
      break
    default:
      if (state.user) navigate('dashboard')
      else navigate('landing')
  }
}

window.navigate = navigate

// Escuchar navegación del navegador (atrás/adelante)
window.onpopstate = (e) => {
    if (e.state) {
        navigate(e.state.view, e.state.params, false)
    } else {
        location.reload()
    }
}

// Inicialización
const init = async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const oldSlug = urlParams.get('t')
    const path = window.location.pathname

    // REDIRECCIÓN: ?t=slug -> /torneo/slug (SEO)
    if (oldSlug) {
        window.location.href = `/torneo/${oldSlug}`
        return
    }

    const user = await getCurrentUser()
    state.user = user

    supabase.auth.onAuthStateChange((event, session) => {
      state.user = session?.user || null
      if (state.currentView !== 'public_torneo' && state.currentView !== 'landing') {
          if (event === 'SIGNED_IN') navigate('dashboard')
          if (event === 'SIGNED_OUT') navigate('landing')
      }
    })

    if (loader) loader.classList.add('hidden')
    
    // Router basado en Pathname
    if (path.startsWith('/torneo/')) {
        const slug = path.split('/torneo/')[1]
        navigate('public_torneo', { slug })
    } else if (state.user) {
        navigate('dashboard')
    } else {
        navigate('landing')
    }
  } catch (error) {
    console.error('Error al inicializar la app:', error)
    navigate('landing')
  }
}

init()

