import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { TYPES } from '@src/config/types';
import { GetWelcomeMessageUseCase } from '@src/domain/useCases/GetWelcomeMessageUseCase';

type ICalls = 'loadWelcome';

@injectable()
export class HomeViewModel {
  isHomeLoading = false;
  isHomeError: string | null = null;
  isHomeResponse: string | null = null;

  constructor(
    @inject(TYPES.GetWelcomeMessageUseCase)
    private readonly getWelcomeMessageUseCase: GetWelcomeMessageUseCase,
  ) {
    makeAutoObservable(this);
  }

  get isLoaded(): boolean {
    return !this.isHomeLoading && this.isHomeResponse !== null;
  }

  async initialize(): Promise<void> {
    this.updateLoadingState(true, null, 'loadWelcome');

    try {
      const response = await this.getWelcomeMessageUseCase.run(undefined);

      runInAction(() => {
        this.isHomeResponse = response;
      });

      this.updateLoadingState(false, null, 'loadWelcome');
    } catch (error) {
      this.handleError(error, 'loadWelcome');
    }
  }

  reset(): void {
    runInAction(() => {
      this.isHomeLoading = false;
      this.isHomeError = null;
      this.isHomeResponse = null;
    });
  }

  private updateLoadingState(isLoading: boolean, error: string | null, type: ICalls): void {
    runInAction(() => {
      if (type === 'loadWelcome') {
        this.isHomeLoading = isLoading;
        this.isHomeError = error;
      }
    });
  }

  private handleError(error: unknown, type: ICalls): void {
    const errorMessage = `Error in ${type}: ${error instanceof Error ? error.message : String(error)}`;
    this.updateLoadingState(false, errorMessage, type);
  }
}
