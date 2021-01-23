import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { from, Observable, throwError } from "rxjs";
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { AuthService } from "./auth.service";

export class NotAuthenticatedError {

}

@Injectable()
export class MoneyHttpInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isOauthRequest(req)) {
            return next.handle(req);
        }

        if (this.auth.isAccessTokenInvalido()) {
            return this.doRequestRefreshToken(req, next);
        }

        return this.doRequestWithToken(req, next);
    }

    private isOauthRequest(req: HttpRequest<any>) {
        return req.url.includes('/oauth/token');
    }

    private doRequestWithToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('token');

        req = req.clone({
            setHeaders: {
                Accept: `application/json`,
                'Content-Type': `application/json`,
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Token encontrado...');
        return next.handle(req);
    }

    private doRequestRefreshToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return from(this.auth.obterNovoAccessToken())
            .pipe(
                switchMap(() => this.doRequestWithToken(req, next)),
                catchError(error => {
                    if (error instanceof HttpErrorResponse && error.status === 401) {
                        return throwError(new NotAuthenticatedError());
                    }

                    return throwError(error);
                })
            );
    }


}