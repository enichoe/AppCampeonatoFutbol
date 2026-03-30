import { supabase } from '../services/supabase.js'

export const renderPublicTournament = async (container, params) => {
    // Cargar datos iniciales del torneo y recursos relacionados
    const slug = params?.slug || params
    let torneo = null, grupos = [], tabla = [], partidos = [], equipos = [], eventos = [], jugadores = []
    try {
        const { data: t, error: errT } = await supabase.from('torneos').select('*').eq('slug', slug).maybeSingle()
        if (errT || !t) {
            console.error('Torneo no encontrado', errT)
            container.innerHTML = `<div class="p-8 text-center text-red-500">Torneo no encontrado.</div>`
            return
        }
        torneo = t

        const [{ data: g }, { data: tab }, { data: p }, { data: eq }, { data: ev }, { data: j }] = await Promise.all([
            supabase.from('grupos').select('*').eq('torneo_id', torneo.id).is('deleted_at', null),
            supabase.from('tabla_posiciones').select('*, equipos(nombre, escudo_url)').eq('torneo_id', torneo.id),
            supabase.from('partidos').select('*').eq('torneo_id', torneo.id).is('deleted_at', null),
            supabase.from('equipos').select('*').eq('torneo_id', torneo.id).is('deleted_at', null),
            supabase.from('eventos').select('*').eq('torneo_id', torneo.id),
            supabase.from('jugadores').select('*').eq('torneo_id', torneo.id)
        ])

        grupos = g || []
        tabla = tab || []
        partidos = p || []
        equipos = eq || []
        eventos = ev || []
        jugadores = j || []
    } catch (err) {
        console.error('Error cargando datos públicos del torneo', err)
        container.innerHTML = `<div class="p-8 text-center text-red-500">Error cargando datos del torneo.</div>`
        return
    }

    // UI RENDER
    container.innerHTML = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        :root {
            --primary: ${torneo.color_primario || '#00ff87'};
            --secondary: ${torneo.color_secundario || '#00d4ff'};
            --dark-bg: #03050a;
            --glass: rgba(255, 255, 255, 0.05);
            --glass-strong: rgba(255, 255, 255, 0.1);
            --border: rgba(255, 255, 255, 0.1);
            --text-muted: #94a3b8;
        }

        .tournament-app {
            background-color: var(--dark-bg);
            color: #fff;
            font-family: 'Outfit', sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
            background-image: radial-gradient(circle at 50% 0%, var(--primary) -200%, transparent 50%);
            display: flex;
            flex-direction: column;
        }

        .header-box { 
            padding: 20px 20px; 
            text-align: center; 
            background: linear-gradient(to bottom, rgba(3,5,10,0.8), transparent);
        }
        .main-logo { 
            width: 80px; 
            height: 80px; 
            margin: 0 auto 12px; 
            border-radius: 20px; 
            border: 2px solid var(--primary); 
            padding: 8px; 
            background: rgba(0,0,0,0.4); 
            object-fit: contain;
            box-shadow: 0 0 30px rgba(0,255,135,0.2);
        }

        /* Sticky Navigation */
        .sticky-nav { 
            position: sticky; 
            top: 0; 
            z-index: 100; 
            background: rgba(3, 5, 10, 0.9); 
            backdrop-filter: blur(20px); 
            padding: 12px 16px; 
            border-bottom: 1px solid var(--border); 
        }
        .segmented-control { 
            background: rgba(255, 255, 255, 0.05); 
            display: flex; 
            padding: 4px; 
            border-radius: 16px; 
            gap: 4px; 
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }
        .segment-btn { 
            flex: 1; 
            border: none; 
            background: none; 
            color: var(--text-muted); 
            padding: 12px 0; 
            border-radius: 12px; 
            font-weight: 800; 
            font-size: 0.75rem; 
            text-transform: uppercase; 
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
            letter-spacing: 0.05em;
        }
        .segment-btn.active { 
            background: #fff; 
            color: #000; 
            box-shadow: 0 4px 20px rgba(255,255,255,0.1); 
            transform: scale(1.02);
        }

        /* Modern Table / Standings */
        .standings-wrap { padding: 10px 16px; }
        .table-row { 
            display: grid; 
            grid-template-columns: 35px 35px 1fr 35px 35px 45px; 
            align-items: center; 
            gap: 8px; 
            padding: 16px 0; 
            border-bottom: 1px solid var(--border); 
        }
        .table-header { 
            color: var(--text-muted); 
            font-size: 10px; 
            font-weight: 900; 
            text-transform: uppercase; 
            letter-spacing: 0.1em;
        }
        .st-pos { font-weight: 900; font-size: 14px; color: #4b5563; font-style: italic; }
        .st-logo { width: 28px; height: 28px; object-fit: contain; }
        .st-name { font-weight: 700; font-size: 12px; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 5px; }
        .st-val { text-align: center; font-weight: 700; font-size: 12px; }
        .st-pts { 
            color: var(--primary); 
            background: rgba(0,255,135,0.08); 
            border-radius: 8px; 
            padding: 4px 0; 
            font-weight: 900; 
            font-size: 13px;
            border: 1px solid rgba(0,255,135,0.1);
        }

        /* Phase / Date Grouping Headers */
        .group-header {
            margin: 24px 16px 12px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .group-header span {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--primary);
            background: rgba(0,255,135,0.1);
            padding: 4px 12px;
            border-radius: 20px;
        }
        .group-header .line { flex: 1; height: 1px; background: linear-gradient(to right, rgba(0,255,135,0.2), transparent); }

        /* Professional Match Cards */
        .match-card { 
            background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)); 
            border: 1px solid var(--border); 
            border-radius: 28px; 
            margin: 0 16px 16px; 
            padding: 24px; 
            position: relative; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .match-card::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 28px;
            background: radial-gradient(circle at top right, rgba(255,255,255,0.05), transparent 70%);
            pointer-events: none;
        }
        
        .m-meta { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            font-size: 9px; 
            font-weight: 900; 
            color: var(--text-muted); 
            margin-bottom: 20px; 
            text-transform: uppercase; 
            letter-spacing: 0.1em;
        }
        .m-status {
            padding: 2px 8px;
            border-radius: 6px;
            background: rgba(255,255,255,0.05);
        }
        .m-status.live { background: #ef4444; color: #fff; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }

        .m-grid { 
            display: grid; 
            grid-template-columns: 1fr 80px 1fr; 
            align-items: center; 
            gap: 12px; 
            text-align: center; 
        }
        .m-team { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .m-team img { 
            width: 60px; 
            height: 60px; 
            object-fit: contain; 
            filter: drop-shadow(0 8px 15px rgba(0,0,0,0.5)); 
            transition: transform 0.3s ease;
        }
        .m-team:active img { transform: scale(0.9); }
        .m-team span { 
            font-size: 11px; 
            font-weight: 900; 
            text-transform: uppercase; 
            line-height: 1.2; 
            max-width: 90px;
        }
        
        .m-score-btn {
            background: rgba(0,0,0,0.4); 
            border-radius: 16px; 
            padding: 14px 0; 
            font-weight: 900; 
            font-size: 26px; 
            font-style: italic; 
            border: 1px solid var(--border);
            color: #fff;
            text-shadow: 0 0 20px rgba(255,255,255,0.2);
            box-shadow: inset 0 2px 10px rgba(0,0,0,0.5);
        }
        .m-vs { font-size: 14px; font-style: normal; color: var(--text-muted); opacity: 0.5; }

        .m-footer {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid rgba(255,255,255,0.05);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            font-size: 9px;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
        }

        /* Sponsors Section */
        .sponsors-box {
            margin: 40px 16px 20px;
            padding: 24px;
            background: var(--glass);
            border-radius: 24px;
            border: 1px solid var(--border);
            text-align: center;
        }
        .sponsors-title {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.3em;
            color: var(--text-muted);
            margin-bottom: 20px;
        }
        .sponsors-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            opacity: 0.6;
        }
        .sponsor-item { height: 30px; object-fit: contain; max-width: 100px; }

        /* Club Cards */
        .club-card {
            background: var(--glass);
            border: 1px solid var(--border);
            border-radius: 24px;
            padding: 24px;
            text-align: center;
            transition: all 0.3s ease;
        }
        .club-card:active { transform: scale(0.95); background: var(--glass-strong); }

        .btn-view-players {
            margin-top: 15px;
            width: 100%;
            padding: 10px;
            background: var(--primary);
            color: #000;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .hidden { display: none; }
        
        .tab-content.animate-fade {
            animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Modal Overhaul */
        #roster-modal {
            background: rgba(3, 5, 10, 0.98);
        }
        .player-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px;
            background: rgba(255,255,255,0.03);
            border: 1px solid rgba(255,255,255,0.05);
            border-radius: 16px;
            margin-bottom: 8px;
        }
    </style>

    <div class="tournament-app">
        <header class="header-box">
            <img src="${torneo.logo_url || 'https://via.placeholder.com/150'}" class="main-logo" alt="Logo ${torneo.nombre}">
            <h1 class="text-3xl font-black italic uppercase tracking-tighter leading-none">${torneo.nombre}</h1>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-3">${torneo.tipo === 'liga' ? 'Liga Profesional' : 'Torneo de Copa'}</p>
        </header>

        <nav class="sticky-nav">
            <div class="segmented-control">
                <button class="segment-btn active" data-tab="posiciones">Tablas</button>
                <button class="segment-btn" data-tab="partidos">Partidos</button>
                <button class="segment-btn" data-tab="equipos">Clubes</button>
                <button class="segment-btn" data-tab="estadisticas">Stats</button>
            </div>
        </nav>

        <main class="py-6 flex-1">
            <!-- SECCIÓN POSICIONES -->
            <section id="section-posiciones" class="tab-content animate-fade">
                <div class="standings-wrap">
                    <div class="table-row table-header">
                        <span>#</span><span></span><span>Club</span><span>PJ</span><span>DG</span><span class="text-center">Pts</span>
                    </div>
                    ${renderPosicionesProfessional(grupos, tabla)}
                </div>
                
                <!-- Auspiciadores en Posiciones (dinámicos) -->
                <div class="sponsors-box">
                    <div class="sponsors-title">Patrocinadores Oficiales</div>
                    <div class="sponsors-grid">
                        ${torneo.patrocinadores && torneo.patrocinadores.length ? torneo.patrocinadores.map(p => `
                            ${p.logo_url ? `<img src="${p.logo_url}" class="h-8 object-contain" loading="lazy">` : `<span class="text-xs font-black opacity-30 uppercase italic">${p.nombre}</span>`}
                        `).join('') : `<p class="text-xs font-black text-slate-600 uppercase italic">No hay patrocinadores registrados.</p>`}
                    </div>
                </div>
            </section>

            <!-- SECCIÓN PARTIDOS -->
            <section id="section-partidos" class="tab-content hidden animate-fade">
                ${renderPartidosProfessional(partidos)}
                
                <div class="p-10 text-center">
                    <div class="sponsors-title">Partner Tecnológico</div>
                    <p class="text-xs font-black text-white/20 italic uppercase tracking-widest">Antigravity Sports Engine</p>
                </div>
            </section>

            <!-- SECCIÓN CLUBES -->
            <section id="section-equipos" class="tab-content hidden px-4">
                <div class="grid grid-cols-2 gap-4">
                    ${equipos.map(e => `
                        <div class="club-card animate-fade">
                            <img src="${e.escudo_url || 'https://ui-avatars.com/api/?name='+e.nombre}" class="w-20 h-20 mx-auto mb-4 object-contain filter drop-shadow-xl">
                            <h3 class="font-black text-xs uppercase truncate mb-1">${e.nombre}</h3>
                            <button class="btn-view-players btn-club-details" data-team-id="${e.id}">Ver Plantilla</button>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- SECCIÓN STATS -->
            <section id="section-estadisticas" class="tab-content hidden px-4">
                ${renderStatsProfessional(eventos, jugadores)}
            </section>
        </main>
        
        <footer class="p-10 text-center">
            <div class="h-px w-20 bg-primary/20 mx-auto mb-6"></div>
            <p class="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Powered by SportSaaS Pro</p>
        </footer>
    </div>

    <!-- MODAL PLANTILLA -->
    <div id="roster-modal" class="hidden fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-xl transition-all duration-300">
        <div class="w-full max-w-sm transform scale-90 opacity-0 transition-all duration-300" id="roster-content-container">
            <div class="flex justify-between items-center mb-10">
                <span class="text-[10px] font-black uppercase tracking-widest text-primary">Plantilla Oficial</span>
                <button id="close-modal" class="w-10 h-10 flex items-center justify-center bg-white/10 rounded-full text-white text-2xl font-light">&times;</button>
            </div>
            <div id="modal-content"></div>
        </div>
    </div>
    `

    // Referencias al modal (usadas en setupEvents)
    const rosterModal = document.getElementById('roster-modal')
    const rosterContainer = document.getElementById('roster-content-container')
    const modalContent = document.getElementById('modal-content')

    function renderPosicionesProfessional(grupos, tabla) {
        const renderRow = (r, i) => `
            <div class="table-row">
                <span class="st-pos">${(i + 1).toString().padStart(2, '0')}</span>
                <img src="${r.equipos?.escudo_url || 'https://ui-avatars.com/api/?name='+r.equipos?.nombre}" class="st-logo" loading="lazy">
                <span class="st-name">${r.equipos?.nombre}</span>
                <span class="st-val text-slate-400">${r.pj}</span>
                <span class="st-val text-slate-400">${r.dg > 0 ? '+' : ''}${r.dg}</span>
                <span class="st-val st-pts">${r.pts}</span>
            </div>
        `

        if (!grupos || grupos.length === 0) {
            return tabla.sort((a,b) => b.pts - a.pts || b.dg - a.dg).map((r, i) => renderRow(r, i)).join('')
        }

        return grupos.map(g => {
            const tableGrp = tabla.filter(t => t.grupo_id === g.id).sort((a,b) => b.pts - a.pts || b.dg - a.dg)
            return `
                <div class="group-header">
                    <span>${g.nombre}</span>
                    <div class="line"></div>
                </div>
                ${tableGrp.map((r, i) => renderRow(r, i)).join('')}
            `
        }).join('')
    }

    function renderPartidosProfessional(partidos) {
        if (!partidos || partidos.length === 0) {
            return `<div class="py-20 text-center opacity-20 font-black italic uppercase tracking-widest">No hay partidos programados</div>`
        }

        // Agrupar por fase y luego por fecha
        const phases = {}
        partidos.forEach(p => {
            const phase = p.fase || 'TEMPORADA REGULAR'
            if (!phases[phase]) phases[phase] = []
            phases[phase].push(p)
        })

        let html = ''
        
        // Orden de fases preferido
        const phaseOrder = ['FASE DE GRUPOS', 'OCTAVOS', 'CUARTOS', 'SEMIFINAL', 'FINAL']
        const sortedPhases = Object.keys(phases).sort((a, b) => {
            const idxA = phaseOrder.indexOf(a.toUpperCase())
            const idxB = phaseOrder.indexOf(b.toUpperCase())
            if (idxA === -1 && idxB === -1) return a.localeCompare(b)
            if (idxA === -1) return 1
            if (idxB === -1) return -1
            return idxA - idxB
        })

        sortedPhases.forEach(phaseName => {
            html += `
                <div class="group-header mt-10">
                    <span>${phaseName}</span>
                    <div class="line"></div>
                </div>
            `
            
            // Agrupar por fecha dentro de la fase
            const matchesByDate = {}
            phases[phaseName].forEach(m => {
                const date = m.fecha_hora 
                    ? new Date(m.fecha_hora).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
                    : 'FECHA POR DEFINIR'
                if (!matchesByDate[date]) matchesByDate[date] = []
                matchesByDate[date].push(m)
            })

            Object.entries(matchesByDate).forEach(([dateStr, matches]) => {
                html += `<p class="px-5 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 mt-6">${dateStr}</p>`
                
                matches.forEach(m => {
                    const hour = m.fecha_hora ? new Date(m.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'
                    const showScore = m.estado === 'en_juego' || m.estado === 'finalizado'
                    
                    html += `
                    <div class="match-card animate-fade">
                        <div class="m-meta">
                            <span class="m-status ${m.estado === 'en_juego' ? 'live' : ''}">
                                ${m.estado === 'en_juego' ? '• EN VIVO' : m.estado === 'finalizado' ? 'FINALIZADO' : 'PROGRAMADO'}
                            </span>
                            <span>${hour}</span>
                        </div>
                        <div class="m-grid">
                            <div class="m-team">
                                <img src="${m.h?.escudo_url || 'https://ui-avatars.com/api/?name='+m.h?.nombre}" loading="lazy">
                                <span>${m.h?.nombre || 'TBD'}</span>
                            </div>
                            <div class="m-score-btn">
                                ${showScore 
                                    ? `${m.goles_local} - ${m.goles_visitante}` 
                                    : `<span class="m-vs">VS</span>`
                                }
                            </div>
                            <div class="m-team">
                                <img src="${m.a?.escudo_url || 'https://ui-avatars.com/api/?name='+m.a?.nombre}" loading="lazy">
                                <span>${m.a?.nombre || 'TBD'}</span>
                            </div>
                        </div>
                        <div class="m-footer">
                            <svg class="w-3 h-3 text-primary opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span>${m.campo?.sede?.nombre || 'Sede'} • ${m.campo?.nombre || 'Cancha TBD'}</span>
                        </div>
                    </div>
                    `
                })
            })
        })

        return html
    }

    function renderStatsProfessional(eventos, jugadores) {
        const scorers = {}
        eventos.filter(e => e.tipo === 'gol').forEach(e => {
            const p = jugadores.find(j => j.id === e.jugador_id)
            if (p) {
                if (!scorers[p.id]) scorers[p.id] = { p, goals: 0 }
                scorers[p.id].goals++
            }
        })
        const list = Object.values(scorers).sort((a,b) => b.goals - a.goals).slice(0, 10)

        return `
            <div class="space-y-6 animate-fade mt-4">
                <div class="group-header">
                    <span>Goleadores</span>
                    <div class="line"></div>
                </div>
                ${list.map((s, i) => `
                    <div class="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5">
                        <div class="flex items-center gap-5">
                            <span class="text-2xl font-black italic text-slate-800">#${i+1}</span>
                            <div>
                                <p class="text-xs font-black uppercase text-white">${s.p.nombre}</p>
                                <p class="text-[9px] text-primary font-bold uppercase tracking-widest">${s.p.equipos?.nombre}</p>
                            </div>
                        </div>
                        <div class="text-3xl font-black italic text-white">${s.goals}</div>
                    </div>
                `).join('') || '<p class="opacity-20 text-[10px] text-center py-20 uppercase font-black italic tracking-widest">Sin registros de goles</p>'}
            </div>
        `
    }

    const setupEvents = () => {
        // Tab switching
        container.querySelectorAll('.segment-btn').forEach(btn => {
            btn.onclick = () => {
                container.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'))
                btn.classList.add('active')
                container.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'))
                
                const target = btn.dataset.tab
                const targetSection = document.getElementById(`section-${target}`)
                if (targetSection) {
                    targetSection.classList.remove('hidden')
                }
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        })

        // Roster interaction (usa variables ya definidas más arriba)
        // const rosterModal, rosterContainer, modalContent ya existen en el scope exterior
        const closeRoster = () => {
            rosterContainer.classList.add('scale-90', 'opacity-0')
            setTimeout(() => rosterModal.classList.add('hidden'), 300)
        }

        container.querySelectorAll('.btn-club-details').forEach(btn => {
            btn.onclick = async () => {
                const teamId = btn.dataset.teamId
                const team = equipos.find(e => e.id === teamId)
                if (!team) return

                // Mostrar modal con loading mientras carga
                rosterModal.classList.remove('hidden')
                setTimeout(() => rosterContainer.classList.remove('scale-90', 'opacity-0'), 10)

                modalContent.innerHTML = `
                    <div class="text-center animate-fade mb-8">
                        <img src="${team.escudo_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(team.nombre)}" class="w-32 h-32 mx-auto mb-4 object-contain filter drop-shadow-2xl">
                        <h2 class="text-3xl font-black uppercase italic tracking-tighter text-white">${team.nombre}</h2>
                    </div>
                    <div id="players-list-modal" class="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                        <div class="py-10 text-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-white/30 mx-auto"></div>
                        </div>
                    </div>
                `

                try {
                    const { data: players, error } = await supabase
                        .from('jugadores')
                        .select('*')
                        .eq('equipo_id', teamId)
                        .order('dorsal', { ascending: true })

                    if (error) throw error

                    const listEl = document.getElementById('players-list-modal')
                    if (!listEl) return

                    if (!players || players.length === 0) {
                        listEl.innerHTML = `<p class="py-10 text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">No hay jugadores registrados</p>`
                        return
                    }

                    listEl.innerHTML = players.map(p => {
                        const avatarUrl = p.foto_url 
                            ? p.foto_url 
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(p.nombre || 'J')}&background=1e293b&color=94a3b8&size=80&bold=true`
                        return `
                        <div class="player-row">
                            <div class="flex items-center gap-4">
                                <img 
                                    src="${avatarUrl}" 
                                    alt="${p.nombre || 'Jugador'}"
                                    class="w-10 h-10 rounded-full object-cover border border-slate-700 bg-slate-800"
                                    loading="lazy"
                                    onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(p.nombre || 'J')}&background=1e293b&color=94a3b8&size=80&bold=true'"
                                >
                                <div class="text-left">
                                    <p class="font-black uppercase text-xs text-white">${p.nombre || '-'}</p>
                                    <p class="text-[8px] text-slate-500 font-bold uppercase">${p.posicion || 'Jugador'}</p>
                                </div>
                            </div>
                            <span class="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-lg">#${p.dorsal || '--'}</span>
                        </div>
                    `}).join('')
                } catch (err) {
                    const listEl = document.getElementById('players-list-modal')
                    if (listEl) listEl.innerHTML = `<p class="py-6 text-center text-red-400 text-xs">${err.message || 'Error al cargar jugadores'}</p>`
                    console.error('Error cargando plantilla:', err)
                }
            }
        })

        document.getElementById('close-modal').onclick = closeRoster
        rosterModal.onclick = (e) => { if (e.target === rosterModal) closeRoster() }
    }

    setupEvents()
}
