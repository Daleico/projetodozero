import { NextResponse } from 'next/server';
import { saveComment, getComments } from '@/services/db';

export async function GET() {
  try {
    const comments = await getComments();
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error('Error in GET /api/comments:', error);
    return NextResponse.json(
      { error: 'Falha ao buscar os comentários' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'O ID do comentário é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar na JSONPlaceholder
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Comentário não encontrado na API externa' },
          { status: 404 }
        );
      }
      throw new Error(`Erro da API externa: ${response.status}`);
    }

    const data = await response.json();
    
    // Extrair os campos relevantes e salvar no banco de dados
    const savedComment = await saveComment(data.name, data.email, data.body);

    return NextResponse.json(savedComment, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/comments:', error);
    return NextResponse.json(
      { error: 'Falha ao processar e salvar o comentário' },
      { status: 500 }
    );
  }
}
