import { PeekStore } from './stores/PeekStore'
import * as React from 'react'
import { view, compose } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as PeekPanes from './panes'
import { capitalize } from 'lodash'
import { PeekFrame } from './views/PeekFrame'
import { AppStore } from '../../stores/AppStore'
import { PeekContent } from './views/PeekContent'
import { PeekHeader } from './views/PeekHeader'

const PeekPageInner = view(({ peekStore, appStore }) => {
  if (!peekStore.state) {
    return null
  }
  const { item, peekId } = peekStore.state
  const type = (item && capitalize(item.type)) || 'Empty'
  const PeekContentsView = PeekPanes[type]
  if (!PeekContentsView) {
    console.error('none', type)
    return <div>no pane found</div>
  }
  return (
    <PeekContentsView
      key={peekId}
      item={item}
      bit={peekStore.model}
      person={peekStore.model}
      appStore={appStore}
      peekStore={peekStore}
    >
      {({
        title,
        permalink,
        icon,
        date,
        subhead,
        subtitle,
        after,
        content,
        headerProps,
      }) => {
        return (
          <>
            <PeekHeader
              title={title || item.title}
              subtitle={subtitle}
              after={after}
              icon={icon}
              date={date}
              subhead={subhead}
              permalink={permalink}
              integration={item.integration || item.type}
              {...headerProps}
            />
            <PeekContent>{content}</PeekContent>
          </>
        )
      }}
    </PeekContentsView>
  )
})

const decorator = compose(
  view.attach('appStore'),
  view.provide({
    peekStore: PeekStore,
  }),
)

type Props = {
  appStore?: AppStore
  peekStore?: PeekStore
}

export const Peek = decorator(({ appStore, peekStore }: Props) => {
  return (
    <div>
      <UI.Theme name="light">
        <PeekFrame>
          <PeekPageInner appStore={appStore} peekStore={peekStore} />
        </PeekFrame>
      </UI.Theme>
    </div>
  )
})
