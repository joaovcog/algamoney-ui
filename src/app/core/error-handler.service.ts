import { Injectable } from '@angular/core';
import { CoreModule } from './core.module';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: CoreModule
})
export class ErrorHandlerService {

    constructor(private messageService: MessageService,
        private router: Router) { }

    handle(errorResponse: any) {
        let msg: string;

        if (typeof errorResponse === 'string') {
            msg = errorResponse;
        } else if (errorResponse instanceof HttpErrorResponse &&
                    errorResponse.status >= 400 && errorResponse.status <= 499) {
            if (errorResponse.status == 404) {
                this.router.navigate(['/pagina-nao-encontrada']);
                return;
            }

            msg = 'Ocorreu um erro ao processar a sua solicitação';

            if (errorResponse.status === 403) {
                msg = 'Você não tem permissão para executar esta ação';
            }

            try {
                msg = errorResponse.error[0].mensagemUsuario;
            } catch (e) { }

            console.error('Ocorreu um erro', errorResponse);
        } else {
            msg = 'Erro ao processar o serviço remoto. Tente novamente.';
            console.log('Ocorreu um erro', errorResponse);
        }

        this.messageService.add({ severity: 'error', detail: msg });
    }
}
