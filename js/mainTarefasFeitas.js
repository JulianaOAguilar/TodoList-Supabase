
import { logoutUi } from "./ui/auth.js";
import { tabelaTarefasConcluidas, } from "./ui/carregarTarefas.js";

document.addEventListener('DOMContentLoaded', () => {
    tabelaTarefasConcluidas();
    logoutUi()
})
