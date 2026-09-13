import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  obtenerOrdenes(): Observable<any> {
  // Apunta a la ruta real configurada en AWS API Gateway
  return this.http.get(`${environment.azure.api.url}/api/orders`);
}
}