import { supabase } from '../services/supabase.js'

export const renderStandings = async (container, torneoId) => {
  container.innerHTML = `
    <div id="standingsContent" class="space-y-12">
        <div class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
        </div>
    </div>
  `

  const content = document.getElementById('standingsContent')

  const loadStandings = async () => {
    try {
        // 1. Obtener grupos del torneo
        const { data: grupos, error: gErr } = await supabase
            .from('grupos')
            .select('*')
            .eq('torneo_id', torneoId)
            .order('nombre')

        if (gErr) throw gErr

        if (!grupos || grupos.length === 0) {
            // Si no hay grupos, mostramos una tabla única del torneo completo (ej: Ligas)
            const { data: posBase, error: pbErr } = await supabase.from('vista_posiciones').select('*').eq('torneo_id', torneoId)
            if (!posBase || posBase.length === 0) {
                content.innerHTML = '<p class="text-slate-500 text-center py-20 uppercase font-black italic tracking-widest text-[11px]">No hay equipos en este torneo.</p>'
            } else {
                content.innerHTML = renderTableHtml('Torneo', posBase)
            }
            return
        }

        // 2. Obtener posiciones de la nueva VIEW
        const { data: posiciones, error: pErr } = await supabase
            .from('vista_posiciones')
            .select('*')
            .eq('torneo_id', torneoId)

        if (pErr) throw pErr

        // 3. Renderizar una tabla por cada grupo
        content.innerHTML = grupos.map(grupo => {
            const groupRows = posiciones.filter(p => p.grupo_id === grupo.id)
            return renderTableHtml(grupo.nombre, groupRows)
        }).join('')

    } catch (err) {
        console.error(err)
        content.innerHTML = `<p class="text-red-500 text-center py-20 font-black uppercase text-[10px]">Error al cargar posiciones: ${err.message}</p>`
    }
  }

  function renderTableHtml(titulo, groupRows) {
      return `
        <div class="space-y-6 fade-in">
            <div class="flex items-center gap-4 px-2">
                <h4 class="text-xs font-black uppercase text-indigo-500 italic tracking-[0.2em]">${titulo}</h4>
                <div class="flex-1 h-px bg-white/5"></div>
            </div>

            <div class="card !p-0 overflow-hidden border-white/5 bg-slate-900/40">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            <th class="py-4 px-6 w-12">POS</th>
                            <th class="py-4 px-4">EQUIPO</th>
                            <th class="py-4 px-4 text-center">PJ</th>
                            <th class="py-4 px-4 text-center">PG</th>
                            <th class="py-4 px-4 text-center">PE</th>
                            <th class="py-4 px-4 text-center">PP</th>
                            <th class="py-4 px-4 text-center">DG</th>
                            <th class="py-4 px-6 text-right">PTS</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                        ${groupRows.sort((a,b) => b.pts - a.pts || b.dg - a.dg).map((row, index) => `
                            <tr class="hover:bg-white/3 transition-colors group">
                                <td class="py-5 px-6">
                                    <span class="text-xs font-black ${index < 2 ? 'text-indigo-400' : 'text-slate-600'}">${index + 1}</span>
                                </td>
                                <td class="py-5 px-4">
                                    <div class="flex items-center gap-4">
                                        <div class="w-8 h-8 rounded-lg overflow-hidden bg-slate-950 p-1.5 border border-white/5 flex items-center justify-center">
                                            <img src="${row.escudo_url || ('https://ui-avatars.com/api/?name='+encodeURIComponent(row.equipo_nombre))}" class="w-full h-full object-contain" loading="lazy">
                                        </div>
                                        <span class="font-black text-white italic uppercase tracking-tighter text-sm">${row.equipo_nombre}</span>
                                    </div>
                                </td>
                                <td class="py-5 px-4 text-center text-xs font-bold text-slate-400 font-mono">${row.pj}</td>
                                <td class="py-5 px-4 text-center text-xs font-bold text-slate-500 font-mono">${row.pg}</td>
                                <td class="py-5 px-4 text-center text-xs font-bold text-slate-500 font-mono">${row.pe}</td>
                                <td class="py-5 px-4 text-center text-xs font-bold text-slate-500 font-mono">${row.pp}</td>
                                <td class="py-5 px-4 text-center text-xs font-bold ${row.dg >= 0 ? 'text-emerald-500' : 'text-rose-500'} font-mono">${row.dg >= 0 ? '+' : ''}${row.dg}</td>
                                <td class="py-5 px-6 text-right">
                                    <span class="text-xl font-black italic text-white tracking-tighter">${row.pts}</span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
      `
  }

  // Escuchar actualizaciones de resultados
  const refreshHandler = () => loadStandings()
  window.addEventListener('resultado-guardado', refreshHandler)

  // Cleanup al desmontar (si hubiera router)
  // window.removeEventListener('resultado-guardado', refreshHandler)

  loadStandings()
}
