import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

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
        private route: ActivatedRoute,
        private router: Router,
        private title: Title
    ) { }

    ngOnInit(): void {
        this.title.setTitle('Novo Lançamento');

        const codLancamento = this.route.snapshot.params['codigo'];

        if (codLancamento) {
            if(isNaN(codLancamento)) {
                this.router.navigate(['/lancamentos', 'novo']);
                return;
            }

            this.carregarLancamento(codLancamento);
        }

        this.carregarCategorias();
        this.carregarPessoas();
    }

    get editando() {
        return Boolean(this.lancamento.codigo);
    }

    carregarLancamento(codigo: number) {
        this.lancamentoService.buscarPorCodigo(codigo)
            .then(lancamento => {
                this.lancamento = lancamento;
                this.atualizarTituloEdicao();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    novo(form: FormControl) {
        this.lancamento = new Lancamento();
        form.reset(this.lancamento);

        this.router.navigate(['/lancamentos/novo']);
    }

    salvar(form: FormControl) {
        if (this.editando) {
            this.atualizarLancamento(form);
        } else {
            this.adicionarLancamento(form);
        }
    }

    adicionarLancamento(form: FormControl) {
        this.lancamentoService.adicionar(this.lancamento)
            .then(lancamentoAdicionado => {
                this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso!' });

                //form.reset();
                //this.lancamento = new Lancamento();

                this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    atualizarLancamento(form: FormControl) {
        this.lancamentoService.atualizar(this.lancamento)
            .then(lancamento => {
                this.lancamento = lancamento;

                this.messageService.add({ severity: 'success', detail: 'Lançamento alterado com sucesso' });
                this.atualizarTituloEdicao();
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

    atualizarTituloEdicao() {
        this.title.setTitle(`Edição de lançamento: ${this.lancamento.descricao}`);
    }
}
