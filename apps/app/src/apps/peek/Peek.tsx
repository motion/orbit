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
import { SearchStore } from '../../stores/SearchStore'
import { PeekPaneProps, PeekContents } from './PeekPaneProps'

type Props = {
  appStore?: AppStore
  peekStore?: PeekStore
  searchStore?: SearchStore
}

const decorator = compose(
  view.attach('appStore', 'searchStore'),
  view.provide({
    peekStore: PeekStore,
  }),
)

export const Peek = decorator(({ appStore, searchStore, peekStore }: Props) => {
  return (
    <UI.Theme name="light">
      <PeekFrame>
        <PeekPageInner
          appStore={appStore}
          searchStore={searchStore}
          peekStore={peekStore}
        />
      </PeekFrame>
    </UI.Theme>
  )
})

type PeekPane = React.SFC<PeekPaneProps>

@view
class PeekPageInner extends React.Component<Props> {
  render() {
    const { peekStore, appStore, searchStore } = this.props
    if (!peekStore.curState) {
      return null
    }
    const { item, peekId, model } = peekStore.curState
    const type = (item && capitalize(item.type)) || 'Empty'
    const PeekContentsView = PeekPanes[type] as PeekPane
    if (!PeekContentsView) {
      console.error('none', type)
      return <div>no pane found</div>
    }
    return (
      <PeekContentsView
        key={peekId}
        item={item}
        bit={model}
        person={model}
        appStore={appStore}
        peekStore={peekStore}
        searchStore={searchStore}
      >
        {(resolvedProps: PeekContents) => {
          const {
            title,
            titleAfter,
            permalink,
            icon,
            date,
            subhead,
            subtitle,
            subtitleBefore,
            subtitleAfter,
            after,
            content,
            headerProps,
          } = resolvedProps
          return (
            <>
              <PeekHeader
                title={title}
                titleAfter={titleAfter}
                subtitle={subtitle}
                subtitleBefore={subtitleBefore}
                subtitleAfter={subtitleAfter}
                after={after}
                icon={icon}
                date={date}
                subhead={subhead}
                permalink={permalink}
                {...headerProps}
              />
              <PeekContent peekStore={peekStore}>{content}</PeekContent>
            </>
          )
        }}
      </PeekContentsView>
    )
  }
}
