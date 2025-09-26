import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string; // Bearer
  expiraEm: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private jwtHelper = new JwtHelperService();
  private usuarioLogadoSubject = new BehaviorSubject<LoginResponse | null>(null);

  usuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          this.usuarioLogadoSubject.next(res);
        })
      );
  }

  registrar(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/registrar`, request)
      .pipe(
        tap(res => {
          localStorage.setItem('token', res.token);
          this.usuarioLogadoSubject.next(res);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.usuarioLogadoSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getDecodedToken(): any {
    const token = this.getToken();
    return token ? this.jwtHelper.decodeToken(token) : null;
  }
}
