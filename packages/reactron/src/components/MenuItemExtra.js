import React from 'react'
import { MenuItem } from '../index'

export const Separator = props => <MenuItem type="separator" {...props} />

const GENERIC_ROLES = {
  undo: 'Undo',
  redo: 'Redo',
  cut: 'Cut',
  copy: 'Copy',
  paste: 'Paste',
  pasteandmatchstyle: 'PasteAndMatchStyle',
  selectall: 'SelectAll',
  delete: 'Delete',
  minimize: 'Minimize',
  close: 'Close',
  quit: 'Quit',
  reload: 'Reload',
  forcereload: 'ForceReload',
  toggledevtools: 'ToggleDevTools',
  togglefullscreen: 'ToggleFullscreen',
  resetzoom: 'ResetZoom',
  zoomin: 'ZoomIn',
  zoomout: 'ZoomOut',
}

export const DARWIN_ROLES = {
  about: 'About',
  hide: 'Hide',
  hideothers: 'HideOthers',
  unhide: 'Unhide',
  startspeaking: 'StartSpeaking',
  stopspeaking: 'StopSpeaking',
  front: 'Front',
  zoom: 'Zoom',
  window: 'Window',
  help: 'Help',
  services: 'Services',
}

GENERIC_ROLES.forEach(role => {
  exports[GENERIC_ROLES[role]] = props => <MenuItem role={role} {...props} />
})

if (process.platform === 'darwin') {
  DARWIN_ROLES.forEach(role => {
    exports[DARWIN_ROLES[role]] = props => <MenuItem role={role} {...props} />
  })
}
