import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatButtonModule } from '@angular/material/button'
import { TranslocoPipe } from '@jsverse/transloco'

import { InputComponent } from '@app/shared/components/input/input.component'
import type { CreateUserPayload, User } from '@app/features/users/models/user.model'

export interface UserFormDialogData {
  user: User | null
}

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    InputComponent,
    TranslocoPipe,
  ],
  templateUrl: './user-form-dialog.component.html',
})
export class UserFormDialogComponent {
  private readonly fb = inject(FormBuilder)
  private readonly dialogRef = inject(MatDialogRef<UserFormDialogComponent>)
  readonly data = inject<UserFormDialogData>(MAT_DIALOG_DATA)

  readonly roles: User['role'][] = ['admin', 'editor', 'viewer']

  readonly form = this.fb.nonNullable.group({
    name: [this.data.user?.name ?? '', [Validators.required]],
    email: [this.data.user?.email ?? '', [Validators.required, Validators.email]],
    role: [this.data.user?.role ?? ('viewer' as User['role']), [Validators.required]],
    active: [this.data.user?.active ?? true],
  })

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    this.dialogRef.close(this.form.getRawValue() as CreateUserPayload)
  }

  cancel(): void {
    this.dialogRef.close()
  }
}
