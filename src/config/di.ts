import { Database } from '@nozbe/watermelondb';
import 'reflect-metadata';

import { Container } from 'inversify';

import { database } from '@/data/database/database';
import { AxiosManager } from '@/data/network/AxiosManager';
import { WatermelonManager } from '@/data/network/WatermelonManager';
import { TaskRepositoryImpl } from '@/data/repositories/TaskRepositoryImpl';
import { TaskService } from '@/data/services/TaskService';
import { TaskRepository } from '@/domain/repositories/TaskRepository';
import { HttpManager } from '@/domain/services/HttpManager';
import { GetAllTasksUseCase } from '@/domain/useCases/GetAllTasksUseCase';
import { GetTaskByIdUseCase } from '@/domain/useCases/GetTaskByIdUseCase';
import { ObserveTasksUseCase } from '@/domain/useCases/ObserveTasksUseCase';
import { SyncTasksUseCase } from '@/domain/useCases/SyncTasksUseCase';
import { ToggleTaskCompletedUseCase } from '@/domain/useCases/ToggleTaskCompletedUseCase';
import { CameraPermissionsViewModel } from '@/ui/screens/CameraPermissions/CameraPermissionsViewModel';
import { HomeViewModel } from '@/ui/screens/Home/HomeViewModel';
import { TaskDetailViewModel } from '@/ui/screens/TaskDetail/TaskDetailViewModel';
import { NetworkStore } from '@/ui/store/NetworkStore';
import { RootStore } from '@/ui/store/RootStore';
import { SyncCoordinator } from '@/ui/store/SyncCoordinator';

import { TYPES } from './types';

const container = new Container();

container.bind<NetworkStore>(TYPES.NetworkStore).to(NetworkStore).inSingletonScope();
container.bind<RootStore>(TYPES.RootStore).to(RootStore).inSingletonScope();
container.bind<SyncCoordinator>(TYPES.SyncCoordinator).to(SyncCoordinator).inSingletonScope();
container.bind<Database>(TYPES.WatermelonDatabase).toConstantValue(database);
container.bind<WatermelonManager>(TYPES.WatermelonManager).to(WatermelonManager).inSingletonScope();
container.bind<HttpManager>(TYPES.HttpManager).to(AxiosManager).inSingletonScope();
container.bind<TaskService>(TYPES.TaskService).to(TaskService).inSingletonScope();
container.bind<TaskRepository>(TYPES.TaskRepository).to(TaskRepositoryImpl).inSingletonScope();
container.bind<GetAllTasksUseCase>(TYPES.GetAllTasksUseCase).to(GetAllTasksUseCase);
container.bind<GetTaskByIdUseCase>(TYPES.GetTaskByIdUseCase).to(GetTaskByIdUseCase);
container.bind<ObserveTasksUseCase>(TYPES.ObserveTasksUseCase).to(ObserveTasksUseCase);
container.bind<SyncTasksUseCase>(TYPES.SyncTasksUseCase).to(SyncTasksUseCase);
container.bind<ToggleTaskCompletedUseCase>(TYPES.ToggleTaskCompletedUseCase).to(ToggleTaskCompletedUseCase);
container.bind<HomeViewModel>(TYPES.HomeViewModel).to(HomeViewModel);
container.bind<TaskDetailViewModel>(TYPES.TaskDetailViewModel).to(TaskDetailViewModel);
container.bind<CameraPermissionsViewModel>(TYPES.CameraPermissionsViewModel).to(CameraPermissionsViewModel);

export { container };
