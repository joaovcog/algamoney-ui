import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { JwtHelperService } from "@auth0/angular-jwt";

import { CoreModule } from '../core/core.module';

@Injectable({
  providedIn: CoreModule
})
export class AuthService {

    oauthTokenUrl = 'http://localhost:8080/oauth/token';
    jwtPayload: any;

    constructor(
        private http: HttpClient,
        private jwtHelper: JwtHelperService
    ) {
        this.carregarToken();
    }

    login(usuario: string, senha: string): Promise<void> {
        const headers = new HttpHeaders()
            .append('Content-Type', 'application/x-www-form-urlencoded')
            .append('Authorization', 'Basic YW5ndWxhcjphbmd1bGFy');

        const body = `username=${usuario}&password=${senha}&grant_type=password`;

        return this.http.post(this.oauthTokenUrl, body, { headers })
            .toPromise()
            .then(response => {
                console.log(response);
                console.log(response['access_token']);
                this.armazenarToken(response['access_token']);
            }).catch(response => {
                console.log(response);
            });
    }

    private armazenarToken(token: string) {
        this.jwtPayload = this.jwtHelper.decodeToken(token);
        localStorage.setItem('token', token);
    }

    private carregarToken() {
        const token = localStorage.getItem('token');

        if (token) {
            this.armazenarToken(token);
        }
    }
}
