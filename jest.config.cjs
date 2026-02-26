module.exports = {
  preset: 'jest-expo',
  roots: ['<rootDir>/src/__test__'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/domain/**/*.ts', 'src/ui/screens/**/*.ts'],
};
