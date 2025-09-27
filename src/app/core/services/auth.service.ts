import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../models/login-request.model';
import { LoginResponse } from '../models/login-response.model';
import { RegistroRequest } from '../models/registro-request.model';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}`;
  private jwtHelper = new JwtHelperService();

  private usuarioLogadoSubject = new BehaviorSubject<Usuario | null>(null);
  usuarioLogado$ = this.usuarioLogadoSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(request: LoginRequest): Observable<void> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request).pipe(
      switchMap(res => {
        localStorage.setItem('token', res.token);
        return this.carregarPerfil();
      })
    );
  }

  registrar(request: RegistroRequest): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/auth/registrar`, request);
  }

  carregarPerfil(): Observable<void> {
    return this.http.get<Usuario>(`${this.apiUrl}/api/usuarios/perfil`).pipe(
      tap(usuario => this.usuarioLogadoSubject.next(usuario)),
      map(() => void 0)
    );
  }

  estaAutenticado(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  deslogar(): void {
    localStorage.removeItem('token');
    this.usuarioLogadoSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTokenDecodificado(): any {
    const token = this.getToken();
    return token ? this.jwtHelper.decodeToken(token) : null;
  }

}
