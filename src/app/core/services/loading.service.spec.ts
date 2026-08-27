import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial loading state as false', () => {
    expect(service.isLoading()).toBeFalse();
  });

  it('should set loading state to true when show() is called', () => {
    service.show();
    expect(service.isLoading()).toBeTrue();
  });

  it('should set loading state to false when hide() is called after show()', () => {
    service.show();
    expect(service.isLoading()).toBeTrue();

    service.hide();
    expect(service.isLoading()).toBeFalse();
  });
});