import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LancamentosCadastroComponent } from "./lancamentos-cadastro/lancamentos-cadastro.component";
import { LancamentosPesquisaComponent } from "./lancamentos-pesquisa/lancamentos-pesquisa.component";

const routes: Routes = [
    { path: 'lancamentos', component: LancamentosPesquisaComponent },
    { path: 'lancamentos/novo', component: LancamentosCadastroComponent },
    { path: 'lancamentos/:codigo', component: LancamentosCadastroComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class LancamentosRoutingModule { }
