import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa, PessoaResponse } from '../models/pessoa.model';
import { environment } from '../../environments/environment';

const API_URL = environment.apiBaseUrl;

@Injectable({ providedIn: 'root' })
export class PessoaService {
  private http = inject(HttpClient);

  listar(offset = 0): Observable<PessoaResponse> {
    return this.http.get<PessoaResponse>(`${API_URL}?offset=${offset}`);
  }

  pesquisar(termo: string, offset = 0): Observable<PessoaResponse> {
    const filtro = JSON.stringify({
      '$or': [
        { nome:   { '$like': `%${termo}%` } },
        { cpf:    { '$like': `%${termo}%` } },
        { cidade: { '$like': `%${termo}%` } },
      ]
    });
    return this.http.get<PessoaResponse>(`${API_URL}?q=${encodeURIComponent(filtro)}&offset=${offset}`);
  }

  buscarPorCpf(cpf: string): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${API_URL}${cpf}`);
  }

  criar(pessoa: Omit<Pessoa, 'idade' | 'links'>): Observable<Pessoa> {
    return this.http.post<Pessoa>(API_URL, pessoa);
  }

  atualizar(cpf: string, pessoa: Partial<Omit<Pessoa, 'idade' | 'links'>>): Observable<Pessoa> {
    return this.http.put<Pessoa>(`${API_URL}${cpf}`, pessoa);
  }

  excluir(cpf: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}${cpf}`);
  }
}
