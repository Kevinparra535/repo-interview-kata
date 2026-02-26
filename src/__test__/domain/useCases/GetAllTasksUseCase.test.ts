import 'reflect-metadata';

import { Task } from '@/domain/entities/Task';
import { TaskRepository } from '@/domain/repositories/TaskRepository';
import { GetAllTasksUseCase } from '@/domain/useCases/GetAllTasksUseCase';
import { Observable } from 'rxjs';

const mockTask = new Task({ id: 1, todo: 'Test task', completed: false, userId: 1 });

const mockTaskRepository: jest.Mocked<TaskRepository> = {
  getAllTasks: jest.fn().mockResolvedValue([mockTask]),
  getTaskById: jest.fn(),
  observeTasks: jest.fn().mockReturnValue(new Observable()),
  syncTasks: jest.fn(),
  toggleTaskCompleted: jest.fn(),
  updateTaskAttachment: jest.fn(),
};

describe('GetAllTasksUseCase', () => {
  let useCase: GetAllTasksUseCase;

  beforeEach(() => {
    useCase = new GetAllTasksUseCase(mockTaskRepository);
  });

  it('should call taskRepository.getAllTasks()', async () => {
    await useCase.run(undefined);
    expect(mockTaskRepository.getAllTasks).toHaveBeenCalledTimes(1);
  });

  it('should return the tasks from the repository', async () => {
    const result = await useCase.run(undefined);
    expect(result).toEqual([mockTask]);
  });
});
