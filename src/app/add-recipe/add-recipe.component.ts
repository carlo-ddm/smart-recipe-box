import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';
import { CreateRecipeInput, RecipeModel, Unit } from '../models/recipe.models';
import { DialogService } from '../services/dialog.service';

type IngredientControls = {
  name: FormControl<string>;
  quantity: FormControl<number>;
  unit: FormControl<Unit>;
};

type RecipeFormGroup = FormGroup<{
  name: FormControl<string>;
  imgUrl: FormControl<string>;
  description: FormControl<string>;
  servings: FormControl<number>;
  isFavourite: FormControl<boolean>;
  ingredients: FormArray<FormGroup<IngredientControls>>;
}>;

@Component({
  selector: 'app-add-recipe',
  imports: [ReactiveFormsModule],
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.scss',
})
export class AddRecipeComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private recipeService = inject(RecipeService);
  private dialogService = inject(DialogService);
  private isEdit = signal<boolean>(false);
  recipe = signal<RecipeModel | null>(null);

  /**
   * Builds a new ingredient form group with defaults and validators.
   */
  private createIngredientGroup() {
    return new FormGroup<IngredientControls>({
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      quantity: new FormControl(1, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
      unit: new FormControl<Unit>('g', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  form: RecipeFormGroup = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    imgUrl: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    servings: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    isFavourite: new FormControl(false, { nonNullable: true }),
    ingredients: new FormArray<FormGroup<IngredientControls>>([], Validators.minLength(1)),
  });

  protected readonly snackbarMessage = signal<string | null>(null);
  private snackbarTimeoutId: number | null = null;

  ngOnInit(): void {
    const value = this.route.snapshot.paramMap.get('rId');
    if (!value) {
      this.resetFormForCreate();
      return;
    }

    const id = Number(value);
    if (!Number.isFinite(id)) {
      this.resetFormForCreate();
      return;
    }

    const recipe = this.recipeService.getRecipe(id);
    if (!recipe) {
      this.openSnackbar('Ricetta non trovata.');
      this.resetFormForCreate();
      return;
    }

    this.setFormFromRecipe(recipe);
  }

  /**
   * Resets the form for the create flow and clears any ingredient rows.
   */
  private resetFormForCreate() {
    this.isEdit.set(false);
    this.recipe.set(null);
    this.form.reset({
      name: '',
      imgUrl: '',
      description: '',
      servings: 1,
      isFavourite: false,
    });
    this.form.controls.ingredients.clear();
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  /**
   * Populates the form from an existing recipe and rebuilds ingredient rows.
   */
  private setFormFromRecipe(recipe: RecipeModel) {
    this.isEdit.set(true);
    this.recipe.set(recipe);
    this.form.reset({
      name: recipe.name,
      imgUrl: recipe.imgUrl,
      description: recipe.description,
      servings: recipe.servings,
      isFavourite: recipe.isFavourite,
    });
    this.form.controls.ingredients.clear();
    for (const ingredient of recipe.ingredients) {
      const group = this.createIngredientGroup();
      group.patchValue({
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
      });
      this.form.controls.ingredients.push(group);
    }
    this.form.markAsPristine();
    this.form.markAsUntouched();
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

  /**
   * Shows a temporary message and resets the timeout if called again.
   */
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

  /**
   * Prompts before discarding changes when the form is dirty.
   */
  openConfirmDiscardDialog() {
    if (!this.form.dirty) {
      this.router.navigate(['../']);
      return;
    }

    this.dialogService
      .confirm({
        title: 'Modifiche non salvate',
        message: 'Confermi di voler annullare le modifiche per la creazione della tua ricetta?',
        confirmText: 'Conferma',
        cancelText: 'Annulla',
        variant: 'default',
      })
      .then((confirmed) => {
        if (confirmed) {
          this.router.navigate(['../']);
        }
      });
  }

  /**
   * Adds a new ingredient row only after the previous one is valid.
   */
  addIngredient() {
    if (this.ingredients.length > 0) {
      const lastGroup = this.ingredients.at(this.ingredients.length - 1);
      if (lastGroup.invalid) {
        lastGroup.markAllAsTouched();
        this.openSnackbar("Completa l'ingrediente precedente prima di aggiungerne un altro.");
        return;
      }
    }

    this.ingredients.push(this.createIngredientGroup());
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  onSubmit() {
    if (!this.isValidForm) {
      this.form.markAllAsTouched();
      this.openSnackbar('Completa tutti i campi obbligatori prima di salvare.');
      return;
    }

    const getRecipeType = (): RecipeModel | CreateRecipeInput => {
      return this.isEdit()
        ? { ...this.form.getRawValue(), id: this.recipe()?.id }
        : this.form.getRawValue();
    };

    this.recipeService.inserOrUpdatewRecipe(getRecipeType(), this.isEdit());
  }
}
