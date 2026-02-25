import { injectable } from 'inversify';

import { HomeRepository } from '@src/domain/repositories/HomeRepository';

@injectable()
export class HomeRepositoryImpl implements HomeRepository {
  async getWelcomeMessage(): Promise<string> {
    return 'Arquitectura lista: React Navigation + MobX + Inversify';
  }
}
