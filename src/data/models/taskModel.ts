import { Task } from '@src/domain/entities/Task';

export type TaskModelConstructorParams = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  [key: string]: any;
};

export class TaskModel {
  [key: string]: any;

  id: number;
  todo: string;
  completed: boolean;
  userId: number;

  constructor(params: TaskModelConstructorParams) {
    this.id = params.id;
    this.todo = params.todo;
    this.completed = params.completed;
    this.userId = params.userId;
    Object.assign(this, params);
  }

  static fromJson(json: any): TaskModel {
    return new TaskModel({
      id: json.id,
      todo: json.todo,
      completed: json.completed,
      userId: json.userId,
    });
  }

  toJson(): Record<string, unknown> {
    return {
      id: this.id,
      todo: this.todo,
      completed: this.completed,
      userId: this.userId,
    };
  }
}

declare module './taskModel' {
  interface TaskModel {
    toDomain(): Task;
  }
}

TaskModel.prototype.toDomain = function toDomain(): Task {
  return new Task({
    id: this.id,
    todo: this.todo,
    completed: this.completed,
    userId: this.userId,
  });
};
