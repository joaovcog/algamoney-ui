import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { CategoriaService } from 'src/app/categorias/categoria.service';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Lancamento } from 'src/app/core/model';
import { PessoaService } from 'src/app/pessoas/pessoa.service';
import { LancamentoService } from '../lancamento.service';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-lancamentos-cadastro',
  templateUrl: './lancamentos-cadastro.component.html',
  styleUrls: ['./lancamentos-cadastro.component.css']
})
export class LancamentosCadastroComponent implements OnInit {

    tipos = [
        { label: 'Receita', value: 'RECEITA' },
        { label: 'Despesa', value: 'DESPESA' }
    ];

    categorias = [];
    pessoas = [];
    lancamento = new Lancamento();

    constructor(
        private categoriaService: CategoriaService,
        private pessoaService: PessoaService,
        private lancamentoService: LancamentoService,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        console.log(this.route.snapshot.params['codigo']);

        this.carregarCategorias();
        this.carregarPessoas();
    }

    salvar(form: FormControl) {
        this.lancamentoService.adicionar(this.lancamento)
            .then(() => {
                this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso!' });

                form.reset();
                this.lancamento = new Lancamento();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    carregarCategorias() {
        this.categoriaService.listarTodas()
            .then(categorias => {
                this.categorias = categorias.map(c => {
                    return { label: c.nome, value: c.codigo };
                });
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    carregarPessoas() {
        this.pessoaService.listarTodas()
            .then(pessoas => {
                this.pessoas = pessoas
                    .map(p => ({ label: p.nome, value: p.codigo }));
            })
            .catch(erro => this.errorHandler.handle(erro));
    }
}
