-- ============================================================
-- SQL DE ACTUALIZACIÓN (Ejecutar en Supabase Query Editor)
-- ============================================================

-- 1. Actualizar el check de estados en la tabla torneos
ALTER TABLE torneos DROP CONSTRAINT IF EXISTS torneos_estado_check;
ALTER TABLE torneos ADD CONSTRAINT torneos_estado_check 
  CHECK (estado IN ('configuracion', 'sorteo', 'en_progreso', 'eliminatoria', 'finalizado'));

-- 2. Asegurar que la tabla partidos tenga la columna fase
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='partidos' AND COLUMN_NAME='fase') THEN 
        ALTER TABLE partidos ADD COLUMN fase TEXT DEFAULT 'grupos';
    END IF;
END $$;

-- 3. Asegurar que la tabla grupos tenga user_id (para RLS)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='grupos' AND COLUMN_NAME='user_id') THEN 
        ALTER TABLE grupos ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;
