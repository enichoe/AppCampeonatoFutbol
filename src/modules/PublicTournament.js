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

        const [{ data: g }, { data: tab }, { data: p }, { data: eq }, { data: j }] = await Promise.all([
            supabase.from('grupos').select('*').eq('torneo_id', torneo.id),
            supabase.from('tabla_posiciones').select('*, equipos(nombre, escudo_url)').eq('torneo_id', torneo.id),
            supabase.from('partidos')
                .select(`*,
                    h:equipos!equipo_local_id(nombre, escudo_url),
                    a:equipos!equipo_visitante_id(nombre, escudo_url),
                    campo:campos!campo_id(nombre, sede:sedes!sede_id(nombre)),
                    arbitro:arbitros!arbitro_id(nombre)`)
                .eq('torneo_id', torneo.id)
                .order('fecha_hora', { ascending: false, nullsLast: true }),
            supabase.from('equipos').select('*').eq('torneo_id', torneo.id).is('deleted_at', null),
            supabase.from('jugadores').select('*, equipos(nombre)').eq('torneo_id', torneo.id)
        ])

        grupos = g || []
        tabla = tab || []
        partidos = p || []
        equipos = eq || []
        jugadores = j || []

        // Cargar eventos_partido ahora que tenemos los IDs de partidos
        const partidoIds = partidos.map(p => p.id)
        if (partidoIds.length > 0) {
            const { data: evData } = await supabase
                .from('eventos_partido')
                .select('*, jugadores(nombre, equipo_id, equipos(nombre))')
                .in('partido_id', partidoIds)
            eventos = evData || []
        }
    } catch (err) {
        console.error('Error cargando datos públicos del torneo', err)
        container.innerHTML = `<div class="p-8 text-center text-red-500">Error cargando datos del torneo.</div>`
        return
    }

    // --- Procesamiento de Datos y Helpers (Fuera del try para scope global en el render) ---
    
    // Índice de eventos por partido_id
    const eventosPorPartido = {}
    eventos.forEach(ev => {
        if (!eventosPorPartido[ev.partido_id]) eventosPorPartido[ev.partido_id] = []
        eventosPorPartido[ev.partido_id].push(ev)
    })

    // HELPER: Renderiza una card de partido profesional (usado en Partidos y Posiciones)
    const renderPublicMatchCard = (m) => {
        const showScore = m.estado === 'en_juego' || m.estado === 'finalizado'
        const hour = m.fecha_hora ? new Date(m.fecha_hora).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '--:--'
        const evs = eventosPorPartido[m.id] || []
        const golesL = evs.filter(e => e.tipo === 'gol' && e.jugadores?.equipo_id === m.equipo_local_id)
        const golesA = evs.filter(e => e.tipo === 'gol' && e.jugadores?.equipo_id === m.equipo_visitante_id)
        const amarillasL = evs.filter(e => e.tipo === 'amarilla' && e.jugadores?.equipo_id === m.equipo_local_id)
        const amarillasA = evs.filter(e => e.tipo === 'amarilla' && e.jugadores?.equipo_id === m.equipo_visitante_id)
        const rojasL = evs.filter(e => e.tipo === 'roja' && e.jugadores?.equipo_id === m.equipo_local_id)
        const rojasA = evs.filter(e => e.tipo === 'roja' && e.jugadores?.equipo_id === m.equipo_visitante_id)

        const renderEventBadges = (list, icon) => list.map(e => `
            <span class="inline-flex items-center gap-1 text-[9px] font-bold text-slate-400">
                ${icon} <span>${e.jugadores?.nombre?.split(' ')[0] || ''}</span>
            </span>
        `).join('')

        const hasVenue = m.campo?.nombre || m.campo?.sede?.nombre
        const hasRef = m.arbitro?.nombre

        return `
        <div class="match-card animate-fade">
            <div class="m-meta">
                <span class="m-status ${m.estado === 'en_juego' ? 'live' : m.estado === 'finalizado' ? 'done' : ''}">
                    ${m.estado === 'en_juego' ? '● EN VIVO' : m.estado === 'finalizado' ? '✓ FINALIZADO' : '○ PROGRAMADO'}
                </span>
                <span style="color:var(--text-muted);font-size:11px;font-weight:900">${hour} hrs</span>
            </div>
            <div class="m-grid">
                <div class="m-team">
                    <img src="${m.h?.escudo_url || 'https://ui-avatars.com/api/?name='+encodeURIComponent(m.h?.nombre||'?')}" loading="lazy">
                    <span>${m.h?.nombre || 'TBD'}</span>
                    ${showScore ? `<div class="m-incidents">${renderEventBadges(golesL,'⚽')}${renderEventBadges(amarillasL,'🟡')}${renderEventBadges(rojasL,'🔴')}</div>` : ''}
                </div>
                <div class="m-score-btn">
                    ${showScore ? `${m.goles_local ?? 0} - ${m.goles_visitante ?? 0}` : `<span class="m-vs">VS</span>`}
                </div>
                <div class="m-team">
                    <img src="${m.a?.escudo_url || 'https://ui-avatars.com/api/?name='+encodeURIComponent(m.a?.nombre||'?')}" loading="lazy">
                    <span>${m.a?.nombre || 'TBD'}</span>
                    ${showScore ? `<div class="m-incidents">${renderEventBadges(golesA,'⚽')}${renderEventBadges(amarillasA,'🟡')}${renderEventBadges(rojasA,'🔴')}</div>` : ''}
                </div>
            </div>
            <div class="m-footer" style="flex-direction:column;gap:6px;">
                <div style="display:flex;align-items:center;gap:6px;">
                    <span style="font-size:11px;">📍</span>
                    <span style="color:${hasVenue ? '#e2e8f0' : 'var(--text-muted)'}">
                        ${hasVenue ? `${m.campo.sede?.nombre ? m.campo.sede.nombre + ' — ' : ''}${m.campo.nombre}` : 'Sede por confirmar'}
                    </span>
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                    <span style="font-size:11px;">👨⚖️</span>
                    <span style="color:${hasRef ? '#e2e8f0' : 'var(--text-muted)'}">
                        ${hasRef ? m.arbitro.nombre : 'Árbitro por confirmar'}
                    </span>
                </div>
            </div>
        </div>
        `
    }

    const renderKnockoutPhases = (partidos) => {
        const koPhases = ['final', 'semifinal', 'semifinales', 'cuartos', 'octavos']
        const matches = (partidos || []).filter(p => p.fase && koPhases.includes(p.fase.toLowerCase()))
        if (matches.length === 0) return ''

        const grouped = {}
        matches.forEach(p => {
            let f = p.fase.toUpperCase()
            // Normalizar nombres para la vista
            if (f === 'FINAL') f = 'GRAN FINAL'
            if (f === 'SEMIFINAL' || f === 'SEMIFINALES') f = 'SEMIFINALES'
            if (f === 'CUARTOS') f = 'CUARTOS DE FINAL'
            if (f === 'OCTAVOS') f = 'OCTAVOS DE FINAL'

            if (!grouped[f]) grouped[f] = []
            grouped[f].push(p)
        })

        const order = ['OCTAVOS DE FINAL', 'CUARTOS DE FINAL', 'SEMIFINALES', 'GRAN FINAL']
        const sortedFases = Object.keys(grouped).sort((a,b) => order.indexOf(a) - order.indexOf(b))

        return sortedFases.map(fase => `
            <div class="group-header mt-14 mb-6 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(0,255,135,0.8)]"></div>
                        <span class="text-white font-black tracking-[0.2em] text-xs italic uppercase">${fase}</span>
                    </div>
                    <span class="text-[9px] font-bold text-slate-500 uppercase tracking-widest">${grouped[fase].length} PARTIDO${grouped[fase].length > 1 ? 'S' : ''}</span>
                </div>
                <div class="h-px bg-gradient-to-r from-primary/30 to-transparent mt-3"></div>
            </div>
            <div class="px-2 space-y-4">
                ${grouped[fase].map(m => renderPublicMatchCard(m)).join('')}
            </div>
        `).join('')
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

        /* ===== DATE DIVIDER ===== */
        .date-divider {
            display: flex;
            align-items: center;
            gap: 16px;
            margin: 36px 16px 16px;
        }
        .date-pill {
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 10px 18px;
            white-space: nowrap;
            backdrop-filter: blur(10px);
        }
        .date-day {
            font-size: 28px;
            font-weight: 900;
            font-style: italic;
            color: var(--primary);
            line-height: 1;
        }
        .date-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        .date-weekday {
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #fff;
        }
        .date-month {
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: var(--text-muted);
        }
        .date-count {
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: var(--text-muted);
            background: rgba(255,255,255,0.05);
            padding: 4px 10px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.07);
        }
        .date-line {
            flex: 1;
            height: 1px;
            background: linear-gradient(to right, rgba(255,255,255,0.08), transparent);
        }

        /* ===== MATCH INCIDENTS ===== */
        .m-incidents {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 4px;
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px solid rgba(255,255,255,0.05);
            font-size: 9px;
            font-weight: 700;
            color: var(--text-muted);
        }
        .m-status.done {
            background: rgba(16,185,129,0.1);
            color: #10b981;
            border: 1px solid rgba(16,185,129,0.2);
        }
    </style>

    <div class="tournament-app">
        <header class="header-box">
            <img src="${torneo.logo_url || 'https://via.placeholder.com/150'}" class="main-logo" alt="Logo ${torneo.nombre}">
            <h1 class="text-3xl font-black italic uppercase tracking-tighter leading-none">${torneo.nombre}</h1>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-3">${torneo.tipo === 'liga' ? 'Liga Profesional' : 'Torneo de Copa'}</p>
        </header>

        ${torneo.estado === 'finalizado' ? `
            <div class="champion-banner p-8 bg-gradient-to-br from-[#FFD700] via-[#FDB931] to-[#D4AF37] rounded-[40px] mx-6 my-10 shadow-[0_20px_60px_rgba(212,175,55,0.4)] relative overflow-hidden flex flex-col items-center gap-6 border-4 border-white/30 animate-pulse-slow">
                <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div class="absolute top-0 right-0 p-4 opacity-10">
                    <svg class="w-40 h-40 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L9 9H1L7 15L4 23L12 18L20 23L17 15L23 9H15L12 1z"></path></svg>
                </div>
                
                <div class="z-10 text-center">
                   <div class="inline-flex items-center gap-2 bg-black/10 px-4 py-1 rounded-full mb-4">
                        <span class="text-[9px] font-black text-yellow-900 uppercase tracking-[0.4em] italic">🏆 Campéon Oficial</span>
                   </div>
                   <h2 class="text-5xl font-black text-yellow-950 italic tracking-tighter uppercase drop-shadow-sm">${torneo.campeon_nombre || 'POR DEFINIR'}</h2>
                </div>

                <div class="z-10 flex gap-4 w-full justify-center">
                   ${torneo.foto_campeon_url ? `
                   <div class="w-1/2 aspect-video rounded-3xl overflow-hidden border-4 border-white/50 shadow-2xl skew-x-[-2deg]">
                        <img src="${torneo.foto_campeon_url}" class="w-full h-full object-cover">
                   </div>` : ''}
                   ${torneo.foto_trofeo_url ? `
                   <div class="w-1/2 aspect-video rounded-3xl overflow-hidden border-4 border-white/50 shadow-2xl skew-x-[2deg]">
                        <img src="${torneo.foto_trofeo_url}" class="w-full h-full object-cover">
                   </div>` : ''}
                </div>

                <p class="z-10 text-xs font-black italic text-yellow-950/60 uppercase tracking-widest text-center px-6 leading-relaxed">
                    "${torneo.frase_campeon || '¡Historia escrita en la cancha!'}"
                </p>
                
                <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
            </div>
        ` : ''}

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
                    ${renderPosicionesProfessional(grupos, tabla)}
                </div>
                
                <div class="knockout-wrap px-4 pb-16">
                    ${partidos.some(p => p.fase && ['final', 'semifinal', 'semifinales', 'cuartos', 'octavos'].includes(p.fase.toLowerCase())) ? `
                        <div class="mt-8 mb-2 px-2">
                            <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-primary/50 italic text-center">Fases de Eliminación Directa</h2>
                        </div>
                    ` : ''}
                    ${renderKnockoutPhases(partidos)}
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
                ${renderPartidosProfessional(partidos, eventos)}
                
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
        // DEBUG: log para diagnosticar datos
        console.log('[Posiciones] grupos:', grupos.length, grupos.map(g => ({id: g.id, nombre: g.nombre})))
        console.log('[Posiciones] tabla:', tabla.length, tabla.map(t => ({equipo: t.equipos?.nombre, grupo_id: t.grupo_id, pts: t.pts})))

        const tableHeader = `
            <div class="table-row table-header">
                <span>#</span><span></span><span>Club</span><span>PJ</span><span>DG</span><span class="text-center">Pts</span>
            </div>
        `

        const renderRow = (r, i) => `
            <div class="table-row">
                <span class="st-pos">${(i + 1).toString().padStart(2, '0')}</span>
                <img src="${r.equipos?.escudo_url || 'https://ui-avatars.com/api/?name='+encodeURIComponent(r.equipos?.nombre || '?')}" class="st-logo" loading="lazy">
                <span class="st-name">${r.equipos?.nombre || 'Equipo'}</span>
                <span class="st-val text-slate-400">${r.pj ?? 0}</span>
                <span class="st-val text-slate-400">${(r.dg ?? 0) > 0 ? '+' : ''}${r.dg ?? 0}</span>
                <span class="st-val st-pts">${r.pts ?? 0}</span>
            </div>
        `

        if (!grupos || grupos.length === 0) {
            // Sin grupos: tabla única con header
            return tableHeader + tabla.sort((a,b) => b.pts - a.pts || b.dg - a.dg).map((r, i) => renderRow(r, i)).join('')
        }

        // Con grupos: una tabla por grupo, cada una con su propio header
        return grupos.map(g => {
            const tableGrp = tabla.filter(t => t.grupo_id === g.id).sort((a,b) => b.pts - a.pts || b.dg - a.dg)
            console.log(`[Grupo ${g.nombre}] equipos en tabla:`, tableGrp.length)
            return `
                <div class="group-header" style="margin-top: 28px;">
                    <span>${g.nombre}</span>
                    <div class="line"></div>
                </div>
                ${tableHeader}
                ${tableGrp.length > 0
                    ? tableGrp.map((r, i) => renderRow(r, i)).join('')
                    : `<div class="py-4 text-center text-xs text-slate-600 font-bold uppercase tracking-widest">Sin equipos asignados</div>`
                }
            `
        }).join('')
    }

    function renderPartidosProfessional(partidos) {
        if (!partidos || partidos.length === 0) {
            return `<div class="py-20 text-center opacity-20 font-black italic uppercase tracking-widest">No hay partidos programados</div>`
        }

        const phasesOrder = ['final', 'semifinales', 'semifinal', 'cuartos', 'octavos', 'grupos']
        const phaseNames = {
            'final': 'Gran Final 🏆',
            'semifinales': 'Semifinales',
            'semifinal': 'Semifinales',
            'cuartos': 'Cuartos de Final',
            'octavos': 'Octavos de Final',
            'grupos': 'Fase de Grupos'
        }

        // Primero agrupamos por fase
        const porFase = {}
        partidos.forEach(m => {
            const fase = (m.fase || 'grupos').toLowerCase()
            if (!porFase[fase]) porFase[fase] = []
            porFase[fase].push(m)
        })

        // Orden de fases (descendente según el flow del torneo)
        const fasesExistentes = Object.keys(porFase).sort((a, b) => {
            return phasesOrder.indexOf(a) - phasesOrder.indexOf(b)
        })

        let html = ''

        fasesExistentes.forEach(fase => {
            const matchesFase = porFase[fase]
            const phaseTitle = phaseNames[fase] || fase.toUpperCase()

            html += `
                <div class="group-header mt-12 mb-6 bg-primary/5 p-4 rounded-3xl border border-primary/10 backdrop-blur-md mx-4 shadow-lg shadow-primary/5">
                    <div class="flex items-center gap-4">
                        <div class="w-2 h-8 bg-primary rounded-full shadow-[0_0_15px_rgba(0,255,135,0.4)]"></div>
                        <h2 class="text-xl font-black italic uppercase tracking-tighter text-white">PARTIDOS DE ${phaseTitle}</h2>
                    </div>
                </div>
            `

            // Dentro de cada fase, agrupamos por fecha (descendente)
            const porFecha = {}
            const ordenFechas = []
            matchesFase.forEach(m => {
                const key = m.fecha_hora 
                    ? new Date(m.fecha_hora).toISOString().slice(0, 10) 
                    : 'sin-fecha'
                if (!porFecha[key]) {
                    porFecha[key] = []
                    if (key !== 'sin-fecha') ordenFechas.push(key)
                }
                porFecha[key].push(m)
            })

            const fechasOrdenadas = [...new Set(ordenFechas)].sort().reverse()
            
            fechasOrdenadas.forEach(key => {
                const dateObj = new Date(key + 'T12:00:00')
                const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'long' }).toUpperCase()
                const dayNum = dateObj.getDate()
                const monthName = dateObj.toLocaleDateString('es-ES', { month: 'long' }).toUpperCase()

                html += `
                    <div class="date-divider">
                        <div class="date-pill">
                            <span class="date-day">${dayNum}</span>
                            <div class="date-info">
                                <span class="date-weekday">${dayName}</span>
                                <span class="date-month">${monthName}</span>
                            </div>
                        </div>
                        <div class="date-line"></div>
                    </div>
                `
                porFecha[key].forEach(m => { html += renderPublicMatchCard(m) })
            })

            // Partidos de esta fase sin fecha
            if (porFecha['sin-fecha']) {
                html += `
                    <div class="date-divider opacity-40">
                        <div class="date-pill">
                            <span class="date-day">--</span>
                            <div class="date-info">
                                <span class="date-weekday">POR DEFINIR</span>
                                <span class="date-month">SIN FECHA</span>
                            </div>
                        </div>
                        <div class="date-line"></div>
                    </div>
                `
                porFecha['sin-fecha'].forEach(m => { html += renderPublicMatchCard(m) })
            }
        })

        return html
    }

    function renderStatsProfessional(eventos, jugadores) {
        // Goleadores
        const scorers = {}
        // Tarjetas amarillas
        const yellows = {}
        // Tarjetas rojas
        const reds = {}

        eventos.forEach(e => {
            const jugador = e.jugadores // join incluido en la query
            if (!jugador) return
            const key = e.jugador_id
            const nombre = jugador.nombre || 'Desconocido'
            const equipo = jugador.equipos?.nombre || '-'

            if (e.tipo === 'gol') {
                if (!scorers[key]) scorers[key] = { nombre, equipo, count: 0 }
                scorers[key].count++
            } else if (e.tipo === 'amarilla') {
                if (!yellows[key]) yellows[key] = { nombre, equipo, count: 0 }
                yellows[key].count++
            } else if (e.tipo === 'roja') {
                if (!reds[key]) reds[key] = { nombre, equipo, count: 0 }
                reds[key].count++
            }
        })

        const scorerList = Object.values(scorers).sort((a,b) => b.count - a.count).slice(0, 10)
        const yellowList = Object.values(yellows).sort((a,b) => b.count - a.count).slice(0, 10)
        const redList = Object.values(reds).sort((a,b) => b.count - a.count).slice(0, 10)

        const renderStatRow = (item, i, icon) => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:16px;margin-bottom:8px">
                <div style="display:flex;align-items:center;gap:14px">
                    <span style="font-size:22px;font-weight:900;font-style:italic;color:#1e293b;min-width:28px">#${i+1}</span>
                    <div>
                        <p style="font-size:12px;font-weight:900;text-transform:uppercase;color:#fff">${item.nombre}</p>
                        <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--primary)">${item.equipo}</p>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                    <span style="font-size:18px">${icon}</span>
                    <span style="font-size:24px;font-weight:900;font-style:italic;color:#fff">${item.count}</span>
                </div>
            </div>
        `

        const emptyMsg = (icon, text) => `
            <div style="padding:32px;text-align:center;opacity:0.2;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.2em">${icon} ${text}</div>
        `

        return `
            <div style="padding:0 16px 40px">
                <div class="group-header" style="margin-top:8px">
                    <span>⚽ Goleadores</span>
                    <div class="line"></div>
                </div>
                <div style="margin-top:12px">
                    ${scorerList.length ? scorerList.map((s,i) => renderStatRow(s, i, '⚽')).join('') : emptyMsg('⚽', 'Sin goles registrados')}
                </div>

                <div class="group-header" style="margin-top:32px">
                    <span>🟡 Amonestados</span>
                    <div class="line"></div>
                </div>
                <div style="margin-top:12px">
                    ${yellowList.length ? yellowList.map((s,i) => renderStatRow(s, i, '🟡')).join('') : emptyMsg('🟡', 'Sin tarjetas amarillas')}
                </div>

                <div class="group-header" style="margin-top:32px">
                    <span>🔴 Expulsados</span>
                    <div class="line"></div>
                </div>
                <div style="margin-top:12px">
                    ${redList.length ? redList.map((s,i) => renderStatRow(s, i, '🔴')).join('') : emptyMsg('🔴', 'Sin tarjetas rojas')}
                </div>
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
