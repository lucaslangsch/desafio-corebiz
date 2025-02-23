module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,ts}",
    "!src/index.js", // Exclua arquivos que não deseja incluir na cobertura
    "!**/node_modules/**"
  ],
  coverageDirectory: "coverage"
};