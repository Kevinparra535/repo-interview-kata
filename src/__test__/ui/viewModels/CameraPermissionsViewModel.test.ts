import { Camera } from 'expo-camera';
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

const mockRequestPermission = Camera.requestCameraPermissionsAsync as jest.Mock;

const buildViewModel = () => {
  const updateTaskAttachmentUseCase = { run: jest.fn().mockResolvedValue(undefined) } as any;
  return { viewModel: new CameraPermissionsViewModel(updateTaskAttachmentUseCase), updateTaskAttachmentUseCase };
};

describe('CameraPermissionsViewModel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockRequestPermission.mockResolvedValue({ granted: true });
    (FileSystem.makeDirectoryAsync as jest.Mock).mockResolvedValue(undefined);
    (FileSystem.copyAsync as jest.Mock).mockResolvedValue(undefined);
  });

  it('saves photo and persists attachment URI', async () => {
    const { viewModel, updateTaskAttachmentUseCase } = buildViewModel();
    viewModel.initialize(7);

    const result = await viewModel.savePhoto('file:///tmp/photo.jpg');

    expect(FileSystem.makeDirectoryAsync).toHaveBeenCalled();
    expect(FileSystem.copyAsync).toHaveBeenCalled();
    expect(updateTaskAttachmentUseCase.run).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
    expect(viewModel.isSaving).toBe(false);
    expect(viewModel.isCameraVisible).toBe(false);
  });

  it('savePhoto returns false and sets save_error state when taskId is null', async () => {
    const { viewModel } = buildViewModel();
    // do NOT call initialize — taskId stays null

    const result = await viewModel.savePhoto('file:///tmp/photo.jpg');

    expect(result).toBe(false);
    expect(viewModel.state).toBe('save_error');
  });

  it('savePhoto returns false and sets save_error state when FileSystem throws', async () => {
    (FileSystem.copyAsync as jest.Mock).mockRejectedValueOnce(new Error('disk full'));
    const { viewModel } = buildViewModel();
    viewModel.initialize(3);

    const result = await viewModel.savePhoto('file:///tmp/photo.jpg');

    expect(result).toBe(false);
    expect(viewModel.state).toBe('save_error');
    expect(viewModel.isSaving).toBe(false);
  });

  it('allowCamera transitions to camera visible when permission granted', async () => {
    const { viewModel } = buildViewModel();
    viewModel.initialize(1);

    await viewModel.allowCamera();

    expect(viewModel.isCameraVisible).toBe(true);
    expect(viewModel.isSheetVisible).toBe(false);
    expect(viewModel.state).toBe('request');
  });

  it('allowCamera sets denied state when permission not granted', async () => {
    mockRequestPermission.mockResolvedValueOnce({ granted: false });
    const { viewModel } = buildViewModel();
    viewModel.initialize(1);

    await viewModel.allowCamera();

    expect(viewModel.isCameraVisible).toBe(false);
    expect(viewModel.isSheetVisible).toBe(false);
    expect(viewModel.state).toBe('denied');
  });

  it('denyCamera sets cancelled state and hides camera', () => {
    const { viewModel } = buildViewModel();

    viewModel.denyCamera();

    expect(viewModel.state).toBe('cancelled');
    expect(viewModel.isSheetVisible).toBe(false);
    expect(viewModel.isCameraVisible).toBe(false);
  });

  it('reset restores initial state', async () => {
    const { viewModel } = buildViewModel();
    viewModel.initialize(5);
    await viewModel.allowCamera();

    viewModel.reset();

    expect(viewModel.state).toBe('request');
    expect(viewModel.isSheetVisible).toBe(true);
    expect(viewModel.isCameraVisible).toBe(false);
    expect(viewModel.isSaving).toBe(false);
  });
});
