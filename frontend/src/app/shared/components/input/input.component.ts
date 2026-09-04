import { Component, Input, Optional, Self, booleanAttribute } from '@angular/core'
import { ControlValueAccessor, NgControl } from '@angular/forms'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'

import { ButtonComponent } from '@app/shared/components/button/button.component'
import { color } from '@app/core/constants/colors'

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'search'

/**
 * Input padrão da aplicação — por dentro é um `mat-form-field`, mas o
 * resto do app usa só `<app-input>` (com `formControlName`/`[formControl]`
 * normalmente, igual um `matInput` nativo), sem lidar com `mat-label`/
 * `mat-error`/toggle de senha em cada tela — mesma ideia do `v-text-field`
 * do Vuetify.
 *
 * Implementa `ControlValueAccessor` se auto-registrando no `NgControl` do
 * host (`@Self()`), então `invalid`/`touched` vêm de graça do form.
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, ButtonComponent],
  templateUrl: './input.component.html',
  host: { class: 'block' },
})
export class InputComponent implements ControlValueAccessor {
  readonly color = color

  @Input() label = ''
  @Input() type: InputType = 'text'
  @Input() appearance: 'fill' | 'outline' = 'outline'
  @Input() placeholder = ''
  @Input() autocomplete = 'off'
  @Input() hint?: string
  /** Mensagem exibida quando o control estiver inválido e tocado. */
  @Input() errorMessage?: string
  /** Ícone (`mat-icon`) fixo antes do campo, ex: `search`. */
  @Input() prefixIcon?: string
  @Input({ transform: booleanAttribute }) multiline = false
  @Input() rows = 3
  @Input() subscriptSizing: 'fixed' | 'dynamic' = 'fixed'
  @Input({ transform: booleanAttribute }) disabled = false

  value = ''
  hidePassword = true

  private onChange: (value: string) => void = () => {}
  private onTouchedFn: () => void = () => {}

  constructor(@Optional() @Self() private readonly ngControl?: NgControl) {
    if (this.ngControl) this.ngControl.valueAccessor = this
  }

  get inputType(): string {
    return this.type === 'password' && !this.hidePassword ? 'text' : this.type
  }

  get showError(): boolean {
    const control = this.ngControl?.control
    return !!this.errorMessage && !!control?.invalid && !!(control?.touched || control?.dirty)
  }

  onInput(value: string): void {
    this.value = value
    this.onChange(value)
  }

  onBlur(): void {
    this.onTouchedFn()
  }

  writeValue(value: string): void {
    this.value = value ?? ''
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }
}
