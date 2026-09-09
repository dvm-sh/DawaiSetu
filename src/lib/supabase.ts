import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
// Use the service role key if available (to bypass RLS for server-side uploads), otherwise fallback to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function uploadDocument(file: File | Buffer | ArrayBuffer, path: string, contentType?: string) {
  try {
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: contentType || 'application/octet-stream'
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(path)

    return { success: true, url: publicUrl, path: data.path }
  } catch (error) {
    console.error('Error uploading to Supabase:', error)
    return { success: false, error }
  }
}
