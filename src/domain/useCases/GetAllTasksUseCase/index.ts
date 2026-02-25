import { inject, injectable } from 'inversify';

import { TYPES } from '@src/config/types';
import { Task } from '@src/domain/entities/Task';
import { TaskRepository } from '@src/domain/repositories/TaskRepository';
import { UseCase } from '@src/domain/useCases/UseCase';

@injectable()
export class GetAllTasksUseCase implements UseCase<void, Task[]> {
  constructor(
    @inject(TYPES.TaskRepository)
    private readonly taskRepository: TaskRepository,
  ) {}

  run(_: void): Promise<Task[]> {
    return this.taskRepository.getAllTasks();
  }
}
