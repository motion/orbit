import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import Markdown from 'react-markdown'
import { Bit, SlackBitDataMessage } from '@mcro/models'
import { RoundButtonPerson } from '../../../views/RoundButtonPerson'
import { TimeAgo } from '../../../views/TimeAgo'
import { ItemHideProps } from '../../../types/ItemHideProps'
import { View } from '@mcro/ui'
import { markdownOptions } from '../../../constants/markdownOptions'

type SlackMessageProps = {
  bit: Bit
  message: SlackBitDataMessage
  previousMessage?: SlackBitDataMessage
  itemProps?: Object
  highlight?: Object
  hide: ItemHideProps
}

const SlackMessageFrame = view(View, {
  padding: [2, 0],
})

const SlackMessageInner = view({
  padding: [2, 0, 2, 20],
})

@view
export class SlackMessage extends React.Component<SlackMessageProps> {
  render() {
    const { bit, message, previousMessage, hide = {}, itemProps } = this.props
    if (!message.text || !bit) {
      console.log(`no messagetext/bit ${JSON.stringify(message)}`)
      return null
    }
    const person = (bit.people || []).find(
      person => person.integrationId === message.user,
    )
    let previousBySameAuthor = false
    let previousWithinOneMinute = false
    if (previousMessage) {
      previousBySameAuthor = message.user === previousMessage.user
      previousWithinOneMinute = message.time - previousMessage.time < 1000 * 60 // todo(nate) can you please check it?
    }
    const hideHeader = previousBySameAuthor && previousWithinOneMinute
    return (
      <SlackMessageFrame {...itemProps}>
        {!hideHeader && (
          <UI.Row
            flexFlow="row"
            alignItems="center"
            margin={[0, 0, 2, 0]}
            padding={[2, 0]}
            userSelect="none"
            cursor="default"
          >
            {!!person && (
              <RoundButtonPerson background="transparent" person={person} />
            )}
            <div style={{ width: 6 }} />
            {!(hide && hide.date) &&
              (!previousMessage || !previousWithinOneMinute) && (
                <UI.Text alpha={0.5}>
                  {<TimeAgo date={new Date(message.time)} />}
                </UI.Text>
              )}
          </UI.Row>
        )}
        <SlackMessageInner>
          <UI.Text
            className="searchable-item"
            fontWeight={400}
            sizeLineHeight={0.85}
          >
            <Markdown source={message.text} {...markdownOptions} />
          </UI.Text>
        </SlackMessageInner>
      </SlackMessageFrame>
    )
  }
}
