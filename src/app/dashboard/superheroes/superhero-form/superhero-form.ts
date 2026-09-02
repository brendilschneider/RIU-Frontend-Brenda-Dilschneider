import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SuperheroesService } from '../../../core/services/superheroes-service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Superhero } from '../../../models/superhero.model';
import { UppercaseDirective } from '../../../shared/directives/uppercase.directive';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    UppercaseDirective
  ],
  selector: 'app-superhero-form',
  styleUrl: './superhero-form.scss',
  templateUrl: './superhero-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuperheroFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private superheroService = inject(SuperheroesService);
  private snackBar = inject(MatSnackBar);
  private _titleService = inject(Title);

  heroForm!: FormGroup;
  heroId: number = 0;
  isEditMode = false;

  ngOnInit(): void {
    this.initForm();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.heroId = +id;
        this.isEditMode = true;
        this._titleService.setTitle('RIU Frontend | Edit Superhero');
        this.loadHeroData(+id);
      } else {
        this._titleService.setTitle('RIU Frontend | New Superhero');
      }
    });
  }

  private initForm(): void {
    this.heroForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      intelligence: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      strength: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      speed: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      durability: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      power: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      combat: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      gender: [''],
      race: [''],
      eyeColor: [''],
      hairColor: [''],
      fullName: ['', [Validators.required]],
      alterEgos: [''],
      aliases: [''],
      placeOfBirth: [''],
      firstAppearance: [''],
      publisher: [''],
      alignment: ['good'],
      occupation: [''],
      base: [''],
      groupAffiliation: [''],
      relatives: [''],
    });
  }

  private loadHeroData(id: number): void {
    this.superheroService.getHeroById(id).subscribe({
      next: (hero: Superhero) => {
        this.heroForm.patchValue({
          name: hero.name,
          slug: hero.slug,
          imageUrl: hero.images?.sm || '',
          intelligence: hero.powerstats?.intelligence || 0,
          strength: hero.powerstats?.strength || 0,
          speed: hero.powerstats?.speed || 0,
          durability: hero.powerstats?.durability || 0,
          power: hero.powerstats?.power || 0,
          combat: hero.powerstats?.combat || 0,
          gender: hero.appearance?.gender || '',
          race: hero.appearance?.race || '',
          eyeColor: hero.appearance?.eyeColor || '',
          hairColor: hero.appearance?.hairColor || '',
          fullName: hero.biography?.fullName || '',
          alterEgos: hero.biography?.alterEgos || '',
          aliases: hero.biography?.aliases?.join(', ') || '',
          placeOfBirth: hero.biography?.placeOfBirth || '',
          firstAppearance: hero.biography?.firstAppearance || '',
          publisher: hero.biography?.publisher || '',
          alignment: hero.biography?.alignment || 'good',
          occupation: hero.work?.occupation || '',
          base: hero.work?.base || '',
          groupAffiliation: hero.connections?.groupAffiliation || '',
          relatives: hero.connections?.relatives || '',
        });
      },
      error: () => {
        this.snackBar.open('Error loading superhero data', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
      }
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

  private buildHero(): Superhero {
    const f = this.heroForm.value;
    return {
      id: this.isEditMode ? this.heroId : 0,
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

    if (this.isEditMode && this.heroId) {
      this.superheroService.update(hero).subscribe({
        next: () => {
          this.snackBar.open('Superhero updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/']);
        },
        error: () => {
          this.snackBar.open('Error updating superhero', 'Close', { duration: 3000 });
        }
      });
    } else {
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

}