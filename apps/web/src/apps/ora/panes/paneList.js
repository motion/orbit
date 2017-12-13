import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view
export default class PaneList {
  render({ index, paneStore, shouldMeasure, listProps, stackItem }) {
    // if (index === 1) {
    //   console.log(
    //     'PaneList.render',
    //     index,
    //     shouldMeasure(),
    //     paneStore.items && paneStore.items.length,
    //     paneStore.contentVersion
    //   )
    // }
    if (stackItem && typeof stackItem.id === 'undefined') {
      return null
    }
    if (!paneStore.items) {
      return null
    }

    const itemsKey = `${index}${paneStore.contentVersion}${
      paneStore.items.length
    }`
    const { virtualized, ...restListProps } = listProps
    const finalVirtualized = virtualized && {
      measure: shouldMeasure && shouldMeasure(),
      ...(virtualized === true ? {} : virtualized),
    }
    return (
      <UI.List
        key={index}
        hideScrollBar
        itemsKey={itemsKey}
        getRef={paneStore.setList}
        items={paneStore.items}
        virtualized={finalVirtualized}
        parentSize
        {...restListProps}
      />
    )
  }
}
