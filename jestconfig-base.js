module.exports = {
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    transform: {
        '^.+\\.(t|j)sx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    collectCoverage: true,
    coveragePathIgnorePatterns: ['(__tests__/.*.mock).(jsx?|tsx?)$'],
    verbose: true,
}
