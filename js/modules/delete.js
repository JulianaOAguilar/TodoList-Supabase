import { supabase } from "../modules/config.js";
import { carregarTarefas, tabelaTarefasConcluidas } from "../ui/carregarTarefas.js";

// essa função deve ser removida depois, só usei pra limpar o banco 


export async function deletar() {
  const btnExcluir = document.getElementById('btnDelete');


  btnExcluir.addEventListener('click', async () => {
    // confirmação personalizada
      const { isConfirmed } = await Swal.fire({
      title: '⚠️ Atenção!',
      text: 'Tem certeza que deseja apagar TODAS as tarefas?\nEsta ação não pode ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, apagar tudo!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    });
    if (!isConfirmed) return; // se o usuário cancelar, nada acontece

    const { error } = await supabase
      .from('tarefas')
      .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // truque pra deletar tudo
 // deleta todas as tarefas

    
    if (error) {
      console.error("Erro ao deletar todas as tarefas:", error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Não foi possível apagar as tarefas.',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Tarefas apagadas!',
        text: 'Todas as tarefas foram deletadas com sucesso.',
        timer: 2000,
        showConfirmButton: false
      });

      // 🔹 Recarrega a lista de tarefas (opcional)
       await carregarTarefas();
       await tabelaTarefasConcluidas();
    
    }
  });
}
