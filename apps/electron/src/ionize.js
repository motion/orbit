const React = require('react')
const Ionize = require('@mcro/ionize').default

Ionize.start(
  <app>
    <window
      show
      showDevTools
      file="http://jot.dev"
      titleBarStyle="hidden-inset"
      vibrancy="dark"
      transparent
      webPreferences={{
        experimentalFeatures: true,
        transparentVisuals: true,
      }}
    />
  </app>
)
