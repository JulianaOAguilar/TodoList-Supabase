import { supabase } from "../modules/config.js";

export async function buscarCategorias() {
  // 🧠 Passo 2 — verificar se há usuário logado
  const { data: { session } } = await supabase.auth.getSession();
  console.log("Usuário logado:", session?.user?.id);

  // Se não houver usuário logado, retorna vazio
  if (!session || !session.user) {
    console.warn("Nenhum usuário logado — não é possível buscar categorias.");
    return [];
  }

  // Busca categorias do usuário atual
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('user_id', session.user.id); // ← garante que são só as do usuário

  if (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }

  console.log("Categorias encontradas:", data);
  return data || [];
}
