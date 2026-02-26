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
});
