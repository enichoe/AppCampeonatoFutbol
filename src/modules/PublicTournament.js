import { supabase } from '../services/supabase.js'
import { parsearFechaLocal, formatearFecha, formatearFechaHora } from '../utils/fechas.js'
import { renderEscudo, renderFotoJugador } from '../utils/storage.js'
import { state } from '../main.js'

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
            supabase.from('vista_posiciones').select('*').eq('torneo_id', torneo.id),
            supabase.from('partidos')
                .select(`*,
                    h:equipos!equipo_local_id(nombre, escudo_url),
                    a:equipos!equipo_visitante_id(nombre, escudo_url),
                    campo:campos!campo_id(nombre, sede:sedes!sede_id(nombre)),
                    arbitro:arbitros!arbitro_id(nombre)`)
                .eq('torneo_id', torneo.id)
                .order('fecha_hora', { ascending: false, nullsLast: true }),
            supabase.from('equipos').select('*').eq('torneo_id', torneo.id).is('deleted_at', null),
            supabase.from('jugadores_publicos').select('*, equipos(nombre)').eq('torneo_id', torneo.id)
        ])

        grupos = g || []
        tabla = tab || []
        partidos = p || []
        equipos = eq || []
        jugadores = j || []

        // DIAGNÓSTICO: Inspección de URLs
        console.group('FIFA App - Image Diagnostics')
        console.table(equipos.map(e => ({ nombre: e.nombre, escudo_url: e.escudo_url, ok: !!e.escudo_url?.startsWith('http') })))
        console.table(jugadores.slice(0,5).map(j => ({ nombre: j.nombre, foto_url: j.foto_url, ok: !!j.foto_url?.startsWith('http') })))
        console.groupEnd()

        const partidoIds = partidos.map(p => p.id)
        if (partidoIds.length > 0) {
            const { data: evData } = await supabase
                .from('eventos_partido')
                .select('*, jugadores:jugadores_publicos!jugador_id(nombre, equipo_id, equipos(nombre))')
                .in('partido_id', partidoIds)
            eventos = evData || []
        }

        // Suscripción Realtime para actualizaciones automáticas
        const channel = supabase.channel('public_tournament_realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'partidos', filter: `torneo_id=eq.${torneo.id}` }, () => {
                console.log('Realtime: Cambio en partidos detectado. Recargando...');
                renderPublicTournament(container, params);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'eventos_partido' }, () => {
                console.log('Realtime: Cambio en eventos detectado. Recargando...');
                renderPublicTournament(container, params);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'equipos', filter: `torneo_id=eq.${torneo.id}` }, () => {
                console.log('Realtime: Cambio en equipos detectado. Recargando...');
                renderPublicTournament(container, params);
            })
            .subscribe()

        // Limpiar suscripción al cambiar de vista (si es posible en este router)
        window.currentTournamentChannel = channel;

    } catch (err) {
        console.error('Error cargando datos públicos del torneo', err)
        container.innerHTML = `<div class="p-8 text-center text-red-500">Error cargando datos del torneo.</div>`
        return
    }

    const eventosPorPartido = {}
    eventos.forEach(ev => {
        if (!eventosPorPartido[ev.partido_id]) eventosPorPartido[ev.partido_id] = []
        eventosPorPartido[ev.partido_id].push(ev)
    })

    const renderPublicMatchCard = (m) => {
        const showScore = m.estado === 'en_juego' || m.estado === 'finalizado'
        const hour = m.fecha_hora ? formatearFechaHora(m.fecha_hora).split(',')[1]?.trim() : '--:--'
        const evs = eventosPorPartido[m.id] || []
        const localEvents = evs.filter(e => e.jugadores?.equipo_id === m.equipo_local_id)
        const visitEvents = evs.filter(e => e.jugadores?.equipo_id === m.equipo_visitante_id)

        const renderIncidents = (list) => list.map(e => `
            <div class="flex items-center gap-1 text-[8px] font-black uppercase text-slate-400">
                <span>${e.tipo === 'gol' ? '⚽' : e.tipo === 'amarilla' ? '🟨' : '🟥'}</span>
                <span>${e.jugadores?.nombre?.split(' ')[0] || ''}</span>
            </div>
        `).join('')

        return `
        <div class="match-fifa-card animate-fade">
            <div class="m-fifa-header">
                <div class="m-fifa-badge ${m.estado === 'en_juego' ? 'live' : m.estado === 'finalizado' ? 'done' : ''}">
                    ${m.estado === 'en_juego' ? 'LIVE' : m.estado === 'finalizado' ? 'FINAL' : 'UPCOMING'}
                </div>
                <div class="m-fifa-time">${hour}</div>
            </div>

            <div class="m-fifa-main">
                <div class="m-fifa-team local">
                    <div class="m-fifa-shield-wrap">
                        ${renderEscudo(m.h?.escudo_url, m.h?.nombre, 50)}
                    </div>
                    <span>${m.h?.nombre || 'TBD'}</span>
                </div>

                <div class="m-fifa-score-box">
                    ${showScore 
                        ? `<span class="m-fifa-score-val">${m.goles_local ?? 0}</span><span class="m-fifa-score-sep">-</span><span class="m-fifa-score-val">${m.goles_visitante ?? 0}</span>`
                        : `<span class="m-fifa-vs">VS</span>`
                    }
                </div>

                <div class="m-fifa-team visit">
                    <div class="m-fifa-shield-wrap">
                        ${renderEscudo(m.a?.escudo_url, m.a?.nombre, 50)}
                    </div>
                    <span>${m.a?.nombre || 'TBD'}</span>
                </div>
            </div>

            ${evs.length > 0 && showScore ? `
            <div class="m-fifa-incidents">
                <div class="incidents-col">${renderIncidents(localEvents)}</div>
                <div class="incidents-col text-right items-end">${renderIncidents(visitEvents)}</div>
            </div>` : ''}

            <div class="m-fifa-footer">
                <div class="m-fifa-venue">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                    <span>${m.campo?.nombre || 'Sede por confirmar'}</span>
                </div>
            </div>
        </div>`
    }

    // UI RENDER con Estética EA SPORTS FC 25
    container.innerHTML = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        :root {
            --primary: ${torneo.color_primario || '#00d4ff'};
            --secondary: ${torneo.color_secundario || '#f0b429'};
            
            --bg-deep: #050a14;
            --bg-card: #0d1520;
            --bg-surface: #162032;
            --bg-hover: #1e2d42;

            --gold: #f0b429;
            --gold-light: #ffd166;
            --cyan: #00d4ff;
            --green-neon: #39ff14;
            --red-neon: #ff3860;
            --silver: #8892a4;
            --bronze: #cd7c3a;

            --text-primary: #ffffff;
            --text-secondary: #8892a4;
            --text-muted: #4a5568;

            --border-glow: rgba(0, 212, 255, 0.2);
            --border-gold: rgba(240, 180, 41, 0.3);
            --border-base: rgba(255, 255, 255, 0.08);
            
            --fifa-font: 'Outfit', sans-serif;
            --fifa-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }

        .ea-sports-app {
            background-color: var(--bg-deep);
            color: var(--text-primary);
            font-family: var(--fifa-font);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background-image: 
                radial-gradient(circle at 50% -20%, var(--primary) -200%, transparent 60%),
                url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0.1' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E");
            background-attachment: fixed;
        }

        /* HEADER EA SPORTS style */
        .ea-header {
            padding: 60px 24px 40px;
            text-align: center;
            position: relative;
        }
        .ea-logo-wrap {
            width: 120px;
            height: 120px;
            margin: 0 auto 24px;
            position: relative;
        }
        .ea-logo {
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 0 20px var(--border-glow));
            z-index: 10;
            position: relative;
        }
        .ea-logo-glow {
            position: absolute;
            inset: -20px;
            background: var(--primary);
            filter: blur(40px);
            opacity: 0.15;
            border-radius: 50%;
        }

        .ea-title {
            font-size: clamp(2.5rem, 8vw, 4rem);
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -0.04em;
            line-height: .9;
            margin-bottom: 12px;
            font-style: italic;
            background: linear-gradient(to bottom, #fff, #94a3b8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .ea-badge-status {
            display: inline-block;
            clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
            padding: 6px 24px;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            margin-bottom: 24px;
        }
        .ea-badge-status.en_juego { background: var(--cyan); color: #000; }
        .ea-badge-status.finalizado { background: var(--gold); color: #000; }
        .ea-badge-status.pendiente { background: var(--bg-surface); color: var(--text-secondary); }

        .ea-stats-row {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-top: 20px;
        }
        .ea-stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .ea-stat-val {
            font-size: 28px;
            font-weight: 900;
            color: var(--cyan);
            font-style: italic;
            line-height: 1;
        }
        .ea-stat-label {
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
            color: var(--text-muted);
            letter-spacing: 0.2em;
            margin-top: 4px;
        }

        .ea-divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--border-base), var(--primary), var(--border-base), transparent);
            margin: 40px auto 0;
            width: 90%;
            max-width: 800px;
            opacity: 0.5;
        }

        /* NAVIGATION SEAMLESS */
        .ea-nav {
            position: sticky;
            top: 0;
            z-index: 1000;
            padding: 20px 0;
        }
        .ea-segmented {
            background: rgba(13, 21, 32, 0.8);
            backdrop-filter: blur(20px);
            width: 90%;
            max-width: 500px;
            margin: 0 auto;
            border-radius: 20px;
            padding: 5px;
            display: flex;
            border: 1px solid var(--border-base);
            box-shadow: 0 15px 30px rgba(0,0,0,0.4);
        }
        .ea-nav-btn {
            flex: 1;
            border: none;
            background: none;
            color: var(--text-secondary);
            padding: 12px 0;
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 15px;
            cursor: pointer;
        }
        .ea-nav-btn.active {
            background: var(--primary);
            color: #000;
            box-shadow: 0 5px 15px rgba(0, 212, 255, 0.3);
            transform: translateY(-2px);
        }

        /* STANDINGS EA style */
        .ea-standings-container {
            padding: 20px 16px;
            max-width: 1000px;
            margin: 0 auto;
        }
        .ea-standings-row {
            display: grid;
            grid-template-columns: 40px 48px 1fr 40px 40px 50px;
            align-items: center;
            background: var(--bg-card);
            margin-bottom: 2px;
            padding: 12px 10px;
            transition: transform 0.2s;
            position: relative;
            border-left: 3px solid transparent;
        }
        .ea-standings-row:hover { background: var(--bg-hover); transform: translateX(5px); }
        .ea-standings-row.pos-1 { border-left-color: var(--gold); background: linear-gradient(90deg, rgba(240,180,41,0.05), transparent); }
        .ea-standings-row.pos-2 { border-left-color: var(--silver); }
        .ea-standings-row.pos-3 { border-left-color: var(--bronze); }
        
        .ea-st-pos { font-size: 18px; font-weight: 900; font-style: italic; color: #334155; opacity: 0.5; }
        .pos-1 .ea-st-pos { color: var(--gold); opacity: 1; }
        .ea-st-shield { width: 32px; height: 32px; object-fit: contain; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5)); }
        .ea-st-name { font-weight: 900; text-transform: uppercase; font-size: 13px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        .ea-st-val { text-align: center; color: var(--text-secondary); font-weight: 700; font-size: 12px; }
        .ea-st-pts { font-weight: 900; color: var(--cyan); font-size: 15px; font-style: italic; text-align: right; margin-right: 10px; }

        .ea-table-header {
            display: grid;
            grid-template-columns: 40px 48px 1fr 40px 40px 50px;
            padding: 15px 10px;
            font-size: 9px;
            font-weight: 900;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.2em;
        }

        /* MATCH FIFA CARDS */
        .match-fifa-card {
            background: linear-gradient(135deg, #162032 0%, #0d1520 100%);
            border: 1px solid var(--border-base);
            border-radius: 24px;
            margin: 0 16px 16px;
            padding: 24px;
            box-shadow: var(--fifa-shadow);
            position: relative;
            overflow: hidden;
        }
        .match-fifa-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at center, var(--primary) -200%, transparent 60%);
            opacity: 0.1;
            pointer-events: none;
        }

        .m-fifa-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        .m-fifa-badge {
            font-size: 9px;
            font-weight: 900;
            padding: 3px 12px;
            border-radius: 6px;
            background: var(--bg-surface);
            color: var(--text-secondary);
            border: 1px solid var(--border-base);
        }
        .m-fifa-badge.live { background: var(--red-neon); color: #fff; animation: blink 1.5s infinite; border: none; }
        .m-fifa-badge.done { background: var(--cyan); color: #000; border: none; }
        @keyframes blink { 50% { opacity: 0.6; } }

        .m-fifa-time { font-size: 20px; font-weight: 900; color: #fff; font-style: italic; }

        .m-fifa-main {
            display: grid;
            grid-template-columns: 1fr 100px 1fr;
            align-items: center;
            gap: 15px;
            text-align: center;
            position: relative;
            z-index: 10;
        }
        .m-fifa-team { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .m-fifa-shield-wrap {
            width: 70px;
            height: 70px;
            background: rgba(0,0,0,0.3);
            border-radius: 20px;
            padding: 10px;
            border: 1px solid var(--border-base);
            box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .m-fifa-shield-wrap img { width: 100%; height: 100%; object-fit: contain; }
        .m-fifa-team span { font-size: 13px; font-weight: 900; text-transform: uppercase; line-height: 1.1; max-width: 100px; }

        .m-fifa-score-box { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .m-fifa-score-val { font-size: 44px; font-weight: 900; font-style: italic; line-height: 1; }
        .m-fifa-score-sep { font-size: 24px; font-weight: 700; color: var(--text-muted); }
        .m-fifa-vs { font-size: 18px; font-weight: 900; color: var(--text-muted); padding: 8px 16px; background: rgba(255,255,255,0.03); border-radius: 12px; }

        .m-fifa-incidents {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px dashed var(--border-base);
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            position: relative;
            z-index: 10;
        }
        .incidents-col { display: flex; flex-direction: column; gap: 4px; }

        .m-fifa-footer {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            position: relative;
            z-index: 10;
        }
        .m-fifa-venue {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
            color: var(--text-muted);
            background: rgba(0,0,0,0.2);
            padding: 5px 15px;
            border-radius: 20px;
        }
        .m-fifa-venue svg { width: 12px; height: 12px; color: var(--cyan); }

        /* SECCIONES TITLES */
        .ea-section-header {
            margin: 40px 16px 24px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .ea-section-marker { width: 8px; height: 32px; background: var(--primary); border-radius: 4px; box-shadow: 0 0 15px var(--border-glow); }
        .ea-section-title { font-size: 24px; font-weight: 900; font-style: italic; text-transform: uppercase; letter-spacing: -0.02em; }

        /* FOOTER SAAS */
        .ea-footer {
            background: #03070e;
            padding: 80px 24px 60px;
            border-top: 1px solid var(--border-base);
            margin-top: 60px;
            text-align: center;
        }
        .ea-footer-cta {
            max-width: 600px;
            margin: 0 auto;
        }
        .ea-footer-title { font-size: 32px; font-weight: 900; font-style: italic; text-transform: uppercase; margin-bottom: 16px; }
        .ea-footer-desc { color: var(--text-secondary); margin-bottom: 40px; font-size: 14px; line-height: 1.6; }
        .ea-cta-btn {
            background: #fff;
            color: #000;
            padding: 20px 40px;
            border-radius: 20px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 14px;
            display: inline-block;
            transition: all 0.3s;
            box-shadow: 0 20px 40px rgba(255,255,255,0.1);
        }
        .ea-cta-btn:hover { transform: scale(1.05); background: var(--cyan); }

        .hidden { display: none; }
        .animate-fade { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* CARD JUGADOR / CLUB style */
        .ea-club-card {
            background: var(--bg-card);
            border: 1px solid var(--border-base);
            border-radius: 30px;
            padding: 30px;
            text-align: center;
            position: relative;
            transition: all 0.3s;
        }
        .ea-club-card:hover { transform: translateY(-5px); border-color: var(--cyan); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .ea-club-shield { width: 80px; height: 80px; margin: 0 auto 20px; object-fit: contain; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5)); }
        .ea-club-name { font-size: 14px; font-weight: 900; text-transform: uppercase; }
        
        .ea-btn-roster {
            margin-top: 20px;
            width: 100%;
            background: var(--bg-surface);
            border: 1px solid var(--border-base);
            color: var(--text-primary);
            padding: 12px;
            border-radius: 15px;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }

        /* STATS CARDS like FUT PLAYER */
        .stat-fut-card {
            background: var(--bg-card);
            border-radius: 20px;
            display: flex;
            align-items: center;
            padding: 15px;
            gap: 15px;
            border: 1px solid var(--border-base);
            margin-bottom: 12px;
        }
        .stat-rank { font-size: 32px; font-weight: 900; font-style: italic; color: #1e293b; line-height: 1; min-width: 40px; }
        .stat-rank.top-1 { color: var(--gold); }
        .stat-info { flex: 1; }
        .stat-pname { font-size: 14px; font-weight: 900; text-transform: uppercase; color: #fff; }
        .stat-pteam { font-size: 9px; font-weight: 900; text-transform: uppercase; color: var(--cyan); letter-spacing: 0.1em; }
        .stat-bubble {
            background: var(--bg-surface);
            padding: 10px 16px;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .stat-n { font-size: 24px; font-weight: 900; font-style: italic; color: #fff; line-height: 1; }
        .stat-l { font-size: 7px; font-weight: 900; text-transform: uppercase; color: var(--text-muted); }
    </style>

    <div class="ea-sports-app">
        <header class="ea-header">
            <div class="ea-logo-wrap">
                <div class="ea-logo-glow"></div>
                ${torneo.logo_url 
                    ? `<img src="${torneo.logo_url}" class="ea-logo" alt="${torneo.nombre}">`
                    : `<div class="ea-logo flex items-center justify-center bg-bg-surface rounded-full text-4xl font-black">${torneo.nombre.charAt(0)}</div>`
                }
            </div>
            <h1 class="ea-title">${torneo.nombre}</h1>
            <div class="ea-badge-status ${torneo.estado || 'pendiente'}">
                ${torneo.estado === 'en_juego' ? '● EN PROGRESO' : torneo.estado === 'finalizado' ? '✓ TORNEO FINALIZADO' : '○ PRÓXIMO INICIO'}
            </div>
            
            <div class="ea-stats-row">
                <div class="ea-stat-item">
                    <span class="ea-stat-val">${equipos.length}</span>
                    <span class="ea-stat-label">EQUIPOS</span>
                </div>
                <div class="ea-stat-item">
                    <span class="ea-stat-val">${partidos.length}</span>
                    <span class="ea-stat-label">PARTIDOS</span>
                </div>
                <div class="ea-stat-item">
                    <span class="ea-stat-val">${torneo.tipo === 'liga' ? 'PTS' : 'KO'}</span>
                    <span class="ea-stat-label">FORMATO</span>
                </div>
            </div>
            <div class="ea-divider"></div>
        </header>

        <nav class="ea-nav">
            <div class="ea-segmented">
                <button class="ea-nav-btn ${!state.activeTab || state.activeTab === 'posiciones' ? 'active' : ''}" data-tab="posiciones">Clasificación</button>
                <button class="ea-nav-btn ${state.activeTab === 'partidos' ? 'active' : ''}" data-tab="partidos">Partidos</button>
                <button class="ea-nav-btn ${state.activeTab === 'equipos' ? 'active' : ''}" data-tab="equipos">Clubes</button>
                <button class="ea-nav-btn ${state.activeTab === 'estadisticas' ? 'active' : ''}" data-tab="estadisticas">Líderes</button>
            </div>
        </nav>

        <main class="flex-1 pb-20">
            <!-- SECCIÓN POSICIONES -->
            <section id="section-posiciones" class="tab-content animate-fade px-4 ${state.activeTab && state.activeTab !== 'posiciones' ? 'hidden' : ''}">
                <div class="ea-standings-container">
                    ${renderPosicionesEA(grupos, tabla)}
                </div>
                
                ${renderKnockoutPhasesFIFA(partidos)}
                
                <div class="px-6 py-10">
                    <p class="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600 mb-6 text-center">Partrocinadores Oficiales</p>
                    <div class="flex flex-wrap justify-center gap-8 opacity-40 grayscale filter hover:grayscale-0 transition-all">
                        ${torneo.patrocinadores?.map(p => `
                            <img src="${p.logo_url}" class="h-6 object-contain" alt="${p.nombre}">
                        `).join('') || ''}
                    </div>
                </div>
            </section>

            <!-- SECCIÓN PARTIDOS -->
            <section id="section-partidos" class="tab-content animate-fade ${state.activeTab !== 'partidos' ? 'hidden' : ''}">
                ${renderPartidosProfessionalFIFA(partidos)}
            </section>

            <!-- SECCIÓN CLUBES -->
            <section id="section-equipos" class="tab-content px-4 max-w-lg mx-auto ${state.activeTab !== 'equipos' ? 'hidden' : ''}">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${equipos.map(e => `
                        <div class="ea-club-card animate-fade">
                            <div class="flex justify-center mb-4">
                                ${renderEscudo(e.escudo_url, e.nombre, 80)}
                            </div>
                            <h3 class="ea-club-name">${e.nombre}</h3>
                            <button class="ea-btn-roster btn-club-details" data-team-id="${e.id}">Ver Plantilla</button>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- SECCIÓN STATS -->
            <section id="section-estadisticas" class="tab-content px-4 max-w-lg mx-auto ${state.activeTab !== 'estadisticas' ? 'hidden' : ''}">
                ${renderStatsFIFA(eventos, jugadores)}
            </section>
        </main>

        <footer class="ea-footer">
            <div class="ea-footer-cta">
                <h2 class="ea-footer-title">Crea tu <span class="text-cyan">Propia Liga</span></h2>
                <p class="ea-footer-desc">Digitaliza tu campeonato con la tecnología deportiva de AppFutbol. Tablas automáticas, resultados en vivo y una experiencia profesional.</p>
                <a href="#" onclick="window.navigate('auth')" class="ea-cta-btn">COMENZAR GRATIS ➔</a>
                <div class="mt-16 text-[9px] font-black tracking-widest text-slate-700 uppercase">
                    POWERED BY ANTIGRAVITY SPORTS ENGINE • © ${new Date().getFullYear()}
                </div>
            </div>
        </footer>
    </div>

    <!-- MODAL FIFA STYLE -->
    <div id="roster-f-modal" class="hidden fixed inset-0 z-[2000] flex items-center justify-center p-4 backdrop-blur-2xl transition-all">
        <div class="w-full max-w-md bg-[#0d1520]/95 border border-white/10 p-8 rounded-[40px] shadow-2xl relative overflow-hidden transform scale-90 opacity-0 transition-all duration-300" id="roster-f-container">
            <div class="absolute -top-20 -right-20 w-60 h-60 bg-cyan/10 blur-[80px] rounded-full"></div>
            <div class="flex justify-between items-center mb-10 relative z-10">
                <span class="text-[10px] font-black uppercase tracking-widest text-cyan">Squad Profile</span>
                <button id="close-f-modal" class="w-10 h-10 flex items-center justify-center bg-white/5 rounded-2xl text-white text-3xl font-light">&times;</button>
            </div>
            <div id="modal-f-content" class="relative z-10"></div>
        </div>
    </div>
    `

    const rosterModal = document.getElementById('roster-f-modal')
    const rosterContainer = document.getElementById('roster-f-container')
    const modalContent = document.getElementById('modal-f-content')

    function renderPosicionesEA(grupos, tabla) {
        const header = `
            <div class="ea-table-header">
                <span>POS</span><span></span><span>CLUB</span><span>PJ</span><span>DG</span><span class="text-right">PTS</span>
            </div>
        `
        const renderRow = (r, i) => `
            <div class="ea-standings-row pos-${i+1}">
                <span class="ea-st-pos">${(i+1)}</span>
                ${renderEscudo(r.escudo_url, r.equipo_nombre, 32)}
                <span class="ea-st-name">${r.equipo_nombre || 'Equipo'}</span>
                <span class="ea-st-val">${r.pj ?? 0}</span>
                <span class="ea-st-val">${r.dg ?? 0}</span>
                <span class="ea-st-pts">${r.pts ?? 0}</span>
            </div>
        `

        if (!grupos || grupos.length === 0) {
            return header + tabla.sort((a,b) => b.pts - a.pts || b.dg - a.dg).map((r, i) => renderRow(r, i)).join('')
        }

        return grupos.map(g => {
            const tableGrp = tabla.filter(t => t.grupo_id === g.id).sort((a,b) => b.pts - a.pts || b.dg - a.dg)
            return `
                <div class="ea-section-header">
                    <div class="ea-section-marker"></div>
                    <h2 class="ea-section-title">${g.nombre}</h2>
                </div>
                ${header}
                ${tableGrp.map((r, i) => renderRow(r, i)).join('')}
            `
        }).join('')
    }

    function renderKnockoutPhasesFIFA(partidos) {
        const koPhases = ['final', 'semifinal', 'semifinales', 'cuartos', 'octavos']
        const matches = (partidos || []).filter(p => p.fase && koPhases.includes(p.fase.toLowerCase()))
        if (matches.length === 0) return ''

        const grouped = {}
        matches.forEach(p => {
            let f = p.fase.toUpperCase()
            if (!grouped[f]) grouped[f] = []
            grouped[f].push(p)
        })

        const order = ['OCTAVOS DE FINAL', 'OCTAVOS', 'CUARTOS DE FINAL', 'CUARTOS', 'SEMIFINALES', 'SEMIFINAL', 'GRAN FINAL', 'FINAL']
        const sortedFases = Object.keys(grouped).sort((a,b) => order.indexOf(a) - order.indexOf(b))

        return sortedFases.map(fase => `
            <div class="ea-section-header mt-12">
                <div class="ea-section-marker" style="background:var(--secondary);box-shadow:0 0 15px var(--border-gold)"></div>
                <h2 class="ea-section-title">${fase}</h2>
            </div>
            <div class="space-y-4">
                ${grouped[fase].map(m => renderPublicMatchCard(m)).join('')}
            </div>
        `).join('')
    }

    function renderPartidosProfessionalFIFA(partidos) {
        if (!partidos || partidos.length === 0) {
            return `<div class="py-20 text-center opacity-20 font-black italic uppercase tracking-widest">No hay partidos registrados</div>`
        }

        const porFecha = {}
        partidos.forEach(m => {
            const key = m.fecha_hora 
                ? new Date(m.fecha_hora).toISOString().slice(0, 10) 
                : 'sin-fecha'
            if (!porFecha[key]) porFecha[key] = []
            porFecha[key].push(m)
        })

        const fechasSorted = Object.keys(porFecha).filter(k => k !== 'sin-fecha').sort().reverse()
        let html = ''

        fechasSorted.forEach(key => {
            const d = new Date(key + 'T12:00:00')
            html += `
                <div class="ea-section-header mt-12">
                    <div class="ea-section-marker"></div>
                    <h2 class="ea-section-title">${d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' }).toUpperCase()}</h2>
                </div>
                ${porFecha[key].map(m => renderPublicMatchCard(m)).join('')}
            `
        })

        if (porFecha['sin-fecha']) {
            html += `
                <div class="ea-section-header mt-12 opacity-40">
                    <div class="ea-section-marker"></div>
                    <h2 class="ea-section-title">POR DEFINIR</h2>
                </div>
                ${porFecha['sin-fecha'].map(m => renderPublicMatchCard(m)).join('')}
            `
        }

        return html
    }

    function renderStatsFIFA(eventos, jugadores) {
        const stats = { scorers: {}, yellows: {}, reds: {} }
        eventos.forEach(e => {
            const j = e.jugadores
            if (!j) return
            const name = j.nombre || 'Desconocido', team = j.equipos?.nombre || '-'
            if (e.tipo === 'gol') {
                if (!stats.scorers[e.jugador_id]) stats.scorers[e.jugador_id] = { name, team, n: 0 }
                stats.scorers[e.jugador_id].n++
            } else if (e.tipo === 'amarilla') {
                if (!stats.yellows[e.jugador_id]) stats.yellows[e.jugador_id] = { name, team, n: 0 }
                stats.yellows[e.jugador_id].n++
            } else if (e.tipo === 'roja') {
                if (!stats.reds[e.jugador_id]) stats.reds[e.jugador_id] = { name, team, n: 0 }
                stats.reds[e.jugador_id].n++
            }
        })

        const renderTop = (obj, label, icon) => {
            const list = Object.values(obj).sort((a,b) => b.n - a.n).slice(0, 5)
            if (list.length === 0) return ''
            return `
                <div class="ea-section-header mt-8">
                    <div class="ea-section-marker"></div>
                    <h2 class="ea-section-title">${label}</h2>
                </div>
                <div class="space-y-3">
                    ${list.map((s, i) => `
                        <div class="stat-fut-card animate-fade">
                            <span class="stat-rank ${i===0?'top-1':''}">${i+1}</span>
                            <div class="stat-info">
                                <p class="stat-pname">${s.name}</p>
                                <p class="stat-pteam">${s.team}</p>
                            </div>
                            <div class="stat-bubble">
                                <span class="stat-n">${s.n}</span>
                                <span class="stat-l">${icon}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `
        }

        return renderTop(stats.scorers, 'Goleadores', 'GOL') + 
               renderTop(stats.yellows, 'Tarjetas Amarillas', 'TA') + 
               renderTop(stats.reds, 'Tarjetas Rojas', 'TR')
    }

    const setupEvents = () => {
        container.querySelectorAll('.ea-nav-btn').forEach(btn => {
            btn.onclick = () => {
                state.activeTab = btn.dataset.tab // Guardar pestaña actual en el state global de la app
                container.querySelectorAll('.ea-nav-btn').forEach(b => b.classList.remove('active'))
                btn.classList.add('active')
                container.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'))
                const targetSection = document.getElementById(`section-${btn.dataset.tab}`)
                if (targetSection) targetSection.classList.remove('hidden')
                window.scrollTo({ top: 400, behavior: 'smooth' })
            }
        })

        const closeRoster = () => {
            rosterContainer.classList.add('scale-90', 'opacity-0')
            setTimeout(() => rosterModal.classList.add('hidden'), 300)
        }

        container.querySelectorAll('.btn-club-details').forEach(btn => {
            btn.onclick = async () => {
                const teamId = btn.dataset.teamId
                const team = equipos.find(e => e.id === teamId)
                if (!team) return

                rosterModal.classList.remove('hidden')
                setTimeout(() => rosterContainer.classList.remove('scale-90', 'opacity-0'), 10)

                modalContent.innerHTML = `
                    <div class="text-center mb-8">
                        <div class="flex justify-center mb-4">
                            ${renderEscudo(team.escudo_url, team.nombre, 96)}
                        </div>
                        <h2 class="text-3xl font-black uppercase italic tracking-tighter text-white">${team.nombre}</h2>
                    </div>
                    <div id="p-l-modal" class="space-y-3 max-h-[50vh] overflow-y-auto custom-scroll">
                        <div class="py-10 text-center"><div class="animate-spin rounded-full h-8 w-8 border-t-2 border-cyan mx-auto"></div></div>
                    </div>
                `

                try {
                    const { data: players } = await supabase.from('jugadores_publicos')
                        .select('*').eq('equipo_id', teamId).order('dorsal', { ascending: true })

                    const listEl = document.getElementById('p-l-modal')
                    if (!listEl) return
                    if (!players || players.length === 0) {
                        listEl.innerHTML = `<p class="py-10 text-[10px] font-bold text-slate-600 uppercase text-center">No hay registros</p>`
                        return
                    }

                    listEl.innerHTML = players.map(p => `
                        <div class="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
                            <div class="flex items-center gap-4">
                                ${renderFotoJugador(p.foto_url, p.nombre, 44)}
                                <div class="text-left">
                                    <p class="font-black uppercase text-xs text-white">${p.nombre}</p>
                                    <p class="text-[8px] text-cyan font-black uppercase">${p.posicion || 'Jugador'}</p>
                                </div>
                            </div>
                            <div class="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-black text-xs text-slate-500">
                                # ${p.dorsal || '--'}
                            </div>
                        </div>
                    `).join('')
                } catch (err) { console.error(err) }
            }
        })

        document.getElementById('close-f-modal').onclick = closeRoster
        rosterModal.onclick = (e) => { if (e.target === rosterModal) closeRoster() }
    }

    setupEvents()
}
