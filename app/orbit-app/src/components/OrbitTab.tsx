import { Absolute, gloss, linearGradient, Row, SimpleText, useTheme, ViewProps } from '@mcro/gloss'
import { AppBit } from '@mcro/models'
import { Button, ButtonProps, IconProps, MenuTemplate, Tooltip, useContextMenu } from '@mcro/ui'
import * as React from 'react'
import { invertLightness } from '../../../../packages/color/_/color'
import { BorderBottom } from '../views/Border'
import { Icon, OrbitIconProps } from '../views/Icon'

export const tabHeight = 28
const inactiveOpacity = 0.45
const borderSize = 5

export type TabProps = ViewProps & {
  app?: AppBit
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
  const theme = useTheme()

  const button = (
    <NavButtonChrome
      className={`orbit-tab orbit-tab-${isActive ? 'active' : 'inactive'} ${
        thicc ? 'pinned' : 'unpinned'
      } undraggable ${className || ''}`}
      isActive={isActive}
      thicc={thicc}
      {...contextMenuProps}
      {...props}
    >
      <NavButtonChromeInner sidePad={sidePad} isActive={isActive}>
        {isActive && (
          <>
            <Absolute
              borderTopRadius={borderSize}
              height={100}
              top={0}
              left={0}
              right={0}
              overflow="hidden"
              boxShadow={[['inset', 0, 1, theme.glintColor || theme.background.alpha(0.5)]]}
              transform={{ y: -0.5 }}
            />
            <BorderBottom opacity={0.5} transform={{ y: 0 }} />
          </>
        )}

        <Row alignItems="center" maxWidth={after ? '76%' : '90%'}>
          {!React.isValidElement(icon) && !!icon && (
            <OrbitTabIcon
              isActive={isActive}
              name={`${icon}`}
              marginRight={!!label ? sidePad * 0.6 : 0}
              thicc={thicc}
              size={iconSize}
              iconAdjustOpacity={iconAdjustOpacity}
              transform={{
                y: -0.5,
              }}
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
              fontWeight={400}
              {...textProps}
              transition={isActive ? 'none' : tabTransition}
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
      </NavButtonChromeInner>
    </NavButtonChrome>
  )
  if (tooltip) {
    return <Tooltip label={tooltip}>{button}</Tooltip>
  }
  return button
}

function OrbitTabIcon(props: IconProps) {
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

const tabTransition = 'all ease-out 350ms'

const NavButtonChromeInner = gloss({
  flexFlow: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
  height: '100%',
  borderTop: [1, 'transparent'],
}).theme(({ isActive, sidePad }, theme) => ({
  borderBottom: [1, isActive ? theme.tabBackgroundBottom : 'transparent'],
  padding: [0, sidePad],
}))

const NavButtonChrome = gloss<TabProps>({
  position: 'relative',
  flexFlow: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderTopRadius: borderSize,
  overflow: 'hidden',
  height: tabHeight,
  transform: {
    y: 1.5,
  },
}).theme(({ isActive, stretch }, theme) => {
  const background = linearGradient(theme.tabBackgroundTop, theme.tabBackgroundBottom)

  const glowStyle = {
    background: isActive ? background : theme.tabInactiveHover || [0, 0, 0, 0.05],
    transition: isActive ? 'none' : tabTransition,
  }

  return {
    width: stretch ? 150 : 'auto',
    background: isActive ? background : 'transparent',
    // textShadow: isActive ? 'none' : `0 -1px 0 #ffffff55`,
    // border: [1, isActive ? theme.borderColor : 'transparent'],
    borderBottom: [1, isActive ? theme.tabBackgroundBottom : 'transparent'],
    boxShadow: isActive
      ? [
          [0, 1, 10, [0, 0, 0, theme.background.isLight() ? 0.07 : 0.24]],
          ['inset', 0, 0, 0, 0.5, theme.tabBorderColor || theme.borderColor],
          // ['inset', 0, 0.5, 0, 0.5, backgroundBase.alpha(0.8)],
        ]
      : null,
    '&:hover': glowStyle,
    '& .tab-icon-inactive.tab-icon-unpinned': {
      opacity: '0.4 !important',
      transition: isActive ? 'none' : tabTransition,
    },
    '&:hover .tab-icon-inactive.tab-icon-unpinned': {
      opacity: '0.6 !important',
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
    x: 0.5,
  },
  width: 1,
}).theme((_, theme) => ({
  background: `linear-gradient(transparent, ${theme.borderColor.alpha(alpha => alpha * 0.65)})`,
}))
