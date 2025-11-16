import { adicionarCategoria } from "./ui/categorias.js";
import { deletarTudo } from "./modules/delete.js";
import { carregarCategorias } from "./ui/carregarCategorias.js";
import { logoutUi } from "./ui/auth.js";
import { atualizarListaCategoria } from "./ui/exibirListaCategorias.js";

document.addEventListener('DOMContentLoaded', () => {

  deletarTudo('categorias', carregarCategorias)
  adicionarCategoria()
  logoutUi()
  atualizarListaCategoria()
})
