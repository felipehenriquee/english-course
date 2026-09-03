import { Component, inject } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { TranslocoPipe } from '@jsverse/transloco'

import { AuthStore } from '@app/features/auth/state/auth.store'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, TranslocoPipe],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly authStore = inject(AuthStore)
}
