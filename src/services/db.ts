import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function syncAllData(users: any[], posts: any[], comments: any[]) {
  try {
    // 1. Upsert Users
    const { error: usersError } = await supabase
      .from('users')
      .upsert(users, { onConflict: 'id' });
    if (usersError) throw new Error(`Users sync error: ${usersError.message}`);

    // 2. Upsert Posts
    const { error: postsError } = await supabase
      .from('posts')
      .upsert(posts, { onConflict: 'id' });
    if (postsError) throw new Error(`Posts sync error: ${postsError.message}`);

    // 3. Upsert Comments
    const { error: commentsError } = await supabase
      .from('comments')
      .upsert(comments, { onConflict: 'id' });
    if (commentsError) throw new Error(`Comments sync error: ${commentsError.message}`);

    return true;
  } catch (error) {
    console.error('Error syncing all data:', error);
    throw new Error('Failed to sync data to database');
  }
}

export async function getFeed() {
  try {
    // Busca focada em posts, trazendo o autor (users) e os comentários (comments)
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (
          name,
          email
        ),
        comments (
          id,
          user_name,
          user_email,
          comment_body
        )
      `)
      .order('id', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching feed:', error);
    throw new Error('Failed to fetch feed from database');
  }
}
