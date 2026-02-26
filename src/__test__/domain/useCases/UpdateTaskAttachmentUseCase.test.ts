import { UpdateTaskAttachmentUseCase } from '@/domain/useCases/UpdateTaskAttachmentUseCase';

describe('UpdateTaskAttachmentUseCase', () => {
  it('calls repository updateTaskAttachment with correct params', async () => {
    const repository = {
      updateTaskAttachment: jest.fn().mockResolvedValue(undefined),
    } as any;

    const useCase = new UpdateTaskAttachmentUseCase(repository);

    await useCase.run({ taskId: 42, attachmentUri: 'file:///attachments/task-42.jpg' });

    expect(repository.updateTaskAttachment).toHaveBeenCalledWith(42, 'file:///attachments/task-42.jpg');
    expect(repository.updateTaskAttachment).toHaveBeenCalledTimes(1);
  });

  it('propagates errors thrown by the repository', async () => {
    const repository = {
      updateTaskAttachment: jest.fn().mockRejectedValue(new Error('write failed')),
    } as any;

    const useCase = new UpdateTaskAttachmentUseCase(repository);
    await expect(useCase.run({ taskId: 1, attachmentUri: 'file:///test.jpg' })).rejects.toThrow('write failed');
  });
});
