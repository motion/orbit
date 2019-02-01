import { useTheme } from '@mcro/gloss'
import { color } from '@mcro/ui'
import React from 'react'
import { OrbitIconProps } from './Icon'
import { SVG } from './SVG'

export const appIcons = {
  ['orbit-search-full']: require('!raw-loader!../../public/icons/appicon-search.svg'),
  ['orbit-topics-full']: require('!raw-loader!../../public/icons/appicon-topics.svg'),
  ['orbit-people-full']: require('!raw-loader!../../public/icons/appicon-people.svg'),
  ['orbit-lists-full']: require('!raw-loader!../../public/icons/appicon-lists.svg'),
  ['orbit-apps-full']: require('!raw-loader!../../public/icons/appicon-apps.svg'),
  ['orbit-custom-full']: require('!raw-loader!../../public/icons/appicon-custom.svg'),
}

type AppIconProps = OrbitIconProps & {
  background?: string
}

const idReplace = / id="([a-z0-9-_]+)"/gi

export default React.memo(function AppIcon({
  background = '#222',
  size = 32,
  style,
  removeStroke,
  ...props
}: AppIconProps & { removeStroke?: boolean }) {
  const theme = useTheme()
  const fill = color(
    props.color || (size < 36 ? theme.iconFill || theme.background : background),
  ).hex()
  let iconSrc = `${appIcons[props.name]}`

  // hacky customize the background color
  let bg = color(background)

  const adjust = bg.isDark() ? 0.12 : 0.05
  const bgLight = (bg.lightness() === 100 ? bg : bg.lighten(adjust)).hex()
  const bgDark = bg.darken(adjust).hex()

  const newID = bgLight.replace('#', '')

  const matches = iconSrc.match(idReplace)
  for (const full of matches) {
    const id = full
      .replace(' id="', '')
      .replace('"', '')
      .trim()
    iconSrc = iconSrc.replace(new RegExp(id, 'g'), `${id}-${newID}`)
  }

  if (removeStroke) {
    // remove stroke
    iconSrc = iconSrc.replace(/ stroke-width="[0-9]+"/gi, '')
  }

  iconSrc = iconSrc.replace(
    /stop-color="#323232" offset="0%"/g,
    `stop-color="${bgLight}" offset="0%"`,
  )
  iconSrc = iconSrc.replace(
    /stop-color="#121212" offset="100%"/g,
    `stop-color="${bgDark}" offset="100%"`,
  )

  return (
    <SVG
      fill={`${fill}`}
      svg={iconSrc}
      width={`${size}px`}
      height={`${size}px`}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        width: size,
        height: size,
        ...style,
      }}
      cleanup
    />
  )
})
