import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (email === 'admin@solargrid.com' && password === 'admin123') {
      const response = NextResponse.json(
        { success: true, message: 'Autenticado com sucesso' },
        { status: 200 }
      );
      
      // Define o cookie de sessão
      response.cookies.set({
        name: 'session',
        value: 'authenticated_admin_session',
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 dia
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Credenciais inválidas' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
