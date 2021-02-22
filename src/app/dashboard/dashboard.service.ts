import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import parse from 'date-fns/parse';

import { environment } from 'src/environments/environment';
import { CoreModule } from '../core/core.module';

@Injectable({
  providedIn: CoreModule
})
export class DashboardService {

    lancamentosUrl: string;

    constructor(private http: HttpClient) {
        this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
    }

    lancamentosPorCategoria(tipoLancamento: string): Promise<Array<any>> {
        let params = new HttpParams();
        params = params.set('tipoLancamento', tipoLancamento.toUpperCase());

        return this.http.get<any>(`${this.lancamentosUrl}/estatisticas/categoria`, { params })
            .toPromise();
    }

    lancamentosPorDia(): Promise<Array<any>> {
        return this.http.get<any>(`${this.lancamentosUrl}/estatisticas/dia`)
            .toPromise()
            .then(response => {
                this.converterStringsParaDatas(response);

                return response;
            });
    }

    private converterStringsParaDatas(dados: Array<any>) {
        for (const dado of dados) {
            dado.dia = parse(dado.dia.toLocaleString(), 'yyyy-MM-dd', new Date());
        }
    }
}
