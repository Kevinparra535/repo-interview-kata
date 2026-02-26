export const TYPES = {
  HttpManager: Symbol.for('HttpManager'),
  TaskService: Symbol.for('TaskService'),
  TaskRepository: Symbol.for('TaskRepository'),
  GetAllTasksUseCase: Symbol.for('GetAllTasksUseCase'),
  HomeRepository: Symbol.for('HomeRepository'),
  GetWelcomeMessageUseCase: Symbol.for('GetWelcomeMessageUseCase'),
  HomeViewModel: Symbol.for('HomeViewModel'),
  TaskDetailViewModel: Symbol.for('TaskDetailViewModel'),
  CameraPermissionsViewModel: Symbol.for('CameraPermissionsViewModel'),
} as const;
