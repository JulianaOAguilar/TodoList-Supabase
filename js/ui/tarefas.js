import { supabase } from "../modules/config.js"
import { carregarTarefas } from "./carregarTarefas.js"
import { dataHoje } from "../modules/tarefas.js"

// funções
// criarTarefa: (cria um objeto tarefa de acordo com o preenchimento do forms)
// adicionarTarefa: Adiciona a tarefa ao supabase


export async function criarTarefa() {
    const nome = document.getElementById('nomeTarefa').value
    const descricao = document.getElementById('descricaoTarefa').value
    const dataLimite = document.getElementById('dataLimite').value
    const categoria = document.getElementById('categoria').value

    const tarefa = {
        nome,
        descricao,
        data_limite: dataLimite,
        feito: false,
        categoria_id: categoria
    };

    return tarefa;
}


export async function adicionarTarefa() {
const form = document.getElementById('formTarefa');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const tarefa = await criarTarefa();

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
  const { data, error } = await supabase.from('tarefa').insert([tarefa]);

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

    console.log("tarefa adicionada")
    // 🔹 Atualiza a lista de tarefas automaticamente
    await carregarTarefas();
     dataHoje()
  }
});
}




