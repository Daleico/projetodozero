import { NextResponse } from 'next/server';
import { syncAllData } from '@/services/db';

export async function POST() {
  try {
    const API_BASE = process.env.JSONPLACEHOLDER_API_URL || 'https://jsonplaceholder.typicode.com';

    // 1. Fazer as 3 requisições simultaneamente
    const [usersRes, postsRes, commentsRes] = await Promise.all([
      fetch(`${API_BASE}/users`),
      fetch(`${API_BASE}/posts`),
      fetch(`${API_BASE}/comments`)
    ]);

    if (!usersRes.ok || !postsRes.ok || !commentsRes.ok) {
      throw new Error('Falha ao buscar dados das APIs externas');
    }

    const rawUsers = await usersRes.json();
    const rawPosts = await postsRes.json();
    const rawComments = await commentsRes.json();

    // 2. Mapear os dados para o formato estrito das 3 tabelas
    const users = rawUsers.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email
    }));

    const posts = rawPosts.map((p: any) => ({
      id: p.id,
      user_id: p.userId,
      title: p.title,
      body: p.body
    }));

    const comments = rawComments.map((c: any) => ({
      id: c.id,
      post_id: c.postId,
      user_name: c.name, // JSONPlaceholder "name" field
      user_email: c.email,
      comment_body: c.body
    }));

    // 3. Sincronizar (Upsert) no Supabase respeitando as relações
    await syncAllData(users, posts, comments);

    return NextResponse.json({ 
      success: true, 
      message: 'Sincronização relacional concluída com sucesso!' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/sync:', error);
    return NextResponse.json(
      { error: 'Falha ao sincronizar dados em massa' },
      { status: 500 }
    );
  }
}
