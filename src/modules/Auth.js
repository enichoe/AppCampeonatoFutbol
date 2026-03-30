import { supabase } from '../services/supabase.js'

export const renderAuth = (container) => {
  container.innerHTML = `
    <div class="flex-grow flex items-center justify-center p-6 bg-slate-900 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-indigo-950/20">
      <div class="card w-full max-w-md fade-in">
        <div class="flex flex-col items-center mb-10">
          <div class="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-indigo-600/30">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Liga Pro SaaS</h1>
          <p class="text-slate-500 text-sm mt-2">Gestiona tus torneos como un profesional</p>
        </div>

        <div id="authContent">
          <!-- Renderizado dinámico entre Login y Registro -->
        </div>

        <div id="authFooter" class="mt-8 text-center text-sm text-slate-500">
           <!-- Links de cambio de modo -->
        </div>
      </div>
    </div>
  `

  const content = document.getElementById('authContent')
  const footer = document.getElementById('authFooter')

  const toggleMode = (isRegister = false) => {
    if (isRegister) {
      content.innerHTML = `
        <form id="registerForm" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
            <input type="email" id="email" required class="form-input" placeholder="ejemplo@email.com">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Contraseña</label>
            <input type="password" id="password" required class="form-input" placeholder="••••••••">
          </div>
          <button type="submit" class="btn-primary w-full h-12 text-lg mt-4">Registrar Cuenta</button>
        </form>
      `
      footer.innerHTML = `
        ¿Ya tienes cuenta? <button id="btnToggleAuth" class="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">Inicia sesión aquí</button>
      `
      document.getElementById('registerForm').onsubmit = handleRegister
    } else {
      content.innerHTML = `
        <form id="loginForm" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
            <input type="email" name="email" id="email" required class="form-input" placeholder="ejemplo@email.com">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-right">
                <button type="button" class="text-indigo-400 hover:underline">¿Olvidaste tu contraseña?</button>
            </label>
            <input type="password" name="password" id="password" required class="form-input" placeholder="••••••••">
          </div>
          <button type="submit" class="btn-primary w-full h-12 text-lg mt-4">Ingresar al Dashboard</button>
        </form>
      `
      footer.innerHTML = `
        ¿Eres nuevo? <button id="btnToggleAuth" class="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">Crea tu cuenta gratis</button>
      `
      document.getElementById('loginForm').onsubmit = handleLogin
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const email = e.target.email.value.trim()
    const password = e.target.password.value.trim()
    
    if(!email || !password) return alert('Completa todos los campos')

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert(`Error: ${error.message}`)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const email = e.target.email.value.trim()
    const password = e.target.password.value.trim()

    if(!email || !password || password.length < 6) {
        return alert('El correo es obligatorio y la clave debe tener al menos 6 caracteres.')
    }

    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(`Error: ${error.message}`)
    else alert('¡Registro solicitado! Revisa tu correo (o la carpeta de SPAM) para confirmar.')
  }

  toggleMode(false) // Iniciar con Login
  
  // Delegación de eventos para el botón de toggle
  footer.addEventListener('click', (e) => {
      if(e.target.id === 'btnToggleAuth') {
          const isRegistering = footer.innerHTML.includes('tiens cuenta')
          toggleMode(!isRegistering)
      }
  })
}
