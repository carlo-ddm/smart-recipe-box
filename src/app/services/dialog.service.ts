import { Injectable, signal } from '@angular/core';
import { ConfirmationDialog } from '../models/diaolog.model';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  readonly config = signal<ConfirmationDialog | null>(null);
  private pending?: Promise<boolean>;
  private resolve?: (value: boolean | PromiseLike<boolean>) => void;

  /**
   * Opens a dialog and returns the pending decision.
   * If a dialog is already open, the same promise is returned.
   */
  confirm(config: ConfirmationDialog): Promise<boolean> {
    if (this.pending) {
      return this.pending;
    }

    this.config.set(config);
    this.pending = new Promise((resolve) => {
      this.resolve = resolve;
    });
    return this.pending;
  }

  /**
   * Closes the dialog and resolves any pending confirmation.
   */
  close(result: boolean) {
    const resolve = this.resolve;
    this.resolve = undefined;
    this.pending = undefined;
    this.config.set(null);
    resolve?.(result);
  }
}
