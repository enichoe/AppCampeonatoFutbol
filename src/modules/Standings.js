import { supabase } from '../services/supabase.js'

export const renderStandings = async (container, torneoId) => {
  container.innerHTML = `
    <div class="card overflow-hidden">
        <table class="w-full text-left text-sm">
            <thead class="bg-slate-800/50 text-slate-400 uppercase text-[10px] font-black">
                <tr>
                    <th class="px-4 py-3">Pos</th>
                    <th class="px-4 py-3">Equipo</th>
                    <th class="px-4 py-3 text-center">PJ</th>
                    <th class="px-4 py-3 text-center">PG</th>
                    <th class="px-4 py-3 text-center">PE</th>
                    <th class="px-4 py-3 text-center">PP</th>
                    <th class="px-4 py-3 text-center">GF</th>
                    <th class="px-4 py-3 text-center">GC</th>
                    <th class="px-4 py-3 text-center text-indigo-400">PTS</th>
                </tr>
            </thead>
            <tbody id="standingsBody">
                <!-- Data dinámica -->
            </tbody>
        </table>
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
        <tr class="border-t border-slate-700/50 hover:bg-slate-800/30 transition-colors">
            <td class="px-4 py-4 font-bold text-slate-500">${index + 1}</td>
            <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                    <span class="font-bold text-white">${row.equipos.nombre}</span>
                </div>
            </td>
            <td class="px-4 py-4 text-center font-medium">${row.pj}</td>
            <td class="px-4 py-4 text-center text-emerald-500">${row.pg}</td>
            <td class="px-4 py-4 text-center text-slate-400">${row.pe}</td>
            <td class="px-4 py-4 text-center text-red-400">${row.pp}</td>
            <td class="px-4 py-4 text-center">${row.gf}</td>
            <td class="px-4 py-4 text-center">${row.gc}</td>
            <td class="px-4 py-4 text-center font-black text-indigo-400 text-lg">${row.pts}</td>
        </tr>
    `).join('')
  }

  loadStandings()
}
