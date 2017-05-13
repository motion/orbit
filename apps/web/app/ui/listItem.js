import React from 'react'
import { view } from '~/helpers'
import FakeAvatar from './fake/avatar'
import Glow from './glow'

@view
export default class ListItem {
  static isListItem = true

  render() {
    const {
      children,
      primary,
      secondary,
      avatar,
      fakeAvatar,
      shine, // a strong highlight
      date,
      dateSize,
      meta,
      before,
      after,
      isLastElement,
      highlight,
      isFirstElement,
      wrap,
      nohover,
      row,
      onClick,
      slim,
      onToggle,
      active,
      horizontal,
      dark,
      padded,
      light,
      height,
      ...props
    } = this.props

    return (
      <item
        ref="item"
        $shine={shine}
        $isLast={isLastElement}
        $hardWidth={wrap}
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
    nohover: {
      '&:hover': {
        background: 'transparent',
      },
      '&:active': {
        background: 'transparent',
      },
    },
    prop: {
      flex: 1,
      maxWidth: '100%',
      overflow: 'hidden',
    },
    section: {
      width: '100%',
      maxWidth: '100%',
      userSelect: 'none',
    },
    primary: {
      flex: 1,
      whiteSpace: 'nowrap',
      fontWeight: 500,
      fontSize: 15,
    },
    hardWidth: {
      width: 250,
      margin: 5,
    },
    isLast: {
      borderBottom: 'none',
    },
    shine: {
      background: 'rgba(0,0,0,0.08)',
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
    secondary: {
      color: 'rgba(0,0,0,0.45)',
      fontSize: 12,
      marginTop: 2,
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
  }

  static theme = {
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
