import * as React from 'react'
import { view } from '@mcro/black'
import { Text } from './Text'
import { SizedSurface, SizedSurfaceProps } from './SizedSurface'

export type ItemProps = SizedSurfaceProps & {
  after?: React.ReactNode
  below?: React.ReactNode
  afterProps?: Object
  before?: React.ReactNode
  beforeProps?: Object
  borderWidth?: number
  beforePrimary?: React.ReactNode
  borderRadius?: number
  children?: React.ReactNode
  date?: React.ReactNode
  dateSize?: number
  iconProps?: Object
  segmented?: boolean
  isFirstElement?: boolean
  autoselect?: boolean
  isLastElement?: boolean
  meta?: React.ReactNode
  onClick?: Function
  onItemMount?: Function
  onToggle?: Function
  primary?: React.ReactNode
  row?: boolean
  secondary?: React.ReactNode
  ellipse?: boolean
  glowProps?: Object
  editable?: boolean
  onFinishEdit?: Function
  childrenProps?: Object
  primaryEllipse?: boolean
  glow?: boolean
  fontWeight?: any
  fontSize?: any
  primaryProps?: Object
  index?: number
  secondaryProps?: Object
  size?: number
  style?: Object
  childrenEllipse?: boolean
  getRef?: Function
  highlight?: boolean | ((index: number) => React.ReactNode)
  selectable?: boolean
}

const Content = view({
  flex: 1,
  maxWidth: '100%',
  justifyContent: 'center',
  overflowHidden: {
    overflow: 'hidden',
  },
})

const Above = view({
  maxWidth: '100%',
  flexFlow: 'row',
  flex: 'none',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Prop = view({
  flex: 1,
  overflow: 'hidden',
  maxWidth: '100%',
  flexDirection: 'column',
  alignItems: 'flex-start',
})

const Middot = view({
  display: 'inline',
})

const ListDate = view({
  userSelect: 'none',
  fontWeight: 600,
  opacity: 0.8,
})

const After = view({
  margin: [0, -5, 0, 5],
  height: 'auto',
})

const Before = view({
  margin: ['auto', 5, 'auto', 0],
})

@view
export class ListItem extends React.Component<ItemProps> {
  static isListItem = true

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

  node = null

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
      // @ts-ignore
      children = _children()
    }

    const areChildrenString = typeof children === 'string'

    return (
      <SizedSurface
        tagName="listitem"
        size={size}
        sizePadding={1.4}
        {...radiusProps}
        borderWidth={0}
        background="transparent"
        row
        onClick={onClick}
        glow={glow}
        glowProps={glowProps}
        sizeIcon={1}
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
        {!!before && <Before {...beforeProps}>{before}</Before>}
        <Content overflowHidden={after || before}>
          {!!(primary || secondary || date) && (
            <Above>
              {beforePrimary}
              {!!(primary || secondary) && (
                <Prop>
                  <Text
                    wordWrap="break-word"
                    fontSize={fontSize}
                    fontWeight={fontWeight}
                    size={size}
                    editable={editable}
                    autoselect={autoselect}
                    onFinishEdit={onFinishEdit}
                    ellipse={primaryEllipse}
                    {...primaryProps}
                  >
                    {primary}
                  </Text>
                  {!!(secondary || date) && (
                    <Text
                      size={size * 0.85}
                      alpha={0.7}
                      ellipse
                      {...secondaryProps}
                    >
                      {!!date && <ListDate>{date}</ListDate>}
                      {!!(date && secondary) && <Middot> &middot; </Middot>}
                      {secondary}
                    </Text>
                  )}
                </Prop>
              )}
            </Above>
          )}
          {!areChildrenString && <div>{children}</div>}
          {areChildrenString && (
            <Text
              size={size * 0.9}
              alpha={0.6}
              ellipse={childrenEllipse}
              {...childrenProps}
            >
              {children}
            </Text>
          )}
        </Content>
        {!!after && <After {...afterProps}>{after}</After>}
      </SizedSurface>
    )
  }
}
