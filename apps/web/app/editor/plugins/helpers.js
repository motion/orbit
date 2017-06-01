import { view } from '~/helpers'
import { BLOCKS } from '~/editor/constants'
import { Button } from '~/ui'

export const createButton = (icon, type, opts = {}) =>
  view(({ editorStore }) => {
    const { wrap, unwrap } = opts
    const isActive = opts.isActive
      ? opts.isActive(editorStore.state)
      : editorStore.helpers.currentBlockIs(type)
    return (
      <Button
        icon={icon}
        active={isActive}
        onClick={(event: MouseEvent) => {
          console.log('clcik')
          event.preventDefault()
          event.stopPropagation()

          const action = isActive ? unwrap : wrap
          // allow passing in own wrap/unwrap
          editorStore.transform(
            t =>
              action
                ? action(t, editorStore)
                : t.setBlock(isActive ? BLOCKS.PARAGRAPH : type)
          )
          setTimeout(editorStore.focus)
        }}
      />
    )
  })
