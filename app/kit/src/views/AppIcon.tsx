import { AppBit } from '@o/models'
import { IconProps, SVG, toColor, useTheme, View } from '@o/ui'
import React from 'react'

import { useAppDefinition } from '../hooks/useAppDefinition'
import { appIcons } from './icons'

export type AppIconProps = Partial<IconProps> & { app: AppBit }

const idReplace = / id="([a-z0-9-_]+)"/gi

export function AppIconInner({
  background = '#222',
  size = 32,
  style,
  ...props
}: Partial<AppIconProps>) {
  // const theme = useTheme() props.color || theme.iconColor ||
  const fill = toColor('#fff').hex()
  const theme = useTheme()
  let name = props.name
  let iconSrc
  let svgProps
  let def = useAppDefinition(name)

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
    let bg = toColor(background)
    iconSrc = replaceAppBackground(iconSrc, bg)
  }

  return (
    <View
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
function replaceAppBackground(iconSrc, bg) {
  const adjust = bg.isDark() ? 0.12 : 0.05
  const bgLight = (bg.lightness() === 100 ? bg : bg.lighten(adjust)).hex()
  const bgDark = bg.darken(adjust).hex()

  const newID = bgLight.replace('#', '')

  const matches = iconSrc.match(idReplace)

  if (!matches) {
    console.warn('no matches')
    return iconSrc
  }

  for (const full of matches) {
    const id = full
      .replace(' id="', '')
      .replace('"', '')
      .trim()
    iconSrc = iconSrc.replace(new RegExp(id, 'g'), `${id}-${newID}`)
  }

  // remove stroke
  iconSrc = iconSrc.replace(/ stroke-width="[0-9]+"/gi, '')

  iconSrc = iconSrc.replace(
    /stop-color="#323232" offset="0%"/g,
    `stop-color="${bgLight}" offset="0%"`,
  )
  iconSrc = iconSrc.replace(
    /stop-color="#121212" offset="100%"/g,
    `stop-color="${bgDark}" offset="100%"`,
  )

  return iconSrc
}

export const AppIcon = ({ app, ...props }: AppIconProps) => {
  return (
    <AppIconInner
      background={app.colors[0]}
      color={app.colors[1]}
      name={app.identifier}
      size={48}
      {...props}
    />
  )
}

AppIcon.acceptsProps = {
  hover: true,
  icon: true,
}
