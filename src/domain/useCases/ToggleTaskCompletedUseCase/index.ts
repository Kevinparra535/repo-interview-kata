import { inject, injectable } from 'inversify';

import { TYPES } from '@/config/types';
import { TaskRepository } from '@/domain/repositories/TaskRepository';
import { UseCase } from '@/domain/useCases/UseCase';

type ToggleTaskCompletedParams = {
  taskId: number;
  completed: boolean;
};

@injectable()
export class ToggleTaskCompletedUseCase implements UseCase<ToggleTaskCompletedParams, void> {
  constructor(@inject(TYPES.TaskRepository) private readonly taskRepository: TaskRepository) {}

  run(data: ToggleTaskCompletedParams): Promise<void> {
    return this.taskRepository.toggleTaskCompleted(data.taskId, data.completed);
  }
}
