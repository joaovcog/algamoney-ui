import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreModule } from '../core/core.module';

@Injectable({
  providedIn: CoreModule
})
export class CategoriaService {

    categoriasUrl = 'http://localhost:8080/categorias';

    constructor(private http: HttpClient) { }

    listarTodas(): Promise<any> {
        const headers = new HttpHeaders()
            .append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');

        return this.http.get(this.categoriasUrl, { headers })
            .toPromise();
            //.then(response => response['content']);
    }

}
