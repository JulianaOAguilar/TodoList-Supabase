import { SUPABASE_URL, API_KEY } from "./config.js";
import { supabase } from "./config.js";

export async function buscarTarefas() {

  const res = await fetch(`${SUPABASE_URL}/rest/v1/tarefa?select=*&order=data_limite.asc`, {
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

export function dataHoje() {

      const dataLimite = document.getElementById('dataLimite');
    if (!dataLimite) {
        console.warn("Input #dataLimite não encontrado");
        return; 
    }

    const hoje = new Date().toISOString().split("T")[0]; 
    dataLimite.value = hoje;
    dataLimite.setAttribute('min', hoje);
}

export async function alternarFeito(tarefaId) {
    const { error } = await supabase
        .from('tarefa')
        .update({ feito: true })  // marca como feito
        .eq('id', tarefaId);

    if (error) console.error("Erro ao atualizar tarefa:", error);
}

