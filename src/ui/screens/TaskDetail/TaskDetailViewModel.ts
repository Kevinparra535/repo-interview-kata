import { injectable } from 'inversify';
import { action, makeAutoObservable, observable } from 'mobx';

import { Task } from '@/domain/entities/Task';
import Logger from '@/ui/utils/Logger';

@injectable()
export class TaskDetailViewModel {
  private logger = new Logger('TaskDetailViewModel');

  @observable task: Task | null = null;
  @observable isCompleted = false;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  setTask(task: Task): void {
    this.task = task;
    this.isCompleted = task.completed;
    this.logger.info(`Task loaded: ${task.id} — ${task.todo}`);
  }

  @action
  toggleCompleted(): void {
    this.isCompleted = !this.isCompleted;
    this.logger.info(`Toggled completed → ${this.isCompleted}`);
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
