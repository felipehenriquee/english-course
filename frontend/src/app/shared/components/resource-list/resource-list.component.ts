import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core'
import { RouterLink } from '@angular/router'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { debounceTime, distinctUntilChanged } from 'rxjs'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { TranslocoPipe } from '@jsverse/transloco'

import { ButtonComponent } from '@app/shared/components/button/button.component'
import { Icon } from '@app/shared/icon.enum'

export interface ResourceColumn<T> {
  /** Chave do campo no objeto da linha. */
  key: Extract<keyof T, string>
  /** Rótulo exibido no cabeçalho. */
  label: string
  /** Renderiza o valor como link; ao clicar emite (rowClick). */
  clickable?: boolean
}

const ACTIONS_COLUMN = '__actions__'

/**
 * Tela genérica de listagem de um CRUD: título do módulo, barra de busca,
 * botão "adicionar" e uma <mat-table> com colunas configuráveis.
 *
 * Recebe o nome do módulo ([title]), a definição das colunas ([columns]) e
 * o conteúdo das linhas ([rows]); reporta interações pelos outputs. Os
 * próximos CRUDs reutilizam este componente — ver
 * features/courses/courses-list.
 */
@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    TranslocoPipe,
    ButtonComponent,
  ],
  templateUrl: './resource-list.component.html',
})
export class ResourceListComponent<T extends { id: string | number }> implements OnChanges {
  /** Nome do módulo, ex: "Cursos". */
  @Input() title = ''
  @Input() columns: ResourceColumn<T>[] = []
  @Input() rows: T[] = []
  @Input() loading = false
  @Input() error: string | null = null
  /** Sem valor, usa a tradução `common.add`. */
  @Input() addLabel?: string
  /** routerLink do botão de adicionar. Sem valor, o botão some. */
  @Input() addRoute: string | (string | number)[] | null = null
  /** Sem valor, usa a tradução `common.search`. */
  @Input() searchPlaceholder?: string
  /** Sem valor, usa a tradução `common.empty`. */
  @Input() emptyMessage?: string
  @Input() showActions = true

  /** Termo de busca, já com debounce. */
  @Output() searchChange = new EventEmitter<string>()
  /** Clique no valor de uma coluna marcada como `clickable`. */
  @Output() rowClick = new EventEmitter<T>()
  @Output() edit = new EventEmitter<T>()
  @Output() remove = new EventEmitter<T>()

  readonly searchControl = new FormControl('', { nonNullable: true })
  readonly actionsColumn = ACTIONS_COLUMN
  readonly Icon = Icon

  displayedColumns: string[] = []

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.searchChange.emit(term))
  }

  ngOnChanges(): void {
    const keys = this.columns.map((column) => column.key as string)
    this.displayedColumns = this.showActions ? [...keys, ACTIONS_COLUMN] : keys
  }

  cell(row: T, key: Extract<keyof T, string>): string {
    const value = row[key]
    return value === null || value === undefined || value === '' ? '—' : String(value)
  }
}
