import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

import { Task } from '@/domain/entities/Task';

export class TaskWatermelonModel extends Model {
  static table = 'tasks';

  @field('remote_id') remoteId!: string;
  @field('todo') todo!: string;
  @field('completed') completed!: boolean;
  @field('user_id') userId!: number;
  @field('attachment_uri') attachmentUri!: string | null;

  toDomain(): Task {
    return new Task({
      id: Number(this.remoteId),
      todo: this.todo,
      completed: this.completed,
      userId: this.userId,
      attachmentUri: this.attachmentUri ?? undefined,
    });
  }
}
