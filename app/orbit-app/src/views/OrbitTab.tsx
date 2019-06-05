import { invertLightness } from '@o/color'
import { useLocationLink } from '@o/kit'
import { AppBit } from '@o/models'
import { Button, ButtonProps, Icon, IconProps, memoIsEqualDeep, MenuTemplate, Row, SimpleText, Tooltip, useContextMenu, View, ViewProps } from '@o/ui'
import { Box, gloss, useTheme } from 'gloss'
import * as React from 'react'

export const tabHeight = 32
const inactiveOpacity = 0.45
const borderSize = 8

export type TabProps = ViewProps & {
  app?: AppBit
  tabDisplay?: string
  separator?: boolean
  isActive?: boolean
  label?: React.ReactNode
  stretch?: boolean
  sidePad?: number
  tooltip?: string
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
  const iconSize = iconSizeProp || 16
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
        <Tooltip label={app ? app.name : undefined}>
          <Row space="sm" alignItems="center">
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
  let opacity = props.isActive ? 1 : props.thicc ? 0.5 : 0.3
  opacity += props.iconAdjustOpacity || 0
  return (
    <Icon
      color={invertLightness(theme.color, 0.8)}
      opacity={opacity}
      className={`tab-icon-${props.thicc ? 'pinned' : 'unpinned'} tab-icon-${
        props.isActive ? 'active' : 'inactive'
      }`}
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

const NavButtonChromeInner = gloss<any>(Box, {
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
  const { tabBackgroundHover, tabBackgroundActive, tabBackgroundSelected } = theme
  const background = isActive ? tabBackgroundSelected : 'transparent'
  const backgroundHover = isActive ? tabBackgroundSelected : tabBackgroundHover
  const backgroundActive = isActive ? tabBackgroundSelected : tabBackgroundActive
  return {
    width: stretch ? width || 150 : 'auto',
    background,
    '&:hover': {
      background: backgroundHover,
      transition: isActive ? 'none' : tabTransition,
    },
    '&:active': {
      background: backgroundActive,
      transition: isActive ? 'none' : tabTransition,
    },
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
  }
})
