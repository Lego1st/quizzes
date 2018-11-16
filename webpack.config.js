let path = require('path');

module.exports = {
  entry: {
    'index': [
      './web_client/index.js'
    ]
  },
  output: {
    'path': path.resolve(__dirname, 'web_server', 'quizzes', 'static', 'quizzes', 'js'),
    'filename': 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  externals: {
  'Config': JSON.stringify({
    serverUrl: "http://af158492.ngrok.io"
    // serverUrl: "http://127.0.0.1:8000"
  })
}
};