import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  forwardRef,
} from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
import { Jodit } from 'jodit'

/**
 * Editor de texto rico (WYSIWYG) baseado no Jodit, exposto como
 * ControlValueAccessor — use com `[formControl]` / `[(ngModel)]`. O valor
 * lido/escrito é o HTML do conteúdo.
 *
 * A toolbar traz o seletor de tamanho de fonte em px (`fontsize`), que no
 * Jodit já aplica `style="font-size: NNpx"` inline — o px acompanha o HTML
 * salvo e é renderizado igual na tela de leitura.
 */
@Component({
  selector: 'app-rich-editor',
  standalone: true,
  template: '<textarea #host></textarea>',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichEditorComponent),
      multi: true,
    },
  ],
})
export class RichEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @ViewChild('host', { static: true }) private host!: ElementRef<HTMLTextAreaElement>

  @Input() placeholder = ''
  @Input() minHeight = 320

  private editor?: Jodit
  private value = ''
  private onChange: (value: string) => void = () => {}
  private onTouched: () => void = () => {}

  ngAfterViewInit(): void {
    this.editor = Jodit.make(this.host.nativeElement, {
      placeholder: this.placeholder,
      minHeight: this.minHeight,
      toolbarAdaptive: false,
      statusbar: false,
      buttons: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'fontsize',
        'paragraph',
        'brush',
        '|',
        'ul',
        'ol',
        '|',
        'left',
        'center',
        'right',
        '|',
        'link',
        '|',
        'undo',
        'redo',
        '|',
        'eraser',
      ],
    })

    this.editor.value = this.value
    this.editor.events.on('change', (newValue: string) => {
      if (newValue === this.value) return
      this.value = newValue
      this.onChange(newValue)
    })
    this.editor.events.on('blur', () => this.onTouched())
  }

  ngOnDestroy(): void {
    this.editor?.destruct()
  }

  writeValue(value: string | null): void {
    this.value = value ?? ''
    if (this.editor && this.editor.value !== this.value) {
      this.editor.value = this.value
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.editor?.setReadOnly(isDisabled)
  }
}
