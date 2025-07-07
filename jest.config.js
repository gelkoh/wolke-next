/** @type {import('jest').Config} */
const config = {
    testEnvironment: "node",
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageProvider: "v8",

    moduleDirectories: [
        "node_modules",
        "<rootDir>"
    ],

    moduleFileExtensions: [
        "js",
        "jsx",
        "ts",
        "tsx",
        "json",
        "node"
    ],

    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },

    rootDir: ".",

    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
};

export default config;
