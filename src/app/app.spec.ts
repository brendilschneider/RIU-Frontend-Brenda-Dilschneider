import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should set the application title on init', () => {
    const fixture = TestBed.createComponent(App);
    const titleService = TestBed.inject(Title);
    const setTitleSpy = spyOn(titleService, 'setTitle');

    fixture.detectChanges();

    expect(setTitleSpy).toHaveBeenCalledWith('RIU Frontend | Dashboard');
  });
});