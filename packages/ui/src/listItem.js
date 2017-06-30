// @flow
import React from 'react'
import { view } from '@mcro/black'
import { object, string } from 'prop-types'
import FakeAvatar from './fake/fakeAvatar'
import Glow from './effects/glow'
import Text from './text'
import Surface from './surface'

export type ItemProps = {
  children?: React$Element<any>,
  primary?: React$Element<any>,
  secondary?: React$Element<any>,
  avatar?: React$Element<any>,
  fakeAvatar?: boolean,
  date?: React$Element<any>,
  dateSize?: number,
  meta?: React$Element<any>,
  before?: React$Element<any>,
  after?: React$Element<any>,
  isLastElement?: boolean,
  isFirstElement?: boolean,
  row?: boolean,
  onClick?: Function,
  onToggle?: Function,
  onItemMount?: Function,
}

@view.ui
export default class ListItem {
  props: ItemProps

  static isListItem = true

  static contextTypes = {
    uiTheme: object,
    uiActiveTheme: string,
  }

  componentDidMount() {
    if (this.props.onItemMount) {
      this.props.onItemMount(this)
    }
  }

  render({
    children,
    primary,
    secondary,
    avatar,
    fakeAvatar,
    date,
    dateSize,
    meta,
    before,
    after,
    isLastElement,
    isFirstElement,
    row,
    onToggle,
    onItemMount,
    ...props
  }: ItemProps) {
    const theme = this.context.uiTheme[this.context.uiActiveTheme]
    return (
      <Surface
        border={false}
        borderBottom={[1, theme ? theme.base.borderColor : 'transparent']}
        padding={[12, 12]}
        {...props}
      >
        <image if={avatar || fakeAvatar}>
          <img if={avatar && !fakeAvatar} src={avatar} $avatar />
          <FakeAvatar if={fakeAvatar} size={50} $avatar $padavatar />
        </image>
        <content>
          <above if={primary || after || before || date}>
            <before if={before}>
              {before}
            </before>
            <prop if={primary || secondary} $col $hasAvatar={!!avatar}>
              <Text $primary size={1.2} ellipse>
                {primary}
              </Text>
              <Text if={secondary} size={1} $secondary ellipse>
                {secondary}
              </Text>
            </prop>
            <Text if={date} $date $meta cutoff>
              {date}
            </Text>
            <div if={meta} $meta>
              {meta}
            </div>
            <after if={after}>
              {after}
            </after>
          </above>
          <children if={children} $row={row}>
            {children}
          </children>
        </content>
      </Surface>
    )
  }

  static style = {
    item: {
      padding: [4, 6],
      cursor: 'pointer',
      maxWidth: '100%',
      flexFlow: 'row',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 0,
      fontWeight: 500,
      '&:active': {
        background: [0, 0, 0, 0.05],
      },
    },
    content: {
      flex: 1,
      maxWidth: '100%',
      justifyContent: 'center',
    },
    row: {
      flexFlow: 'row',
    },
    above: {
      maxWidth: '100%',
      flexFlow: 'row',
      flex: 'none',
      justifyContent: 'space-between',
    },
    section: {
      width: '100%',
      maxWidth: '100%',
      userSelect: 'none',
    },
    prop: {
      flex: 1,
      maxWidth: '100%',
      overflow: 'hidden',
    },
    date: {
      userSelect: 'none',
      fontSize: 12,
    },
    col: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    flex: {
      flexGrow: 1,
    },
    avatar: {
      width: 40,
      height: 40,
      margin: [0, 10, 0, 0],
    },
    cutoff: {
      display: 'block',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
    },
    meta: {
      margin: ['auto', 0],
      opacity: 0.4,
    },
    after: {
      margin: ['auto', 0, 'auto', 5],
    },
    before: {
      margin: ['auto', 5, 'auto', 0],
    },
    children: {
      flex: 1,
      overflowY: 'scroll',
    },
  }
}
