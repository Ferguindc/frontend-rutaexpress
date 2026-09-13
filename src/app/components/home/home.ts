import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  public authService = inject(AuthService);
  private apiService = inject(ApiService);

  account = this.authService.getAccount();

  mensajeApi = '';
  cargando = signal(false);
  errorApi = '';

  logout(): void {
    this.authService.logout();
  }

  probarApi(): void {
    console.log('1. Iniciando consulta');

    this.cargando.set(true);
    this.mensajeApi = '';
    this.errorApi = '';

    this.apiService.obtenerOrdenes().subscribe({
      next: (respuesta) => {
        console.log('2. NEXT recibido:', respuesta);

        // Si la respuesta es un objeto JSON, lo convierte a texto para mostrarlo en pantalla
        this.mensajeApi = typeof respuesta === 'object' 
          ? JSON.stringify(respuesta, null, 2) 
          : respuesta;

        this.cargando.set(false);
        console.log('3. cargando:', this.cargando());
      },

      error: (error) => {
        console.error('2. ERROR:', error);

        this.errorApi = `Error ${error.status}: ${error.statusText || 'Error en la petición'}`;
        this.cargando.set(false);

        console.log('3. cargando:', this.cargando());
      },

      complete: () => {
        console.log('4. COMPLETE');
      },
    });
  }
}