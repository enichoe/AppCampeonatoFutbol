-- ==========================================
-- 🔐 CONFIGURACIÓN INTEGRAL: MULTI-TENANT + MARKETPLACE
-- ==========================================

DO $$ BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='torneos' AND column_name='user_id') THEN
        ALTER TABLE torneos ADD COLUMN user_id uuid REFERENCES auth.users DEFAULT auth.uid();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='equipos' AND column_name='user_id') THEN
        ALTER TABLE equipos ADD COLUMN user_id uuid REFERENCES auth.users DEFAULT auth.uid();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='jugadores' AND column_name='user_id') THEN
        ALTER TABLE jugadores ADD COLUMN user_id uuid REFERENCES auth.users DEFAULT auth.uid();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='partidos' AND column_name='user_id') THEN
        ALTER TABLE partidos ADD COLUMN user_id uuid REFERENCES auth.users DEFAULT auth.uid();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='torneos' AND column_name='is_public') THEN
        ALTER TABLE torneos ADD COLUMN is_public boolean DEFAULT true;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='torneos' AND column_name='lugar') THEN
        ALTER TABLE torneos ADD COLUMN lugar text;
    END IF;
END $$;

ALTER TABLE torneos ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE jugadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE partidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tabla_posiciones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Tournament visibility" ON torneos;
DROP POLICY IF EXISTS "Tournament management" ON torneos;
DROP POLICY IF EXISTS "Team visibility" ON equipos;
DROP POLICY IF EXISTS "Team management" ON equipos;
DROP POLICY IF EXISTS "Player visibility" ON jugadores;
DROP POLICY IF EXISTS "Player management" ON jugadores;
DROP POLICY IF EXISTS "Match visibility" ON partidos;
DROP POLICY IF EXISTS "Match management" ON partidos;
DROP POLICY IF EXISTS "Group visibility" ON grupos;
DROP POLICY IF EXISTS "Standings visibility" ON tabla_posiciones;
DROP POLICY IF EXISTS "Group management" ON grupos;
DROP POLICY IF EXISTS "Standings management" ON tabla_posiciones;

CREATE POLICY "Tournament visibility" ON torneos FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Tournament management" ON torneos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Team visibility" ON equipos FOR SELECT USING (true);
CREATE POLICY "Team management" ON equipos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Player visibility" ON jugadores FOR SELECT USING (true);
CREATE POLICY "Player management" ON jugadores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Match visibility" ON partidos FOR SELECT USING (true);
CREATE POLICY "Match management" ON partidos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Group visibility" ON grupos FOR SELECT USING (true);
CREATE POLICY "Standings visibility" ON tabla_posiciones FOR SELECT USING (true);
CREATE POLICY "Group management" ON grupos FOR ALL USING (EXISTS (SELECT 1 FROM torneos WHERE torneos.id = grupos.torneo_id AND torneos.user_id = auth.uid()));
CREATE POLICY "Standings management" ON tabla_posiciones FOR ALL USING (EXISTS (SELECT 1 FROM torneos WHERE torneos.id = tabla_posiciones.torneo_id AND torneos.user_id = auth.uid()));
