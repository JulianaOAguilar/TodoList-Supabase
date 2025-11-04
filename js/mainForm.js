import { adicionarTarefa } from './ui/tarefas.js';
import { supabase } from './modules/config.js';
import { carregarTarefas } from './ui/carregarTarefas.js'; // <- para atualizar a lista após inserir

const form = document.getElementById('formTarefa');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const tarefa = await adicionarTarefa();

  // 🔹 Validação simples antes de enviar
  if (!tarefa || !tarefa.nome || !tarefa.data_limite) {
    await Swal.fire({
      icon: 'warning',
      title: 'Campos obrigatórios',
      text: 'Preencha o nome e a data limite antes de adicionar.',
      timer: 2000,
      showConfirmButton: false
    });
    return;
  }

  // 🔹 Envia tarefa para o Supabase
  delete tarefa.id;
  const { data, error } = await supabase.from('tarefas').insert([tarefa]);

  if (error) {
    console.error('Erro ao adicionar tarefa:', error);
    await Swal.fire({
      icon: 'error',
      title: 'Erro ao adicionar tarefa',
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
