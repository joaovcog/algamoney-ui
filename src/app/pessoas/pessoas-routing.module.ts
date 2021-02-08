import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "../seguranca/auth.guard";
import { PessoasCadastroComponent } from "./pessoas-cadastro/pessoas-cadastro.component";
import { PessoasPesquisaComponent } from "./pessoas-pesquisa/pessoas-pesquisa.component";



const routes: Routes = [
    {
        path: '',
        component: PessoasPesquisaComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_PESQUISAR_PESSOA'] }
    },
    {
        path: 'nova',
        component: PessoasCadastroComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_CADASTRAR_PESSOA'] }
    },
    {
        path: ':codigo',
        component: PessoasCadastroComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_CADASTRAR_PESSOA'] }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class PessoasRoutingModule { }
