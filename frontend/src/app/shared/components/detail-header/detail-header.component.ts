import { Component, Input, inject } from '@angular/core'
import { Router } from '@angular/router'
import { TranslocoPipe } from '@jsverse/transloco'

import { ButtonComponent } from '@app/shared/components/button/button.component'
import { color } from '@app/core/constants/colors'

/**
 * Header padrão de tela de detalhe/formulário: botão de voltar + título —
 * mesma estrutura repetida em course-detail, lesson-detail (e course-form).
 */
@Component({
  selector: 'app-detail-header',
  standalone: true,
  imports: [ButtonComponent, TranslocoPipe],
  templateUrl: './detail-header.component.html',
})
export class DetailHeaderComponent {
  private readonly router = inject(Router)
  readonly color = color

  @Input() title = ''
  /** Destino do botão de voltar (mesmo formato aceito por `Router.navigate`). */
  @Input() backLink: unknown[] | string = []

  goBack(): void {
    this.router.navigate(Array.isArray(this.backLink) ? this.backLink : [this.backLink])
  }
}
