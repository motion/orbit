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
    badgeProps,
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
        sizePadding={1.3}
        sizeIcon={1.1}
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
        }}
        glowProps={{
          scale: 2,
          draggable: false,
          ...glowProps,
          ...(theme && theme.glow),
        }}
        {...props}
        noElement
        after={
          <badge if={badge} $badgeSize={props.size} {...badgeProps}>
            <contents>
              {badge}
            </contents>
          </badge>
        }
      >
        {children}
      </SizedSurface>
    )
  }

  static style = {
    badge: {
      position: 'absolute',
      top: '5%',
      right: '5%',
      textShadow: '1px 1px 0 rgba(0,0,0,0.15)',
      lineHeight: '1px',
      fontWeight: 600,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      background: 'red',
      color: '#fff',
      overflow: 'hidden',
      pointerEvents: 'none',
      letterSpacing: 1,
      border: [1, '#fff'],
    },
    badgeSize: size => ({
      width: size * 9 + 2,
      height: size * 9 + 2,
      fontSize: size * 6,
    }),
    contents: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
}

Button.acceptsHovered = true
