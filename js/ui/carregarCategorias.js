import { buscarCategorias } from '../modules/categorias.js'
import { fetchCategories } from '../modules/categorias.js';
// pega as categorias e salva no select

export async function carregarCategorias() {
  const select = document.getElementById('categoria');
  if (!select) {
  console.warn("Elemento 'categoria' não encontrado na página.")
  return
}

  select.innerHTML = '';


  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Selecione uma categoria';
  select.appendChild(defaultOption);

  const categorias = await buscarCategorias();

  categorias.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;      // <- aqui é o ID (UUID), não o nome
    option.textContent = cat.nome;
    select.appendChild(option);
  });
}
