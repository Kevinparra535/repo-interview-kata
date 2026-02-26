import { SyncTasksUseCase } from '@/domain/useCases/SyncTasksUseCase';

describe('SyncTasksUseCase', () => {
  it('calls repository syncTasks once', async () => {
    const repository = {
      syncTasks: jest.fn().mockResolvedValue(undefined),
    } as any;

    const useCase = new SyncTasksUseCase(repository);

    await useCase.run(undefined);

    expect(repository.syncTasks).toHaveBeenCalledTimes(1);
  });

  it('propagates errors thrown by the repository', async () => {
    const repository = {
      syncTasks: jest.fn().mockRejectedValue(new Error('network error')),
    } as any;

    const useCase = new SyncTasksUseCase(repository);
    await expect(useCase.run(undefined)).rejects.toThrow('network error');
  });
});
