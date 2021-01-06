import { Injectable } from '@angular/core';
import { CoreModule } from './core.module';

import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: CoreModule
})
export class ErrorHandlerService {

  constructor(private messageService: MessageService) { }

  handle(errorResponse: any) {
      let msg: string;

      if (typeof errorResponse === 'string') {
          msg = errorResponse;
      } else {
          msg = 'Erro ao processar o serviço remoto. Tente novamente.';
          console.log('Ocorreu um erro', errorResponse);
      }

      this.messageService.add({ severity: 'error', detail: msg });
  }
}
