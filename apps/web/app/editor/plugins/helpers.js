import { view } from '~/helpers'
import { BLOCKS } from '~/editor/constants'
import { Button } from '~/ui'

export const createButton = (icon, type, { wrap, unwrap } = {}) =>
  view(({ editorStore }) => {
    const isActive = editorStore.helpers.currentBlockIs(type)
    return (
      <Button
        icon={icon}
        active={isActive}
        onClick={() => {
          const action = isActive ? unwrap : wrap
          // allow passing in own wrap/unwrap
          editorStore.transform(
            t =>
              action
                ? action(t)
                : t.setBlock(isActive ? BLOCKS.PARAGRAPH : type)
          )
        }}
      />
    )
  })
