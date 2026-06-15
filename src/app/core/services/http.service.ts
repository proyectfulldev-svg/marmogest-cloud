// src/app/core/services/http.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HttpService {

  constructor(private http: HttpClient) {}

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  get<T>(url: string): Observable<T> {
    return this.http.get<T>(url, { headers: this.createHeaders() });
  }

  post<T, R>(url: string, body: T): Observable<R> {
    return this.http.post<R>(url, body, { headers: this.createHeaders() });
  }

  put<T, R>(url: string, body: T): Observable<R> {
    return this.http.put<R>(url, body, { headers: this.createHeaders() });
  }

  delete<R>(url: string): Observable<R> {
    return this.http.delete<R>(url, { headers: this.createHeaders() });
  }
}
