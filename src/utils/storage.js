import { supabase } from '../services/supabase.js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

/**
 * Convierte cualquier valor de *_url a una URL pública funcional,
 * sin importar cómo se guardó en la DB (path, firmado, full URL)
 */
export function getPublicUrl(valor, bucket) {
  if (!valor) return null

  // Caso 1: ya es URL completa pública de Supabase Storage
  if (valor.startsWith('https://') && valor.includes('/storage/v1/object/public/')) {
    return valor
  }

  // Caso 2: URL completa pero de objeto firmado (sign) → reconstruir como pública
  if (valor.startsWith('https://') && valor.includes('/storage/v1/object/sign/')) {
    const partes = valor.split('/object/sign/' + bucket + '/')
    if (partes[1]) {
      const path = partes[1].split('?')[0] // quitar query params del token
      return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
    }
    return null
  }

  // Caso 3: URL completa pero bucket incorrecto o genérica de Supabase
  if (valor.startsWith('https://') && valor.includes('/storage/v1/')) {
    return valor
  }

  // Caso 4: path relativo con bucket incluido "equipos/archivo.png"
  if (valor.startsWith(bucket + '/')) {
    return `${SUPABASE_URL}/storage/v1/object/public/${valor}`
  }

  // Caso 5: path relativo sin bucket "archivo.png" o "carpeta/archivo.png"
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${valor}`
}

/**
 * Helpers específicos por tipo de recurso
 */
export const getEscudoUrl  = (url) => getPublicUrl(url, 'equipos')
export const getFotoUrl    = (url) => getPublicUrl(url, 'jugadores')
export const getLogoUrl    = (url) => getPublicUrl(url, 'torneos')

/**
 * Genera el HTML de un escudo con fallback a iniciales si la carga falla
 */
export function renderEscudo(escudoUrl, nombreEquipo, size = 40) {
  const url = getEscudoUrl(escudoUrl)
  const iniciales = nombreEquipo
    ? nombreEquipo.substring(0, 2).toUpperCase()
    : '?'

  if (url) {
    return `
      <div class="relative overflow-hidden flex items-center justify-center bg-slate-900/50 rounded-full border border-white/5" style="width:${size}px; height:${size}px;">
        <img
          src="${url}"
          alt="Escudo ${nombreEquipo}"
          width="${size}"
          height="${size}"
          loading="lazy"
          class="w-full h-full object-contain p-1"
          onerror="
            this.onerror=null;
            this.style.display='none';
            this.nextElementSibling.style.display='flex';
          "
        />
        <div style="display:none; width:100%; height:100%;
                    align-items:center; justify-content:center;
                    font-size:${Math.floor(size * 0.35)}px;
                    font-weight:900; color:var(--cyan, #00d4ff); font-style: italic;">
          ${iniciales}
        </div>
      </div>
    `
  }

  return `
    <div class="flex items-center justify-center bg-slate-900/50 rounded-full border border-white/5" 
         style="width:${size}px; height:${size}px; font-size:${Math.floor(size * 0.35)}px; font-weight:900; color:var(--cyan, #00d4ff); font-style: italic;">
      ${iniciales}
    </div>
  `
}

/**
 * Genera el HTML de la foto de un jugador con fallback a su inicial
 */
export function renderFotoJugador(fotoUrl, nombreJugador, size = 48) {
  const url = getFotoUrl(fotoUrl)
  const inicial = nombreJugador
    ? nombreJugador.charAt(0).toUpperCase()
    : '?'

  if (url) {
    return `
      <div class="relative overflow-hidden flex items-center justify-center bg-slate-900/50 rounded-full border border-white/5" style="width:${size}px; height:${size}px;">
        <img
          src="${url}"
          alt="${nombreJugador}"
          width="${size}"
          height="${size}"
          loading="lazy"
          class="w-full h-full object-cover"
          onerror="
            this.onerror=null;
            this.style.display='none';
            this.nextElementSibling.style.display='flex';
          "
        />
        <div style="display:none; width:100%; height:100%;
                    align-items:center; justify-content:center;
                    font-size:${Math.floor(size * 0.4)}px;
                    font-weight:900; color:var(--cyan, #00d4ff);">
          ${inicial}
        </div>
      </div>
    `
  }

  return `
    <div class="flex items-center justify-center bg-slate-900/50 rounded-full border border-white/5" 
         style="width:${size}px; height:${size}px; font-size:${Math.floor(size * 0.4)}px; font-weight:900; color:var(--cyan, #00d4ff);">
      ${inicial}
    </div>
  `
}
