import { SUPABASE_URL, API_KEY } from "./config.js";


export async function buscarCategorias() {

  const res = await fetch(`${SUPABASE_URL}/rest/v1/categorias?select=*&order=nome.asc`, {
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.error("Erro ao buscar categorias:", res.status, res.statusText);
    return [];
  }

  const data = await res.json();
  return data;
}
