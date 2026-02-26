import { inject, injectable } from 'inversify';
import { map, Observable } from 'rxjs';

import { TYPES } from '@/config/types';
import { TaskWatermelonModel } from '@/data/database/TaskWatermelonModel';
import { TaskModel } from '@/data/models/taskModel';
import { WatermelonManager } from '@/data/network/WatermelonManager';
import { TaskService } from '@/data/services/TaskService';
import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/repositories/TaskRepository';

@injectable()
export class TaskRepositoryImpl implements TaskRepository {
  private readonly tasksCollection;

  constructor(
    @inject(TYPES.WatermelonManager)
    private readonly watermelonManager: WatermelonManager,
    @inject(TYPES.TaskService)
    private readonly taskService: TaskService,
  ) {
    this.tasksCollection = this.watermelonManager.getCollection<TaskWatermelonModel>('tasks');
  }

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.watermelonManager.getAll<TaskWatermelonModel>('tasks');

    return tasks.map((task) => task.toDomain());
  }

  async getTaskById(taskId: number): Promise<Task | null> {
    const existing = await this.watermelonManager.findWhere<TaskWatermelonModel>('tasks', 'remote_id', String(taskId));

    if (existing.length === 0) return null;

    return existing[0].toDomain();
  }

  observeTasks(): Observable<Task[]> {
    return this.tasksCollection
      .query()
      .observe()
      .pipe(map((tasks) => tasks.map((task) => task.toDomain())));
  }

  async syncTasks(): Promise<void> {
    const response = await this.taskService.getAllTasks();

    await this.watermelonManager.write(async () => {
      for (const apiTask of response.todos) {
        const task = TaskModel.fromJson(apiTask).toDomain();
        const remoteId = String(task.id);
        const existing = await this.watermelonManager.findWhere<TaskWatermelonModel>('tasks', 'remote_id', remoteId);

        if (existing.length > 0) {
          const localCompleted = existing[0].completed;
          const localAttachmentUri = existing[0].attachmentUri;

          await existing[0].update((record) => {
            record.todo = task.todo;
            record.userId = task.userId;
            record.completed = localCompleted;
            record.attachmentUri = localAttachmentUri;
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
    const existing = await this.watermelonManager.findWhere<TaskWatermelonModel>('tasks', 'remote_id', String(taskId));

    if (existing.length === 0) return;

    await this.watermelonManager.update(existing[0], (record) => {
      record.completed = completed;
    });
  }
}
