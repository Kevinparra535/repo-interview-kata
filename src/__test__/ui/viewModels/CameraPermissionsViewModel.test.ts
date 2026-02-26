import * as FileSystem from 'expo-file-system/legacy';

import { CameraPermissionsViewModel } from '@/ui/screens/CameraPermissions/CameraPermissionsViewModel';

jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
  },
}));

jest.mock('expo-file-system/legacy', () => ({
  documentDirectory: 'file:///documents/',
  makeDirectoryAsync: jest.fn().mockResolvedValue(undefined),
  copyAsync: jest.fn().mockResolvedValue(undefined),
}));

describe('CameraPermissionsViewModel', () => {
  it('saves photo and persists attachment URI', async () => {
    const updateTaskAttachmentUseCase = {
      run: jest.fn().mockResolvedValue(undefined),
    } as any;

    const viewModel = new CameraPermissionsViewModel(updateTaskAttachmentUseCase);
    viewModel.initialize(7);

    const response = await viewModel.savePhoto('file:///tmp/photo.jpg');

    expect(FileSystem.makeDirectoryAsync).toHaveBeenCalled();
    expect(FileSystem.copyAsync).toHaveBeenCalled();
    expect(updateTaskAttachmentUseCase.run).toHaveBeenCalledTimes(1);
    expect(response).toBe(true);
  });
});
