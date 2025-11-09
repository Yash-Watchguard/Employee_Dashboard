import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private _transitionComplete = signal(false);
  private _preset = signal<string>('');

  transitionComplete(): WritableSignal<boolean> {
    return this._transitionComplete;
  }

  preset(): WritableSignal<string> {
    return this._preset;
  }

  setTransitionComplete(value: boolean): void {
    this._transitionComplete.set(value);
  }

  setPreset(value: string): void {
    this._preset.set(value);
  }
}
