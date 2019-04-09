import { IconName, IconSvgPaths16, IconSvgPaths20 } from '@blueprintjs/icons'
import { useTheme } from '@o/gloss'
import { mergeDefined } from '@o/utils'
import fuzzy from 'fuzzy'
import React, { createContext, useContext } from 'react'
import { Config } from './helpers/configure'
import { ViewProps } from './View/View'

export { IconName }

export type IconProps = ViewProps & {
  size?: number
  name: string
  type?: 'mini' | 'outline'
  tooltip?: string
  tooltipProps?: Object
}

// TODO use createContextProps
export const IconPropsContext = createContext(null as Partial<IconProps>)

const names = Object.keys(IconSvgPaths16)

const cache = {}
const findName = (name: string) => {
  console.log('finding', name, names)
  if (cache[name]) return cache[name]
  if (IconSvgPaths16[name]) return name
  const matches = fuzzy.filter(name, names)
  const match = matches.length ? matches[0].original : 'none'
  cache[name] = match
  return match
}

// lets users wrap around icons
export function Icon(rawProps: IconProps) {
  const extraProps = useContext(IconPropsContext)
  const props = extraProps ? mergeDefined(extraProps, rawProps) : rawProps
  const ResolvedIcon = Config.useIcon || UIIcon
  return <ResolvedIcon {...props} />
}

const SIZE_STANDARD = 16
const SIZE_LARGE = 20

function UIIcon(props: IconProps) {
  const name = findName(props.name)
  const theme = useTheme()
  const color = props.color || theme.iconColor || theme.color
  // choose which pixel grid is most appropriate for given icon size
  const pixelGridSize = props.size >= SIZE_LARGE ? SIZE_LARGE : SIZE_STANDARD
  // render path elements, or nothing if icon name is unknown.
  const paths = renderSvgPaths(pixelGridSize, name)
  const viewBox = `0 0 ${pixelGridSize} ${pixelGridSize}`

  return (
    <svg fill={color} data-icon={name} width={props.size} height={props.size} viewBox={viewBox}>
      {paths}
    </svg>
  )
}

function renderSvgPaths(pathsSize: number, iconName: IconName): JSX.Element[] | null {
  const svgPathsRecord = pathsSize === SIZE_STANDARD ? IconSvgPaths16 : IconSvgPaths20
  const pathStrings = svgPathsRecord[iconName]
  if (pathStrings == null) {
    return null
  }
  return pathStrings.map((d, i) => <path key={i} d={d} fillRule="evenodd" />)
}
