/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['src/**/*.{js,ts}'],
    moduleNameMapper: {
        "^@/src/(.*)$": "<rootDir>/src/$1",
        "^@/tests/(.*)$": "<rootDir>/tests/$1",
        "^@/modules/(.*)$": "<rootDir>/src/modules/$1",
        "^@/config": "<rootDir>/src/config/index.ts",
        "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
        "^@/types/(.*)$": "<rootDir>/src/enums/$1",
        "package": "<rootDir>/package.json"
    },
    moduleDirectories: ['node_modules', 'src'],
    roots: ["<rootDir>/tests"],
    testMatch: [
        "**/tests/integration/**/*.(int).ts",
        "**/tests/unit/**/*.(spec).ts",  // Unit tests: *.spec.ts
        // Integration tests: *.int.ts
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.ts'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    testTimeout: 20000,
};