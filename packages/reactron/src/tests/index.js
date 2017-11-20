import React from 'react'
// import ReactTestUtils from 'react-dom/test-utils'
import { Window } from '../index'
import { render } from '../renderer/render'

render(
  <Window size={[200, 200]} position={[200, 200]} file="https://google.com" />
)
