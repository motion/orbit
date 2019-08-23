import { view } from '@o/black'
import { BLOCKS } from '~/views/editor/constants'
import { Button } from '@o/ui'

export const createButton = ({ icon, type, tooltip, wrap, unwrap, isActive }) =>
  view(({ editorStore }) => {
    const active = Boolean(
      isActive
        ? isActive(editorStore.state)
        : editorStore.helpers.currentBlockIs(type)
    )

    return (
      <Button
        icon={icon}
        active={active}
        tooltip={tooltip}
        onClick={(event: MouseEvent) => {
          event.preventDefault()
          event.stopPropagation()

          const action = active ? unwrap : wrap
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
