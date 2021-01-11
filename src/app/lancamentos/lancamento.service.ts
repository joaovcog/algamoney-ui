import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { format } from 'date-fns';
import parse from 'date-fns/parse';

import { CoreModule } from '../core/core.module';
import { Lancamento } from '../core/model';

export class LancamentoFiltro {
    descricao: string;
    dataVencimentoInicio: Date;
    dataVencimentoFim: Date;
    pagina = 0;
    itensPorPagina = 3;
}

@Injectable({
  providedIn: CoreModule
})
export class LancamentoService {

    lancamentosUrl = 'http://localhost:8080/lancamentos';

    constructor(private http: HttpClient) { }

    adicionar(lancamento: Lancamento): Promise<Lancamento> {
        const headers = new HttpHeaders()
            .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
            .append('Content-Type', 'application/json');

        return this.http.post<Lancamento>(this.lancamentosUrl, Lancamento.toJson(lancamento), { headers })
            .toPromise();
    }

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
        }

        if (filtro.dataVencimentoFim) {
            params = params.set('dataVencimentoAte',
                        format(filtro.dataVencimentoFim, 'yyyy-MM-dd'));
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

    buscarPorCodigo(codigo: number): Promise<Lancamento> {
        const headers = new HttpHeaders()
            .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

        return this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}`, { headers })
            .toPromise()
            .then(response => {
                const lancamento = response;

                this.converterStringsParaDatas([lancamento]);

                return lancamento;
            });
    }

    atualizar(lancamento: Lancamento): Promise<Lancamento> {
        const headers = new HttpHeaders()
            .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
            .append('Content-Type', 'application/json');

        return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`, Lancamento.toJson(lancamento), { headers })
            .toPromise()
            .then(response => {
                const lancamentoAlterado = response;

                this.converterStringsParaDatas([lancamentoAlterado]);

                return lancamentoAlterado;
            });
    }

    excluir(codigo: number): Promise<void> {
        const headers = new HttpHeaders()
            .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

        return this.http.delete(`${this.lancamentosUrl}/${codigo}`, { headers })
            .toPromise()
            .then(() => null);
    }

    private converterStringsParaDatas(lancamentos: Lancamento[]) {
        return lancamentos.map( lancamento => {
            return {
                ...lancamento,
                dataVencimento: parse(format(lancamento.dataVencimento,
                                    'yyyy-MM-dd'), 'yyyy-MM-dd', new Date()),
                dataPagamento: lancamento.dataPagamento ?
                                parse(format(lancamento.dataPagamento,
                                    'yyyy-MM-dd'), 'yyyy-MM-dd', new Date()) : null
            };
        });
    }
}
