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
      html += `<div class="mb-6"><h4 class="text-sm font-black uppercase text-slate-400 mb-2">${phase}</h4>`

      // Agrupar por fecha
      const byDate = {}
      phases[phase].forEach(m => {
        const dateStr = m.fecha_hora ? new Date(m.fecha_hora).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'Sin fecha'
        if (!byDate[dateStr]) byDate[dateStr] = []
        byDate[dateStr].push(m)
      })

      Object.entries(byDate).forEach(([date, matches]) => {
        html += `<p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4 mb-2">${date}</p>`
        matches.forEach(m => {
          const time = m.fecha_hora ? new Date(m.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'
          const venue = m.campo || m.sede || m.escenario || m.venue || 'Sede no definida'
          const state = m.estado || 'pendiente'
          const sponsorHtml = (m.torneos && m.torneos.patrocinadores && m.torneos.patrocinadores.length)
            ? `<div class="flex items-center gap-2 mt-3">${m.torneos.patrocinadores.slice(0,3).map(p=> p.logo_url ? `<img src="${p.logo_url}" class="h-6 object-contain" loading="lazy">` : `<span class="text-xs font-bold text-slate-500">${p.nombre}</span>`).join('')}</div>`
            : ''

          html += `
            <div class="card p-4 mb-3 flex items-center justify-between gap-4 border border-slate-700/40">
            <div class="flex items-center gap-3 w-1/3">
              <img src="${m.local?.escudo_url || 'https://ui-avatars.com/api/?name='+m.local?.nombre}" class="w-10 h-10 rounded-md object-contain" loading="lazy">
              <div class="text-sm font-black text-slate-200 truncate">${m.local?.nombre}</div>
            </div>
            <div class="text-center w-1/3">
              <div class="text-[11px] text-slate-400 font-bold mb-1">${time} • ${venue}</div>
              <div class="flex items-center justify-center gap-3">
                <div class="text-2xl font-black text-white">${m.goles_local ?? '-'}</div>
                <div class="text-sm text-slate-500 font-black">vs</div>
                <div class="text-2xl font-black text-white">${m.goles_visitante ?? '-'}</div>
              </div>
              <div class="text-[10px] mt-2 uppercase font-black ${state === 'finalizado' ? 'text-emerald-400' : state === 'en_juego' ? 'text-amber-400' : 'text-slate-500'}">${state}</div>
              ${sponsorHtml}
            </div>
            <div class="flex items-center gap-3 w-1/3 justify-end">
              <div class="text-sm font-black text-slate-200 truncate mr-4">${m.visitante?.nombre}</div>
              <img src="${m.visitante?.escudo_url || 'https://ui-avatars.com/api/?name='+m.visitante?.nombre}" class="w-10 h-10 rounded-md object-contain" loading="lazy">
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
