const createElement = require('@mcro/black/_/createElement').default
const React = require('react')

console.log('createElement', createElement)

if (React.createElement !== createElement) {
  React.createElement = createElement
}
