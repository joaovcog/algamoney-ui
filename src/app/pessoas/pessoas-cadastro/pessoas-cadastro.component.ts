import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/api';

import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Contato, Pessoa } from 'src/app/core/model';
import { PessoaService } from '../pessoa.service';

@Component({
  selector: 'app-pessoas-cadastro',
  templateUrl: './pessoas-cadastro.component.html',
  styleUrls: ['./pessoas-cadastro.component.css']
})
export class PessoasCadastroComponent implements OnInit {

    pessoa = new Pessoa();
    estados: any[];
    cidades: any[];
    codEstadoSelecionado: number;

    constructor(
        private pessoaService: PessoaService,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private title: Title
    ) { }

    ngOnInit(): void {
        this.title.setTitle('Nova Pessoa');

        const codPessoa = this.route.snapshot.params['codigo'];

        this.carregarEstados();

        if (codPessoa) {
            if (isNaN(codPessoa)) {
                this.router.navigate(['/pessoas', 'nova']);
                return;
            }

            this.carregarPessoa(codPessoa);
        }
    }

    carregarEstados() {
        this.pessoaService.listarEstados()
            .then(retorno => {
                this.estados = retorno.map(uf => ({ label: uf.nome, value: uf.codigo }));
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    carregarCidades() {
        this.pessoaService.pesquisarCidades(this.codEstadoSelecionado)
            .then(retorno => {
                this.cidades = retorno.map(c => ({ label: c.nome, value: c.codigo }));
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    get editando() {
        return Boolean(this.pessoa.codigo);
    }

    carregarPessoa(codigo: number) {
        this.pessoaService.buscarPorCodigo(codigo)
            .then(pessoa => {
                this.pessoa = pessoa;
                this.atualizarTituloEdicao();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    nova(form: FormControl) {
        form.reset(new Pessoa());

        this.router.navigate(['/pessoas', 'nova']);
    }

    salvar(form: FormControl) {
        if (this.editando) {
            this.atualizarPessoa(form);
        } else {
            this.adicionarPessoa(form);
        }
    }

    adicionarPessoa(form: FormControl) {
        this.pessoaService.adicionar(this.pessoa)
            .then(pessoaAdicionada => {
                this.messageService.add({ severity: 'success', detail: 'Pessoa adicionada com sucesso!' });

                this.router.navigate(['/pessoas', pessoaAdicionada.codigo]);
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    atualizarPessoa(form: FormControl) {
        this.pessoaService.atualizar(this.pessoa)
            .then(pessoa => {
                this.pessoa = pessoa;

                this.messageService.add({ severity: 'success', detail: 'Pessoa alterada com sucesso.' });
                this.atualizarTituloEdicao();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    atualizarTituloEdicao() {
        this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`);
    }
}
