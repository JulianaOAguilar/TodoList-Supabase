
import { dataHoje } from './modules/tarefas.js';
import { carregarCategorias } from './ui/carregarCategorias.js';
import { adicinarTarefa } from './ui/tarefas.js';

document.addEventListener('DOMContentLoaded', () => {
    dataHoje()
    carregarCategorias()
    adicinarTarefa()
    
})

