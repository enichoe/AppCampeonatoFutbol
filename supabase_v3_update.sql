-- 1. Agregar columnas a la tabla torneos para el campeón y patrocinadores
ALTER TABLE torneos ADD COLUMN IF NOT EXISTS foto_campeon_url TEXT;
ALTER TABLE torneos ADD COLUMN IF NOT EXISTS foto_trofeo_url TEXT;
ALTER TABLE torneos ADD COLUMN IF NOT EXISTS frase_campeon TEXT;
ALTER TABLE torneos ADD COLUMN IF NOT EXISTS patrocinadores JSONB DEFAULT '[]'::jsonb;

-- 2. Agregar columnas a la tabla jugadores
ALTER TABLE jugadores ADD COLUMN IF NOT EXISTS edad INTEGER;
ALTER TABLE jugadores ADD COLUMN IF NOT EXISTS lesionado BOOLEAN DEFAULT false;
ALTER TABLE jugadores ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- 3. Agregar columna escudo_url a la tabla equipos (si no existía)
ALTER TABLE equipos ADD COLUMN IF NOT EXISTS escudo_url TEXT;

-- 4. Creación de Buckets de Storage (Ejecutar en SQL Editor)
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('torneos', 'torneos', true),
  ('equipos', 'equipos', true),
  ('jugadores', 'jugadores', true),
  ('auspiciadores', 'auspiciadores', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Políticas de Storage
-- Torneos
DROP POLICY IF EXISTS "Public Read Torneos" ON storage.objects;
CREATE POLICY "Public Read Torneos" ON storage.objects FOR SELECT USING (bucket_id = 'torneos');
DROP POLICY IF EXISTS "Auth Insert Torneos" ON storage.objects;
CREATE POLICY "Auth Insert Torneos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'torneos' AND auth.role() = 'authenticated');

-- Equipos
DROP POLICY IF EXISTS "Public Read Equipos" ON storage.objects;
CREATE POLICY "Public Read Equipos" ON storage.objects FOR SELECT USING (bucket_id = 'equipos');
DROP POLICY IF EXISTS "Auth Insert Equipos" ON storage.objects;
CREATE POLICY "Auth Insert Equipos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'equipos' AND auth.role() = 'authenticated');

-- Jugadores
DROP POLICY IF EXISTS "Public Read Jugadores" ON storage.objects;
CREATE POLICY "Public Read Jugadores" ON storage.objects FOR SELECT USING (bucket_id = 'jugadores');
DROP POLICY IF EXISTS "Auth Insert Jugadores" ON storage.objects;
CREATE POLICY "Auth Insert Jugadores" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'jugadores' AND auth.role() = 'authenticated');

-- Auspiciadores
DROP POLICY IF EXISTS "Public Read Auspiciadores" ON storage.objects;
CREATE POLICY "Public Read Auspiciadores" ON storage.objects FOR SELECT USING (bucket_id = 'auspiciadores');
DROP POLICY IF EXISTS "Auth Insert Auspiciadores" ON storage.objects;
CREATE POLICY "Auth Insert Auspiciadores" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'auspiciadores' AND auth.role() = 'authenticated');

-- 6. Infraestructura de Sedes y Árbitros (Asegurar tablas base)
CREATE TABLE IF NOT EXISTS sedes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  nombre TEXT NOT NULL,
  direccion TEXT,
  ubicacion_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sede_id UUID REFERENCES sedes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS arbitros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  nombre TEXT NOT NULL,
  celular TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para nuevas tablas
ALTER TABLE sedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE campos ENABLE ROW LEVEL SECURITY;
ALTER TABLE arbitros ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura pública sedes" ON sedes;
CREATE POLICY "Lectura pública sedes" ON sedes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lectura pública campos" ON campos;
CREATE POLICY "Lectura pública campos" ON campos FOR SELECT USING (true);
DROP POLICY IF EXISTS "Lectura pública arbitros" ON arbitros;
CREATE POLICY "Lectura pública arbitros" ON arbitros FOR SELECT USING (true);

-- Admin políticas (Gestión completa para el dueño)
DROP POLICY IF EXISTS "Admin gestiona sedes" ON sedes;
CREATE POLICY "Admin gestiona sedes" ON sedes FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admin gestiona arbitros" ON arbitros;
CREATE POLICY "Admin gestiona arbitros" ON arbitros FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admin gestiona campos" ON campos;
CREATE POLICY "Admin gestiona campos" ON campos FOR ALL USING (
    EXISTS (SELECT 1 FROM sedes WHERE id = sede_id AND user_id = auth.uid())
);

-- 7. Programación de Partidos (Asegurar que existan los campos en la tabla partidos)
ALTER TABLE partidos ADD COLUMN IF NOT EXISTS fecha_hora TIMESTAMPTZ;
ALTER TABLE partidos ADD COLUMN IF NOT EXISTS campo_id UUID REFERENCES campos(id) ON DELETE SET NULL;
ALTER TABLE partidos ADD COLUMN IF NOT EXISTS arbitro_id UUID REFERENCES arbitros(id) ON DELETE SET NULL;
ALTER TABLE partidos ADD COLUMN IF NOT EXISTS notas TEXT;

-- Índice para ordenamiento eficiente por fecha
CREATE INDEX IF NOT EXISTS idx_partidos_fecha_hora ON partidos(torneo_id, fecha_hora);
