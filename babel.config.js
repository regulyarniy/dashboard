module.exports = api => {
  const isTest = api.env(`test`);
  return {
    presets: [
      [
        `@babel/preset-env`,
        {
          targets: isTest ? { node: `10` } : { chrome: `65` },
          useBuiltIns: isTest ? `usage` : false,
          corejs: 3,
          modules: isTest ? `commonjs` : false
        }
      ],
      `@babel/preset-react`
    ],
    plugins: [`react-hot-loader/babel`]
  };
};
