module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    // Mocks CSS module imports
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
     // Transform JS/JSX/TS/TSX files using Babel
     '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};