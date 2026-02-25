import { inject, injectable } from 'inversify';

import { TYPES } from '@/config/types';
import { TaskModel } from '@/data/models/taskModel';
import { TaskService } from '@/data/services/TaskService';
import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/repositories/TaskRepository';

@injectable()
export class TaskRepositoryImpl implements TaskRepository {
  constructor(
    @inject(TYPES.TaskService)
    private readonly taskService: TaskService,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    const response = await this.taskService.getAllTasks();

    return response.todos.map((task) => TaskModel.fromJson(task).toDomain());
  }
}
