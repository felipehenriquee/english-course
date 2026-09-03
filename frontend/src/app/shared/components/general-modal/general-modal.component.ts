import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core'
import { Overlay, OverlayRef } from '@angular/cdk/overlay'
import { TemplatePortal } from '@angular/cdk/portal'
import { A11yModule } from '@angular/cdk/a11y'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { TranslocoPipe } from '@jsverse/transloco'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

/**
 * Modal genérico e reutilizável.
 *
 * - header: título + botão de fechar no canto.
 * - body: projetado via <ng-content> (o "slot" do Vue).
 * - footer: botões Salvar / Cancelar — some quando [showFooter]="false".
 *
 * É renderizado via CDK Overlay (fora do fluxo do <mat-sidenav-content>),
 * então fica acima do menu lateral e da toolbar. Componente CONTROLADO: quem
 * usa liga [open] e reage a (closed) / (cancel) / (save).
 */
@Component({
  selector: 'app-general-modal',
  standalone: true,
  imports: [A11yModule, MatButtonModule, MatIconModule, TranslocoPipe],
  templateUrl: './general-modal.component.html',
})
export class GeneralModalComponent implements OnInit, OnDestroy {
  private readonly overlay = inject(Overlay)
  private readonly viewContainerRef = inject(ViewContainerRef)

  @ViewChild('modalTpl', { static: true }) private modalTpl!: TemplateRef<unknown>

  @Input() title = ''
  /** Largura máxima do modal. */
  @Input() size: ModalSize = 'md'
  @Input() showFooter = true
  /** Sem valor, usa a tradução `common.save`. */
  @Input() saveLabel?: string
  /** Sem valor, usa a tradução `common.cancel`. */
  @Input() cancelLabel?: string
  /** Desabilita o botão Salvar enquanto true (ex: requisição em andamento). */
  @Input() saving = false

  @Output() closed = new EventEmitter<void>()
  @Output() save = new EventEmitter<void>()
  @Output() cancelled = new EventEmitter<void>()

  private overlayRef?: OverlayRef
  private isOpen = false

  @Input()
  set open(value: boolean) {
    this.isOpen = value
    if (value) {
      this.attach()
    } else {
      this.detach()
    }
  }
  get open(): boolean {
    return this.isOpen
  }

  ngOnInit(): void {
    // Cobre o caso de [open]="true" já no primeiro render (o setter roda
    // antes do @ViewChild static estar resolvido).
    if (this.isOpen) {
      this.attach()
    }
  }

  ngOnDestroy(): void {
    this.detach()
  }

  private attach(): void {
    if (this.overlayRef || !this.modalTpl) {
      return
    }

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
    })

    this.overlayRef.attach(new TemplatePortal(this.modalTpl, this.viewContainerRef))
    this.overlayRef.backdropClick().subscribe(() => this.closed.emit())
    this.overlayRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') {
        this.closed.emit()
      }
    })
  }

  private detach(): void {
    this.overlayRef?.dispose()
    this.overlayRef = undefined
  }
}
