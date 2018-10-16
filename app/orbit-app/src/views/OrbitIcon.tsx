import { attachTheme } from '@mcro/gloss'
import * as React from 'react'
import * as UI from '@mcro/ui'
import { compose, view } from '@mcro/black'
import { AppsStore } from '../pages/AppsStore'

const adjust = {
  icon: {
    transform: {
      x: -7,
      y: 2,
    },
  },
  slack: {
    transform: {
      scale: 0.95,
    },
  },
  gmail: {
    transform: {
      scale: 0.95,
      x: '-1%',
      y: '-1%',
    },
  },
  github: {
    transform: {
      x: '-1%',
    },
  },
  confluence: {
    transform: {
      // y: '-31%',
      scale: 1.4,
    },
  },
  jira: {
    transform: {
      y: '5%',
      x: '-8%',
      scale: 1.4,
    },
  },
}

const decorator = compose(
  attachTheme,
  view.attach('appsStore'),
  view,
)
export const OrbitIcon = decorator(
  ({
    appsStore = null as AppsStore,
    imageStyle = null,
    orbitIconStyle = null,
    size = 25,
    color = 'black',
    preventAdjust = false,
    className = '',
    theme,
    ...props
  }) => {
    const sizeProps = {
      width: size,
      height: size,
    }
    const icon = props.icon || props.name
    const extImg = icon.indexOf('http') === 0 ? icon : null
    const { genericAppInfo } = appsStore
    let iconImg = extImg
    if (genericAppInfo[icon]) {
      const config = genericAppInfo[icon].config
      const isDark = theme.background.isDark && theme.background.isDark()
      iconImg = isDark ? config.iconLight || config.icon : config.icon
    }
    if (!iconImg) {
      return (
        <UI.Icon name={icon} size={size * (preventAdjust ? 1 : 0.8)} color={color} {...props} />
      )
    }
    return (
      <UI.View
        className={`icon ${className}`}
        display="inline-block"
        textAlign="center"
        justifyContent="center"
        {...(iconImg ? adjust[icon] : adjust.icon)}
        {...sizeProps}
        {...iconImg && orbitIconStyle}
        {...props}
      >
        <UI.Image src={iconImg} width="100%" height="100%" {...imageStyle} />
      </UI.View>
    )
  },
)
