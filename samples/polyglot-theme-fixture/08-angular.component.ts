import { ChangeDetectionStrategy, Component, signal } from "@angular/core";

@Component({
  selector: "app-status",
  template: `<button (click)="toggle()">{{ active() ? 'Active' : 'Paused' }}</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusComponent {
  readonly active = signal(true);
  toggle() { this.active.update((value) => !value); }
}
