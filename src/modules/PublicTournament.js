import { supabase } from '../services/supabase.js'

export const renderPublicTournament = async (container, { slug }) => {
    
    // 1. CARGA DE DATOS (Con Query Corregida)
    const fetchAllData = async () => {
        const { data: torneo, error: tErr } = await supabase.from('torneos').select('*').eq('slug', slug).single()
        if (tErr || !torneo) return null

        const { data: partidosData, error: pErr } = await supabase
            .from('partidos')
            .select(`
                *,
                h:equipos!equipo_local_id(nombre, escudo_url),
                a:equipos!equipo_visitante_id(nombre, escudo_url),
                campo:campos!campo_id(nombre, sede:sedes(nombre)),
                arbitro:arbitros!arbitro_id(nombre)
            `)
            .eq('torneo_id', torneo.id)
            .order('fecha_hora', { ascending: true, nullsLast: true })

        if (pErr) console.error('Error cargando partidos:', pErr)

        const [grupos, equipos, tabla, jugadores, eventos] = await Promise.all([
            supabase.from('grupos').select('*').eq('torneo_id', torneo.id).order('nombre'),
            supabase.from('equipos').select('*').eq('torneo_id', torneo.id).is('deleted_at', null),
            supabase.from('tabla_posiciones').select('*, equipos!equipo_id(nombre, escudo_url)').eq('torneo_id', torneo.id),
            supabase.from('jugadores').select('*, equipos!equipo_id(nombre)').eq('torneo_id', torneo.id),
            supabase.from('eventos_partido').select('*').in('partido_id', (partidosData || []).map(p => p.id))
        ])

        return {
            torneo,
            grupos: grupos.data || [],
            equipos: equipos.data || [],
            tabla: tabla.data || [],
            partidos: partidosData || [],
            jugadores: jugadores.data || [],
            eventos: eventos.data || []
        }
    }

    const data = await fetchAllData()
    if (!data) {
        container.innerHTML = `
            <div class="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                <div class="text-center">
                    <h1 class="text-9xl font-black opacity-10">404</h1>
                    <p class="text-xl font-bold uppercase tracking-widest mt-4">Torneo no encontrado</p>
                    <a href="/" class="inline-block mt-8 text-indigo-400 hover:text-indigo-300 font-black">REGRESAR AL INICIO</a>
                </div>
            </div>
        `
        return
    }

    const { torneo, grupos, equipos, tabla, partidos, jugadores, eventos } = data

    // UI RENDER
    container.innerHTML = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        :root {
            --primary: ${torneo.color_primario || '#00ff87'};
            --secondary: ${torneo.color_secundario || '#00d4ff'};
            --dark-bg: #03050a;
            --glass: rgba(255, 255, 255, 0.05);
            --border: rgba(255, 255, 255, 0.1);
        }

        .tournament-app {
            background-color: var(--dark-bg);
            color: #fff;
            font-family: 'Outfit', sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
            background-image: radial-gradient(circle at 50% 0%, var(--primary) -200%, transparent 50%);
        }

        .header-box { padding: 40px 20px 20px; text-align: center; }
        .main-logo { width: 70px; height: 70px; margin: 0 auto 15px; border-radius: 20px; border: 1px solid var(--primary); padding: 10px; background: var(--glass); }

        /* Segmented Control - Pro Mobile Nav */
        .sticky-nav { position: sticky; top: 0; z-index: 100; background: rgba(3, 5, 10, 0.85); backdrop-filter: blur(15px); padding: 12px 16px; border-bottom: 1px solid var(--border); }
        .segmented-control { background: rgba(255, 255, 255, 0.05); display: flex; padding: 4px; border-radius: 14px; gap: 4px; }
        .segment-btn { flex: 1; border: none; background: none; color: #94a3b8; padding: 10px 0; border-radius: 10px; font-weight: 700; font-size: 0.7rem; text-transform: uppercase; transition: 0.2s; white-space: nowrap; }
        .segment-btn.active { background: white; color: black; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

        /* Anti-Clipping Standings */
        .standings-wrap { padding: 10px 16px; }
        .table-row { display: grid; grid-template-columns: 25px 28px 1fr 32px 32px 38px; align-items: center; gap: 8px; padding: 14px 0; border-bottom: 1px solid var(--border); }
        .table-header { color: #64748b; font-size: 9px; font-weight: 900; text-transform: uppercase; }
        .st-pos { font-style: italic; font-weight: 900; font-size: 13px; color: #4b5563; }
        .st-logo { width: 24px; height: 24px; object-fit: contain; /* COLOR ORIGINAL */ filter: none; }
        .st-name { font-weight: 700; font-size: 11px; text-transform: uppercase; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .st-val { text-align: center; font-weight: 800; font-size: 11px; }
        .st-pts { color: var(--primary); background: rgba(0,255,135,0.1); border-radius: 6px; padding: 2px 0; font-weight: 900; }

        /* Match Cards Hub */
        .match-card { background: var(--glass); border: 1px solid var(--border); border-radius: 24px; margin: 0 16px 12px; padding: 20px; position: relative; overflow: hidden; }
        .match-card.final { border: 1px solid var(--primary); background: linear-gradient(135deg, rgba(0,255,135,0.05), transparent); }
        .match-card.final::before { content: 'FINAL'; position: absolute; top: 10px; right: 10px; font-size: 8px; font-weight: 900; color: var(--primary); border: 1px solid var(--primary); padding: 2px 8px; border-radius: 4px; }
        
        .m-meta { font-size: 10px; font-weight: 700; color: #64748b; margin-bottom: 15px; text-transform: uppercase; }
        .m-grid { display: grid; grid-template-columns: 1fr 65px 1fr; align-items: center; gap: 10px; text-align: center; }
        .m-team img { width: 50px; height: 50px; object-fit: contain; margin-bottom: 8px; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.4)); }
        .m-team span { font-size: 11px; font-weight: 900; text-transform: uppercase; line-height: 1.1; }
        .m-score { background: rgba(0,0,0,0.3); border-radius: 12px; padding: 12px 0; font-weight: 900; font-size: 22px; font-style: italic; border: 1px solid var(--border); }

        .team-card { background: var(--glass); padding: 20px; border-radius: 20px; border: 1px solid var(--border); text-align: center; }
        .hidden { display: none; }
        
        .tab-content.animate-fade {
            animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>

    <div class="tournament-app">
        <header class="header-box">
            <img src="${torneo.logo_url || 'https://via.placeholder.com/150'}" class="main-logo">
            <h1 class="text-3xl font-black italic uppercase tracking-tighter">${torneo.nombre}</h1>
        </header>

        <nav class="sticky-nav">
            <div class="segmented-control">
                <button class="segment-btn active" data-tab="posiciones">Posiciones</button>
                <button class="segment-btn" data-tab="partidos">Partidos</button>
                <button class="segment-btn" data-tab="equipos">Clubes</button>
                <button class="segment-btn" data-tab="estadisticas">Stats</button>
            </div>
        </nav>

        <main class="py-6 min-h-screen">
            <section id="section-posiciones" class="tab-content animate-fade">
                <div class="standings-wrap">
                    <div class="table-row table-header">
                        <span>#</span><span></span><span>Equipo</span><span>PJ</span><span>DG</span><span class="text-center">Pts</span>
                    </div>
                    ${renderPosicionesElite(grupos, tabla)}
                </div>
            </section>

            <section id="section-partidos" class="tab-content hidden animate-fade">
                ${renderMatchesElite(partidos)}
            </section>

            <section id="section-equipos" class="tab-content hidden px-4">
                <div class="grid grid-cols-2 gap-4">
                    ${equipos.map(e => `
                        <div class="team-card animate-fade" data-team-id="${e.id}">
                            <img src="${e.escudo_url || 'https://ui-avatars.com/api/?name='+e.nombre}" class="w-16 h-16 mx-auto mb-4 object-contain">
                            <p class="font-black text-[10px] uppercase truncate">${e.nombre}</p>
                        </div>
                    `).join('')}
                </div>
            </section>

            <section id="section-estadisticas" class="tab-content hidden px-4">
                ${renderStatsElite(eventos, jugadores)}
            </section>
        </main>
        
        <footer class="p-10 text-center opacity-30">
            <p class="text-[10px] font-black uppercase tracking-widest">Liga Pro SaaS • 2026</p>
        </footer>
    </div>

    <!-- MODAL ROSTER -->
    <div id="roster-modal" class="hidden fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-6 backdrop-blur-2xl">
        <div class="w-full max-w-sm">
            <button id="close-modal" class="text-white text-5xl font-light mb-8 float-right">&times;</button>
            <div id="modal-content" class="mt-20"></div>
        </div>
    </div>
    `

    function renderPosicionesElite(grupos, tabla) {
        const renderRow = (r, i) => `
            <div class="table-row">
                <span class="st-pos">${i+1}</span>
                <img src="${r.equipos?.escudo_url || 'https://ui-avatars.com/api/?name='+r.equipos?.nombre}" class="st-logo">
                <span class="st-name">${r.equipos?.nombre}</span>
                <span class="st-val text-slate-400">${r.pj}</span>
                <span class="st-val text-slate-400">${r.dg}</span>
                <span class="st-val st-pts">${r.pts}</span>
            </div>
        `

        if (grupos.length === 0) {
            return tabla.sort((a,b) => b.pts - a.pts || b.dg - a.dg).map((r, i) => renderRow(r, i)).join('')
        }
        return grupos.map(g => {
            const tableGrp = tabla.filter(t => t.grupo_id === g.id).sort((a,b) => b.pts - a.pts || b.dg - a.dg)
            return `
                <div class="mt-8 mb-4 px-1 text-[10px] font-black text-indigo-400 italic uppercase">⚡ ${g.nombre}</div>
                ${tableGrp.map((r, i) => renderRow(r, i)).join('')}
            `
        }).join('')
    }

    function renderMatchesElite(partidos) {
        if (partidos.length === 0) return `<p class="text-center opacity-20 py-20 font-black italic uppercase tracking-widest">Sin partidos programados</p>`
        return partidos.map(m => {
            const date = m.fecha_hora ? new Date(m.fecha_hora).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : 'FECHA TBD'
            const hour = m.fecha_hora ? new Date(m.fecha_hora).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'
            const isFinal = m.fase?.toLowerCase() === 'final'
            
            return `
            <div class="match-card ${isFinal ? 'final' : ''} animate-fade">
                <div class="m-meta">${date} • ${hour} • ${m.fase}</div>
                <div class="m-grid">
                    <div class="m-team">
                        <img src="${m.h?.escudo_url || 'https://ui-avatars.com/api/?name='+m.h?.nombre}" class="object-contain">
                        <span>${m.h?.nombre || 'TBD'}</span>
                    </div>
                    <div class="m-score">
                        ${m.estado === 'pendiente' ? 'VS' : `${m.goles_local} - ${m.goles_visitante}`}
                    </div>
                    <div class="m-team">
                        <img src="${m.a?.escudo_url || 'https://ui-avatars.com/api/?name='+m.a?.nombre}" class="object-contain">
                        <span>${m.a?.nombre || 'TBD'}</span>
                    </div>
                </div>
                <div class="mt-5 pt-4 border-t border-white/5 flex justify-between text-[8px] font-black text-slate-600 uppercase">
                    <span>📍 ${m.campo?.nombre || 'Campo por confirmar'}</span>
                    <span>${m.arbitro?.nombre || ''}</span>
                </div>
            </div>
            `
        }).join('')
    }

    function renderStatsElite(eventos, jugadores) {
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
            <div class="space-y-4 animate-fade">
                <h4 class="text-xs font-black uppercase italic text-indigo-400 mb-6">Máximos Goleadores</h4>
                ${list.map((s, i) => `
                    <div class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div class="flex items-center gap-4">
                            <span class="text-xl font-black italic text-slate-700">#${i+1}</span>
                            <div>
                                <p class="text-xs font-black uppercase">${s.p.nombre}</p>
                                <p class="text-[8px] text-slate-500 font-bold uppercase">${s.p.equipos?.nombre}</p>
                            </div>
                        </div>
                        <div class="text-2xl font-black italic" style="color: var(--primary)">${s.goals}</div>
                    </div>
                `).join('') || '<p class="opacity-20 text-xs text-center py-10 uppercase font-black italic">Sin registros de goles</p>'}
            </div>
        `
    }

    const setupEvents = () => {
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
                window.scrollTo({ top: 350, behavior: 'smooth' })
            }
        })

        container.querySelectorAll('.team-card').forEach(card => {
            card.onclick = () => {
                const teamId = card.dataset.teamId
                const team = equipos.find(e => e.id === teamId)
                const teamPlayers = jugadores.filter(j => j.equipo_id === teamId)
                
                const modal = document.getElementById('roster-modal')
                const content = document.getElementById('modal-content')
                content.innerHTML = `
                    <div class="text-center animate-fade">
                        <img src="${team.escudo_url || 'https://ui-avatars.com/api/?name='+team.nombre}" class="w-32 h-32 mx-auto mb-6 object-contain">
                        <h2 class="text-3xl font-black uppercase italic italic tracking-tighter mb-8">${team.nombre}</h2>
                        <div class="space-y-2 max-h-[50vh] overflow-y-auto no-scrollbar">
                            ${teamPlayers.map(p => `
                                <div class="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span class="font-black uppercase text-xs">${p.nombre}</span>
                                    <span class="text-[10px] font-black text-indigo-400">#${p.dorsal || 'P'}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `
                modal.classList.remove('hidden')
            }
        })

        document.getElementById('close-modal').onclick = () => {
            const modal = document.getElementById('roster-modal')
            modal.classList.add('hidden')
        }
        
        // Cerrar modal al hacer clic fuera del contenido
        document.getElementById('roster-modal').onclick = (e) => {
            if (e.target.id === 'roster-modal') {
                document.getElementById('roster-modal').classList.add('hidden')
            }
        }
    }

    setupEvents()
}
