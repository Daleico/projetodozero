"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
}

export default function DashboardPage() {
  const [commentId, setCommentId] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/comments');
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handlePullComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentId || parseInt(commentId) < 1 || parseInt(commentId) > 500) {
      setError('Por favor, insira um ID válido entre 1 e 500.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId }),
      });

      const data = await res.json();

      if (res.ok) {
        setCommentId('');
        // Garante a atualização automática da lista
        await fetchComments();
      } else {
        setError(data.error || 'Erro ao puxar comentário.');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/80 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              S
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              SolarGrid Feed
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-300 font-medium hidden sm:block">
              admin@solargrid.com
            </div>
            <button 
              onClick={() => {
                document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
                router.push('/login');
              }}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-600"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Input Card */}
        <div className="glass-panel rounded-2xl p-6 mb-8 border border-slate-700/60 shadow-xl bg-slate-800/40">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            Buscar Novo Comentário
          </h2>
          
          <form onSubmit={handlePullComment} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 font-medium">
                #
              </div>
              <input
                type="number"
                min="1"
                max="500"
                value={commentId}
                onChange={(e) => setCommentId(e.target.value)}
                placeholder="ID (1 a 500)"
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-8 pr-4 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !commentId}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  Puxar para o Feed
                </>
              )}
            </button>
          </form>
          {error && (
            <div className="mt-3 text-red-400 text-sm font-medium flex items-center gap-1.5 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20 inline-flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Feed Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-slate-200">Últimos Comentários</h3>
            <div className="h-px bg-slate-700/80 flex-1"></div>
            <span className="text-xs text-blue-400 font-semibold bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
              {comments.length} capturados
            </span>
          </div>

          {comments.length === 0 ? (
            <div className="text-center py-20 px-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 border-dashed">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-slate-300 font-medium text-lg">Seu feed está vazio</p>
              <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                Utilize o campo acima para buscar comentários na API e construir seu feed de monitoramento social.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {comments.map((comment) => (
                <article 
                  key={comment.id} 
                  className="bg-slate-800/50 hover:bg-slate-800/80 transition-all duration-300 border border-slate-700/60 hover:border-slate-600 rounded-2xl p-5 shadow-sm group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                      {comment.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h4 className="font-semibold text-slate-100 line-clamp-1 group-hover:text-blue-400 transition-colors">
                            {comment.name}
                          </h4>
                          <p className="text-sm text-slate-400 truncate">{comment.email}</p>
                        </div>
                        <span className="text-xs text-slate-500 flex-shrink-0 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-700/50">
                          #{comment.id}
                        </span>
                      </div>
                      
                      <div className="mt-3 bg-slate-900/40 rounded-xl p-4 border border-slate-700/30 text-slate-300 text-sm leading-relaxed">
                        {comment.body}
                      </div>
                      
                      <div className="mt-4 flex gap-6 text-sm text-slate-500 font-medium">
                        <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          Curtir
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Responder
                        </button>
                        <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors ml-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          Compartilhar
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
