import { supabase } from '../services/supabase.js'

let _actualizandoLocalmente = false

/**
 * Muestra una notificación toast elegante
 */
export function mostrarToast(mensaje, tipo = 'info') {
  const toast = document.createElement('div')
  toast.className = `fixed bottom-6 right-6 px-6 py-4 rounded-2xl text-white font-bold shadow-2xl z-[2000] border border-white/10 flex items-center gap-3 animate-fade-in transition-all duration-500`
  
  const bgColors = {
    success: 'bg-emerald-600',
    error: 'bg-rose-600',
    info: 'bg-indigo-600'
  }
  
  toast.classList.add(bgColors[tipo] || bgColors.info)
  
  const icon = tipo === 'success' ? '✓' : tipo === 'error' ? '✕' : 'ℹ'
  
  toast.innerHTML = `
    <span class="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-xs">${icon}</span>
    <span class="text-sm tracking-tight">${mensaje}</span>
  `
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transform = 'translateY(10px) scale(0.95)'
    setTimeout(() => toast.remove(), 500)
  }, 3000)
}

// Global expose
window.mostrarToast = mostrarToast

/**
 * Actualiza quirúrgicamente una card en el DOM (Fix Flicker)
 */
function _patchCardPartido(id, estado, gl, gv) {
  const card = document.querySelector(`[data-partido-id="${id}"]`)
  if (!card) return

  // Marcador
  const elGL = card.querySelector('[data-rol="goles-local"]')
  const elGV = card.querySelector('[data-rol="goles-visitante"]')
  if (elGL) {
      if (elGL.tagName === 'INPUT') elGL.value = gl
      else elGL.textContent = gl
  }
  if (elGV) {
      if (elGV.tagName === 'INPUT') elGV.value = gv
      else elGV.textContent = gv
  }

  // Badge estado
  const badge = card.querySelector('[data-rol="estado-badge"]')
  if (badge) {
    badge.textContent =
      estado === 'finalizado' ? 'Finalizado' :
      estado === 'en_juego'   ? 'En juego'   : 'Pendiente'
    
    // Reset classes and apply based on state
    badge.className = 'text-xs font-medium px-3 py-1 rounded-full'
    if (estado === 'finalizado') badge.classList.add('bg-green-500', 'text-white')
    else if (estado === 'en_juego') badge.classList.add('bg-amber-500', 'text-white', 'animate-pulse')
    else badge.classList.add('bg-slate-600', 'text-slate-300')
  }

  // Botones — ocultar/mostrar según estado
  card.querySelector('[data-rol="btn-iniciar"]')?.classList.toggle('hidden', estado !== 'pendiente')
  card.querySelector('[data-rol="btn-finalizar"]')?.classList.toggle('hidden', estado !== 'en_juego')
  card.querySelector('[data-rol="btn-cancelar"]')?.classList.toggle('hidden', estado !== 'en_juego')
  card.querySelector('[data-rol="btn-corregir"]')?.classList.toggle('hidden', estado !== 'finalizado')

  // Inputs — solo editables en en_juego
  card.querySelectorAll('[data-rol="input-goles"]').forEach(inp => {
    inp.disabled = estado !== 'en_juego'
  })

  // Actualizar data attributes
  card.dataset.estado = estado
  card.dataset.golesLocal = gl
  card.dataset.golesVisitante = gv
}

/**
 * Cambia el estado de un partido en Supabase y actualiza el DOM
 */
async function cambiarEstadoPartido(partidoId, nuevoEstado, gl = 0, gv = 0) {
  _actualizandoLocalmente = true
  const updateData = { estado: nuevoEstado }
  
  if (nuevoEstado === 'finalizado') {
    const golesLocal = parseInt(gl, 10)
    const golesVisitante = parseInt(gv, 10)
    
    if (isNaN(golesLocal) || isNaN(golesVisitante) || golesLocal < 0 || golesVisitante < 0) {
      mostrarToast('Ingresa un resultado válido', 'error')
      _actualizandoLocalmente = false
      return
    }
    updateData.goles_local = golesLocal
    updateData.goles_visitante = golesVisitante
  }
  
  if (nuevoEstado === 'pendiente') {
    updateData.goles_local = 0
    updateData.goles_visitante = 0
  }

  const { error } = await supabase
    .from('partidos')
    .update(updateData)
    .eq('id', partidoId)
  
  if (error) {
    console.error(error)
    mostrarToast('Error al actualizar el partido', 'error')
    _actualizandoLocalmente = false
    return
  }
  
  // Actualización quirúrgica
  _patchCardPartido(partidoId, nuevoEstado, gl, gv)
  
  // Notificar a Standings
  window.dispatchEvent(new CustomEvent('resultado-guardado', {
    detail: { partidoId, estado: nuevoEstado }
  }))
  
  mostrarToast(
    nuevoEstado === 'finalizado' ? '✓ Partido finalizado' :
    nuevoEstado === 'en_juego'   ? '▶ Partido iniciado' : 'Partido actualizado',
    'success'
  )
  
  setTimeout(() => { _actualizandoLocalmente = false }, 1000)
}

// Global functions for buttons
window.iniciarPartido = (id) => cambiarEstadoPartido(id, 'en_juego', 0, 0)

window.finalizarPartido = (id) => {
  const card = document.querySelector(`[data-partido-id="${id}"]`)
  const inputL = card.querySelector('[data-lado="local"]')
  const inputV = card.querySelector('[data-lado="visitante"]')
  const gl = parseInt(inputL?.value ?? '0', 10)
  const gv = parseInt(inputV?.value ?? '0', 10)
  
  cambiarEstadoPartido(id, 'finalizado', gl, gv)
}

window.cancelarPartido = (id) => {
  if (confirm('¿Cancelar partido? Se perderá el marcador actual.')) {
    cambiarEstadoPartido(id, 'pendiente', 0, 0)
  }
}

window.corregirPartido = (id) => {
  const card = document.querySelector(`[data-partido-id="${id}"]`)
  const gl = parseInt(card?.dataset.golesLocal ?? '0', 10)
  const gv = parseInt(card?.dataset.golesVisitante ?? '0', 10)
  cambiarEstadoPartido(id, 'en_juego', gl, gv)
}

function renderCardPartido(m) {
  const esPendiente  = m.estado === 'pendiente'
  const esEnJuego    = m.estado === 'en_juego'
  const esFinalizado = m.estado === 'finalizado'
  const time = m.fecha_hora ? new Date(m.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'
  const venue = m.campo || m.sede || m.escenario || m.venue || 'Sede TBD'

  return `
    <div class="partido-card card !p-6 border border-white/5 bg-slate-900/40 glass-hover transition-all duration-300"
         data-partido-id="${m.id}"
         data-estado="${m.estado}"
         data-goles-local="${m.goles_local ?? 0}"
         data-goles-visitante="${m.goles_visitante ?? 0}">

      <div class="flex items-center justify-between gap-6 mb-6">
        <!-- Local -->
        <div class="flex flex-col items-center gap-3 flex-1 min-w-0">
          <div class="w-16 h-16 bg-slate-950 rounded-2xl p-3 border border-white/5 flex items-center justify-center">
            <img src="${m.local?.escudo_url || 'https://ui-avatars.com/api/?name='+encodeURIComponent(m.local?.nombre || 'Team')}" class="w-full h-full object-contain" loading="lazy">
          </div>
          <span class="text-[10px] font-black text-white uppercase italic tracking-tighter text-center truncate w-full">${m.local?.nombre || 'TBD'}</span>
        </div>

        <!-- Score Central -->
        <div class="flex flex-col items-center justify-center px-2">
          <div class="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-3">${time}</div>
          
          <div class="flex items-center gap-2">
            <input type="number" min="0" max="30"
                   value="${m.goles_local ?? 0}"
                   data-rol="input-goles"
                   data-lado="local"
                   ${!esEnJuego ? 'disabled' : ''}
                   class="w-12 h-12 text-center bg-slate-950 text-white rounded-xl text-xl font-black border border-white/5 disabled:opacity-50">
            <span class="text-xs text-slate-700 font-black italic opacity-50 px-1">-</span>
            <input type="number" min="0" max="30"
                   value="${m.goles_visitante ?? 0}"
                   data-rol="input-goles"
                   data-lado="visitante"
                   ${!esEnJuego ? 'disabled' : ''}
                   class="w-12 h-12 text-center bg-slate-950 text-white rounded-xl text-xl font-black border border-white/5 disabled:opacity-50">
          </div>
        </div>

        <!-- Visitante -->
        <div class="flex flex-col items-center gap-3 flex-1 min-w-0">
          <div class="w-16 h-16 bg-slate-950 rounded-2xl p-3 border border-white/5 flex items-center justify-center">
            <img src="${m.visitante?.escudo_url || 'https://ui-avatars.com/api/?name='+encodeURIComponent(m.visitante?.nombre || 'Team')}" class="w-full h-full object-contain" loading="lazy">
          </div>
          <span class="text-[10px] font-black text-white uppercase italic tracking-tighter text-center truncate w-full">${m.visitante?.nombre || 'TBD'}</span>
        </div>
      </div>

      <!-- Badge Estado -->
      <div class="flex justify-center mb-6">
        <span data-rol="estado-badge"
              class="text-xs font-medium px-3 py-1 rounded-full
                     ${esFinalizado ? 'bg-green-500 text-white' :
                       esEnJuego    ? 'bg-amber-500 text-white animate-pulse' :
                                      'bg-slate-600 text-slate-300'}">
          ${esFinalizado ? 'Finalizado' : esEnJuego ? 'En juego' : 'Pendiente'}
        </span>
      </div>

      <!-- Botones de Acción -->
      <div class="flex flex-col gap-2 pt-4 border-t border-white/5">
        <button data-rol="btn-iniciar"
                onclick="iniciarPartido('${m.id}')"
                class="w-full py-3 text-[10px] font-black uppercase tracking-widest rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all ${!esPendiente ? 'hidden' : ''}">
          ▶ Iniciar partido
        </button>

        <div class="flex gap-2">
          <button data-rol="btn-cancelar"
                  onclick="cancelarPartido('${m.id}')"
                  class="flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-all ${!esEnJuego ? 'hidden' : ''}">
            ✕ Cancelar
          </button>
          <button data-rol="btn-finalizar"
                  onclick="finalizarPartido('${m.id}')"
                  class="flex-[2] py-3 text-[10px] font-black uppercase tracking-widest rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all ${!esEnJuego ? 'hidden' : ''}">
            ✓ Finalizar encuentro
          </button>
        </div>

        <button data-rol="btn-corregir"
                onclick="corregirPartido('${m.id}')"
                class="w-full py-2 text-[9px] font-bold uppercase tracking-widest rounded-xl border border-white/5 text-slate-500 hover:text-white transition-all ${!esFinalizado ? 'hidden' : ''}">
          Corregir resultado
        </button>
      </div>

      <!-- Footer Info -->
      <div class="mt-4 pt-4 flex items-center justify-center gap-3 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
          <div class="flex items-center gap-1"><svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>${venue}</div>
      </div>
    </div>
  `
}

export const renderMatches = async (container) => {
  container.innerHTML = `
    <div class="mb-10 flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-black text-white italic uppercase tracking-tighter">Fixture y Resultados</h2>
        <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Gestión quirúrgica de encuentros en tiempo real</p>
      </div>
    </div>
    <div id="matchesContainer" class="space-y-12">
      <div class="flex items-center justify-center py-20"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500"></div></div>
    </div>
  `

  const listContainer = document.getElementById('matchesContainer')

  const loadMatches = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('partidos')
      .select('*, local:equipo_local_id(nombre, escudo_url), visitante:equipo_visitante_id(nombre, escudo_url), torneos!inner(id, user_id)')
      .eq('torneos.user_id', user.id)
      .order('fase', { ascending: true })
      .order('fecha_hora', { ascending: true })

    if (error) return console.error(error)

    if (!data || data.length === 0) {
      listContainer.innerHTML = '<p class="text-slate-500 text-center py-20 uppercase font-black italic text-[10px] tracking-widest">No se han generado partidos aún.</p>'
      return
    }

    const phases = {}
    data.forEach(m => {
      const phaseKey = (m.fase || 'grupos').toString()
      if (!phases[phaseKey]) phases[phaseKey] = []
      phases[phaseKey].push(m)
    })

    listContainer.innerHTML = Object.entries(phases).map(([phase, matches]) => `
      <div class="mb-12">
        <div class="flex items-center gap-4 mb-8">
          <h4 class="text-xs font-black uppercase text-indigo-500 italic tracking-[0.2em]">${phase === 'grupos' ? 'Fase de Grupos' : phase}</h4>
          <div class="flex-1 h-px bg-white/5"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${matches.map(m => renderCardPartido(m)).join('')}
        </div>
      </div>
    `).join('')

    // Suscripción Realtime (Fix Eco)
    supabase
      .channel('public:partidos')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'partidos' }, payload => {
        if (_actualizandoLocalmente) return
        // Refresco quirúrgico si viene de otro cliente
        const { id, estado, goles_local, goles_visitante } = payload.new
        _patchCardPartido(id, estado, goles_local, goles_visitante)
      })
      .subscribe()
  }

  loadMatches()
}


