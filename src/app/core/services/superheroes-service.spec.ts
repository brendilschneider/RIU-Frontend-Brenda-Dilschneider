import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Superhero } from '../../models/superhero.model';
import { SuperheroesService } from './superheroes-service';

describe('SuperheroesService', () => {
  let service: SuperheroesService;
  let httpMock: HttpTestingController;

  const mockHeroes: Superhero[] = [
    {
      id: 1,
      name: 'Spider-Man',
      slug: '1-spider-man',
      powerstats: { intelligence: 90, strength: 55, speed: 60, durability: 70, power: 65, combat: 85 },
      appearance: { gender: 'Male', race: 'Human', height: ['5\'10', '178 cm'], weight: ['160 lb', '72 kg'], eyeColor: 'Hazel', hairColor: 'Brown' },
      biography: { fullName: 'Peter Parker', alterEgos: 'No alter egos found.', aliases: ['Spidey'], placeOfBirth: 'New York, USA', firstAppearance: 'Amazing Fantasy #15', publisher: 'Marvel Comics', alignment: 'good' },
      work: { occupation: 'Freelance photographer, teacher', base: 'New York, NY' },
      connections: { groupAffiliation: 'Avengers', relatives: 'May Parker (aunt)' },
      images: { xs: 'url', sm: 'url', md: 'url', lg: 'url' }
    },
    {
      id: 2,
      name: 'Superman',
      slug: '2-superman',
      powerstats: { intelligence: 100, strength: 100, speed: 100, durability: 100, power: 100, combat: 85 },
      appearance: { gender: 'Male', race: 'Kryptonian', height: ['6\'3', '191 cm'], weight: ['225 lb', '101 kg'], eyeColor: 'Blue', hairColor: 'Black' },
      biography: { fullName: 'Kal-El', alterEgos: 'No alter egos found.', aliases: ['Clark Kent'], placeOfBirth: 'Krypton', firstAppearance: 'Action Comics #1', publisher: 'DC Comics', alignment: 'good' },
      work: { occupation: 'Reporter', base: 'Metropolis' },
      connections: { groupAffiliation: 'Justice League', relatives: 'Lois Lane (wife)' },
      images: { xs: 'url', sm: 'url', md: 'url', lg: 'url' }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SuperheroesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SuperheroesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load all heroes and cache them via loadAll()', async () => {
    const promise = firstValueFrom(service.loadAll());

    const req = httpMock.expectOne('https://akabab.github.io/superhero-api/api/all.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);

    const heroes = await promise;
    expect(heroes.length).toBe(2);
    expect(heroes).toEqual(mockHeroes);
  });

  it('should return empty array on loadAll error via catchError', async () => {
    const promise = firstValueFrom(service.loadAll());

    const req = httpMock.expectOne('https://akabab.github.io/superhero-api/api/all.json');
    req.flush('Error 500', { status: 500, statusText: 'Server Error' });

    const heroes = await promise;
    expect(heroes).toEqual([]);
  });

  it('should get hero by id via getHeroById()', async () => {
    const mockHero = mockHeroes[0];
    const promise = firstValueFrom(service.getHeroById(1));

    const req = httpMock.expectOne('https://akabab.github.io/superhero-api/api/id/1.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockHero);

    const hero = await promise;
    expect(hero).toEqual(mockHero);
  });

  it('should add a new hero and assign an id', async () => {
    const loadPromise = firstValueFrom(service.loadAll());
    httpMock.expectOne('https://akabab.github.io/superhero-api/api/all.json').flush(mockHeroes);
    await loadPromise;

    const newHeroData = {
      name: 'Batman',
      slug: '3-batman',
      powerstats: { intelligence: 100, strength: 26, speed: 27, durability: 50, power: 47, combat: 100 },
      appearance: { gender: 'Male', race: 'Human', height: ['6\'2', '188 cm'], weight: ['210 lb', '95 kg'], eyeColor: 'Blue', hairColor: 'Black' },
      biography: { fullName: 'Bruce Wayne', alterEgos: 'No alter egos found.', aliases: ['Dark Knight'], placeOfBirth: 'Gotham City', firstAppearance: 'Detective Comics #27', publisher: 'DC Comics', alignment: 'good' },
      work: { occupation: 'Businessman', base: 'Gotham City' },
      connections: { groupAffiliation: 'Batfamily', relatives: 'Alfred Pennyworth' },
      images: { xs: 'url', sm: 'url', md: 'url', lg: 'url' }
    };

    const addedHero = await firstValueFrom(service.add(newHeroData));
    expect(addedHero.id).toBe(3);
    expect(addedHero.name).toBe('Batman');
  });

  it('should filter heroes using search() based on local cache', async () => {
    const loadPromise = firstValueFrom(service.loadAll());
    httpMock.expectOne('https://akabab.github.io/superhero-api/api/all.json').flush(mockHeroes);
    await loadPromise;

    const results = await firstValueFrom(service.search('spider'));
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Spider-Man');
  });

  it('should update an existing hero', async () => {
    const loadPromise = firstValueFrom(service.loadAll());
    httpMock.expectOne('https://akabab.github.io/superhero-api/api/all.json').flush(mockHeroes);
    await loadPromise;

    const updatedHero = { ...mockHeroes[0], name: 'Spider-Man Updated' };
    const result = await firstValueFrom(service.update(updatedHero));
    
    expect(result.name).toBe('Spider-Man Updated');
  });

  it('should delete a hero by id', async () => {
    const loadPromise = firstValueFrom(service.loadAll());
    httpMock.expectOne('https://akabab.github.io/superhero-api/api/all.json').flush(mockHeroes);
    await loadPromise;

    await firstValueFrom(service.delete(1));
    const heroes = await firstValueFrom(service.getAllHeroes());
    expect(heroes.length).toBe(1);
    expect(heroes.find(h => h.id === 1)).toBeUndefined();
  });
});