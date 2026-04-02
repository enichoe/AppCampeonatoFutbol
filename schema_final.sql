-- ========================================================
-- ⚽ APP FUTBOL - SCHEMA FINAL CONSOLIDADO (v4.0)
-- ========================================================
-- Este archivo recrea todo el ambiente de base de datos desde cero.
-- ADVERTENCIA: La primera sección elimina todas las tablas existentes.

-- 1. LIMPIEZA TOTAL (Orden de dependencia)
DROP VIEW IF EXISTS vista_posiciones CASCADE;
DROP VIEW IF EXISTS jugadores_publicos CASCADE;
DROP TABLE IF EXISTS cuadro_honor CASCADE;
DROP TABLE IF EXISTS eventos_partido CASCADE;
DROP TABLE IF EXISTS partidos CASCADE;
DROP TABLE IF EXISTS jugadores CASCADE;
DROP TABLE IF EXISTS equipos CASCADE;
DROP TABLE IF EXISTS grupos CASCADE;
DROP TABLE IF EXISTS arbitros CASCADE;
DROP TABLE IF EXISTS campos CASCADE;
DROP TABLE IF EXISTS sedes CASCADE;
DROP TABLE IF EXISTS torneos CASCADE;
DROP TABLE IF EXISTS perfiles CASCADE;

-- 2. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. TABLAS BASE

-- [perfiles] - Extensión de auth.users
CREATE TABLE perfiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  nombre TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- [torneos] - El corazón del sistema
CREATE TABLE torneos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  nombre TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, 
  tipo TEXT CHECK (tipo IN ('liga', 'eliminatoria', 'grupos_eliminatoria')) DEFAULT 'liga',
  estado TEXT CHECK (estado IN ('configuracion', 'sorteo', 'en_progreso', 'eliminatoria', 'finalizado')) DEFAULT 'configuracion',
  is_public BOOLEAN DEFAULT true,
  lugar TEXT,
  
  -- Branding y Contenido
  logo_url TEXT,
  color_primario TEXT DEFAULT '#0f172a',
  color_secundario TEXT DEFAULT '#3b82f6',
  descripcion TEXT,
  reglas TEXT,
  patrocinadores JSONB DEFAULT '[]'::jsonb,
  
  -- Finalización (Campeón)
  campeon_nombre TEXT,
  foto_campeon_url TEXT,
  foto_trofeo_url TEXT,
  frase_campeon TEXT,
  
  configuracion JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- [sedes] y [campos] - Infraestructura
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
  nombre TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- [arbitros]
CREATE TABLE arbitros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  nombre TEXT NOT NULL,
  celular TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- [grupos]
CREATE TABLE grupos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- [equipos]
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

-- [jugadores] (Sensitive data: dni)
CREATE TABLE jugadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL DEFAULT auth.uid(),
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  equipo_id UUID REFERENCES equipos(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  dorsal INTEGER,
  posicion TEXT,
  foto_url TEXT,
  dni TEXT, -- Solo accesible por el dueño
  edad INTEGER,
  lesionado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- [partidos]
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
  
  fecha_hora TIMESTAMPTZ,
  campo_id UUID REFERENCES campos(id) ON DELETE SET NULL,
  arbitro_id UUID REFERENCES arbitros(id) ON DELETE SET NULL,
  notas TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- [eventos_partido]
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

-- [cuadro_honor]
CREATE TABLE cuadro_honor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  torneo_id UUID REFERENCES torneos(id) ON DELETE CASCADE,
  jornada INTEGER,
  tipo TEXT CHECK (tipo IN ('jugador_fecha', 'mejor_arquero', 'mejor_defensa', 'mejor_volante', 'goleador_fecha')),
  jugador_id UUID REFERENCES jugadores(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(torneo_id, jornada, tipo)
);

-- 4. ÍNDICES DE PERFORMANCE
CREATE INDEX idx_torneos_user ON torneos(user_id);
CREATE INDEX idx_torneos_slug ON torneos(slug);
CREATE INDEX idx_partidos_torneo_estado ON partidos(torneo_id, estado);
CREATE INDEX idx_partidos_fecha_hora ON partidos(torneo_id, fecha_hora);
CREATE INDEX idx_equipos_torneo ON equipos(torneo_id);
CREATE INDEX idx_jugadores_equipo ON jugadores(equipo_id);

-- 5. TRIGGER: AUTO-CREAR PERFIL AL REGISTRARSE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (id, nombre, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. VISTAS DINÁMICAS

-- [jugadores_publicos] - Oculta el DNI para uso público
CREATE OR REPLACE VIEW jugadores_publicos AS
SELECT id, torneo_id, equipo_id, nombre, dorsal, posicion, foto_url, edad, lesionado, created_at
FROM jugadores;

-- [vista_posiciones] - Cálculo en tiempo real
CREATE OR REPLACE VIEW vista_posiciones AS
WITH stats_por_partido AS (
    SELECT 
        equipo_local_id AS equipo_id, torneo_id, grupo_id, COUNT(*) AS pj,
        SUM(CASE WHEN goles_local > goles_visitante THEN 1 ELSE 0 END) AS pg,
        SUM(CASE WHEN goles_local = goles_visitante THEN 1 ELSE 0 END) AS pe,
        SUM(CASE WHEN goles_local < goles_visitante THEN 1 ELSE 0 END) AS pp,
        SUM(goles_local) AS gf, SUM(goles_visitante) AS gc
    FROM partidos WHERE estado = 'finalizado'
    GROUP BY equipo_local_id, torneo_id, grupo_id
    UNION ALL
    SELECT 
        equipo_visitante_id AS equipo_id, torneo_id, grupo_id, COUNT(*) AS pj,
        SUM(CASE WHEN goles_visitante > goles_local THEN 1 ELSE 0 END) AS pg,
        SUM(CASE WHEN goles_visitante = goles_local THEN 1 ELSE 0 END) AS pe,
        SUM(CASE WHEN goles_visitante < goles_local THEN 1 ELSE 0 END) AS pp,
        SUM(goles_visitante) AS gf, SUM(goles_local) AS gc
    FROM partidos WHERE estado = 'finalizado'
    GROUP BY equipo_visitante_id, torneo_id, grupo_id
),
stats_agregadas AS (
    SELECT 
        equipo_id, torneo_id, grupo_id, SUM(pj) AS pj, SUM(pg) AS pg, SUM(pe) AS pe, SUM(pp) AS pp,
        SUM(gf) AS gf, SUM(gc) AS gc, (SUM(pg) * 3 + SUM(pe) * 1) AS pts, (SUM(gf) - SUM(gc)) AS dg
    FROM stats_por_partido GROUP BY equipo_id, torneo_id, grupo_id
)
SELECT 
    e.id AS equipo_id, e.nombre AS equipo_nombre, e.escudo_url, e.torneo_id, e.grupo_id,
    COALESCE(s.pj, 0) AS pj, COALESCE(s.pg, 0) AS pg, COALESCE(s.pe, 0) AS pe, COALESCE(s.pp, 0) AS pp,
    COALESCE(s.gf, 0) AS gf, COALESCE(s.gc, 0) AS gc, COALESCE(s.dg, 0) AS dg, COALESCE(s.pts, 0) AS pts
FROM equipos e
LEFT JOIN stats_agregadas s ON e.id = s.equipo_id
WHERE e.deleted_at IS NULL;

-- 7. SEGURIDAD (RLS)
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE torneos ENABLE ROW LEVEL SECURITY;
ALTER TABLE sedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE campos ENABLE ROW LEVEL SECURITY;
ALTER TABLE arbitros ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_partido ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuadro_honor ENABLE ROW LEVEL SECURITY;

-- Políticas de Lectura Pública (Solo lo necesario)
CREATE POLICY "Public profiles" ON perfiles FOR SELECT USING (true);
CREATE POLICY "Public tournaments" ON torneos FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Public infrastructure" ON sedes FOR SELECT USING (true);
CREATE POLICY "Public infrastructure" ON campos FOR SELECT USING (true);
CREATE POLICY "Public infrastructure" ON arbitros FOR SELECT USING (true);
CREATE POLICY "Public groups" ON grupos FOR SELECT USING (true);
CREATE POLICY "Public teams" ON equipos FOR SELECT USING (true);
CREATE POLICY "Public matches" ON partidos FOR SELECT USING (true);
CREATE POLICY "Public events" ON eventos_partido FOR SELECT USING (true);
CREATE POLICY "Public awards" ON cuadro_honor FOR SELECT USING (true);

-- Política Especial para Jugadores (Protección de DNI)
-- El público solo ve la vista [jugadores_publicos]. 
-- En la tabla física [jugadores], solo el owner puede leer (incluyendo DNI).
CREATE POLICY "Tournament owners manage players" ON jugadores
  FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM torneos WHERE id = torneo_id))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM torneos WHERE id = torneo_id));

-- Políticas de Gestión (Solo Owners)
CREATE POLICY "Owners manage everything" ON torneos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owners manage everything" ON sedes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owners manage everything" ON arbitros FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owners manage everything" ON grupos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owners manage everything" ON equipos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owners manage everything" ON partidos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owners manage everything" ON eventos_partido FOR ALL USING (
    EXISTS (SELECT 1 FROM partidos WHERE id = partido_id AND user_id = auth.uid())
);
CREATE POLICY "Owners manage awards" ON cuadro_honor FOR ALL USING (
    EXISTS (SELECT 1 FROM torneos WHERE id = torneo_id AND user_id = auth.uid())
);

-- Permisos sobre Vistas
GRANT SELECT ON jugadores_publicos TO anon, authenticated;
GRANT SELECT ON vista_posiciones TO anon, authenticated;

-- 8. STORAGE (Buckets)
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('torneos', 'torneos', true),
  ('equipos', 'equipos', true),
  ('jugadores', 'jugadores', true),
  ('auspiciadores', 'auspiciadores', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Read" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ========================================================
-- ✅ BLOQUE DE VERIFICACIÓN
-- ========================================================
/*
  1. Verificar tablas creadas:
     SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
  
  2. Verificar vistas activas:
     SELECT table_name FROM information_schema.views WHERE table_schema = 'public';
     
  3. Verificar que DNI no es público:
     -- Como usuario anónimo, esto debería fallar o devolver 0 filas:
     SELECT dni FROM jugadores; 
     -- En su lugar, usa siempre la vista:
     SELECT * FROM jugadores_publicos;
*/
