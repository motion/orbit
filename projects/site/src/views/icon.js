import * as React from 'react'
import gcalendar from '~/../public/logos/gcalendar.svg'
import gdocs from '~/../public/logos/gdocs.svg'
import gdrive from '~/../public/logos/gdrive.svg'
import gmail from '~/../public/logos/gmail.svg'
import gsheets from '~/../public/logos/gsheets.svg'
import slack from '~/../public/logos/slack.svg'
import github from '~/../public/logos/github.svg'
import confluence from '~/../public/logos/confluence.svg'
import jira from '~/../public/logos/jira.svg'
import salesforce from '~/../public/logos/salesforce.svg'
import dropbox from '~/../public/logos/dropbox.svg'

const icons = {
  dropbox,
  gcalendar,
  gdocs,
  gdrive,
  gmail,
  gsheets,
  slack,
  github,
  confluence,
  jira,
  salesforce,
}

const adjust = {
  slack: {
    transform: {
      y: 1.5,
      scale: 0.95,
    },
  },
  gmail: {
    transform: {
      scale: 0.95,
    },
  },
  jira: {
    transform: {
      scale: 1.5,
    },
  },
  confluence: {
    transform: {
      scale: 1.6,
    },
  },
}

export const Icon = ({ name, imageStyle, size = 25, ...props }) => {
  const sizeProps = {
    width: size,
    height: size,
  }
  return (
    <div
      style={{
        display: 'inline-block',
        textAlign: 'center',
        ...adjust[name],
        ...sizeProps,
      }}
      {...props}
    >
      <img
        src={icons[name]}
        style={{
          width: '100%',
          height: '100%',
          ...imageStyle,
        }}
      />
    </div>
  )
}
