import { Task } from '@/domain/entities/Task';
import { GetTaskByIdUseCase } from '@/domain/useCases/GetTaskByIdUseCase';

describe('GetTaskByIdUseCase', () => {
  it('calls repository getTaskById with correct id', async () => {
    const task = new Task({ id: 3, todo: 'Fetch me', completed: false, userId: 1 });
    const repository = {
      getTaskById: jest.fn().mockResolvedValue(task),
    } as any;

    const useCase = new GetTaskByIdUseCase(repository);

    const response = await useCase.run(3);

    expect(repository.getTaskById).toHaveBeenCalledWith(3);
    expect(response?.id).toBe(3);
  });

  it('returns null when repository resolves with null', async () => {
    const repository = {
      getTaskById: jest.fn().mockResolvedValue(null),
    } as any;

    const useCase = new GetTaskByIdUseCase(repository);
    const result = await useCase.run(999);

    expect(result).toBeNull();
  });

  it('propagates errors thrown by the repository', async () => {
    const repository = {
      getTaskById: jest.fn().mockRejectedValue(new Error('not found')),
    } as any;

    const useCase = new GetTaskByIdUseCase(repository);
    await expect(useCase.run(1)).rejects.toThrow('not found');
  });
});
