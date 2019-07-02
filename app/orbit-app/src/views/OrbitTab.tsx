import { invertLightness } from '@o/color'
import { useLocationLink } from '@o/kit'
import { AppBit } from '@o/models'
import { Button, ButtonProps, Icon, IconProps, MenuTemplate, Row, SimpleText, Tooltip, useContextMenu, View, ViewProps } from '@o/ui'
import { gloss, useTheme } from 'gloss'
import React, { memo } from 'react'

export const tabHeight = 36
const inactiveOpacity = 0.45
const borderSize = 8

export type TabProps = Omit<ViewProps, 'width'> & {
  width: number
  app?: AppBit
  tabDisplay?: string
  separator?: boolean
  isActive?: boolean
  label?: React.ReactNode
  stretch?: boolean
  sidePad?: number
  tooltip?: string
  icon?: string | React.ReactNode
  iconSize?: number
  iconAdjustOpacity?: number
  getContext?: () => MenuTemplate
  disabled?: boolean
  iconProps?: Partial<IconProps>
  after?: React.ReactNode
  location?: string
}

export const OrbitTab = memo(function OrbitTab({
  icon,
  iconSize: iconSizeProp,
  iconProps,
  iconAdjustOpacity = 0,
  tooltip,
  label,
  isActive = false,
  className = '',
  getContext,
  after,
  location,
  app,
  width,
  ...props
}: TabProps) {
  const contextMenuProps = useContextMenu({ items: getContext ? getContext() : null })
  const iconSize = iconSizeProp || 16
  const link = useLocationLink(location)

  const button = (
    <NavButtonChrome
      width={width}
      className={`orbit-tab orbit-tab-${isActive ? 'active' : 'inactive'} undraggable ${className ||
        ''}`}
      isActive={isActive}
      onClick={link}
      {...contextMenuProps}
      {...props}
    >
      <NavButtonChromeInner isActive={isActive}>
        <Tooltip label={app ? app.name : undefined}>
          <Row space="sm" alignItems="center">
            {React.isValidElement(icon) ? (
              React.cloneElement(icon, { size: iconSize, ...iconProps } as any)
            ) : (
              <OrbitTabIcon
                isActive={isActive}
                name={`${icon}`}
                marginRight={!!label ? width * 0.2 : 0}
                size={iconSize}
                iconAdjustOpacity={iconAdjustOpacity}
                {...iconProps}
              />
            )}
            {!!label && (
              <View flex={1}>
                <SimpleText
                  ellipse
                  className="tab-label"
                  display="inline-flex"
                  opacity={isActive ? 1 : inactiveOpacity}
                  fontWeight={300}
                  fontSize={12}
                  transition={isActive ? 'none' : tabTransition}
                >
                  {label}
                </SimpleText>
              </View>
            )}

            {after}
          </Row>
        </Tooltip>
      </NavButtonChromeInner>
    </NavButtonChrome>
  )
  if (tooltip) {
    return <Tooltip label={tooltip}>{button}</Tooltip>
  }
  return button
})

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

function OrbitTabIcon(props: Omit<IconProps, 'label'> & TabProps) {
  const theme = useTheme()
  let opacity = props.isActive ? 1 : 0.5
  opacity += props.iconAdjustOpacity || 0
  return (
    <Icon
      color={invertLightness(theme.color, 0.8)}
      opacity={opacity}
      className={`tab-icon-${props.isActive ? 'active' : 'inactive'}`}
      {...props}
    />
  )
}

export function OrbitTabButton(props: ButtonProps) {
  return (
    <Button
      glint={false}
      circular
      borderWidth={0}
      width={18}
      height={18}
      icon="arrow-down"
      iconSize={10}
      {...props}
    />
  )
}

const tabTransition = 'all ease-out 350ms'

const NavButtonChromeInner = gloss<any>(Row, {
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  height: '100%',
})

const NavButtonChrome = gloss<TabProps>(View, {
  position: 'relative',
  flexFlow: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: borderSize,
  height: tabHeight,
  marginRight: 2,
}).theme(({ width, isActive, stretch }, theme) => {
  const { tabBackgroundHover, tabBackgroundActive, tabBackgroundSelected } = theme
  const background = isActive ? tabBackgroundSelected : 'transparent'
  const backgroundHover = isActive ? tabBackgroundSelected : tabBackgroundHover
  const backgroundActive = isActive ? tabBackgroundSelected : tabBackgroundActive
  return {
    background,
    '&:hover': {
      background: backgroundHover,
      transition: isActive ? 'none' : tabTransition,
    },
    '&:active': {
      background: backgroundActive,
      transition: isActive ? 'none' : tabTransition,
    },
    '&:hover .tab-label': {
      opacity: 1,
    },
  }
})
