import * as React from 'react'
import { SizedSurface } from './sizedSurface'
import { view } from '@mcro/black'

const Badge = view({
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
})

Badge.theme = ({ size }) => ({
  minWidth: size * 90 + 2,
  height: size * 90 + 2,
  fontSize: size * 60,
  marginTop: -((size * 90 + 2) / 2),
})

const BadgeContents = view({
  alignItems: 'center',
  justifyContent: 'center',
  padding: [0, 33],
})

export const Button = ({
  badge,
  children,
  theme,
  chromeless,
  type,
  glow,
  glowProps,
  badgeProps,
  hovered,
  ...props
}) => {
  return (
    <SizedSurface
      tagName="button"
      style={{
        outline: 0,
        flexWrap: 'nowrap',
        whiteSpace: 'pre',
        cursor: 'default',
      }}
      type={type}
      clickable
      hoverable
      sizeFont
      sizePadding={1.5}
      sizeRadius
      sizeHeight
      sizeLineHeight
      sizeIcon={1.1}
      borderWidth={1}
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
        <Badge
          if={badge}
          size={props.size === true ? 1 : props.size || 1}
          {...props}
          {...badgeProps}
        >
          <BadgeContents>{badge}</BadgeContents>
        </Badge>
      }
      {...props}
    >
      {children}
    </SizedSurface>
  )
}

Button.acceptsHovered = true
