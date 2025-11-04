
export async function adicionarTarefa() {

    const nome = document.getElementById('nomeTarefa').value
    const descricao = document.getElementById('descricaoTarefa').value
    const dataLimite = document.getElementById('dataLimite').value
    const categoria = document.getElementById('categoria').value


    const tarefa = {
        nome,
        descricao,
        data_limite: dataLimite,
        feito: false,
        categoria_id: categoria
    };

    return tarefa;
}

