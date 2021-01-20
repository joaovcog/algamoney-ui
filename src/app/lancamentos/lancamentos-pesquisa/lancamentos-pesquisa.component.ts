import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { AuthService } from 'src/app/seguranca/auth.service';
import { LancamentoFiltro, LancamentoService } from '../lancamento.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

    totalRegistros = 0;
    filtro = new LancamentoFiltro();

    lancamentos = [];

    @ViewChild('tblLancamentos') grid: Table;

    constructor(
        private lancamentoService: LancamentoService,
        private auth: AuthService,
        private messageService: MessageService,
        private confirmation: ConfirmationService,
        private errorHandler: ErrorHandlerService,
        private title: Title
    ) {}

    ngOnInit() {
        this.title.setTitle('Pesquisa de Lançamentos');
    }

    pesquisar(pagina = 0) {
        this.filtro.pagina = pagina;

        this.lancamentoService.pesquisar(this.filtro)
            .then(resultado => {
                this.totalRegistros = resultado.total;
                this.lancamentos = resultado.lancamentos;
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    aoMudarPagina(event: LazyLoadEvent) {
        const pagina = event.first / event.rows;

        if (pagina != this.filtro.pagina) {
            this.pesquisar(pagina);
        }
    }

    confirmarExclusao(lancamento: any) {
        this.confirmation.confirm({
            message: 'Deseja realmente excluir o registro?',
            accept: () => {
                this.excluir(lancamento);
            }
        });
    }

    excluir(lancamento: any) {
        this.lancamentoService.excluir(lancamento.codigo)
            .then(() => {
                if (this.grid.first === 0) {
                    this.pesquisar();
                } else {
                    this.grid.reset();
                }

                this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com sucesso!' });
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    temPermissao(permissao: string) {
        return this.auth.temPermissao(permissao);
    }

}
