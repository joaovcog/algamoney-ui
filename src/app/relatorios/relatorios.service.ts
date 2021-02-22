import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { format } from 'date-fns';
import { environment } from 'src/environments/environment';

import { CoreModule } from '../core/core.module';

@Injectable({
  providedIn: CoreModule
})
export class RelatoriosService {

    lancamentosUrl: string;

    constructor(private http: HttpClient) {
        this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
    }

    relatorioLancamentosPorPessoa(inicio: Date, fim: Date) {
        const params = new HttpParams()
            .set('dataInicial', format(inicio, 'yyyy-MM-dd'))
            .set('dataFinal', format(fim, 'yyyy-MM-dd'));

        return this.http.get(`${this.lancamentosUrl}/relatorios/por-pessoa`,
            { params, responseType: 'blob' })
            .toPromise();
    }
}
