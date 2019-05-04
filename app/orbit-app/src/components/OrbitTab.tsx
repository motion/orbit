import { invertLightness } from '@o/color'
import { gloss, linearGradient, Row, useTheme } from '@o/gloss'
import { Icon, useLocationLink } from '@o/kit'
import { AppBit } from '@o/models'
import {
  Button,
  ButtonProps,
  IconProps,
  memoIsEqualDeep,
  MenuTemplate,
  Tooltip,
  useContextMenu,
  View,
  ViewProps,
} from '@o/ui'
import * as React from 'react'

export const tabHeight = 26
const borderSize = 8

export type TabProps = ViewProps & {
  app?: AppBit
  tabDisplay?: string
  separator?: boolean
  isActive?: boolean
  label?: string
  stretch?: boolean
  sidePad?: number
  tooltip?: string
  textProps?: any
  thicc?: boolean
  icon?: string | React.ReactNode
  iconSize?: number
  iconAdjustOpacity?: number
  getContext?: () => MenuTemplate
  disabled?: boolean
  iconProps?: Partial<IconProps>
  after?: React.ReactNode
  location?: string
}

export const OrbitTab = memoIsEqualDeep(function OrbitTab({
  icon,
  iconSize: iconSizeProp,
  iconProps,
  iconAdjustOpacity = 0,
  tooltip,
  label,
  isActive = false,
  // separator = false,
  textProps,
  thicc,
  className = '',
  getContext,
  after,
  location,
  app,
  ...props
}: TabProps) {
  const sidePad = thicc ? 18 : 12
  const contextMenuProps = useContextMenu({ items: getContext ? getContext() : null })
  const iconSize = iconSizeProp || (thicc ? 12 : 11)
  const link = useLocationLink(location)

  const button = (
    <NavButtonChrome
      className={`orbit-tab orbit-tab-${isActive ? 'active' : 'inactive'} ${
        thicc ? 'pinned' : 'unpinned'
      } undraggable ${className || ''}`}
      isActive={isActive}
      thicc={thicc}
      onClick={link}
      {...contextMenuProps}
      {...props}
    >
      <NavButtonChromeInner sidePad={sidePad} isActive={isActive}>
        <Tooltip label={app.name}>
          <Row alignItems="center" maxWidth={after ? '76%' : '90%'}>
            {React.isValidElement(icon) ? (
              React.cloneElement(icon, { size: iconSize, ...iconProps } as any)
            ) : (
              <OrbitTabIcon
                isActive={isActive}
                name={`${icon}`}
                marginRight={!!label ? sidePad * 0.7 : 0}
                thicc={thicc}
                size={iconSize}
                iconAdjustOpacity={iconAdjustOpacity}
                {...iconProps}
              />
            )}
          </Row>
        </Tooltip>

        {after}
      </NavButtonChromeInner>
    </NavButtonChrome>
  )
  if (tooltip) {
    return <Tooltip label={tooltip}>{button}</Tooltip>
  }
  return button
})

function OrbitTabIcon(props: IconProps & TabProps) {
  const theme = useTheme()
  let opacity = props.isActive ? 1 : props.thicc ? 0.5 : 0.3
  opacity += props.iconAdjustOpacity || 0
  return (
    <Icon
      color={invertLightness(theme.color, 0.8)}
      opacity={opacity}
      className={`tab-icon-${props.thicc ? 'pinned' : 'unpinned'} tab-icon-${
        props.isActive ? 'active' : 'inactive'
      }`}
      // transform={{ y: tabHeight % 2 === 0 ? 0.5 : -0.5 }}
      // marginLeft={-(props.size + +props.marginRight)}
      {...props}
    />
  )
}

export function OrbitTabButton(props: ButtonProps) {
  return (
    <Button
      glint={false}
      top={tabHeight / 2 - 18 / 2}
      right={8}
      circular
      borderWidth={0}
      width={18}
      height={18}
      icon="arrow-down"
      iconSize={10}
      opacity={0.4}
      position="absolute"
      hoverStyle={{
        opacity: 0.8,
      }}
      {...props}
    />
  )
}

const tabTransition = 'all ease-out 350ms'

const NavButtonChromeInner = gloss({
  flexFlow: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  height: '100%',
}).theme(({ sidePad }) => ({
  padding: [0, sidePad],
}))

const NavButtonChrome = gloss<TabProps>(View, {
  position: 'relative',
  flexFlow: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: borderSize,
  height: tabHeight,
  marginRight: 2,
}).theme(({ width, isActive, stretch }, theme) => {
  const background = linearGradient(theme.tabBackgroundTop, theme.tabBackgroundBottom)
  const glowStyle = {
    background: isActive ? background : theme.tabInactiveHover,
    transition: isActive ? 'none' : tabTransition,
  }
  return {
    zIndex: isActive ? 1000000000 : 0,
    width: stretch ? width || 150 : 'auto',
    background: isActive ? background : 'transparent',
    // textShadow: isActive ? 'none' : `0 -1px 0 #ffffff55`,
    // border: [1, isActive ? theme.borderColor : 'transparent'],
    // borderBottom: [1, isActive ? theme.tabBackgroundBottom : 'transparent'],
    // boxShadow: isActive
    //   ? [
    //       [0, 0, 6, [0, 0, 0, theme.background.isLight() ? 0.07 : 0.24]],
    //       // ['inset', 0, 0, 0, 0.5, theme.tabBorderColor || theme.borderColor.alpha(a => a * 0.6)],
    //       // ['inset', 0, 0.5, 0, 0.5, backgroundBase.alpha(0.8)],
    //     ]
    //   : null,
    '&:hover': glowStyle,
    '& .tab-icon-inactive.tab-icon-unpinned': {
      opacity: '0.4 !important',
      transition: isActive ? 'none' : tabTransition,
    },
    '&:hover .tab-icon-inactive.tab-icon-unpinned': {
      opacity: '1 !important',
    },
    '&:hover .tab-icon-inactive.tab-icon-pinned': {
      opacity: '1 !important',
    },
    '&:hover .tab-label': {
      opacity: 1,
    },
    '&:active': glowStyle,
  }
})

// const Separator = gloss({
//   position: 'absolute',
//   top: 0,
//   right: 0,
//   bottom: 0,
//   transform: {
//     x: 0.5,
//     y: -1.5,
//   },
//   width: 1,
// }).theme((_, theme) => ({
//   background: `linear-gradient(transparent, ${theme.borderColor.alpha(alpha => alpha * 0.65)})`,
// }))
