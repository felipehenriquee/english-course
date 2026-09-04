import { Component, HostBinding, Input } from '@angular/core'

export type CardVariant = 'glass' | 'glass-2'

const VARIANT: Record<CardVariant, string> = {
  glass: 'glass',
  'glass-2': 'glass-2',
}

/**
 * Card com fundo `glass`/`glass-2` (ver `styles.css`).
 *
 * Usa `mat-card` traz fundo próprio do tema Material com especificidade maior
 * que as utilities do Tailwind, então essas classes nunca aparecem — por isso
 * este componente é um `<div>` puro em vez de envolver `mat-card`.
 *
 * Layout/espaçamento (`w-full`, `max-w-md`, `rounded-3xl`, `p-8`...) vai
 * direto na tag `<app-card>`, como qualquer elemento Tailwind.
 */
@Component({
  selector: 'app-card',
  standalone: true,
  template: `<ng-content />`,
})
export class CardComponent {
  @Input() variant: CardVariant = 'glass'

  @HostBinding('class')
  get hostClass(): string {
    return VARIANT[this.variant]
  }
}
