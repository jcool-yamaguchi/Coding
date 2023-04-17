//path モジュールの読み込み
const path = require('path');
// バンドルされる CSS を別の CSS ファイルに抽出する
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// HTML出力
const HtmlWebpackPlugin = require('html-webpack-plugin');
// dist出力時にリセット
const CleanPlugin = require('clean-webpack-plugin');
// 環境変数の取得
const isProduction = process.env.NODE_ENV === 'production';

//共通の設定
const config = {
  //　エントリーポイント
  entry: {
    front: './src/lib/app.ts', // frontページ用のJavaScript
    about: './src/lib/about-app.ts', // aboutページ用のJavaScript
    // その他ページを増やす場合はここに追加
  },
  output: {
    filename: './assets/js/[name]bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    // CSSを別ファイルに出力する
    new MiniCssExtractPlugin({
      filename: 'assets/css/style.css',
    }),
    ...[
      // ここで指定したファイル名でdistに出力される
      {
        template: './src/html/index.html', // テンプレートファイル
        filename: 'index.html', // 出力ファイル名
        hash: true, // バンドルしたファイル名にハッシュ値を付与する
        chunks: ['front'], // バンドルするJavaScriptファイル
      },
      {
        filename: 'about.html',
        template: './src/html/about.html',
        hash: true,
        chunks: ['about'],
      },
    ].map((page) => new HtmlWebpackPlugin(page)),
  ],
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
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    static: 'dist',
    open: true,
    hot: true,
    host: '0.0.0.0',
    watchFiles: {
      paths: ['src/**/*'],
    },
  },
  devtool: 'source-map',
};

module.exports = () => {
  if (isProduction) {
    // 本番環境のときの設定
    config.mode = 'production';
    // configにプラグインの追加
    config.plugins.push(new CleanPlugin.CleanWebpackPlugin());
  }
  if (!isProduction) {
    // 開発環境のときの設定
    config.mode = 'development';
  }
  return config;
};
