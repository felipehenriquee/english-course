import { Component, Input, booleanAttribute } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'
import { MatTooltipModule } from '@angular/material/tooltip'

import { Icon } from '@app/shared/icon.enum'
import { color } from '@app/core/constants/colors'

export type ButtonVariant = 'text' | 'filled' | 'outlined'
export type ButtonSize = 'sm' | 'md' | 'lg'

// preflight do Tailwind está DESLIGADO neste projeto (tailwind.config.ts), então
// cada variante zera explicitamente `border`/`background`/`padding` do <button>.
const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ' +
  'font-display-700 !text-[16px] cursor-pointer transition-colors duration-300 ' +
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none ' +
  'disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'

/**
 * Classe marcadora lida pelo CSS do componente (`styles`): no hover, pinta o
 * background com a própria `--btn-color` (a `color` do botão) a 16% —
 * mesma técnica do `color-mix` usado em `bg-scene`. Só faz sentido pra
 * variantes sem fundo sólido próprio (outlined/text/iconOnly) — `filled` já
 * tem cor de fundo e usa `hover:brightness-90` em vez disso.
 */
const HOVER_TINT = 'hover-tint'

/** Estrutura (borda/fundo/hover) de cada variante — a cor em si vem de `color`/`textColor`. */
const VARIANT_STRUCTURE: Record<ButtonVariant, string> = {
  filled: 'border-0 hover:brightness-90',
  outlined: `border border-solid bg-transparent ${HOVER_TINT}`,
  text: `border-0 bg-transparent p-0 hover:underline ${HOVER_TINT}`,
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

const GLYPH: Record<ButtonSize, string> = {
  sm: '!h-[18px] !w-[18px] !text-[18px]',
  md: '!h-[20px] !w-[20px] !text-[20px]',
  lg: '!h-[24px] !w-[24px] !text-[24px]',
}

/**
 * Botão da aplicação.
 *
 * - `variant`: `text` (sem fundo, vira link) · `filled` (com fundo) · `outlined`.
 * - `color`: cor CSS (hex/rgb/nome) — normalmente uma das `color.*` de
 *   `@app/core/constants/colors` (ex: `color.primary`, `color.danger700`).
 *   Vira `background-color` (filled), `border-color`+`color` (outlined) ou
 *   `color` (text/iconOnly). Default: `color.primary`.
 * - `textColor`: sobrescreve só o texto/ícone (ex: pra manter texto escuro
 *   sobre um fundo `filled` claro, como `color.primary`).
 * - `size`: `sm` · `md` · `lg`.
 * - `icon`: só aparece se informado (`Icon.Edit`); `iconPosition` left/right.
 * - `iconOnly`: botão redondo só com o ícone.
 * - `tooltip`: só aparece se informado.
 * - `pill`: cantos totalmente arredondados.
 * - `extraClass`: classes extras no `<button>` interno (ex: altura pontual).
 *
 * Fonte é sempre Space Grotesk 700 / 16px (`BASE`) — não é por `size`, então
 * não muda entre `sm`/`md`/`lg`.
 *
 * O texto vai por projeção: `<app-button>Salvar</app-button>`.
 * O clique é capturado normalmente com `(click)` no `<app-button>`.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './button.component.html',
  styles: `
    .${HOVER_TINT}:hover {
      background-color: color-mix(in oklab, var(--btn-color) 16%, transparent);
    }
  `,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'filled'
  @Input() color: string = color.primary
  @Input() size: ButtonSize = 'md'
  @Input() tooltip?: string
  @Input() icon?: Icon | string
  @Input() iconPosition: 'left' | 'right' = 'left'
  @Input({ transform: booleanAttribute }) iconOnly = false
  /** Sobrescreve a cor do texto/ícone (ex: `color.neutral900`, `#fff`). */
  @Input() textColor?: string
  @Input() type: 'button' | 'submit' | 'reset' = 'button'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input({ transform: booleanAttribute }) fullWidth = false
  /** Cantos totalmente arredondados (pill), no lugar do `rounded-md`/`rounded` padrão. */
  @Input({ transform: booleanAttribute }) pill = false
  /** Classes extras aplicadas no `<button>` interno (ex: fonte/altura pontuais). Use `!` pra vencer `size`. */
  @Input() extraClass = ''
  /** Ex: `-1` pra tirar do fluxo de tab (botão auxiliar dentro de outro control). */
  @Input() tabIndex?: number

  get computedClass(): string {
    if (this.iconOnly) {
      return [
        BASE,
        `shrink-0 border-0 bg-transparent ${HOVER_TINT}`,
        ICON_ONLY_SIZE[this.size],
        this.extraClass,
      ]
        .filter(Boolean)
        .join(' ')
    }

    const sizeClass = this.variant === 'text' ? TEXT_SIZE[this.size] : SIZE[this.size]
    return [
      BASE,
      this.fullWidth ? 'w-full' : '',
      sizeClass,
      VARIANT_STRUCTURE[this.variant],
      this.pill ? '!rounded-full' : '',
      this.extraClass,
    ]
      .filter(Boolean)
      .join(' ')
  }

  get computedStyle(): Record<string, string> {
    // --btn-color alimenta o color-mix() do hover (ver `styles` do @Component).
    const base = { '--btn-color': this.color }
    if (this.iconOnly || this.variant === 'text') {
      return { ...base, color: this.textColor ?? this.color }
    }
    if (this.variant === 'outlined') {
      return { ...base, 'border-color': this.color, color: this.textColor ?? this.color }
    }
    return { ...base, 'background-color': this.color, color: this.textColor ?? '#ffffff' }
  }

  get glyphClass(): string {
    return GLYPH[this.size]
  }

  get ariaLabel(): string | null {
    return this.iconOnly ? (this.tooltip ?? null) : null
  }
}
