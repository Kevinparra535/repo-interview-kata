import { inject, injectable } from 'inversify';

import { TYPES } from '@/config/types';
import { TaskRepository } from '@/domain/repositories/TaskRepository';
import { UseCase } from '@/domain/useCases/UseCase';

type UpdateTaskAttachmentParams = {
  taskId: number;
  attachmentUri: string;
};

@injectable()
export class UpdateTaskAttachmentUseCase implements UseCase<UpdateTaskAttachmentParams, void> {
  constructor(@inject(TYPES.TaskRepository) private readonly taskRepository: TaskRepository) {}

  run(data: UpdateTaskAttachmentParams): Promise<void> {
    return this.taskRepository.updateTaskAttachment(data.taskId, data.attachmentUri);
  }
}
