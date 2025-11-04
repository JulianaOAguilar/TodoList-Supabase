import { supabase } from "../modules/config.js";
import { alternarFeito } from "../modules/tarefas.js";


// Carrega tarefas a fazer

export async function carregarTarefas() {
    const tbody = document.getElementById("lista-tarefas");
    const botao = document.getElementById("btnSalvar");
    if (!tbody || !botao) return;

    const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .eq('feito', false)
        .order('data_limite', { ascending: true });

    if (error) {
        console.error("Erro ao buscar tarefas:", error);
        return;
    }

    tbody.innerHTML = '';


    data.forEach(ta => {
        const dataFormatada = ta.data_limite
            ? new Date(ta.data_limite).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
            : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="py-2 px-4 border-b">${ta.nome}</td>
            <td class="py-2 px-4 border-b truncate max-w-[400px]" title="${ta.descricao}">
    ${ta.descricao}
  </td>
            <td class="py-2 px-4 border-b">${dataFormatada}</td>
            <td class="py-2 px-4 border-b text-center">
                <input type="checkbox" data-id="${ta.id}" class="w-5 h-5 tarefa-checkbox" />
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Ativa/desativa botão e adiciona evento de click
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
    
        // Recarrega tabelas após atualização
        await carregarTarefas();
        await tabelaTarefasConcluidas();
    });
}

// ------------------------
// Tabela de tarefas concluídas
// ------------------------
export async function tabelaTarefasConcluidas() {
    const tbody = document.getElementById("lista-tarefas-feitas");
    if (!tbody) return;

    const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .eq('feito', true)
        .order('data_limite', { ascending: false });

    if (error) {
        console.error("Erro ao buscar tarefas concluídas:", error);
        return;
    }

    tbody.innerHTML = '';

    data.forEach(ta => {
        const dataFormatada = ta.data_limite
            ? new Date(ta.data_limite).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
            : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="py-2 px-4 border-b">${ta.nome}</td>
            <td class="py-2 px-4 border-b">${ta.descricao}</td>
            <td class="py-2 px-4 border-b">${dataFormatada}</td>
        `;
        tbody.appendChild(tr);
    });
}

