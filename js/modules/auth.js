import {SUPABASE_URL, API_KEY} from './config.js'


export async function login(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, { // vai para esse link usando o fetch 
            method: 'POST', //fazer uma requisição API para obter um token
            headers: {  
                'apikey': API_KEY, //chave inicial
                'content-type': 'application/json' // tipo de conteudo
            },
        body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (res.ok) {
            localStorage.setItem('sb_token', data.access_token)
            return true
        }  else {
            throw new Error(data.msg || 'Erro no login')
        }
}

export async function  verificaAutentificacao(){
    const token = localStorage.getItem('sb_token')
    //Tem o token?
    if (!token) {   
        window.location.href='login.html'
        return false
    }
}

export function logout() {
    localStorage.removeItem('sb_token')
    window.location.href='/pages/login.html'
}

export async function signup(email, password)
{

    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, { // vai para esse link usando o fetch 
            method: 'POST', //fazer uma requisição API para obter um token
            headers: {  
                'apikey': API_KEY, //chave inicial
                'content-type': 'application/json',
                'Content-Type': 'application/json'
 // tipo de conteudo
            },
        body: JSON.stringify({ email, password })
        })
        const data = await res.json()
        if (res.ok) {
            localStorage.setItem('sb_token', data.access_token)
            return true
        }  else {
            throw new Error(data.msg || 'Erro no SignUp')
        }

}
