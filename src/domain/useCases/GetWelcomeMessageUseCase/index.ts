import { inject, injectable } from 'inversify';

import { TYPES } from '@/config/types';
import { HomeRepository } from '@/domain/repositories/HomeRepository';
import { UseCase } from '@/domain/useCases/UseCase';

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
