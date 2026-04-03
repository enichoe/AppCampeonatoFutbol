import { supabase } from '../services/supabase.js'
import { generateSlug } from '../utils/tournamentEngine.js'
import { parsearFechaLocal, formatearFecha, formatearFechaHora } from '../utils/fechas.js'

/**
 * Finaliza un torneo y guarda la foto del campeón
 */
export async function finalizarTorneo(torneoId, { equipoCampeonId, fotoUrl } = {}) {
  
  // Subir foto primero si existe
  let fotoCampeonUrl = null
  if (fotoUrl instanceof File) {
    fotoCampeonUrl = await subirFotoCampeon(torneoId, fotoUrl)
    if (!fotoCampeonUrl) return false // error ya mostrado en subirFotoCampeon
  }

  const payload = {
    estado:       'finalizado',
    finalizado_at: new Date().toISOString()
  }

  // Solo agregar al payload si tienen valor — evitar enviar null
  // a columnas que Supabase aún no reconoce en cache
  if (equipoCampeonId) payload.campeon_equipo_id = equipoCampeonId
  if (fotoCampeonUrl)  payload.foto_campeon_url  = fotoCampeonUrl

  const { error } = await supabase
    .from('torneos')
    .update(payload)
    .eq('id', torneoId)
    .eq('user_id', (await supabase.auth.getUser()).data.user.id)

  if (error) {
    console.error('Error al finalizar:', error)
    mostrarToast('Error al finalizar: ' + error.message, 'error')
    return false
  }

  mostrarToast('Torneo finalizado correctamente', 'success')
  return true
}

/**
 * Sube la foto del campeón al Storage
 */
export async function subirFotoCampeon(torneoId, archivo) {
  const ext  = archivo.name.split('.').pop().toLowerCase()
  const path = `campeones/${torneoId}-${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('torneos')          // nombre exacto del bucket en Supabase
    .upload(path, archivo, {
      upsert:      true,
      contentType: archivo.type
    })

  if (uploadError) {
    console.error('Upload error:', uploadError)
    mostrarToast('Error al subir la foto: ' + uploadError.message, 'error')
    return null
  }

  const { data } = supabase.storage
    .from('torneos')
    .getPublicUrl(path)

  return data.publicUrl
}

/**
 * Muestra una notificación rápida
 */
function mostrarToast(mensaje, tipo = 'info') {
    // Reutilizamos la función de Matches o implementamos una básica si no está disponible globalmente
    if (window.mostrarToast) return window.mostrarToast(mensaje, tipo)
    alert(mensaje)
}

export const renderTournaments = async (container) => {
  container.innerHTML = `
     <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 class="text-4xl font-black text-white italic tracking-tighter uppercase">Panel de Control</h2>
          <p class="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Gestiona y automatiza tus campeonatos</p>
        </div>
        <button id="btnCreateTournament" class="btn-primary !h-14 !px-10 shadow-indigo-600/40 hover:scale-105 transition-transform group">
          <svg class="w-5 h-5 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span class="uppercase tracking-[0.2em] text-[10px] font-black ml-2">Nuevo Torneo</span>
        </button>
     </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div class="p-6 bg-slate-900/50 border border-white/5 rounded-3xl">
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Ligas</p>
            <p class="text-3xl font-black italic text-white" id="statTotal">--</p>
        </div>
        <div class="p-6 bg-slate-900/50 border border-white/5 rounded-3xl">
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Equipos</p>
            <p class="text-3xl font-black italic text-white" id="statTeams">--</p>
        </div>
        <div class="p-6 bg-slate-900/50 border border-indigo-500/20 rounded-3xl bg-indigo-500/5">
            <p class="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Plan Actual</p>
            <p class="text-xl font-black italic text-white uppercase tracking-tighter mt-2">Free Edition</p>
        </div>
        <div class="p-6 bg-slate-900/50 border border-white/5 rounded-3xl">
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Uptime</p>
            <p class="text-xl font-black italic text-emerald-400 uppercase tracking-tighter mt-2">Sistema OK</p>
        </div>
    </div>

    <!-- Lista de Torneos -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="tournamentList">
        <div class="col-span-full py-20 flex flex-col items-center justify-center text-slate-600">
            <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 mb-4"></div>
            <p class="text-[10px] font-black uppercase tracking-widest">Sincronizando datos...</p>
        </div>
    </div>

    <!-- Modal de Creación -->
    <div id="tournamentModal" class="hidden fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 bg-slate-950/95 backdrop-blur-xl transition-all duration-300">
        <div class="card w-full h-full md:h-auto md:max-w-2xl shadow-2xl scale-95 opacity-0 transition-all duration-300 rounded-none md:rounded-[3rem] flex flex-col p-8 md:p-12 relative overflow-hidden" id="modalContainer">
            <!-- Background Glow -->
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full"></div>
            
            <div class="flex justify-between items-center mb-10 relative z-10">
                <div>
                   <h3 class="text-3xl font-black italic uppercase tracking-tighter">Crear Campeonato</h3>
                   <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">Configuración profesional en 3 pasos</p>
                </div>
                <button id="closeModal" class="p-4 bg-white/5 rounded-3xl text-slate-500 hover:text-white transition-colors border border-white/5">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>

            <form id="tournamentForm" class="space-y-10 relative z-10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="space-y-6">
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">1. Nombre del Torneo</label>
                            <input type="text" name="nombre" placeholder="Ej: Copa de Verano 2026" required class="form-input !bg-slate-900/50">
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">2. Sistema de Juego</label>
                            <select id="selectTipo" name="tipo" class="form-input !bg-slate-900/50">
                                <option value="liga">🏆 Formato Liga (Puntos)</option>
                                <option value="grupos_eliminatoria">🔥 Grupos + Eliminatoria</option>
                                <option value="eliminatoria">⚔️ Eliminación Directa</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div>
                            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">3. Identidad Visual (Opcional)</label>
                            <div class="flex items-center gap-4 p-4 bg-slate-900/50 rounded-2xl border border-dashed border-white/10 group hover:border-indigo-500/30 transition-colors">
                                <div id="logoPreview" class="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/5">
                                    <svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <div class="flex-1">
                                    <input type="file" id="inputLogo" name="logo" accept="image/*" class="hidden">
                                    <button type="button" onclick="document.getElementById('inputLogo').click()" class="text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300">
                                        Elegir Logo
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div id="extraConfig" class="p-6 bg-indigo-600/5 rounded-[2rem] border border-white/5 space-y-4">
                             <div class="flex items-center justify-between">
                                 <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Partidos Ida/Vuelta</span>
                                 <label class="relative inline-flex items-center cursor-pointer">
                                     <input type="checkbox" name="ida_vuelta" class="sr-only peer">
                                     <div class="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                 </label>
                             </div>
                             <div class="h-px bg-white/5"></div>
                             <div>
                                 <label class="text-[9px] font-black uppercase tracking-widest text-slate-500 block mb-2">📍 Ubicación (Ciudad/Sede)</label>
                                 <input type="text" name="lugar" placeholder="Ej: Lima, Perú" class="form-input !bg-slate-900/50 !text-xs !py-3" required>
                             </div>
                             <div class="flex items-center justify-between">
                                 <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">🌐 Listado Público</span>
                                 <label class="relative inline-flex items-center cursor-pointer">
                                     <input type="checkbox" name="is_public" checked class="sr-only peer">
                                     <div class="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                 </label>
                             </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col md:flex-row gap-4 pt-10 border-t border-white/5">
                    <button type="submit" id="btnSubmitTournament" class="btn-primary flex-1 !h-14 font-black uppercase tracking-[0.2em] text-xs shadow-indigo-600/20">Finalizar y Lanzar Torneo ➔</button>
                    <button type="button" class="btn-secondary !h-14 px-10 border-transparent text-slate-500" id="cancelModal">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Success Message -->
    <div id="successOverlay" class="hidden fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-2xl animate-fade-in">
        <div class="text-center max-w-sm">
            <div class="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/40 animate-bounce">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 class="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">¡TORNEO CREADO!</h3>
            <p class="text-slate-400 text-sm font-bold uppercase tracking-widest mb-10">Tu campeonato ha sido configurado exitosamente. Ya puedes empezar a inscribir equipos.</p>
            <button id="btnGoToTournament" class="btn-primary w-full !h-14 font-black uppercase tracking-[0.2em] text-[10px]">Ir al Panel del Torneo</button>
        </div>
    </div>
  `

  const listContainer = document.getElementById('tournamentList')
  const modal = document.getElementById('tournamentModal')
  const modalContainer = document.getElementById('modalContainer')
  const successOverlay = document.getElementById('successOverlay')

  const loadTournaments = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('torneos')
      .select('*')
      .is('deleted_at', null)
      .eq('user_id', user.id) // FILTRADO MULTI-TENANT CRÍTICO
      .order('created_at', { ascending: false })

    if (error) {
       console.error(error)
       listContainer.innerHTML = '<p class="text-red-500">Error al cargar datos.</p>'
       return
    }

    // Update Stats
    document.getElementById('statTotal').innerText = data.length
    document.getElementById('statTeams').innerText = data.reduce((acc, current) => acc + (current.configuracion?.num_teams || 0), 0)

    if (data.length === 0) {
       listContainer.innerHTML = `
         <div class="col-span-full py-32 bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-10 group hover:border-indigo-500/20 transition-all cursor-pointer" onclick="document.getElementById('btnCreateTournament').click()">
            <div class="w-20 h-20 bg-indigo-600/10 rounded-[2rem] flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 transition-transform">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
            </div>
            <h4 class="text-2xl font-black italic text-white uppercase tracking-tighter mb-2">Aún no tienes torneos creados</h4>
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digitaliza tu primera liga hoy mismo</p>
         </div>
       `
       return
    }

    listContainer.innerHTML = data.map(t => {
      const publicLink = `${window.location.origin}/torneo/${t.slug || t.id}`
      return `
        <div class="card !p-0 overflow-hidden border-white/5 bg-slate-900/40 hover:bg-slate-900 group transition-all duration-500 rounded-[2.5rem]">
             <div class="relative h-40 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-950 flex items-center justify-center p-8 overflow-hidden">
                <div class="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                ${t.logo_url 
                  ? `<img src="${t.logo_url}" class="w-24 h-24 object-contain drop-shadow-2xl z-10 transition-transform duration-700 group-hover:scale-110" alt="Logo">`
                  : `<div class="w-20 h-20 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-3xl font-black text-indigo-500 z-10 shadow-2xl">${t.nombre.charAt(0).toUpperCase()}</div>`
                }
                
                <div class="absolute top-5 right-5 z-20 flex gap-2">
                   <button class="p-3 bg-white/5 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-2xl btn-copy transition-all group/btn" data-link="${publicLink}" title="Copiar Link Público">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                   </button>
                   <button class="p-3 bg-white/5 hover:bg-red-600 text-slate-400 hover:text-white rounded-2xl btn-delete transition-all" data-id="${t.id}">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                   </button>
                </div>
             </div>
             <div class="p-8">
                <div class="flex items-center gap-3 mb-4">
                   <span class="text-[9px] font-black uppercase bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">${t.tipo.replace('_', ' ')}</span>
                   <span class="text-[9px] font-black text-slate-600 uppercase tracking-widest">${t.estado || 'Activo'}</span>
                </div>
                <h3 class="text-2xl font-black text-white italic line-clamp-1 uppercase tracking-tighter mb-2">${t.nombre}</h3>
                <p class="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">SLUG: <span class="text-slate-400">${t.slug || '---'}</span></p>
                <div class="flex gap-4">
                    <button class="btn-primary flex-1 !h-14 !text-[10px] font-black btn-details uppercase tracking-[0.2em] shadow-indigo-600/10" data-id="${t.id}">
                        Gestionar Liga ➔
                    </button>
                </div>
             </div>
        </div>
      `
    }).join('')

    // Events
    document.querySelectorAll('.btn-copy').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation()
            navigator.clipboard.writeText(btn.dataset.link)
            const originalIcon = btn.innerHTML
            btn.innerHTML = '<svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>'
            setTimeout(() => btn.innerHTML = originalIcon, 2000)
        }
    })

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.onclick = async (e) => {
           e.stopPropagation()
           if(confirm('¿ELIMINAR TORNEO?')) {
              await supabase.from('torneos').update({ deleted_at: new Date() }).eq('id', btn.dataset.id)
              loadTournaments()
           }
        }
    })

    document.querySelectorAll('.btn-details').forEach(btn => {
        btn.onclick = () => window.navigate('detalle_torneo', btn.dataset.id)
    })
  }

  const inputLogo = document.getElementById('inputLogo')
  const logoPreview = document.getElementById('logoPreview')

  inputLogo.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert('Máximo 2MB')
      const reader = new FileReader()
      reader.onload = (event) => {
        logoPreview.innerHTML = '<img src="' + event.target.result + '" class="w-full h-full object-cover">'
      }
      reader.readAsDataURL(file)
    }
  }

  document.getElementById('btnCreateTournament').onclick = () => {
    modal.classList.remove('hidden')
    setTimeout(() => modalContainer.classList.remove('scale-95', 'opacity-0'), 10)
  }

  const closeModal = () => {
    modalContainer.classList.add('scale-95', 'opacity-0')
    setTimeout(() => modal.classList.add('hidden'), 300)
  }

  document.getElementById('closeModal').onclick = closeModal
  document.getElementById('cancelModal').onclick = closeModal

  document.getElementById('tournamentForm').onsubmit = async (e) => {
    e.preventDefault()
    const btnSubmit = document.getElementById('btnSubmitTournament')
    btnSubmit.disabled = true
    btnSubmit.innerHTML = '<span class="animate-spin rounded-full h-4 w-4 border-t-2 border-white mr-2 inline-block"></span> PROCESANDO...'

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Usuario no identificado')

        const formData = new FormData(e.target)
        let logo_url = null
        
        // Generar Slug SEO-Friendly (Async)
        const slug = await generateSlug(formData.get('nombre'))

        if (inputLogo.files[0]) {
          const file = inputLogo.files[0]
          const fileName = user.id + '/' + Date.now() + '-' + file.name
          const { error: upError } = await supabase.storage.from('logos').upload(fileName, file)
          if (upError) throw upError
          logo_url = supabase.storage.from('logos').getPublicUrl(fileName).data.publicUrl
        }

        const nuevoTorneo = {
            user_id: user.id,
            nombre: formData.get('nombre').trim(),
            slug: slug,
            tipo: formData.get('tipo'),
            lugar: formData.get('lugar'),
            is_public: formData.get('is_public') === 'on',
            logo_url,
            configuracion: {
                ida_vuelta: formData.get('ida_vuelta') === 'on'
            }
        }

        const { data, error } = await supabase.from('torneos').insert([nuevoTorneo]).select()
        if (error) throw error

        successOverlay.classList.remove('hidden')
        document.getElementById('btnGoToTournament').onclick = () => {
            successOverlay.classList.add('hidden')
            window.navigate('detalle_torneo', data[0].id)
        }

        closeModal()
        loadTournaments()
        e.target.reset()
        logoPreview.innerHTML = '<svg class="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>'
    } catch (err) {
      console.error(err)
      alert("Error: " + err.message)
    } finally {
        btnSubmit.disabled = false
        btnSubmit.innerText = 'Finalizar y Lanzar Torneo ➔'
    }
  }

  loadTournaments()
}
