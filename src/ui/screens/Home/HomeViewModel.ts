import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';
import { Subscription } from 'rxjs';

import { TYPES } from '@/config/types';
import { Task } from '@/domain/entities/Task';
import { GetAllTasksUseCase } from '@/domain/useCases/GetAllTasksUseCase';
import { ObserveTasksUseCase } from '@/domain/useCases/ObserveTasksUseCase';
import { SyncTasksUseCase } from '@/domain/useCases/SyncTasksUseCase';
import { ToggleTaskCompletedUseCase } from '@/domain/useCases/ToggleTaskCompletedUseCase';
import { NetworkStore } from '@/ui/store/NetworkStore';
import Logger from '@/ui/utils/Logger';

export type TaskFilter = 'all' | 'pending' | 'completed';

type ICalls = 'loadTasks' | 'refreshTasks' | 'toggleTask';

@injectable()
export class HomeViewModel {
  isTasksLoading = false;
  isTasksRefreshing = false;
  isTasksError: string | null = null;
  isTasksResponse: Task[] | null = null;
  activeFilter: TaskFilter = 'all';

  private logger = new Logger('HomeViewModel');
  private tasksSubscription: Subscription | null = null;

  constructor(
    @inject(TYPES.GetAllTasksUseCase) private readonly getAllTasksUseCase: GetAllTasksUseCase,
    @inject(TYPES.ObserveTasksUseCase) private readonly observeTasksUseCase: ObserveTasksUseCase,
    @inject(TYPES.SyncTasksUseCase) private readonly syncTasksUseCase: SyncTasksUseCase,
    @inject(TYPES.ToggleTaskCompletedUseCase) private readonly toggleTaskCompletedUseCase: ToggleTaskCompletedUseCase,
    @inject(TYPES.NetworkStore) private readonly networkStore: NetworkStore,
  ) {
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
    if (!this.tasksSubscription) {
      await this.subscribeToTasks();
    }

    const localTasks = await this.getAllTasksUseCase.run(undefined);
    if (localTasks.length === 0 && !this.networkStore.isOffline) {
      await this.refresh();
    }
  }

  async refresh(): Promise<void> {
    if (this.networkStore.isOffline) {
      this.logger.info('Skipping refresh while offline; using local cache only');
      this.updateLoadingState(false, null, 'refreshTasks');
      return;
    }

    this.updateLoadingState(true, null, 'refreshTasks');

    try {
      await this.syncTasksUseCase.run(undefined);
      this.updateLoadingState(false, null, 'refreshTasks');
    } catch (error) {
      this.handleError(error, 'refreshTasks');
    }
  }

  async toggleTaskStatus(task: Task): Promise<void> {
    const previousValue = task.completed;
    const nextValue = !previousValue;

    runInAction(() => {
      this.isTasksResponse = (this.isTasksResponse ?? []).map((currentTask) =>
        currentTask.id === task.id ? new Task({ ...currentTask, completed: nextValue }) : currentTask,
      );
    });

    this.updateLoadingState(true, null, 'toggleTask');

    try {
      await this.toggleTaskCompletedUseCase.run({ taskId: task.id, completed: nextValue });

      this.updateLoadingState(false, null, 'toggleTask');
    } catch (error) {
      runInAction(() => {
        this.isTasksResponse = (this.isTasksResponse ?? []).map((currentTask) =>
          currentTask.id === task.id ? new Task({ ...currentTask, completed: previousValue }) : currentTask,
        );
      });

      this.handleError(error, 'toggleTask');
    }
  }

  private async subscribeToTasks(): Promise<void> {
    this.updateLoadingState(true, null, 'loadTasks');

    const tasksObservable = await this.observeTasksUseCase.run(undefined);

    this.tasksSubscription = tasksObservable.subscribe({
      next: (tasks) => {
        runInAction(() => {
          this.isTasksResponse = tasks;
          this.isTasksLoading = false;
          this.isTasksError = null;
        });
      },
      error: (error: unknown) => {
        this.handleError(error, 'loadTasks');
      },
    });
  }

  reset(): void {
    this.tasksSubscription?.unsubscribe();
    this.tasksSubscription = null;

    runInAction(() => {
      this.isTasksLoading = false;
      this.isTasksRefreshing = false;
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

      if (type === 'refreshTasks') {
        this.isTasksRefreshing = isLoading;
        this.isTasksError = error;
      }

      if (type === 'toggleTask') {
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
