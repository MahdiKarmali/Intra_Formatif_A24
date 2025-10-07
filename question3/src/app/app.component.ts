import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class AppComponent {
  title = 'reactive.form';



  formGroup: FormGroup;
  minWordsValidator(minWords: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return { minWords: { requiredWords: minWords, actualWords: 0 } };
      // Utilisation de split(" ") comme demandé
      const wordCount = control.value.trim().split(" ").filter((w: string) => w.length > 0).length;
      return wordCount < minWords ? { minWords: { requiredWords: minWords, actualWords: wordCount } } : null;
    };
  }


  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group(
      {
        nom: ['', [Validators.required]],
        roadNumber: ['', [Validators.required, Validators.min(1000), Validators.max(9999)]],
        postalCode: ['', [Validators.pattern('^[A-Z][0-9][A-Z][ ]?[0-9][A-Z][0-9]$')]],
        commentaire: ['', [this.minWordsValidator(10)]],

      },
      { validators: this.commentDoesNotContainNameValidator }
    );
  }

  commentDoesNotContainNameValidator(group: FormGroup): ValidationErrors | null {
    const nom = group.get('nom')?.value?.trim();
    const commentaire = group.get('commentaire')?.value?.trim();
    if (nom && commentaire && commentaire.toLowerCase().includes(nom.toLowerCase())) {
      group.get('commentaire')?.setErrors({ ...group.get('commentaire')?.errors, containsName: true });
      return { containsName: true };
    } else {
      // Retirer l'erreur si elle n'est plus présente
      if (group.get('commentaire')?.hasError('containsName')) {
        const errors = { ...group.get('commentaire')?.errors };
        delete errors['containsName'];
        if (Object.keys(errors).length === 0) {
          group.get('commentaire')?.setErrors(null);
        } else {
          group.get('commentaire')?.setErrors(errors);
        }
      }
      return null;
    }
  }
}


