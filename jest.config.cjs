module.exports = {
  preset: 'jest-expo',
  roots: ['<rootDir>/src/__test__'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/__test__/setupTests.ts'],
  collectCoverageFrom: [
    'src/domain/**/*.ts',
    'src/ui/screens/**/*.ts',
    '!src/domain/repositories/*.ts',
    '!src/domain/services/*.ts',
    '!src/domain/useCases/UseCase.ts',
  ],
};
