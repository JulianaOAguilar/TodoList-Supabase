import { adicionarCategoria } from "./ui/categorias.js";
import { supabase } from "./modules/config.js";
import { carregarTarefas } from "./ui/carregarTarefas.js";
import { deletarTudo } from "./modules/delete.js";


const form = document.getElementById('formCategoria');

form.addEventListener('submit', async (e) => {
  e.preventDefault();


  const categoria = await adicionarCategoria();

  // 🔹 Validação simples antes de enviar
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


  const { data, error } = await supabase.from('categorias').insert([categoria]);

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
      title: 'Tarefa adicionada!',
      text: 'Sua tarefa foi salva com sucesso.',
      timer: 1500,
      showConfirmButton: false
    });

    form.reset(); // 🔹 Limpa os campos

    // 🔹 Atualiza a lista de tarefas automaticamente
    await carregarTarefas();
  }
});

document.addEventListener('DOMContentLoaded', () => {
    deletarTudo('categorias', async () => {
        await carregarTarefas()
    })

})

