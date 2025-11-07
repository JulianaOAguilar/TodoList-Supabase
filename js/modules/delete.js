import { supabase } from "../modules/config.js";
import { carregarTarefas, tabelaTarefasConcluidas } from "../ui/carregarTarefas.js";

//deletar unitariamente cada item
export async function deletarUnitario(nomeTabela, id, callbackRecarregar) {

    const { isConfirmed } = await Swal.fire({
      title: '⚠️ Atenção!',
      text: `Tem certeza que deseja apagar essa tarefa da tabela "${nomeTabela}"?\nEsta ação não pode ser desfeita!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });
    if (!isConfirmed) return;

    const { error } = await supabase
      .from(nomeTabela)
      .delete()
      .eq('id', id);


    if (error) {
      console.error(`Erro ao deletar tarefa da tabela ${nomeTabela}:`, error);
      await Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `Não foi possível apagar essa tarefa de ${nomeTabela}.`,
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      await Swal.fire({
        icon: 'success',
        title: 'Tarefa apagada',
        text: `A tarefa da "${nomeTabela}" foi deletada com sucesso.`,
        timer: 2000,
        showConfirmButton: false
      });

      // Se foi passada uma função de recarregamento, chama ela
      if (typeof callbackRecarregar === 'function') {
        await callbackRecarregar();
      }
    }
  ;
}

//deleta todos os itens da tabela
export async function deletarTudo(nomeTabela, callbackRecarregar) {
  const btnExcluir = document.getElementById('btnDelete'); // mudar isso pra lá

  if (!btnExcluir) {
    console.error("Botão de exclusão (#btnDelete) não encontrado.");
    return;
  }

  btnExcluir.addEventListener('click', async () => {
    const { isConfirmed } = await Swal.fire({
      title: '⚠️ Atenção!',
      text: `Tem certeza que deseja apagar TODOS os registros da tabela "${nomeTabela}"?\nEsta ação não pode ser desfeita!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, apagar tudo!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });

    if (!isConfirmed) return;

    const { error } = await supabase
      .from(nomeTabela)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // truque pra deletar tudo

    if (error) {
      console.error(`Erro ao deletar tudo da tabela ${nomeTabela}:`, error);
      await Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: `Não foi possível apagar os registros de ${nomeTabela}.`,
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      await Swal.fire({
        icon: 'success',
        title: 'Registros apagados!',
        text: `Todos os registros de "${nomeTabela}" foram deletados com sucesso.`,
        timer: 2000,
        showConfirmButton: false
      });

      // Se foi passada uma função de recarregamento, chama ela
      if (typeof callbackRecarregar === 'function') {
        await callbackRecarregar();
      }
    }
  });
  // recarrega tabela
  await carregarTarefas();
  await tabelaTarefasConcluidas();
}
