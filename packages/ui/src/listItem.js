// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import { object, string } from 'prop-types'
import Text from './text'
import SizedSurface from './sizedSurface'
import injectTheme from './helpers/injectTheme'

export type Props = {
  after?: React$Element<any>,
  before?: React$Element<any>,
  borderWidth?: number,
  borderRadius?: number,
  children?: React$Element<any>,
  date?: React$Element<any>,
  dateSize?: number,
  iconProps?: Object,
  isFirstElement?: boolean,
  isLastElement?: boolean,
  meta?: React$Element<any>,
  onClick?: Function,
  onItemMount?: Function,
  onToggle?: Function,
  primary?: React$Element<any>,
  row?: boolean,
  secondary?: React$Element<any>,
  ellipse?: boolean,
  glowProps?: Object,
  editable?: boolean,
  onFinishEdit?: Function,
}

const DEFAULT_GLOW = {
  scale: 1.4,
  opacity: 0.09,
  resist: 40,
  overlayZIndex: 0,
}

@injectTheme
@view.ui
export default class ListItem extends React.PureComponent<Props> {
  static isListItem = true
  static contextTypes = {
    uiTheme: object,
    uiActiveTheme: string,
  }
  static defaultProps = {
    size: 1,
    borderWidth: 0,
    ellipse: true,
  }

  componentDidMount() {
    if (this.props.onItemMount) {
      this.props.onItemMount(this)
    }
  }

  getRef = ref => {
    this.props.getRef && this.props.getRef(ref)
    this.node = ref
  }

  render() {
    const {
      after,
      before,
      borderRadius,
      borderWidth,
      children,
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
      size,
      style,
      ellipse,
      glowProps,
      theme,
      editable,
      onFinishEdit,
      iconProps,
      getRef,
      ...props
    } = this.props
    const radiusProps = segmented
      ? {
          borderRadius: isLastElement || isFirstElement ? borderRadius : 0,
          borderBottomRadius: isLastElement,
          borderTopRadius: isFirstElement,
        }
      : {
          borderRadius,
        }

    return (
      <SizedSurface
        tagName="listitem"
        size={size}
        sizePadding={1.2}
        hoverable
        $item
        {...radiusProps}
        border={false}
        background="transparent"
        hoverBackground
        borderBottom={[
          borderWidth,
          theme ? theme.base.borderColor : 'transparent',
        ]}
        glow
        row
        onClick={onClick}
        glowProps={glowProps || DEFAULT_GLOW}
        iconProps={{
          alignSelf: 'center',
          ...iconProps,
        }}
        style={style}
        getRef={this.getRef}
        {...props}
      >
        <before if={before}>
          {before}
        </before>
        <content>
          <above if={primary || secondary || date}>
            <prop if={primary || secondary} $col>
              <Text
                $text
                $primary
                fontSize="inherit"
                ellipse={ellipse}
                size={size}
                color="inherit"
                editable={editable}
                autoselect={autoselect}
                onFinishEdit={onFinishEdit}
              >
                {primary}
              </Text>
              <Text
                if={secondary}
                $text
                size={size * 0.85}
                opacity={0.75}
                ellipse
              >
                {secondary}
              </Text>
            </prop>
            <Text if={date} size={size * 0.6} $date $meta ellipse>
              {date}
            </Text>
          </above>
          <children if={children}>
            {children}
          </children>
        </content>
        <after if={after}>
          {after}
        </after>
      </SizedSurface>
    )
  }

  static style = {
    item: {
      maxWidth: '100%',
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
      overflow: 'hidden',
      maxWidth: '100%',
      fontWeight: 200,
    },
    text: {
      width: '100%',
    },
    date: {
      alignSelf: 'flex-start',
      userSelect: 'none',
      fontSize: 12,
      fontWeight: 200,
    },
    col: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    flex: {
      flexGrow: 1,
    },
    after: {
      margin: ['auto', -5, 'auto', 5],
    },
    before: {
      margin: ['auto', 5, 'auto', 0],
    },
    children: {
      flexFlow: 'row',
      margin: [0, -8],
      flex: 1,
      lineHeight: '1.38rem',
      padding: [0, 8],
    },
  }
}
