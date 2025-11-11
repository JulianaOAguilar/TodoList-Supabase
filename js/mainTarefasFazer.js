import { deletarTudo, deletarUnitario } from "./modules/delete.js";
import { carregarTarefas } from "./ui/carregarTarefas.js";

document.addEventListener('DOMContentLoaded', () => {
    deletarTudo('tarefas', carregarTarefas)
})




