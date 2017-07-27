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
        borderRadius
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
          scale: 1.8,
          draggable: false,
          ...glowProps,
          ...(theme && theme.glow),
        }}
        {...props}
        noElement
        after={
          <badge
            if={badge}
            $badgeSize={props.size === true ? 1 : props.size || 1}
            {...badgeProps}
          >
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
      top: '23%',
      right: '30%',
      textAlign: 'right',
      alignSelf: 'flex-end',
      textShadow: '1px 1px 0 rgba(0,0,0,0.15)',
      lineHeight: '1px',
      fontWeight: 600,
      borderRadius: 120000,
      justifyContent: 'center',
      background: 'linear-gradient(left, red, purple)',
      color: '#fff',
      overflow: 'hidden',
      pointerEvents: 'none',
      border: [5, '#fff'],
      zIndex: 100000000,
      transform: {
        scale: 0.14,
        x: '345%',
        y: 0,
        z: 0,
      },
    },
    badgeSize: size => ({
      minWidth: size * 90 + 2,
      height: size * 90 + 2,
      fontSize: size * 60,
      marginTop: -((size * 90 + 2) / 2),
    }),
    contents: {
      alignItems: 'center',
      justifyContent: 'center',
      margin: [0, 14],
    },
  }
}

Button.acceptsHovered = true
