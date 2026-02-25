export type TaskConstructorParams = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  [key: string]: any;
};

export class Task {
  [key: string]: any;

  id: number;
  todo: string;
  completed: boolean;
  userId: number;

  constructor(params: TaskConstructorParams) {
    this.id = params.id;
    this.todo = params.todo;
    this.completed = params.completed;
    this.userId = params.userId;
    Object.assign(this, params);
  }
}
