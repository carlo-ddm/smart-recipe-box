import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialog } from '../models/diaolog.model';

type IngredientControls = {
  name: FormControl<string>;
  quantity: FormControl<number | null>;
  unit: FormControl<string>;
};

@Component({
  selector: 'app-add-recipe',
  imports: [ReactiveFormsModule, ConfirmationDialogComponent],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.scss',
})
export class AddRecipeComponent implements OnInit {
  private router = inject(Router);

  private createIngredientGroup() {
    return new FormGroup<IngredientControls>({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      quantity: new FormControl<number | null>(null, {
        validators: [Validators.required, Validators.min(1)],
      }),
      unit: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  form = new FormGroup({
    recipeName: new FormControl('', { validators: [Validators.required] }),
    recipeImg: new FormControl('', { validators: [Validators.required] }),
    recipeDescription: new FormControl('', { validators: [Validators.required] }),
    recipeServings: new FormControl('', { validators: [Validators.required] }),
    isFavourite: new FormControl(false, { nonNullable: true }),
    ingredients: new FormArray<FormGroup<IngredientControls>>(
      [],
      Validators.minLength(1)
    ),
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

  get ingredients(): FormArray<FormGroup<IngredientControls>> {
    return this.form.controls.ingredients;
  }

  shouldShowIngredientErrors(index: number) {
    const group = this.ingredients.at(index);
    return group.invalid && (group.dirty || group.touched);
  }

  isIngredientControlInvalid(index: number, controlName: keyof IngredientControls) {
    const control = this.ingredients.at(index).controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  isIngredientGroupInvalid(index: number) {
    const group = this.ingredients.at(index);
    return group.invalid && (group.dirty || group.touched);
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

  addIngredient() {
    if (this.ingredients.length > 0) {
      const lastGroup = this.ingredients.at(this.ingredients.length - 1);
      if (lastGroup.invalid) {
        lastGroup.markAllAsTouched();
        this.openSnackbar(
          "Completa l'ingrediente precedente prima di aggiungerne un altro."
        );
        return;
      }
    }

    this.ingredients.push(this.createIngredientGroup());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  onSubmit() {
    console.log(this.form);

    return;
    if (!this.isValidForm) {
      this.form.markAllAsTouched();
      this.openSnackbar('Completa tutti i campi obbligatori prima di salvare.');
      return;
    }
  }
}
