import { inject, injectable } from 'inversify';

import { TYPES } from '@/config/types';
import { TaskRepository } from '@/domain/repositories/TaskRepository';
import { UseCase } from '@/domain/useCases/UseCase';

@injectable()
export class SyncTasksUseCase implements UseCase<void, void> {
  constructor(@inject(TYPES.TaskRepository) private readonly taskRepository: TaskRepository) {}

  run(_: void): Promise<void> {
    return this.taskRepository.syncTasks();
  }
}
