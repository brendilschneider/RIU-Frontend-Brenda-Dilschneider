import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperheroFormComponent } from './superhero-form';

describe('SuperheroeForm', () => {
  let component: SuperheroFormComponent;
  let fixture: ComponentFixture<SuperheroFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperheroFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
