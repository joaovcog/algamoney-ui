import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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
    //lancamento = new Lancamento();
    formulario: FormGroup;

    constructor(
        private categoriaService: CategoriaService,
        private pessoaService: PessoaService,
        private lancamentoService: LancamentoService,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService,
        private route: ActivatedRoute,
        private router: Router,
        private title: Title,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.configurarFormulario();
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

    get urlUploadAnexo() {
        return this.lancamentoService.urlUploadAnexo();
    }

    configurarFormulario() {
        this.formulario = this.formBuilder.group({
            codigo: [],
            tipo: ['RECEITA', Validators.required],
            dataVencimento: [null, Validators.required],
            dataPagamento: [],
            descricao: [null, [this.validarObrigatorio, this.validarTamanhoMinimo(5)]],
            valor: [null, Validators.required],
            pessoa: this.formBuilder.group({
                codigo: [null, Validators.required],
                nome: []
            }),
            categoria: this.formBuilder.group({
                codigo: [null, Validators.required],
                nome: []
            }),
            observacao: []
        });
    }

    validarObrigatorio(input: FormControl) {
        return (input.value ? null : { obrigatorio: true });
    }

    validarTamanhoMinimo(valor: number) {
        return (input: FormControl) => {
            return (!input.value || input.value.length >= valor) ? null
                : { tamanhoMinimo: { tamanho: valor } };
        };
    }

    get editando() {
        return Boolean(this.formulario.get('codigo').value);
    }

    carregarLancamento(codigo: number) {
        this.lancamentoService.buscarPorCodigo(codigo)
            .then(lancamento => {
                //this.lancamento = lancamento;
                this.formulario.patchValue(lancamento);
                this.atualizarTituloEdicao();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    novo() {
        this.formulario.reset(new Lancamento());

        this.router.navigate(['/lancamentos/novo']);
    }

    salvar() {
        if (this.editando) {
            this.atualizarLancamento();
        } else {
            this.adicionarLancamento();
        }
    }

    adicionarLancamento() {
        this.lancamentoService.adicionar(this.formulario.value)
            .then(lancamentoAdicionado => {
                this.messageService.add({ severity: 'success', detail: 'Lançamento adicionado com sucesso!' });

                //form.reset();
                //this.lancamento = new Lancamento();

                this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
            })
            .catch(erro => this.errorHandler.handle(erro));
    }

    atualizarLancamento() {
        this.lancamentoService.atualizar(this.formulario.value)
            .then(lancamento => {
                //this.lancamento = lancamento;
                this.formulario.patchValue(lancamento);

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
        this.title.setTitle(`Edição de lançamento: ${this.formulario.get('descricao').value}`);
    }
}
