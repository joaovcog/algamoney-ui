import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../seguranca/auth.guard";
import { LancamentosCadastroComponent } from "./lancamentos-cadastro/lancamentos-cadastro.component";
import { LancamentosPesquisaComponent } from "./lancamentos-pesquisa/lancamentos-pesquisa.component";

const routes: Routes = [
    {
        path: 'lancamentos',
        component: LancamentosPesquisaComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_PESQUISAR_LANCAMENTO'] }
    },
    {
        path: 'lancamentos/novo',
        component: LancamentosCadastroComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_CADASTRAR_LANCAMENTO'] }
    },
    {
        path: 'lancamentos/:codigo',
        component: LancamentosCadastroComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_CADASTRAR_LANCAMENTO'] }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class LancamentosRoutingModule { }
