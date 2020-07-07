module.exports = api => {
  api.cache.forever();
  return {
    extends: `../babel.config`,
    plugins: [
      [
        `@babel/plugin-transform-react-jsx`,
        {
          pragma: `h` // default pragma for atomico
        }
      ],
      "@babel/plugin-proposal-class-properties"
    ]
  };
};
