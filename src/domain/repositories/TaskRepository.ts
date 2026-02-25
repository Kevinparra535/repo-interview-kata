import { Task } from '@src/domain/entities/Task';

export interface TaskRepository {
  getAllTasks(): Promise<Task[]>;
}
