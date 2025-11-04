import { buscarCategorias } from '../modules/categorias.js'

export async function carregarCategorias() {
  const select = document.getElementById('categoria');
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
