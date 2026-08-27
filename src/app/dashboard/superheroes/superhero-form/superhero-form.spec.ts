import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperheroFormComponent } from './superhero-form';
import { SuperheroesService } from '../../../core/services/superheroes-service';
import { provideRouter, Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { Superhero } from '../../../models/superhero.model';

const mockHero: Superhero = {
  id: 1,
  name: 'Iron Man',
  slug: 'iron-man',
  powerstats: { intelligence: 90, strength: 85, speed: 80, durability: 85, power: 100, combat: 70 },
  appearance: { gender: 'Male', race: 'Human', height: [], weight: [], eyeColor: 'Blue', hairColor: 'Black' },
  biography: { fullName: 'Tony Stark', alterEgos: '', aliases: ['Genius'], placeOfBirth: 'New York', firstAppearance: 'Tales of Suspense #39', publisher: 'Marvel', alignment: 'good' },
  work: { occupation: 'Inventor', base: 'Malibu' },
  connections: { groupAffiliation: 'Avengers', relatives: '' },
  images: { xs: '', sm: 'https://img.com/sm.jpg', md: '', lg: '' }
};

describe('SuperheroFormComponent', () => {
  let component: SuperheroFormComponent;
  let fixture: ComponentFixture<SuperheroFormComponent>;
  let superheroService: jasmine.SpyObj<SuperheroesService>;
  let router: jasmine.SpyObj<Router>;

  describe('Creation Mode (Default)', () => {
    beforeEach(async () => {
      superheroService = jasmine.createSpyObj('SuperheroesService', ['add', 'getHeroById']);
      router = jasmine.createSpyObj('Router', ['navigate']);

      await TestBed.configureTestingModule({
        imports: [SuperheroFormComponent, NoopAnimationsModule],
        providers: [
          provideRouter([]),
          { provide: SuperheroesService, useValue: superheroService },
          { provide: Router, useValue: router },
          {
            provide: ActivatedRoute,
            useValue: { paramMap: of(new Map()) }
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(SuperheroFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create the component in creation mode', () => {
      expect(component).toBeTruthy();
      expect(component.isEditMode).toBeFalse();
    });

    it('should initialize form with default values and invalid state', () => {
      expect(component.heroForm.valid).toBeFalse();
      expect(component.heroForm.get('alignment')?.value).toBe('good');
      expect(component.heroForm.get('intelligence')?.value).toBe(0);
    });

    it('should navigate home on cancel', () => {
      component.onCancel();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should mark all fields as touched if form is invalid on submit', () => {
      component.onSubmit();
      expect(component.heroForm.touched).toBeTrue();
      expect(superheroService.add).not.toHaveBeenCalled();
    });

    it('should call add service and navigate on valid form submit', async () => {
      superheroService.add.and.returnValue(of(mockHero));
      
      component.heroForm.patchValue({
        name: 'Spider-Man',
        slug: 'spider-man',
        imageUrl: 'http://img.com/spider.jpg',
        intelligence: 80,
        power: 75,
        fullName: 'Peter Parker',
        alignment: 'good'
      });

      component.onSubmit();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(superheroService.add).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle error when add service fails without breaking', async () => {
      superheroService.add.and.returnValue(throwError(() => new Error('API Error')));
      
      component.heroForm.patchValue({
        name: 'Spider-Man',
        slug: 'spider-man',
        imageUrl: 'http://img.com/spider.jpg',
        intelligence: 80,
        power: 75,
        fullName: 'Peter Parker',
        alignment: 'good'
      });

      component.onSubmit();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(superheroService.add).toHaveBeenCalled();
    });

    it('should return correct error messages in getError()', () => {
      const nameControl = component.heroForm.get('name');
      
      expect(component.getError('name')).toBe('');

      nameControl?.markAsTouched();
      nameControl?.setValue('');
      expect(component.getError('name')).toBe('This field is required');

      nameControl?.setValue('A');
      expect(component.getError('name')).toBe('Minimum length not met');

      const intControl = component.heroForm.get('intelligence');
      intControl?.markAsTouched();
      intControl?.setValue(-5);
      expect(component.getError('intelligence')).toBe('Minimum value is 0');

      intControl?.setValue(150);
      expect(component.getError('intelligence')).toBe('Maximum value is 100');

      expect(component.getError('nonExistent')).toBe('');
    });
  });

  describe('Edit Mode & Data Loading', () => {
    it('should load hero data successfully in edit mode', async () => {
      const editService = jasmine.createSpyObj('SuperheroesService', ['update', 'getHeroById', 'add']);
      editService.getHeroById.and.returnValue(of(mockHero));
      const editRouter = jasmine.createSpyObj('Router', ['navigate']);

      await TestBed.configureTestingModule({
        imports: [SuperheroFormComponent, NoopAnimationsModule],
        providers: [
          provideRouter([]),
          { provide: SuperheroesService, useValue: editService },
          { provide: Router, useValue: editRouter },
          {
            provide: ActivatedRoute,
            useValue: { paramMap: of(new Map([['id', '1']])) }
          }
        ]
      }).compileComponents();

      const editFixture = TestBed.createComponent(SuperheroFormComponent);
      const editComponent = editFixture.componentInstance;

      editFixture.detectChanges();
      await editFixture.whenStable();

      expect(editComponent.isEditMode).toBeTrue();
      expect(editComponent.heroId).toBe(1);
      expect(editService.getHeroById).toHaveBeenCalledWith(1);
      expect(editComponent.heroForm.get('name')?.value).toBe('Iron Man');
    });

    it('should handle error when loading hero data fails and navigate home', async () => {
      const editService = jasmine.createSpyObj('SuperheroesService', ['update', 'getHeroById']);
      editService.getHeroById.and.returnValue(throwError(() => new Error('Not found')));
      const editRouter = jasmine.createSpyObj('Router', ['navigate']);

      await TestBed.configureTestingModule({
        imports: [SuperheroFormComponent, NoopAnimationsModule],
        providers: [
          provideRouter([]),
          { provide: SuperheroesService, useValue: editService },
          { provide: Router, useValue: editRouter },
          {
            provide: ActivatedRoute,
            useValue: { paramMap: of(new Map([['id', '999']])) }
          }
        ]
      }).compileComponents();

      const editFixture = TestBed.createComponent(SuperheroFormComponent);
      editFixture.detectChanges();
      await editFixture.whenStable();

      expect(editRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should call update service on submit when in edit mode', async () => {
      const editService = jasmine.createSpyObj('SuperheroesService', ['update', 'getHeroById']);
      editService.getHeroById.and.returnValue(of(mockHero));
      editService.update.and.returnValue(of(mockHero));
      const editRouter = jasmine.createSpyObj('Router', ['navigate']);

      await TestBed.configureTestingModule({
        imports: [SuperheroFormComponent, NoopAnimationsModule],
        providers: [
          provideRouter([]),
          { provide: SuperheroesService, useValue: editService },
          { provide: Router, useValue: editRouter },
          {
            provide: ActivatedRoute,
            useValue: { paramMap: of(new Map([['id', '1']])) }
          }
        ]
      }).compileComponents();

      const editFixture = TestBed.createComponent(SuperheroFormComponent);
      const editComponent = editFixture.componentInstance;

      editFixture.detectChanges();
      await editFixture.whenStable();

      editComponent.onSubmit();
      editFixture.detectChanges();
      await editFixture.whenStable();

      expect(editService.update).toHaveBeenCalled();
      expect(editRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle error when update fails without breaking', async () => {
      const editService = jasmine.createSpyObj('SuperheroesService', ['update', 'getHeroById']);
      editService.getHeroById.and.returnValue(of(mockHero));
      editService.update.and.returnValue(throwError(() => new Error('Update error')));
      const editRouter = jasmine.createSpyObj('Router', ['navigate']);

      await TestBed.configureTestingModule({
        imports: [SuperheroFormComponent, NoopAnimationsModule],
        providers: [
          provideRouter([]),
          { provide: SuperheroesService, useValue: editService },
          { provide: Router, useValue: editRouter },
          {
            provide: ActivatedRoute,
            useValue: { paramMap: of(new Map([['id', '1']])) }
          }
        ]
      }).compileComponents();

      const editFixture = TestBed.createComponent(SuperheroFormComponent);
      const editComponent = editFixture.componentInstance;

      editFixture.detectChanges();
      await editFixture.whenStable();

      editComponent.onSubmit();
      editFixture.detectChanges();
      await editFixture.whenStable();

      expect(editService.update).toHaveBeenCalled();
    });
  });
});