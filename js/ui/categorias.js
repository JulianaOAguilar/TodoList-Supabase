import { supabase } from "../modules/config.js";

export async function criarCategoria() {
  const nome = document.getElementById('nomeCategoria').value.trim();
  return { nome };
}

export async function adicionarCategoria() {
  const form = document.getElementById('formCategoria');

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

    // ✅ Garante que o usuário logado será associado à categoria
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error("Usuário não autenticado!");
      await Swal.fire({
        icon: 'error',
        title: 'Erro de autenticação',
        text: 'Faça login antes de adicionar categorias.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    const userId = session.user.id;

    // Adiciona categoria com o user_id
    const { data, error } = await supabase
      .from('categorias')
      .insert([{ ...categoria, user_id: userId }]);

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
    }
  });
}