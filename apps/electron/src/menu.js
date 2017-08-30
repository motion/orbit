import React from 'react'

export default () =>
  <menu>
    <submenu label="Electron">
      <about />
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
    <submenu label="Custom Menu">
      <item label="Foo the bars" />
      <item label="Baz the quuxes" />
      <sep />
      <togglefullscreen />
    </submenu>
  </menu>
