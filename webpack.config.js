const autoprefixer = require('autoprefixer');


module.exports = {
  entry: "./src/main.js",
  devtool: 'source-map',
  output: {
    filename: "./dist/bundle.js"
  },
  module: {
    loaders: [
      { test: /\.scss$/, loaders: ["style", "css", "postcss", "sass"] },
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  postcss: () => [autoprefixer]

};
