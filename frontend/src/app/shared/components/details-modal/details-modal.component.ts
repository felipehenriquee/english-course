import { Component, EventEmitter, Input, Output } from '@angular/core'

import {
  GeneralModalComponent,
  ModalSize,
} from '@app/shared/components/general-modal/general-modal.component'

export interface DetailField {
  label: string
  value: unknown
}

/**
 * Modal de "ver detalhes" de um registro: monta um <dl> (rótulo → valor) a
 * partir de [fields], dentro do GeneralModal e sem footer. Reutilizável por
 * qualquer CRUD — ver features/courses/courses-list como exemplo.
 */
@Component({
  selector: 'app-details-modal',
  standalone: true,
  imports: [GeneralModalComponent],
  templateUrl: './details-modal.component.html',
})
export class DetailsModalComponent {
  @Input() open = false
  @Input() title = 'Detalhes'
  @Input() fields: DetailField[] = []
  @Input() size: ModalSize = 'md'

  @Output() closed = new EventEmitter<void>()

  formatValue(value: unknown): string {
    return value === null || value === undefined || value === '' ? '—' : String(value)
  }
}
