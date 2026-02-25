import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { TYPES } from '@src/config/types';
import { Task } from '@src/domain/entities/Task';
import { GetAllTasksUseCase } from '@src/domain/useCases/GetAllTasksUseCase';

type ICalls = 'loadTasks';

@injectable()
export class HomeViewModel {
  isTasksLoading = false;
  isTasksError: string | null = null;
  isTasksResponse: Task[] | null = null;

  constructor(
    @inject(TYPES.GetAllTasksUseCase)
    private readonly getAllTasksUseCase: GetAllTasksUseCase,
  ) {
    makeAutoObservable(this);
  }

  get isLoaded(): boolean {
    return !this.isTasksLoading && this.isTasksResponse !== null;
  }

  async initialize(): Promise<void> {
    this.updateLoadingState(true, null, 'loadTasks');

    try {
      const response = await this.getAllTasksUseCase.run(undefined);

      runInAction(() => {
        this.isTasksResponse = response;
      });

      this.updateLoadingState(false, null, 'loadTasks');
    } catch (error) {
      this.handleError(error, 'loadTasks');
    }
  }

  reset(): void {
    runInAction(() => {
      this.isTasksLoading = false;
      this.isTasksError = null;
      this.isTasksResponse = null;
    });
  }

  private updateLoadingState(isLoading: boolean, error: string | null, type: ICalls): void {
    runInAction(() => {
      if (type === 'loadTasks') {
        this.isTasksLoading = isLoading;
        this.isTasksError = error;
      }
    });
  }

  private handleError(error: unknown, type: ICalls): void {
    const errorMessage = `Error in ${type}: ${error instanceof Error ? error.message : String(error)}`;
    this.updateLoadingState(false, errorMessage, type);
  }
}
