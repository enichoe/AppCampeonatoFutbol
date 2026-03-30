-- 1. TORNEOS (Con Branding y Configuración Avanzada)
CREATE TABLE torneos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, 
  tipo TEXT CHECK (tipo IN ('liga', 'eliminatoria', 'grupos_eliminatoria')) DEFAULT 'liga',
  estado TEXT CHECK (estado IN ('configuracion', 'sorteo', 'en_progreso', 'finalizado')) DEFAULT 'configuracion',
  
  -- Branding
  logo_url TEXT,
  color_primario TEXT DEFAULT '#0f172a',
  color_secundario TEXT DEFAULT '#3b82f6',
  patrocinadores JSONB DEFAULT '[]'::jsonb,
  
  -- Info adicional
  descripcion TEXT,
  reglas TEXT,
  
  configuracion JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 2. SEDES Y CAMPOS
CREATE TABLE sedes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  nombre TEXT NOT NULL,
  direccion TEXT,
  ubicacion_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE campos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sede_id UUID REFERENCES sedes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL, -- Ej: Cancha 1, Sintética A
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ÁRBITROS
CREATE TABLE arbitros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  nombre TEXT NOT NULL,
  celular TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. GRUPOS
CREATE TABLE grupos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EQUIPOS
CREATE TABLE equipos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  grupo_id UUID REFERENCES grupos(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  escudo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 6. JUGADORES
CREATE TABLE jugadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  equipo_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  dorsal INTEGER,
  posicion TEXT,
  foto_url TEXT,
  dni TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PARTIDOS (Ampliación)
CREATE TABLE partidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  grupo_id UUID REFERENCES grupos(id) ON DELETE SET NULL,
  equipo_local_id UUID REFERENCES equipos(id),
  equipo_visitante_id UUID REFERENCES equipos(id),
  goles_local INTEGER DEFAULT 0,
  goles_visitante INTEGER DEFAULT 0,
  jornada INTEGER,
  fase TEXT DEFAULT 'grupos',
  estado TEXT CHECK (estado IN ('pendiente', 'en_juego', 'finalizado')) DEFAULT 'pendiente',
  
  -- Gestión avanzada
  fecha_hora TIMESTAMPTZ,
  campo_id UUID REFERENCES campos(id) ON DELETE SET NULL,
  arbitro_id UUID REFERENCES arbitros(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. EVENTOS DE PARTIDO (Estadísticas Dinámicas)
CREATE TABLE eventos_partido (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partido_id UUID REFERENCES partidos(id) ON DELETE CASCADE,
  equipo_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
  jugador_id UUID REFERENCES jugadores(id) ON DELETE SET NULL,
  minuto INTEGER,
  tipo TEXT CHECK (tipo IN ('gol', 'amarilla', 'roja', 'mvp', 'autogol', 'lesion')),
  comentario TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABLA DE POSICIONES
CREATE TABLE tabla_posiciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  grupo_id UUID REFERENCES grupos(id) ON DELETE CASCADE,
  equipo_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
  pj INTEGER DEFAULT 0, pg INTEGER DEFAULT 0, pe INTEGER DEFAULT 0, pp INTEGER DEFAULT 0,
  gf INTEGER DEFAULT 0, gc INTEGER DEFAULT 0, dg INTEGER DEFAULT 0, pts INTEGER DEFAULT 0,
  UNIQUE(torneo_id, equipo_id)
);

-- 10. SEGURIDAD RLS
ALTER TABLE torneos ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tabla_posiciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_partido ENABLE ROW LEVEL SECURITY;
ALTER TABLE sedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE campos ENABLE ROW LEVEL SECURITY;
ALTER TABLE arbitros ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS: Lectura Pública
CREATE POLICY "Lectura pública torneos" ON torneos FOR SELECT USING (true);
CREATE POLICY "Lectura pública grupos" ON grupos FOR SELECT USING (true);
CREATE POLICY "Lectura pública equipos" ON equipos FOR SELECT USING (true);
CREATE POLICY "Lectura pública jugadores" ON jugadores FOR SELECT USING (true);
CREATE POLICY "Lectura pública partidos" ON partidos FOR SELECT USING (true);
CREATE POLICY "Lectura pública tablas" ON tabla_posiciones FOR SELECT USING (true);
CREATE POLICY "Lectura pública eventos" ON eventos_partido FOR SELECT USING (true);
CREATE POLICY "Lectura pública sedes" ON sedes FOR SELECT USING (true);
CREATE POLICY "Lectura pública campos" ON campos FOR SELECT USING (true);
CREATE POLICY "Lectura pública arbitros" ON arbitros FOR SELECT USING (true);

-- ... (restantes políticas de dueño similares)

-- 11. CUADRO DE HONOR (Para Ligas Barriales)
CREATE TABLE cuadro_honor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  jornada INTEGER,
  tipo TEXT CHECK (tipo IN ('jugador_fecha', 'mejor_arquero', 'mejor_defensa', 'mejor_volante', 'goleador_fecha')),
  jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(torneo_id, jornada, tipo)
);

ALTER TABLE cuadro_honor ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública cuadro honor" ON cuadro_honor FOR SELECT USING (true);
CREATE POLICY "Admin gestiona cuadro honor" ON cuadro_honor FOR ALL USING (
    auth.uid() IN (SELECT user_id FROM torneos WHERE id = torneo_id)
);

