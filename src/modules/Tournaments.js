import { supabase } from '../services/supabase.js'
import { generateSlug } from '../utils/tournamentEngine.js'

export const renderTournaments = async (container) => {
  container.innerHTML = `
    <div class="flex items-center justify-between mb-8">
       <div>
         <h2 class="text-3xl font-extrabold text-white">Gestión de Torneos</h2>
         <p class="text-slate-500 mt-1">Crea, edita y organiza tus ligas o copas.</p>
       </div>
       <button id="btnCreateTournament" class="btn-primary animate-pulse py-3">
         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
         <span>Nuevo Torneo</span>
       </button>
    </div>

    <!-- Filtros Rápidos -->
    <div class="flex gap-4 mb-8">
       <button class="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold border border-indigo-500/20">Todos</button>
       <button class="px-4 py-2 hover:bg-slate-800 text-slate-500 rounded-full text-xs font-bold border border-slate-700/50 transition-all">Activos</button>
       <button class="px-4 py-2 hover:bg-slate-800 text-slate-500 rounded-full text-xs font-bold border border-slate-700/50 transition-all">Finalizados</button>
    </div>

    <!-- Lista de Torneos -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="tournamentList">
        <div class="col-span-full py-20 flex flex-col items-center justify-center text-slate-600">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 mb-4"></div>
            <p>Cargando torneos...</p>
        </div>
    </div>

    <!-- Modal de Creación -->
    <div id="tournamentModal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm transition-all duration-300">
        <div class="card w-full max-w-xl shadow-2xl scale-95 opacity-0 transition-all duration-300" id="modalContainer">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold">Crear Nuevo Torneo</h3>
                <button id="closeModal" class="text-slate-500 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <form id="tournamentForm" class="space-y-6">
                <div class="grid grid-cols-1 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre del Torneo</label>
                        <input type="text" name="nombre" placeholder="Ej: Champions League 2026" required class="form-input">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Tipo de Torneo</label>
                        <select id="selectTipo" name="tipo" class="form-input appearance-none bg-slate-800">
                            <option value="liga">Modo Liga (Todos contra todos)</option>
                            <option value="grupos_eliminatoria">Grupos + Eliminación (FIFA Style)</option>
                            <option value="eliminatoria">Eliminatoria Directa</option>
                        </select>
                    </div>

                    <div id="configGrupos" class="hidden grid grid-cols-2 gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 animate-fade-in">
                        <div>
                            <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Núm. de Grupos</label>
                            <input type="number" name="num_grupos" value="4" class="form-input">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Clasificados x Grupo</label>
                            <input type="number" name="clasificados" value="2" class="form-input">
                        </div>
                    </div>

                    <div class="flex items-center gap-6 p-4">
                        <label class="flex items-center gap-2 cursor-pointer group">
                             <input type="checkbox" name="ida_vuelta" class="hidden peer">
                             <div class="w-10 h-6 bg-slate-700 rounded-full relative peer-checked:bg-indigo-600 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-4"></div>
                             <span class="text-sm font-medium text-slate-400 group-hover:text-white transition-colors">¿Ida y vuelta?</span>
                        </label>
                    </div>
                </div>
                <div class="flex gap-4 pt-4 border-t border-slate-700">
                    <button type="submit" class="btn-primary flex-1 h-12">Crear Torneo</button>
                    <button type="button" class="btn-secondary px-8 bg-transparent" id="cancelModal">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
  `

  const listContainer = document.getElementById('tournamentList')
  const modal = document.getElementById('tournamentModal')
  const modalContainer = document.getElementById('modalContainer')

  const loadTournaments = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('torneos')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })

    if (error) {
       console.error(error)
       listContainer.innerHTML = '<p class="text-red-500">Error al cargar datos.</p>'
       return
    }

    if (data.length === 0) {
       listContainer.innerHTML = `
         <div class="col-span-full py-20 bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center text-center p-10 font-bold text-slate-500 uppercase tracking-widest">
            ¡Aún no tienes torneos! Crea tu primer campeonato profesional ahora.
         </div>
       `
       return
    }

    listContainer.innerHTML = data.map(t => `
      <div class="card glass-hover group flex flex-col justify-between h-full">
           <div>
              <div class="flex items-center justify-between mb-4">
                 <span class="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase rounded-lg border border-indigo-500/10">${t.tipo}</span>
                 <div class="flex gap-2">
                    <button class="p-2 hover:bg-red-500/20 text-red-500/50 hover:text-red-500 rounded-lg btn-delete transition-all" data-id="${t.id}"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                 </div>
              </div>
              <h3 class="text-2xl font-black text-white mb-2 leading-tight">${t.nombre}</h3>
              <p class="text-slate-500 text-xs mb-6">Creado el ${new Date(t.created_at).toLocaleDateString()}</p>
           </div>
           
           <div class="pt-6 border-t border-slate-700/50 space-y-4">
               <div>
                  <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Public Slug (Fans)</p>
                  <p class="text-xs text-indigo-400 font-mono font-bold truncate">${t.slug || 'No slug generated'}</p>
               </div>
               <button class="btn-primary w-full py-3 text-xs font-black btn-details" data-id="${t.id}">GESTIONAR TORNEO</button>
           </div>
      </div>
    `).join('')

    // Eventos
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = async () => {
           if(confirm('¿Eliminar torneo?')) {
              await supabase.from('torneos').update({ deleted_at: new Date() }).eq('id', btn.dataset.id)
              loadTournaments()
           }
        }
    })

    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.onclick = () => window.navigate('detalle_torneo', btn.dataset.id)
    })
  }

  // Lógica Modal y Form
  document.getElementById('btnCreateTournament').onclick = () => {
    modal.classList.remove('hidden')
    setTimeout(() => modalContainer.classList.remove('scale-95', 'opacity-0'), 10)
  }

  document.getElementById('closeModal').onclick = () => {
    modalContainer.classList.add('scale-95', 'opacity-0')
    setTimeout(() => modal.classList.add('hidden'), 300)
  }

  document.getElementById('selectTipo').onchange = (e) => {
    document.getElementById('configGrupos').classList.toggle('hidden', e.target.value !== 'grupos_eliminatoria')
  }

  document.getElementById('tournamentForm').onsubmit = async (e) => {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    const formData = new FormData(e.target)
    const newTournament = {
      user_id: user.id,
      nombre: formData.get('nombre'),
      slug: generateSlug(formData.get('nombre')),
      tipo: formData.get('tipo'),
      configuracion: {
        num_grupos: parseInt(formData.get('num_grupos')) || 0,
        clasificados: parseInt(formData.get('clasificados')) || 0,
        ida_vuelta: formData.get('ida_vuelta') === 'on'
      }
    }

    const { error } = await supabase.from('torneos').insert([newTournament])
    if (error) alert(error.message)
    else {
        modalContainer.classList.add('scale-95', 'opacity-0')
        setTimeout(() => modal.classList.add('hidden'), 300)
        loadTournaments()
        e.target.reset()
    }
  }

  loadTournaments()
}
