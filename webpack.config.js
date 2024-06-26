import path from 'path';
import { fileURLToPath } from 'url';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import dotenv from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const getPath = path.join.bind(path, __dirname);

const sources = getPath('src/front');
const dist = getPath('build');
const indexTemplate = getPath('src/front/public/index.html');

const production = process.env.NODE_ENV === 'production';
const envConfig = dotenv.config().parsed || {};

// create an array of env variables with process.env. prefix
const envKeys = Object.keys(envConfig).reduce(
  (acc, key) => ({
    ...acc,
    [`process.env.${key}`]: JSON.stringify(envConfig[key]),
  }),
  {},
);

const EXTRACT_CSS = production;
const APPLY_OPTIMIZATIONS = production;

const scssLoaders = (cssOptions) => [
  EXTRACT_CSS ? MiniCssExtractPlugin.loader : 'style-loader',
  {
    loader: 'css-loader',
    options: cssOptions,
  },
  'sass-loader',
];

const plugins = [
  new webpack.DefinePlugin({
    ...envKeys,
  }),
  new MiniCssExtractPlugin({
    filename: EXTRACT_CSS ? '[name].[contenthash].css' : '[name].css',
    chunkFilename: EXTRACT_CSS ? '[id].[contenthash].css' : '[id].css',
  }),
  new HtmlWebpackPlugin({
    inject: true,
    template: indexTemplate,
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: getPath('src/front/public'),
        to: dist,
        globOptions: {
          ignore: ['**/index.html'],
        },
      },
    ]
  }),
];

if (production) {
  plugins.push(new webpack.ids.HashedModuleIdsPlugin());
}

export default {
  mode: process.env.NODE_ENV || 'development',
  devtool: production ? false : 'eval-source-map',
  entry: sources,
  output: {
    path: dist,
    publicPath: '/',
    filename: '[name].[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        resolve: {
          fullySpecified: false,
        }
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
      // {
      //   test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
      //   loader: 'url-loader',
      //   options: {
      //     limit: 10000,
      //     name: 'static/media/[name].[hash:8].[ext]',
      //   },
      // },
    ],
  },
  resolve: {
    modules: ['src/front', 'node_modules'],
    extensions: ['.jsx', '.js', '.json'],
    // does not seem useful
    // fallback: { crypto: false },
  },
  plugins,
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
