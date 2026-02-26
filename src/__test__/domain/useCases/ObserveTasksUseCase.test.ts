import { of, throwError } from 'rxjs';

import { Task } from '@/domain/entities/Task';
import { ObserveTasksUseCase } from '@/domain/useCases/ObserveTasksUseCase';

describe('ObserveTasksUseCase', () => {
  it('returns repository observable', async () => {
    const tasks = [
      new Task({ id: 1, todo: 'Task A', completed: false, userId: 12 }),
      new Task({ id: 2, todo: 'Task B', completed: true, userId: 12 }),
    ];

    const observable = of(tasks);
    const repository = {
      observeTasks: jest.fn().mockReturnValue(observable),
    } as any;

    const useCase = new ObserveTasksUseCase(repository);

    const result = await useCase.run(undefined);

    expect(result).toBe(observable);
    expect(repository.observeTasks).toHaveBeenCalledTimes(1);
  });

  it('returns observable that errors when repository throws', async () => {
    const error = new Error('observe error');
    const errObservable = throwError(() => error);
    const repository = {
      observeTasks: jest.fn().mockReturnValue(errObservable),
    } as any;

    const useCase = new ObserveTasksUseCase(repository);
    const result = await useCase.run(undefined);

    await new Promise<void>((resolve) => {
      result.subscribe({
        error: (err: Error) => {
          expect(err.message).toBe('observe error');
          resolve();
        },
      });
    });
  });
});
