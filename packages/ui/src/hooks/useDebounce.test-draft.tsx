import { useState } from 'react'
import React from 'react'
import { setHookState } from 'utils/test'

import { useDebounce } from './useDebounce'

const reactMock = require('react')

const TestComp = () => null
const TestComp2 = () => null

function DebounceTest() {
  const [state, setState] = useState(0)
  const setDebounce = useDebounce(setState, 100)
  return (
    <>
      <button onClick={() => setDebounce(2)} />
      {state === 2 ? <TestComp /> : <TestComp2 />}
    </>
  )
}

describe('debounce fn', () => {
  it('should render delayed', () => {
    reactMock.useState = setHookState({
      data: [],
      isFetching: false,
    })
  })

  const wrapper = shallow(<DebounceTest />)

  expect(wrapper.find(<TestComp />).exists()).toEqual(true)
})
