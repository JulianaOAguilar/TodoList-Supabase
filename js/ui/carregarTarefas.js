import { supabase } from "../modules/config.js";
import { alternarFeito } from "../modules/tarefas.js";
import { buscarCategorias } from "../modules/categorias.js";

// ------------------------
// Função para carregar tarefas pendentes
// ------------------------
export async function carregarTarefas() {
    const tbody = document.getElementById("lista-tarefas");
    const botao = document.getElementById("btnSalvar");
    if (!tbody || !botao) return;

    // Busca tarefas pendentes
    const { data: tarefas, error } = await supabase
        .from('tarefas')
        .select('*')
        .eq('feito', false)
        .order('data_limite', { ascending: true });

    if (error) {
        console.error("Erro ao buscar tarefas:", error);
        return;
    }

    tbody.innerHTML = '';

    // Busca categorias e cria mapa id -> nome
    const categorias = await buscarCategorias();
    const mapaCategorias = {};
    categorias.forEach(cat => {
        mapaCategorias[String(cat.id)] = cat.nome;
    });

    // Preenche a tabela com tarefas
    tarefas.forEach(ta => {
        const dataFormatada = ta.data_limite
            ? new Date(ta.data_limite).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
            : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="py-2 px-4 border-b">${ta.nome}</td>
            <td class="py-2 px-4 border-b">${mapaCategorias[String(ta.categoria_id)] || 'Não definida'}</td>
            <td class="py-2 px-4 border-b truncate max-w-[400px]" title="${ta.descricao}">${ta.descricao}</td>
            <td class="py-2 px-4 border-b">${dataFormatada}</td>
            <td class="py-2 px-4 border-b text-center">
                <input type="checkbox" data-id="${ta.id}" class="w-5 h-5 tarefa-checkbox" />
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Ativa/desativa botão "Salvar" com base nos checkboxes
    const checkboxes = document.querySelectorAll('.tarefa-checkbox');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const algumMarcado = Array.from(checkboxes).some(c => c.checked);
            botao.disabled = !algumMarcado;

            if (algumMarcado) {
                botao.classList.remove("bg-gray-400", "cursor-not-allowed", "opacity-70");
                botao.classList.add("bg-blue-600", "hover:bg-blue-700", "cursor-pointer", "opacity-100");
            } else {
                botao.classList.add("bg-gray-400", "cursor-not-allowed", "opacity-70");
                botao.classList.remove("bg-blue-600", "hover:bg-blue-700", "cursor-pointer", "opacity-100");
            }
        });
    });

    // Evento do botão "Salvar"
    botao.addEventListener('click', async () => {
        const checkedBoxes = document.querySelectorAll('.tarefa-checkbox:checked');
        for (let checkbox of checkedBoxes) {
            const tarefaId = checkbox.dataset.id;
            if (!tarefaId) continue;
            await alternarFeito(tarefaId);
        }

        if (checkedBoxes.length > 0) {
            Swal.fire({
                icon: 'success',
                title: 'Tarefas atualizadas!',
                text: `${checkedBoxes.length} tarefa(s) concluída(s).`,
                timer: 2000,
                showConfirmButton: false
            });
        }

        // Recarrega as tabelas após atualização
        await carregarTarefas();
        await tabelaTarefasConcluidas();
    });
}

// ------------------------
// Função para carregar tarefas concluídas
// ------------------------
export async function tabelaTarefasConcluidas() {
    const tbody = document.getElementById("lista-tarefas-feitas");
    if (!tbody) return;

    const { data: tarefas, error } = await supabase
        .from('tarefas')
        .select('*')
        .eq('feito', true)
        .order('data_limite', { ascending: false });

    if (error) {
        console.error("Erro ao buscar tarefas concluídas:", error);
        return;
    }

    tbody.innerHTML = '';

    const categorias = await buscarCategorias();
    const mapaCategorias = {};
    categorias.forEach(cat => {
        mapaCategorias[String(cat.id)] = cat.nome;
    });

    tarefas.forEach(ta => {
        const dataFormatada = ta.data_limite
            ? new Date(ta.data_limite).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
            : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="py-2 px-4 border-b">${ta.nome}</td>
            <td class="py-2 px-4 border-b">${mapaCategorias[String(ta.categoria_id)] || 'Não definida'}</td>
            <td class="py-2 px-4 border-b">${ta.descricao}</td>
            <td class="py-2 px-4 border-b">${dataFormatada}</td>
        `;
        tbody.appendChild(tr);
    });
}
