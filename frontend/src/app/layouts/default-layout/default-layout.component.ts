import { Component, inject, signal } from '@angular/core'
import { RouterLink, RouterOutlet, Router } from '@angular/router'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'

import { AuthStore } from '@app/features/auth/state/auth.store'
import { environment } from '@env/environment'

interface NavItem {
  label: string
  icon: string
  route: string
}

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent {
  private readonly router = inject(Router)
  readonly authStore = inject(AuthStore)

  readonly appName = environment.appName
  readonly sidenavOpened = signal(true)

  readonly navItems: NavItem[] = [
    { label: 'Início', icon: 'dashboard', route: '/' },
    { label: 'Usuários', icon: 'group', route: '/users' },
    { label: 'Cursos', icon: 'school', route: '/courses' },
  ]

  async logout(): Promise<void> {
    await this.authStore.logout()
    this.router.navigate(['/login'])
  }
}
