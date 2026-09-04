import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

// Layout minimalista para páginas públicas (login, registro, recuperar senha).
// Sem toolbar/sidenav: só centraliza o conteúdo na tela.
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen">
      <router-outlet />
    </div>
  `,
})
export class AuthLayoutComponent {}
