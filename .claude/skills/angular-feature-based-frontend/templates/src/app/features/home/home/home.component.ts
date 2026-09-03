import { Component, inject } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { AuthStore } from '@app/features/auth/state/auth.store'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly authStore = inject(AuthStore)
}
