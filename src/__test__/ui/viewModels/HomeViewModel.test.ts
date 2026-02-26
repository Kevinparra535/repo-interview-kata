import { BehaviorSubject } from 'rxjs';

import { Task } from '@/domain/entities/Task';
import { HomeViewModel } from '@/ui/screens/Home/HomeViewModel';

describe('HomeViewModel', () => {
  const buildViewModel = (params?: { localTasks?: Task[]; observedTasks?: Task[] }) => {
    const observedTasks = params?.observedTasks ?? [];
    const localTasks = params?.localTasks ?? [];

    const subject = new BehaviorSubject<Task[]>(observedTasks);

    const getAllTasksUseCase = {
      run: jest.fn().mockResolvedValue(localTasks),
    } as any;

    const observeTasksUseCase = {
      run: jest.fn().mockResolvedValue(subject.asObservable()),
    } as any;

    const syncTasksUseCase = {
      run: jest.fn().mockResolvedValue(undefined),
    } as any;

    const toggleTaskCompletedUseCase = {
      run: jest.fn().mockResolvedValue(undefined),
    } as any;

    return {
      subject,
      getAllTasksUseCase,
      observeTasksUseCase,
      syncTasksUseCase,
      toggleTaskCompletedUseCase,
      viewModel: new HomeViewModel(getAllTasksUseCase, observeTasksUseCase, syncTasksUseCase, toggleTaskCompletedUseCase),
    };
  };

  it('syncs on initialize when local database is empty', async () => {
    const { viewModel, syncTasksUseCase } = buildViewModel({ localTasks: [] });

    await viewModel.initialize();

    expect(syncTasksUseCase.run).toHaveBeenCalledTimes(1);
  });

  it('does not sync on initialize when local database already has tasks', async () => {
    const localTasks = [new Task({ id: 1, todo: 'Cached', completed: false, userId: 10 })];
    const { viewModel, syncTasksUseCase } = buildViewModel({ localTasks, observedTasks: localTasks });

    await viewModel.initialize();

    expect(syncTasksUseCase.run).not.toHaveBeenCalled();
    expect(viewModel.filteredTasks).toHaveLength(1);
  });

  it('filters completed and pending tasks correctly', async () => {
    const tasks = [new Task({ id: 1, todo: 'A', completed: false, userId: 1 }), new Task({ id: 2, todo: 'B', completed: true, userId: 1 })];

    const { viewModel } = buildViewModel({ localTasks: tasks, observedTasks: tasks });

    await viewModel.initialize();

    viewModel.setFilter('pending');
    expect(viewModel.filteredTasks).toHaveLength(1);
    expect(viewModel.filteredTasks[0].completed).toBe(false);

    viewModel.setFilter('completed');
    expect(viewModel.filteredTasks).toHaveLength(1);
    expect(viewModel.filteredTasks[0].completed).toBe(true);
  });
});
