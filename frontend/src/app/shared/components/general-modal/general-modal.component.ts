import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Modal genérico e reutilizável.
 *
 * - header: título + botão de fechar no canto.
 * - body: projetado via <ng-content> (o "slot" do Vue).
 * - footer: botões Salvar / Cancelar — some quando [showFooter]="false".
 *
 * É um componente CONTROLADO: quem usa liga [open] e reage a
 * (closed) / (cancel) / (save). O modal não se fecha sozinho.
 */
@Component({
  selector: 'app-general-modal',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './general-modal.component.html',
})
export class GeneralModalComponent {
  @Input() open = false
  @Input() title = ''
  /** Largura máxima do modal. */
  @Input() size: ModalSize = 'md'
  @Input() showFooter = true
  @Input() saveLabel = 'Salvar'
  @Input() cancelLabel = 'Cancelar'
  /** Desabilita o botão Salvar enquanto true (ex: requisição em andamento). */
  @Input() saving = false

  @Output() closed = new EventEmitter<void>()
  @Output() save = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.closed.emit()
    }
  }
}
