import { supabase } from '../services/supabase.js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

/**
 * Convierte cualquier valor de *_url a una URL pública funcional.
 */
export function getPublicUrl(valor, bucket) {
  if (!valor) return null
  if (valor.startsWith('https://')) return valor
  
  // Si es solo un path, construir la URL
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${valor}`
}

export const getEscudoUrl  = (url) => getPublicUrl(url, 'equipos')
export const getFotoUrl    = (url) => getPublicUrl(url, 'jugadores')
export const getLogoUrl    = (url) => getPublicUrl(url, 'torneos')

/**
 * Sube una imagen al bucket correspondiente de Supabase
 */
export async function uploadImage(file, bucket, folder = '') {
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = fileName

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return data.publicUrl
}

/**
 * Genera el HTML de un dropzone de imagen con estilo premium
 */
export function createImageDropzone(id, label = "Sube una imagen") {
  return `
    <div id="${id}" class="relative group cursor-pointer">
      <input type="file" id="${id}_input" class="hidden" accept="image/*">
      <div id="${id}_preview" class="w-full aspect-video bg-slate-900/50 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center p-6 group-hover:border-indigo-500/30 transition-all overflow-hidden relative">
          <div class="text-center group-hover:scale-110 transition-transform">
              <div class="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto mb-4 border border-indigo-500/20">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">${label}</p>
              <p class="text-[8px] font-bold text-slate-600 uppercase tracking-widest mt-2">JPG, PNG o WEBP (Máx 2MB)</p>
          </div>
          <div id="${id}_img_container" class="hidden absolute inset-0 bg-slate-900 flex items-center justify-center p-2">
              <img id="${id}_img" src="" class="w-full h-full object-contain rounded-2xl shadow-2xl">
              <button type="button" id="${id}_remove" class="absolute top-4 right-4 p-3 bg-rose-500/20 text-rose-500 rounded-2xl border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
          </div>
      </div>
    </div>
  `
}

/**
 * Configura la lógica del dropzone (eventos click, drag&drop, preview)
 */
export function setupDropzone(id, onFileSelect) {
  const container = document.getElementById(id)
  const input = document.getElementById(`${id}_input`)
  const preview = document.getElementById(`${id}_preview`)
  const imgContainer = document.getElementById(`${id}_img_container`)
  const img = document.getElementById(`${id}_img`)
  const removeBtn = document.getElementById(`${id}_remove`)

  preview.onclick = () => input.click()

  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) return alert('Máximo 2MB')
      
      const reader = new FileReader()
      reader.onload = (event) => {
        img.src = event.target.result
        imgContainer.classList.remove('hidden')
        if (onFileSelect) onFileSelect(file)
      }
      reader.readAsDataURL(file)
    }
  }

  removeBtn.onclick = (e) => {
    e.stopPropagation()
    input.value = ''
    imgContainer.classList.add('hidden')
    img.src = ''
    if (onFileSelect) onFileSelect(null)
  }

  // Drag & Drop basic
  preview.ondragover = (e) => { e.preventDefault(); preview.classList.add('border-indigo-500') }
  preview.ondragleave = () => { preview.classList.remove('border-indigo-500') }
  preview.ondrop = (e) => {
    e.preventDefault()
    preview.classList.remove('border-indigo-500')
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        input.files = dataTransfer.files
        input.dispatchEvent(new Event('change'))
    }
  }
}

export function renderEscudo(escudoUrl, nombreEquipo, size = 40) {
  const url = getEscudoUrl(escudoUrl)
  const iniciales = nombreEquipo ? nombreEquipo.substring(0, 2).toUpperCase() : '?'

  if (url) {
    return `
      <div class="relative overflow-hidden flex items-center justify-center bg-slate-900/50 rounded-full border border-white/5" style="width:${size}px; height:${size}px;">
        <img src="${url}" alt="Escudo ${nombreEquipo}" width="${size}" height="${size}" loading="lazy" class="w-full h-full object-contain p-1" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div style="display:none; width:100%; height:100%; align-items:center; justify-content:center; font-size:${Math.floor(size * 0.35)}px; font-weight:900; color:#6366f1;">
          ${iniciales}
        </div>
      </div>
    `
  }

  return `
    <div class="flex items-center justify-center bg-slate-900/50 rounded-full border border-white/5" style="width:${size}px; height:${size}px; font-size:${Math.floor(size * 0.35)}px; font-weight:900; color:#6366f1;">
      ${iniciales}
    </div>
  `
}

export function renderFotoJugador(fotoUrl, nombreJugador, size = 48) {
  const url = getFotoUrl(fotoUrl)
  const inicial = nombreJugador ? nombreJugador.charAt(0).toUpperCase() : '?'

  if (url) {
    return `
      <div class="relative overflow-hidden flex items-center justify-center bg-slate-900/50 rounded-full border border-white/5" style="width:${size}px; height:${size}px;">
        <img src="${url}" alt="${nombreJugador}" width="${size}" height="${size}" loading="lazy" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div style="display:none; width:100%; height:100%; align-items:center; justify-content:center; font-size:${Math.floor(size * 0.4)}px; font-weight:900; color:#6366f1;">
          ${inicial}
        </div>
      </div>
    `
  }

  return `
    <div class="flex items-center justify-center bg-slate-900/50 rounded-full border border-white/5" style="width:${size}px; height:${size}px; font-size:${Math.floor(size * 0.4)}px; font-weight:900; color:#6366f1;">
      ${inicial}
    </div>
  `
}
