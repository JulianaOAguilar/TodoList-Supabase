// ui/exibirListaCategorias.js
import { buscarCategorias } from "../modules/categorias.js";

export async function atualizarListaCategoria() {
  
  const ul = document.getElementById('listaCategorias');
  if (!ul) {
    console.warn("Elemento 'listaCategorias' não encontrado na página.");
    return;
  }

  ul.innerHTML = ''; // limpa o conteúdo anterior

  const categorias = await buscarCategorias();


  if (categorias.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Nenhuma categoria cadastrada.';
    li.classList.add('text-gray-500');
    ul.appendChild(li);
    return;
  }

  categorias.forEach(cat => {
    const li = document.createElement('li');
    li.textContent = cat.nome;
    li.classList.add('bg-white', 'p-2', 'rounded', 'shadow', 'mb-2');
    ul.appendChild(li);
  });
}
