const electron = (window.require && window.require('electron')) || {}

export const OS = electron.ipcRenderer

export default electron
