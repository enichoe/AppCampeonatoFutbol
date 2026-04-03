import { supabase } from '../services/supabase.js'

let guardandoLocalmente = false

/**
 * Muestra una notificación toast elegante
 */
export function mostrarToast(mensaje, tipo = 'info') {
  const toast = document.createElement('div')
  toast.className = `fixed bottom-6 right-6 px-6 py-4 rounded-2xl text-white font-bold shadow-2xl z-[2000] border border-white/10 flex items-center gap-3 slide-up transition-all duration-500`
  
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

export const renderMatches = async (container) => {
  container.innerHTML = `
    <div class="flex items-center justify-between mb-8 fade-in">
       <div>
         <h2 class="text-3xl font-extrabold text-white">Fixture y Resultados</h2>
         <p class="text-slate-500 mt-1 uppercase text-[10px] font-black italic tracking-widest">Gestiona los estados de cada encuentro en tiempo real.</p>
       </div>
    </div>

    <!-- Lista de Partidos -->
    <div id="matchesContainer" class="space-y-12">
        <div class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 text-indigo-500"></div>
        </div>
    </div>
  `

  const listContainer = document.getElementById('matchesContainer')
  let torneo_id_actual = null

  /**
   * Cambia el estado de un partido en Supabase y actualiza el DOM
   */
  async function cambiarEstadoPartido(partidoId, nuevoEstado, gl = 0, gv = 0) {
    guardandoLocalmente = true
    const updateData = { estado: nuevoEstado }
    
    // Solo guardar goles al finalizar
    if (nuevoEstado === 'finalizado') {
      const golesLocal = parseInt(gl, 10)
      const golesVisitante = parseInt(gv, 10)
      
      if (isNaN(golesLocal) || isNaN(golesVisitante) || golesLocal < 0 || golesVisitante < 0) {
        mostrarToast('Ingresa un resultado válido (0-0 es válido)', 'error')
        guardandoLocalmente = false
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
      guardandoLocalmente = false
      return
    }
    
    // Actualizar DOM sin re-render completo
    actualizarCardPartido(partidoId, nuevoEstado, gl, gv)
    
    // Notificar a Standings solo si se finalizó o se volvió a editar
    if (nuevoEstado === 'finalizado' || nuevoEstado === 'en_juego' || nuevoEstado === 'pendiente') {
      window.dispatchEvent(new CustomEvent('resultado-guardado', {
        detail: { partidoId, torneo_id: torneo_id_actual }
      }))
    }
    
    mostrarToast(
      nuevoEstado === 'finalizado' ? '✓ Partido finalizado' :
      nuevoEstado === 'en_juego'   ? '▶ Partido iniciado' :
      nuevoEstado === 'pendiente'  ? 'Partido reseteado' :
                                      'Estado actualizado',
      'success'
    )
    
    setTimeout(() => { guardandoLocalmente = false }, 1000)
  }

  /**
   * Actualiza quirúrgicamente una card en el DOM
   */
  function actualizarCardPartido(partidoId, estado, gl, gv) {
    const card = document.querySelector(`[data-partido-id="${partidoId}"]`)
    if (!card) return

    // Actualizar data attributes
    card.dataset.estado = estado
    card.dataset.golesLocal = gl
    card.dataset.golesVisitante = gv

    // 1. Actualizar Badge
    const badgeContainer = card.querySelector('.badge-container')
    let badgeHtml = ''
    if (estado === 'pendiente') {
        badgeHtml = `<span class="badge badge-pending scale-90">Pendiente</span>`
    } else if (estado === 'en_juego') {
        badgeHtml = `<span class="badge bg-amber-500/10 text-amber-500 border-amber-500/20 scale-90 animate-pulse flex items-center gap-1.5 ring-1 ring-amber-500/30">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> EN JUEGO
        </span>`
    } else {
        badgeHtml = `<span class="badge bg-emerald-500/10 text-emerald-500 border-emerald-500/20 scale-90">Finalizado</span>`
    }
    badgeContainer.innerHTML = badgeHtml

    // 2. Actualizar Marcador / Inputs
    const marcadorContainer = card.querySelector('.marcador-container')
    if (estado === 'en_juego') {
        marcadorContainer.innerHTML = `
            <div class="flex items-center gap-2">
                <input type="number" min="0" value="${gl}" class="input-local w-14 h-14 bg-slate-950 border-white/5 text-white font-black text-2xl text-center rounded-2xl focus:ring-4 focus:ring-amber-500/20 outline-none transition-all">
                <span class="text-[10px] text-slate-700 font-black italic opacity-50 px-1">VS</span>
                <input type="number" min="0" value="${gv}" class="input-visitante w-14 h-14 bg-slate-950 border-white/5 text-white font-black text-2xl text-center rounded-2xl focus:ring-4 focus:ring-amber-500/20 outline-none transition-all">
            </div>
        `
    } else {
        marcadorContainer.innerHTML = `
            <div class="flex items-center gap-4">
                <span class="text-4xl font-black italic text-white tracking-tighter">${estado === 'pendiente' ? '-' : gl}</span>
                <span class="text-[10px] text-slate-700 font-black italic opacity-50">VS</span>
                <span class="text-4xl font-black italic text-white tracking-tighter">${estado === 'pendiente' ? '-' : gv}</span>
            </div>
        `
    }

    // 3. Actualizar Botones
    const buttonsContainer = card.querySelector('.buttons-container')
    if (estado === 'pendiente') {
        buttonsContainer.innerHTML = `
            <button class="btn-iniciar w-full py-4 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-2xl border border-indigo-600/20 transition-all font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                Iniciar Partido
            </button>
        `
    } else if (estado === 'en_juego') {
        buttonsContainer.innerHTML = `
            <div class="flex items-center gap-2 w-full">
                <button class="btn-cancelar flex-1 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl border border-white/5 transition-all font-black uppercase text-[10px] tracking-widest">
                    Cancelar
                </button>
                <button class="btn-finalizar flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-600/20 transition-all font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                    Finalizar Encuentro
                </button>
            </div>
        `
    } else {
        buttonsContainer.innerHTML = `
            <button class="btn-corregir w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all font-bold uppercase text-[9px] tracking-widest">
                Corregir Resultado
            </button>
        `
    }

    // Reasignar eventos
    attachCardEvents(card)
  }

  /**
   * Asigna los eventos a una card de partido
   */
  function attachCardEvents(card) {
    const partidoId = card.dataset.partidoId
    
    const btnIniciar = card.querySelector('.btn-iniciar')
    const btnFinalizar = card.querySelector('.btn-finalizar')
    const btnCancelar = card.querySelector('.btn-cancelar')
    const btnCorregir = card.querySelector('.btn-corregir')

    if (btnIniciar) {
        btnIniciar.onclick = () => cambiarEstadoPartido(partidoId, 'en_juego', 0, 0)
    }
    if (btnFinalizar) {
        btnFinalizar.onclick = () => {
            const gl = card.querySelector('.input-local').value
            const gv = card.querySelector('.input-visitante').value
            cambiarEstadoPartido(partidoId, 'finalizado', gl, gv)
        }
    }
    if (btnCancelar) {
        btnCancelar.onclick = () => {
            if(confirm('¿Estás seguro de cancelar? Se borrará el marcador actual.')) {
                cambiarEstadoPartido(partidoId, 'pendiente', 0, 0)
            }
        }
    }
    if (btnCorregir) {
        btnCorregir.onclick = () => {
            const gl = card.dataset.golesLocal
            const gv = card.dataset.golesVisitante
            cambiarEstadoPartido(partidoId, 'en_juego', gl, gv)
        }
    }
  }

  const loadMatches = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('partidos')
      .select('*, local:equipo_local_id(nombre, escudo_url), visitante:equipo_visitante_id(nombre, escudo_url), torneos!inner(id, nombre, patrocinadores, user_id)')
      .eq('torneos.user_id', user.id)
      .order('fase', { ascending: true })
      .order('fecha_hora', { ascending: true })

    if (error) return console.error(error)

    if (!data || data.length === 0) {
      listContainer.innerHTML = '<p class="text-slate-500 text-center py-20">No se han generado partidos aún.</p>'
      return
    }

    torneo_id_actual = data[0].torneos.id

    // Agrupar por fase
    const phases = {}
    data.forEach(m => {
      const phaseKey = (m.fase || 'fase de grupos').toString()
      if (!phases[phaseKey]) phases[phaseKey] = []
      phases[phaseKey].push(m)
    })

    const preferredOrder = ['fase de grupos','octavos','cuartos','semifinal','final']
    const sortedPhases = Object.keys(phases).sort((a,b) => {
      const ia = preferredOrder.indexOf(a.toLowerCase())
      const ib = preferredOrder.indexOf(b.toLowerCase())
      if (ia === -1 && ib === -1) return a.localeCompare(b)
      if (ia === -1) return 1
      if (ib === -1) return -1
      return ia - ib
    })

    let html = ''
    sortedPhases.forEach(phase => {
      html += `
        <div class="mb-16 fade-in">
          <div class="flex items-center gap-4 mb-8">
            <h4 class="text-xs font-black uppercase text-indigo-500 italic tracking-[0.2em]">${phase}</h4>
            <div class="flex-1 h-px bg-white/5"></div>
          </div>
      `

      // Agrupar por fecha
      const byDate = {}
      phases[phase].forEach(m => {
        const dateStr = m.fecha_hora ? new Date(m.fecha_hora).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Sin fecha'
        if (!byDate[dateStr]) byDate[dateStr] = []
        byDate[dateStr].push(m)
      })

      Object.entries(byDate).forEach(([date, matches]) => {
        html += `<p class="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-8 mb-4 ml-2">${date}</p>`
        matches.forEach(m => {
          const time = m.fecha_hora ? new Date(m.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'
          const venue = m.campo || m.sede || m.escenario || m.venue || 'Sede TBD'
          const state = m.estado || 'pendiente'
          const gl = m.goles_local ?? 0
          const gv = m.goles_visitante ?? 0
          
          html += `
            <div class="partido-card card !p-6 mb-6 border border-white/5 bg-slate-900/40 glass-hover transition-all duration-300" 
                 data-partido-id="${m.id}"
                 data-estado="${state}"
                 data-goles-local="${gl}"
                 data-goles-visitante="${gv}">
               
               <div class="flex flex-col md:flex-row items-center justify-between gap-8">
                  <!-- Local Team -->
                  <div class="flex flex-row md:flex-col items-center gap-4 flex-1 w-full">
                     <div class="w-16 h-16 md:w-20 md:h-20 bg-slate-950 rounded-[2rem] p-3 border border-white/5 flex items-center justify-center shadow-inner relative group">
                        <img src="${m.local?.escudo_url || 'https://ui-avatars.com/api/?name='+encodeURIComponent(m.local?.nombre || 'Team')}" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" loading="lazy">
                        <div class="absolute inset-0 bg-indigo-500/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </div>
                     <span class="text-sm md:text-xs font-black text-white uppercase italic tracking-tighter text-left md:text-center truncate flex-1 md:w-full">${m.local?.nombre || 'TBD'}</span>
                  </div>

                  <!-- Center: Score & Status -->
                  <div class="flex flex-col items-center justify-center px-4 min-w-[200px]">
                     <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <svg class="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        ${time}
                     </div>
                     
                     <div class="marcador-container mb-4">
                        ${state === 'en_juego' ? `
                            <div class="flex items-center gap-2">
                                <input type="number" min="0" value="${gl}" class="input-local w-14 h-14 bg-slate-950 border-white/5 text-white font-black text-2xl text-center rounded-2xl focus:ring-4 focus:ring-amber-500/20 outline-none transition-all">
                                <span class="text-[10px] text-slate-700 font-black italic opacity-50 px-1">VS</span>
                                <input type="number" min="0" value="${gv}" class="input-visitante w-14 h-14 bg-slate-950 border-white/5 text-white font-black text-2xl text-center rounded-2xl focus:ring-4 focus:ring-amber-500/20 outline-none transition-all">
                            </div>
                        ` : `
                            <div class="flex items-center gap-4">
                                <span class="text-4xl font-black italic text-white tracking-tighter">${state === 'pendiente' ? '-' : gl}</span>
                                <span class="text-[10px] text-slate-700 font-black italic opacity-50">VS</span>
                                <span class="text-4xl font-black italic text-white tracking-tighter">${state === 'pendiente' ? '-' : gv}</span>
                            </div>
                        `}
                     </div>

                     <div class="badge-container h-8 flex items-center justify-center">
                        ${state === 'pendiente' ? `
                            <span class="badge badge-pending scale-90">Pendiente</span>
                        ` : state === 'en_juego' ? `
                            <span class="badge bg-amber-500/10 text-amber-500 border-amber-500/20 scale-90 animate-pulse flex items-center gap-1.5 ring-1 ring-amber-500/30">
                                <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> EN JUEGO
                            </span>
                        ` : `
                            <span class="badge bg-emerald-500/10 text-emerald-500 border-emerald-500/20 scale-90">Finalizado</span>
                        `}
                     </div>
                  </div>

                  <!-- Visitante Team -->
                  <div class="flex flex-row-reverse md:flex-col items-center gap-4 flex-1 w-full">
                     <div class="w-16 h-16 md:w-20 md:h-20 bg-slate-950 rounded-[2rem] p-3 border border-white/5 flex items-center justify-center shadow-inner relative group">
                        <img src="${m.visitante?.escudo_url || 'https://ui-avatars.com/api/?name='+encodeURIComponent(m.visitante?.nombre || 'Team')}" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" loading="lazy">
                        <div class="absolute inset-0 bg-indigo-500/5 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </div>
                     <span class="text-sm md:text-xs font-black text-white uppercase italic tracking-tighter text-right md:text-center truncate flex-1 md:w-full">${m.visitante?.nombre || 'TBD'}</span>
                  </div>
               </div>
               
               <!-- Controls Container -->
               <div class="buttons-container mt-8 pt-6 border-t border-white/5">
                  ${state === 'pendiente' ? `
                    <button class="btn-iniciar w-full py-4 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-2xl border border-indigo-600/20 transition-all font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                        Iniciar Partido
                    </button>
                  ` : state === 'en_juego' ? `
                    <div class="flex items-center gap-2 w-full">
                        <button class="btn-cancelar flex-1 py-4 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl border border-white/5 transition-all font-black uppercase text-[10px] tracking-widest">
                            Cancelar
                        </button>
                        <button class="btn-finalizar flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-600/20 transition-all font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                            Finalizar Encuentro
                        </button>
                    </div>
                  ` : `
                    <button class="btn-corregir w-full py-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all font-bold uppercase text-[9px] tracking-widest">
                        Corregir Resultado
                    </button>
                  `}
               </div>

               <!-- Footer Info -->
               <div class="mt-4 pt-4 flex items-center gap-6 justify-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                   <div class="flex items-center gap-2">
                        <span class="p-1.5 bg-slate-950 rounded-lg"><svg class="w-2.5 h-2.5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></span>
                        ${venue}
                   </div>
                   ${m.torneos?.nombre ? `<div class="w-1 h-1 bg-slate-800 rounded-full"></div><div>${m.torneos.nombre}</div>` : ''}
               </div>
            </div>
          `
        })
      })

      html += `</div>`
    })

    listContainer.innerHTML = html

    // Asignar eventos iniciales
    document.querySelectorAll('.partido-card').forEach(card => attachCardEvents(card))

    // Suscripción Realtime (Opcional, pero implementamos el flag por si el usuario lo activa)
    supabase
      .channel('public:partidos')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'partidos' }, payload => {
        if (guardandoLocalmente) return
        // Aquí se podría refrescar quirúrgicamente si el cambio viene de otro cliente
        // console.log('Cambio detectado en Realtime:', payload)
      })
      .subscribe()
  }

  loadMatches()
}

