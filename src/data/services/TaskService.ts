import { inject, injectable } from 'inversify';

import { config } from '@/config/config';
import { TYPES } from '@/config/types';
import { HttpManager } from '@/domain/services/HttpManager';

type TaskApiResponse = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

type GetAllTasksResponse = {
  todos: TaskApiResponse[];
  total: number;
  skip: number;
  limit: number;
};

@injectable()
export class TaskService {
  constructor(
    @inject(TYPES.HttpManager)
    private readonly httpManager: HttpManager,
  ) {}

  getAllTasks(): Promise<GetAllTasksResponse> {
    return this.httpManager.get<GetAllTasksResponse>(config.TODOS_API);
  }
}
