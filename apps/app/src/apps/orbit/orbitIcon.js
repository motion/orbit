import * as React from 'react'
import * as UI from '@mcro/ui'
import iconGCalendar from '~/../public/icons/gcalendar.svg'
import iconGDocs from '~/../public/icons/gdocs.svg'
import iconGDrive from '~/../public/icons/gdrive.svg'
import iconGMail from '~/../public/icons/gmail.svg'
import iconGSheets from '~/../public/icons/gsheets.svg'
import iconSlack from '~/../public/icons/slack.svg'
import iconGithub from '~/../public/icons/github.svg'
import iconGithubWhite from '~/../public/icons/github-white.svg'

const icons = {
  gcalendar: iconGCalendar,
  gdocs: iconGDocs,
  gdrive: iconGDrive,
  gmail: iconGMail,
  gsheets: iconGSheets,
  slack: iconSlack,
  github: iconGithub,
  githubWhite: iconGithubWhite,
}

const SLACK_SCALE = {
  transform: {
    scale: 0.95,
  },
}
const GMAIL_SCALE = {
  transform: {
    scale: 0.95,
  },
}

const adjust = name => {
  if (name === 'slack') {
    return SLACK_SCALE
  }
  if (name === 'gmail') {
    return GMAIL_SCALE
  }
}

export const OrbitIcon = ({ icon, size = 25, style, ...props }) => {
  const sizeProps = {
    width: size,
    height: size,
  }
  return (
    <icon
      css={{
        display: 'inline-block',
        textAlign: 'center',
        ...adjust(icon),
        ...sizeProps,
        ...style,
      }}
      {...props}
    >
      <img
        if={icons[icon]}
        src={icons[icon]}
        css={{ width: '100%', height: '100%' }}
      />
      <UI.Icon
        if={!icons[icon]}
        name={icon}
        css={{ display: 'inline', ...sizeProps }}
        size={size}
      />
    </icon>
  )
}
