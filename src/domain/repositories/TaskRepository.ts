import { Task } from '@/domain/entities/Task';
import { Observable } from 'rxjs';

export interface TaskRepository {
  getAllTasks(): Promise<Task[]>;
  getTaskById(taskId: number): Promise<Task | null>;
  observeTasks(): Observable<Task[]>;
  syncTasks(): Promise<void>;
  toggleTaskCompleted(taskId: number, completed: boolean): Promise<void>;
  updateTaskAttachment(taskId: number, attachmentUri: string): Promise<void>;
}
