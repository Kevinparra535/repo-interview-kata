import { Task } from '@/domain/entities/Task';

export interface TaskRepository {
  getAllTasks(): Promise<Task[]>;
}
