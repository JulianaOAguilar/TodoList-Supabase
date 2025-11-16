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

  // ✅ Impede que o evento seja adicionado mais de uma vez
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

    const { error } = await supabase.from('categorias').insert([categoria]);

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

      // 🔄 Atualiza a lista e o select automaticamente
      await atualizarListaCategoria();
    }
  });
}
