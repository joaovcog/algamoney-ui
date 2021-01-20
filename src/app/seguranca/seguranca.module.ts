import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';

import { LoginFormComponent } from './login-form/login-form.component';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MoneyHttpInterceptor } from './money-http-interceptor';

export function tokenGetter(): string {
    return localStorage.getItem('token');
}

@NgModule({
  declarations: [LoginFormComponent],
  imports: [
    CommonModule,
    FormsModule,

    InputTextModule,
    ButtonModule,

    JwtModule.forRoot({
        config: {
            tokenGetter,
            allowedDomains: ['localhost:8080'],
            disallowedRoutes: ['http://localhost:8080/oauth/token']
        }
    }),

    SegurancaRoutingModule
  ],
  providers: [
      JwtHelperService,

      {
          provide: HTTP_INTERCEPTORS,
          useClass: MoneyHttpInterceptor,
          multi: true
      }
    ]
})
export class SegurancaModule { }
