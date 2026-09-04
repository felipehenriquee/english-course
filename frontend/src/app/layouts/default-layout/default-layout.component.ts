import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

import { SidebarComponent } from '@app/layouts/default-layout/sidebar/sidebar.component'
import { TopbarComponent } from '@app/layouts/default-layout/topbar/topbar.component'

// Casca do app logado: só compõe sidebar + topbar + outlet. Cada peça é um
// component local (ver sidebar/ e topbar/), sem estado compartilhado entre
// elas — o conteúdo principal reflui sozinho via flexbox.
@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {}
