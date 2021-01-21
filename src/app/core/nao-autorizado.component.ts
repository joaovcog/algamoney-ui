import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nao-autorizado',
  template: `
    <div class="container">
        <h1 class="text-center">Acesso negado!</h1>
        <button pButton label="Voltar" (click)="voltar()"></button>
    </div>
  `,
  styles: [
  ]
})
export class NaoAutorizadoComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit(): void {
  }

  voltar() {
      this._location.back();
  }

}
