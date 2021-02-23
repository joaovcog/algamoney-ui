import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Contato } from 'src/app/core/model';

@Component({
  selector: 'app-pessoas-cadastro-contato',
  templateUrl: './pessoas-cadastro-contato.component.html',
  styleUrls: ['./pessoas-cadastro-contato.component.css']
})
export class PessoasCadastroContatoComponent implements OnInit {

    @Input() contatos: Array<Contato>;
    contato: Contato;
    exibindoDialogContato = false;
    contatoIndex: number;
    edicao = false;

    constructor() { }

    ngOnInit(): void {
    }

    prepararNovoContato() {
        this.exibindoDialogContato = true;
        this.contato = new Contato();
        this.edicao = false;
        //this.contatoIndex = this.pessoa.contatos.length;
    }

    prepararEdicaoContato(contato: Contato, index: number) {
        this.contato = this.clonarContato(contato);
        this.exibindoDialogContato = true;
        this.contatoIndex = index;
        this.edicao = true;
    }

    confirmarContato(form: FormControl) {
        if (this.edicao) {
            this.contatos[this.contatoIndex] = this.clonarContato(this.contato);
        } else {
            this.contatos.push(this.clonarContato(this.contato));
        }

        this.exibindoDialogContato = false;

        form.reset();
    }

    removerContato(index: number) {
        this.contatos.splice(index, 1);
    }

    clonarContato(contato: Contato): Contato {
        return new Contato(contato.codigo, contato.nome,
                        contato.email, contato.telefone);
    }
}
