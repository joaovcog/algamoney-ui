import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

import { NavbarComponent } from './navbar/navbar.component';


@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    RouterModule,

    ToastModule,
    ConfirmDialogModule,
  ],
  exports:[
      NavbarComponent,

      ToastModule,
      ConfirmDialogModule
  ],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'pt-BR' },

    MessageService,
    ConfirmationService
  ]
})
export class CoreModule { }
