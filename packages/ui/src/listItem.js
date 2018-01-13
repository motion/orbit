// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import { object, string } from 'prop-types'
import Text from './text'
import Date from './date'
import SizedSurface from './sizedSurface'

export type Props = {
  after?: React.Element<any>,
  before?: React.Element<any>,
  borderWidth?: number,
  borderRadius?: number,
  children?: React.Element<any>,
  date?: React.Element<any>,
  dateSize?: number,
  iconProps?: Object,
  isFirstElement?: boolean,
  isLastElement?: boolean,
  meta?: React.Element<any>,
  onClick?: Function,
  onItemMount?: Function,
  onToggle?: Function,
  primary?: React.Element<any>,
  row?: boolean,
  secondary?: React.Element<any>,
  ellipse?: boolean,
  glowProps?: Object,
  editable?: boolean,
  onFinishEdit?: Function,
  childrenProps?: Object,
  primaryEllipse?: boolean,
  glow?: boolean,
  fontWeight?: number | string,
  fontSize?: number | string,
  primaryProps?: Object,
  index?: number,
}

@view
export default class ListItem extends React.Component<Props> {
  static isListItem = true
  static contextTypes = {
    uiTheme: object,
    uiActiveTheme: string,
  }
  static defaultProps = {
    size: 1,
    borderWidth: 0,
    glowProps: {
      color: '#fff',
      scale: 1,
      blur: 70,
      opacity: 0.15,
      show: false,
      resist: 60,
      zIndex: -1,
    },
  }

  componentDidMount() {
    if (this.props.onItemMount) {
      this.props.onItemMount(this)
    }
    if (this.props.measure) {
      this.props.measure()
    }
  }

  getRef = ref => {
    this.props.getRef && this.props.getRef(ref)
    this.node = ref
  }

  render() {
    const {
      after,
      afterProps,
      below,
      before,
      beforePrimary,
      beforeProps,
      borderRadius,
      children: _children,
      date,
      dateSize,
      autoselect,
      isFirstElement,
      isLastElement,
      meta,
      onItemMount,
      onToggle,
      onClick,
      primary,
      row,
      segmented,
      secondary,
      secondaryProps,
      size,
      style,
      childrenEllipse,
      primaryEllipse,
      glowProps,
      editable,
      onFinishEdit,
      iconProps,
      getRef,
      highlight,
      glow,
      childrenProps,
      fontWeight,
      primaryProps,
      fontSize,
      selectable,
      index,
      ...props
    } = this.props
    const radiusProps = segmented
      ? {
          borderBottomRadius: isLastElement ? borderRadius : 0,
          borderTopRadius: isFirstElement ? borderRadius : 0,
        }
      : {
          borderRadius,
        }

    // reactive highlight
    // TODO: make this not rely on listitem being mobx
    const highlightValue =
      typeof highlight === 'function' ? highlight(index) : highlight

    let children = _children
    // allows for reactive children
    if (typeof children === 'function') {
      children = _children()
    }

    const areChildrenString = typeof children === 'string'

    return (
      <SizedSurface
        tagName="listitem"
        size={size}
        sizePadding={1.4}
        $item
        {...radiusProps}
        border={false}
        background="transparent"
        row
        onClick={onClick}
        glow={glow}
        glowProps={glowProps}
        sizeIcon={1.5}
        iconProps={{
          alignSelf: 'flex-start',
          opacity: 0.6,
          style: {
            paddingTop: 5,
          },
          ...iconProps,
        }}
        style={style}
        getRef={this.getRef}
        highlight={selectable !== false && highlightValue}
        after={below}
        {...props}
      >
        <before if={before} {...beforeProps}>
          {before}
        </before>
        <content $overflowHidden={after || before}>
          <above if={primary || secondary || date}>
            {beforePrimary}
            <prop if={primary || secondary}>
              <Text
                $text
                $primaryText
                fontSize={fontSize}
                size={size}
                editable={editable}
                autoselect={autoselect}
                onFinishEdit={onFinishEdit}
                ellipse={primaryEllipse}
                fontWeight={fontWeight}
                {...primaryProps}
              >
                {primary}
              </Text>
              <Text
                if={secondary || date}
                $text
                size={size * 0.85}
                alpha={0.7}
                ellipse
                {...secondaryProps}
              >
                <Date $date if={date}>
                  {date}
                </Date>
                <middot if={date && secondary}> &middot; </middot>
                {secondary}
              </Text>
            </prop>
          </above>
          <children if={!areChildrenString}>{children}</children>
          <Text
            if={areChildrenString}
            size={size * 0.9}
            alpha={0.6}
            ellipse={childrenEllipse}
            {...childrenProps}
          >
            {children}
          </Text>
        </content>
        <after if={after} {...afterProps}>
          {after}
        </after>
      </SizedSurface>
    )
  }

  static style = {
    item: {
      maxWidth: '100%',
      userSelect: 'none',
    },
    content: {
      flex: 1,
      maxWidth: '100%',
      justifyContent: 'center',
    },
    overflowHidden: {
      overflow: 'hidden',
    },
    above: {
      maxWidth: '100%',
      flexFlow: 'row',
      flex: 'none',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    prop: {
      flex: 1,
      overflow: 'hidden',
      maxWidth: '100%',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    middot: {
      display: 'inline',
    },
    text: {
      width: '100%',
    },
    primaryText: {
      wordWrap: 'break-word',
      maxHeight: '2.8rem',
    },
    date: {
      userSelect: 'none',
      fontWeight: 600,
      opacity: 0.8,
    },
    flex: {
      flexGrow: 1,
    },
    after: {
      margin: [0, -5, 0, 5],
      height: 'auto',
    },
    before: {
      margin: ['auto', 5, 'auto', 0],
    },
  }
}
