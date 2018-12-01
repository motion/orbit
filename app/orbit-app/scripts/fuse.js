const {
  FuseBox,
  SVGPlugin,
  CSSPlugin,
  ImageBase64Plugin,
  WebIndexPlugin,
  JSONPlugin,
  // BabelPlugin,
} = require('fuse-box')

const fuse = FuseBox.init({
  homeDir: '.',
  target: 'browser@es6',
  output: 'dist/$name.js',
  plugins: [
    // BabelPlugin({
    //   config: {
    //     presets: ['@mcro/babel-preset-motion'],
    //   },
    // }),
    WebIndexPlugin(),
    JSONPlugin(),
    SVGPlugin(),
    CSSPlugin(),
    ImageBase64Plugin(),
  ],
})

fuse.dev() // launch http server

fuse
  .bundle('app')
  .instructions(' > src/main.ts')
  .hmr()
  .watch()

fuse.run()
