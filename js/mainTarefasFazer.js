import { carregarTarefas, tabelaTarefasConcluidas } from "./ui/carregarTarefas.js";
import { deletarTudo } from "./modules/delete.js";


document.addEventListener('DOMContentLoaded', () => {
    deletarTudo('tarefas', async () => {
        await carregarTarefas()
        await tabelaTarefasConcluidas()
    })

})




