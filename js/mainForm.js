import { verificaAutentificacao } from "./modules/auth.js";
import { dataHoje } from './modules/tarefas.js';
import { logoutUi } from './ui/auth.js';
import { carregarCategorias } from './ui/carregarCategorias.js';
import { adicinarTarefa } from './ui/tarefas.js';

document.addEventListener('DOMContentLoaded', () => {
        if (!verificaAutentificacao()) { return }
    dataHoje()
    carregarCategorias()
    adicinarTarefa()
    logoutUi()
})

