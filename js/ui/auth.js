import { login, logout, signup } from "../modules/auth.js";

export function loginUi() {

    const form = document.getElementById("formLogin");
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Erro de login',
                text: 'É obrigatório informar o email e a senha para fazer o login',
                confirmButtonText: 'Tentar novamente'
            });
            return;
        }

        try {
            await login(email, password);

            await Swal.fire({
                icon: 'success',
                title: 'Login bem sucedido!',
                text: 'Redirecionando para o formulário...',
                showConfirmButton: false, 
                timer: 1500
            });

            window.location.href = '/pages/formTarefa.html';
        } catch (err) {
            console.error("Erro ao fazer login:", err);
            Swal.fire({
                icon: 'error',
                title: 'Falha no login',
                text: 'Verifique suas credenciais e tente novamente.',
                confirmButtonText: 'Tentar novamente'
            })
        }
    })
}

export function logoutUi() {
    document.getElementById("btnLogout").addEventListener('click', logout)
}


export function signUpUi() {

    const form = document.getElementById("formRegister");
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Erro de Cadastro',
                text: 'É obrigatório informar o email e a senha para fazer o cadastro',
                confirmButtonText: 'Tentar novamente'
            });


            if (password < 6) {

            }
        }

        try {
            await signup(email, password);

            await Swal.fire({
                icon: 'success',
                title: 'Cadastro bem sucedido!',
                text: 'Redirecionando para o formulário...',
                showConfirmButton: false, 
                timer: 1500
            });

            window.location.href = '/pages/formTarefa.html';
        } catch (err) {
            console.error("Erro ao fazer login:", err);
            Swal.fire({
                icon: 'error',
                title: 'Falha no cadastro',
                text: 'Verifique suas credenciais e tente novamente.',
                confirmButtonText: 'Tentar novamente'
            })
        }
    })
}




