import { view } from '~/helpers'
import { BLOCKS } from '~/editor/constants'
import { Button } from '~/ui'

export const createButton = (type, icon) =>
  view(({ editorStore }) => {
    const isActive = editorStore.helpers.currentBlockIs(type)
    console.log('button mayn', isActive)
    return (
      <Button
        icon={icon}
        active={isActive}
        onClick={() =>
          editorStore.transform(t =>
            t.setBlock(isActive ? BLOCKS.PARAGRAPH : type)
          )}
      />
    )
  })
