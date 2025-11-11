import { supabase } from "../modules/config.js";
import { buscarCategorias } from "../modules/categorias.js";


export async function editar(id, callbackRecarregar) {

    const { data: tarefa, error } = await supabase
        .from("tarefa")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !tarefa) {
        console.error("Erro ao buscar tarefa:", error);
        Swal.fire("Erro!", "Não foi possível carregar a tarefa.", "error");
        return;
    }

    const categorias = await buscarCategorias();
    const opcoes = categorias
        .map(cat => `<option value="${cat.id}" ${cat.id === tarefa.categoria_id ? "selected" : ""}>${cat.nome}</option>`)
        .join("");

    const { value: formValues } = await Swal.fire({
        title: "✏️ Editar Tarefa", // forms de edição
        html: ` 
    <div class="flex flex-col gap-3 text-left text-sm text-gray-700">
        <div class="flex flex-col">
                <label for="nome" class="font-semibold mb-1">Nome</label>
                <input id="nome" class="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Digite o nome da tarefa" value="${tarefa.nome}">
            </div>

        <div class="flex flex-col">
            <label for="descricao" class="font-semibold mb-1">Descrição</label>
            <textarea id="descricao" class="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-sm h-20 resize-none" placeholder="Descreva a tarefa...">${tarefa.descricao || ""}</textarea>
        </div>

        <div class="flex flex-col">
            <label for="categoria" class="font-semibold mb-1">Categoria</label>
            <select id="categoria" class="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-sm">
            ${opcoes}
            </select>
        </div>
        <div class="flex flex-col">
            <label for="data" class="font-semibold mb-1">Data limite</label>
            <input id="data" type="date" class="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 text-sm" value="${tarefa.data_limite ? tarefa.data_limite.split("T")[0] : ""}">
        </div>

    </div>
  `,
        background: "#f9fafb",
        color: "#111827",
        confirmButtonText: "💾 Salvar alterações",
        cancelButtonText: "Cancelar",
        showCancelButton: true,
        focusConfirm: false,
        customClass: {
            popup: "rounded-2xl shadow-xl border border-gray-200 max-w-md",
            confirmButton: "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg",
            cancelButton: "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg",
        },
        preConfirm: () => {
            const nome = document.getElementById("nome").value.trim();
            const descricao = document.getElementById("descricao").value.trim();
            const categoria_id = document.getElementById("categoria").value;
            const data_limite = document.getElementById("data").value;

            if (!nome) {
                Swal.showValidationMessage("⚠️ O nome da tarefa é obrigatório!");
                return false;
            }

            return { nome, descricao, categoria_id, data_limite };
        },
    });

    if (!formValues) return;

    const { error: updateError } = await supabase
        .from("tarefa")
        .update({
            nome: formValues.nome,
            descricao: formValues.descricao,
            categoria_id: formValues.categoria_id,
            data_limite: formValues.data_limite,
        })
        .eq("id", id);

    if (updateError) {
        console.error("Erro ao atualizar tarefa:", updateError);
        Swal.fire("Erro!", "Não foi possível atualizar a tarefa.", "error");
        return;
    }

    Swal.fire({
        icon: "success",
        title: "Tarefa atualizada!",
        timer: 1500,
        showConfirmButton: false,
    });

    if (typeof callbackRecarregar === "function") {
        await callbackRecarregar();
    }
}