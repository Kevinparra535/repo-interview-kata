import 'reflect-metadata';

import { Container } from 'inversify';

import { AxiosManager } from '@src/data/network/AxiosManager';
import { HomeRepositoryImpl } from '@src/data/repositories/HomeRepositoryImpl';
import { TaskRepositoryImpl } from '@src/data/repositories/TaskRepositoryImpl';
import { TaskService } from '@src/data/services/TaskService';
import { HomeRepository } from '@src/domain/repositories/HomeRepository';
import { TaskRepository } from '@src/domain/repositories/TaskRepository';
import { HttpManager } from '@src/domain/services/HttpManager';
import { GetAllTasksUseCase } from '@src/domain/useCases/GetAllTasksUseCase';
import { GetWelcomeMessageUseCase } from '@src/domain/useCases/GetWelcomeMessageUseCase';
import { HomeViewModel } from '@src/ui/screens/Home/HomeViewModel';

import { TYPES } from './types';

const container = new Container();

container.bind<HttpManager>(TYPES.HttpManager).to(AxiosManager).inSingletonScope();
container.bind<TaskService>(TYPES.TaskService).to(TaskService).inSingletonScope();
container.bind<TaskRepository>(TYPES.TaskRepository).to(TaskRepositoryImpl).inSingletonScope();
container.bind<GetAllTasksUseCase>(TYPES.GetAllTasksUseCase).to(GetAllTasksUseCase);
container.bind<HomeRepository>(TYPES.HomeRepository).to(HomeRepositoryImpl).inSingletonScope();
container
  .bind<GetWelcomeMessageUseCase>(TYPES.GetWelcomeMessageUseCase)
  .to(GetWelcomeMessageUseCase);
container.bind<HomeViewModel>(TYPES.HomeViewModel).to(HomeViewModel);

export { container };
