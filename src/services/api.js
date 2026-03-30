// En desarrollo usa el proxy (/api), en producción usa la variable de entorno
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Helper para normalizar ids y campos de relación
const mapData = (type, items) => {
  if (!items || !Array.isArray(items)) return [];
  return items.map(item => {
    const newItem = { ...item, id: item._id };
    
    // Normalización de relaciones
    if (type === 'players') {
      // Frontend espera equipoId. Backend manda equipo object (populate)
      newItem.equipoId = item.equipo?._id || item.equipo;
    }
    if (type === 'teams') {
      // Frontend espera grupoId. Backend manda grupo (populate o id)
      newItem.grupoId = item.grupo?._id || item.grupo;
    }
    return newItem;
  });
};

const handleResponse = async (res, defaultMsg) => {
  if (!res.ok) {
    let errorMsg = defaultMsg;
    try {
      const errorData = await res.json();
      if (errorData.message) errorMsg = errorData.message;
    } catch (e) {
      errorMsg = `${defaultMsg}: ${res.statusText}`;
    }
    throw new Error(errorMsg);
  }
  return await res.json();
};

let token = localStorage.getItem('token') || '';

const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
}

export const api = {
  // Auth
  async login(username, password) {
    const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await handleResponse(res, 'Error en login');
    if(data.token){
        token = data.token;
        localStorage.setItem('token', token);
    }
    return data;
  },
  
  logout() {
      token = '';
      localStorage.removeItem('token');
  },

  // Carga inicial de todos los datos
  // Carga inicial resiliente
  async getAllData() {
    const fetchData = async (endpoint, label) => {
      try {
        const res = await fetch(`${API_URL}/${endpoint}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return await res.json();
      } catch (e) {
        console.error(`Error loading ${label}:`, e);
        return [];
      }
    };

    const [groups, teams, players, matches, sponsors] = await Promise.all([
      fetchData('groups', 'Grupos'),
      fetchData('teams', 'Equipos'),
      fetchData('players', 'Jugadores'),
      fetchData('matches', 'Partidos'),
      fetchData('sponsors', 'Auspiciadores')
    ]);

    return {
         groups: mapData('groups', groups),
         teams: mapData('teams', teams),
         players: mapData('players', players),
         matches: mapData('matches', matches),
         sponsors: mapData('sponsors', sponsors)
    };
  },

  // --- EQUIPOS ---
  async createTeam(teamData) {
    const res = await fetch(`${API_URL}/teams`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(teamData)
    });
    return handleResponse(res, 'Error creating team');
  },

  async updateTeam(id, teamData) {
    const res = await fetch(`${API_URL}/teams/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(teamData)
    });
    return handleResponse(res, 'Error updating team');
  },

  async deleteTeam(id) {
    const res = await fetch(`${API_URL}/teams/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) throw new Error('Error deleting team');
    return true;
  },

  // --- JUGADORES ---
  async createPlayer(playerData) {
    const res = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(playerData)
    });
    return handleResponse(res, 'Error creating player');
  },

  async updatePlayer(id, playerData) {
    const res = await fetch(`${API_URL}/players/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(playerData)
    });
    return handleResponse(res, 'Error updating player');
  },

  async deletePlayer(id) {
    const res = await fetch(`${API_URL}/players/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) throw new Error('Error deleting player');
    return true;
  },

   // --- PARTIDOS ---
   async createMatch(data) {
    const res = await fetch(`${API_URL}/matches`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
     return handleResponse(res, 'Error creating match');
  },

  async updateMatch(id, data) {
    const res = await fetch(`${API_URL}/matches/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
     return handleResponse(res, 'Error updating match');
  },

  async deleteMatch(id) {
    const res = await fetch(`${API_URL}/matches/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) throw new Error('Error deleting match');
    return true;
  },

  // --- SPONSORS ---
  async createSponsor(data) {
    const res = await fetch(`${API_URL}/sponsors`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
     return handleResponse(res, 'Error creating sponsor');
  },

  async updateSponsor(id, data) {
    const res = await fetch(`${API_URL}/sponsors/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
     return handleResponse(res, 'Error updating sponsor');
  },

  async deleteSponsor(id) {
    const res = await fetch(`${API_URL}/sponsors/${id}`, { method: 'DELETE', headers: getHeaders() });
     if (!res.ok) throw new Error('Error deleting sponsor');
    return true;
  }
};
