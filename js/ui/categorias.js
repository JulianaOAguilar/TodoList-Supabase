import { supabase } from "../modules/config.js";
import { carregarCategorias } from "./carregarCategorias.js";
import { atualizarListaCategoria } from "./exibirListaCategorias.js";

let formListenerAdded = false; // previne duplicação de evento

// Categorias pré-definidas
const categoriasPadrao = ["Trabalho", "Faculdade", "Casa"];

// criarCategoria: cria o objeto de categoria
export async function criarCategoria() {
  const nome = document.getElementById('nomeCategoria').value.trim();
  return { nome };
}

// inserirCategoriasPadrao: insere categorias padrão se ainda não existirem
export async function inserirCategoriasPadrao(userId) {
  // Buscar apenas categorias padrão já existentes
  const { data: categoriasExistentes, error } = await supabase
    .from("categorias")
    .select("nome")
    .eq("user_id", userId)
    .in("nome", categoriasPadrao);

  if (error) {
    console.error("Erro ao buscar categorias existentes:", error);
    return;
  }

  const nomesExistentes = categoriasExistentes.map(cat => cat.nome.toLowerCase());

  // Filtra apenas as que ainda não existem
  const novasCategorias = categoriasPadrao.filter(
    nome => !nomesExistentes.includes(nome.toLowerCase())
  );

  if (novasCategorias.length > 0) {
    const { error: erroInsert } = await supabase
      .from("categorias")
      .insert(novasCategorias.map(nome => ({ nome, user_id: userId })));

    if (erroInsert) console.error("Erro ao inserir categorias padrão:", erroInsert);
  }
}

// adicionarCategoria: adiciona ao Supabase e atualiza a interface
export async function adicionarCategoria() {
  const form = document.getElementById('formCategoria');
  if (!form) {
    console.error("Formulário 'formCategoria' não encontrado.");
    return;
  }

  if (formListenerAdded) return;
  formListenerAdded = true;

  // 🔎 PEGAR USER LOGADO
  const { data: sessionData } = await supabase.auth.getSession();
  const userId = sessionData?.session?.user?.id;

  if (!userId) {
    console.error("Nenhum usuário logado.");
    return;
  }

  // Inserir categorias padrão (somente as que não existem)
  await inserirCategoriasPadrao(userId);

  // Atualiza a lista inicial de categorias
  await atualizarListaCategoria();
  await carregarCategorias();

  // Listener do form
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

    const { data: categoriasExistentes, error: erroBusca } = await supabase
      .from("categorias")
      .select("nome")
      .eq("user_id", userId);

    if (erroBusca) {
      console.error("Erro ao buscar categorias:", erroBusca);
      return;
    }

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
      return;
    }

    const { error } = await supabase.from('categorias').insert([{ nome: categoria.nome, user_id: userId }]);

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
      await atualizarListaCategoria();
      await carregarCategorias();
    }
  });
}
