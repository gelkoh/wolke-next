export default {
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
        "^(\\.{1,2}/.*)\\.js$": "$1"
    },

    transform: {
        "^.+\\.[jt]sx?$": ["babel-jest", { configFile: "./babel.jest.config.mjs" }]
    },

    transformIgnorePatterns: ["/node_modules/"],

    maxWorkers: 1,
    testTimeout: 30000
};
