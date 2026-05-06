"use client";

import { useState, useEffect } from "react";
import { fetchTodosAction, syncTodosAction } from "./actions";

interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  user_name?: string;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterUserId, setFilterUserId] = useState<string>("");

  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTodosAction();
      setTodos(data as Todo[]);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar as tarefas do banco de dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    try {
      const result = await syncTodosAction();
      if (!result.success) {
        throw new Error(result.error);
      }
      // Refetch the data to update the UI
      await fetchTodos();
    } catch (err: any) {
      setError(err.message || "Erro durante a sincronização.");
    } finally {
      setSyncing(false);
    }
  };

  // Filter logic
  const filteredTodos = filterUserId
    ? todos.filter((todo) => todo.userId.toString() === filterUserId)
    : todos;

  // Get unique user IDs and names for the select dropdown
  const uniqueUsers = Array.from(new Map(todos.map((t) => [t.userId, t.user_name || `Usuário ${t.userId}`])).entries()).sort(
    (a, b) => a[0] - b[0]
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header & Sync Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tarefas</h1>
            <p className="text-slate-500 mt-1">Gerencie e sincronize suas tarefas</p>
          </div>
          
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {syncing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sincronizando...
              </>
            ) : (
              "Sincronizar Tarefas"
            )}
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <label htmlFor="user-filter" className="text-sm font-semibold text-slate-700 whitespace-nowrap">
            Filtrar por Usuário:
          </label>
          <select
            id="user-filter"
            value={filterUserId}
            onChange={(e) => setFilterUserId(e.target.value)}
            className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-slate-50 border"
          >
            <option value="">Todos os usuários</option>
            {uniqueUsers.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
            <p className="text-slate-500 font-medium">Carregando tarefas...</p>
          </div>
        ) : (
          /* Todo List */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {filteredTodos.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <p className="text-lg font-medium">Nenhuma tarefa encontrada.</p>
                <p className="mt-1 text-sm">Sincronize os dados ou limpe os filtros para ver as tarefas.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filteredTodos.map((todo) => (
                  <li key={todo.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {todo.completed ? (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                          ) : (
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </span>
                          )}
                        </div>
                        <div>
                          <p className={`text-base font-medium ${todo.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                            {todo.title}
                          </p>
                          <p className="mt-1 text-sm text-slate-500 font-medium">
                            Responsável: <span className="text-slate-700 font-bold">{todo.user_name}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="hidden sm:block">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          todo.completed 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {todo.completed ? 'Concluída' : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        
      </div>
    </div>
  );
}
