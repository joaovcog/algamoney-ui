import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { CoreModule } from '../core/core.module';
import { Pessoa } from '../core/model';

export class PessoaFiltro {
    nome: string;
    pagina = 0;
    itensPorPagina = 3;
}

@Injectable({
  providedIn: CoreModule
})
export class PessoaService {

    pessoasUrl: string;

    constructor(private http: HttpClient) {
        this.pessoasUrl = `${environment.apiUrl}/pessoas`;
    }

    adicionar(pessoa: Pessoa): Promise<Pessoa> {
        return this.http.post<Pessoa>(this.pessoasUrl, pessoa)
            .toPromise();
    }

    pesquisar(filtro: PessoaFiltro): Promise<any> {
        let params = new HttpParams();

        params = params.set('page', filtro.pagina.toString());
        params = params.set('size', filtro.itensPorPagina.toString());

        if (filtro.nome) {
            params = params.set('nome', filtro.nome);
        }

        return this.http.get(this.pessoasUrl, { params })
            .toPromise()
            .then(response => {
                const pessoas = response['content'];
                const resultado = {
                    pessoas,
                    total: response['totalElements']
                }

                return resultado;
            });
    }

    listarTodas(): Promise<any> {
        return this.http.get(this.pessoasUrl)
            .toPromise()
            .then(response => response['content']);
    }

    buscarPorCodigo(codigo: number): Promise<Pessoa> {
        return this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`)
            .toPromise();
    }

    atualizar(pessoa: Pessoa): Promise<Pessoa> {
        return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa)
            .toPromise();
    }

    excluir(codigo: number): Promise<void> {
        return this.http.delete(`${this.pessoasUrl}/${codigo}`)
            .toPromise()
            .then(() => null);
    }

    atualizarStatus(codigo: number, ativo: boolean): Promise<void> {
        const headers = new HttpHeaders()
            .append('Content-Type', 'application/json');

        return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo, { headers })
            .toPromise()
            .then(() => null);
    }
}
