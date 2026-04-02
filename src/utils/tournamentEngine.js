import { supabase } from '../services/supabase.js'

// 1. GENERADOR DE SLUGS SEO-FRIENDLY
export const slugify = (text) => {
    return text.toString().toLowerCase().trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
        .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales
        .replace(/[\s_-]+/g, '-') // Espacios y guiones bajos a guiones
        .replace(/^-+|-+$/g, ''); // Limpiar extremos
}

export const generateSlug = async (nombre) => {
    const baseSlug = slugify(nombre);
    let finalSlug = baseSlug;
    let counter = 1;
    let exists = true;

    while (exists) {
        const { data } = await supabase
            .from('torneos')
            .select('slug')
            .eq('slug', finalSlug)
            .maybeSingle();
        
        if (!data) {
            exists = false;
        } else {
            counter++;
            finalSlug = `${baseSlug}-${counter}`;
        }
    }
    return finalSlug;
}

// 2. SORTEO Y DISTRIBUCIÓN
export async function sortearYDistribuir(torneoId) {
    console.log("🎲 Iniciando sorteo para torneo:", torneoId);
    
    const { data: torneo, error: tErr } = await supabase.from('torneos').select('*').eq('id', torneoId).single();
    if(tErr) throw tErr;

    const { data: equipos, error: eErr } = await supabase.from('equipos').select('*').eq('torneo_id', torneoId).is('deleted_at', null);
    if(eErr || !equipos || equipos.length === 0) throw new Error("No hay equipos para sortear");

    // Calcular cantidad de grupos basándose en la regla de 4 equipos por grupo
    let cantidadGrupos = 1;
    if (torneo.tipo === 'grupos_eliminatoria') {
        cantidadGrupos = Math.floor(equipos.length / 4);
        if (cantidadGrupos === 0) cantidadGrupos = 1; // Mínimo 1 grupo si hay menos de 4
    } else if (torneo.tipo === 'liga') {
        cantidadGrupos = 1;
    }

    // Sorteo Fisher-Yates
    const shuffled = [...equipos].sort(() => Math.random() - 0.5);

    // Limpiar grupos previos (la tabla_posiciones se elimina automáticamente como view dependiente)
    await supabase.from('grupos').delete().eq('torneo_id', torneoId);

    const { data: { user } } = await supabase.auth.getUser();

    for (let i = 0; i < cantidadGrupos; i++) {
        const { data: grupo, error: gErr } = await supabase.from('grupos').insert([{
            torneo_id: torneoId,
            nombre: `Grupo ${String.fromCharCode(65 + i)}`,
            user_id: user.id
        }]).select().single();

        if(gErr) throw gErr;

        // Distribución según tipo
        let teamsForGroup = [];
        if (torneo.tipo === 'grupos_eliminatoria') {
            teamsForGroup = shuffled.slice(i * 4, (i + 1) * 4);
        } else {
            // Para liga, todos al mismo grupo
            teamsForGroup = shuffled;
        }

        for (const team of teamsForGroup) {
            await supabase.from('equipos').update({ grupo_id: grupo.id }).eq('id', team.id);
        }
    }
    
    // Actualizar configuración del torneo con el número de grupos real y cambiar estado
    await supabase.from('torneos').update({ 
        estado: 'sorteo',
        configuracion: { ...torneo.configuracion, num_grupos: cantidadGrupos } 
    }).eq('id', torneoId);

    console.log("✅ Sorteo finalizado exitosamente");
}

// 3. GENERADOR DE FIXTURE
export async function generarFixture(torneoId) {
    console.log("⚽ Generando fixture...");
    const { data: torneo } = await supabase.from('torneos').select('*').eq('id', torneoId).single();
    const { data: grupos } = await supabase.from('grupos').select('id').eq('torneo_id', torneoId);
    const { data: { user } } = await supabase.auth.getUser();

    // Limpiar partidos previos de fase grupos
    await supabase.from('partidos').delete().eq('torneo_id', torneoId).eq('fase', 'grupos');

    for (const grupo of grupos) {
        const { data: t } = await supabase.from('equipos').select('id').eq('grupo_id', grupo.id);
        if(!t || t.length < 2) continue;

        const matches = [];
        
        // Algoritmo circular simple
        for (let i = 0; i < t.length; i++) {
            for (let j = i + 1; j < t.length; j++) {
                matches.push({
                    user_id: user.id,
                    torneo_id: torneoId,
                    grupo_id: grupo.id,
                    equipo_local_id: t[i].id,
                    equipo_visitante_id: t[j].id,
                    estado: 'pendiente',
                    fase: 'grupos',
                    jornada: i + j // Jornada aproximada
                });
            }
        }
        
        if(torneo.configuracion.ida_vuelta) {
            const vuelta = matches.map(m => ({ 
                ...m, 
                equipo_local_id: m.equipo_visitante_id, 
                equipo_visitante_id: m.equipo_local_id,
                jornada: m.jornada + t.length 
            }));
            matches.push(...vuelta);
        }

        const { error } = await supabase.from('partidos').insert(matches);
        if(error) throw error;
    }

    // Cambiar estado a en progreso
    await supabase.from('torneos').update({ estado: 'en_progreso' }).eq('id', torneoId);
    
    console.log("✅ Fixture generado");
}

// 4. ELIMINATORIAS Y AVANCE
export async function generarEliminatoria(torneoId) {
    const { data: torneo } = await supabase.from('torneos').select('*').eq('id', torneoId).single();
    const { data: { user } } = await supabase.auth.getUser();
    const numClasificados = torneo.configuracion.clasificados || 2;

    const { data: grupos } = await supabase.from('grupos').select('id, nombre').eq('torneo_id', torneoId).order('nombre');
    
    let clasificados = [];
    
    for (const grupo of grupos) {
        const { data: tabla } = await supabase.from('vista_posiciones')
            .select('*')
            .eq('grupo_id', grupo.id)
            .order('pts', { ascending: false })
            .order('dg', { ascending: false })
            .order('gf', { ascending: false })
            .limit(numClasificados);
        
        clasificados.push(...tabla.map((t, idx) => ({ ...t, posicion: idx + 1, grupoNombre: grupo.nombre })));
    }

    const totalClasificados = clasificados.length;
    let fase = 'final';
    if (totalClasificados > 8) fase = 'octavos';
    else if (totalClasificados > 4) fase = 'cuartos';
    else if (totalClasificados > 2) fase = 'semifinales';

    // Generar cruces cruzados (1A vs 2B, 1B vs 2A, 1C vs 2D, 1D vs 2C, etc.)
    const matches = [];
    for (let i = 0; i < grupos.length; i += 2) {
        const gA = clasificados.filter(c => c.grupoNombre === grupos[i].nombre);
        const gB = grupos[i+1] ? clasificados.filter(c => c.grupoNombre === grupos[i+1].nombre) : null;
        
        if (gA[0] && gB && gB[1]) {
            // 1A vs 2B
            matches.push({
                user_id: user.id, torneo_id: torneoId, fase: fase, estado: 'pendiente',
                equipo_local_id: gA[0].equipo_id, equipo_visitante_id: gB[1].equipo_id
            });
            // 1B vs 2A
            if (gB[0] && gA[1]) {
                matches.push({
                    user_id: user.id, torneo_id: torneoId, fase: fase, estado: 'pendiente',
                    equipo_local_id: gB[0].equipo_id, equipo_visitante_id: gA[1].equipo_id
                });
            }
        } else if (gA[0] && gA[1]) {
            // Caso impar de grupos, emparejamos entre sí
            matches.push({
                user_id: user.id, torneo_id: torneoId, fase: fase, estado: 'pendiente',
                equipo_local_id: gA[0].equipo_id, equipo_visitante_id: gA[1].equipo_id
            });
        }
    }

    if (matches.length > 0) {
        await supabase.from('partidos').insert(matches);
        await supabase.from('torneos').update({ estado: 'eliminatoria' }).eq('id', torneoId);
    }
}

export async function avanzarFase(torneoId) {
    const { data: partidos } = await supabase.from('partidos')
        .select('*')
        .eq('torneo_id', torneoId)
        .order('id', { ascending: true });

    const fases = ['octavos', 'cuartos', 'semifinales', 'final'];
    
    // Encontrar fase actual (la más avanzada con partidos)
    let faseActual = null;
    for (const f of fases) {
        if (partidos.some(p => p.fase === f)) faseActual = f;
    }

    if (!faseActual) return;

    const partidosFase = partidos.filter(p => p.fase === faseActual);
    const todosFinalizados = partidosFase.every(p => p.estado === 'finalizado');

    if (!todosFinalizados) throw new Error("Aún hay partidos pendientes en esta fase");

    if (faseActual === 'final') {
        await supabase.from('torneos').update({ estado: 'finalizado' }).eq('id', torneoId);
        return 'Torneo Finalizado';
    }

    // Clasificar ganadores
    const ganadores = partidosFase.map(p => {
        if (p.goles_local > p.goles_visitante) return p.equipo_local_id;
        if (p.goles_visitante > p.goles_local) return p.equipo_visitante_id;
        return p.equipo_local_id; // Empate: clasifica local por defecto (regla de negocio sugerida)
    });

    const siguienteFase = fases[fases.indexOf(faseActual) + 1];
    const nuevosPartidos = [];
    const { data: { user } } = await supabase.auth.getUser();

    for (let i = 0; i < ganadores.length; i += 2) {
        if (ganadores[i] && ganadores[i+1]) {
            nuevosPartidos.push({
                user_id: user.id,
                torneo_id: torneoId,
                equipo_local_id: ganadores[i],
                equipo_visitante_id: ganadores[i+1],
                fase: siguienteFase,
                estado: 'pendiente'
            });
        }
    }

    if (nuevosPartidos.length > 0) {
        await supabase.from('partidos').insert(nuevosPartidos);
    }
}

// 5. GUARDAR RESULTADO Y CALCULAR
export async function guardarResultado(partidoId, gL, gV) {
    const { data: p, error } = await supabase.from('partidos')
        .update({ 
            goles_local: parseInt(gL) || 0, 
            goles_visitante: parseInt(gV) || 0, 
            estado: 'finalizado' 
        })
        .eq('id', partidoId)
        .select().single();
    
    if(error) throw error;
    
    // Disparar evento para actualización automática de la UI
    window.dispatchEvent(new Event('resultado-guardado'));
}


export async function obtenerFases(torneoId) {
    const { data: partidos } = await supabase.from('partidos').select('fase, estado').eq('torneo_id', torneoId);
    
    const resumen = {};
    if (!partidos) return resumen;

    partidos.forEach(p => {
        if (!resumen[p.fase]) {
            resumen[p.fase] = { total: 0, finalizados: 0 };
        }
        resumen[p.fase].total++;
        if (p.estado === 'finalizado') resumen[p.fase].finalizados++;
    });

    return resumen;
}
