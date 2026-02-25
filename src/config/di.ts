import 'reflect-metadata';

import { Container } from 'inversify';

import { AxiosManager } from '@/data/network/AxiosManager';
import { HomeRepositoryImpl } from '@/data/repositories/HomeRepositoryImpl';
import { TaskRepositoryImpl } from '@/data/repositories/TaskRepositoryImpl';
import { TaskService } from '@/data/services/TaskService';
import { HomeRepository } from '@/domain/repositories/HomeRepository';
import { TaskRepository } from '@/domain/repositories/TaskRepository';
import { HttpManager } from '@/domain/services/HttpManager';
import { GetAllTasksUseCase } from '@/domain/useCases/GetAllTasksUseCase';
import { GetWelcomeMessageUseCase } from '@/domain/useCases/GetWelcomeMessageUseCase';
import { HomeViewModel } from '@/ui/screens/Home/HomeViewModel';
import { TaskDetailViewModel } from '@/ui/screens/TaskDetail/TaskDetailViewModel';

import { TYPES } from './types';

const container = new Container();

container.bind<HttpManager>(TYPES.HttpManager).to(AxiosManager).inSingletonScope();
container.bind<TaskService>(TYPES.TaskService).to(TaskService).inSingletonScope();
container.bind<TaskRepository>(TYPES.TaskRepository).to(TaskRepositoryImpl).inSingletonScope();
container.bind<GetAllTasksUseCase>(TYPES.GetAllTasksUseCase).to(GetAllTasksUseCase);
container.bind<HomeRepository>(TYPES.HomeRepository).to(HomeRepositoryImpl).inSingletonScope();
container.bind<GetWelcomeMessageUseCase>(TYPES.GetWelcomeMessageUseCase).to(GetWelcomeMessageUseCase);
container.bind<HomeViewModel>(TYPES.HomeViewModel).to(HomeViewModel);
container.bind<TaskDetailViewModel>(TYPES.TaskDetailViewModel).to(TaskDetailViewModel);

export { container };
