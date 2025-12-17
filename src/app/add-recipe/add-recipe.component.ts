import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialog } from '../models/diaolog.model';

@Component({
  selector: 'app-add-recipe',
  imports: [ReactiveFormsModule, ConfirmationDialogComponent],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.scss',
})
export class AddRecipeComponent implements OnInit {
  private router = inject(Router);
  // private route = inject(ActivatedRoute);

  form = new FormGroup({
    recipeName: new FormControl('', { validators: [Validators.required] }),
    recipeImg: new FormControl('', { validators: [Validators.required] }),
    recipeDescription: new FormControl('', { validators: [Validators.required] }),
    recipeServings: new FormControl('', { validators: [Validators.required] }),
    isFavourite: new FormControl(false, { nonNullable: true }),
  });

  protected readonly confirmationDialog = signal<ConfirmationDialog | null>(null);
  protected readonly snackbarMessage = signal<string | null>(null);
  private snackbarTimeoutId: number | null = null;

  ngOnInit(): void {
    // Intentionally empty.
  }

  get isValidForm() {
    return this.form.valid;
  }

  markAsFavurite(event: Event) {
    const isChecked = (event.target as HTMLInputElement | null)?.checked ?? false;
    this.form.controls.isFavourite.setValue(isChecked);
  }

  private openSnackbar(message: string) {
    this.snackbarMessage.set(message);
    if (this.snackbarTimeoutId !== null) {
      window.clearTimeout(this.snackbarTimeoutId);
    }
    this.snackbarTimeoutId = window.setTimeout(() => {
      this.snackbarMessage.set(null);
      this.snackbarTimeoutId = null;
    }, 2600);
  }

  openConfirmDiscardDialog() {
    if (this.form.dirty) {
      const dialogConfig: ConfirmationDialog = {
        title: 'Modifiche non salvate',
        message:
          'Hai modificato la ricetta ma non l’hai salvata. Vuoi davvero scartare le modifiche?',
        action: (confirmed: boolean) => {
          if (confirmed) this.router.navigate(['../']);
        },
      };

      this.confirmationDialog.set(dialogConfig);
      return;
    }

    this.router.navigate(['../']);
  }

  protected handleDialogDecision(confirmed: boolean) {
    const config = this.confirmationDialog();
    this.confirmationDialog.set(null);
    config?.action(confirmed);
  }

  onSubmit() {
    if (!this.isValidForm) {
      this.form.markAllAsTouched();
      this.openSnackbar('Completa tutti i campi obbligatori prima di salvare.');
      return;
    }
  }
}
