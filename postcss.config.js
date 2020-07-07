const autoprefixer = require(`autoprefixer`);
const nested = require(`postcss-nested`);
const postcssImport = require(`postcss-import`);
const presetEnv = require(`postcss-preset-env`);
const simpleVars = require(`postcss-simple-vars`);
const comment = require(`postcss-comment`);
const mixins = require(`postcss-mixins`);
const functions = require(`postcss-functions`);
const colorFunctions = require(`postcss-color-function`);

module.exports = {
  parser: comment,
  plugins: [postcssImport, presetEnv, autoprefixer, mixins, functions, colorFunctions, nested, simpleVars]
};
