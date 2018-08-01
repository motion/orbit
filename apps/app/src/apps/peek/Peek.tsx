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
import { RoundButton } from '../../views'

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

const PeekActionBar = view({
  padding: 10,
  background: '#fff',
  borderTop: [1, '#eee'],
  flexFlow: 'row',
  overflow: 'hidden',
  alignItems: 'center',
})

const Cmd = view({
  opacity: 0.5,
})

type PeekPane = React.SFC<PeekPaneProps>

@view
class PeekPageInner extends React.Component<Props> {
  render() {
    const { peekStore, appStore, searchStore } = this.props
    if (!peekStore.state) {
      return null
    }
    const { item, peekId, model } = peekStore.state
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
            preBody,
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
              {preBody}
              <PeekContent peekStore={peekStore}>{content}</PeekContent>
              <PeekActionBar>
                <div />
                <UI.View flex={1} />
                <UI.Row alignItems="center">
                  <RoundButton alignItems="center">
                    Copy Link <Cmd>⌘+Shift+C</Cmd>
                  </RoundButton>
                  <RoundButton alignItems="center">
                    Open <Cmd>⌘+Enter</Cmd>
                  </RoundButton>
                </UI.Row>
              </PeekActionBar>
            </>
          )
        }}
      </PeekContentsView>
    )
  }
}
