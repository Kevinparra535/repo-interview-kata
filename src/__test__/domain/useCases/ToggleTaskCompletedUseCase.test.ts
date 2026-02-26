import { ToggleTaskCompletedUseCase } from '@/domain/useCases/ToggleTaskCompletedUseCase';

describe('ToggleTaskCompletedUseCase', () => {
  it('calls repository toggleTaskCompleted with correct params', async () => {
    const repository = {
      toggleTaskCompleted: jest.fn().mockResolvedValue(undefined),
    } as any;

    const useCase = new ToggleTaskCompletedUseCase(repository);

    await useCase.run({ taskId: 7, completed: true });

    expect(repository.toggleTaskCompleted).toHaveBeenCalledWith(7, true);
    expect(repository.toggleTaskCompleted).toHaveBeenCalledTimes(1);
  });
});
