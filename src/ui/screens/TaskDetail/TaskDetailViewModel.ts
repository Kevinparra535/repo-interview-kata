import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { TYPES } from '@/config/types';
import { Task } from '@/domain/entities/Task';
import { ToggleTaskCompletedUseCase } from '@/domain/useCases/ToggleTaskCompletedUseCase';
import Logger from '@/ui/utils/Logger';

@injectable()
export class TaskDetailViewModel {
  private logger = new Logger('TaskDetailViewModel');

  task: Task | null = null;
  isCompleted = false;

  constructor(
    @inject(TYPES.ToggleTaskCompletedUseCase)
    private readonly toggleTaskCompletedUseCase: ToggleTaskCompletedUseCase,
  ) {
    makeAutoObservable(this);
  }

  setTask(task: Task): void {
    this.task = task;
    this.isCompleted = task.completed;
    this.logger.info(`Task loaded: ${task.id} — ${task.todo}`);
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
