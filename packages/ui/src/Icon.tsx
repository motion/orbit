import { IconName, IconSvgPaths16, IconSvgPaths20 } from '@blueprintjs/icons'
import { toColor } from '@o/color'
import { isDefined, mergeDefined } from '@o/utils'
import fuzzySort from 'fuzzysort'
import { useTheme } from 'gloss'
import React, { createContext, forwardRef, memo, useContext } from 'react'

import { Config } from './helpers/configureUI'
import { useScale } from './Scale'
import { SVG } from './SVG'
import { View, ViewProps } from './View/View'

export { IconName }

export type IconProps = ViewProps & {
  size?: number
  name?: string
  tooltip?: string
  tooltipProps?: Object
  svg?: string
  ignoreColor?: boolean
}

// TODO use createContextProps
export const IconPropsContext = createContext<Partial<IconProps>>(null)

const names = Object.keys(IconSvgPaths16)

const cache = {}
export const findName = (name: string) => {
  if (cache[name]) return cache[name]
  if (IconSvgPaths16[name]) return name
  const matches = fuzzySort.go(name, names)
  const match = matches.length ? matches[0].target : 'none'
  cache[name] = match
  return match
}

// lets users wrap around icons
export const Icon = memo(
  forwardRef((rawProps: IconProps, ref) => {
    const extraProps = useContext(IconPropsContext)
    const props = extraProps ? mergeDefined(extraProps, rawProps) : rawProps
    const ResolvedIcon = Config.useIcon || PlainIcon
    return <ResolvedIcon ref={ref} themeSelect="icon" {...props} />
  }),
)

// @ts-ignore
Icon.acceptsProps = {
  icon: true,
  hover: true,
}

const SIZE_STANDARD = 16
const SIZE_LARGE = 20

export const PlainIcon = forwardRef(({ style, ignoreColor, svg, ...props }: IconProps, ref) => {
  const theme = useTheme(props)
  const size = snapToSizes(props.size) * useScale()
  let color = props.color || (theme.color ? theme.color.toCSS() : '#fff')
  let opacity

  if (isDefined(props.opacity)) {
    if (color === 'inherit') {
      opacity = props.opacity
    } else {
      try {
        color = toColor(color)
          .alpha(props.opacity)
          .toCSS()
      } catch {
        console.debug('couldnt interpret color', color)
        opacity = props.opacity
      }
    }
  }

  if (isNaN(size)) {
    debugger
  }

  if (typeof props.name === 'string') {
    const nameTrim = props.name.trim()
    if (nameTrim.indexOf('<svg') === 0) {
      svg = props.name
    }
  }

  if (isDefined(svg)) {
    return (
      <View
        ref={ref}
        width={size}
        height={size}
        data-name={props.name}
        className={`ui-icon ${props.className || ''}`}
        color={color}
        opacity={opacity}
        {...props}
      >
        <SVG
          svg={svg}
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
  const iconName = findName(props.name)
  const paths = renderSvgPaths(pixelGridSize, iconName)
  const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`

  return (
    <View width={size} height={size} {...props}>
      <svg
        style={{ color: `${color}`, ...style }}
        data-icon={iconName}
        width={`${size}px`}
        height={`${size}px`}
        viewBox={viewBox}
      >
        {paths}
      </svg>
    </View>
  )
})

// @ts-ignore
PlainIcon.acceptsProps = {
  hover: true,
  icon: true,
}
// @ts-ignore
PlainIcon.defaultProps = {
  size: 16,
}

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
