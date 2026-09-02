import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HeroDetailDialogComponent } from './hero-detail-dialog.component';

describe('HeroDetailDialogComponent', () => {
  let component: HeroDetailDialogComponent;
  let fixture: ComponentFixture<HeroDetailDialogComponent>;

  const mockHeroData = {
    id: 1,
    name: 'Spider-Man',
    slug: 'spider-man',
    images: {
      sm: 'https://via.placeholder.com/150'
    },
    biography: {
      fullName: 'Peter Parker'
    },
    powerstats: {
      intelligence: 90,
      power: 85
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDetailDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockHeroData }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the dialog component', () => {
    expect(component).toBeTruthy();
  });

  it('should have the correct hero data injected', () => {
    expect(component.hero).toBeDefined();
    expect(component.hero.name).toEqual('Spider-Man');
    expect(component.hero.biography.fullName).toEqual('Peter Parker');
  });
});