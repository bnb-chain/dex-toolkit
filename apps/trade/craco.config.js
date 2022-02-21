const path = require('path');
const { loaderByName, getLoader, throwUnexpectedConfigError } = require('@craco/craco');

const PATHS = [
  path.join(__dirname, '../../widgets/chart'),
  path.join(__dirname, '../../widgets/header'),
  path.join(__dirname, '../../widgets/history'),
  path.join(__dirname, '../../widgets/market'),
  path.join(__dirname, '../../widgets/order-book'),
  path.join(__dirname, '../../widgets/trades'),
  path.join(__dirname, '../../widgets/pairs'),
  path.join(__dirname, '../../widgets/limit-order'),
  path.join(__dirname, '../../common/store'),
  path.join(__dirname, '../../common/utils'),
  path.join(__dirname, '../../common/context'),
  path.join(__dirname, '../../common/hooks'),
];

const throwError = (message) =>
  throwUnexpectedConfigError({
    packageName: 'craco',
    githubRepo: 'gsoft-inc/craco',
    message,
    githubIssueQuery: 'webpack',
  });

module.exports = {
  babel: {
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-class-static-block',
    ],
  },
  webpack: {
    configure: (webpackConfig, { paths }) => {
      const tsLoader = {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: paths.appSrc,
        loader: require.resolve('ts-loader'),
        options: { transpileOnly: true },
      };

      const { isFound, match } = getLoader(webpackConfig, loaderByName('babel-loader'), tsLoader);

      if (isFound) {
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        match.loader.include = include.concat(PATHS);
      }

      return webpackConfig;
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true,
          },
        },
      },
    },
  },
};
