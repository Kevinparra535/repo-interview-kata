import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { TYPES } from '@/config/types';
import { Task } from '@/domain/entities/Task';
import { GetTaskByIdUseCase } from '@/domain/useCases/GetTaskByIdUseCase';
import { ToggleTaskCompletedUseCase } from '@/domain/useCases/ToggleTaskCompletedUseCase';
import Logger from '@/ui/utils/Logger';

@injectable()
export class TaskDetailViewModel {
  private logger = new Logger('TaskDetailViewModel');

  task: Task | null = null;
  isCompleted = false;
  isTaskLoading = false;
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
    runInAction(() => {
      this.isTaskLoading = true;
      this.isTaskError = null;
    });

    try {
      const task = await this.getTaskByIdUseCase.run(taskId);

      runInAction(() => {
        this.task = task;
        this.isCompleted = task?.completed ?? false;
        this.isTaskLoading = false;
      });

      if (task) {
        this.logger.info(`Task loaded from local DB: ${task.id} — ${task.todo}`);
      }
    } catch (error) {
      runInAction(() => {
        this.isTaskError = error instanceof Error ? error.message : 'Unexpected task detail error';
        this.isTaskLoading = false;
      });

      this.logger.error(`Error loading task detail: ${this.isTaskError}`);
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

    try {
      await this.toggleTaskCompletedUseCase.run({ taskId: this.task.id, completed: nextValue });
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

      this.logger.error(`Error toggling task: ${error instanceof Error ? error.message : String(error)}`);
    }
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
}
