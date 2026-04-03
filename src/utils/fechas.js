/**
 * Parsea un string YYYY-MM-DD (de un input date) a un objeto Date 
 * en el huso horario local de Lima/Perú para evitar el error de "un día antes".
 */
export function parsearFechaLocal(fechaString) {
  if (!fechaString) return null
  // fechaString: "2026-04-02"
  const [anio, mes, dia] = fechaString.split('-').map(Number)
  
  // Crear fecha al mediodía (12:00:00) local para evitar problemas de 
  // saltos de día por cambios de horario o desfases de milisegundos.
  const fechaLocal = new Date(anio, mes - 1, dia, 12, 0, 0)
  return fechaLocal
}

/**
 * Formatea una fecha ISO a español peruano (Ej: "2 de abril de 2026")
 */
export function formatearFecha(fechaISO) {
  if (!fechaISO) return '—'
  return new Date(fechaISO).toLocaleDateString('es-PE', {
    timeZone: 'America/Lima',
    day:      'numeric',
    month:    'long',
    year:     'numeric'
  })
}

/**
 * Formatea una fecha ISO a español peruano con hora (Ej: "2 abr 2026, 03:00 p.m.")
 */
export function formatearFechaHora(fechaISO) {
  if (!fechaISO) return '—'
  return new Date(fechaISO).toLocaleString('es-PE', {
    timeZone: 'America/Lima',
    day:      'numeric',
    month:    'short',
    year:     'numeric',
    hour:     '2-digit',
    minute:   '2-digit'
  })
}
