/**
 * TOURNAMENT LOGIC ENGINE (Vanilla JS)
 * Implementa algoritmos profesionales para generación de fixtures y sorteos.
 */

// 1. SORTEO: Algoritmo Fisher-Yates para mezcla aleatoria
export const shuffleTeams = (teams) => {
    const shuffled = [...teams];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 2. DISTRIBUCIÓN EN GRUPOS
export const distrubuteInGroups = (teams, numGroups) => {
    const shuffled = shuffleTeams(teams);
    const groups = Array.from({ length: numGroups }, () => []);
    
    shuffled.forEach((team, index) => {
        groups[index % numGroups].push(team);
    });
    
    return groups;
}

// 3. GENERACIÓN DE FIXTURE: Algoritmo Round Robin (Círculo)
export const generateFixture = (teams, options = { idaYVuelta: false }) => {
    const fixture = [];
    let participants = [...teams];
    
    // Si el número de equipos es impar, añadimos un "Descanso" (BYE)
    if (participants.length % 2 !== 0) {
        participants.push({ id: null, nombre: "DESCANSO" });
    }
    
    const numTeams = participants.length;
    const numRounds = numTeams - 1;
    const matchesPerRound = numTeams / 2;

    for (let round = 0; round < numRounds; round++) {
        const roundMatches = [];
        for (let i = 0; i < matchesPerRound; i++) {
            const home = participants[i];
            const away = participants[numTeams - 1 - i];
            
            // Solo registrar si no es un descanso
            if (home.id && away.id) {
                roundMatches.push({ home, away, jornada: round + 1 });
            }
        }
        
        fixture.push(...roundMatches);
        
        // Rotar participantes (manteniendo el primero fijo)
        participants.splice(1, 0, participants.pop());
    }

    // Soporte para Ida y Vuelta
    if (options.idaYVuelta) {
        const returns = fixture.map(m => ({
            home: m.away, 
            away: m.home, 
            jornada: m.jornada + numRounds
        }));
        return [...fixture, ...returns];
    }

    return fixture;
}

// 4. CÁLCULO DE TABLA
export const calculateTable = (matches, teams) => {
    const table = teams.map(t => ({
        id: t.id,
        nombre: t.nombre,
        pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0
    }));

    matches.forEach(m => {
        if (m.estado !== 'finalizado') return;

        const home = table.find(t => t.id === m.equipo_local_id);
        const away = table.find(t => t.id === m.equipo_visitante_id);

        if (!home || !away) return;

        home.pj++; away.pj++;
        home.gf += m.goles_local; home.gc += m.goles_visitante;
        away.gf += m.goles_visitante; away.gc += m.goles_local;

        if (m.goles_local > m.goles_visitante) { home.pg++; home.pts += 3; away.pp++; }
        else if (m.goles_local < m.goles_visitante) { away.pg++; away.pts += 3; home.pp++; }
        else { home.pe++; away.pe++; home.pts += 1; away.pts += 1; }

        home.dg = home.gf - home.gc;
        away.dg = away.gf - away.gc;
    });

    // Ordenar por puntos, diferencia y goles favor
    return table.sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
}

// 5. CLASIFICADOS Y CRUCES DE ELIMINATORIA
export const generateEliminationBracket = (groupsStandings, options) => {
    // Ejemplo para 2 clasificados por grupo: 1A vs 2B, 1B vs 2A...
    const bracket = [];
    const numGroups = groupsStandings.length;

    for (let i = 0; i < numGroups; i += 2) {
        if (groupsStandings[i+1]) {
            // Cruce clásico
            bracket.push({ home: groupsStandings[i][0], away: groupsStandings[i+1][1], fase: 'cuartos' });
            bracket.push({ home: groupsStandings[i+1][0], away: groupsStandings[i][1], fase: 'cuartos' });
        }
    }
    return bracket;
}
