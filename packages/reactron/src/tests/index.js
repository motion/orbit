import React from 'react'
// import ReactTestUtils from 'react-dom/test-utils'
import { App, Window, Menu, SubMenu, MenuItem, MenuItems } from '../index'
import { render } from '../renderer/render'

render(
  <App>
    <Menu>
      <SubMenu label="Electron">
        <MenuItems.About />
        <MenuItems.Separator />
        <MenuItems.Quit />
        <MenuItems.Separator />
        <MenuItem label="test2" />
      </SubMenu>
      <SubMenu label="Custom Menu">
        <MenuItem label="hello" onClick={() => console.log('hi')} />
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
