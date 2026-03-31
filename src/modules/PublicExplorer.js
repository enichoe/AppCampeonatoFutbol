import { supabase } from '../services/supabase.js'

export const renderPublicExplorer = async (container) => {
    container.innerHTML = `
    <style>
        .explorer-bg {
            background-color: #03050a;
            min-height: 100vh;
            color: white;
            padding-bottom: 80px;
        }
        .hero-mini {
            padding: 80px 20px 40px;
            text-align: center;
            background: radial-gradient(circle at 50% 0%, rgba(79, 70, 229, 0.15) 0%, transparent 70%);
        }
        .search-container {
            max-width: 600px;
            margin: -30px auto 40px;
            position: relative;
            z-index: 10;
            padding: 0 20px;
        }
        .search-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 20px 30px;
            color: white;
            font-size: 14px;
            backdrop-filter: blur(20px);
            transition: all 0.3s;
        }
        .search-input:focus {
            outline: none;
            background: rgba(255, 255, 255, 0.05);
            border-color: #4f46e5;
            box-shadow: 0 0 30px rgba(79, 70, 229, 0.2);
        }
        .tournament-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
            padding: 0 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .t-card {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 32px;
            padding: 24px;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        .t-card:hover {
            transform: translateY(-10px);
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(79, 70, 229, 0.3);
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .t-badge {
            display: inline-flex;
            padding: 4px 12px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            background: rgba(79, 70, 229, 0.1);
            color: #818cf8;
        }
        .t-logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
            border-radius: 20px;
            background: #000;
            padding: 10px;
            border: 1px solid rgba(255,255,255,0.05);
        }
        .btn-explorer {
            width: 100%;
            padding: 16px;
            border-radius: 16px;
            background: white;
            color: black;
            font-weight: 900;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: all 0.3s;
            text-align: center;
        }
        .btn-explorer:hover {
            background: #4f46e5;
            color: white;
            transform: scale(1.02);
        }
    </style>

    <div class="explorer-bg">
        <header class="hero-mini">
            <button onclick="window.navigate('landing')" class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 flex items-center justify-center gap-2 mx-auto hover:text-white transition-colors">
                 <span>← Volver Inicio</span>
            </button>
            <h1 class="text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-4">Explorar <span class="text-indigo-500">Torneos</span></h1>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Encuentra ligas, clubes y resultados en tiempo real</p>
        </header>

        <div class="search-container">
            <input type="text" id="tournamentSearch" class="search-input" placeholder="Buscar por nombre, ciudad o estado...">
        </div>

        <div id="explorerGrid" class="tournament-grid">
            <!-- Skeleton Loading -->
            ${Array(6).fill(0).map(() => `
                <div class="t-card animate-pulse">
                    <div class="w-20 h-20 bg-white/5 rounded-2xl mx-auto"></div>
                    <div class="h-6 bg-white/5 rounded-lg w-3/4 mx-auto mt-4"></div>
                    <div class="h-4 bg-white/5 rounded-lg w-1/2 mx-auto"></div>
                </div>
            `).join('')}
        </div>

        <div id="emptyState" class="hidden text-center py-40">
            <div class="text-6xl mb-6">🏆</div>
            <h2 class="text-2xl font-black italic uppercase tracking-tighter mb-4">No hay torneos disponibles aún</h2>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-10">¡Sé el primero en profesionalizar tu liga hoy mismo!</p>
            <button onclick="window.navigate('register')" class="px-10 py-5 bg-indigo-600 rounded-2xl text-xs font-black uppercase italic hover:bg-white hover:text-black transition-all">Crear Torneo Gratis</button>
        </div>
    </div>
    `

    const grid = document.getElementById('explorerGrid')
    const emptyState = document.getElementById('emptyState')
    const search = document.getElementById('tournamentSearch')

    let allTournaments = []

    const loadTournaments = async (query = '') => {
        try {
            let baseQuery = supabase
                .from('torneos')
                .select('*')
                .eq('is_public', true)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })

            if (query) {
                // Filtro simple por nombre o lugar
                baseQuery = baseQuery.or(`nombre.ilike.%${query}%,lugar.ilike.%${query}%`)
            }

            const { data, error } = await baseQuery

            if (error) throw error
            allTournaments = data

            if (data.length === 0) {
                grid.classList.add('hidden')
                emptyState.classList.remove('hidden')
                return
            }

            grid.classList.remove('hidden')
            emptyState.classList.add('hidden')

            grid.innerHTML = data.map(t => `
                <div class="t-card animate-fade">
                    <div class="flex items-center gap-5">
                        <img src="${t.logo_url || 'https://via.placeholder.com/150'}" class="t-logo" loading="lazy">
                        <div>
                            <span class="t-badge mb-2">${t.estado || 'Activo'}</span>
                            <h3 class="font-black text-xl italic uppercase tracking-tighter line-clamp-1">${t.nombre}</h3>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                        <div>
                            <span class="text-[9px] font-black text-slate-600 uppercase block mb-1">📍 Lugar</span>
                            <span class="text-xs font-bold text-white uppercase truncate block">${t.lugar || 'Por definir'}</span>
                        </div>
                        <div>
                            <span class="text-[9px] font-black text-slate-600 uppercase block mb-1">📅 Inicio</span>
                            <span class="text-xs font-bold text-white uppercase block">${new Date(t.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    <div class="flex items-center justify-between text-slate-500">
                        <div class="flex items-center gap-1.5 grayscale opacity-50">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
                            <span class="text-[10px] font-black uppercase tracking-widest">Publicidad Off</span>
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-widest text-indigo-400">Ver Detalles ➔</span>
                    </div>

                    <button class="btn-explorer" onclick="window.navigate('public_torneo', { slug: '${t.slug}' })">
                         Entrar al Torneo
                    </button>
                </div>
            `).join('')

        } catch (err) {
            console.error(err)
            grid.innerHTML = '<p class="text-red-500 text-center py-20">Error al conectar con el servidor.</p>'
        }
    }

    search.oninput = (e) => {
        const val = e.target.value
        loadTournaments(val)
    }

    loadTournaments()
}
