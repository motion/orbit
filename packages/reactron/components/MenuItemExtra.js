import React from 'react'
import { MenuItem } from '../index'

export const Separator = props => <MenuItem type="separator" {...props} />

export const Undo = props => <MenuItem role="Undo" {...props} />
export const Redo = props => <MenuItem role="Redo" {...props} />
export const Cut = props => <MenuItem role="Cut" {...props} />
export const Copy = props => <MenuItem role="Copy" {...props} />
export const Paste = props => <MenuItem role="Paste" {...props} />
export const PasteAndMatchStyle = props => (
  <MenuItem role="PasteAndMatchStyle" {...props} />
)
export const SelectAll = props => <MenuItem role="SelectAll" {...props} />
export const Delete = props => <MenuItem role="Delete" {...props} />
export const Minimize = props => <MenuItem role="Minimize" {...props} />
export const Close = props => <MenuItem role="Close" {...props} />
export const Quit = props => <MenuItem role="Quit" {...props} />
export const Reload = props => <MenuItem role="Reload" {...props} />
export const ForceReload = props => <MenuItem role="ForceReload" {...props} />
export const ToggleDevTools = props => (
  <MenuItem role="ToggleDevTools" {...props} />
)
export const ToggleFullscreen = props => (
  <MenuItem role="ToggleFullscreen" {...props} />
)
export const ResetZoom = props => <MenuItem role="ResetZoom" {...props} />
export const ZoomIn = props => <MenuItem role="ZoomIn" {...props} />
export const ZoomOut = props => <MenuItem role="ZoomOut" {...props} />
export const About = props => <MenuItem role="About" {...props} />
export const Hide = props => <MenuItem role="Hide" {...props} />
export const HideOthers = props => <MenuItem role="HideOthers" {...props} />
export const Unhide = props => <MenuItem role="Unhide" {...props} />
export const StartSpeaking = props => (
  <MenuItem role="StartSpeaking" {...props} />
)
export const StopSpeaking = props => <MenuItem role="StopSpeaking" {...props} />
export const Front = props => <MenuItem role="Front" {...props} />
export const Zoom = props => <MenuItem role="Zoom" {...props} />
export const Window = props => <MenuItem role="Window" {...props} />
export const Help = props => <MenuItem role="Help" {...props} />
export const Services = props => <MenuItem role="Services" {...props} />
