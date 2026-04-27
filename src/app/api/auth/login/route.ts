import { NextResponse } from 'next/server';
import { supabase } from '@/services/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Tenta autenticar usando o Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error && data.user) {
      const response = NextResponse.json(
        { success: true, message: 'Autenticado com sucesso' },
        { status: 200 }
      );
      
      // Define o cookie de sessão para o Middleware continuar funcionando
      response.cookies.set({
        name: 'session',
        value: 'authenticated_user_session', // Mantemos compatível com o middleware atual
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 dia
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: error?.message || 'Credenciais inválidas' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
