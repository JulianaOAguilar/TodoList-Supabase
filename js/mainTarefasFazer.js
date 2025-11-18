
import { deletarTudo, deletarUnitario } from "./modules/delete.js";
import { logoutUi } from "./ui/auth.js";
import { carregarTarefas } from "./ui/carregarTarefas.js";
import { verificaAutentificacao } from "./modules/auth.js";

document.addEventListener('DOMContentLoaded', () => {
    if (!verificaAutentificacao()) { return }
    deletarTudo('tarefa', carregarTarefas)
    logoutUi()
    carregarTarefas()
})




