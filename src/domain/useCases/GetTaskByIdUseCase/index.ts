import { inject, injectable } from 'inversify';

import { TYPES } from '@/config/types';
import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/repositories/TaskRepository';
import { UseCase } from '@/domain/useCases/UseCase';

@injectable()
export class GetTaskByIdUseCase implements UseCase<number, Task | null> {
  constructor(@inject(TYPES.TaskRepository) private readonly taskRepository: TaskRepository) {}

  run(taskId: number): Promise<Task | null> {
    return this.taskRepository.getTaskById(taskId);
  }
}
