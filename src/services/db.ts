import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function saveComment(name: string, email: string, body: string) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ name, email, body }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    
    return data;
  } catch (error) {
    console.error('Error saving comment:', error);
    throw new Error('Failed to save comment to database');
  }
}

export async function getComments() {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('id, name, email, body')
      .order('id', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw new Error('Failed to fetch comments from database');
  }
}
