"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Comment {
  id: number;
  user_name: string;
  user_email: string;
  comment_body: string;
}

interface Post {
  id: number;
  title: string;
  body: string;
  users: {
    name: string;
    email: string;
  };
  comments: Comment[];
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchFeed = async () => {
    try {
      const res = await fetch(`/api/feed?t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Failed to fetch feed', err);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleSyncData = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
      });

      const data = await res.json();

      if (res.ok) {
        await fetchFeed();
      } else {
        setError(data.error || 'Erro ao sincronizar dados.');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado durante a sincronização.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/80 sticky top-0 z-20 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Sync Card */}
        <div className="glass-panel rounded-2xl p-6 mb-10 border border-slate-700/60 shadow-xl bg-slate-800/40">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            Sincronização Relacional Completa
          </h2>
          
          <form onSubmit={handleSyncData} className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  Localizar Novos Comentários
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
        <div className="space-y-10">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-bold text-slate-100">Social Feed</h3>
            <div className="h-px bg-slate-700/80 flex-1"></div>
            <span className="text-xs text-blue-400 font-bold bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {posts.length} Posts
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 px-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 border-dashed">
              <p className="text-slate-300 font-medium text-lg">Nenhum post encontrado</p>
              <p className="text-slate-500 text-sm mt-1">Clique no botão de sincronização para popular o banco.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-slate-800/40 border border-slate-700/60 rounded-2xl overflow-hidden shadow-xl"
                >
                  {/* Post Header */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {post.users?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 text-lg">{post.users?.name || 'Autor Desconhecido'}</h4>
                        <p className="text-xs text-slate-500">{post.users?.email}</p>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-extrabold text-white mb-3 leading-tight uppercase tracking-tight">
                      {post.title}
                    </h2>
                    <p className="text-slate-300 leading-relaxed text-base">
                      {post.body}
                    </p>
                  </div>

                  {/* Comments Section */}
                  <div className="bg-slate-900/60 border-t border-slate-700/60 p-6">
                    <div className="flex items-center gap-2 mb-4 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-bold uppercase tracking-widest">{post.comments?.length || 0} Comentários</span>
                    </div>
                    
                    <div className="space-y-4">
                      {post.comments?.map((comment) => (
                        <div 
                          key={comment.id} 
                          className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4 transition-all hover:bg-slate-800/80"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-bold text-blue-400">{comment.user_name}</span>
                            <span className="text-[10px] text-slate-500 bg-slate-900/50 px-2 py-0.5 rounded border border-slate-700/50">
                              {comment.user_email}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 leading-snug">
                            {comment.comment_body}
                          </p>
                        </div>
                      ))}
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
