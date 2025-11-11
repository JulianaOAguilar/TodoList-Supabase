import { supabase } from "../modules/config.js";
import { alternarFeito } from "../modules/tarefas.js";
import { buscarCategorias } from "../modules/categorias.js";
import { deletarUnitario } from "../modules/delete.js";
import { editar } from "../modules/edit.js";

export async function carregarTarefas() {
  const tbody = document.getElementById("lista-tarefas");
  const botao = document.getElementById("btnSalvar");
  if (!tbody || !botao) return;

  // ✅ Verifica o usuário logado
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) {
    console.warn("Nenhum usuário logado — não é possível carregar tarefas.");
    return;
  }

  // ✅ Busca tarefas pendentes do usuário logado
  const { data: tarefas, error } = await supabase
    .from('tarefa')
    .select('*')
    .eq('feito', false)
    .eq('user_id', session.user.id)
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
      <td class="py-2 border flex space-x-2 px-4">
        <button type="submit" class="editar-btn bg-yellow-400 hover:bg-yellow-600 rounded text-white px-2 py-1 flex items-center justify-center flex-1 btnEditar" data-id="${ta.id}">
          Editar
        </button>
        <button type="submit" class="deletar-btn bg-red-500 hover:bg-red-600 rounded text-white px-2 py-1 flex items-center justify-center flex-1" data-id="${ta.id}">
          Excluir
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // 🔄 Eventos de exclusão e edição
  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('.deletar-btn');
    if (btn) {
      const id = btn.dataset.id;
      await deletarUnitario('tarefa', id, carregarTarefas);
    }

    const btnE = e.target.closest('.editar-btn');
    if (btnE) {
      const id = btnE.dataset.id;
      await editar(id, carregarTarefas);
    }
  });

  // 🔘 Lógica de marcar tarefas como feitas
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

    await carregarTarefas();
    await tabelaTarefasConcluidas();
  });
}

// 🔁 Função para carregar tarefas concluídas (também com filtro do usuário logado)
export async function tabelaTarefasConcluidas() {
  const tbody = document.getElementById("lista-tarefas-feitas");
  if (!tbody) return;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) {
    console.warn("Nenhum usuário logado — não é possível carregar tarefas concluídas.");
    return;
  }

  const { data: tarefas, error } = await supabase
    .from('tarefas')
    .select('*')
    .eq('feito', true)
    .eq('user_id', session.user.id)
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
      <td class="py-2 border flex space-x-2 px-4">
        <button type="submit" class="bg-red-500 deletar-btn hover:bg-red-600 rounded text-white px-2 py-1 flex items-center justify-center flex-1" id="btnExcluir" data-id="${ta.id}">
          Excluir
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.addEventListener('click', async (e) => {
    const btn = e.target.closest('.deletar-btn');
    if (btn) {
      const id = btn.dataset.id;
      await deletarUnitario('tarefas', id, tabelaTarefasConcluidas);
    }
  });
}
