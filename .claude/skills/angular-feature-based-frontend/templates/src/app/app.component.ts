import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

// Root component: só orquestra o roteador.
// Cada layout (AuthLayoutComponent / DefaultLayoutComponent) é escolhido
// pela própria rota (ver app.routes.ts), então nada de toolbar/sidenav
// fica fixo aqui.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}
