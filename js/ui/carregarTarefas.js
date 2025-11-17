import { supabase } from "../modules/config.js";
import { alternarFeito } from "../modules/tarefas.js";
import { buscarCategorias } from "../modules/categorias.js";
import { deletarUnitario } from "../modules/delete.js";
import { editar } from "../modules/edit.js";

export async function carregarTarefas() {
  const tbody = document.getElementById("lista-tarefas");
  const botao = document.getElementById("btnSalvar");
  if (!tbody || !botao) return;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) return;

  const { data: tarefas, error } = await supabase
    .from("tarefa")
    .select("*")
    .eq("feito", false)
    .eq("user_id", session.user.id)
    .order("data_limite", { ascending: true });

  if (error) return;

  tbody.innerHTML = "";

  if (!tarefas || tarefas.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td class="py-4 text-center text-gray-500" colspan="6">
          Nenhuma tarefa pendente.
        </td>
      </tr>
    `;
    return;
  }

  // Categorias
  const categorias = await buscarCategorias();
  const mapaCategorias = {};
  categorias.forEach((cat) => {
    mapaCategorias[String(cat.id)] = cat.nome;
  });

  // Renderiza cada tarefa
  tarefas.forEach((ta) => {
    const dataFormatada = ta.data_limite
      ? new Date(ta.data_limite).toLocaleDateString("pt-BR", { timeZone: "UTC" })
      : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="py-2 px-4 border-b">${ta.nome}</td>

      <td class="py-2 px-4 border-b">
        ${mapaCategorias[String(ta.categoria_id)] || "Não definida"}
      </td>

      <td class="py-2 px-4 border-b max-w-[150px]">
        <span class="block truncate" title="${ta.descricao || ""}">
          ${ta.descricao || ""}
        </span>
      </td>

      <td class="py-2 px-4 border-b">${dataFormatada}</td>

      <td class="py-2 px-4 border-b text-center">
        <input type="checkbox" data-id="${ta.id}" class="w-5 h-5 tarefa-checkbox"/>
      </td>

      <td class="py-2 border px-4 flex space-x-2">
        <button class="editar-btn bg-teal-300 hover:bg-teal-400 rounded text-white px-2 py-1 flex-1" data-id="${ta.id}">
          Editar
        </button>

        <button class="deletar-btn bg-rose-400 hover:bg-rose-500 rounded text-white px-2 py-1 flex-1" data-id="${ta.id}">
          Excluir
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Eventos: excluir e editar
  tbody.addEventListener("click", async (e) => {
    const del = e.target.closest(".deletar-btn");
    if (del) await deletarUnitario("tarefa", del.dataset.id, carregarTarefas);

    const edit = e.target.closest(".editar-btn");
    if (edit) await editar(edit.dataset.id, carregarTarefas);
  });

  // Checkboxes
  const checkboxes = document.querySelectorAll(".tarefa-checkbox");
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const algumMarcado = Array.from(checkboxes).some((c) => c.checked);
      botao.disabled = !algumMarcado;

      if (algumMarcado) {
        botao.classList.remove("bg-teal-200", "cursor-not-allowed", "opacity-70");
        botao.classList.add("bg-teal-300", "hover:bg-teal-400");
      } else {
        botao.classList.add("bg-teal-200", "cursor-not-allowed", "opacity-70");
        botao.classList.remove("bg-teal-300", "hover:bg-teal-400");
      }
    });
  });

  botao.addEventListener("click", async () => {
    const marcadas = document.querySelectorAll(".tarefa-checkbox:checked");

    for (let c of marcadas) {
      await alternarFeito(c.dataset.id);
    }

    if (marcadas.length > 0) {
      Swal.fire({
        icon: "success",
        title: "Tarefas atualizadas!",
        text: `${marcadas.length} tarefa(s) concluída(s).`,
        timer: 2000,
        showConfirmButton: false,
      });
    }

    await carregarTarefas();
    await tabelaTarefasConcluidas();
  });
}
// ---------------- TABELA DE TAREFAS CONCLUÍDAS -------------------

export async function tabelaTarefasConcluidas() {
  const tbody = document.getElementById("lista-tarefas-feitas");
  if (!tbody) return;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !session.user) return;

  const { data: tarefa, error } = await supabase
    .from("tarefa")
    .select("*")
    .eq("feito", true)
    .eq("user_id", session.user.id)
    .order("data_limite", { ascending: false });

  tbody.innerHTML = "";

  // 👉 Se não tiver nada concluído
  if (!tarefa || tarefa.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td class="py-4 text-center text-gray-500" colspan="5">
          Nenhuma tarefa concluída.
        </td>
      </tr>
    `;
    return;
  }

  const categorias = await buscarCategorias();
  const mapaCategorias = {};
  categorias.forEach((cat) => {
    mapaCategorias[String(cat.id)] = cat.nome;
  });

  tarefa.forEach((ta) => {
    const dataFormatada = ta.data_limite
      ? new Date(ta.data_limite).toLocaleDateString("pt-BR")
      : "";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="py-2 px-4 border-b">${ta.nome}</td>

      <td class="py-2 px-4 border-b">
        ${mapaCategorias[String(ta.categoria_id)] || "Não definida"}
      </td>

      <td class="py-2 px-4 border-b max-w-[150px]">
        <span class="block truncate" title="${ta.descricao}">
          ${ta.descricao}
        </span>
      </td>

      <td class="py-2 px-4 border-b">${dataFormatada}</td>

      <td class="py-2 border px-4">
        <button class="deletar-btn bg-red-500 hover:bg-red-600 rounded text-white px-2 py-1 w-full" data-id="${ta.id}">
          Excluir
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest(".deletar-btn");
    if (btn) await deletarUnitario("tarefa", btn.dataset.id, tabelaTarefasConcluidas);
  });
}
