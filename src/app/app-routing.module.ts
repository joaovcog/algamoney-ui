import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PaginaNaoEncontradaComponent } from "./core/pagina-nao-encontrada.component";
import { LancamentosCadastroComponent } from "./lancamentos/lancamentos-cadastro/lancamentos-cadastro.component";
import { LancamentosPesquisaComponent } from "./lancamentos/lancamentos-pesquisa/lancamentos-pesquisa.component";
import { PessoasCadastroComponent } from "./pessoas/pessoas-cadastro/pessoas-cadastro.component";
import { PessoasPesquisaComponent } from "./pessoas/pessoas-pesquisa/pessoas-pesquisa.component";

const routes: Routes = [
    { path: '', redirectTo: 'lancamentos', pathMatch: 'full' },
    { path: 'lancamentos', component: LancamentosPesquisaComponent },
    { path: 'lancamentos/novo', component: LancamentosCadastroComponent },
    { path: 'lancamentos/:codigo', component: LancamentosCadastroComponent },
    { path: 'pessoas', component: PessoasPesquisaComponent },
    { path: 'pessoas/nova', component: PessoasCadastroComponent },
    { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },
    { path: '**', redirectTo: 'pagina-nao-encontrada' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
