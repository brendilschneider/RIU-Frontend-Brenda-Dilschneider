import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { Superhero } from '../../models/superhero.model';
import { SuperheroesService } from './superheroes-service';
import { LoadingService } from './loading.service';

describe('SuperheroesService', () => {
  let service: SuperheroesService;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    const loadingSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);

    TestBed.configureTestingModule({
      providers: [
        SuperheroesService,
        { provide: LoadingService, useValue: loadingSpy }
      ]
    });

    service = TestBed.inject(SuperheroesService);
    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all heroes via getAllHeroes()', async () => {
    const heroes = await firstValueFrom(service.getAllHeroes());
    expect(heroes.length).toBeGreaterThan(0);
    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
  });

  it('should get hero by id via getHeroById()', async () => {
    const hero = await firstValueFrom(service.getHeroById(1));
    expect(hero).toBeTruthy();
    expect(hero.id).toBe(1);
    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
  });

  it('should throw an error if hero by id is not found', async () => {
    try {
      await firstValueFrom(service.getHeroById(9999));
      fail('Should have thrown an error for non-existent hero');
    } catch (error: any) {
      expect(error.message).toContain('Superhero with id 9999 not found');
      expect(loadingServiceSpy.hide).toHaveBeenCalled();
    }
  });

  it('should filter heroes using search()', async () => {
    const results = await firstValueFrom(service.search('a'));
    expect(results).toBeTruthy();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
  });

  it('should add a new hero and assign an id', async () => {
    const newHeroData: Partial<Superhero> = {
      name: 'Test Hero',
      slug: 'test-hero',
      powerstats: { intelligence: 50, strength: 50, speed: 50, durability: 50, power: 50, combat: 50 },
      appearance: { gender: 'Male', race: 'Human', height: [], weight: [], eyeColor: 'Blue', hairColor: 'Black' },
      biography: { fullName: 'Test', alterEgos: '', aliases: [], placeOfBirth: '', firstAppearance: '', publisher: 'Marvel', alignment: 'good' },
      work: { occupation: 'Hero', base: 'Here' },
      connections: { groupAffiliation: '', relatives: '' },
      images: { xs: '', sm: '', md: '', lg: '' }
    };

    const addedHero = await firstValueFrom(service.add(newHeroData));
    expect(addedHero.id).toBeDefined();
    expect(addedHero.name).toBe('Test Hero');
    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
  });

  it('should update an existing hero', async () => {
    const allHeroes = await firstValueFrom(service.getAllHeroes());
    const targetHero = { ...allHeroes[0], name: 'Updated Name' };

    const result = await firstValueFrom(service.update(targetHero));
    expect(result.name).toBe('Updated Name');
    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
  });

  it('should delete a hero by id', async () => {
    const allBefore = await firstValueFrom(service.getAllHeroes());
    const targetId = allBefore[0].id;

    await firstValueFrom(service.delete(targetId));
    const allAfter = await firstValueFrom(service.getAllHeroes());

    expect(allAfter.length).toBe(allBefore.length - 1);
    expect(allAfter.find(h => h.id === targetId)).toBeUndefined();
    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
  });
});