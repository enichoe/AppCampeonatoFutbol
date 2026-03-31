import { supabase } from '../services/supabase.js'

export const renderTeams = async (container) => {
  container.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
       <div>
         <h2 class="text-3xl font-black text-white italic tracking-tighter uppercase">Clubes & Equipos</h2>
         <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Gestión de plantillas y registros</p>
       </div>
       <button id="btnCreateTeam" class="btn-primary w-full md:w-auto shadow-indigo-600/40">
         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
         <span class="uppercase tracking-widest text-xs">Registrar Equipo</span>
       </button>
    </div>

    <!-- Filtro por Torneo -->
    <div class="mb-10 p-6 bg-slate-900/40 rounded-[2rem] border border-white/5 max-w-sm">
        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Filtrar por Competición</label>
        <select id="tournamentFilter" class="form-input bg-slate-950">
            <option value="all">Ver todas las ligas</option>
            <!-- Opciones dinámicas -->
        </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="teamList">
       <!-- Lista dinánima -->
    </div>

    <!-- Modal de Creación -->
    <div id="teamModal" class="hidden fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 bg-slate-950/95 backdrop-blur-xl transition-all duration-300">
        <div class="card w-full h-full md:h-auto md:max-w-lg shadow-2xl scale-95 opacity-0 transition-all duration-300 rounded-none md:rounded-[2.5rem] flex flex-col" id="modalContainer">
            <div class="flex justify-between items-center mb-8 p-6 md:p-0">
                <div>
                   <h3 class="text-2xl font-black italic uppercase tracking-tighter">Inscribir Equipo</h3>
                   <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Registra una nueva entidad deportiva</p>
                </div>
                <button id="closeModal" class="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <form id="teamForm" class="space-y-6 p-6 md:p-0">
                <div>
                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Nombre Oficial del Club</label>
                    <input type="text" name="nombre" placeholder="Ej: Manchester City FC" required class="form-input">
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Asociar a Camponato</label>
                    <select name="torneo_id" id="tournamentSelect" class="form-input bg-slate-950" required>
                        <option value="">Selecciona un torneo...</option>
                    </select>
                </div>
                <div>
                   <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Logo / Escudo (URL)</label>
                   <input type="url" name="escudo_url" placeholder="https://ejemplo.com/logo.png" class="form-input">
                </div>
                <div class="flex flex-col md:flex-row gap-4 pt-8 border-t border-white/5">
                    <button type="submit" class="btn-primary flex-1 shadow-indigo-600/20 uppercase text-xs font-black tracking-widest">Confirmar Inscripción ➔</button>
                    <button type="button" class="btn-secondary px-8 border-transparent" id="cancelModal">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
  
    <!-- Modal Roster (Ver jugadores) -->
    <div id="teamRosterModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
        <div class="w-full max-w-md card p-6" id="teamRosterContainer">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-bold">Plantilla</h3>
                <button id="closeRosterModal" class="text-slate-400">&times;</button>
            </div>
            <div id="teamRosterContent" class="space-y-2 text-sm text-slate-400">Cargando...</div>
        </div>
    </div>
  `

  const listContainer = document.getElementById('teamList')
  const filter = document.getElementById('tournamentFilter')
  const select = document.getElementById('tournamentSelect')
  const modal = document.getElementById('teamModal')

  const loadData = async () => {
    // Cargar torneos para los selectores
    const { data: torneos } = await supabase.from('torneos').select('id, nombre').is('deleted_at', null)
    
    if (torneos) {
        const options = torneos.map(t => `<option value="${t.id}">${t.nombre}</option>`).join('')
        filter.innerHTML = `<option value="all">Todos los Torneos</option>${options}`
        select.innerHTML = `<option value="">Selecciona un torneo</option>${options}`
    }

    // Cargar equipos
    const { data: teams, error } = await supabase.from('equipos').select('*, torneos(nombre)').is('deleted_at', null)
    
    if (error) return console.error(error)

    if (teams.length === 0) {
        listContainer.innerHTML = '<p class="col-span-full text-center text-slate-500 py-20">No tienes equipos registrados.</p>'
    } else {
        listContainer.innerHTML = teams.map(t => `
            <div class="card p-6 flex flex-col items-center glass-hover group text-center relative overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div class="w-24 h-24 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-5 border border-white/5 overflow-hidden shadow-2xl relative z-10">
                    ${t.escudo_url ? `<img src="${t.escudo_url}" class="w-16 h-16 object-contain transition-transform group-hover:scale-110" loading="lazy">` : `<span class="text-3xl font-black text-indigo-500">${t.nombre.charAt(0).toUpperCase()}</span>`}
                </div>
                <h4 class="font-black italic text-xl text-white uppercase tracking-tighter mb-2 relative z-10 leading-tight">${t.nombre}</h4>
                <p class="text-[9px] text-indigo-400 font-bold uppercase tracking-[0.2em] mb-6 relative z-10 px-3 py-1 bg-indigo-500/5 rounded-full border border-indigo-500/10 truncate max-w-full">${t.torneos?.nombre || 'Categoría Libre'}</p>
                <button class="btn-view-players w-full mt-auto btn-primary !py-3 !rounded-2xl text-[10px] font-black uppercase tracking-widest relative z-10 shadow-indigo-600/10" data-team-id="${t.id}">Ver Plantilla ➔</button>
            </div>
        `).join('')
    }
  }

  // Lógica Modal (Similara Torneos por brevedad)
  document.getElementById('btnCreateTeam').onclick = () => modal.classList.toggle('hidden')
  document.getElementById('cancelModal').onclick = () => modal.classList.toggle('hidden')
  document.getElementById('closeModal').onclick = () => modal.classList.toggle('hidden')

  document.getElementById('teamForm').onsubmit = async (e) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    const formData = new FormData(e.target)
    
    const { error } = await supabase.from('equipos').insert([{
        user_id: user.id,
        nombre: formData.get('nombre'),
        torneo_id: formData.get('torneo_id'),
        escudo_url: formData.get('escudo_url')
    }])

    if(!error) {
        modal.classList.add('hidden')
        loadData()
        e.target.reset()
    } else {
        alert(error.message)
    }
  }

    // Abrir modal de plantilla desde botones (se generan dinámicamente)
    const openRosterModal = (htmlContent) => {
        document.getElementById('teamRosterContent').innerHTML = htmlContent
        document.getElementById('teamRosterModal').classList.remove('hidden')
    }

    document.getElementById('closeRosterModal').onclick = () => document.getElementById('teamRosterModal').classList.add('hidden')

    // Delegación: capturamos clicks en el contenedor para los botones creados dinámicamente
    document.getElementById('teamList').addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-view-players')
        if (!btn) return
        const teamId = btn.dataset.teamId
        if (!teamId) return
        openRosterModal('Cargando plantilla...')
        try {
            const { data: players, error } = await supabase.from('jugadores').select('*').eq('equipo_id', teamId).is('deleted_at', null)
            if (error) throw error
            if (!players || players.length === 0) return openRosterModal('<p class="text-center py-6">No hay jugadores registrados.</p>')
            openRosterModal(players.map(p => `
                <div class="flex items-center gap-3 p-2 border-b border-slate-800/20">
                    <img src="${p.foto_url || ('https://ui-avatars.com/api/?name='+encodeURIComponent(p.nombre))}" class="w-10 h-10 rounded-md object-cover" loading="lazy">
                    <div>
                        <div class="font-black text-white">${p.nombre}</div>
                        <div class="text-[11px] text-slate-400">#${p.dorsal || '-'} • ${p.posicion || '-'}</div>
                    </div>
                </div>
            `).join(''))
        } catch (err) {
            openRosterModal(`<p class="text-red-500">${err.message}</p>`)
        }
    })

    loadData()
}
