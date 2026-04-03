import { supabase } from '../services/supabase.js'
import * as engine from '../utils/tournamentEngine.js'
import { uploadImage, createImageDropzone, setupDropzone } from '../utils/storage.js'
import { parsearFechaLocal, formatearFecha, formatearFechaHora } from '../utils/fechas.js'

export const renderTournamentDetail = async (container, tournamentId) => {
  let tournament = null
  let teams = []
  let activeTab = 'resumen'
  let matchesView = 'list'

  const loadInitialData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return window.navigate('auth')

    const { data: t, error: tErr } = await supabase
      .from('torneos')
      .select('*')
      .eq('id', tournamentId)
      .eq('user_id', user.id) // PROTECCIÓN DE PROPIEDAD
      .single()
    
    if (tErr || !t) {
        console.error("Acceso denegado o torneo no encontrado")
        return window.navigate('dashboard')
    }

    const { data: e } = await supabase
      .from('equipos')
      .select('*')
      .eq('torneo_id', tournamentId)
      .is('deleted_at', null)
    
    tournament = t
    teams = e
    renderFrame()
  }

  const renderFrame = () => {
    const publicUrl = `${window.location.origin}/torneo/${tournament.slug}`

    container.innerHTML = `
      <div class="space-y-10 fade-in pb-10">
          <!-- BREADCRUMBS & TITLE -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                  <nav class="flex gap-2 mb-3 text-[9px] font-black uppercase text-slate-600 tracking-[0.2em]">
                    <button id="navBack" class="hover:text-indigo-400 transition-colors">Torneos</button>
                    <span class="opacity-20 text-white">/</span>
                    <span class="text-indigo-400 italic">Panel de Control</span>
                  </nav>
                  <h1 class="text-4xl font-black text-white italic tracking-tighter uppercase leading-none truncate">${tournament.nombre}</h1>
              </div>
              <div class="flex items-center gap-3">
                  <div class="p-4 bg-slate-900 rounded-[1.5rem] border border-white/5 flex-grow md:flex-grow-0">
                     <span class="text-[9px] font-black text-slate-500 block uppercase tracking-widest mb-1.5">Enlace Público</span>
                     <div class="flex items-center gap-3">
                        <a href="${publicUrl}" target="_blank" class="text-xs text-indigo-400 font-black hover:underline tracking-tight">Ver Vista en Vivo</a>
                        <button id="btnCopyLink" class="p-2 bg-white/5 rounded-lg hover:text-white transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></button>
                     </div>
                  </div>
              </div>
          </div>

          <!-- TABS PRINCIPALES (Scrolleables) -->
          <nav class="flex border-b border-white/5 overflow-x-auto no-scrollbar scroll-smooth -mx-5 px-5">
              <button class="tab-btn ${activeTab === 'resumen' ? 'active' : ''}" data-tab-id="resumen">Resumen</button>
              <button class="tab-btn ${activeTab === 'equipos' ? 'active' : ''}" data-tab-id="equipos">Equipos</button>
              <button class="tab-btn ${activeTab === 'partidos' ? 'active' : ''}" data-tab-id="partidos">Partidos</button>
              <button class="tab-btn ${activeTab === 'hall_of_fame' ? 'active' : ''}" data-tab-id="hall_of_fame">Reconocimientos</button>
              <button class="tab-btn ${activeTab === 'estadios' ? 'active' : ''}" data-tab-id="estadios">Estadios</button>
              <button class="tab-btn ${activeTab === 'config' ? 'active' : ''}" data-tab-id="config">Ajustes</button>
          </nav>

          <div id="tab-container" class="slide-up">
              <!-- El contenido se carga aquí -->
          </div>
      </div>
    <div id="finalizeModal" class="hidden fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl transition-all duration-300">
        <div class="w-full max-w-lg card border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.2)]">
            <div class="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
                <div>
                   <h3 class="text-2xl font-black italic uppercase tracking-tighter text-white">🏆 Clausura Oficial</h3>
                   <p class="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">Registra al Campeón y la Galería del Torneo</p>
                </div>
                <button onclick="document.getElementById('finalizeModal').classList.add('hidden')" class="text-slate-500 hover:text-white text-2xl">&times;</button>
            </div>
            
            <form id="finalizeForm" class="space-y-6">
                <div>
                    <label class="text-[10px] font-black italic uppercase tracking-widest text-slate-500 block mb-2">Seleccionar Campeón</label>
                    <select name="campeon_nombre" class="form-input text-xs" required>
                        <option value="">Selecciona un equipo...</option>
                        ${teams.map(e => `<option value="${e.nombre}">${e.nombre}</option>`).join('')}
                    </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${createImageDropzone('final_foto_campeon', 'Foto Celebración', true)}
                    ${createImageDropzone('final_foto_trofeo', 'Foto Trofeo', true)}
                </div>

                <div>
                    <label class="text-[10px] font-black italic uppercase tracking-widest text-slate-500 block mb-2">Dedicatoria / Frase del Torneo</label>
                    <textarea name="frase_campeon" class="form-input h-20 text-xs" placeholder="Escribe un mensaje para el campeón..."></textarea>
                </div>

                <div class="pt-4 flex gap-4">
                    <button type="button" onclick="document.getElementById('finalizeModal').classList.add('hidden')" class="btn-secondary flex-1 py-4 text-xs font-black italic">CANCELAR</button>
                    <button type="submit" id="btnConfirmFinalize" class="btn-primary flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-xs font-black italic">FINALIZAR TORNEO 🏁</button>
                </div>
            </form>
        </div>
    </div>
    `

    // Eventos de Tab
    container.querySelectorAll('.tab-btn').forEach(btn => {
        btn.onclick = () => {
            activeTab = btn.dataset.tabId
            renderFrame()
        }
    })

    document.getElementById('navBack').onclick = () => window.navigate('torneos')

    document.getElementById('btnCopyLink').onclick = () => {
        navigator.clipboard.writeText(publicUrl)
        alert('Copiado al portapapeles')
    }

    window.addEventListener('resultado-guardado', () => {
        if (activeTab === 'resumen' || activeTab === 'partidos') renderTabContent()
    })

    renderTabContent()
  }

  const renderTabContent = async () => {
    const tabContainer = document.getElementById('tab-container')
    
    switch (activeTab) {
        case 'resumen':
            renderResumen(tabContainer)
            break
        case 'equipos':
            renderEquipos(tabContainer)
            break
        case 'partidos':
            renderPartidos(tabContainer)
            break
        case 'hall_of_fame':
            renderHallOfFame(tabContainer)
            break
        case 'estadios':
            renderEstadios(tabContainer)
            break
        case 'config':
            renderConfig(tabContainer)
            break
    }
  }

  const renderResumen = async (el) => {
    const { data: todosLosPartidos } = await supabase.from('partidos').select('*').eq('torneo_id', tournamentId)
    const fasesData = await engine.obtenerFases(tournamentId)
    
    const faseGruposTotal = fasesData['grupos']?.total || 0
    const faseGruposFin = fasesData['grupos']?.finalizados || 0
    const faseGruposFinalizada = faseGruposTotal > 0 && faseGruposTotal === faseGruposFin
    
    const tieneEliminatoria = todosLosPartidos?.some(p => p.fase !== 'grupos')
    
    const fasesNombre = ['octavos', 'cuartos', 'semifinales', 'final']
    let faseActual = 'grupos'
    if (tieneEliminatoria) {
        for (const f of fasesNombre) {
            if (todosLosPartidos.some(p => p.fase === f)) faseActual = f
        }
    }

    const completadosFaseActual = fasesData[faseActual]?.finalizados || 0
    const totalFaseActual = fasesData[faseActual]?.total || 0
    const progreso = totalFaseActual > 0 ? (completadosFaseActual / totalFaseActual) * 100 : 0
    const faseActualFinalizada = totalFaseActual > 0 && completadosFaseActual === totalFaseActual

    el.innerHTML = `
        <div class="space-y-10 fade-in">
            ${(() => {
                const unprog = todosLosPartidos?.filter(p => !p.fecha_hora).length || 0
                if (unprog > 0 && tournament.estado !== 'configuracion' && tournament.estado !== 'finalizado') {
                    return `
                    <div id="fixtureBannerResumen" class="p-8 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 relative overflow-hidden group">
                        <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        <div class="flex items-center gap-6 text-white text-center md:text-left relative z-10">
                            <div class="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[1.5rem] flex items-center justify-center text-3xl shrink-0 shadow-inner">📅</div>
                            <div>
                                <h4 class="text-xl font-black italic uppercase tracking-tighter leading-tight">Acción Requerida: Programa tu Fixture</h4>
                                <p class="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em] mt-1.5 opacity-80">Hay ${unprog} partidos sin fecha ni lugar asignado.</p>
                            </div>
                        </div>
                        <button id="btnGoSchedule" class="relative z-10 px-8 py-5 bg-white text-indigo-950 rounded-2xl text-[10px] font-black uppercase italic tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95 w-full md:w-auto">Completar Calendario ➔</button>
                    </div>
                    `
                }
                return ''
            })()}

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Estado Card -->
                <div class="card !p-8 bg-indigo-600/10 border-indigo-500/20 shadow-indigo-500/5 flex flex-col items-center justify-center text-center">
                    <p class="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Estado del Torneo</p>
                    <div class="flex items-center gap-3">
                        <span class="live-indicator"><span></span><span></span></span>
                        <h3 class="text-3xl font-black text-white uppercase italic tracking-tighter">${tournament.estado.replace('_', ' ')}</h3>
                    </div>
                </div>

                <!-- Progreso Card -->
                <div class="card !p-8 bg-slate-900/40">
                    <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 text-center">Progreso de la Fase: ${faseActual.toUpperCase()}</p>
                    <div class="w-full bg-slate-950 h-3 rounded-full overflow-hidden mb-4 p-0.5 border border-white/5">
                        <div class="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.5)]" style="width: ${progreso}%"></div>
                    </div>
                    <p class="text-[10px] text-center font-black text-slate-400 uppercase tracking-widest">${completadosFaseActual} de ${totalFaseActual} encuentros finalizados</p>
                </div>

                <!-- Config Card -->
                <div class="card !p-8 bg-slate-900/40">
                    <p class="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 text-center">Estructura del Torneo</p>
                    <div class="flex flex-col items-center">
                        <span class="text-2xl font-black text-white italic uppercase tracking-tighter">${tournament.tipo.replace('_', ' ')}</span>
                        <div class="flex items-center gap-2 mt-2">
                           <span class="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-slate-300 uppercase">${teams.length} EQUIPOS</span>
                           <span class="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-slate-300 uppercase">${tournament.configuracion.num_groups || tournament.configuracion.num_grupos || '?'} GRUPOS</span>
                        </div>
                    </div>
                </div>
            </div>

        <!-- SCHEDULING SUMMARY -->
        <div class="mt-8">
            <div class="card bg-slate-900/60 border-indigo-500/10">
                <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400">📅</div>
                        <div>
                            <h4 class="text-sm font-black italic uppercase text-white tracking-widest">Estado de Programación</h4>
                            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Fecha, Hora y Campo de juego</p>
                        </div>
                    </div>
                    
                    <div class="flex-1 max-w-md w-full">
                        ${(() => {
                            const prog = todosLosPartidos?.filter(p => p.fecha_hora).length || 0
                            const total = todosLosPartidos?.length || 0
                            const perc = total > 0 ? (prog / total) * 100 : 0
                            return `
                            <div class="flex justify-between items-end mb-2">
                                <span class="text-[10px] font-black italic text-slate-400 uppercase tracking-widest">${prog} de ${total} Partidos programados</span>
                                <span class="text-[10px] font-black italic text-indigo-400 uppercase tracking-widest">${Math.round(perc)}%</span>
                            </div>
                            <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-1000" style="width: ${perc}%"></div>
                            </div>
                            `
                        })()}
                    </div>

                    <div class="text-right">
                        ${(() => {
                            const unprog = todosLosPartidos?.filter(p => !p.fecha_hora).length || 0
                            if (unprog === 0 && todosLosPartidos?.length > 0) return '<span class="px-4 py-2 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase italic rounded-full border border-emerald-500/20 tracking-widest">✅ Torneo programado</span>'
                            if (unprog === todosLosPartidos?.length && unprog > 0) return '<span class="px-4 py-2 bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase italic rounded-full border border-amber-500/20 tracking-widest">⚠️ Sin programación inicial</span>'
                             return `<button id="btnGoScheduleMini" class="text-[10px] font-black text-indigo-400 hover:text-white uppercase italic tracking-widest transition-colors">Ver Partidos Pendientes ➔</button>`
                        })()}
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
                <div id="mini-tables" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
                ${tieneEliminatoria ? `
                    <div class="card !bg-slate-900 border-indigo-500/10 shadow-2xl">
                        <h4 class="font-bold border-b border-slate-700 pb-4 mb-6 uppercase text-[10px] tracking-widest flex items-center gap-2">
                            <span class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                            Bracket Eliminatoria
                        </h4>
                        <div id="bracket-view" class="space-y-8"></div>
                    </div>
                ` : ''}
            </div>
            
            <div class="card h-fit sticky top-10 bg-slate-900 shadow-2xl border-indigo-500/10">
                <div class="p-2 mb-6 border-b border-white/5 flex items-center justify-between">
                   <h4 class="font-black italic text-xs uppercase tracking-[0.2em] text-slate-500">Master Control</h4>
                   <span class="live-indicator"><span></span><span></span></span>
                </div>
                <div class="space-y-4">
                    ${tournament.estado === 'configuracion' ? `
                        <button id="btnStartFlow" class="btn-primary w-full shadow-indigo-600/30 uppercase text-[10px] font-black italic tracking-widest bg-indigo-600">INICIAR SORTEO DE EQUIPOS 🎲</button>
                    ` : ''}
                    ${tournament.estado === 'sorteo' ? `
                        <button id="btnFixtureFlow" class="btn-primary w-full bg-emerald-600 hover:bg-emerald-500 text-[10px] font-black italic uppercase tracking-widest">ACTIVAR CALENDARIO (FIXTURE) ➔</button>
                    ` : ''}
                    ${faseGruposFinalizada && !tieneEliminatoria && tournament.tipo === 'grupos_eliminatoria' && tournament.estado !== 'finalizado' ? `
                        <button id="btnGenerarEliminatoria" class="btn-primary w-full bg-amber-600 hover:bg-amber-500 text-[10px] font-black italic uppercase tracking-widest">SORTEAR LLAVES ELIMINATORIA ⚡</button>
                    ` : ''}
                    ${tieneEliminatoria && faseActualFinalizada && faseActual !== 'final' && tournament.estado !== 'finalizado' ? `
                        <button id="btnAvanzarFase" class="btn-primary w-full bg-blue-600 hover:bg-blue-500 text-[10px] font-black italic uppercase tracking-widest">AVANZAR A ${fasesNombre[fasesNombre.indexOf(faseActual) + 1]?.toUpperCase() || 'SIGUIENTE RONDA'} ➔</button>
                    ` : ''}
                    ${(faseActual === 'final' && faseActualFinalizada) || (tournament.tipo === 'liga' && faseGruposFinalizada) ? `
                        <div class="p-8 bg-gradient-to-br from-emerald-600/20 to-transparent rounded-[2rem] border border-emerald-500/20 text-center mb-6">
                            <div class="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏆</div>
                            <h3 class="text-xl font-black text-white italic mb-2 uppercase tracking-tighter">Competición Terminada</h3>
                            <p class="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-6">Todos los encuentros han finalizado</p>
                            ${tournament.estado !== 'finalizado' ? `
                                <button id="btnFinalizarTorneo" class="btn-primary w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-[10px] font-black italic uppercase tracking-widest">CORONAR AL CAMPEÓN 🏁</button>
                            ` : `
                                <div class="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                    <span class="text-[10px] font-black text-emerald-400 uppercase italic tracking-[0.2em]">TORNEO FINALIZADO ✅</span>
                                </div>
                            `}
                        </div>
                    ` : ''}

                    <!-- GALERÍA DEL CAMPEÓN -->
                    ${tournament.estado === 'finalizado' ? `
                        <div class="card border-emerald-500/30 bg-slate-900 shadow-2xl relative overflow-hidden">
                            <div class="absolute top-0 right-0 p-4 opacity-10">
                                <svg class="w-24 h-24 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L9 9H1L7 15L4 23L12 18L20 23L17 15L23 9H15L12 1z"></path></svg>
                            </div>
                            <h4 class="font-black italic text-sm pb-4 mb-6 border-b border-emerald-500/20 uppercase text-emerald-400">🏆 Salón de la Fama</h4>
                            
                            <div class="text-center mb-8 animate-fade-in">
                                <p class="text-[10px] font-black italic uppercase tracking-widest text-slate-500 mb-1">Campeón Indiscutible</p>
                                <h2 class="text-4xl font-black italic uppercase tracking-tighter text-white drop-shadow-lg">${tournament.campeon_nombre || 'POR DEFINIR'}</h2>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                ${tournament.foto_campeon_url ? `
                                    <div class="rounded-xl overflow-hidden border border-white/5 aspect-video">
                                        <img src="${tournament.foto_campeon_url}" class="w-full h-full object-cover" alt="Campeón">
                                    </div>
                                ` : ''}
                                ${tournament.foto_trofeo_url ? `
                                    <div class="rounded-xl overflow-hidden border border-white/5 aspect-video">
                                        <img src="${tournament.foto_trofeo_url}" class="w-full h-full object-cover" alt="Trofeo">
                                    </div>
                                ` : ''}
                            </div>

                            <div class="p-6 bg-slate-800/40 rounded-2xl border border-white/5 italic text-center text-slate-300 text-sm">
                                "${tournament.frase_campeon || 'Un torneo inolvidable.'}"
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `
    
    
    if(tournament.estado !== 'configuracion') {
        const { data: grupos } = await supabase.from('grupos').select('*').eq('torneo_id', tournamentId).order('nombre')
        let tablesHtml = ''

        const renderMiniTable = (titulo, rows) => {
            if (!rows || rows.length === 0) return ''
            return `
                <div class="card !p-0 overflow-hidden border-white/5 bg-slate-900/40">
                    <div class="px-6 py-4 bg-slate-800/50 flex justify-between items-center border-b border-white/5">
                        <span class="text-[10px] font-black uppercase text-indigo-400 italic font-bold tracking-[0.2em]">${titulo}</span>
                    </div>
                    <div class="divide-y divide-white/5">
                        ${rows.sort((a,b) => b.pts - a.pts || b.dg - a.dg).map((r, i) => `
                            <div class="flex items-center justify-between p-4 ${i < (tournament.configuracion.clasificados || 2) ? 'bg-indigo-500/5' : ''}">
                                <div class="flex items-center gap-4">
                                    <span class="text-[10px] font-black text-slate-600 w-4">${i+1}</span>
                                    <span class="text-xs font-bold text-slate-200 uppercase tracking-tight">${r.equipo_nombre || '???'}</span>
                                </div>
                                <div class="text-right">
                                    <span class="text-xs font-black text-indigo-400 font-mono">${r.pts} <span class="text-[8px] text-slate-500 uppercase ml-0.5">pts</span></span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `
        }

        if (grupos && grupos.length > 0) {
            for(const g of grupos) {
                const { data: t } = await supabase.from('vista_posiciones').select('*').eq('grupo_id', g.id).order('pts', { ascending: false }).order('dg', { ascending: false }).order('gf', { ascending: false })
                
                let rawTabla = t || []
                const enTabla = new Set(rawTabla.map(x => x.equipo_id))
                teams.filter(x => x.grupo_id === g.id).forEach(eq => {
                    if (!enTabla.has(eq.id)) rawTabla.push({ equipo_id: eq.id, equipo_nombre: eq.nombre, escudo_url: eq.escudo_url, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 })
                })

                tablesHtml += renderMiniTable(g.nombre, rawTabla)
            }
        } else {
            // Caso sin grupos (Liga)
            const { data: t } = await supabase.from('vista_posiciones').select('*').eq('torneo_id', tournamentId).order('pts', { ascending: false }).order('dg', { ascending: false }).order('gf', { ascending: false })
            
            let rawTabla = t || []
            const enTabla = new Set(rawTabla.map(x => x.equipo_id))
            teams.forEach(eq => {
                if (!enTabla.has(eq.id)) rawTabla.push({ equipo_id: eq.id, equipo_nombre: eq.nombre, escudo_url: eq.escudo_url, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 })
            })

            tablesHtml += renderMiniTable('Tabla General', rawTabla)
        }

        if (el.querySelector('#mini-tables')) {
            el.querySelector('#mini-tables').innerHTML = tablesHtml
        }
    }

    if (tieneEliminatoria) {
        const partidosKO = todosLosPartidos.filter(p => p.fase !== 'grupos')
        const fasesExistentes = [...new Set(partidosKO.map(p => p.fase))].sort((a, b) => fasesNombre.indexOf(a) - fasesNombre.indexOf(b))
        let bracketHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'
        for (const f of fasesExistentes) {
            const matches = partidosKO.filter(p => p.fase === f)
            bracketHtml += `<div class="space-y-3"><p class="text-[10px] font-black uppercase text-indigo-500/50 italic mb-2">${f}</p>
                ${matches.map(m => `
                    <div class="p-2 bg-black/40 rounded-xl border border-white/5 flex flex-col gap-1 text-[11px]">
                        <div class="flex justify-between items-center"><span class="font-bold text-slate-400">${teams.find(e => e.id === m.equipo_local_id)?.nombre || 'TBD'}</span><span class="font-black text-white">${m.estado === 'finalizado' ? m.goles_local : '-'}</span></div>
                        <div class="flex justify-between items-center"><span class="font-bold text-slate-400">${teams.find(e => e.id === m.equipo_visitante_id)?.nombre || 'TBD'}</span><span class="font-black text-white">${m.estado === 'finalizado' ? m.goles_visitante : '-'}</span></div>
                    </div>
                `).join('')}</div>`
        }
        bracketHtml += '</div>'
        if (el.querySelector('#bracket-view')) {
            el.querySelector('#bracket-view').innerHTML = bracketHtml
        }
    }

    const assignClick = (id, fn) => {
        const btn = document.getElementById(id)
        if(btn) btn.onclick = async () => {
            btn.disabled = true; btn.innerHTML = 'TRABAJANDO...';
            try { await fn(); loadInitialData(); } catch(e) { alert(e.message); btn.disabled = false; }
        }
    }
    assignClick('btnStartFlow', () => engine.sortearYDistribuir(tournamentId))
    assignClick('btnFixtureFlow', () => engine.generarFixture(tournamentId))
    assignClick('btnGenerarEliminatoria', () => engine.generarEliminatoria(tournamentId))
    assignClick('btnAvanzarFase', () => engine.avanzarFase(tournamentId))
    const scheduleBtn = document.getElementById('btnGoSchedule')
    const scheduleBtnMini = document.getElementById('btnGoScheduleMini')
    const navToPartidos = () => { activeTab = 'partidos'; renderFrame(); }
    if (scheduleBtn) scheduleBtn.onclick = navToPartidos
    if (scheduleBtnMini) scheduleBtnMini.onclick = navToPartidos

    const btnFinalizar = document.getElementById('btnFinalizarTorneo')
    if (btnFinalizar) {
        btnFinalizar.onclick = () => {
            const modal = document.getElementById('finalizeModal')
            if (modal) {
                modal.classList.remove('hidden')
                setupDropzone('final_foto_campeon')
                setupDropzone('final_foto_trofeo')

                const finalForm = document.getElementById('finalizeForm')
                if (finalForm) {
                    finalForm.onsubmit = async (e) => {
                        e.preventDefault()
                        const btnSubmit = document.getElementById('btnConfirmFinalize')
                        btnSubmit.disabled = true; btnSubmit.innerText = 'CERRANDO TORNEO...'
                        
                        try {
                            const fd = new FormData(e.target)
                            const fotoFile = document.getElementById('final_foto_campeon_input').files[0]
                            const trofeoFile = document.getElementById('final_foto_trofeo_input').files[0]
                            
                            let fotoUrl = null
                            let trofeoUrl = null
                            
                            if (fotoFile) fotoUrl = await uploadImage(fotoFile, 'torneos', `campeon/${tournamentId}`)
                            if (trofeoFile) trofeoUrl = await uploadImage(trofeoFile, 'torneos', `campeon/${tournamentId}`)
                            
                            const payload = {
                                estado: 'finalizado',
                                finalizado_at: new Date().toISOString()
                            }

                            if (fd.get('campeon_nombre')) payload.campeon_nombre = fd.get('campeon_nombre')
                            if (fotoUrl) payload.foto_campeon_url = fotoUrl
                            if (trofeoUrl) payload.foto_trofeo_url = trofeoUrl
                            if (fd.get('frase_campeon')) payload.frase_campeon = fd.get('frase_campeon')

                            const { error } = await supabase.from('torneos')
                                .update(payload)
                                .eq('id', tournamentId)

                            if (error) throw error
                            
                            alert('¡Torneo finalizado con éxito! El campeón ha sido coronado.')
                            modal.classList.add('hidden')
                            loadInitialData()
                        } catch (err) {
                            alert('Error al finalizar: ' + err.message)
                            btnSubmit.disabled = false; btnSubmit.innerText = 'FINALIZAR TORNEO 🏁'
                        }
                    }
                }
            }
        }
    }
  }


  const renderEquipos = async (el) => {
    el.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="card lg:col-span-1 border-slate-800 h-fit">
               <h3 class="font-bold mb-6">Inscribir Nuevo Equipo</h3>
               <form id="teamForm" class="space-y-6">
                   <input type="text" id="teamName" placeholder="Nombre del equipo" class="form-input" required>
                   ${createImageDropzone('team_escudo', 'Escudo del Equipo', false, 'circle')}
                   <button type="submit" id="btnSaveTeam" class="btn-primary w-full py-3 text-xs font-black uppercase tracking-widest">REGISTRAR EQUIPO ➔</button>
               </form>

               <div class="mt-12 pt-10 border-t border-slate-700/50 space-y-4">
                   <p class="text-[10px] font-black text-slate-500 uppercase italic tracking-[0.2em]">EQUIPOS INSCRITOS (${teams.length})</p>
                   ${teams.map(e => `
                       <div class="flex items-center justify-between p-3 bg-slate-900/40 rounded-2xl border border-white/5 group cursor-pointer hover:border-indigo-500/50 transition-all team-item" data-id="${e.id}">
                           <div class="flex items-center gap-3">
                               <div class="w-10 h-10 bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                                   ${e.escudo_url ? `<img src="${e.escudo_url}" class="w-full h-full object-cover">` : `<span class="text-xs font-black text-indigo-400 italic">${e.nombre.substring(0,2).toUpperCase()}</span>`}
                               </div>
                               <span class="font-black italic text-xs uppercase text-slate-200">${e.nombre}</span>
                           </div>
                           <button class="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity btn-del-team" data-id="${e.id}">&times;</button>
                       </div>
                   `).join('')}
               </div>
            </div>
            <div class="lg:col-span-2">
                <div id="roster-container">
                    <div class="card flex flex-col items-center justify-center p-20 text-slate-600 border-2 border-dashed border-white/5">
                        <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <svg class="w-6 h-6 text-slate-700 font-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                        <p class="text-[9px] font-black uppercase tracking-[0.2em] text-center">Selecciona un equipo para gestionar su plantilla.</p>
                    </div>
                </div>
            </div>
        </div>
    `

    setupDropzone('team_escudo')

    document.getElementById('teamForm').onsubmit = async (e) => {
        e.preventDefault()
        const btn = document.getElementById('btnSaveTeam')
        const name = document.getElementById('teamName').value
        const file = document.getElementById('team_escudo_input').files[0]
        
        btn.disabled = true; btn.innerText = 'PROCESANDO...'
        
        try {
            const { data: { user } } = await supabase.auth.getUser()
            let escudoUrl = null
            if (file) escudoUrl = await uploadImage(file, 'equipos', tournamentId)
            
            await supabase.from('equipos').insert([{ 
                user_id: user.id, 
                torneo_id: tournamentId, 
                nombre: name,
                escudo_url: escudoUrl
            }])
            loadInitialData()
        } catch (err) {
            alert(err.message)
            btn.disabled = false; btn.innerText = 'REGISTRAR EQUIPO ➔'
        }
    }

    container.querySelectorAll('.btn-del-team').forEach(btn => {
        btn.onclick = async (e) => {
            e.stopPropagation()
            if(confirm('¿Eliminar equipo?')) {
                await supabase.from('equipos').update({ deleted_at: new Date() }).eq('id', btn.dataset.id)
                loadInitialData()
            }
        }
    })

    container.querySelectorAll('.team-item').forEach(item => {
        item.onclick = () => renderRoster(item.dataset.id)
    })
  }

  const renderRoster = async (teamId) => {
    const rosterEl = document.getElementById('roster-container')
    const team = teams.find(e => e.id === teamId)
    
    rosterEl.innerHTML = `
        <div class="card fade-in">
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h3 class="text-2xl font-black">${team.nombre}</h3>
                    <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Plantilla del Equipo</p>
                </div>
                <button id="btnAddPlayer" class="btn-primary py-2 px-6 text-xs font-black">NUEVO JUGADOR</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="playerList">
                <div class="col-span-full py-10 text-center text-slate-600">Cargando jugadores...</div>
            </div>
        </div>

        <div id="playerModal" class="hidden fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
            <div class="card w-full max-w-md border-white/5">
                <h3 class="text-xl font-black italic uppercase italic tracking-tighter mb-8">Registrar Nuevo Jugador</h3>
                <form id="playerForm" class="space-y-6">
                    ${createImageDropzone('player_foto', 'Foto del Jugador', false, 'circle')}
                    <input type="text" name="nombre" placeholder="Nombre completo" class="form-input text-xs" required>
                    <div class="grid grid-cols-2 gap-4">
                        <input type="number" name="dorsal" placeholder="Dorsal" class="form-input text-xs">
                        <input type="text" name="posicion" placeholder="Posición" class="form-input text-xs">
                    </div>
                    <div class="flex gap-4 pt-4">
                        <button type="submit" id="btnSavePlayer" class="btn-primary flex-1 py-3 text-[11px] font-black uppercase tracking-widest">GUARDAR ➔</button>
                        <button type="button" id="closePlayerModal" class="btn-secondary flex-1 py-3">CANCELAR</button>
                    </div>
                </form>
            </div>
        </div>
    `

    setupDropzone('player_foto')

    const playerList = document.getElementById('playerList')
    const loadPlayers = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        // El dueño ve la tabla completa (incluye DNI), otros solo la vista pública.
        const source = (user && user.id === tournament.user_id) ? 'jugadores' : 'jugadores_publicos'
        const { data: players } = await supabase.from(source).select('*').eq('equipo_id', teamId)
        playerList.innerHTML = players.length ? players.map(p => `
            <div class="p-4 bg-slate-900/60 rounded-2xl flex items-center justify-between group border border-white/5 hover:border-indigo-500/50 transition-all">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-indigo-500 shadow-xl shadow-indigo-500/20">
                        ${p.foto_url ? `<img src="${p.foto_url}" class="w-full h-full object-cover">` : `<span class="font-black text-xs text-white">${p.dorsal || '??'}</span>`}
                    </div>
                    <div>
                        <p class="font-black italic text-xs uppercase text-slate-200">${p.nombre}</p>
                        <p class="text-[9px] text-slate-500 uppercase font-black tracking-widest">${p.posicion || 'Sin posición'}</p>
                    </div>
                </div>
                <button class="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity btn-del-player" data-id="${p.id}">&times;</button>
            </div>
        `).join('') : '<p class="col-span-full text-center py-20 text-slate-700 italic text-[11px] uppercase tracking-widest font-black">No hay jugadores registrados en este equipo.</p>'
        
        container.querySelectorAll('.btn-del-player').forEach(btn => {
           btn.onclick = async () => {
               if(confirm('¿Eliminar jugador?')) {
                   await supabase.from('jugadores').delete().eq('id', btn.dataset.id)
                   loadPlayers()
               }
           }
        })
    }

    document.getElementById('btnAddPlayer').onclick = () => document.getElementById('playerModal').classList.remove('hidden')
    document.getElementById('closePlayerModal').onclick = () => document.getElementById('playerModal').classList.add('hidden')
    
    document.getElementById('playerForm').onsubmit = async (e) => {
        e.preventDefault()
        const btn = document.getElementById('btnSavePlayer')
        const fd = new FormData(e.target)
        const file = document.getElementById('player_foto_input').files[0]
        
        btn.disabled = true; btn.innerText = 'PROCESANDO...'
        
        try {
            const { data: { user } } = await supabase.auth.getUser()
            let fotoUrl = null
            if (file) fotoUrl = await uploadImage(file, 'jugadores', `${tournamentId}/${teamId}`)
            
            await supabase.from('jugadores').insert([{
                user_id: user.id, // PROTECCIÓN MULTI-TENANT
                torneo_id: tournamentId,
                equipo_id: teamId,
                nombre: fd.get('nombre'),
                dorsal: fd.get('dorsal'),
                posicion: fd.get('posicion'),
                foto_url: fotoUrl
            }])
            document.getElementById('playerModal').classList.add('hidden')
            e.target.reset()
            loadPlayers()
        } catch (err) {
            alert(err.message)
            btn.disabled = false; btn.innerText = 'GUARDAR ➔'
        }
    }

    loadPlayers()
  }

  const renderHallOfFame = async (el) => {
    const { data: { user } } = await supabase.auth.getUser()
    const source = (user && user.id === tournament.user_id) ? 'jugadores' : 'jugadores_publicos'
    const { data: players } = await supabase.from(source).select('*, equipos(nombre)').eq('torneo_id', tournamentId)
    
    el.innerHTML = `
        <div class="card max-w-4xl mx-auto border-indigo-500/20">
            <h3 class="text-xl font-black mb-8 italic">🏆 Cuadro de Honor de la Semana</h3>
            <form id="hofForm" class="space-y-6">
                <div>
                    <label class="text-[10px] font-bold text-slate-500 uppercase block mb-2">Seleccionar Jornada/Fecha</label>
                    <input type="number" name="jornada" value="1" class="form-input" required>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-800">
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase block mb-2">MVP / Jugador de la Fecha</label>
                        <select name="jugador_fecha" class="form-input text-xs">${players.map(p => `<option value="${p.id}">${p.nombre} (${p.equipos?.nombre})</option>`).join('')}</select>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase block mb-2">Mejor Arquero</label>
                        <select name="mejor_arquero" class="form-input text-xs">${players.map(p => `<option value="${p.id}">${p.nombre} (${p.equipos?.nombre})</option>`).join('')}</select>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase block mb-2">Mejor Defensa</label>
                        <select name="mejor_defensa" class="form-input text-xs">${players.map(p => `<option value="${p.id}">${p.nombre} (${p.equipos?.nombre})</option>`).join('')}</select>
                    </div>
                    <div>
                        <label class="text-[10px] font-bold text-slate-500 uppercase block mb-2">Mejor Volante</label>
                        <select name="mejor_volante" class="form-input text-xs">${players.map(p => `<option value="${p.id}">${p.nombre} (${p.equipos?.nombre})</option>`).join('')}</select>
                    </div>
                </div>
                <button type="submit" class="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest">GUARDAR RECONOCIMIENTOS</button>
            </form>

            <div class="mt-12">
                <h4 class="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Historial de Reconocimientos</h4>
                <div id="hofList" class="space-y-4">Cargando historial...</div>
            </div>
        </div>
    `

    const loadHof = async () => {
        const { data: h } = await supabase.from('cuadro_honor').select('*, jugadores(nombre, equipo_id, equipos(nombre))').eq('torneo_id', tournamentId).order('jornada', { ascending: false })
        document.getElementById('hofList').innerHTML = h.length ? `
            <div class="grid grid-cols-1 gap-2">
                ${h.map(x => `
                    <div class="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                        <span class="text-indigo-400 font-black">FECHA ${x.jornada}</span>
                        <span class="badge badge-pending">${x.tipo.replace('_', ' ')}</span>
                        <span class="font-bold text-white">${x.jugadores?.nombre}</span>
                        <span class="text-slate-500 italic">(${x.jugadores?.equipos?.nombre})</span>
                        <button class="text-red-500 btn-del-hof" data-id="${x.id}">&times;</button>
                    </div>
                `).join('')}
            </div>
        ` : '<p class="text-center py-10 text-slate-700">No hay registros.</p>'
        
        container.querySelectorAll('.btn-del-hof').forEach(btn => {
           btn.onclick = async () => {
               await supabase.from('cuadro_honor').delete().eq('id', btn.dataset.id)
               loadHof()
           }
        })
    }

    document.getElementById('hofForm').onsubmit = async (e) => {
        e.preventDefault()
        const fd = new FormData(e.target)
        const jornada = fd.get('jornada')
        
        const updates = [
            { t: 'jugador_fecha', id: fd.get('jugador_fecha') },
            { t: 'mejor_arquero', id: fd.get('mejor_arquero') },
            { t: 'mejor_defensa', id: fd.get('mejor_defensa') },
            { t: 'mejor_volante', id: fd.get('mejor_volante') }
        ]

        for(const up of updates) {
            await supabase.from('cuadro_honor').upsert([{
                torneo_id: tournamentId,
                jornada: jornada,
                tipo: up.t,
                jugador_id: up.id
            }], { onConflict: 'torneo_id, jornada, tipo' })
        }
        alert('Reconocimientos guardados correctamente')
        loadHof()
    }
    loadHof()
  }

  const renderPartidos = async (el) => {
    const { data: groups } = await supabase.from('grupos').select('*').eq('torneo_id', tournamentId).order('nombre')
    const { data: matches } = await supabase.from('partidos').select('*, h:equipos!equipo_local_id(nombre, escudo_url), a:equipos!equipo_visitante_id(nombre, escudo_url), campo:campos!campo_id(nombre, sede:sedes!sede_id(nombre)), arbitro:arbitros!arbitro_id(nombre)').eq('torneo_id', tournamentId).order('fecha_hora', { ascending: true, nullsLast: true }).order('fase').order('jornada')
    
    if (!matches || matches.length === 0) {
        let msg = 'AÚN NO HAY PARTIDOS GENERADOS'
        let sub = 'Debes completar los pasos previos en la pestaña de Resumen.'
        if (tournament.estado === 'configuracion') {
            msg = 'SORTEO PENDIENTE'
            sub = 'Primero debes realizar el sorteo de equipos en la pestaña Resumen.'
        } else if (tournament.estado === 'sorteo') {
            msg = 'FIXTURE PENDIENTE'
            sub = 'El sorteo ya está listo. Haz clic en "LANZAR FIXTURE" en la pestaña Resumen para generar los partidos.'
        }
        el.innerHTML = `
            <div class="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-4xl opacity-20">⚽</div>
                <div>
                    <h3 class="text-2xl font-black italic uppercase text-slate-500 tracking-tighter">${msg}</h3>
                    <p class="text-xs font-bold text-slate-600 uppercase tracking-widest mt-2">${sub}</p>
                </div>
                <button onclick="activeTab='resumen'; renderFrame()" class="mt-6 px-8 py-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-[10px] font-black uppercase italic rounded-xl transition-all">Ir a Resumen ➔</button>
            </div>
        `
        return
    }

    const unprogrammed = matches.filter(m => !m.fecha_hora).length
    const knockoutPhases = ['octavos', 'cuartos', 'semifinales', 'final']
    const hasKnockout = matches.some(m => m.fase !== 'grupos')

    el.innerHTML = `
        <div class="space-y-12 fade-in">
            <!-- BANNER NOTIFICACIÓN -->
            ${unprogrammed > 0 ? `
            <div id="fixtureBanner" class="p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl shadow-xl flex items-center justify-between gap-6 slide-up">
                <div class="flex items-center gap-4 text-white">
                    <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl shrink-0">📋</div>
                    <div>
                        <h4 class="font-black italic uppercase tracking-tighter">Fixture Listo para Programar</h4>
                        <p class="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-none">Aún faltan ${unprogrammed} partidos por asignar fecha, hora y sede.</p>
                    </div>
                </div>
                <button id="btnCloseBanner" class="text-white/40 hover:text-white transition-colors">&times;</button>
            </div>
            ` : ''}

            <!-- HEADER Y TOGGLE VIEW -->
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h2 class="text-3xl font-black italic tracking-tighter uppercase text-white">Centro de Competencia</h2>
                <div class="flex p-1 bg-slate-900 rounded-2xl border border-white/5">
                    <button class="px-6 py-2 rounded-xl text-[10px] font-black italic uppercase tracking-widest transition-all ${matchesView === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}" id="viewListBtn">Lista</button>
                    <button class="px-6 py-2 rounded-xl text-[10px] font-black italic uppercase tracking-widest transition-all ${matchesView === 'calendar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}" id="viewCalendarBtn">Calendario</button>
                </div>
            </div>

            ${matchesView === 'list' ? renderListView(groups, matches, hasKnockout, knockoutPhases) : renderCalendarView(matches)}
        </div>

        <div id="scheduleModal" class="hidden fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl">
             <!-- Modal de programación se inyecta dinámicamente -->
        </div>
    `

    // Eventos de Vista
    document.getElementById('viewListBtn').onclick = () => { matchesView = 'list'; renderTabContent(); }
    document.getElementById('viewCalendarBtn').onclick = () => { matchesView = 'calendar'; renderTabContent(); }
    if (document.getElementById('btnCloseBanner')) {
        document.getElementById('btnCloseBanner').onclick = () => document.getElementById('fixtureBanner').style.display = 'none'
    }

    function renderListView(groups, matches, hasKnockout, knockoutPhases) {
        return `
            <div class="space-y-16">
                <!-- Fase Grupos -->
                <div class="space-y-8">
                    <div class="flex items-center gap-4">
                        <h3 class="text-xl font-black text-slate-400 italic uppercase">Fase Regular / Grupos</h3>
                        <div class="flex-1 h-px bg-slate-800"></div>
                    </div>
                    <div class="grid grid-cols-1 gap-12">
                        ${groups.map(g => {
                            const groupMatches = matches.filter(m => m.grupo_id === g.id && m.fase === 'grupos')
                            if (groupMatches.length === 0) return ''
                            return `<div class="space-y-4">
                                <div class="flex justify-between items-center text-[10px] font-black text-indigo-400 italic uppercase tracking-widest px-1">
                                    <span>⚡ ${g.nombre}</span>
                                    <span>${groupMatches.length} partidos</span>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">${groupMatches.map(m => renderMatchCard(m)).join('')}</div>
                            </div>`
                        }).join('')}
                    </div>
                </div>
                <!-- Knockout -->
                ${hasKnockout ? `
                    <div class="space-y-12">
                        <div class="flex items-center gap-4">
                            <h3 class="text-xl font-black text-amber-500/50 italic uppercase">Playoffs / Eliminatorias</h3>
                            <div class="flex-1 h-px bg-slate-800"></div>
                        </div>
                        <div class="grid grid-cols-1 gap-12">
                            ${knockoutPhases.map(fase => {
                                const faseMatches = matches.filter(m => m.fase === fase)
                                if (faseMatches.length === 0) return ''
                                return `<div class="space-y-6">
                                    <p class="text-[10px] font-black text-amber-500 italic uppercase tracking-[0.3em] px-1">${fase}</p>
                                    <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">${faseMatches.map(m => renderMatchCard(m)).join('')}</div>
                                </div>`
                            }).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `
    }

    function renderCalendarView(matches) {
        // Agrupar por fecha
        const agenda = {}
        const sinFecha = []

        matches.forEach(m => {
            if (m.fecha_hora) {
                const day = formatearFecha(m.fecha_hora)
                if (!agenda[day]) agenda[day] = []
                agenda[day].push(m)
            } else {
                sinFecha.push(m)
            }
        })

        const sortedDays = Object.keys(agenda).sort((a,b) => {
            const dateA = new Date(agenda[a][0].fecha_hora)
            const dateB = new Date(agenda[b][0].fecha_hora)
            return dateA - dateB
        })

        return `
            <div class="space-y-12">
                ${sortedDays.map(day => `
                    <div class="space-y-6">
                        <div class="flex items-center gap-4">
                            <h3 class="text-xl font-black text-white italic uppercase">${day}</h3>
                            <span class="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black text-slate-500 uppercase">${agenda[day].length} partidos</span>
                            <div class="flex-1 h-px bg-white/5"></div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                            ${agenda[day].map(m => renderMatchCard(m)).join('')}
                        </div>
                    </div>
                `).join('')}

                ${sinFecha.length > 0 ? `
                    <div class="space-y-6 pt-12 border-t border-white/5">
                        <h3 class="text-xl font-black text-slate-600 italic uppercase">⏳ Sin Fecha Asignada</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                            ${sinFecha.map(m => renderMatchCard(m)).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `
    }

    function renderMatchCard(m) {
        const isFin = m.estado === 'finalizado'
        const date = m.fecha_hora ? new Date(m.fecha_hora) : null
        
        return `
        <div class="card !p-0 overflow-hidden border-white/5 bg-slate-900/60 relative group hover:border-indigo-500/30 transition-all">
            <!-- HEADER INFO -->
            <div class="px-4 py-3 bg-white/5 border-b border-white/5 flex items-center justify-between text-[10px] uppercase font-black tracking-widest">
                ${m.fecha_hora ? `
                    <div class="flex items-center gap-2 text-indigo-400 italic">
                        <span>${formatearFechaHora(m.fecha_hora).split(',')[1]?.trim() || ''} HRS</span>
                    </div>
                ` : `<span class="text-slate-600">PENDIENTE DE FECHA</span>`}
                <span class="text-slate-500">${m.fase} ${m.jornada ? '• ' + m.jornada : ''}</span>
            </div>

            <div class="p-4 space-y-4">
                <div class="flex items-center justify-between gap-4">
                    <div class="flex-1 flex flex-col items-center gap-1 overflow-hidden">
                        <img src="${m.h?.escudo_url || 'https://ui-avatars.com/api/?name='+m.h?.nombre}" class="w-8 h-8 object-contain">
                        <div class="w-full text-center text-[10px] font-black italic truncate ${isFin && m.goles_local > m.goles_visitante ? 'text-white' : 'text-slate-500'}">${m.h?.nombre || '???'}</div>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                        <input type="number" class="w-8 h-8 bg-black border-none text-center font-black text-indigo-400 rounded-lg score-sync text-xs" data-id="${m.id}" data-type="local" value="${m.goles_local || 0}">
                        <span class="text-[9px] font-black text-slate-800">VS</span>
                        <input type="number" class="w-8 h-8 bg-black border-none text-center font-black text-indigo-400 rounded-lg score-sync text-xs" data-id="${m.id}" data-type="visitante" value="${m.goles_visitante || 0}">
                    </div>
                    <div class="flex-1 flex flex-col items-center gap-1 overflow-hidden">
                        <img src="${m.a?.escudo_url || 'https://ui-avatars.com/api/?name='+m.a?.nombre}" class="w-8 h-8 object-contain">
                        <div class="w-full text-center text-[10px] font-black italic truncate ${isFin && m.goles_visitante > m.goles_local ? 'text-white' : 'text-slate-500'}">${m.a?.nombre || '???'}</div>
                    </div>
                </div>

                <!-- LUGAR Y ÁRBITRO -->
                <div class="pt-4 border-t border-white/5 flex flex-wrap gap-x-6 gap-y-2">
                    <div class="flex items-center gap-2 text-[9px] font-bold text-slate-500">
                        <span>📍</span>
                        <span class="${m.campo?.sede?.nombre ? 'text-slate-300' : ''}">${m.campo?.sede?.nombre || 'Sin estadio asignado'}</span>
                    </div>
                    <div class="flex items-center gap-2 text-[9px] font-bold text-slate-500">
                        <span>👨‍⚖️</span>
                        <span class="${m.arbitro?.nombre ? 'text-slate-300' : ''}">${m.arbitro?.nombre || 'Sin árbitro'}</span>
                    </div>
                </div>
            </div>

            <!-- ACTIONS -->
            <div class="px-4 py-2 border-t border-white/5 bg-black/20 flex gap-2">
                <button class="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[9px] font-black uppercase text-slate-300 transition-all btn-schedule" data-id="${m.id}">📅 Programar</button>
                <button class="w-10 h-8 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-lg btn-stats" data-id="${m.id}"><svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg></button>
            </div>
        </div>
        `
    }

    el.querySelectorAll('.score-sync').forEach(inp => {
        inp.onchange = async () => {
            const wrap = inp.closest('.flex')
            const l = wrap.querySelector('[data-type="local"]').value
            const v = wrap.querySelector('[data-type="visitante"]').value
            await engine.guardarResultado(inp.dataset.id, l, v)
        }
    })

    el.querySelectorAll('.btn-stats').forEach(btn => btn.onclick = () => renderMatchStats(btn.dataset.id))
    el.querySelectorAll('.btn-schedule').forEach(btn => btn.onclick = () => renderScheduleModal(btn.dataset.id))
  }

  const renderMatchStats = async (matchId) => {
    // Sintaxis correcta: alias:tabla!columna_fk(campos)
    const { data: m, error: mErr } = await supabase
        .from('partidos')
        .select('*, h:equipos!equipo_local_id(id, nombre, escudo_url), a:equipos!equipo_visitante_id(id, nombre, escudo_url)')
        .eq('id', matchId)
        .single()

    if (mErr || !m) {
        alert('No se pudo cargar el partido: ' + (mErr?.message || 'Error desconocido'))
        return
    }

    // Carga jugadores de ambos equipos en paralelo
    const [{ data: playersL }, { data: playersV }] = await Promise.all([
        supabase.from('jugadores').select('id, nombre, dorsal, posicion').eq('equipo_id', m.h.id).order('dorsal'),
        supabase.from('jugadores').select('id, nombre, dorsal, posicion').eq('equipo_id', m.a.id).order('dorsal')
    ])

    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md'
    modal.innerHTML = `
        <div class="card w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border-white/10">
            <div class="flex items-center justify-between mb-6 shrink-0">
                <div>
                    <h3 class="text-xl font-black italic uppercase tracking-tighter">⚽ Incidencias</h3>
                    <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-1">${m.h?.nombre || '???'} vs ${m.a?.nombre || '???'}</p>
                </div>
                <button id="closeStats" class="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full text-xl text-slate-400 hover:text-white transition-all">&times;</button>
            </div>
            
            <div class="flex-1 overflow-y-auto pr-1 space-y-6">
                <!-- FORMULARIO DE EVENTO -->
                <div class="bg-slate-900/80 p-4 rounded-2xl border border-white/5">
                    <h4 class="text-[10px] font-black uppercase text-indigo-400 mb-4 tracking-widest">Registrar Evento</h4>
                    <form id="eventForm" class="space-y-3">
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Tipo</label>
                                <select name="type" class="form-input text-xs w-full">
                                    <option value="gol">⚽ Gol</option>
                                    <option value="amarilla">🟡 Amarilla</option>
                                    <option value="roja">🔴 Roja</option>
                                    <option value="mvp">⭐ MVP</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Equipo</label>
                                <select name="team" class="form-input text-xs w-full" id="teamEventSelect">
                                    <option value="${m.h.id}">${m.h.nombre}</option>
                                    <option value="${m.a.id}">${m.a.nombre}</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Jugador</label>
                            <select name="player" class="form-input text-xs w-full" id="playerEventSelect">
                                ${(playersL || []).length === 0 
                                    ? '<option value="">Sin jugadores registrados</option>'
                                    : (playersL || []).map(p => `<option value="${p.id}">#${p.dorsal || '--'} ${p.nombre}</option>`).join('')
                                }
                            </select>
                        </div>
                        <button type="submit" id="btnAddEvent" class="btn-primary w-full py-2.5 text-[11px] font-black uppercase tracking-widest">
                            Registrar Evento ➔
                        </button>
                    </form>
                </div>

                <!-- LOG DE EVENTOS -->
                <div>
                    <h4 class="text-[10px] font-black uppercase text-slate-500 mb-3 tracking-widest">Historial de Eventos</h4>
                    <div id="eventLog" class="space-y-2">
                        <div class="py-6 text-center"><div class="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500 mx-auto"></div></div>
                    </div>
                </div>
            </div>
        </div>
    `
    document.body.appendChild(modal)

    // Actualizar lista de jugadores al cambiar equipo
    const pSelect = modal.querySelector('#playerEventSelect')
    const tSelect = modal.querySelector('#teamEventSelect')
    
    const updatePlayers = (teamId) => {
        const list = teamId === m.h.id ? (playersL || []) : (playersV || [])
        if (list.length === 0) {
            pSelect.innerHTML = '<option value="">Sin jugadores en este equipo</option>'
        } else {
            pSelect.innerHTML = list.map(p => `<option value="${p.id}">#${p.dorsal || '--'} ${p.nombre}</option>`).join('')
        }
    }
    
    tSelect.onchange = (e) => updatePlayers(e.target.value)
    updatePlayers(m.h.id) // Carga inicial con equipo local

    // Cargar eventos registrados
    const loadEvents = async () => {
        const { data: events, error: evErr } = await supabase
            .from('eventos_partido')
            .select('*, jugadores(nombre), equipos(nombre)')
            .eq('partido_id', matchId)
            .order('created_at', { ascending: false })

        if (evErr) {
            modal.querySelector('#eventLog').innerHTML = `<p class="text-center py-6 text-red-400 text-xs">Error cargando eventos: ${evErr.message}</p>`
            return
        }

        modal.querySelector('#eventLog').innerHTML = events && events.length 
            ? events.map(e => `
                <div class="flex items-center justify-between p-3 bg-white/3 border border-white/5 rounded-xl text-xs">
                    <div class="flex items-center gap-3">
                        <span class="text-lg">${e.tipo === 'gol' ? '⚽' : e.tipo === 'amarilla' ? '🟡' : e.tipo === 'roja' ? '🔴' : '⭐'}</span>
                        <div>
                            <p class="font-black text-white uppercase">${e.jugadores?.nombre || 'Jugador'}</p>
                            <p class="text-[9px] text-slate-500 font-bold uppercase">${e.equipos?.nombre || '-'} • ${e.tipo.toUpperCase()}</p>
                        </div>
                    </div>
                    <button class="w-7 h-7 flex items-center justify-center bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-all btn-del-event" data-id="${e.id}">&times;</button>
                </div>
            `).join('')
            : '<p class="text-center py-10 text-slate-700 text-[11px] font-black uppercase italic tracking-widest">No hay eventos registrados</p>'
        
        modal.querySelectorAll('.btn-del-event').forEach(btn => {
           btn.onclick = async () => {
               const { error } = await supabase.from('eventos_partido').delete().eq('id', btn.dataset.id)
               if (error) alert('Error al eliminar: ' + error.message)
               else loadEvents()
           }
        })
    }

    // Submit del formulario
    modal.querySelector('#eventForm').onsubmit = async (e) => {
        e.preventDefault()
        const btn = modal.querySelector('#btnAddEvent')
        const fd = new FormData(e.target)
        const jugadorId = fd.get('player')
        const equipoId = fd.get('team')
        
        if (!jugadorId) {
            alert('Selecciona un jugador primero.')
            return
        }
        
        btn.disabled = true; btn.innerText = 'REGISTRANDO...'
        
        const { error } = await supabase.from('eventos_partido').insert([{
            partido_id: matchId,
            equipo_id: equipoId,
            jugador_id: jugadorId,
            tipo: fd.get('type')
        }])
        
        btn.disabled = false; btn.innerText = 'Registrar Evento ➔'
        
        if (error) {
            alert('Error al registrar evento: ' + error.message)
            return
        }
        loadEvents()
    }
    
    modal.querySelector('#closeStats').onclick = () => modal.remove()
    modal.onclick = (e) => { if (e.target === modal) modal.remove() }
    loadEvents()
  }


  const renderScheduleModal = async (matchId) => {
    const { data: m } = await supabase.from('partidos').select('*, campo:campos(id, sede_id), h:equipo_local_id(nombre), a:equipo_visitante_id(nombre)').eq('id', matchId).single()
    const { data: sedes } = await supabase.from('sedes').select('*').eq('torneo_id', tournamentId).order('nombre')
    const { data: arbitros } = await supabase.from('arbitros').select('*').eq('torneo_id', tournamentId).order('nombre')

    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md'
    modal.innerHTML = `
        <div class="card w-full max-w-lg shadow-2xl border-white/5 animate-scale-up">
            <div class="flex items-center justify-between mb-8">
                <h3 class="text-xl font-black italic uppercase italic tracking-tighter">📅 Programar Partido</h3>
                <button id="closeSchedule" class="text-slate-500 hover:text-white transition-colors">&times;</button>
            </div>

            <div class="text-center mb-8 p-4 bg-slate-900 rounded-2xl border border-white/5">
                <p class="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Encuentro</p>
                <h4 class="text-lg font-black italic text-white uppercase">${m.h.nombre} vs ${m.a.nombre}</h4>
            </div>

            <form id="scheduleForm" class="space-y-6">
                <div>
                    <label class="text-[10px] font-black italic uppercase tracking-widest text-slate-500 mb-2 block">Fecha y Hora</label>
                    <input type="datetime-local" name="fecha_hora" class="form-input text-xs" value="${m.fecha_hora ? (() => {
                        const d = new Date(m.fecha_hora);
                        const off = d.getTimezoneOffset() * 60000;
                        return new Date(d.getTime() - off).toISOString().slice(0, 16);
                    })() : ''}" required>
                </div>

                <div class="grid grid-cols-1 gap-6">
                    <div>
                        <label class="text-[10px] font-black italic uppercase tracking-widest text-slate-500 mb-2 block">Estadio</label>
                        <select id="sedeSelect" class="form-input text-xs" name="sede_id">
                            <option value="">Seleccionar Estadio</option>
                            ${sedes.map(s => `<option value="${s.id}" ${m.campo?.sede_id === s.id ? 'selected' : ''}>${s.nombre} ${s.direccion ? '— ' + s.direccion : ''}</option>`).join('')}
                        </select>
                        <button type="button" id="btnGoEstadios" class="text-[8px] font-black text-indigo-400 uppercase mt-2 hover:underline">Gestionar Estadios ➔</button>
                    </div>
                </div>

                <div>
                    <label class="text-[10px] font-black italic uppercase tracking-widest text-slate-500 mb-2 block">Árbitro</label>
                    <select name="arbitro_id" class="form-input text-xs">
                        <option value="">Sin árbitro asignado</option>
                        ${arbitros.map(a => `<option value="${a.id}" ${m.arbitro_id === a.id ? 'selected' : ''}>${a.nombre}</option>`).join('')}
                    </select>
                    <button type="button" id="btnGoRefs" class="text-[8px] font-black text-indigo-400 uppercase mt-2 hover:underline">Agregar Árbitro ➔</button>
                </div>

                <div>
                    <label class="text-[10px] font-black italic uppercase tracking-widest text-slate-500 mb-2 block">Notas / Observaciones</label>
                    <textarea name="notas" class="form-input text-xs h-20" placeholder="Ej: Traer hidratación propia...">${m.notas || ''}</textarea>
                </div>

                <div class="flex gap-4 pt-4">
                    <button type="submit" id="btnSaveSchedule" class="btn-primary flex-1 py-3 text-[11px] font-black uppercase tracking-widest">GUARDAR PROGRAMACIÓN</button>
                    <button type="button" id="btnCancelSchedule" class="btn-secondary flex-1 py-3">CANCELAR</button>
                </div>
            </form>
        </div>
    `
    document.body.appendChild(modal)

    modal.querySelector('#btnGoEstadios').onclick = () => { activeTab = 'estadios'; renderFrame(); modal.remove(); }
    modal.querySelector('#btnGoRefs').onclick = () => { activeTab = 'estadios'; renderFrame(); modal.remove(); }

    modal.querySelector('#scheduleForm').onsubmit = async (e) => {
        e.preventDefault()
        const btn = modal.querySelector('#btnSaveSchedule')
        const fd = new FormData(e.target)
        const sedeId = fd.get('sede_id')
        
        btn.disabled = true; btn.innerText = 'GUARDANDO...'
        
        try {
            let campoId = null
            if (sedeId) {
                // Obtener o crear campo por defecto para simplificar (Problema 3)
                const { data: campos } = await supabase.from('campos').select('id').eq('sede_id', sedeId).limit(1)
                if (campos && campos.length > 0) {
                    campoId = campos[0].id
                } else {
                    const { data: { user } } = await supabase.auth.getUser()
                    const res = await supabase.from('campos').insert([{ sede_id: sedeId, nombre: 'Cancha Principal', user_id: user.id }]).select().single()
                    if (res.error) throw res.error
                    campoId = res.data?.id
                }
            }

            const dataToUpdate = {
                fecha_hora: fd.get('fecha_hora') ? new Date(fd.get('fecha_hora')).toISOString() : null,
                campo_id: campoId,
                arbitro_id: fd.get('arbitro_id') || null,
                notas: fd.get('notas')
            }

            const { error } = await supabase.from('partidos').update(dataToUpdate).eq('id', matchId)
            if (error) throw error
            
            modal.remove()
            renderTabContent()
        } catch (err) {
            alert('Error al guardar: ' + err.message)
            btn.disabled = false; btn.innerText = 'GUARDAR PROGRAMACIÓN'
        }
    }

    const closeModal = () => modal.remove()
    modal.querySelector('#closeSchedule').onclick = closeModal
    modal.querySelector('#btnCancelSchedule').onclick = closeModal
    
    // Cerrar con Escape
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal()
            window.removeEventListener('keydown', escHandler)
        }
    }
    window.addEventListener('keydown', escHandler)
  }

  const renderEstadios = async (el) => {
    el.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="card lg:col-span-1 border-slate-800 h-fit">
                <h3 class="text-xl font-black italic uppercase italic tracking-tighter mb-8">🏟️ Nuevo Estadio</h3>
                <form id="sedeForm" class="space-y-6">
                    <div>
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Nombre del Estadio *</label>
                        <input type="text" id="sedeName" placeholder="Ej: Estadio Nacional" class="form-input text-xs" required>
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Dirección / Ubicación</label>
                        <input type="text" id="sedeDir" placeholder="Ej: Calle 123, Ciudad" class="form-input text-xs">
                    </div>
                    <div>
                        <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Capacidad Aproximada</label>
                        <input type="number" id="sedeCap" placeholder="0" class="form-input text-xs">
                    </div>
                    <button class="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest shadow-indigo-600/20">AGREGAR ESTADIO ➔</button>
                </form>

                <div class="mt-12 pt-10 border-t border-white/5">
                    <h4 class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">MIS ESTADIOS (${tournament.nombre})</h4>
                    <div id="sedeList" class="space-y-3"></div>
                </div>
            </div>

            <div class="card lg:col-span-2 border-slate-800">
                <h3 class="text-xl font-black italic uppercase italic tracking-tighter mb-8">⚽ Árbitros del Torneo</h3>
                <form id="refForm" class="flex gap-4 mb-10 pb-10 border-b border-white/5">
                    <div class="flex-1">
                        <input type="text" id="refName" placeholder="Nombre completo del árbitro" class="form-input text-xs" required>
                    </div>
                    <button class="btn-primary px-8 py-3 bg-emerald-600 border-none text-[10px] font-black uppercase italic tracking-widest">AGREGAR +</button>
                </form>
                <div id="refList" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
            </div>
        </div>
    `
    const loadInfra = async () => {
        const { data: sedes } = await supabase.from('sedes').select('*').eq('torneo_id', tournamentId).order('nombre')
        const { data: refs } = await supabase.from('arbitros').select('*').eq('torneo_id', tournamentId).order('nombre')
        
        document.getElementById('sedeList').innerHTML = sedes && sedes.length ? sedes.map(s => `
            <div class="p-4 bg-slate-900 border border-white/5 rounded-2xl group relative overflow-hidden">
                <div class="font-black italic text-xs uppercase text-white mb-1">${s.nombre}</div>
                <div class="text-[9px] font-black text-indigo-400 uppercase tracking-widest">${s.direccion || 'Sin dirección'} ${s.capacidad ? ' • ' + s.capacidad + ' espectadores' : ''}</div>
                <button class="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity btn-del-sede" data-id="${s.id}">&times;</button>
            </div>
        `).join('') : '<p class="text-center py-6 text-[10px] text-slate-600 uppercase font-black italic">No hay estadios registrados.</p>'
        
        document.getElementById('refList').innerHTML = refs && refs.length ? refs.map(r => `
            <div class="p-4 bg-slate-900 border border-white/5 rounded-2xl flex items-center justify-between group">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 text-xs">👨‍⚖️</div>
                    <span class="font-black italic text-xs uppercase text-white">${r.nombre}</span>
                </div>
                <button class="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity btn-del-ref" data-id="${r.id}">&times;</button>
            </div>
        `).join('') : '<p class="col-span-full text-center py-6 text-[10px] text-slate-600 uppercase font-black italic">No hay árbitros registrados.</p>'

        container.querySelectorAll('.btn-del-sede').forEach(btn => btn.onclick = async () => {
            if(confirm('¿Eliminar estadio?')) {
                await supabase.from('sedes').delete().eq('id', btn.dataset.id)
                loadInfra()
            }
        })
        container.querySelectorAll('.btn-del-ref').forEach(btn => btn.onclick = async () => {
             if(confirm('¿Eliminar árbitro?')) {
                await supabase.from('arbitros').delete().eq('id', btn.dataset.id)
                loadInfra()
            }
        })
    }

    document.getElementById('sedeForm').onsubmit = async (e) => {
        e.preventDefault()
        const { data: { user } } = await supabase.auth.getUser()
        const nombre = document.getElementById('sedeName').value
        const direccion = document.getElementById('sedeDir').value
        const capacidad = document.getElementById('sedeCap').value

        const { data: newSede, error } = await supabase.from('sedes').insert([{ 
            user_id: user.id, 
            torneo_id: tournamentId,
            nombre: nombre,
            direccion: direccion,
            capacidad: capacidad ? parseInt(capacidad) : null
        }]).select().single()
        
        if (!error && newSede) {
            // Crear automáticamente un campo para mantener compatibilidad con el esquema (Problema 3)
            await supabase.from('campos').insert([{ sede_id: newSede.id, nombre: 'Cancha Principal', user_id: user.id }])
            e.target.reset()
            loadInfra()
        } else {
            alert(error.message)
        }
    }

    document.getElementById('refForm').onsubmit = async (e) => {
        e.preventDefault()
        const { data: { user } } = await supabase.auth.getUser()
        await supabase.from('arbitros').insert([{ 
            user_id: user.id, 
            torneo_id: tournamentId, 
            nombre: document.getElementById('refName').value 
        }])
        e.target.reset()
        loadInfra()
    }
    loadInfra()
  }

  const renderConfig = async (el) => {
    el.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="card border-slate-800">
                <h3 class="text-xl font-black italic uppercase italic tracking-tighter mb-8">Apariencia del Torneo</h3>
                <form id="configForm" class="space-y-6">
                    <div>
                        <label class="text-[10px] font-black italic uppercase tracking-widest text-slate-500">Logo del Torneo (URL)</label>
                        <input type="url" name="logo_url" value="${tournament.logo_url || ''}" class="form-input text-xs">
                    </div>
                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="text-[10px] font-black italic uppercase tracking-widest text-slate-500">Color Primario</label>
                            <input type="color" name="color_primario" value="${tournament.color_primario || '#00ff87'}" class="h-12 w-full bg-slate-900 rounded-xl p-1 border border-white/5 cursor-pointer">
                        </div>
                        <div>
                            <label class="text-[10px] font-black italic uppercase tracking-widest text-slate-500">Color Secundario</label>
                            <input type="color" name="color_secundario" value="${tournament.color_secundario || '#00d4ff'}" class="h-12 w-full bg-slate-900 rounded-xl p-1 border border-white/5 cursor-pointer">
                        </div>
                    </div>
                    <div>
                        <label class="text-[10px] font-black italic uppercase tracking-widest text-slate-500">Descripción Pública</label>
                        <textarea name="descripcion" class="form-input h-32 text-xs">${tournament.descripcion || ''}</textarea>
                    </div>
                    <button type="submit" id="btnSaveConfig" class="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest">GUARDAR CAMBIOS ➔</button>
                </form>
            </div>

            <div class="card border-slate-800">
                <h3 class="text-xl font-black italic uppercase italic tracking-tighter mb-8">🤝 Auspiciadores Oficiales</h3>
                <form id="patrocinadorForm" class="space-y-6 pb-8 border-b border-white/5 mb-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" id="patName" placeholder="Nombre Comercial" class="form-input text-xs" required>
                        <input type="url" id="patWeb" placeholder="Sitio Web (Opcional)" class="form-input text-xs">
                    </div>
                    ${createImageDropzone('pat_logo', 'Logotipo del Auspiciador')}
                    <button type="submit" id="btnSavePat" class="btn-primary w-full py-3 text-[10px] font-black uppercase tracking-widest bg-emerald-600 border-none">AÑADIR AUSPICIADOR</button>
                </form>

                <div id="patList" class="grid grid-cols-1 gap-3">
                    <!-- Lista de patrocinadores -->
                </div>
            </div>
        </div>
    `

    setupDropzone('pat_logo')

    const patList = document.getElementById('patList')
    const loadPatrocinadores = () => {
        const pats = tournament.patrocinadores || []
        patList.innerHTML = pats.length ? pats.map(p => `
            <div class="p-4 bg-slate-900/60 rounded-2xl border border-white/5 flex items-center justify-between group">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-white/5 rounded-xl overflow-hidden flex items-center justify-center p-2">
                        ${p.logo_url ? `<img src="${p.logo_url}" class="w-full h-full object-contain hover:scale-110 transition-all">` : `<span class="text-[10px] font-black text-slate-600">${p.nombre.substring(0,2)}</span>`}
                    </div>
                    <div>
                        <p class="font-black italic text-xs uppercase text-slate-200">${p.nombre}</p>
                        ${p.web_url ? `<a href="${p.web_url}" target="_blank" class="text-[9px] font-bold text-indigo-400 hover:underline">Visitar Sitio ➔</a>` : '<span class="text-[9px] font-bold text-slate-600">Sin sitio web</span>'}
                    </div>
                </div>
                <button class="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity btn-del-pat" data-id="${p.id}">&times;</button>
            </div>
        `).join('') : '<p class="text-center py-10 text-slate-700 italic text-[11px] font-black uppercase">No hay auspiciadores registrados.</p>'

        container.querySelectorAll('.btn-del-pat').forEach(btn => {
            btn.onclick = async () => {
                if(!confirm('¿Eliminar auspiciador?')) return
                const newPats = tournament.patrocinadores.filter(x => x.id !== btn.dataset.id)
                await supabase.from('torneos').update({ patrocinadores: newPats }).eq('id', tournamentId)
                loadInitialData()
            }
        })
    }
    loadPatrocinadores()

    document.getElementById('configForm').onsubmit = async (e) => {
        e.preventDefault()
        const btn = document.getElementById('btnSaveConfig')
        const fd = new FormData(e.target)
        btn.disabled = true; btn.innerText = 'GUARDANDO...'
        await supabase.from('torneos').update({
            logo_url: fd.get('logo_url'),
            color_primario: fd.get('color_primario'),
            color_secundario: fd.get('color_secundario'),
            descripcion: fd.get('descripcion')
        }).eq('id', tournamentId)
        loadInitialData()
    }

    document.getElementById('patrocinadorForm').onsubmit = async (e) => {
        e.preventDefault()
        const btn = document.getElementById('btnSavePat')
        const name = document.getElementById('patName').value
        const web = document.getElementById('patWeb').value
        const file = document.getElementById('pat_logo_input').files[0]

        btn.disabled = true; btn.innerText = 'SUBIENDO...'
        
        try {
            let logoUrl = null
            if (file) logoUrl = await uploadImage(file, 'auspiciadores', tournamentId)
            
            const newPat = {
                id: crypto.randomUUID(),
                nombre: name,
                web_url: web,
                logo_url: logoUrl
            }
            const currentPats = tournament.patrocinadores || []
            await supabase.from('torneos').update({
                patrocinadores: [...currentPats, newPat]
            }).eq('id', tournamentId)
            
            e.target.reset()
            loadInitialData()
        } catch (err) {
            alert(err.message)
            btn.disabled = false; btn.innerText = 'AÑADIR AUSPICIADOR'
        }
    }
  }

  loadInitialData()
}
