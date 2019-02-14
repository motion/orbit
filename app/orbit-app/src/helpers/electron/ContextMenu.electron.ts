import contextMenu from 'electron-context-menu'

contextMenu({
  prepend: (/* params, browserWindow */) => {
    return ContextMenu.prepend
  },
})

const ContextMenu = {
  prepend: [],

  update({ prepend }) {
    ContextMenu.prepend = prepend
  },
}

export default ContextMenu
