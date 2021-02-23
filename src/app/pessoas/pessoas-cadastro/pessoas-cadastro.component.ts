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
    exibindoDialogContato = false;
    contato: Contato;
    contatoIndex: number;

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

        if (codPessoa) {
            if (isNaN(codPessoa)) {
                this.router.navigate(['/pessoas', 'nova']);
                return;
            }

            this.carregarPessoa(codPessoa);
        }
    }

    prepararNovoContato() {
        this.exibindoDialogContato = true;
        this.contato = new Contato();
        this.contatoIndex = this.pessoa.contatos.length;
    }

    prepararEdicaoContato(contato: Contato, index: number) {
        this.contato = this.clonarContato(contato);
        this.exibindoDialogContato = true;
        this.contatoIndex = index;
    }

    confirmarContato(form: FormControl) {
        this.pessoa.contatos[this.contatoIndex] = this.clonarContato(this.contato);
        //this.pessoa.contatos.push(this.clonarContato(this.contato));
        this.exibindoDialogContato = false;

        form.reset();
    }

    clonarContato(contato: Contato): Contato {
        return new Contato(contato.codigo, contato.nome,
                        contato.email, contato.telefone);
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
