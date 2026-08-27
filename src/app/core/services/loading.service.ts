import { Service, signal } from '@angular/core';

@Service()
export class LoadingService {
    
    private loadingSignal = signal<boolean>(false);
    
    public isLoading = this.loadingSignal.asReadonly();

  show() {
    this.loadingSignal.set(true);
  }

  hide() {
    this.loadingSignal.set(false);
  }
}
