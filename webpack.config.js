const path = require('path');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (_, context) => {
  const isProductionMode = context.mode !== 'development';

  const plugins = [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'node_modules/swagger-ui-dist',
          to: 'swagger-ui',
        },
      ],
    }),
  ];
  if (!isProductionMode) {
    plugins.push(
      new Dotenv({
        path: '.env',
        systemvars: true,
      }),
    );
  }
  const entry =
    process.env.entry === 'photo-uploader'
      ? {
          photoUploader: './src/photo-uploader.ts',
        }
      : {
          photoUploader: './src/photo-uploader.ts',
          bundle: './src/main.ts',
        };

  return {
    entry,
    target: 'node18',
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        formidable: false, // Ensure this alias is still relevant
        'class-transformer/storage': require.resolve(
          'class-transformer/cjs/storage',
        ),
        'class-transformer': require.resolve('class-transformer'),
      },
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          type: 'asset/source',
        },
        {
          test: /\.ts$/,
          use: {
            loader: 'ts-loader',
            options: {
              onlyCompileBundledFiles: true,
              transpileOnly: true,
            },
          },
          include: path.resolve(__dirname, 'src'),
          exclude: [/node_modules/, /\.d\.ts$/, /\.spec\.ts$/],
        },
      ],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      libraryTarget: 'commonjs2',
      clean: true,
    },
    optimization: {
      minimize: isProductionMode,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: false,
            compress: isProductionMode,
            sourceMap: false,
          },
          extractComments: false,
        }),
      ],
    },
    plugins,
    cache: {
      type: 'filesystem',
      buildDependencies: {
        config: [__filename],
      },
    },
    devtool: isProductionMode ? false : 'source-map', // Enable source maps in development for easier debugging
    stats: 'errors-only',
  };
};
