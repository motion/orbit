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

  static defaultProps = {
    size: 1,
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
    size,
    ...props
  }: ItemProps) {
    const theme = this.context.uiTheme[this.context.uiActiveTheme]

    return (
      <Surface
        $item
        border={false}
        borderBottom={[1, theme ? theme.base.borderColor : 'transparent']}
        borderRadius={isLastElement || isFirstElement ? 8 : 0}
        borderBottomRadius={isLastElement}
        borderTopRadius={isFirstElement}
        overflow="hidden"
        padding={[12, 6]}
        hoverable
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
              <Text $primary size={size} ellipse>
                {primary}
              </Text>
              <Text
                if={secondary}
                size={size * 0.85}
                color={[0, 0, 0, 0.5]}
                ellipse
              >
                {secondary}
              </Text>
            </prop>
            <Text if={date} size={size * 0.6} $date $meta ellipse>
              {date}
            </Text>
            <after if={after}>
              {after}
            </after>
          </above>
          <children if={children} $$row={row}>
            {children}
          </children>
        </content>
      </Surface>
    )
  }

  static style = {
    item: {
      cursor: 'pointer',
      maxWidth: '100%',
      flexFlow: 'row',
      position: 'relative',
      overflow: 'hidden',
      zIndex: 0,
    },
    content: {
      flex: 1,
      maxWidth: '100%',
      justifyContent: 'center',
    },
    above: {
      maxWidth: '100%',
      flexFlow: 'row',
      flex: 'none',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    section: {
      width: '100%',
      maxWidth: '100%',
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
