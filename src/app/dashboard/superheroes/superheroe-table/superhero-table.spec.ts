import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperheroTableComponent } from './superhero-table';
import { Superhero } from '../../../models/superhero.model';
import { SuperheroesService } from '../../../core/services/superheroes-service';
import { DialogService } from '../../../shared/confirm-dialog/confirm-dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter, Router } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

const mockHero = (id: number, name: string): Superhero => ({
  id,
  name,
  slug: name.toLowerCase().replace(' ', '-'),
  powerstats: { intelligence: 80, strength: 90, speed: 70, durability: 85, power: 95, combat: 75 },
  appearance: { gender: 'Male', race: 'Human', height: [], weight: [], eyeColor: 'Blue', hairColor: 'Black' },
  biography: { fullName: name, alterEgos: '', aliases: [], placeOfBirth: '', firstAppearance: '', publisher: 'Marvel', alignment: 'good' },
  work: { occupation: 'Hero', base: 'New York' },
  connections: { groupAffiliation: 'Avengers', relatives: '' },
  images: { xs: '', sm: 'https://img.com/sm.jpg', md: '', lg: '' }
});

const MOCK_HEROES: Superhero[] = [
  mockHero(1, 'Iron Man'),
  mockHero(2, 'Superman'),
  mockHero(3, 'Spiderman'),
];

describe('SuperheroTableComponent', () => {
  let component: SuperheroTableComponent;
  let fixture: ComponentFixture<SuperheroTableComponent>;
  let superheroService: jasmine.SpyObj<SuperheroesService>;
  let dialogService: jasmine.SpyObj<DialogService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    superheroService = jasmine.createSpyObj('SuperheroesService', ['getAllHeroes', 'delete']);
    dialogService = jasmine.createSpyObj('DialogService', ['openDeleteConfirm']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    superheroService.getAllHeroes.and.returnValue(of(MOCK_HEROES));
    await TestBed.configureTestingModule({
      imports: [SuperheroTableComponent, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: SuperheroesService, useValue: superheroService },
        { provide: DialogService, useValue: dialogService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: Router, useValue: router },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load heroes on init', () => {
      expect(superheroService.getAllHeroes).toHaveBeenCalledTimes(1);
      expect(component.heroes()).toEqual(MOCK_HEROES);
    });

    it('should initialize with default pagination values', () => {
      expect(component.pageIndex()).toBe(0);
      expect(component.pageSize()).toBe(10);
    });

    it('should set isLoading to false and handle error when getAllHeroes fails', async () => {
      const errorService = jasmine.createSpyObj('SuperheroesService', ['getAllHeroes', 'delete']);
      errorService.getAllHeroes.and.returnValue(throwError(() => new Error('API Error')));

      const errFixture = TestBed.createComponent(SuperheroTableComponent);
      const errComponent = errFixture.componentInstance;
      
      // Sobrescribimos temporalmente el servicio inyectado para este componente aislado
      (errComponent as any).superheroService = errorService;
      
      errComponent.ngOnInit();
      expect(errComponent.isLoading()).toBeFalse();
    });
  });

  describe('computed signals', () => { 
    it('filteredHeroes should return all heroes when search is empty', () => {
      expect(component.filteredHeroes().length).toBe(3);
    });

    it('filteredHeroes should filter by name case insensitive', () => {
      component.onSearch('iron');
      expect(component.filteredHeroes().length).toBe(1);
      expect(component.filteredHeroes()[0].name).toBe('Iron Man');
    });

    it('filteredHeroes should return empty array when no match', () => {
      component.onSearch('Batman');
      expect(component.filteredHeroes().length).toBe(0);
    });

    it('filteredHeroes should match partial name - Iron man and spiderman', () => {
      component.onSearch('super');
      expect(component.filteredHeroes().length).toBe(1);
      expect(component.filteredHeroes()[0].name).toBe('Superman');
    });

    it('totalHeroes should reflect filtered count', () => {
      expect(component.totalHeroes()).toBe(3);
      component.onSearch('iron');
      expect(component.totalHeroes()).toBe(1);
    });

    it('paginatedHeroes should return second page correctly', () => {
      component.pageIndex.set(1);
      component.pageSize.set(2);
      expect(component.paginatedHeroes().length).toBe(1);
      expect(component.paginatedHeroes()[0].name).toBe('Spiderman');
    });
  });

  describe('onSearch', () => {
    it('should update searchQuery signal', () => {
      component.onSearch('Superman');
      expect(component.searchQuery()).toBe('Superman');
    });

    it('should reset pageIndex to 0 on search', () => {
      component.pageIndex.set(2);
      component.onSearch('man');
      expect(component.pageIndex()).toBe(0);
    });
  });

  describe('onPageChange', () => {
    it('should update pageIndex and pageSize', () => {
      const event: PageEvent = { pageIndex: 2, pageSize: 20, length: 100 };
      component.onPageChange(event);
      expect(component.pageIndex()).toBe(2);
      expect(component.pageSize()).toBe(20);
    });
  });

  describe('navigation and dialogs', () => {
    it('addNewHero should navigate to /hero/new', () => {
      component.addNewHero();
      expect(router.navigate).toHaveBeenCalledWith(['/hero/new']);
    });

    it('editHero should navigate to /hero/:id', () => {
      component.editHero(MOCK_HEROES[0]);
      expect(router.navigate).toHaveBeenCalledWith(['/hero', 1]);
    });

    it('should open MatDialog when viewing hero details', () => {
      const dialogSpy = spyOn(component['dialog'], 'open').and.returnValue({} as any);
      component.viewHeroDetails(MOCK_HEROES[0]);
      expect(dialogSpy).toHaveBeenCalled();
    });
  });

  describe('deleteHero', () => {
    it('should open confirm dialog with hero name', () => {
      dialogService.openDeleteConfirm.and.returnValue(of(false));
      component.deleteHero(MOCK_HEROES[0]);
      expect(dialogService.openDeleteConfirm).toHaveBeenCalledWith('Iron Man');
    });

    it('should NOT call delete service when dialog is cancelled', () => {
      dialogService.openDeleteConfirm.and.returnValue(of(false));
      component.deleteHero(MOCK_HEROES[0]);
      expect(superheroService.delete).not.toHaveBeenCalled();
    });

    it('should call delete service when dialog is confirmed', () => {
      dialogService.openDeleteConfirm.and.returnValue(of(true));
      superheroService.delete.and.returnValue(of(void 0));
      component.deleteHero(MOCK_HEROES[0]);
      expect(superheroService.delete).toHaveBeenCalledWith(1);
    });

    it('should remove hero from list after successful delete', () => {
      dialogService.openDeleteConfirm.and.returnValue(of(true));
      superheroService.delete.and.returnValue(of(void 0));
      component.deleteHero(MOCK_HEROES[0]);
      expect(component.heroes().find(h => h.id === 1)).toBeUndefined();
      expect(component.heroes().length).toBe(2);
    });

    it('should NOT remove hero from list when delete fails', () => {
      dialogService.openDeleteConfirm.and.returnValue(of(true));
      superheroService.delete.and.returnValue(throwError(() => new Error()));
      component.deleteHero(MOCK_HEROES[0]);
      expect(component.heroes().length).toBe(3);
    });
  });
});