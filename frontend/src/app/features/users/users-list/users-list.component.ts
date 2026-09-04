import { Component, OnInit, inject } from '@angular/core'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco'

import {
  ResourceColumn,
  ResourceListComponent,
} from '@app/shared/components/resource-list/resource-list.component'
import { UsersStore } from '@app/features/users/state/users.store'
import {
  UserFormDialogComponent,
  UserFormDialogData,
} from '@app/features/users/user-form-dialog/user-form-dialog.component'
import type { CreateUserPayload, User } from '@app/features/users/models/user.model'

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [ResourceListComponent, MatDialogModule, TranslocoPipe],
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit {
  readonly usersStore = inject(UsersStore)
  private readonly dialog = inject(MatDialog)
  private readonly transloco = inject(TranslocoService)

  get columns(): ResourceColumn<User>[] {
    return [
      { key: 'name', label: this.transloco.translate('users.columns.name') },
      { key: 'email', label: this.transloco.translate('users.columns.email') },
      {
        key: 'role',
        label: this.transloco.translate('users.columns.role'),
        format: (user) => this.transloco.translate('users.roles.' + user.role),
      },
      {
        key: 'active',
        label: this.transloco.translate('users.columns.status'),
        format: (user) =>
          this.transloco.translate(user.active ? 'users.status.active' : 'users.status.inactive'),
      },
    ]
  }

  ngOnInit(): void {
    this.usersStore.fetchAll()
  }

  applySearch(term: string): void {
    this.usersStore.fetchAll(term)
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
