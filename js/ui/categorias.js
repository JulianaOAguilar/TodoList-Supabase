import { supabase } from "../modules/config.js";

// funções
// criarCategoria: (cria um objeto categoria de acordo com o preenchimento do forms)
// adicionarCategoria: Adiciona a categoria ao supabase

export async function criarCategoria() {
    const nome = document.getElementById('nomeCategoria').value
    const categoria = {
        nome
    };
    return categoria;
}

export async function adicionarCategoria() {

    const form = document.getElementById('formCategoria');

    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const categoria = await criarCategoria();

        if (!categoria.nome) {
            await Swal.fire({
                icon: 'warning',
                title: 'Campos obrigatórios',
                text: 'Preencha o nome antes de adicionar.',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        const { data, error } = await supabase.from('categorias').insert([categoria]);

        if (error) {
            console.error('Erro ao adicionar categoria:', error);
            await Swal.fire({
                icon: 'error',
                title: 'Erro ao adicionar categoria',
                text: 'Verifique as informações e tente novamente.',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            await Swal.fire({
                icon: 'success',
                title: 'Categoria adicionada!',
                text: 'Sua categoria foi salva com sucesso.',
                timer: 1500,
                showConfirmButton: false
            })

            form.reset()

        }
    })
}


