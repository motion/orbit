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
import { trace } from '../../../../../node_modules/mobx'

type InnerProps = {
  peekStore: PeekStore
  appStore: AppStore
}

@view
class PeekPageInner extends React.Component<InnerProps> {
  renderInnerContents = ({
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
    const { item } = this.props.peekStore.state
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
  }

  render() {
    trace()
    const { peekStore, appStore } = this.props
    if (!peekStore.state) {
      return null
    }
    const { item, peekId, model } = peekStore.state
    const type = (item && capitalize(item.type)) || 'Empty'
    const PeekContentsView = PeekPanes[type]
    if (!PeekContentsView) {
      console.error('none', type)
      return <div>no pane found</div>
    }
    console.log('render peek', peekId)
    return (
      <PeekContentsView
        key={peekId}
        item={item}
        bit={model}
        person={model}
        appStore={appStore}
        peekStore={peekStore}
      >
        {this.renderInnerContents}
      </PeekContentsView>
    )
  }
}

const decorator = compose(
  view.attach('appStore', 'searchStore'),
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
