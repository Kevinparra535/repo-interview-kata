import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { TYPES } from '@/config/types';
import { Task } from '@/domain/entities/Task';
import { GetAllTasksUseCase } from '@/domain/useCases/GetAllTasksUseCase';
import Logger from '@/ui/utils/Logger';

export type TaskFilter = 'all' | 'pending' | 'completed';

type ICalls = 'loadTasks';

@injectable()
export class HomeViewModel {
  isTasksLoading = false;
  isTasksError: string | null = null;
  isTasksResponse: Task[] | null = null;
  activeFilter: TaskFilter = 'all';

  private logger = new Logger('HomeViewModel');

  constructor(@inject(TYPES.GetAllTasksUseCase) private readonly getAllTasksUseCase: GetAllTasksUseCase) {
    makeAutoObservable(this);
  }

  get isLoaded(): boolean {
    return !this.isTasksLoading && this.isTasksResponse !== null;
  }

  get filteredTasks(): Task[] {
    const tasks = this.isTasksResponse ?? [];
    if (this.activeFilter === 'pending') return tasks.filter((t) => !t.completed);
    if (this.activeFilter === 'completed') return tasks.filter((t) => t.completed);
    return tasks;
  }

  get pendingCount(): number {
    return (this.isTasksResponse ?? []).filter((t) => !t.completed).length;
  }

  get completedCount(): number {
    return (this.isTasksResponse ?? []).filter((t) => t.completed).length;
  }

  setFilter(filter: TaskFilter): void {
    runInAction(() => {
      this.activeFilter = filter;
    });
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
      this.activeFilter = 'all';
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
    this.logger.error(errorMessage);
    this.updateLoadingState(false, errorMessage, type);
  }
}
