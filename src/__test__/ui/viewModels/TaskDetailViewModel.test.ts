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

  const buildViewModel = (overrides?: { task?: Task | null; toggleError?: Error }) => {
    const task = overrides?.task === undefined ? new Task({ id: 15, todo: 'Local task', completed: false, userId: 1 }) : overrides.task;

    const getTaskByIdUseCase = {
      run: task ? jest.fn().mockResolvedValue(task) : jest.fn().mockRejectedValue(new Error('not found')),
    } as any;
    const toggleTaskCompletedUseCase = {
      run: overrides?.toggleError ? jest.fn().mockRejectedValue(overrides.toggleError) : jest.fn().mockResolvedValue(undefined),
    } as any;

    return {
      viewModel: new TaskDetailViewModel(getTaskByIdUseCase, toggleTaskCompletedUseCase),
      getTaskByIdUseCase,
      toggleTaskCompletedUseCase,
    };
  };

  it('loads task from local DB on initialize', async () => {
    const { viewModel, getTaskByIdUseCase } = buildViewModel();

    await viewModel.initialize(15);

    expect(getTaskByIdUseCase.run).toHaveBeenCalledWith(15);
    expect(viewModel.task?.id).toBe(15);
    expect(viewModel.isCompleted).toBe(false);
  });

  it('sets error state when initialize fails', async () => {
    const { viewModel } = buildViewModel({ task: null });

    await viewModel.initialize(99);

    expect(viewModel.isTaskLoading).toBe(false);
    expect(viewModel.isTaskError).toContain('not found');
  });

  it('toggles completed and persists through use case', async () => {
    const { viewModel, toggleTaskCompletedUseCase } = buildViewModel();
    await viewModel.initialize(15);

    await viewModel.toggleCompleted();

    expect(viewModel.isCompleted).toBe(true);
    expect(viewModel.isTaskSyncing).toBe(false);
    expect(toggleTaskCompletedUseCase.run).toHaveBeenCalledWith({ taskId: 15, completed: true });
  });

  it('rolls back state when persistence fails', async () => {
    const { viewModel, toggleTaskCompletedUseCase } = buildViewModel({
      toggleError: new Error('offline error'),
    });
    await viewModel.initialize(15);

    await viewModel.toggleCompleted();

    expect(viewModel.isCompleted).toBe(false);
    expect(viewModel.isTaskSyncing).toBe(false);
    expect(viewModel.isTaskError).toContain('toggleTask');
    expect(toggleTaskCompletedUseCase.run).toHaveBeenCalledWith({ taskId: 15, completed: true });
  });

  it('does nothing when toggleCompleted is called without a task', async () => {
    const toggleTaskCompletedUseCase = { run: jest.fn() } as any;
    const getTaskByIdUseCase = { run: jest.fn().mockResolvedValue(null) } as any;
    const viewModel = new TaskDetailViewModel(getTaskByIdUseCase, toggleTaskCompletedUseCase);

    await viewModel.toggleCompleted();

    expect(toggleTaskCompletedUseCase.run).not.toHaveBeenCalled();
  });

  it('reset clears all state', async () => {
    const { viewModel } = buildViewModel();
    await viewModel.initialize(15);

    viewModel.reset();

    expect(viewModel.task).toBeNull();
    expect(viewModel.isCompleted).toBe(false);
    expect(viewModel.isTaskLoading).toBe(false);
    expect(viewModel.isTaskSyncing).toBe(false);
    expect(viewModel.isTaskError).toBeNull();
  });

  it('formattedId returns dashes when no task is loaded', () => {
    const { viewModel } = buildViewModel();
    expect(viewModel.formattedId).toBe('—');
  });

  it('formattedId returns padded id when task is loaded', async () => {
    const { viewModel } = buildViewModel();
    await viewModel.initialize(15);
    expect(viewModel.formattedId).toBe('TSK-0015');
  });

  it('returns hardcoded assignee info', () => {
    const { viewModel } = buildViewModel();
    expect(viewModel.assigneeName).toBe('Santiago Lopez');
    expect(viewModel.assigneeRole).toBe('Mobile Developer');
  });
});
