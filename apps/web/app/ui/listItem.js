// @flow
import React from 'react'
import { view } from '@jot/black'
import FakeAvatar from './fake/fakeAvatar'
import Glow from './glow'

export type ItemProps = {
  children?: React$Element,
  primary?: string | React$Element,
  secondary?: string | React$Element,
  avatar?: React$Element,
  fakeAvatar?: boolean,
  date?: string | React$Element,
  dateSize?: number,
  meta?: string | React$Element,
  before?: string | React$Element,
  after?: string | React$Element,
  isLastElement?: boolean,
  highlight?: boolean,
  isFirstElement?: boolean,
  nohover?: boolean,
  row?: boolean,
  onClick?: Function,
  slim?: boolean,
  onToggle?: Function,
  active?: boolean,
  horizontal?: boolean,
  itemStyle?: Object,
  style?: Object,
  dark?: boolean,
  padded?: boolean,
  padding?: Array | number,
  light?: boolean,
  height?: number,
  onItemMount?: Function,
}

@view.ui
export default class ListItem {
  props: ItemProps

  static isListItem = true

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
    highlight,
    isFirstElement,
    nohover,
    row,
    onClick,
    slim,
    onToggle,
    active,
    horizontal,
    itemStyle,
    style,
    dark,
    padded,
    padding,
    light,
    height,
    onItemMount,
    ...props
  }: ItemProps) {
    return (
      <item
        ref="item"
        $isLast={isLastElement}
        $highlight={highlight}
        $isFirst={isFirstElement}
        $nohover={nohover}
        onClick={onClick}
        {...props}
      >
        <Glow
          if={onClick && !nohover}
          color={dark ? [255, 255, 255] : [0, 0, 0]}
          opacity={dark ? 0.04 : 0.06}
          scale={0.7}
          parent={() => this.refs.item}
        />
        <image if={avatar || fakeAvatar}>
          <img if={avatar && !fakeAvatar} src={avatar} $avatar />
          <FakeAvatar if={fakeAvatar} size={50} $avatar $padavatar />
        </image>
        <content>
          <above if={primary || after || before || date}>
            <before if={before}>{before}</before>
            <prop if={primary || secondary} $col $hasAvatar={!!avatar}>
              <section $primary>{primary}</section>
              <section if={secondary} $secondary>
                <cutoff>{secondary}</cutoff>
              </section>
            </prop>
            <date if={date} style={{ fontSize: dateSize }} $meta>
              <cutoff>{date}</cutoff>
            </date>
            <div if={meta} $meta>{meta}</div>
            <after if={after}>{after}</after>
          </above>
          <children if={children} $row={row}>
            {children}
          </children>
        </content>
      </item>
    )
  }

  static style = {
    item: {
      padding: [7, 10],
      cursor: 'pointer',
      maxWidth: '100%',
      color: [0, 0, 0, 0.8],
      flexFlow: 'row',
      position: 'relative',
      zIndex: 0,
      overflow: 'hidden',
      fontWeight: 500,
      fontSize: 16,
      '&:active': {
        background: [0, 0, 0, 0.05],
      },
    },
    content: {
      flex: 1,
      maxWidth: '100%',
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
    primary: {
      flex: 1,
      whiteSpace: 'nowrap',
    },
    secondary: {
      color: 'rgba(0,0,0,0.45)',
      fontSize: 12,
      marginTop: 2,
    },
    prop: {
      flex: 1,
      maxWidth: '100%',
      overflow: 'hidden',
    },
    isLast: {
      borderBottom: 'none',
    },
    date: {
      userSelect: 'none',
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
      margin: ['auto', 5],
      opacity: 0.5,
    },
    after: {
      margin: ['auto', 0, 'auto', 10],
    },
    before: {
      margin: ['auto', 10, 'auto', 0],
    },
    children: {
      flex: 1,
      overflowY: 'scroll',
    },
    nohover: {
      '&:hover': {
        background: 'transparent',
      },
      '&:active': {
        background: 'transparent',
      },
    },
  }

  static theme = {
    itemStyle: ({ itemStyle }) => ({
      item: itemStyle,
    }),
    padding: ({ padding }) => ({
      item: {
        padding,
      },
    }),
    height: ({ height }) => ({
      item: {
        height,
      },
    }),
    bordered: {
      item: {
        borderBottom: [1, [0, 0, 0, 0.03]],
      },
    },
    slim: {
      item: {
        fontSize: 12,
        padding: [4, 6],
      },
      primary: {
        fontWeight: 300,
      },
      avatar: {
        width: 30,
        height: 30,
      },
    },
    small: {
      item: {
        padding: [3, 8],
      },
    },
    big: {
      item: {
        fontSize: 18,
      },
    },
    placeholder: {
      item: {
        '&:hover': { background: 'auto' },
        '&:active': { background: 'auto' },
      },
    },
    highlight: {
      item: {
        background: [0, 0, 0, 0.08],
      },
    },
    focused: {
      item: {
        background: [0, 0, 0, 0.02],
      },
    },
  }
}
