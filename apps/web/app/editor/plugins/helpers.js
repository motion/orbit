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
          // allow passing in own wrap/unwrap
          if (wrap || unwrap) {
            const transform = editorStore.slate.getState().transform()
            if (isActive) {
              wrap(transform).apply()
            } else {
              unwrap(transform).apply()
            }
          } else {
            editorStore.transform(t =>
              t.setBlock(isActive ? BLOCKS.PARAGRAPH : type)
            )
          }
        }}
      />
    )
  })
