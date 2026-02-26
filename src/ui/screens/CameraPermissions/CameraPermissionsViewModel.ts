import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system/legacy';
import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { TYPES } from '@/config/types';
import { UpdateTaskAttachmentUseCase } from '@/domain/useCases/UpdateTaskAttachmentUseCase';
import Logger from '@/ui/utils/Logger';

export type CameraPermissionState = 'request' | 'denied' | 'cancelled' | 'save_error';

@injectable()
export class CameraPermissionsViewModel {
  private logger = new Logger('CameraPermissionsViewModel');
  private taskId: number | null = null;

  state: CameraPermissionState = 'request';
  isSheetVisible = true;
  isCameraVisible = false;
  isSaving = false;

  constructor(
    @inject(TYPES.UpdateTaskAttachmentUseCase)
    private readonly updateTaskAttachmentUseCase: UpdateTaskAttachmentUseCase,
  ) {
    makeAutoObservable(this);
  }

  initialize(taskId: number): void {
    this.taskId = taskId;
  }

  async allowCamera(): Promise<void> {
    const permission = await Camera.requestCameraPermissionsAsync();

    if (!permission.granted) {
      runInAction(() => {
        this.state = 'denied';
        this.isSheetVisible = false;
        this.isCameraVisible = false;
      });
      this.logger.warn('Camera permission denied');
      return;
    }

    runInAction(() => {
      this.state = 'request';
      this.isSheetVisible = false;
      this.isCameraVisible = true;
    });
    this.logger.info('Camera permission allowed');
  }

  denyCamera(): void {
    this.logger.info('Camera permission denied by user (Not now)');
    this.isSheetVisible = false;
    this.isCameraVisible = false;
    this.state = 'cancelled';
  }

  showDenied(): void {
    this.logger.info('Camera permission is permanently denied');
    this.isSheetVisible = false;
    this.isCameraVisible = false;
    this.state = 'denied';
  }

  userCancelled(): void {
    this.logger.info('User cancelled camera capture');
    this.isCameraVisible = false;
    this.state = 'cancelled';
  }

  showSaveError(): void {
    this.logger.info('Save failed — storage error');
    this.state = 'save_error';
    this.isSaving = false;
    this.isCameraVisible = false;
  }

  dismiss(): void {
    this.logger.info('Dismissed error / toast');
    this.state = 'request';
    this.isSheetVisible = false;
    this.isCameraVisible = false;
  }

  async savePhoto(tempUri: string): Promise<boolean> {
    if (!this.taskId) {
      this.showSaveError();
      return false;
    }

    runInAction(() => {
      this.isSaving = true;
    });

    try {
      const baseDir = FileSystem.documentDirectory ?? '';
      const attachmentsDir = `${baseDir}attachments`;
      await FileSystem.makeDirectoryAsync(attachmentsDir, { intermediates: true });

      const fileName = `task-${this.taskId}-${Date.now()}.jpg`;
      const destinationUri = `${attachmentsDir}/${fileName}`;
      await FileSystem.copyAsync({
        from: tempUri,
        to: destinationUri,
      });

      await this.updateTaskAttachmentUseCase.run({
        taskId: this.taskId,
        attachmentUri: destinationUri,
      });

      runInAction(() => {
        this.isSaving = false;
        this.isCameraVisible = false;
        this.isSheetVisible = false;
        this.state = 'request';
      });

      this.logger.info(`Photo saved locally: ${destinationUri}`);
      return true;
    } catch (error) {
      this.logger.error(`Error saving photo: ${error instanceof Error ? error.message : String(error)}`);
      this.showSaveError();
      return false;
    }
  }

  retrySave(): void {
    this.logger.info('Retrying save');
    this.state = 'cancelled';
  }

  reset(): void {
    this.taskId = null;
    this.state = 'request';
    this.isSheetVisible = true;
    this.isCameraVisible = false;
    this.isSaving = false;
  }
}
