import { Component, OnInit, ViewChild } from '@angular/core';

import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { PessoaFiltro, PessoaService } from '../pessoa.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent {

    totalRegistros = 0;
    filtro = new PessoaFiltro();

    pessoas = [];

    @ViewChild('tblPessoas') grid: Table;

    constructor(
        private pessoaService: PessoaService,
        private messageService: MessageService,
        private confirmation: ConfirmationService,
        private errorHandler: ErrorHandlerService
    ) {}

    pesquisar(pagina = 0) {
        this.filtro.pagina = pagina;

        this.pessoaService.pesquisar(this.filtro)
            .then(resultado => {
                this.totalRegistros = resultado.total;
                this.pessoas = resultado.pessoas;
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    aoMudarPagina(event: LazyLoadEvent) {
        const pagina = event.first / event.rows;

        if (pagina != this.filtro.pagina) {
            this.pesquisar(pagina);
        }
    }

    confirmarExclusao(pessoa: any) {
        this.confirmation.confirm({
            message: 'Deseja realmente excluir o registro?',
            accept: () => {
                this.excluir(pessoa);
            }
        });
    }

    excluir(pessoa: any) {
        this.pessoaService.excluir(pessoa.codigo)
            .then(() => {
                if (this.grid.first === 0) {
                    this.pesquisar();
                } else {
                    this.grid.reset();
                }

                this.messageService.add({ severity: 'success', detail: 'Pessoa excluída com sucesso!' });
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

}
