import { gloss, linearGradient, Row, SimpleText, useTheme, ViewProps } from '@mcro/gloss'
import { App } from '@mcro/models'
import {
  Button,
  ButtonProps,
  Glint,
  IconProps,
  MenuTemplate,
  Tooltip,
  useContextMenu,
} from '@mcro/ui'
import * as React from 'react'
import { invertLightness } from '../../../../packages/color/_/color'
import { Icon, OrbitIconProps } from '../views/Icon'

export const tabHeight = 28
const inactiveOpacity = 0.5
const border = 5

export type TabProps = ViewProps & {
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
  after?: React.ReactNode
}

export function OrbitTab({
  app,
  icon,
  iconSize: iconSizeProp,
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
  after,
  ...props
}: TabProps) {
  const sidePad = thicc ? 18 : 12
  const contextMenuProps = useContextMenu({ items: getContext ? getContext() : null })
  const iconSize = iconSizeProp || (thicc ? 12 : 10)

  const button = (
    <NavButtonChrome
      className={`orbit-tab orbit-tab-${isActive ? 'active' : 'inactive'} ${
        thicc ? 'pinned' : 'unpinned'
      } undraggable ${className || ''}`}
      isActive={isActive}
      thicc={thicc}
      sidePad={sidePad}
      {...contextMenuProps}
      {...props}
    >
      {isActive && <Glint y={2} borderRadius={border} />}
      <Row alignItems="center" maxWidth={after ? '76%' : '90%'}>
        {!React.isValidElement(icon) && !!icon && (
          <OrbitTabIcon
            isActive={isActive}
            name={`${icon}`}
            marginRight={!!label ? sidePad * 0.6 : 0}
            thicc={thicc}
            size={iconSize}
            {...iconProps}
          />
        )}
        {React.isValidElement(icon) &&
          React.cloneElement(icon, { size: iconSize, ...iconProps } as any)}
        {!!label && (
          <SimpleText
            ellipse
            className="tab-label"
            display="flex"
            flex={1}
            size={0.95}
            opacity={isActive ? 1 : inactiveOpacity}
            fontWeight={500}
            {...textProps}
          >
            {label}
          </SimpleText>
        )}
      </Row>

      {separator && <Separator />}

      {after}

      {/* {isActive && !!onClickPopout && (
          <OrbitTabButton
            className={`appDropdown ${app ? `appDropdown-${app.id}` : ''}`}
            tooltip="Open"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              onClickPopout()
            }}
          />
        )} */}
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
      color={invertLightness(theme.color, 0.8)}
      opacity={props.isActive ? 1 : props.thicc ? 0.5 : 0.3}
      className="tab-icon"
      transform={{ y: tabHeight % 2 === 0 ? 0.5 : -0.5 }}
      // marginLeft={-(props.size + +props.marginRight)}
      {...props}
    />
  )
}

export function OrbitTabButton(props: ButtonProps) {
  return (
    <Button
      glint={false}
      top={tabHeight / 2 - 8}
      right={8}
      circular
      borderWidth={0}
      width={18}
      height={18}
      icon="downArrow"
      background="transparent"
      iconProps={{ size: 8 }}
      opacity={0}
      position="absolute"
      hoverStyle={{
        opacity: 0.4,
      }}
      {...props}
    />
  )
}

const NavButtonChrome = gloss<TabProps>({
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
  const background = linearGradient(theme.tabBackgroundTop, theme.tabBackgroundBottom)

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
          [0, 2, 9, [0, 0, 0, theme.background.isLight() ? 0.07 : 0.26]],
          ['inset', 0, 0, 0, 0.5, theme.tabBorderColor || theme.borderColor],
          // ['inset', 0, 0.5, 0, 0.5, backgroundBase.alpha(0.8)],
        ]
      : null,
    '&:hover': glowStyle,
    '&:hover .tab-icon': {
      opacity: '1 !important',
    },
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
    y: -0.5,
    x: 0.5,
  },
  width: 1,
}).theme((_, theme) => ({
  background: `linear-gradient(transparent 15%, ${theme.background.darken(0.2).alpha(0.65)})`,
}))
