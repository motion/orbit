import { isDefined } from '@o/utils'
import { gloss } from 'gloss'
import { FunctionComponent } from 'react'
import React from 'react'

import { Surface, SurfaceProps } from '../Surface'
import { SubTitle } from './SubTitle'
import { TitleProps } from './Title'

type MessageView = FunctionComponent<SurfaceProps> & {
  Title: FunctionComponent<TitleProps>
}

export type MessageProps = SurfaceProps & { title?: string }

export const Message: MessageView = (props: MessageProps) => {
  if (isDefined(props.title)) {
    return (
      <MessageChrome {...props}>
        <MessageTitle>{props.title}</MessageTitle>
        {props.children}
      </MessageChrome>
    )
  }
  return <MessageChrome {...props} />
}

export const MessageTitle = SubTitle
Message.Title = MessageTitle

const MessageChrome = gloss(Surface, {
  userSelect: 'text',
  cursor: 'text',
})

MessageChrome.defaultProps = {
  sizeLineHeight: 1.35,
  className: 'ui-message',
  hoverStyle: false,
  activeStyle: false,
  flexDirection: 'row',
  padding: 'sm',
  space: 'lg',
  sizeRadius: true,
  sizeIcon: 2,
  elementProps: {
    display: 'block',
    whiteSpace: 'normal',
  },
}
