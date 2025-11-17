
import { verificaAutentificacao } from "./modules/auth.js";
import { deletarTudo, deletarUnitario } from "./modules/delete.js";
import { logoutUi } from "./ui/auth.js";
import { tabelaTarefasConcluidas } from "./ui/carregarTarefas.js";

document.addEventListener('DOMContentLoaded', () => {
        if (!verificaAutentificacao()) { return }
    tabelaTarefasConcluidas();
    deletarTudo('tarefa', tabelaTarefasConcluidas)
    logoutUi()
})
