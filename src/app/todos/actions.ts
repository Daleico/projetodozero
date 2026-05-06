"use server";

import { supabase } from "@/services/db";

export async function fetchTodosAction() {
  const { data: todosData, error: todosError } = await supabase
    .from("todos")
    .select("*")
    .order("id", { ascending: true });

  if (todosError) {
    throw new Error(`Erro no banco: ${todosError.message}`);
  }

  // Busca os nomes dos usuários
  const { data: usersData, error: usersError } = await supabase
    .from("users")
    .select("id, name");

  const userMap = new Map();
  if (!usersError && usersData) {
    usersData.forEach((u) => userMap.set(u.id, u.name));
  }

  // Anexa o nome do usuário a cada tarefa
  const enrichedTodos = (todosData || []).map((todo) => ({
    ...todo,
    user_name: userMap.get(todo.userId) || `Usuário ${todo.userId}`,
  }));

  return enrichedTodos;
}

export async function syncTodosAction() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (!response.ok) {
      throw new Error("Erro ao buscar da API externa.");
    }
    const apiTodos = await response.json();

    const { error: upsertError } = await supabase
      .from("todos")
      .upsert(apiTodos, { onConflict: "id" });

    if (upsertError) {
      throw new Error(`Erro no Supabase: ${upsertError.message}`);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro desconhecido" };
  }
}
