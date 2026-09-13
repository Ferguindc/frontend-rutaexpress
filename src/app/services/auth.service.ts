import { Injectable, inject } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private msalService = inject(MsalService);
  private msalBroadcastService = inject(MsalBroadcastService);

  // Variable para almacenar los roles extraídos del Access Token
  public rolesUsuario: string[] = [];

  constructor() {
    this.msalBroadcastService.inProgress$.subscribe((status) => {
      if (status === InteractionStatus.None) {
        let account = this.msalService.instance.getActiveAccount();

        if (!account) {
          const accounts = this.msalService.instance.getAllAccounts();
          if (accounts.length > 0) {
            account = accounts[0];
            this.msalService.instance.setActiveAccount(account);
          }
        }

        if (account) {
          this.obtenerAccessToken();
        }
      }
    });
  }

  login(): void {
    this.msalService.loginRedirect({
      scopes: ['openid', 'profile', environment.azure.api.scope],
      prompt: 'select_account',
    });
  }

  logout(): void {
    this.msalService.logoutRedirect();
  }

  isLoggedIn(): boolean {
    return this.msalService.instance.getAllAccounts().length > 0;
  }

  getAccount() {
    return this.msalService.instance.getActiveAccount();
  }

  /**
   * Devuelve la lista de roles detectados
   */
  getRoles(): string[] {
    if (this.rolesUsuario.length > 0) {
      return this.rolesUsuario;
    }

    const account = this.msalService.instance.getActiveAccount();
    if (account && account.idTokenClaims) {
      const claims = account.idTokenClaims as { roles?: string[] };
      return claims.roles || [];
    }

    return [];
  }

  /**
   * Evalúa si el rol contiene 'admin'
   */
  isAdmin(): boolean {
    const roles = this.getRoles();
    return roles.some((r) => r.toLowerCase().includes('admin'));
  }

  /**
   * Evalúa si el rol contiene 'client'
   */
  isCliente(): boolean {
    const roles = this.getRoles();
    return roles.some((r) => r.toLowerCase().includes('client'));
  }

  async obtenerAccessToken(): Promise<void> {
    const account = this.msalService.instance.getActiveAccount();

    if (!account) {
      console.error('No existe una cuenta activa.');
      return;
    }

    try {
      const result = await this.msalService.instance.acquireTokenSilent({
        account,
        scopes: [environment.azure.api.scope],
      });

      const token = result.accessToken;
      const partes = token.split('.');

      if (partes.length !== 3) {
        console.error('El Access Token no tiene formato JWT.');
        return;
      }

      const payload = JSON.parse(atob(partes[1].replace(/-/g, '+').replace(/_/g, '/')));

      // Guardamos los roles obtenidos del JWT
      this.rolesUsuario = payload.roles || [];

      console.log('==============================');
      console.log('ACCESS TOKEN RUTAEXPRESS');
      console.log('==============================');
      console.log('aud:', payload.aud);
      console.log('iss:', payload.iss);
      console.log('scp:', payload.scp);
      console.log('roles:', this.rolesUsuario);
      console.log('==============================');
    } catch (error) {
      console.error('Error obteniendo Access Token de RutaExpress:', error);
    }
  }
}