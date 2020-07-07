const { defaults } = require(`jest-config`);

module.exports = {
  ...defaults,
  testPathIgnorePatterns: [`/cypress/`],
  setupFilesAfterEnv: [`./jest.setup.js`], // set up the testing framework before each test
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|svg)$': `<rootDir>/__mocks__/fileMock.js`,
    '\\.(css|less|scss|sss|styl|pcss)$': `<rootDir>/node_modules/identity-obj-proxy` // CSS Modules mock
  },
  transformIgnorePatterns: [`/node_modules/(?!atomico)`]
};
