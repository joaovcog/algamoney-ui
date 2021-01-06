import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { format } from 'date-fns';

export class LancamentoFiltro {
    descricao: string;
    dataVencimentoInicio: Date;
    dataVencimentoFim: Date;
    pagina = 0;
    itensPorPagina = 3;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

    lancamentosUrl = 'http://localhost:8080/lancamentos';

    constructor(private http: HttpClient) { }

    pesquisar(filtro: LancamentoFiltro): Promise<any> {
        const headers = new HttpHeaders()
            .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

        let params = new HttpParams();

        params = params.set('page', filtro.pagina.toString());
        params = params.set('size', filtro.itensPorPagina.toString());

        if (filtro.descricao) {
            params = params.set('descricao', filtro.descricao);
        }

        if (filtro.dataVencimentoInicio) {
            params = params.set('dataVencimentoDe',
                        format(filtro.dataVencimentoInicio, 'yyyy-MM-dd'));
            console.log(format(filtro.dataVencimentoInicio, 'yyyy-MM-dd'));
        }

        if (filtro.dataVencimentoFim) {
            params = params.set('dataVencimentoAte',
                        format(filtro.dataVencimentoFim, 'yyyy-MM-dd'));
            console.log(format(filtro.dataVencimentoFim, 'yyyy-MM-dd'));
        }


        return this.http.get(`${this.lancamentosUrl}?resumo`, { headers, params })
            .toPromise()
            .then(response => {
                const lancamentos = response['content'];
                const resultado = {
                    lancamentos,
                    total: response['totalElements']
                }

                return resultado;
            });
    }

    excluir(codigo: number): Promise<void> {
        const headers = new HttpHeaders()
            .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

        return this.http.delete(`${this.lancamentosUrl}/${codigo}`, { headers })
            .toPromise()
            .then(() => null);
    }
}
