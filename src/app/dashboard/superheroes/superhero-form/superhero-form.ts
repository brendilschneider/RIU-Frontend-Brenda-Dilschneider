import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SuperheroesService } from '../../../core/services/superheroes-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Superhero } from '../../../models/superhero.model';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  selector: 'app-superhero-form',
  styleUrl: './superhero-form.scss',
  templateUrl: './superhero-form.html',
})
export class SuperheroFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private superheroService = inject(SuperheroesService);
  private snackBar = inject(MatSnackBar);

  heroForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.heroForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      intelligence: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      power: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      fullName: ['', [Validators.required]],
      alignment: ['good'],
    });
  }

  getError(controlName: string): string {
    const control = this.heroForm.get(controlName);
    if (!control?.touched) return '';
    if (control?.hasError('required')) return 'This field is required';
    if (control?.hasError('minlength')) return 'Minimum length not met';
    if (control?.hasError('min')) return 'Minimum value is 0';
    if (control?.hasError('max')) return 'Maximum value is 100';
    return '';
  }

  private buildHero(): Omit<Superhero, 'id'> {
    const f = this.heroForm.value;
    return {
      name: f.name,
      slug: f.slug,
      powerstats: {
        intelligence: f.intelligence,
        strength: f.strength,
        speed: f.speed,
        durability: f.durability,
        power: f.power,
        combat: f.combat,
      },
      appearance: {
        gender: f.gender,
        race: f.race,
        height: [],
        weight: [],
        eyeColor: f.eyeColor,
        hairColor: f.hairColor,
      },
      biography: {
        fullName: f.fullName,
        alterEgos: f.alterEgos,
        aliases: f.aliases
          ? f.aliases.split(',').map((a: string) => a.trim()).filter(Boolean)
          : [],
        placeOfBirth: f.placeOfBirth,
        firstAppearance: f.firstAppearance,
        publisher: f.publisher,
        alignment: f.alignment,
      },
      work: {
        occupation: f.occupation,
        base: f.base,
      },
      connections: {
        groupAffiliation: f.groupAffiliation,
        relatives: f.relatives,
      },
      images: {
        xs: '',
        sm: f.imageUrl,
        md: '',
        lg: '',
      },
    };
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }

    const hero = this.buildHero();

    this.superheroService.add(hero).subscribe({
      next: () => {
        this.snackBar.open('Superhero added!', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: () => {
        this.snackBar.open('Error adding superhero', 'Close', { duration: 3000 });
      }
    });
  }
}