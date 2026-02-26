import 'reflect-metadata';

import { HomeRepository } from '@/domain/repositories/HomeRepository';
import { GetWelcomeMessageUseCase } from '@/domain/useCases/GetWelcomeMessageUseCase';

const mockHomeRepository: jest.Mocked<HomeRepository> = {
  getWelcomeMessage: jest.fn().mockResolvedValue('Welcome message'),
};

describe('GetWelcomeMessageUseCase', () => {
  let useCase: GetWelcomeMessageUseCase;

  beforeEach(() => {
    useCase = new GetWelcomeMessageUseCase(mockHomeRepository);
  });

  it('should call homeRepository.getWelcomeMessage()', async () => {
    await useCase.run(undefined);
    expect(mockHomeRepository.getWelcomeMessage).toHaveBeenCalledTimes(1);
  });

  it('should return the welcome message from the repository', async () => {
    const result = await useCase.run(undefined);
    expect(result).toBe('Welcome message');
  });
});
