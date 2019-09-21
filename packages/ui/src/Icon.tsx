import { toColor } from '@o/color'
import { IconNamesList } from '@o/icons'
import { isDefined, mergeDefined } from '@o/utils'
import FuzzySearch from 'fuzzy-search'
import { useTheme } from 'gloss'
import React, { memo, Suspense, useContext } from 'react'

import { Config } from './helpers/configureUI'
import { IconPropsContext } from './IconPropsContext'
import { useScale } from './Scale'
import { Tooltip } from './Tooltip'
import { ViewProps } from './View/types'
import { View } from './View/View'

export type IconProps = ViewProps & {
  size?: number
  name?: string
  tooltip?: string
  tooltipProps?: Object
  svg?: string
  ignoreColor?: boolean
}

const names = IconNamesList
const searcher = new FuzzySearch(names.map(name => ({ name })), ['name'])

const nameCache = {}
export const findName = (name: string) => {
  if (!name || typeof name !== 'string') {
    console.warn(`Bad name provided`, name)
    name = ''
  }
  if (nameCache[name]) return nameCache[name]
  const result = searcher.search(name)
  const match = result.length ? result[0].name : 'none'
  nameCache[name] = match
  return match
}

// lets users wrap around icons
export const Icon = memo((rawProps: IconProps) => {
  const extraProps = useContext(IconPropsContext)
  const props = extraProps ? mergeDefined(extraProps, rawProps) : rawProps
  const ResolvedIcon = Config.useIcon || PlainIcon
  return (
    <Suspense fallback={null}>
      <ResolvedIcon subTheme="icon" {...props} />
    </Suspense>
  )
})

// @ts-ignore
Icon.acceptsProps = {
  icon: true,
  hover: true,
}

const SIZE_STANDARD = 16
const SIZE_LARGE = 20

export const PlainIcon = ({
  style,
  ignoreColor,
  svg,
  tooltip,
  tooltipProps,
  name,
  ...props
}: IconProps) => {
  const theme = useTheme(props)
  const size = snapToSizes(props.size) * useScale()
  let color = props.color || (theme.color ? theme.color.toString() : '#fff')
  let opacity

  if (isDefined(props.opacity)) {
    if (color === 'inherit') {
      opacity = props.opacity
    } else {
      try {
        color = toColor(color as any)
          .setAlpha(typeof props.opacity === 'number' ? props.opacity : 1)
          .toString()
      } catch {
        console.debug('couldnt interpret color', color)
        opacity = props.opacity
      }
    }
  }

  if (typeof name === 'string') {
    const nameTrim = name.trim()
    if (nameTrim.indexOf('<svg') === 0) {
      svg = name
      name = ''
    }
  }

  let contents = null

  if (isDefined(svg)) {
    contents = (
      <View
        width={size}
        height={size}
        data-name={name}
        className={`ui-icon ${props.className || ''}`}
        color={color}
        opacity={opacity}
        {...props}
      >
        <div
          style={{
            fill: 'currentColor',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            width: size,
            height: size,
            ...style,
          }}
          dangerouslySetInnerHTML={{
            __html: svg,
          }}
        />
      </View>
    )
  } else {
    // choose which pixel grid is most appropriate for given icon size
    const pixelGridSize = size >= SIZE_LARGE ? SIZE_LARGE : SIZE_STANDARD
    // render path elements, or nothing if icon name is unknown.
    const iconName = findName(name)
    const paths = getIconSvgSuspense(pixelGridSize, iconName)
    console.log('now its', paths)
    const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`

    contents = (
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
  }

  console.log('return', contents)

  // add tooltip only if defined
  if (tooltip || tooltipProps) {
    return (
      <Tooltip label={tooltip} {...tooltipProps}>
        {contents}
      </Tooltip>
    )
  }

  return contents
}

// @ts-ignore
PlainIcon.acceptsProps = {
  hover: true,
  icon: true,
}
// @ts-ignore
PlainIcon.defaultProps = {
  size: 16,
}

const iconCache = {}
function getIconSvgSuspense(pathsSize: number, iconName: string): JSX.Element[] | null {
  const key = `${pathsSize}${iconName}`
  if (iconCache[key]) {
    if (isDefined(iconCache[key].value)) {
      return iconCache[key].value
    }
    throw iconCache[key].promise
  }
  iconCache[key] = {
    value: undefined,
    promise: new Promise(async res => {
      const next = await getSvgIcon(pathsSize, iconName)
      iconCache[key].value = next
      res(next)
    }),
  }
  throw iconCache[key].promise
}

async function getSvgIcon(size: number, name: string): Promise<JSX.Element[] | null> {
  let pathStrings: string[] = []
  try {
    if (size === SIZE_STANDARD) {
      pathStrings = (await import(`@o/icons/icons/20/${name}.json`)).default
    } else {
      pathStrings = (await import(`@o/icons/icons/20/${name}.json`)).default
    }
  } catch (err) {
    console.error('errror icon', err)
  }
  console.log('pathStrings', pathStrings)
  if (!pathStrings) {
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
