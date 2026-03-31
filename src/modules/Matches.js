import { supabase } from '../services/supabase.js'

export const renderMatches = async (container) => {
  container.innerHTML = `
    <div class="flex items-center justify-between mb-8">
       <div>
         <h2 class="text-3xl font-extrabold text-white">Fixture y Resultados</h2>
         <p class="text-slate-500 mt-1">Registra los marcadores de cada jornada.</p>
       </div>
    </div>

    <!-- Lista de Partidos -->
    <div id="matchesContainer" class="space-y-6">
        <!-- Renderizado dinámico -->
    </div>
  `

  const listContainer = document.getElementById('matchesContainer')

  const loadMatches = async () => {
    const { data, error } = await supabase
      .from('partidos')
      .select('*, local:equipo_local_id(nombre, escudo_url), visitante:equipo_visitante_id(nombre, escudo_url), torneos(nombre, patrocinadores)')
      .order('fase', { ascending: true })
      .order('fecha_hora', { ascending: true })

    if (error) return console.error(error)

    if (!data || data.length === 0) {
      listContainer.innerHTML = '<p class="text-slate-500 text-center py-20">No se han generado partidos aún.</p>'
      return
    }

    // Agrupar por fase y por fecha
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
        <div class="mb-12">
          <div class="flex items-center gap-4 mb-6">
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
          
          html += `
            <div class="card !p-5 mb-4 border border-white/5 bg-slate-900/40 glass-hover">
               <div class="flex items-center justify-between gap-4">
                  <!-- Local -->
                  <div class="flex flex-col items-center gap-2 flex-1 min-w-0">
                     <div class="w-12 h-12 bg-slate-950 rounded-2xl p-2 border border-white/5 flex items-center justify-center">
                        <img src="${m.local?.escudo_url || 'https://ui-avatars.com/api/?name='+encodeURIComponent(m.local?.nombre || 'Team')}" class="w-full h-full object-contain" loading="lazy">
                     </div>
                     <span class="text-[10px] font-black text-white uppercase italic tracking-tighter text-center truncate w-full">${m.local?.nombre || 'TBD'}</span>
                  </div>

                  <!-- Marcador -->
                  <div class="flex flex-col items-center justify-center px-4">
                     <div class="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">${time}</div>
                     <div class="flex items-center gap-3">
                        <span class="text-3xl font-black italic text-white tracking-tighter">${m.goles_local ?? '-'}</span>
                        <span class="text-[10px] text-slate-700 font-black italic opacity-50">VS</span>
                        <span class="text-3xl font-black italic text-white tracking-tighter">${m.goles_visitante ?? '-'}</span>
                     </div>
                     <div class="mt-3">
                        <span class="badge ${state === 'finalizado' ? 'badge-finished' : state === 'en_juego' ? 'badge-live' : 'badge-pending'} scale-90">
                           ${state}
                        </span>
                     </div>
                  </div>

                  <!-- Visitante -->
                  <div class="flex flex-col items-center gap-2 flex-1 min-w-0">
                     <div class="w-12 h-12 bg-slate-950 rounded-2xl p-2 border border-white/5 flex items-center justify-center">
                        <img src="${m.visitante?.escudo_url || 'https://ui-avatars.com/api/?name='+encodeURIComponent(m.visitante?.nombre || 'Team')}" class="w-full h-full object-contain" loading="lazy">
                     </div>
                     <span class="text-[10px] font-black text-white uppercase italic tracking-tighter text-center truncate w-full">${m.visitante?.nombre || 'TBD'}</span>
                  </div>
               </div>
               
               <!-- Info Extra -->
               <div class="mt-4 pt-4 border-t border-white/5 flex items-center justify-center gap-4 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                   <div class="flex items-center gap-1.5"><svg class="w-3 h-3 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>${venue}</div>
                   ${m.torneos?.nombre ? `<div class="w-1 h-1 bg-slate-800 rounded-full"></div><div>${m.torneos.nombre}</div>` : ''}
               </div>
            </div>
          `
        })
      })

      html += `</div>`
    })

    listContainer.innerHTML = html

    // Guardado de resultados: inputs si existen (compatibilidad con versión anterior)
    document.querySelectorAll('.score-input').forEach(input => {
      input.onchange = async () => {
        const id = input.dataset.id
        const type = input.dataset.type
        const value = parseInt(input.value)
        const updateObj = type === 'local' ? { goles_local: value } : { goles_visitante: value }
        updateObj.estado = 'finalizado'
        const { error: updErr } = await supabase.from('partidos').update(updateObj).eq('id', id)
        if(!updErr) console.log('Marcador actualizado')
      }
    })
  }

  loadMatches()
}
