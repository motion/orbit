import { PeekStore } from './PeekStore'
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as PeekContents from './peek/PeekContents'
import { capitalize } from 'lodash'
import { PeekFrame } from './peek/PeekFrame'
import { AppStore } from '../stores/AppStore'
import { PeekContent } from './peek/PeekContent'
import { PeekHeader } from './peek/PeekHeader'
import { PeekBitInformation } from './peek/PeekContents/PeekBitInformation'
import { Bit, Person } from '@mcro/models'

const PeekPageInner = view(({ peekStore, appStore }) => {
  if (!peekStore.state) {
    return null
  }
  const { item, peekId } = peekStore.state
  const type = (item && capitalize(item.type)) || 'Empty'
  const PeekContentsView = PeekContents[type]
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
            <PeekBitInformation
              if={
                peekStore.model instanceof Bit ||
                peekStore.model instanceof Person
              }
              body={
                peekStore.model.body ||
                'ui kit size prop async migration freelance distrbiution org integration'
              }
              people={peekStore.model.people}
            />
          </>
        )
      }}
    </PeekContentsView>
  )
})

@view.attach('appStore')
@view.provide({
  peekStore: PeekStore,
})
export class PeekPage extends React.Component<{
  appStore?: AppStore
  peekStore?: PeekStore
}> {
  render() {
    const { appStore, peekStore } = this.props
    return (
      <div>
        <UI.Theme name="light">
          <PeekFrame>
            <PeekPageInner appStore={appStore} peekStore={peekStore} />
          </PeekFrame>
        </UI.Theme>
      </div>
    )
  }
}
