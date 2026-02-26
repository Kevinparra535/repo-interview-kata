import { Task } from '@/domain/entities/Task';
import { TaskDetailViewModel } from '@/ui/screens/TaskDetail/TaskDetailViewModel';

describe('TaskDetailViewModel', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('toggles completed and persists through use case', async () => {
    const toggleTaskCompletedUseCase = {
      run: jest.fn().mockResolvedValue(undefined),
    } as any;

    const viewModel = new TaskDetailViewModel(toggleTaskCompletedUseCase);
    viewModel.setTask(new Task({ id: 42, todo: 'Persist me', completed: false, userId: 5 }));

    await viewModel.toggleCompleted();

    expect(viewModel.isCompleted).toBe(true);
    expect(toggleTaskCompletedUseCase.run).toHaveBeenCalledWith({ taskId: 42, completed: true });
  });

  it('rolls back state when persistence fails', async () => {
    const toggleTaskCompletedUseCase = {
      run: jest.fn().mockRejectedValue(new Error('offline error')),
    } as any;

    const viewModel = new TaskDetailViewModel(toggleTaskCompletedUseCase);
    viewModel.setTask(new Task({ id: 7, todo: 'Rollback me', completed: false, userId: 2 }));

    await viewModel.toggleCompleted();

    expect(viewModel.isCompleted).toBe(false);
    expect(toggleTaskCompletedUseCase.run).toHaveBeenCalledWith({ taskId: 7, completed: true });
  });
});
