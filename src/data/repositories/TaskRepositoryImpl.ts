import { Q } from '@nozbe/watermelondb';
import { inject, injectable } from 'inversify';
import { map, Observable } from 'rxjs';

import { TYPES } from '@/config/types';
import { database } from '@/data/database/database';
import { TaskWatermelonModel } from '@/data/database/TaskWatermelonModel';
import { TaskModel } from '@/data/models/taskModel';
import { TaskService } from '@/data/services/TaskService';
import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/repositories/TaskRepository';

@injectable()
export class TaskRepositoryImpl implements TaskRepository {
  private readonly tasksCollection = database.collections.get<TaskWatermelonModel>('tasks');

  constructor(
    @inject(TYPES.TaskService)
    private readonly taskService: TaskService,
  ) {}

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.tasksCollection.query().fetch();

    return tasks.map((task) => task.toDomain());
  }

  observeTasks(): Observable<Task[]> {
    return this.tasksCollection
      .query()
      .observe()
      .pipe(map((tasks) => tasks.map((task) => task.toDomain())));
  }

  async syncTasks(): Promise<void> {
    const response = await this.taskService.getAllTasks();

    await database.write(async () => {
      for (const apiTask of response.todos) {
        const task = TaskModel.fromJson(apiTask).toDomain();
        const remoteId = String(task.id);
        const existing = await this.tasksCollection.query(Q.where('remote_id', remoteId)).fetch();

        if (existing.length > 0) {
          await existing[0].update((record) => {
            record.todo = task.todo;
            record.userId = task.userId;
          });
          continue;
        }

        await this.tasksCollection.create((record) => {
          record.remoteId = remoteId;
          record.todo = task.todo;
          record.completed = task.completed;
          record.userId = task.userId;
          record.attachmentUri = task.attachmentUri ?? null;
        });
      }
    });
  }

  async toggleTaskCompleted(taskId: number, completed: boolean): Promise<void> {
    const existing = await this.tasksCollection.query(Q.where('remote_id', String(taskId))).fetch();

    if (existing.length === 0) return;

    await database.write(async () => {
      await existing[0].update((record) => {
        record.completed = completed;
      });
    });
  }
}
