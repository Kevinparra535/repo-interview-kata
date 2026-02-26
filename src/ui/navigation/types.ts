import { Task } from '@/domain/entities/Task';

export type RootStackParamList = {
  Home: undefined;
  TaskDetail: { task: Task };
  CameraPermissions: undefined;
};
