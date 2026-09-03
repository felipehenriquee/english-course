import { Injectable, inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import type { Translation, TranslocoLoader } from '@jsverse/transloco'

/**
 * Carrega os JSONs de tradução de `public/i18n/<lang>.json` (servidos em
 * `/i18n/<lang>.json`). Um arquivo por idioma; namespaces por feature dentro
 * do próprio JSON (nav.*, courses.*, users.*...).
 */
@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient)

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/i18n/${lang}.json`)
  }
}
