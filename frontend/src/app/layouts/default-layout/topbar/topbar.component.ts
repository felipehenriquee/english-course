import { Component, ViewChild, inject } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu'
import { TranslocoPipe } from '@jsverse/transloco'
import { filter, map, startWith } from 'rxjs'

import { AuthStore } from '@app/features/auth/state/auth.store'
import { LanguageStore } from '@app/core/i18n/language.store'
import { AppLang } from '@app/core/i18n/i18n'
import { ButtonComponent } from '@app/shared/components/button/button.component'
import { color } from '@app/core/constants/colors'

/**
 * Barra superior do app logado: nome da página atual à esquerda (vem de
 * `data.title` na rota ativa, ver app.routes.ts), idioma + usuário + logout
 * à direita.
 */
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatIconModule, MatMenuModule, ButtonComponent, TranslocoPipe],
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  readonly authStore = inject(AuthStore)
  readonly languageStore = inject(LanguageStore)
  readonly color = color

  // O app-button do gatilho não é `mat-menu-item`, então não fecha o menu
  // sozinho ao clicar — fechamos na mão em `selectLang`.
  @ViewChild(MatMenuTrigger) private readonly langMenuTrigger?: MatMenuTrigger

  /** Chave de tradução da rota ativa (mais funda), ex: `nav.courses`. */
  readonly pageTitle = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.deepestTitle()),
      startWith(this.deepestTitle()),
    ),
    { initialValue: '' },
  )

  private deepestTitle(): string {
    let snapshot = this.route.root.snapshot
    while (snapshot.firstChild) snapshot = snapshot.firstChild
    return (snapshot.data['title'] as string | undefined) ?? ''
  }

  selectLang(code: AppLang): void {
    this.languageStore.setLang(code)
    this.langMenuTrigger?.closeMenu()
  }

  async logout(): Promise<void> {
    await this.authStore.logout()
    this.router.navigate(['/login'])
  }
}
