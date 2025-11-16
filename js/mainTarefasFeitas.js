
import { deletarTudo, deletarUnitario } from "./modules/delete.js";
import { logoutUi } from "./ui/auth.js";
import { tabelaTarefasConcluidas } from "./ui/carregarTarefas.js";

document.addEventListener('DOMContentLoaded', () => {
    tabelaTarefasConcluidas();
    deletarTudo('tarefa', tabelaTarefasConcluidas)
    logoutUi()
})
