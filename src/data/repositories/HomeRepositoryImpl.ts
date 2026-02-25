import { injectable } from 'inversify';

import { HomeRepository } from '@/domain/repositories/HomeRepository';

@injectable()
export class HomeRepositoryImpl implements HomeRepository {
  async getWelcomeMessage(): Promise<string> {
    return 'Arquitectura lista: React Navigation + MobX + Inversify';
  }
}
