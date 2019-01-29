import { gloss, Row } from '@mcro/gloss'
import { App } from '@mcro/models'
import { Button, IconProps, Text, Tooltip } from '@mcro/ui'
import * as React from 'react'
import { Icon } from '../views/Icon'

export const tabHeight = 24
const inactiveOpacity = 0.5

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
      <Row margin={['auto', 0]} alignItems="center">
        {!!icon && (
          <OrbitTabIcon
            opacity={(isActive ? (!label ? 1 : 1) : !label ? 0.4 : 0.4) + iconAdjustOpacity}
            isActive={isActive}
            name={icon}
            size={iconSize}
            marginRight={!!label ? sidePad * 0.7 : 0}
          />
        )}
        {!!label && (
          <Text
            ellipse
            className="tab-label"
            size={0.95}
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

function OrbitTabIcon(props: IconProps) {
  return (
    <Icon
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
  borderTopRadius: 5,
  overflow: 'hidden',
  transform: {
    y: 0.5,
  },
  height: tabHeight,
  maxWidth: 160,
}).theme(({ isActive, stretch, sidePad }, theme) => {
  // const background = theme.tabBackground || theme.background
  const backgroundBase = theme.tabBackground || theme.background
  const background = `linear-gradient(${backgroundBase.alpha(0.5)}, ${backgroundBase})`
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
          ['inset', 0, 0, 0, 0.5, theme.borderColor],
          ['inset', 0, 0, 0, 1, backgroundBase.alpha(0.8)],
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
