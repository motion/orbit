import React from 'react'
import createElement from '@mcro/black/_/createElement'

// gloss all <tag />s
React.createElement = createElement
window.createElement = createElement
