import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { JwtHelperService } from "@auth0/angular-jwt";

import { CoreModule } from '../core/core.module';

@Injectable()
export class AuthService {

    oauthTokenUrl = 'http://localhost:8080/oauth/token';
    tokensRevokeUrl = 'http://localhost:8080/tokens/revoke';
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

        return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
            .toPromise()
            .then(response => {
                this.armazenarToken(response['access_token']);
            }).catch(response => {
                if (response.status === 400
                        && response.error['error'] === 'invalid_grant') {
                    return Promise.reject('Usuário ou senha inválida!');
                }

                return Promise.reject(response);
            });
    }

    logout() {
        return this.http.delete(this.tokensRevokeUrl, { withCredentials: true })
            .toPromise()
            .then(() => {
                this.limparAccessToken();
            });
    }

    limparAccessToken() {
        localStorage.removeItem('token');
        this.jwtPayload = null;
    }

    obterNovoAccessToken(): Promise<void> {
        const headers = new HttpHeaders()
            .append('Content-Type', 'application/x-www-form-urlencoded')
            .append('Authorization', 'Basic YW5ndWxhcjphbmd1bGFy');

        const body = 'grant_type=refresh_token';

        return this.http.post(this.oauthTokenUrl, body, { headers, withCredentials: true })
            .toPromise()
            .then(response => {
                this.armazenarToken(response['access_token']);

                return Promise.resolve(null);
            })
            .catch(response => {
                return Promise.resolve(null);
            });
    }

    isAccessTokenInvalido() {
        const token = localStorage.getItem('token');

        return !token || this.jwtHelper.isTokenExpired(token);
    }

    temPermissao(permissao: string) {
        return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
    }

    temQualquerPermissao(roles) {
        for (const role of roles) {
            if (this.temPermissao(role)) {
                return true;
            }
        }

        return false;
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
