import { Component } from '@angular/core';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  closeDialog() {
    // this.dialogMessage.set(null);
  }

  confirmDiscard() {
    // this.dialogMessage.set(null);
    // this.router.navigate(['../']);
  }
}
