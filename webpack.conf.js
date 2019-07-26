const dotenv = require('dotenv');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const getPath = path.join.bind(path, __dirname);

const sources = getPath('src/front');
const dist = getPath('build');
const indexTemplate = getPath('src/front/public/index.html');

const EXTRACT_CSS = process.env.NODE_ENV === 'production';
const APPLY_OPTIMIZATIONS = process.env.NODE_ENV === 'production';

const scssLoaders = cssOptions => [
  EXTRACT_CSS ? MiniCssExtractPlugin.loader : 'style-loader',
  {
    loader: 'css-loader',
    options: cssOptions,
  },
  'sass-loader',
];

module.exports = () => {
  const env = dotenv.config().parsed;

  // reduce it to a nice object, the same as before
  const envKeys = env
    ? Object.keys(env).reduce((prev, next) => {
        // eslint-disable-next-line no-param-reassign
        prev[`process.env.${next}`] = JSON.stringify(env[next]);
        return prev;
      }, {})
    : {};

  return {
    mode: process.env.NODE_ENV || 'development',
    devtool: process.env.NODE_ENV ? false : 'eval-source-map',
    entry: ['@babel/polyfill', sources],
    output: {
      path: dist,
      publicPath: '/',
      filename: '[name].[contenthash].js',
    },
    devServer: {
      inline: true,
      port: process.env.FRONT_PORT,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: 'babel-loader',
        },
        {
          test: [/\.scss$/, /\.css$/],
          exclude: /\.module\.scss$/,
          use: scssLoaders({}),
        },
        {
          test: /\.module\.scss$/,
          use: scssLoaders({
            modules: true,
            localIdentName: '[name]__[local]--[hash:base64:5]',
          }),
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },
    resolve: {
      modules: ['src/front', 'node_modules'],
      extensions: ['.jsx', '.js', '.json'],
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new MiniCssExtractPlugin({
        filename: EXTRACT_CSS ? '[name].[hash].css' : '[name].css',
        chunkFilename: EXTRACT_CSS ? '[id].[hash].css' : '[id].css',
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: indexTemplate,
        publicUrl: process.env.PUBLIC_URL,
      }),
      new webpack.DefinePlugin({}),
      new CopyWebpackPlugin([
        {
          from: getPath('src/front/public'),
          ignore: 'index.html',
          to: dist,
        },
      ]),
      new webpack.HashedModuleIdsPlugin(),
    ],
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
    },
    optimization: APPLY_OPTIMIZATIONS
      ? {
          runtimeChunk: 'single',
          splitChunks: {
            chunks: 'all',
          },
        }
      : {},
  };
};
