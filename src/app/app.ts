import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmationDialogComponent } from './add-recipe/confirmation-dialog/confirmation-dialog.component';
import { DialogService } from './services/dialog.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmationDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private dialogService = inject(DialogService);
  dialogConfig = this.dialogService.config;
  title = signal('Ricettario');

  onReject(response: boolean) {
    this.dialogService.close(response);
  }

  onConfirm(response: boolean) {
    this.dialogService.close(response);
  }
}
