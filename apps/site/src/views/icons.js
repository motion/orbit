import * as React from 'react'
import slackIcon from '~/../public/slack.svg'
import driveIcon from '~/../public/drive.svg'
import dropboxIcon from '~/../public/dropbox.svg'
import mailIcon from '~/../public/mail.svg'
import githubIcon from '~/../public/github.svg'
// import ReactSVGInline from 'react-svg-inline'

export const Icon = ({ size, icon, after, style, ...props }) => (
  <div
    css={{ position: 'relative', width: size * 512, height: size * 512 }}
    style={style}
  >
    <img
      width="512"
      height="512"
      css={{
        // transformOrigin: 'top left',
        // transform: { scale: size * scale, ...transform },
        width: size * 512,
        height: size * 512,
      }}
      src={icon}
      {...props}
    />
    {after}
  </div>
)

export const SlackIcon = props => <Icon {...props} icon={slackIcon} />
export const DriveIcon = props => <Icon {...props} scale={1} icon={driveIcon} />
export const DropboxIcon = props => <Icon {...props} icon={dropboxIcon} />
export const GithubIcon = props => <Icon {...props} icon={githubIcon} />
export const MailIcon = props => (
  <Icon {...props} scale={1} transform={{ x: -15 }} icon={mailIcon} />
)
