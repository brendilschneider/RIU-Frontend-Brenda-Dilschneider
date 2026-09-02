import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { loadingInterceptor } from './loading-interceptor';
import { LoadingService } from '../services/loading.service';

describe('loadingInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let loadingService: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([loadingInterceptor])),
        provideHttpClientTesting(),
        LoadingService
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(LoadingService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(loadingInterceptor).toBeTruthy();
  });

  it('should show loading on request and hide on finalize (success or error)', () => {
    const showSpy = spyOn(loadingService, 'show');
    const hideSpy = spyOn(loadingService, 'hide');

    httpClient.get('/api/test').subscribe();

    expect(showSpy).toHaveBeenCalled();

    const req = httpTestingController.expectOne('/api/test');
    req.flush({ data: 'ok' });

    expect(hideSpy).toHaveBeenCalled();
  });
});
