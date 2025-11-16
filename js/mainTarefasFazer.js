
import { deletarTudo, deletarUnitario } from "./modules/delete.js";
import { logoutUi } from "./ui/auth.js";
import { carregarTarefas } from "./ui/carregarTarefas.js";

document.addEventListener('DOMContentLoaded', () => {
    deletarTudo('tarefa', carregarTarefas)
    logoutUi()
    carregarTarefas()
})




