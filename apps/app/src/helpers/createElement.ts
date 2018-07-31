const createElement = require('@mcro/black/_/createElement').default
const React = require('react')

if (React.createElement !== createElement) {
  React.createElement = createElement
}
