import * as React from 'react'

export default props => (
  <menu>
    <submenu label="Orbit">
      <about />
      <preferences accelerator="CmdOrCtrl+," onClick={props.onPreferences} />
      <sep />
      <hide />
      <hideothers />
      <unhide />
      <sep />
      <quit />
    </submenu>
    <submenu label="Edit">
      <undo />
      <redo />
      <sep />
      <cut />
      <copy />
      <paste />
      <selectall />
    </submenu>
    <submenu label="Window">
      <togglefullscreen />
    </submenu>
  </menu>
)
