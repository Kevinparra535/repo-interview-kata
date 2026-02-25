import { inject, injectable } from 'inversify';

import { TYPES } from '@/config/types';
import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/repositories/TaskRepository';
import { UseCase } from '@/domain/useCases/UseCase';

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
