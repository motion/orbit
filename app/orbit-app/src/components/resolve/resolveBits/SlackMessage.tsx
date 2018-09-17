import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { SlackBitDataMessage } from '@mcro/models'
import { RoundButtonPerson } from '../../../views/RoundButtonPerson'
import { ItemHideProps } from '../../../types/ItemHideProps'
import { View } from '@mcro/ui'
import { DateFormat } from '../../../views/DateFormat'
import { Markdown } from '../../../views/Markdown'
import { BitItemResolverProps } from '../ResolveBit'

type SlackMessageProps = BitItemResolverProps & {
  message: SlackBitDataMessage
  previousMessage?: SlackBitDataMessage
  highlight?: Object
  hide: ItemHideProps
}

const SlackMessageFrame = view(View, {
  padding: [0, 0],
})

const SlackMessageInner = view({
  padding: [2, 0, 2, 16],
})

@view
export class SlackMessage extends React.Component<SlackMessageProps> {
  render() {
    const { bit, extraProps, message, previousMessage, hide = {}, decoration } = this.props
    if (!message.text || !bit) {
      console.log(`no messagetext/bit ${JSON.stringify(message)}`)
      return null
    }
    const person = (bit.people || []).find(person => person.integrationId === message.user)
    let previousBySameAuthor = false
    let previousWithinOneMinute = false
    if (previousMessage) {
      previousBySameAuthor = message.user === previousMessage.user
      previousWithinOneMinute = message.time - previousMessage.time < 1000 * 60 // todo(nate) can you please check it?
    }
    const hideHeader = previousBySameAuthor && previousWithinOneMinute
    return (
      <SlackMessageFrame {...decoration.item}>
        {!hideHeader && (
          <UI.Row flexFlow="row" alignItems="center" userSelect="none" cursor="default">
            {extraProps ? extraProps.beforeTitle : null}
            {!!person && <RoundButtonPerson background="transparent" person={person} />}
            <div style={{ width: 6 }} />
            {!(hide && hide.itemDate) &&
              (!previousMessage || !previousWithinOneMinute) && (
                <UI.Text size={0.9} fontWeight={500} alpha={0.5}>
                  {<DateFormat date={new Date(message.time)} />}
                </UI.Text>
              )}
          </UI.Row>
        )}
        <SlackMessageInner>
          <UI.Text {...decoration.text}>
            <Markdown className="slack-markdown" source={message.text} />
          </UI.Text>
        </SlackMessageInner>
      </SlackMessageFrame>
    )
  }
}
