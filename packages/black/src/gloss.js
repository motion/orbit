// @flow
import type React from 'react'
import gloss from '@mcro/gloss'

export type Glossy = {
  glossElement(
    tagName: string,
    props: ?Object,
    children: ?React$Children
  ): React$Element<any>,
}

export const styles: Object = {
  style: styles => styles,
  flex: flex => ({ flex: flex === true ? 1 : flex }),
  absolute: ([top, right, bottom, left]) => ({
    top,
    left,
    bottom,
    right,
    position: 'absolute',
  }),
  // direct
  opacity: opacity => ({ opacity }),
  zIndex: zIndex => ({ zIndex }),
  color: color => ({ color }),
  top: top => ({ top }),
  right: right => ({ right }),
  fontSize: fontSize => ({ fontSize }),
  lineHeight: lineHeight => ({ lineHeight }),
  bottom: bottom => ({ bottom }),
  left: left => ({ left }),
  position: position => ({ position }),
  padding: padding => ({ padding }),
  paddingLeft: paddingLeft => ({ paddingLeft }),
  paddingRight: paddingRight => ({ paddingRight }),
  paddingTop: paddingTop => ({ paddingTop }),
  paddingBottom: paddingBottom => ({ paddingBottom }),
  margin: margin => ({ margin }),
  marginLeft: marginLeft => ({ marginLeft }),
  marginRight: marginRight => ({ marginRight }),
  marginTop: marginTop => ({ marginTop }),
  marginBottom: marginBottom => ({ marginBottom }),
  borderLeft: borderLeft => ({ borderLeft }),
  borderRight: borderRight => ({ borderRight }),
  borderTop: borderTop => ({ borderTop }),
  borderBottom: borderBottom => ({ borderBottom }),
  align: alignItems => ({ alignItems }),
  alignItems: alignItems => ({ alignItems }),
  minHeight: minHeight => ({ minHeight }),
  maxHeight: maxHeight => ({ maxHeight }),
  minWidth: minWidth => ({ minWidth }),
  maxWidth: maxWidth => ({ maxWidth }),
  width: width => ({ width }),
  height: height => ({ height }),
  overflow: overflow => ({ overflow }),
  background: background => ({ background }),
  transition: transition => ({ transition }),
  hidden: val => ({ display: val ? 'none' : 'auto' }),
  show: val => ({ opacity: val ? 1 : 0 }),
  alignSelf: alignSelf => ({ alignSelf }),
  justify: justifyContent => ({ justifyContent }),
  row: {
    flexFlow: 'row',
  },
  col: {
    flexFlow: 'column',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  justifyEnd: {
    justifyContent: 'flex-end',
  },
  justifyStart: {
    justifyContent: 'flex-start',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  fullscreen: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  passthrough: {
    flexGrow: 'inherit',
    flexShrink: 'inherit',
    flexDirection: 'inherit',
    justifyContent: 'inherit',
    alignItems: 'inherit',
  },
  ellipse: {
    display: 'block',
    whiteSpace: 'pre',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  draggable: {
    WebkitAppRegion: 'drag',
  },
  undraggable: {
    WebkitAppRegion: 'no-drag',
  },
  scrollable: {
    flex: 1,
    overflowY: 'scroll',
  },
  padded: {
    padding: 20,
  },
  ul: {
    margin: [10, 0, 10, 30],
    padding: 20,
  },
  ol: {
    margin: [10, 0, 10, 20],
    padding: 0,
  },
  li: {
    margin: 0,
    padding: 0,
    transition: 'opacity 150ms ease-in',
  },
  archive: {
    opacity: 0.4,
  },
  noSelect: {
    userSelect: 'none',
  },
}

const Gloss = gloss({
  baseStyles: styles,
  glossProp: 'css',
  themeProp: 'theme',
  tagName: 'tagName',
  isColor: color => color && !!color.rgb,
  toColor: color => color.toString(),
})

window.Gloss = Gloss

export const { decorator, createElement } = Gloss
