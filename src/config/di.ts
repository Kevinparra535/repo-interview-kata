import 'reflect-metadata';

import { Container } from 'inversify';

import { HomeRepositoryImpl } from '@src/data/repositories/HomeRepositoryImpl';
import { HomeRepository } from '@src/domain/repositories/HomeRepository';
import { GetWelcomeMessageUseCase } from '@src/domain/useCases/GetWelcomeMessageUseCase';
import { HomeViewModel } from '@src/ui/screens/Home/HomeViewModel';

import { TYPES } from './types';

const container = new Container();

container.bind<HomeRepository>(TYPES.HomeRepository).to(HomeRepositoryImpl).inSingletonScope();
container.bind<GetWelcomeMessageUseCase>(TYPES.GetWelcomeMessageUseCase).to(GetWelcomeMessageUseCase);
container.bind<HomeViewModel>(TYPES.HomeViewModel).to(HomeViewModel);

export { container };
