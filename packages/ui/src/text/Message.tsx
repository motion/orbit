import { isDefined } from '@o/utils'
import { gloss } from 'gloss'
import { FunctionComponent } from 'react'
import React from 'react'

import { SizedSurface, SizedSurfaceProps } from '../SizedSurface'
import { SubTitle } from './SubTitle'
import { TitleProps } from './Title'

type MessageView = FunctionComponent<SizedSurfaceProps> & {
  Title: FunctionComponent<TitleProps>
}

const MessageTitle = (props: TitleProps) => <SubTitle {...props} />

export type MessageProps = SizedSurfaceProps & { title?: string }

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

Message.Title = MessageTitle

const MessageChrome = gloss(SizedSurface, {
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
  spaceSize: 'lg',
  sizeRadius: true,
  sizeIcon: 2,
  elementProps: {
    display: 'block',
    whiteSpace: 'normal',
  },
}
