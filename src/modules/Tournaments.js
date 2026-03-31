import { supabase } from '../services/supabase.js'
import { generateSlug } from '../utils/tournamentEngine.js'

export const renderTournaments = async (container) => {
  container.innerHTML = `
     <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 class="text-3xl font-black text-white italic tracking-tighter uppercase">Mis Torneos</h2>
          <p class="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Gestión centralizada de campeonatos</p>
        </div>
        <button id="btnCreateTournament" class="btn-primary w-full md:w-auto shadow-indigo-600/40">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span class="uppercase tracking-widest text-xs">Nuevo Torneo</span>
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
    <div id="tournamentModal" class="hidden fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 bg-slate-950/95 backdrop-blur-xl transition-all duration-300">
        <div class="card w-full h-full md:h-auto md:max-w-xl shadow-2xl scale-95 opacity-0 transition-all duration-300 rounded-none md:rounded-[2.5rem] flex flex-col" id="modalContainer">
            <div class="flex justify-between items-center mb-8 p-6 md:p-0">
                <div>
                   <h3 class="text-2xl font-black italic uppercase tracking-tighter">Configurar Torneo</h3>
                   <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Define las reglas de tu competición</p>
                </div>
                <button id="closeModal" class="p-3 bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <form id="tournamentForm" class="space-y-8 p-6 md:p-0 flex-grow overflow-y-auto no-scrollbar">
                <div class="space-y-6">
                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Nombre del Torneo</label>
                        <input type="text" name="nombre" placeholder="Ej: Copa Master 2026" required class="form-input">
                    </div>

                    <!-- Upload Logo Section -->
                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Identidad Visual (Logo)</label>
                        <div class="flex items-center gap-6 p-6 bg-slate-900/50 rounded-[2rem] border border-dashed border-white/10">
                            <div id="logoPreview" class="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/5 shadow-xl">
                                <svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            </div>
                            <div class="flex-1">
                                <input type="file" id="inputLogo" name="logo" accept="image/*" class="hidden">
                                <button type="button" onclick="document.getElementById('inputLogo').click()" class="text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white px-5 py-3 rounded-xl transition-all border border-white/5">
                                    Subir Imagen
                                </button>
                                <p class="text-[9px] font-bold text-slate-600 mt-2 uppercase tracking-tight">Recomendado: 512x512px • PNG/JPG</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Sistema de Juego</label>
                        <select id="selectTipo" name="tipo" class="form-input bg-slate-900">
                            <option value="liga">🏆 Liga Profesional (Puntos)</option>
                            <option value="grupos_eliminatoria">🔥 Grupos + Play-offs</option>
                            <option value="eliminatoria">⚔️ Eliminación Directa</option>
                        </select>
                    </div>

                    <div id="configGrupos" class="hidden grid grid-cols-2 gap-4 p-6 bg-indigo-600/5 rounded-[2rem] border border-indigo-500/10 animate-fade-in">
                        <div>
                            <label class="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Núm. Grupos</label>
                            <input type="number" name="num_groups" value="4" class="form-input !bg-slate-950/50">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Clasificados</label>
                            <input type="number" name="clasificados" value="2" class="form-input !bg-slate-950/50">
                        </div>
                    </div>

                    <div class="p-6 bg-white/5 rounded-[2rem] border border-white/5">
                        <label class="flex items-center justify-between cursor-pointer group">
                             <span class="text-xs font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">Partidos de Ida y Vuelta</span>
                             <div class="relative">
                                 <input type="checkbox" name="ida_vuelta" class="hidden peer">
                                 <div class="w-12 h-6 bg-slate-800 rounded-full relative peer-checked:bg-indigo-500 transition-all after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-6 shadow-inner"></div>
                             </div>
                        </label>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row gap-4 pt-6 md:pt-8 border-t border-white/5">
                    <button type="submit" id="btnSubmitTournament" class="btn-primary flex-1 shadow-indigo-600/20 uppercase text-xs tracking-widest">Crear Torneo Oficial</button>
                    <button type="button" class="btn-secondary px-8 border-transparent" id="cancelModal">Descartar</button>
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
      <div class="card glass-hover group flex flex-col justify-between h-full overflow-hidden border-white/5 !p-0">
           <div class="relative h-32 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950 flex items-center justify-center p-6 overflow-hidden">
              <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
              ${t.logo_url 
                ? `<img src="${t.logo_url}" class="w-24 h-24 object-contain drop-shadow-2xl z-10 transition-transform duration-500 group-hover:scale-110" alt="Logo">`
                : `<div class="w-20 h-20 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-3xl font-black text-indigo-500 z-10">${t.nombre.charAt(0).toUpperCase()}</div>`
              }
              <div class="absolute top-4 right-4 z-20">
                 <button class="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl btn-delete transition-all opacity-0 group-hover:opacity-100" data-id="${t.id}"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
              </div>
           </div>
           
           <div class="p-6 space-y-4">
              <div>
                  <div class="flex items-center gap-2 mb-2">
                     <span class="badge badge-pending text-[8px] font-black">${t.tipo.replace('_', ' ')}</span>
                     <span class="text-[9px] font-bold text-slate-600 uppercase tracking-widest">${t.estado || 'Configuración'}</span>
                  </div>
                  <h3 class="text-xl font-black text-white italic line-clamp-1 truncate">${t.nombre}</h3>
                  <p class="text-slate-500 text-[10px] mt-1 font-bold tracking-tighter uppercase">ID PÚBLICO: ${t.slug || '---'}</p>
              </div>
              
              <div class="pt-4 border-t border-white/5">
                  <button class="btn-primary w-full py-4 text-[10px] font-black btn-details uppercase tracking-[0.2em] shadow-indigo-600/10" data-id="${t.id}">GESTIONAR PANEL ➔</button>
              </div>
           </div>
      </div>
    `).join('')

    // Eventos
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = async () => {
           if(confirm('¿Estás seguro de eliminar este torneo? Esta acción no se puede deshacer.')) {
              await supabase.from('torneos').update({ deleted_at: new Date() }).eq('id', btn.dataset.id)
              loadTournaments()
           }
        }
    })

    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.onclick = () => window.navigate('detalle_torneo', btn.dataset.id)
    })
  }

  // Lógica de Preview de Logo
  const inputLogo = document.getElementById('inputLogo')
  const logoPreview = document.getElementById('logoPreview')

  inputLogo.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validaciones: tipo y tamaño
      if (!file.type.startsWith('image/')) {
        alert('El archivo seleccionado no es una imagen válida.')
        inputLogo.value = ''
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Máximo 2MB.')
        inputLogo.value = ''
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        logoPreview.innerHTML = `<img src="${event.target.result}" class="w-full h-full object-cover">`
      }
      reader.readAsDataURL(file)
    }
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

  document.getElementById('cancelModal').onclick = () => {
    modalContainer.classList.add('scale-95', 'opacity-0')
    setTimeout(() => modal.classList.add('hidden'), 300)
  }

  document.getElementById('selectTipo').onchange = (e) => {
    document.getElementById('configGrupos').classList.toggle('hidden', e.target.value !== 'grupos_eliminatoria')
  }

  document.getElementById('tournamentForm').onsubmit = async (e) => {
    e.preventDefault()
    const btnSubmit = document.getElementById('btnSubmitTournament')
    btnSubmit.disabled = true
    btnSubmit.innerHTML = `<span class="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2"></span> Creando...`

    try {
        const userRes = await supabase.auth.getUser()
        const user = userRes?.data?.user
        if (!user) {
            throw new Error('Debes iniciar sesión para crear un torneo.')
        }
        const formData = new FormData(e.target)
        let logo_url = null

        // Subir logo si existe
        const logoFile = inputLogo.files[0]
        if (logoFile) {
          const fileExt = logoFile.name.split('.').pop()
          const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
          const filePath = `${user.id}/${fileName}`

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('logos')
            .upload(filePath, logoFile, { cacheControl: '3600', upsert: false, contentType: logoFile.type })

          if (uploadError) throw new Error('Error al subir el logo: ' + uploadError.message)

          const { data: publicData } = supabase.storage
            .from('logos')
            .getPublicUrl(filePath)
            
          logo_url = publicData?.publicUrl || null
        }

        const newTournament = {
            user_id: user.id,
            nombre: formData.get('nombre'),
            slug: generateSlug(formData.get('nombre')),
            tipo: formData.get('tipo'),
            logo_url: logo_url,
            configuracion: {
                num_grupos: parseInt(formData.get('num_grupos')) || 0,
                clasificados: parseInt(formData.get('clasificados')) || 0,
                ida_vuelta: formData.get('ida_vuelta') === 'on'
            }
        }

        const { error } = await supabase.from('torneos').insert([newTournament])
        if (error) {
          // si hubo upload previo, intentar limpiar el archivo subido
          try {
            if (logo_url && typeof filePath !== 'undefined') {
              await supabase.storage.from('logos').remove([filePath])
            }
          } catch (remErr) {
            console.warn('No se pudo eliminar archivo huérfano:', remErr.message || remErr)
          }
          throw error
        }

        modalContainer.classList.add('scale-95', 'opacity-0')
        setTimeout(() => modal.classList.add('hidden'), 300)
        loadTournaments()
        e.target.reset()
        logoPreview.innerHTML = `<svg class="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`
    } catch (err) {
      // Mostrar detalles útiles de RLS o errores de Supabase
      console.error(err)
      const message = err?.message || (err?.error && err.error.message) || JSON.stringify(err)
      alert(message)
    } finally {
        btnSubmit.disabled = false
        btnSubmit.innerText = 'Crear Torneo'
    }
  }

  loadTournaments()
}
