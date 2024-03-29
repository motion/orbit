import { FuzzySearch } from '@o/fuzzy-search'
import { IconNamesList } from '@o/icons'
import { isDefined, mergeDefined } from '@o/utils'
import React, { CSSProperties, memo, Suspense, useCallback, useContext } from 'react'

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
export const findIconName = (name: string): string => {
  if (!name || typeof name !== 'string') {
    console.warn(`Bad name provided`, name)
    name = ''
  }
  if (nameCache[name]) return nameCache[name]
  let match = ''
  const index = names.indexOf(name)
  if (index > -1) {
    match = names[index]
  } else {
    const result = searcher.search(name)
    match = result.length ? result[0].name : 'dot'
  }
  nameCache[name] = match
  return match
}

// lets users wrap around icons
export const Icon = memo((rawProps: IconProps) => {
  const extraProps = useContext(IconPropsContext)
  const props = extraProps ? mergeDefined(extraProps, rawProps) : rawProps
  const ResolvedIcon = Config.useIcon || PlainIcon
  return (
    <Suspense fallback={<div style={{ width: props.size, height: props.size }} />}>
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

export const PlainIcon = (iconProps: Omit<IconProps, 'style'> & { style: CSSProperties }) => {
  let { style, ignoreColor, svg, tooltip, tooltipProps, name, opacity, ...props } = iconProps
  const size = snapToSizes(props.size) * useScale()

  if (typeof name === 'string') {
    const nameTrim = name.trim()
    if (nameTrim.indexOf('<svg') === 0) {
      svg = name
      name = ''
    }
  }

  let contents = null
  const iconColor = useCallback(theme => theme.color, [])
  const color = props.color || iconColor

  if (isDefined(svg)) {
    contents = (
      <View
        width={size}
        height={size}
        data-name={name}
        {...props}
        className={`ui-icon-svg ${props.className || ''}`}
        color={color}
        opacity={opacity}
      >
        <div
          style={{
            fill: 'currentColor',
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            ...((typeof size === 'number' || typeof size === 'string') && {
              width: size,
              height: size,
            }),
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
    const iconName = findIconName(name)
    const paths = getIconSvgSuspense(pixelGridSize, iconName)
    const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`

    contents = (
      <View
        width={size}
        height={size}
        {...props}
        className={`ui-icon ${props.className || ''}`}
        color={color}
      >
        <svg
          style={{ fill: 'currentColor', ...style }}
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

PlainIcon.acceptsProps = {
  hover: true,
  icon: true,
}
PlainIcon.defaultProps = {
  size: 16,
}

const pathsToElement = (paths: string[]) => {
  return paths.map((d, i) => <path key={i} d={d} fillRule="evenodd" fill="currentColor" />)
}

const iconCache = {}
function getIconSvgSuspense(pathsSize: number, iconName: string): JSX.Element[] | null {
  if (process.env.SPLIT_CHUNKS) {
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
        const next = pathsToElement((await getSvgIcon(pathsSize, iconName)) || [])
        iconCache[key].value = next
        res(next)
      }),
    }
    throw iconCache[key].promise
  } else {
    return pathsToElement(getSvgIconRegular(pathsSize, iconName))
  }
}

export async function getSvgIcon(size: number, name: string): Promise<string[] | null> {
  if (process.env.SPLIT_CHUNKS) {
    let pathStrings: string[] = []
    try {
      if (size === SIZE_STANDARD) {
        pathStrings = (await import(`@o/icons/icons/16/${name}.json`)).default
      } else {
        pathStrings = (await import(`@o/icons/icons/20/${name}.json`)).default
      }
    } catch (err) {
      console.error('error icon', err)
    }
    if (!pathStrings) {
      return null
    }
    return pathStrings
  } else {
    return getSvgIconRegular(size, name)
  }
}

function getSvgIconRegular(_size: number, name: string): string[] | null {
  if (!process.env.SPLIT_CHUNKS) {
    // if (size === SIZE_STANDARD) {
    return require('@o/icons').IconSvgPaths16[name]
    // } else {
    //   return require('@o/icons').IconSvgPaths20[name]
    // }
  }
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
