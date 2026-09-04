import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { TranslocoPipe } from '@jsverse/transloco'

import { AuthStore } from '@app/features/auth/state/auth.store'
import { CardComponent } from '@app/shared/components/card/card.component'
import { ButtonComponent } from '@app/shared/components/button/button.component'
import { InputComponent } from '@app/shared/components/input/input.component'
import { color } from '@app/core/constants/colors'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    InputComponent,
    MatProgressSpinnerModule,
    TranslocoPipe,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  readonly color = color

  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  readonly authStore = inject(AuthStore)

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    try {
      await this.authStore.login(this.form.getRawValue())
      const redirect = this.route.snapshot.queryParamMap.get('redirect') ?? '/'
      this.router.navigateByUrl(redirect)
    } catch {
      // authStore.error() já guarda a mensagem; exibida no template abaixo.
    }
  }
}
