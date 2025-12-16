import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

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

  protected readonly dialogMessage = signal<string | null>(null);
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

  private openDialog(dialogConfig: { message: string; confirm: boolean; action: () => {} }) {
    this.dialogMessage.set(dialogConfig.message);
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

  onBackToList() {
    console.log(this.form.invalid);

    if (this.form.invalid) {
      const dialogConfig = {
        message: 'You have unsaved changes. Are you sure you want to discard them?',
        confirm: null,
        action: (_v: boolean) => {},
      };
      // this.openDialog(dialogConfig);
      // return;
    }

    this.router.navigate(['../']);
  }

  closeDialog() {
    this.dialogMessage.set(null);
  }

  confirmDiscard() {
    this.dialogMessage.set(null);
    this.router.navigate(['../']);
  }

  onSubmit() {
    if (!this.isValidForm) {
      this.form.markAllAsTouched();
      this.openSnackbar('Please complete all required fields before saving.');
      return;
    }
  }
}
