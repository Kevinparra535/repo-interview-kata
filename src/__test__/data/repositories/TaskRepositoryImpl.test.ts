import { TaskRepositoryImpl } from '@/data/repositories/TaskRepositoryImpl';

describe('TaskRepositoryImpl sync policy', () => {
  it('keeps local completed and attachment for existing records', async () => {
    const localRecord = {
      remoteId: '1',
      todo: 'Local todo',
      completed: true,
      userId: 10,
      attachmentUri: 'file://local-photo.jpg',
    } as any;

    const existingRecord = {
      ...localRecord,
      update: jest.fn(async (updater: (record: any) => void) => {
        updater(localRecord);
      }),
    } as any;

    const tasksCollection = {
      create: jest.fn(),
      query: jest.fn(),
    } as any;

    const watermelonManager = {
      getCollection: jest.fn().mockReturnValue(tasksCollection),
      getAll: jest.fn(),
      findWhere: jest.fn().mockResolvedValue([existingRecord]),
      write: jest.fn(async (operation: () => Promise<void>) => operation()),
      update: jest.fn(),
    } as any;

    const taskService = {
      getAllTasks: jest.fn().mockResolvedValue({
        todos: [{ id: 1, todo: 'Remote todo', completed: false, userId: 99 }],
        total: 1,
        skip: 0,
        limit: 30,
      }),
    } as any;

    const repository = new TaskRepositoryImpl(watermelonManager, taskService);

    await repository.syncTasks();

    expect(existingRecord.update).toHaveBeenCalledTimes(1);
    expect(localRecord.todo).toBe('Remote todo');
    expect(localRecord.userId).toBe(99);
    expect(localRecord.completed).toBe(true);
    expect(localRecord.attachmentUri).toBe('file://local-photo.jpg');
    expect(tasksCollection.create).not.toHaveBeenCalled();
  });

  it('creates new local records from remote data when not present', async () => {
    const createdRecord: any = {};

    const tasksCollection = {
      create: jest.fn(async (updater: (record: any) => void) => {
        updater(createdRecord);
      }),
      query: jest.fn(),
    } as any;

    const watermelonManager = {
      getCollection: jest.fn().mockReturnValue(tasksCollection),
      getAll: jest.fn(),
      findWhere: jest.fn().mockResolvedValue([]),
      write: jest.fn(async (operation: () => Promise<void>) => operation()),
      update: jest.fn(),
    } as any;

    const taskService = {
      getAllTasks: jest.fn().mockResolvedValue({
        todos: [{ id: 2, todo: 'New remote task', completed: true, userId: 7 }],
        total: 1,
        skip: 0,
        limit: 30,
      }),
    } as any;

    const repository = new TaskRepositoryImpl(watermelonManager, taskService);

    await repository.syncTasks();

    expect(tasksCollection.create).toHaveBeenCalledTimes(1);
    expect(createdRecord.remoteId).toBe('2');
    expect(createdRecord.todo).toBe('New remote task');
    expect(createdRecord.completed).toBe(true);
    expect(createdRecord.userId).toBe(7);
    expect(createdRecord.attachmentUri).toBeNull();
  });
});
