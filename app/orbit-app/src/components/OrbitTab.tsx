import { invertLightness } from '@mcro/color'
import { gloss, Row, ThemeContext } from '@mcro/gloss'
import { App } from '@mcro/models'
import { Button, IconProps, Text, Tooltip, View } from '@mcro/ui'
import * as React from 'react'
import { Icon } from '../views/Icon'

export const tabHeight = 28
const inactiveOpacity = 0.6

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
  icon?: string
  iconSize?: number
  iconAdjustOpacity?: number
}

export function OrbitTab({
  app,
  icon,
  iconSize = 10,
  iconAdjustOpacity = 0,
  tooltip,
  label,
  isActive = false,
  separator = false,
  onClickPopout,
  textProps,
  thicc,
  className = '',
  ...props
}: TabProps) {
  const sidePad = thicc ? 20 : 12
  const button = (
    <NavButtonChrome
      className={`orbit-tab orbit-tab-${isActive ? 'active' : 'inactive'} undraggable ${className}`}
      isActive={isActive}
      sidePad={sidePad}
      {...props}
    >
      <Row maxWidth="100%" alignItems="center" justifyContent="center">
        {!!icon && (
          <OrbitTabIcon
            opacity={(isActive ? (!label ? 0.9 : 0.7) : !label ? 0.5 : 0.35) + iconAdjustOpacity}
            isActive={isActive}
            name={icon}
            size={iconSize}
          />
        )}
        {!!label && (
          <Text
            ellipse
            className="tab-label"
            size={0.95}
            marginLeft={!!icon ? sidePad * 0.7 : 0}
            opacity={isActive ? 1 : inactiveOpacity}
            fontWeight={500}
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
    </NavButtonChrome>
  )
  if (tooltip) {
    return <Tooltip label={tooltip}>{button}</Tooltip>
  }
  return button
}

function OrbitTabIcon({ opacity, ...props }: IconProps) {
  const { activeTheme } = React.useContext(ThemeContext)
  return (
    <View position="relative" opacity={opacity}>
      <Icon transform={{ y: tabHeight % 2 === 0 ? 0.5 : -0.5 }} {...props} />
      {/* show underneath an opposite colored one to */}
      <Icon
        transform={{ y: tabHeight % 2 === 0 ? 0.5 : -0.5 }}
        color={invertLightness(activeTheme.color, 0.2)}
        position="absolute"
        top={0}
        left={0}
        zIndex={-1}
        {...props}
      />
    </View>
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
  alignItems: 'center',
  justifyContent: 'center',
  height: tabHeight,
  maxWidth: 160,
  borderTopRadius: 5,
  transform: {
    y: 0.5,
  },
}).theme(({ isActive, stretch, sidePad }, theme) => {
  // const background = theme.tabBackground || theme.background
  const background = theme.tabBackground || theme.background
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
      ? [[0, 2, 9, [0, 0, 0, 0.045]], ['inset', 0, 0, 0, 0.5, theme.borderColor]]
      : null,
    // borderTopRadius: 3,
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
