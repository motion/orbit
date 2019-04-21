import { IconName, IconSvgPaths16, IconSvgPaths20 } from '@blueprintjs/icons'
import { toColor, useTheme } from '@o/gloss'
import { isDefined, mergeDefined } from '@o/utils'
import fuzzySort from 'fuzzysort'
import React, { createContext, useContext } from 'react'

import { Config } from './helpers/configure'
import { SVG } from './SVG'
import { View, ViewProps } from './View/View'

export { IconName }

export type IconProps = ViewProps & {
  size?: number
  name?: string
  type?: 'mini' | 'outline'
  tooltip?: string
  tooltipProps?: Object
  svg?: string
  ignoreColor?: boolean
}

// TODO use createContextProps
export const IconPropsContext = createContext<Partial<IconProps>>(null)

const names = Object.keys(IconSvgPaths16)

const cache = {}
const findName = (name: string) => {
  if (cache[name]) return cache[name]
  if (IconSvgPaths16[name]) return name
  const matches = fuzzySort.go(name, names)
  const match = matches.length ? matches[0].target : 'none'
  cache[name] = match
  return match
}

// lets users wrap around icons
export function Icon(rawProps: IconProps) {
  const extraProps = useContext(IconPropsContext)
  const props = extraProps ? mergeDefined(extraProps, rawProps) : rawProps
  const ResolvedIcon = Config.useIcon || PlainIcon
  return <ResolvedIcon themeSelect="icon" {...props} />
}

Icon.acceptsIconProps = true

const SIZE_STANDARD = 16
const SIZE_LARGE = 20

export function PlainIcon({ style, ignoreColor, ...props }: IconProps) {
  const name = findName(props.name)
  const theme = useTheme(props)
  const size = snapToSizes(props.size)
  let color = toColor(props.color || (theme.color ? theme.color.toCSS() : '#fff'))

  if (isDefined(props.opacity)) {
    try {
      color = color.alpha(props.opacity)
    } catch {
      console.debug('bad color')
    }
  }

  color = color.toCSS()

  if (isDefined(props.svg)) {
    return (
      <View
        {...props}
        width={size}
        height={size}
        className={`icon ${props.className || ''}`}
        color={color}
      >
        <SVG
          svg={props.svg}
          width={`${size}px`}
          height={`${size}px`}
          style={{
            fill: 'currentColor',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            width: size,
            height: size,
            ...style,
          }}
          cleanup={[ignoreColor ? null : 'fill', 'title', 'desc', 'width', 'height'].filter(
            Boolean,
          )}
        />
      </View>
    )
  }

  // choose which pixel grid is most appropriate for given icon size
  const pixelGridSize = size >= SIZE_LARGE ? SIZE_LARGE : SIZE_STANDARD
  // render path elements, or nothing if icon name is unknown.
  const paths = renderSvgPaths(pixelGridSize, name)
  const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`

  return (
    <View width={size} height={size} {...props}>
      <svg
        style={{ color: `${color}`, ...style }}
        data-icon={name}
        width={`${size}px`}
        height={`${size}px`}
        viewBox={viewBox}
      >
        {paths}
      </svg>
    </View>
  )
}

PlainIcon.acceptsIconProps = true

function renderSvgPaths(pathsSize: number, iconName: IconName): JSX.Element[] | null {
  const svgPathsRecord = pathsSize === SIZE_STANDARD ? IconSvgPaths16 : IconSvgPaths20
  const pathStrings = svgPathsRecord[iconName]
  if (pathStrings == null) {
    return null
  }
  return pathStrings.map((d, i) => <path key={i} d={d} fillRule="evenodd" fill="currentColor" />)
}

function snapToSizes(size: number) {
  if (size <= 17 && size >= 15) {
    return 16
  }
  if (size <= 21 && size >= 19) {
    return 20
  }
  return size
}
