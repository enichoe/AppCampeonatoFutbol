# SQL Fix Finalización Torneo

Ejecuta este código en el **Supabase SQL Editor**:

```sql
ALTER TABLE torneos
  ADD COLUMN IF NOT EXISTS finalizado_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS foto_campeon_url   TEXT,
  ADD COLUMN IF NOT EXISTS foto_trofeo_url    TEXT,
  ADD COLUMN IF NOT EXISTS campeon_equipo_id  UUID
    REFERENCES equipos(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS campeon_nombre     TEXT,
  ADD COLUMN IF NOT EXISTS frase_campeon      TEXT;

NOTIFY pgrst, 'reload schema';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'torneos'
  AND column_name IN (
    'finalizado_at',
    'foto_campeon_url',
    'campeon_equipo_id',
    'campeon_nombre'
  );
```
