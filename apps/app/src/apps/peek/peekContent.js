import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import PeekIcon from './peekIcon'

const glowProps = {
  color: '#fff',
  scale: 1,
  blur: 70,
  opacity: 0.15,
  show: false,
  resist: 60,
  zIndex: -1,
}

const Item = ({ title, type, subtitle, content }) => (
  <UI.Surface
    background="transparent"
    glow
    glowProps={glowProps}
    padding={[10, 18]}
  >
    <UI.Title
      size={1.6}
      ellipse
      css={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <PeekIcon
        name={type}
        css={{
          width: 22,
          height: 22,
          marginRight: 3,
          marginBottom: 4,
          display: 'inline-block',
        }}
      />{' '}
      {title}
    </UI.Title>
    <UI.Text opacity={0.6} margin={[0, 0, 3]} size={1.1}>
      {subtitle}
    </UI.Text>
    <UI.Text opacity={0.8} ellipse={3} sizeLineHeight={1.15}>
      {content}
    </UI.Text>
  </UI.Surface>
)

@view
export default class PeekContent {
  render() {
    return (
      <list>
        <Item
          type="gmail"
          title="Your Monday afternoon trip with Uber"
          subtitle="Uber Receipts"
          content="$3.83 Thanks for choosing Uber, Nathan March 5, 2018 | Express POOL"
        />
        <Item
          type="gmail"
          title="Scavolini Kitchen cabinet door"
          subtitle="Chris Galota (me, cammarata.nick)"
          content="Hi guys. In order to decide how to proceed with the kitchen cabinet, we need a bit more clarity on the issue and so we need your help."
        />
        <Item
          type="gmail"
          title="Fwd: 5-Bullet Friday"
          subtitle="Andrew Herren (Potluck)"
          content="Yeah, this is cool! It's illuminating to get a peek into the process of how a study like this proceeds, the timeline of approvals"
        />
        <Item
          type="gdocs"
          title="Fwd: 5-Bullet Friday"
          subtitle="Andrew Herren (Potluck)"
          content="Yeah, this is cool! It's illuminating to get a peek into the process of how a study like this proceeds, the timeline of approvals"
        />
        <Item
          type="gcalendar"
          title="Fwd: 5-Bullet Friday"
          subtitle="Andrew Herren (Potluck)"
          content="Yeah, this is cool! It's illuminating to get a peek into the process of how a study like this proceeds, the timeline of approvals"
        />
        <Item
          type="gsheets"
          title="Fwd: 5-Bullet Friday"
          subtitle="Andrew Herren (Potluck)"
          content="Yeah, this is cool! It's illuminating to get a peek into the process of how a study like this proceeds, the timeline of approvals"
        />
        <Item
          type="slack"
          title="Fwd: 5-Bullet Friday"
          subtitle="Andrew Herren (Potluck)"
          content="Yeah, this is cool! It's illuminating to get a peek into the process of how a study like this proceeds, the timeline of approvals"
        />
      </list>
    )
  }
}
