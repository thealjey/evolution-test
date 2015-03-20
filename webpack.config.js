module.exports = {
  entry: './src/app.js',
  output: {
    path: './out/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?optional=runtime&loose=all'
      }
    ]
  }
};