import * as React from 'react'
import * as UI from '@mcro/ui'
import iconGCalendar from '../../../public/icons/gcalendar.svg'
import iconGDocs from '../../../public/icons/gdocs.svg'
import iconGDrive from '../../../public/icons/gdrive.svg'
import iconGMail from '../../../public/icons/gmail.svg'
import iconGSheets from '../../../public/icons/gsheets.svg'
import iconSlack from '../../../public/icons/slack.svg'
import iconGithub from '../../../public/icons/github.svg'
import iconGithubWhite from '../../../public/icons/github-white.svg'
import iconConfluence from '../../../public/icons/confluence.svg'
import iconJira from '../../../public/icons/jira.svg'

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
      scale: 1.4,
    },
  },
  jira: {
    transform: {
      scale: 1.3,
    },
  },
}

export const OrbitIcon = ({
  icon,
  imageStyle,
  orbitIconStyle,
  size = 25,
  color,
  preventAdjust,
  className,
  ...props
}) => {
  const sizeProps = {
    width: size,
    height: size,
  }
  const extImg = icon.indexOf('http') === 0 ? icon : null
  const iconImg = icons[icon] ? icons[icon] : extImg
  return (
    <UI.View
      className={`icon ${className}`}
      display="inline-block"
      textAlign="center"
      justifyContent="center"
      {...adjust[icon]}
      {...sizeProps}
      {...iconImg && orbitIconStyle}
      {...props}
    >
      {iconImg ? (
        <img
          src={iconImg}
          css={{
            width: '100%',
            height: '100%',
            ...imageStyle,
          }}
        />
      ) : null}
      <UI.Icon
        if={!iconImg}
        name={icon}
        css={{ display: 'inline-block', ...sizeProps, ...imageStyle }}
        size={size * (preventAdjust ? 1 : 0.65)}
        color={color}
      />
    </UI.View>
  )
}
