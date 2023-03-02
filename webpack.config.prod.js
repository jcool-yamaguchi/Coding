//path モジュールの読み込み
const path = require('path');
// バンドルされる CSS を別の CSS ファイルに抽出する
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// HTML出力
const HtmlWebpackPlugin = require('html-webpack-plugin');
// dist出力時にリセット
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    front: './src/lib/app.ts',
    about: './src/lib/about-app.ts',
  },
  // entry: './src/lib/app.ts',
  output: {
    filename: './assets/js/[name]bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devtool: 'source-map',
  module: {
    rules: [
      //sass
      {
        // ローダーの処理対象ファイル
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              url: true,
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['autoprefixer'],
                  [
                    //PostCSS Sort Media Queries（mobile-first でソート）
                    'postcss-sort-media-queries',
                    {
                      sort: 'mobile-first',
                    },
                  ],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      // images
      {
        test: /\.(png|svg|jpe?g|gif|webp)$/i,
        generator: {
          filename: 'assets/images/[name][ext][query]',
        },
        type: 'asset/resource',
      },
      // TypeScript
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      //HTML
      {
        // ローダーの処理対象ファイル
        test: /\.html$/,
        // 利用するローダー
        loader: 'html-loader',
      },
    ],
  },
  plugins: [
    new CleanPlugin.CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './assets/css/style.css',
    }),
    new HtmlWebpackPlugin({
      template: './src/html/index.html',
      hash: true, // ハッシュ値をつけるかどうか
      chunks: ['front'], // エントリーポイントのkeyを入力する
    }),
    new HtmlWebpackPlugin({
      filename: 'about.html',
      template: './src/html/about.html',
      hash: true,
      chunks: ['about'], // エントリーポイントのkeyを入力する
    }),
  ],
};
