import { supabase } from '../services/supabase.js'

/**
 * Sube una imagen a un bucket de Supabase Storage y devuelve la URL pública.
 * @param {File} file 
 * @param {string} bucket 
 * @param {string} folder 
 * @returns {Promise<string>}
 */
export async function uploadImage(file, bucket, folder) {
    if (!file) return null

    const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`
    const filePath = `${folder}/${fileName}`

    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath)

    return publicUrl
}

/**
 * Genera el HTML para un selector de imagen con previsualización.
 * @param {string} name - Nombre único para el input/ID.
 * @param {string} label - Etiqueta a mostrar.
 * @param {boolean} required - Si es obligatorio.
 * @param {'square' | 'circle'} shape - Forma de la previsualización.
 * @returns {string}
 */
export function createImageDropzone(name, label, required = false, shape = 'square') {
    const isCircle = shape === 'circle'
    return `
        <div class="space-y-3 dropzone-container" data-name="${name}">
            <label class="text-[10px] font-black italic uppercase tracking-widest text-slate-500">${label} ${required ? '<span class="text-red-500">*</span>' : ''}</label>
            <div id="dropzone-${name}" class="relative group cursor-pointer">
                <input type="file" id="input-${name}" class="hidden" accept="image/*" ${required ? 'required' : ''}>
                <div id="preview-${name}" class="w-full aspect-video ${isCircle ? 'aspect-square rounded-full mx-auto max-w-[150px]' : 'rounded-2xl'} bg-slate-900 border-2 border-dashed border-slate-800 group-hover:border-indigo-500/50 flex flex-col items-center justify-center transition-all overflow-hidden relative">
                    <div class="flex flex-col items-center text-center p-4 dropzone-placeholder">
                        <svg class="w-6 h-6 text-slate-600 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"></path></svg>
                        <span class="text-[9px] font-black italic text-slate-600 uppercase">Seleccionar Imagen</span>
                    </div>
                    <img id="img-preview-${name}" class="hidden absolute inset-0 w-full h-full object-cover">
                </div>
            </div>
        </div>
    `
}

/**
 * Inicializa la lógica de previsualización para un dropzone (debe llamarse después de inyectar el HTML).
 * @param {string} name 
 * @param {Function} onChange - Callback opcional.
 */
export function setupDropzone(name, onChange) {
    const input = document.getElementById(`input-${name}`)
    const dropzone = document.getElementById(`dropzone-${name}`)
    const preview = document.getElementById(`img-preview-${name}`)
    const placeholder = dropzone.querySelector('.dropzone-placeholder')

    dropzone.onclick = () => input.click()

    input.onchange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (re) => {
                preview.src = re.target.result
                preview.classList.remove('hidden')
                if (placeholder) placeholder.classList.add('hidden')
                if (onChange) onChange(file)
            }
            reader.readAsDataURL(file)
        }
    }
}
