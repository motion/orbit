import React from 'react'
import { Window } from '../index'
import { render } from '../renderer/render'

render(
  <Window
    transparent
    showDevTools
    vibrancy="dark"
    size={[200, 200]}
    position={[200, 200]}
    file="https://google.com"
  />
)
