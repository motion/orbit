import React from 'react'
import { SizedSurface } from './sizedSurface'
import { injectTheme } from './helpers/injectTheme'
import { inject } from '@mcro/react-tunnel'
import { view } from '@mcro/black'

@inject(context => ({ uiContext: context.uiContext }))
@injectTheme
@view.ui
export class Button extends React.Component {
  render({
    uiContext,
    badge,
    children,
    theme,
    chromeless,
    type,
    glow,
    glint,
    glowProps,
    badgeProps,
    hovered,
    ...props
  }) {
    // patch until figure out why this doesnt trigger onSubmit
    // if (type === 'submit') {
    //   const ogOnClick = onClick
    //   onClick = function(...args) {
    //     uiContext.form.submit()
    //     return (ogOnClick && ogOnClick(...args)) || null
    //   }
    // }

    return (
      <SizedSurface
        tagName="button"
        $button
        type={type}
        clickable
        hoverable
        sizeFont
        sizePadding={1.5}
        sizeRadius
        sizeHeight
        sizeIcon={1.1}
        borderWidth={1}
        glint={typeof glint === 'undefined' ? !chromeless : glint}
        chromeless={chromeless}
        row
        align="center"
        justify="center"
        hovered={hovered}
        glow={glow}
        glowProps={{
          scale: 1.8,
          draggable: false,
          opacity: 0.15,
          ...glowProps,
          ...(theme && theme.glow),
        }}
        noElement
        after={
          <badge
            if={badge}
            $badgeSize={props.size === true ? 1 : props.size || 1}
            {...badgeProps}
          >
            <contents>{badge}</contents>
          </badge>
        }
        {...props}
      >
        {children}
      </SizedSurface>
    )
  }

  static style = {
    button: {
      outline: 0,
      flexWrap: 'nowrap',
      whiteSpace: 'pre',
      cursor: 'default',
    },
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
      background: '#555',
      color: '#fff',
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 100000000,
      transform: {
        scale: 0.1,
        x: '465%',
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
      padding: [0, 33],
    },
  }
}

Button.acceptsHovered = true
