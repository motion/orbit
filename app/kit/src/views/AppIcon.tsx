import { AppBit } from '@o/models'
import { IconProps, SVG, toColor, useTheme, View } from '@o/ui'
import React, { forwardRef } from 'react'

import { useAppDefinition } from '../hooks/useAppDefinition'
import { appIcons } from './icons'

export type AppIconProps = Partial<IconProps> & { app: AppBit }

// const idReplace = / id="([a-z0-9-_]+)"/gi

export const AppIconInner = ({
  background = '#222',
  size = 32,
  style,
  forwardRef,
  ...props
}: Partial<AppIconProps> & { forwardRef?: any }) => {
  const theme = useTheme()
  let name = props.name
  const def = useAppDefinition(name)
  let fill
  try {
    fill = toColor(props.color || theme.color).hex()
  } catch {
    fill = props.color || 'currentColor'
  }

  // translate inherit to currentColor
  fill = fill === 'inherit' ? 'currentColor' : fill

  let iconSrc
  let svgProps

  if (!appIcons[name]) {
    if (def) {
      iconSrc = theme.background.isDark() ? def.iconLight || def.icon : def.icon
    } else {
      name = name.indexOf('full') > 0 ? 'orbit-custom-full' : 'orbit-custom'
    }
  }

  if (!iconSrc) {
    svgProps = { cleanup: true }
    iconSrc = `${appIcons[name]}`
    // colorize
    // warning: not having a string here literally causes a node level error....
    // async hook stack has become corrupted
    // let bg = toColor(background)
    // iconSrc = replaceAppBackground(iconSrc, bg)
  }

  return (
    <View
      ref={forwardRef}
      style={{
        width: size,
        height: size,
        ...style,
      }}
      {...props}
    >
      <SVG fill={`${fill}`} svg={iconSrc} width={`${size}px`} height={`${size}px`} {...svgProps} />
    </View>
  )
}

// hacky customize the background color
// function replaceAppBackground(iconSrc, bg) {
//   const adjust = bg.isDark() ? 0.12 : 0.05
//   const bgLight = (bg.lightness() === 100 ? bg : bg.lighten(adjust)).hex()
//   const bgDark = bg.darken(adjust).hex()

//   const newID = bgLight.replace('#', '')

//   const matches = iconSrc.match(idReplace)

//   if (!matches) {
//     console.warn('no matches', iconSrc)
//     return iconSrc
//   }

//   for (const full of matches) {
//     const id = full
//       .replace(' id="', '')
//       .replace('"', '')
//       .trim()
//     iconSrc = iconSrc.replace(new RegExp(id, 'g'), `${id}-${newID}`)
//   }

//   // remove stroke
//   iconSrc = iconSrc.replace(/ stroke-width="[0-9]+"/gi, '')

//   iconSrc = iconSrc.replace(
//     /stop-color="#323232" offset="0%"/g,
//     `stop-color="${bgLight}" offset="0%"`,
//   )
//   iconSrc = iconSrc.replace(
//     /stop-color="#121212" offset="100%"/g,
//     `stop-color="${bgDark}" offset="100%"`,
//   )

//   return iconSrc
// }

export const AppIcon = forwardRef(({ app, ...props }: AppIconProps, ref) => {
  return (
    <AppIconInner
      forwardRef={ref}
      background={app.colors[0]}
      color={app.colors[1]}
      name={app.identifier}
      size={48}
      {...props}
    />
  )
})

// @ts-ignore
AppIcon.acceptsProps = {
  hover: true,
  icon: true,
}
