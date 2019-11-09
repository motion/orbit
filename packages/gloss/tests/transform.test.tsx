import { cleanup, render } from '@testing-library/react'
import React from 'react'

import { gloss } from '../_'

afterEach(cleanup)

it('outputs proper styles in simple case', () => {
  const Box = gloss({
    display: 'flex',
    boxSizing: 'border-box',
  })
  const LinkRow = gloss(Box, {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    background: 'red',
    borderLeftRadius: 100,
  })

  render(<LinkRow id="test1" />)

  const node = document.getElementById('test1')
  const style = window.getComputedStyle(node)

  // inherited from Box
  expect(style.display).toBe('flex')
  expect(style.boxSizing).toBe('border-box')
  // sets own styles
  expect(style.flexDirection).toBe('row')
  expect(style.flex).toBe('1')
  expect(style.background).toBe('red')
  expect(style.alignItems).toBe('center')
  // sets shorthand styles
  expect(style.borderTopLeftRadius).toBe('100px')
})
