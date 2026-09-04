import { Component, signal } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { TranslocoPipe } from '@jsverse/transloco'

import { ButtonComponent } from '@app/shared/components/button/button.component'
import { color } from '@app/core/constants/colors'

interface NavItem {
  /** Chave de tradução (nav.*). */
  label: string
  icon: string
  route: string
  /** '/' precisa de match exato — senão fica sempre "ativo". */
  exact: boolean
}

/**
 * Sidebar do app logado: nome + navegação + botão de encolher/expandir.
 * Estado de aberto/fechado é interno — nada fora daqui depende dele (o
 * conteúdo principal reflui sozinho via flexbox no DefaultLayoutComponent).
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, ButtonComponent, TranslocoPipe],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  readonly color = color
  readonly opened = signal(true)

  readonly navItems: NavItem[] = [
    { label: 'nav.home', icon: 'dashboard', route: '/', exact: true },
    { label: 'nav.users', icon: 'group', route: '/users', exact: false },
    { label: 'nav.courses', icon: 'school', route: '/courses', exact: false },
  ]
}
