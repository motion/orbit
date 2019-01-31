import { gloss, Row, useTheme } from '@mcro/gloss'
import { App } from '@mcro/models'
import { Button, ContextMenu, Glint, IconProps, MenuTemplate, Text, Tooltip } from '@mcro/ui'
import * as React from 'react'
import { invertLightness } from '../../../../packages/color/_/color'
import { Icon, OrbitIconProps } from '../views/Icon'

export const tabHeight = 26
const inactiveOpacity = 0.5
const border = 5

export type TabProps = React.HTMLAttributes<'div'> & {
  app?: App
  separator?: boolean
  isActive?: boolean
  label?: string
  stretch?: boolean
  sidePad?: number
  tooltip?: string
  textProps?: any
  onClickPopout?: Function
  thicc?: boolean
  icon?: string | React.ReactNode
  iconSize?: number
  iconAdjustOpacity?: number
  getContext?: () => MenuTemplate
  disabled?: boolean
  iconProps?: OrbitIconProps
}

export function OrbitTab({
  app,
  icon,
  iconSize = 10,
  iconProps,
  iconAdjustOpacity = 0,
  tooltip,
  label,
  isActive = false,
  separator = false,
  onClickPopout,
  textProps,
  thicc,
  className = '',
  getContext,
  ...props
}: TabProps) {
  const sidePad = thicc ? 18 : 12
  const button = (
    <NavButtonChrome
      className={`orbit-tab orbit-tab-${isActive ? 'active' : 'inactive'} ${
        thicc ? 'pinned' : 'unpinned'
      } undraggable ${className}`}
      isActive={isActive}
      sidePad={sidePad}
      {...props}
    >
      <ContextMenu items={getContext ? getContext() : null}>
        {isActive && <Glint y={2} borderRadius={border} />}
        <Row margin={['auto', 0]} alignItems="center">
          {!React.isValidElement(icon) && (
            <OrbitTabIcon
              isActive={isActive}
              name={`${icon}`}
              size={iconSize}
              marginRight={!!label ? sidePad * 0.6 : 0}
              {...iconProps}
            />
          )}
          {React.isValidElement(icon) &&
            React.cloneElement(icon, { size: iconSize, ...iconProps } as any)}
          {!!label && (
            <Text
              ellipse
              className="tab-label"
              size={0.95}
              opacity={isActive ? 1 : inactiveOpacity}
              fontWeight={400}
              {...textProps}
            >
              {label}
            </Text>
          )}
        </Row>

        {separator && <Separator />}

        {isActive && !!onClickPopout && (
          <DropDownButton
            className={`appDropdown ${app ? `appDropdown-${app.id}` : ''}`}
            right={sidePad * 0.25}
            tooltip="Open"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              onClickPopout()
            }}
          />
        )}
      </ContextMenu>
    </NavButtonChrome>
  )
  if (tooltip) {
    return <Tooltip label={tooltip}>{button}</Tooltip>
  }
  return button
}

function OrbitTabIcon(props: IconProps) {
  const theme = useTheme()
  return (
    <Icon
      color={invertLightness(theme.color, 0.8).alpha(props.isActive ? 1 : 0.6)}
      className="tab-icon"
      transform={{ y: tabHeight % 2 === 0 ? 0.5 : -0.5 }}
      // marginLeft={-(props.size + +props.marginRight)}
      {...props}
    />
  )
}

function DropDownButton(props) {
  return (
    <Button
      circular
      borderWidth={0}
      width={18}
      height={18}
      icon="downArrow"
      background="transparent"
      iconProps={{ size: 8 }}
      opacity={0}
      top={tabHeight / 2 - 9}
      position="absolute"
      hoverStyle={{
        opacity: 0.2,
      }}
      {...props}
    />
  )
}

const NavButtonChrome = gloss<{ isActive?: boolean; stretch?: boolean; sidePad: number }>({
  position: 'relative',
  flexFlow: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderTopRadius: border,
  overflow: 'hidden',
  height: tabHeight,
  maxWidth: 160,
  transform: {
    y: 0.5,
  },
}).theme(({ isActive, stretch, sidePad }, theme) => {
  const backgroundBase = theme.tabBackground
  const background = `linear-gradient(${backgroundBase.alpha(0.7)}, ${backgroundBase.alpha(0.95)})`
  const glowStyle = {
    background: isActive ? background : theme.tabInactiveHover || [0, 0, 0, 0.05],
    transition: isActive ? 'none' : 'all ease-out 500ms',
  }
  return {
    padding: [0, sidePad],
    minWidth: stretch ? 160 : 0,
    background: isActive ? background : 'transparent',
    // textShadow: isActive ? 'none' : `0 -1px 0 #ffffff55`,
    // border: [1, isActive ? theme.borderColor : 'transparent'],
    // borderBottom: [1, theme.borderColor],
    boxShadow: isActive
      ? [
          [0, 2, 9, [0, 0, 0, theme.background.isLight() ? 0.07 : 0.2]],
          ['inset', 0, 0, 0, 0.5, theme.tabBorderColor || theme.borderColor],
          // ['inset', 0, 0.5, 0, 0.5, backgroundBase.alpha(0.8)],
        ]
      : null,
    '&:hover': glowStyle,
    '&:hover .tab-label': {
      opacity: 1,
    },
    '&:active': glowStyle,
  }
})

const Separator = gloss({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  transform: {
    y: -1,
  },
  width: 1,
  background: 'linear-gradient(transparent 15%, rgba(0,0,0,0.048))',
})
