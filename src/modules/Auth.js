import { supabase } from '../services/supabase.js'

export const renderAuth = (container) => {
  container.innerHTML = `
    <div class="min-h-screen flex flex-col bg-slate-950 relative overflow-hidden text-white">
      <!-- Glow decoration -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div class="flex-grow flex items-center justify-center p-6 relative z-10">
        <div class="w-full max-w-md animate-fade-in">
          <div class="flex flex-col items-center mb-10">
            <div class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-indigo-600/40 cursor-pointer hover:scale-110 transition-transform" onclick="navigate('landing')">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h1 class="text-3xl md:text-5xl font-[1000] text-white italic uppercase tracking-[-0.05em] leading-none text-center">Fútbol App</h1>
            <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4 opacity-60">Professional Management Console</p>
          </div>

          <div class="card !p-8 md:!p-10 border-white/5 bg-slate-900/50 backdrop-blur-3xl shadow-2xl">
            <div id="authContent">
              <!-- Dynamically rendered -->
            </div>

            <div id="authFooter" class="mt-8 text-center">
               <!-- Toggle links -->
            </div>
          </div>
          
          <button onclick="navigate('landing')" class="mt-8 mx-auto flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  `

  const content = document.getElementById('authContent')
  const footer = document.getElementById('authFooter')

  const toggleMode = (isRegister = false) => {
    if (isRegister) {
      content.innerHTML = `
        <h2 class="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">Crear Cuenta</h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Empieza a gestionar tu liga hoy</p>
        
        <form id="registerForm" class="space-y-6">
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">1. Correo Institucional</label>
            <input type="email" id="email" required class="form-input" placeholder="ejemplo@email.com">
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">2. Clave Maestra</label>
            <input type="password" id="password" required class="form-input" placeholder="••••••••">
          </div>
          <p class="text-[9px] text-slate-500 italic">Al registrarte, aceptas nuestros términos de servicio y políticas de privacidad.</p>
          <button type="submit" id="btnAuthSubmit" class="btn-primary w-full h-14 !text-[11px]">Crear Mi Cuenta Ahora ➔</button>
        </form>
      `
      footer.innerHTML = `
        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">
            ¿Ya tienes cuenta? <button id="btnToggleAuth" class="text-indigo-400 hover:text-indigo-300 transition-colors ml-1">Inicia Sesión</button>
        </p>
      `
      document.getElementById('registerForm').onsubmit = handleRegister
    } else {
      content.innerHTML = `
        <h2 class="text-2xl font-black italic uppercase tracking-tighter text-white mb-2">Bienvenido</h2>
        <p class="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Ingresa a tu panel de administración</p>
        
        <form id="loginForm" class="space-y-6">
          <div>
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Correo Electrónico</label>
            <input type="email" name="email" id="email" required class="form-input" placeholder="ejemplo@email.com">
          </div>
          <div>
            <div class="flex justify-between items-center mb-3">
                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Clave de Acceso</label>
                <button type="button" class="text-[9px] font-black text-indigo-400 hover:text-white uppercase tracking-widest transition-colors">¿Olvidaste la clave?</button>
            </div>
            <input type="password" name="password" id="password" required class="form-input" placeholder="••••••••">
          </div>
          <button type="submit" id="btnAuthSubmit" class="btn-primary w-full h-14 !text-[11px]">Entrar al Sistema ➔</button>
        </form>
      `
      footer.innerHTML = `
        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">
            ¿Eres nuevo? <button id="btnToggleAuth" class="text-indigo-400 hover:text-indigo-300 transition-colors ml-1">Crea tu cuenta</button>
        </p>
      `
      document.getElementById('loginForm').onsubmit = handleLogin
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const btn = document.getElementById('btnAuthSubmit')
    const email = e.target.email.value.trim()
    const password = e.target.password.value.trim()
    
    if(!email || !password) return alert('Completa todos los campos')

    btn.disabled = true
    btn.innerHTML = '<span class="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2 inline-block"></span> Entrando...'

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
        alert("Error: " + error.message)
        btn.disabled = false
        btn.innerText = 'Entrar al Panel'
    } else {
        window.navigate('dashboard')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const btn = document.getElementById('btnAuthSubmit')
    const email = e.target.email.value.trim()
    const password = e.target.password.value.trim()

    if(!email || !password || password.length < 6) {
        return alert('El correo es obligatorio y la clave debe tener al menos 6 caracteres.')
    }

    btn.disabled = true
    btn.innerHTML = '<span class="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2 inline-block"></span> Registrando...'

    const { data, error } = await supabase.auth.signUp({ email, password })
    
    if (error) {
        alert("Error: " + error.message)
        btn.disabled = false
        btn.innerText = 'Registrarme Ahora'
    } else {
        if (data?.session) {
            window.navigate('dashboard')
        } else {
            alert('¡Registro solicitado! Revisa tu correo (o SPAM) para confirmar tu cuenta.')
            btn.disabled = false
            btn.innerText = 'Registrarme Ahora'
        }
    }
  }

  toggleMode(false)
  
  footer.addEventListener('click', (e) => {
      if(e.target.id === 'btnToggleAuth') {
          const isRegistering = footer.innerHTML.includes('Inicia Sesión')
          toggleMode(!isRegistering)
      }
  })
}
