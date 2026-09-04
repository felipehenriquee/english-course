import { bootstrapApplication } from '@angular/platform-browser'
import { appConfig } from '@app/app.config'
import { AppComponent } from '@app/app.component'
import { resolveInitialTheme } from '@app/core/theme/theme'

// Aplica o tema antes do bootstrap do Angular pra não piscar o tema errado
// (ThemeStore reaplica isso reativamente depois, mas o primeiro paint precisa
// disso síncrono).
document.documentElement.classList.toggle('dark', resolveInitialTheme() === 'dark')

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err))
