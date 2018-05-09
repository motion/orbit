import * as React from 'react'
import SVGInline from 'react-svg-inline'
import slackIcon from '~/../public/slack.svg'
import driveIcon from '~/../public/drive.svg'
import dropboxIcon from '~/../public/dropbox.svg'
import mailIcon from '~/../public/mail.svg'
import githubIcon from '~/../public/github.svg'

export const Icon = ({ size, icon, scale = 1, after, transform, ...props }) => (
  <div css={{ position: 'relative', width: size * 512, height: size * 512 }}>
    <SVGInline
      cleanup
      svg={icon}
      width="512"
      height="512"
      css={{
        transformOrigin: 'top left',
        transform: { scale: size * scale, ...transform },
      }}
      {...props}
    />
    {after}
  </div>
)

export const SlackIcon = props => <Icon {...props} icon={slackIcon} />
export const DriveIcon = props => (
  <Icon {...props} scale={1.8} icon={driveIcon} />
)
export const DropboxIcon = props => <Icon {...props} icon={dropboxIcon} />
export const GithubIcon = props => <Icon {...props} icon={githubIcon} />
export const MailIcon = props => (
  <Icon {...props} scale={4} transform={{ x: -15 }} icon={mailIcon} />
)
