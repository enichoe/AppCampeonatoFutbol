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
        <div class="p-5 rounded-[2rem] bg-slate-900 border border-white/5 flex items-center justify-between glass-hover">
            <div class="flex items-center gap-5">
                <span class="text-xs font-black text-slate-700 w-4">${index + 1}</span>
                <div class="w-14 h-14 rounded-2xl overflow-hidden bg-slate-950 p-2 border border-white/5 flex items-center justify-center shadow-2xl">
                    <img src="${row.equipos?.escudo_url || ('https://ui-avatars.com/api/?name='+encodeURIComponent(row.equipos?.nombre))}" class="w-full h-full object-contain" loading="lazy">
                </div>
                <div>
                    <div class="font-black text-white italic uppercase tracking-tighter text-lg leading-none mb-1">${row.equipos?.nombre}</div>
                    <div class="text-[9px] font-black text-slate-500 uppercase tracking-widest flex gap-3">
                       <span>PJ: <span class="text-slate-300 font-mono">${row.pj}</span></span>
                       <span class="opacity-20 text-white">|</span>
                       <span>DG: <span class="text-indigo-400 font-mono">${row.dg >= 0 ? '+' : ''}${row.dg}</span></span>
                    </div>
                </div>
            </div>
            <div class="text-right">
                <div class="text-indigo-400 font-black italic text-2xl tracking-tighter">${row.pts} <span class="text-[9px] text-slate-500 uppercase tracking-widest ml-0.5">PTS</span></div>
            </div>
        </div>
    `).join('')
  }

  loadStandings()
}
