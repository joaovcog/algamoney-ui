import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { format } from 'date-fns';
import parse from 'date-fns/parse';
import { environment } from 'src/environments/environment';

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

    lancamentosUrl: string;

    constructor(private http: HttpClient) {
        this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
    }

    adicionar(lancamento: Lancamento): Promise<Lancamento> {
        return this.http.post<Lancamento>(this.lancamentosUrl, Lancamento.toJson(lancamento))
            .toPromise();
    }

    pesquisar(filtro: LancamentoFiltro): Promise<any> {
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


        return this.http.get(`${this.lancamentosUrl}?resumo`, { params })
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
        return this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}`)
            .toPromise()
            .then(lancamento => {
                let arrayLancamentos = new Array();
                arrayLancamentos.push(lancamento);
                arrayLancamentos = this.converterStringsParaDatas(arrayLancamentos);
                return arrayLancamentos[0];
            });
    }

    atualizar(lancamento: Lancamento): Promise<Lancamento> {
        return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`, Lancamento.toJson(lancamento))
            .toPromise()
            .then(lancamentoAtualizado => {
                let arrayLancamentos = new Array();
                arrayLancamentos.push(lancamentoAtualizado);
                arrayLancamentos = this.converterStringsParaDatas(arrayLancamentos);

                return arrayLancamentos[0];
            });
    }

    excluir(codigo: number): Promise<void> {
        return this.http.delete(`${this.lancamentosUrl}/${codigo}`)
            .toPromise()
            .then(() => null);
    }

    private converterStringsParaDatas(lancamentos: Array<Lancamento>) {
        return lancamentos.map(lancamento => {
            return {
            ...lancamento,
            dataVencimento: parse(lancamento.dataVencimento.toLocaleString(), 'yyyy-MM-dd', new Date()),
            dataPagamento: lancamento.dataPagamento ?
                           parse(lancamento.dataPagamento.toLocaleString(), 'yyyy-MM-dd', new Date()) : null
            };
        });
    }
}
