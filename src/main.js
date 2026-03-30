import { supabase, getCurrentUser } from './services/supabase.js'
import { renderAuth } from './modules/Auth.js'
import { renderDashboard } from './modules/Dashboard.js'

const appContainer = document.getElementById('app')
const loader = document.getElementById('loader')

// Estado Global
export const state = {
  user: null,
  currentView: 'home', // 'auth', 'dashboard', 'torneos', 'equipos', etc.
  params: null
}

// Router Simple
export const navigate = async (view, params = null) => {
  state.currentView = view
  state.params = params
  
  appContainer.innerHTML = ''
  
  console.log(`Navegando a: ${view}`)

  switch (view) {
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
      if (!state.user) { 
        navigate('auth')
        return
      }
      renderDashboard(appContainer, view, params)
      break
    default:
      if (state.user) navigate('dashboard')
      else navigate('auth')
  }
}

// Hacerlo disponible para los módulos sin necesidad de importación circular
window.navigate = navigate

// Inicialización
const init = async () => {
  try {
    // Verificar si hay un slug de torneo en la URL (Vista Pública)
    const urlParams = new URLSearchParams(window.location.search)
    const slug = urlParams.get('t')

    const user = await getCurrentUser()
    state.user = user

    // Escuchar cambios de autenticación
    supabase.auth.onAuthStateChange((event, session) => {
      state.user = session?.user || null
      // Si estamos en vista pública, no forzamos redirección a menos que el usuario lo pida
      if (state.currentView !== 'public_torneo') {
          if (event === 'SIGNED_IN') navigate('dashboard')
          if (event === 'SIGNED_OUT') navigate('auth')
      }
    })

    // Ocultar Loader inicial
    loader.classList.add('hidden')
    
    if (slug) {
      navigate('public_torneo', { slug })
    } else if (state.user) {
      navigate('dashboard')
    } else {
      navigate('auth')
    }
  } catch (error) {
    console.error('Error al inicializar la app:', error)
    if (!new URLSearchParams(window.location.search).get('t')) {
        navigate('auth')
    }
  }
}

init()

