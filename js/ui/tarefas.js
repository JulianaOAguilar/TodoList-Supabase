
export async function adicionarTarefa() {

    const nome = document.getElementById('nomeTarefa').value
    let descricao = document.getElementById('descricaoTarefa').value
    const dataLimite = document.getElementById('dataLimite').value


    const tarefa = {
        nome,
        descricao,
        data_limite: dataLimite,
        feito: false
    };

    return tarefa;
}

