import { injectable } from 'inversify';
import { action, makeAutoObservable, observable } from 'mobx';

import Logger from '@/ui/utils/Logger';

export type CameraPermissionState = 'request' | 'denied' | 'cancelled' | 'save_error';

@injectable()
export class CameraPermissionsViewModel {
  private logger = new Logger('CameraPermissionsViewModel');

  @observable state: CameraPermissionState = 'request';
  @observable isSheetVisible = true;

  constructor() {
    makeAutoObservable(this);
  }

  @action
  allowCamera(): void {
    this.logger.info('Camera permission allowed');
    this.isSheetVisible = false;
    // In a real implementation this would call expo-camera requestPermissionsAsync
    // and then navigate to the camera capture screen
  }

  @action
  denyCamera(): void {
    this.logger.info('Camera permission denied by user (Not now)');
    this.isSheetVisible = false;
    this.state = 'cancelled';
  }

  @action
  showDenied(): void {
    this.logger.info('Camera permission is permanently denied');
    this.isSheetVisible = false;
    this.state = 'denied';
  }

  @action
  userCancelled(): void {
    this.logger.info('User cancelled camera capture');
    this.state = 'cancelled';
  }

  @action
  showSaveError(): void {
    this.logger.info('Save failed — storage error');
    this.state = 'save_error';
  }

  @action
  dismiss(): void {
    this.logger.info('Dismissed error / toast');
    this.state = 'request';
    this.isSheetVisible = true;
  }

  @action
  retrySave(): void {
    this.logger.info('Retrying save');
    this.state = 'cancelled';
  }

  @action
  reset(): void {
    this.state = 'request';
    this.isSheetVisible = true;
  }
}
