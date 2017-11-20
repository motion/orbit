import React from 'react'
// import ReactTestUtils from 'react-dom/test-utils'
import { App, Window, Menu, SubMenu, MenuItem } from '../index'
import { render } from '../renderer/render'

console.log({ App, Window, Menu, SubMenu, MenuItem })

render(
  <App>
    <Menu>
      <SubMenu label="Electron">
        <MenuItem label="about" />
      </SubMenu>
    </Menu>
    <Window size={[200, 200]} position={[200, 200]} file="https://google.com" />
  </App>
)

process.on('unhandledRejection', function(error, p) {
  console.log('PromiseFail:')
  if (error.stack) {
    console.log(error.message)
    console.log(error.stack)
  } else {
    console.log(error)
  }
})
