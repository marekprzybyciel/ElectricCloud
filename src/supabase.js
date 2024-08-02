import {createClient} from '@supabase/supabase-js'

export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
);

export const fetchPoints = async () => await supabase
    .from('charging_points')
    .select(`
      *
    `)