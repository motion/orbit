import { View } from '@o/ui/test'
import * as React from 'react'
import { render } from 'react-dom'

function Main() {
  return (
    <>
      <div>hi</div>
      <View background="yellow">some children</View>
    </>
  )
}

render(<Main />, document.querySelector('#app'))
