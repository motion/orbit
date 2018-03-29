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

export default ({ icon, ...props }) => (
  <React.Fragment>
    <img if={icons[icon]} src={icons[icon]} {...props} />
    <UI.Icon if={!icons[icon]} name={icon} />
  </React.Fragment>
)
