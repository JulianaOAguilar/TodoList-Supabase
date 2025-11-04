import { SUPABASE_URL, API_KEY } from "./config.js";
import { supabase } from "./config.js";

export async function buscarTarefas() {

  const res = await fetch(`${SUPABASE_URL}/rest/v1/tarefas?select=*&order=data_limite.asc`, {
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error("Erro ao buscar tarefas:", res.status, res.statusText);
    return [];
  }

  const data = await res.json();
  return data;
}


export async function alternarFeito(tarefaId) {
    const { error } = await supabase
        .from('tarefas')
        .update({ feito: true })  // marca como feito
        .eq('id', tarefaId);

    if (error) console.error("Erro ao atualizar tarefa:", error);
}

