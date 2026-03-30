import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validación de URL
const isValidUrl = (url) => {
    try { 
        return url && url.startsWith('http') && url.includes('.') 
    } catch(e) { return false }
}

let supabaseInstance = null

if (isValidUrl(rawUrl) && rawKey && rawKey.length > 20) {
    try {
        supabaseInstance = createClient(rawUrl, rawKey)
    } catch (e) {
        console.error('🔴 Error Grave de Configuración Supabase:', e.message)
    }
}

// Si no se pudo crear el cliente, usamos un Proxy Mock para evitar "Crashes"
if (!supabaseInstance) {
    console.warn('⚠️ ENTRANDO EN MODO DEMO: Configura el .env para usar Supabase real.')
    
    // Mock recursivo para soportar supabase.auth.signUp, etc.
    const mockHandler = {
        get: (target, prop) => {
            if (['auth', 'from', 'select', 'insert', 'update'].includes(prop)) {
                return new Proxy(() => {}, mockHandler)
            }
            return async () => ({ 
                data: [], 
                error: { message: 'ERROR: Debes añadir tu VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env para esta acción.' } 
            })
        },
        apply: (target, thisArg, args) => {
            return new Proxy({}, mockHandler)
        }
    }
    supabaseInstance = new Proxy({}, mockHandler)
}

export const supabase = supabaseInstance

export const getCurrentUser = async () => {
  if (!isValidUrl(rawUrl)) return null
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return error ? null : user
  } catch (e) { return null }
}

export const signOut = async () => {
    if (isValidUrl(rawUrl)) {
        await supabase.auth.signOut()
    }
    window.location.href = '/'
}
