import { inject, injectable } from 'inversify';

import { TYPES } from '@src/config/types';
import { TaskModel } from '@src/data/models/taskModel';
import { TaskService } from '@src/data/services/TaskService';
import { Task } from '@src/domain/entities/Task';
import { TaskRepository } from '@src/domain/repositories/TaskRepository';

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
