import { inject, injectable } from 'inversify';

import { TYPES } from '@src/config/types';
import { HomeRepository } from '@src/domain/repositories/HomeRepository';
import { UseCase } from '@src/domain/useCases/UseCase';

@injectable()
export class GetWelcomeMessageUseCase implements UseCase<void, string> {
  constructor(
    @inject(TYPES.HomeRepository)
    private readonly homeRepository: HomeRepository,
  ) {}

  run(_: void): Promise<string> {
    return this.homeRepository.getWelcomeMessage();
  }
}
