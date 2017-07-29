const React = require('react')
const Ionize = require('react-ionize').default
const Path = require('path')

console.log('Ionize', Ionize)

Ionize.start(
  <app>
    <window show file={Path.resolve(__dirname, 'index.html')} />
  </app>
)
