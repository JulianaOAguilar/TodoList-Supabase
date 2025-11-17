import { supabase } from "../modules/config.js";
import { atualizarListaCategoria } from "./exibirListaCategorias.js";

let formListenerAdded = false; // ✅ previne duplicação de evento

// criarCategoria: cria o objeto de categoria
export async function criarCategoria() {
  const nome = document.getElementById('nomeCategoria').value.trim();
  return { nome };
}

// adicionarCategoria: adiciona ao Supabase e atualiza a interface
export async function adicionarCategoria() {
  const form = document.getElementById('formCategoria');
  if (!form) {
    console.error("Formulário 'formCategoria' não encontrado.");
    return;
  }

  // Impede que o evento seja adicionado mais de uma vez
  if (formListenerAdded) return;
  formListenerAdded = true;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const categoria = await criarCategoria();

    if (!categoria.nome) {
      await Swal.fire({
        icon: 'warning',
        title: 'Campos obrigatórios',
        text: 'Preencha o nome antes de adicionar.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    // 🔎 PEGAR USER LOGADO
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      console.error("Nenhum usuário logado.");
      return;
    }

    // 🔎 BUSCAR CATEGORIAS EXISTENTES DO USUÁRIO
    const { data: categoriasExistentes, error: erroBusca } = await supabase
      .from("categorias")
      .select("nome")
      .eq("user_id", userId);

    if (erroBusca) {
      console.error("Erro ao buscar categorias:", erroBusca);
      return;
    }

    // ❗ VALIDAÇÃO DE NOME DUPLICADO
    const nomeJaExiste = categoriasExistentes.some(cat =>
      cat.nome.toLowerCase() === categoria.nome.toLowerCase()
    );

    if (nomeJaExiste) {
      await Swal.fire({
        icon: "error",
        title: "Categoria já existe",
        text: "Você já cadastrou uma categoria com esse nome!",
        timer: 2000,
        showConfirmButton: false
      });
      return; // impede o insert
    }

    // 🟢 Se passou pela validação -> Inserir nova categoria
    const { error } = await supabase.from('categorias').insert([{
      nome: categoria.nome,
      user_id: userId
    }]);

    if (error) {
      console.error('Erro ao adicionar categoria:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao adicionar categoria',
        text: 'Verifique as informações e tente novamente.',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      await Swal.fire({
        icon: 'success',
        title: 'Categoria adicionada!',
        text: 'Sua categoria foi salva com sucesso.',
        timer: 1500,
        showConfirmButton: false
      });

      form.reset();

      // Atualiza a lista e select
      await atualizarListaCategoria();
    }
  });
}