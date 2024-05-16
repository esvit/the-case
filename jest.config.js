module.exports = {
  testEnvironment: 'node',
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.m?[tj]s?$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(m)?js$': '$1',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?ts$',
  modulePathIgnorePatterns: ['packages'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.ts',
    '**/*.mts',
    '!domain/**/interface/*.ts',
    '!migrations/*.ts',
    '!apps/api/routes/*.ts',
    '!apps/api/*.ts',
    '!**/*.d.ts',
    '!**/*.d.mts',
    '!*.ts',
  ],
};
