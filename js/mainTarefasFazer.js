import { carregarTarefas } from "./ui/carregarTarefas.js";
import {deletar} from "./modules/delete.js"


document.addEventListener('DOMContentLoaded', () => {
    deletar()
    carregarTarefas()

})




