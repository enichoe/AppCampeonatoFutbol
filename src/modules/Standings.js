import { supabase } from '../services/supabase.js'

export const renderStandings = async (container, torneoId) => {
  container.innerHTML = `
    <div class="card overflow-hidden p-4">
        <div id="standingsBody" class="space-y-3">
            <!-- Data dinámica -->
        </div>
    </div>
  `

  const body = document.getElementById('standingsBody')

  const loadStandings = async () => {
    // Nota: En producción, esto se gestiona con una View SQL en Supabase para mayor performance.
    // Aquí lo calculamos de forma ilustrativa o lo traemos de la tabla persistente.
    const { data, error } = await supabase
        .from('tabla_posiciones')
        .select('*, equipos(nombre, escudo_url)')
        .eq('torneo_id', torneoId)
        .order('pts', { ascending: false })
        .order('dg', { ascending: false })

    if (error) return console.error(error)

    body.innerHTML = data.map((row, index) => `
        <div class="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-md overflow-hidden bg-slate-800 flex items-center justify-center">
                    <img src="${row.equipos?.escudo_url || ('https://ui-avatars.com/api/?name='+encodeURIComponent(row.equipos?.nombre))}" class="w-full h-full object-contain" loading="lazy">
                </div>
                <div>
                    <div class="font-black text-white">${index + 1}. ${row.equipos?.nombre}</div>
                    <div class="text-[11px] text-slate-400">PJ ${row.pj} • DG ${row.dg}</div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-indigo-400 font-black text-lg">${row.pts}</div>
            </div>
        </div>
    `).join('')
  }

  loadStandings()
}
