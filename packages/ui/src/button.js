import React from 'react'
import SizedSurface from './sizedSurface'
import injectTheme from './helpers/injectTheme'
import { inject } from 'react-tunnel'
import { view } from '@mcro/black'

@inject(context => ({ uiContext: context.uiContext }))
@injectTheme
@view.ui
export default class Button {
  render({
    uiContext,
    badge,
    children,
    theme,
    chromeless,
    type,
    glowProps,
    css,
    ...props
  }) {
    return (
      <SizedSurface
        tagName="button"
        type={type}
        clickable
        hoverable
        sizeRadius
        sizeFont
        sizeHeight
        sizePadding={1.1}
        borderWidth={1}
        glint={!chromeless}
        chromeless={chromeless}
        row
        align="center"
        justify="center"
        glow
        css={{
          flexWrap: 'nowrap',
          whiteSpace: 'pre',
          ...css,
        }}
        glowProps={{
          scale: 2,
          draggable: false,
          ...glowProps,
        }}
        {...props}
        noElement
      >
        {children} muhahah222
        {badge &&
          <badge $badgeSize={props.size}>
            {badge}
          </badge>}
      </SizedSurface>
    )
  }

  static style = {
    badge: {
      position: 'absolute',
      top: '10%',
      right: '10%',
      fontSize: '1.4vh',
      textShadow: '1px 1px 0 rgba(0,0,0,0.2)',
      lineHeight: '1px',
      fontWeight: 900,
      borderRadius: 10000,
      alignItems: 'center',
      justifyContent: 'center',
      background: 'red',
      color: '#fff',
      overflow: 'hidden',
      border: [2, '#fff'],
    },
    badgeSize: size => ({
      width: size * 9 + 4,
      height: size * 9 + 4,
    }),
  }
}

Button.acceptsHovered = true
