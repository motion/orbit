import { attachTheme } from '@mcro/gloss'
import * as React from 'react'
import * as UI from '@mcro/ui'
import iconGCalendar from '../../public/icons/gcalendar.svg'
import iconGDocs from '../../public/icons/gdocs.svg'
import iconGDrive from '../../public/icons/gdrive.svg'
import iconGMail from '../../public/icons/gmail.svg'
import iconGSheets from '../../public/icons/gsheets.svg'
import iconSlack from '../../public/icons/slack.svg'
import iconGithub from '../../public/icons/github.svg'
import iconGithubWhite from '../../public/icons/github-white.svg'
import iconConfluence from '../../public/icons/confluence.svg'
import iconJira from '../../public/icons/jira.svg'

const icons = {
  gcalendar: iconGCalendar,
  gdocs: iconGDocs,
  gdrive: iconGDrive,
  gmail: iconGMail,
  gsheets: iconGSheets,
  slack: iconSlack,
  github: iconGithub,
  githubWhite: iconGithubWhite,
  confluence: iconConfluence,
  jira: iconJira,
}

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

export const OrbitIcon = attachTheme(
  ({
    icon,
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
    const extImg = icon.indexOf('http') === 0 ? icon : null
    let iconImg = icons[icon] ? icons[icon] : extImg
    // white icon if dark background + white icon exists
    if (icons[icon] && theme.background.isDark()) {
      const whiteKey = `${icon}White`
      if (icons[whiteKey]) {
        iconImg = icons[whiteKey]
      }
    }
    if (!iconImg) {
      return (
        <UI.Icon
          name={icon}
          size={size * (preventAdjust ? 1 : 0.8)}
          color={color}
          {...props}
        />
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
