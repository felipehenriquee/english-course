import { Component, Input, booleanAttribute } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'

import { Icon } from '@app/shared/icon.enum'

export type ButtonVariant = 'text' | 'filled' | 'outlined'
export type ButtonColor = 'primary' | 'accent' | 'warn' | 'neutral'
export type ButtonSize = 'sm' | 'md' | 'lg'

// preflight do Tailwind está DESLIGADO neste projeto (tailwind.config.ts), então
// cada variante zera explicitamente `border`/`background`/`padding` do <button>.
const BASE =
  'inline-flex items-center justify-center gap-1.5 appearance-none cursor-pointer align-middle ' +
  'font-medium leading-none transition-colors focus:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-brand-500 focus-visible:ring-offset-1 disabled:opacity-50 ' +
  'disabled:pointer-events-none disabled:cursor-default'

const VARIANT_COLOR: Record<ButtonVariant, Record<ButtonColor, string>> = {
  filled: {
    primary: 'border-0 bg-brand-600 text-white hover:bg-brand-700',
    accent: 'border-0 bg-violet-600 text-white hover:bg-violet-700',
    warn: 'border-0 bg-red-600 text-white hover:bg-red-700',
    neutral: 'border-0 bg-slate-700 text-white hover:bg-slate-800',
  },
  outlined: {
    primary: 'border border-solid border-brand-600 bg-transparent text-brand-700 hover:bg-brand-50',
    accent:
      'border border-solid border-violet-600 bg-transparent text-violet-700 hover:bg-violet-50',
    warn: 'border border-solid border-red-600 bg-transparent text-red-700 hover:bg-red-50',
    neutral:
      'border border-solid border-slate-400 bg-transparent text-slate-700 hover:bg-slate-100',
  },
  text: {
    primary: 'border-0 bg-transparent p-0 text-brand-600 hover:underline',
    accent: 'border-0 bg-transparent p-0 text-violet-600 hover:underline',
    warn: 'border-0 bg-transparent p-0 text-red-600 hover:underline',
    neutral: 'border-0 bg-transparent p-0 text-slate-700 hover:underline',
  },
}

/** Altura + padding + fonte para filled/outlined. */
const SIZE: Record<ButtonSize, string> = {
  sm: 'h-8 rounded px-3 text-xs',
  md: 'h-9 rounded-md px-4 text-sm',
  lg: 'h-11 rounded-md px-6 text-base',
}

/** Só o tamanho da fonte para a variante `text` (sem altura/padding — vira link). */
const TEXT_SIZE: Record<ButtonSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

/** Botão só com ícone: caixa redonda. */
const ICON_ONLY_SIZE: Record<ButtonSize, string> = {
  sm: 'h-8 w-8 rounded-full',
  md: 'h-10 w-10 rounded-full',
  lg: 'h-12 w-12 rounded-full',
}

const ICON_ONLY_COLOR: Record<ButtonColor, string> = {
  primary: 'text-brand-700 hover:bg-brand-50',
  accent: 'text-violet-700 hover:bg-violet-50',
  warn: 'text-red-700 hover:bg-red-50',
  neutral: 'text-slate-600 hover:bg-slate-100',
}

const GLYPH: Record<ButtonSize, string> = {
  sm: '!h-[18px] !w-[18px] !text-[18px]',
  md: '!h-[20px] !w-[20px] !text-[20px]',
  lg: '!h-[24px] !w-[24px] !text-[24px]',
}

/**
 * Botão da aplicação.
 *
 * - `variant`: `text` (sem fundo, vira link) · `filled` (com fundo) · `outlined`.
 * - `color`: `primary` · `accent` · `warn` · `neutral`.
 * - `size`: `sm` · `md` · `lg`.
 * - `icon`: só aparece se informado (`Icon.Edit`); `iconPosition` left/right.
 * - `iconOnly`: botão redondo só com o ícone.
 * - `tooltip`: só aparece se informado.
 * - `textColor`: sobrescreve a cor do texto/ícone (qualquer cor CSS).
 *
 * O texto vai por projeção: `<app-button>Salvar</app-button>`.
 * O clique é capturado normalmente com `(click)` no `<app-button>`.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'filled'
  @Input() color: ButtonColor = 'primary'
  @Input() size: ButtonSize = 'md'
  @Input() tooltip?: string
  @Input() icon?: Icon | string
  @Input() iconPosition: 'left' | 'right' = 'left'
  @Input({ transform: booleanAttribute }) iconOnly = false
  /** Sobrescreve a cor do texto/ícone (ex: `#2563eb`, `red`). */
  @Input() textColor?: string
  @Input() type: 'button' | 'submit' | 'reset' = 'button'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) fullWidth = false

  get computedClass(): string {
    if (this.iconOnly) {
      return [
        BASE,
        'shrink-0 border-0 bg-transparent',
        ICON_ONLY_SIZE[this.size],
        ICON_ONLY_COLOR[this.color],
      ].join(' ')
    }

    const sizeClass = this.variant === 'text' ? TEXT_SIZE[this.size] : SIZE[this.size]
    return [
      BASE,
      this.fullWidth ? 'w-full' : '',
      sizeClass,
      VARIANT_COLOR[this.variant][this.color],
    ]
      .filter(Boolean)
      .join(' ')
  }

  get glyphClass(): string {
    return GLYPH[this.size]
  }

  get ariaLabel(): string | null {
    return this.iconOnly ? (this.tooltip ?? null) : null
  }
}
