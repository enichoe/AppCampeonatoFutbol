import { supabase } from '../services/supabase.js'

export const renderTeams = async (container) => {
  container.innerHTML = `
    <div class="flex items-center justify-between mb-8">
       <div>
         <h2 class="text-3xl font-extrabold text-white">Equipos</h2>
         <p class="text-slate-500 mt-1">Administra los equipos y sus plantillas.</p>
       </div>
       <button id="btnCreateTeam" class="btn-primary py-3">
         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
         <span>Nuevo Equipo</span>
       </button>
    </div>

    <!-- Filtro por Torneo -->
    <div class="mb-8 flex flex-col gap-2 max-w-sm">
        <label class="text-xs font-bold text-slate-500 uppercase">Filtrar por Torneo</label>
        <select id="tournamentFilter" class="form-input bg-slate-800">
            <option value="all">Todos los Torneos</option>
            <!-- Opciones dinámicas -->
        </select>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="teamList">
       <!-- Lista dinánima -->
    </div>

    <!-- Modal de Creación -->
    <div id="teamModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm transition-all duration-300">
        <div class="card w-full max-w-lg shadow-2xl" id="modalContainer">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold">Inscribir Equipo</h3>
                <button id="closeModal" class="text-slate-500 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <form id="teamForm" class="space-y-6">
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre del Equipo</label>
                    <input type="text" name="nombre" placeholder="Ej: Real FC" required class="form-input">
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Asignar a Torneo</label>
                    <select name="torneo_id" id="tournamentSelect" class="form-input bg-slate-800" required>
                        <option value="">Selecciona un torneo</option>
                    </select>
                </div>
                <div>
                   <label class="block text-xs font-bold text-slate-500 uppercase mb-2">URL del Escudo (opcional)</label>
                   <input type="url" name="escudo_url" placeholder="https://..." class="form-input">
                </div>
                <div class="flex gap-4 pt-4 border-t border-slate-700">
                    <button type="submit" class="btn-primary flex-1 h-12">Confirmar Registro</button>
                    <button type="button" class="btn-secondary px-8 bg-transparent" id="cancelModal">Cancelar</button>
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
            <div class="card p-4 flex flex-col items-center glass-hover">
                <div class="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mb-4 border border-slate-600 overflow-hidden">
                    ${t.escudo_url ? `<img src="${t.escudo_url}" class="w-12 h-12 object-contain" loading="lazy">` : `<svg class="w-8 h-8 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.5 1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clip-rule="evenodd"></path></svg>`}
                </div>
                <h4 class="font-bold text-center mb-1 leading-tight">${t.nombre}</h4>
                <p class="text-[10px] text-indigo-400 font-bold uppercase truncate max-w-full">${t.torneos?.nombre || 'Sin Torneo'}</p>
                <button class="btn-view-players mt-3 btn-primary text-xs" data-team-id="${t.id}">Ver jugadores</button>
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
