import { inject, injectable } from 'inversify';
import { Observable } from 'rxjs';

import { TYPES } from '@/config/types';
import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/repositories/TaskRepository';
import { UseCase } from '@/domain/useCases/UseCase';

@injectable()
export class ObserveTasksUseCase implements UseCase<void, Observable<Task[]>> {
  constructor(@inject(TYPES.TaskRepository) private readonly taskRepository: TaskRepository) {}

  run(_: void): Promise<Observable<Task[]>> {
    return Promise.resolve(this.taskRepository.observeTasks());
  }
}
