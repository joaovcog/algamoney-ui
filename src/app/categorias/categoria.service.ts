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
        return this.http.get(this.categoriasUrl)
            .toPromise();
            //.then(response => response['content']);
    }

}
