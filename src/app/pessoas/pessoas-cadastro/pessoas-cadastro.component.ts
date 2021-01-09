import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ErrorHandlerService } from 'src/app/core/error-handler.service';
import { Pessoa } from 'src/app/core/model';
import { PessoaService } from '../pessoa.service';

@Component({
  selector: 'app-pessoas-cadastro',
  templateUrl: './pessoas-cadastro.component.html',
  styleUrls: ['./pessoas-cadastro.component.css']
})
export class PessoasCadastroComponent implements OnInit {

    pessoa = new Pessoa();

    constructor(
        private pessoaService: PessoaService,
        private messageService: MessageService,
        private errorHandler: ErrorHandlerService
    ) { }

    ngOnInit(): void {
    }

    salvar(form: FormControl) {
        this.pessoaService.adicionar(this.pessoa)
            .then(() => {
                this.messageService.add({ severity: 'success', detail: 'Pessoa adicionada com sucesso!' });

                form.reset();
                this.pessoa = new Pessoa();
            })
            .catch(erro => this.errorHandler.handle(erro));
    }
}
