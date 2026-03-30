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
      .select('*, local:equipo_local_id(nombre, escudo_url), visitante:equipo_visitante_id(nombre, escudo_url), torneos(nombre)')
      .order('jornada', { ascending: true })

    if (error) return console.error(error)

    if (data.length === 0) {
        listContainer.innerHTML = '<p class="text-slate-500 text-center py-20">No se han generado partidos aún.</p>'
        return
    }

    listContainer.innerHTML = data.map(p => `
      <div class="card p-4 glass-hover flex items-center justify-between gap-6 border border-slate-700/50">
          <div class="flex-1 text-right font-bold text-slate-200">${p.local.nombre}</div>
          <div class="flex items-center gap-2">
            <input type="number" value="${p.goles_local || 0}" class="w-12 h-10 bg-slate-800 border-indigo-500/50 text-center font-bold text-white rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none score-input" data-id="${p.id}" data-type="local">
            <div class="text-slate-600 font-black">VS</div>
            <input type="number" value="${p.goles_visitante || 0}" class="w-12 h-10 bg-slate-800 border-indigo-500/50 text-center font-bold text-white rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none score-input" data-id="${p.id}" data-type="visitante">
          </div>
          <div class="flex-1 font-bold text-slate-200">${p.visitante.nombre}</div>
          <div class="hidden md:block text-xs uppercase font-black text-indigo-400 opacity-50 px-4">${p.torneos.nombre.substring(0,8)}...</div>
      </div>
    `).join('')

    // Guardado de resultados en tiempo real
    document.querySelectorAll('.score-input').forEach(input => {
        input.onchange = async () => {
            const id = input.dataset.id
            const type = input.dataset.type
            const value = parseInt(input.value)
            
            const updateObj = type === 'local' ? { goles_local: value } : { goles_visitante: value }
            // Marcamos como finalizado al editar (ejemplo simplificado)
            updateObj.estado = 'finalizado'

            const { error: updErr } = await supabase.from('partidos').update(updateObj).eq('id', id)
            if(!updErr) {
               console.log('Marcador actualizado')
               // Notificamos opcionalmente
            }
        }
    })
  }

  loadMatches()
}
