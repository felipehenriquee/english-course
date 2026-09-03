import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { MatButtonModule } from '@angular/material/button'
import { TranslocoPipe } from '@jsverse/transloco'

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatButtonModule, TranslocoPipe],
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {
  constructor(private readonly router: Router) {}

  goHome(): void {
    this.router.navigate(['/'])
  }
}
