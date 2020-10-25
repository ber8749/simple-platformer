const paths = require('./paths');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // Where webpack looks to start building the bundle
  entry: {
    main: paths.src + '/index.js'
  },

  module: {
    rules: [
      // CSS, PostCSS, and Sass
      {
        test: /\.(sass|scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      // Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      // Audio
      {
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        use: 'file-loader'
      }
    ]
  },

  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Generates an HTML file from a template
    // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
    new HtmlWebpackPlugin({
      title: 'platformer',
      // favicon: paths.src + '/images/favicon.png',
      template: paths.src + '/template.html', // template file
      filename: 'index.html', // output file
    }),
  ]
}
