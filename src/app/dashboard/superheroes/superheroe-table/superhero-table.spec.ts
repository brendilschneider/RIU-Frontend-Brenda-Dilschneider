import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperheroeTable } from './superhero-table';

describe('SuperheroeTable', () => {
  let component: SuperheroeTable;
  let fixture: ComponentFixture<SuperheroeTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperheroeTable],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroeTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
