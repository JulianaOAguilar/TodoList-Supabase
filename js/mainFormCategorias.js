import { adicionarCategoria } from "./ui/categorias.js";
import { deletarTudo } from "./modules/delete.js";
import { carregarCategorias } from "./ui/carregarCategorias.js";
import { logoutUi } from "./ui/auth.js";
import { atualizarListaCategoria } from "./ui/exibirListaCategorias.js";
import { verificaAutentificacao } from "./modules/auth.js";

document.addEventListener('DOMContentLoaded', () => {
  if (!verificaAutentificacao()) { return }
  deletarTudo('categorias', carregarCategorias)
  deletarTudo('categorias', atualizarListaCategoria)
  adicionarCategoria()
  logoutUi()
})
