import { Component, OnInit, inject } from '@angular/core'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatChipsModule } from '@angular/material/chips'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco'

import { UsersStore } from '@app/features/users/state/users.store'
import {
  UserFormDialogComponent,
  UserFormDialogData,
} from '@app/features/users/user-form-dialog/user-form-dialog.component'
import type { CreateUserPayload, User } from '@app/features/users/models/user.model'

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatProgressBarModule,
    TranslocoPipe,
  ],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  readonly usersStore = inject(UsersStore)
  private readonly dialog = inject(MatDialog)
  private readonly transloco = inject(TranslocoService)

  readonly displayedColumns = ['name', 'email', 'role', 'active', 'actions']

  ngOnInit(): void {
    this.usersStore.fetchAll()
  }

  openCreate(): void {
    this.openDialog(null)
  }

  openEdit(user: User): void {
    this.openDialog(user)
  }

  private openDialog(user: User | null): void {
    const ref = this.dialog.open<UserFormDialogComponent, UserFormDialogData, CreateUserPayload>(
      UserFormDialogComponent,
      { width: '420px', data: { user } },
    )

    ref.afterClosed().subscribe((payload) => {
      if (!payload) return
      if (user) {
        this.usersStore.update(user.id, payload)
      } else {
        this.usersStore.create(payload)
      }
    })
  }

  async remove(user: User): Promise<void> {
    const message = this.transloco.translate('common.confirmDelete', { name: user.name })
    if (confirm(message)) {
      await this.usersStore.remove(user.id)
    }
  }
}
