import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CoreModule } from '../core/core.module';

@Injectable({
  providedIn: CoreModule
})
export class CategoriaService {

    categoriasUrl: string;

    constructor(private http: HttpClient) {
        this.categoriasUrl = `${environment.apiUrl}/categorias`;
    }

    listarTodas(): Promise<any> {
        return this.http.get(this.categoriasUrl)
            .toPromise();
            //.then(response => response['content']);
    }

}
