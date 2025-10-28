import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private _transitionComplete = signal(false);
  private _preset = signal<string>('');

  transitionComplete() {
    return this._transitionComplete;
  }

  preset() {
    return this._preset;
  }

  setTransitionComplete(value: boolean) {
    this._transitionComplete.set(value);
  }

  setPreset(value: string) {
    this._preset.set(value);
  }
}
