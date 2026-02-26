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
});
