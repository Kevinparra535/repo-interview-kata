import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { TYPES } from '@/config/types';
import { Task } from '@/domain/entities/Task';
import { GetTaskByIdUseCase } from '@/domain/useCases/GetTaskByIdUseCase';
import { ToggleTaskCompletedUseCase } from '@/domain/useCases/ToggleTaskCompletedUseCase';
import Logger from '@/ui/utils/Logger';

type ICalls = 'loadTask' | 'toggleTask';

@injectable()
export class TaskDetailViewModel {
  private logger = new Logger('TaskDetailViewModel');

  task: Task | null = null;
  isCompleted = false;
  isTaskLoading = false;
  isTaskSyncing = false;
  isTaskError: string | null = null;

  constructor(
    @inject(TYPES.GetTaskByIdUseCase)
    private readonly getTaskByIdUseCase: GetTaskByIdUseCase,
    @inject(TYPES.ToggleTaskCompletedUseCase)
    private readonly toggleTaskCompletedUseCase: ToggleTaskCompletedUseCase,
  ) {
    makeAutoObservable(this);
  }

  async initialize(taskId: number): Promise<void> {
    this.updateLoadingState(true, null, 'loadTask');

    try {
      const task = await this.getTaskByIdUseCase.run(taskId);

      runInAction(() => {
        this.task = task;
        this.isCompleted = task?.completed ?? false;
      });

      this.updateLoadingState(false, null, 'loadTask');

      if (task) {
        this.logger.info(`Task loaded from local DB: ${task.id} — ${task.todo}`);
      }
    } catch (error) {
      this.handleError(error, 'loadTask');
    }
  }

  async toggleCompleted(): Promise<void> {
    if (!this.task) return;

    const previousValue = this.isCompleted;
    const nextValue = !previousValue;

    runInAction(() => {
      const currentTask = this.task;
      if (!currentTask) return;

      this.isCompleted = nextValue;
      this.task = new Task({
        id: currentTask.id,
        todo: currentTask.todo,
        completed: nextValue,
        userId: currentTask.userId,
        attachmentUri: currentTask.attachmentUri,
      });
    });

    this.updateLoadingState(true, null, 'toggleTask');

    try {
      await this.toggleTaskCompletedUseCase.run({ taskId: this.task.id, completed: nextValue });
      this.updateLoadingState(false, null, 'toggleTask');
      this.logger.info(`Toggled completed → ${nextValue}`);
    } catch (error) {
      runInAction(() => {
        this.isCompleted = previousValue;
        if (this.task) {
          const currentTask = this.task;
          this.task = new Task({
            id: currentTask.id,
            todo: currentTask.todo,
            completed: previousValue,
            userId: currentTask.userId,
            attachmentUri: currentTask.attachmentUri,
          });
        }
      });

      this.handleError(error, 'toggleTask');
    }
  }

  reset(): void {
    runInAction(() => {
      this.task = null;
      this.isCompleted = false;
      this.isTaskLoading = false;
      this.isTaskSyncing = false;
      this.isTaskError = null;
    });
  }

  get formattedId(): string {
    if (!this.task) return '—';
    return `TSK-${String(this.task.id).padStart(4, '0')}`;
  }

  get assigneeName(): string {
    return 'Santiago Lopez';
  }

  get assigneeRole(): string {
    return 'Mobile Developer';
  }

  private updateLoadingState(isLoading: boolean, error: string | null, type: ICalls): void {
    runInAction(() => {
      if (type === 'loadTask') {
        this.isTaskLoading = isLoading;
        this.isTaskError = error;
      }

      if (type === 'toggleTask') {
        this.isTaskSyncing = isLoading;
        this.isTaskError = error;
      }
    });
  }

  private handleError(error: unknown, type: ICalls): void {
    const errorMessage = `Error in ${type}: ${error instanceof Error ? error.message : String(error)}`;
    this.logger.error(errorMessage);
    this.updateLoadingState(false, errorMessage, type);
  }
}
