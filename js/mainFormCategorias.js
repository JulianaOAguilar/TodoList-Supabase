import { adicionarCategoria } from "./ui/categorias.js";
import { deletarTudo } from "./modules/delete.js";
import { carregarCategorias } from "./ui/carregarCategorias.js";
import { updateCategoryList } from "./ui/exibirListaCategorias.js";
import { updateCategorySelect } from "./ui/carregarCategorias.js";

document.addEventListener('DOMContentLoaded', () => {
  deletarTudo('categorias', carregarCategorias)
  adicionarCategoria()
    
})

document.addEventListener('DOMContentLoaded', () => {
  deletarTudo('categorias', updateCategoryList);
  adicionarCategoria();
  updateCategoryList();
  updateCategorySelect();
});
