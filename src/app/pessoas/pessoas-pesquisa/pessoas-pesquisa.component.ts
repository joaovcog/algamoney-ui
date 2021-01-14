import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { PessoaFiltro, PessoaService } from '../pessoa.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit {

    totalRegistros = 0;
    filtro = new PessoaFiltro();

    pessoas = [];

    @ViewChild('tblPessoas') grid: Table;

    constructor(
        private pessoaService: PessoaService,
        private messageService: MessageService,
        private confirmation: ConfirmationService,
        private errorHandler: ErrorHandlerService,
        private title: Title
    ) {}

    ngOnInit() {
        this.title.setTitle('Pesquisa de Pessoas');
    }

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

    atualizarStatus(pessoa: any): void {
        const novoStatus = !pessoa.ativo;

        this.pessoaService.atualizarStatus(pessoa.codigo, novoStatus)
            .then(() => {
                const acao = novoStatus ? 'ativada' : 'desativada';

                pessoa.ativo = novoStatus;

                this.messageService.add({ severity: 'success', detail: `Pessoa ${acao} com sucesso!` });
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    private getEstilosAtivo(ativo: boolean) {
        return {
          color: 'white',
          textDecoration: 'none',
          backgroundColor: ativo ? '#5cb85c' : '#d9534f',
          padding: '1px 10px',
          textAlign: 'center',
          display: 'inline-block',
          borderRadius: '1em'
        }
    }

}
