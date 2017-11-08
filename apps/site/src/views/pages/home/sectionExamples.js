import * as React from 'react'
import * as Constants from '~/constants'
import * as View from '~/views'
import * as UI from '@mcro/ui'

const Logo = props => (
  <img
    src={`/logos/${props.name}.svg`}
    css={{
      display: 'inline-block',
      alignSelf: 'center',
      margin: [-18, 0, -12],
      width: 30,
      height: 30,
      // filter: `grayscale(100%) contrast(100%) blur(1px)`,
    }}
  />
)

const Icon = props => (
  <UI.Icon css={{ display: 'inline' }} size={30} {...props} />
)

const dark2 = UI.color(Constants.colorSecondary)
  .darken(0.75)
  .toString()

export default props => (
  <UI.Theme name="dark">
    <View.Section
      padded
      css={{ background: `linear-gradient(${dark2}, #000)` }}
    >
      <View.SectionContent padRight>
        <inner css={{ padding: [100, 0] }}>
          <View.Title size={3}>Ora keeps you in sync</View.Title>
          <View.SubTitle getRef={props.setSection('example-1')} opacity={1}>
            Know about that <Logo name="slack" /> Slack conversation before you
            open a duplicate <Logo name="jira" /> ticket.
          </View.SubTitle>
          <View.SubTitle getRef={props.setSection('example-2')} opacity={0.5}>
            Verify you're referencing the latest numbers in that{' '}
            <Logo name="google-drive" /> planning document before you hit send
            on that <Logo name="google-gmail" /> email.
          </View.SubTitle>
          <View.SubTitle getRef={props.setSection('example-3')} opacity={0.5}>
            Know that{' '}
            <img
              src="/steph.jpg"
              css={{
                width: 30,
                height: 30,
                borderRadius: 30,
                display: 'inline',
              }}
            />{' '}
            Lisa already wrote <Logo name="dropbox" /> notes for that upcoming
            meeting.
          </View.SubTitle>
          <View.SubTitle opacity={0.5}>
            Be the hero in <Logo name="slack" /> #devops by knowing that a{' '}
            <Logo name="github-icon" /> ticket was just opened for the very
            issue brought up.
          </View.SubTitle>
          <br />
          <br />
          <br />
          <View.SubTitle opacity={0.5}>And much more.</View.SubTitle>
          <br />
          <br />
          <br />
          <div>
            <View.SubTitle opacity={1}>
              Orbit is the first ever knowledge assistant that knows
              <View.Hl color="#000">everything</View.Hl> in your company, and
              keeps it on hand <View.Hl color="#000">anywhere</View.Hl> you are.
            </View.SubTitle>
          </div>
        </inner>
      </View.SectionContent>

      <nebula>
        <cloud
          css={{
            position: 'absolute',
            bottom: -400,
            right: -100,
            width: 1200,
            height: 500,
            background: 'radial-gradient(orange, transparent 50%)',
            zIndex: 2,
            opacity: 0.15,
            transform: {
              z: 0,
              scale: 3,
            },
          }}
        />
        <cloud
          css={{
            position: 'absolute',
            bottom: -400,
            right: -100,
            width: 1000,
            height: 800,
            background: 'radial-gradient(red, transparent 50%)',
            zIndex: 1,
            opacity: 0.25,
            transform: {
              z: 0,
              scale: 3,
            },
          }}
        />
        <cloud
          css={{
            position: 'absolute',
            bottom: -200,
            right: -300,
            width: 500,
            height: 500,
            background: 'radial-gradient(black, transparent 50%)',
            zIndex: 3,
            opacity: 0.5,
            transform: {
              z: 0,
              scale: 3,
            },
          }}
        />
      </nebula>
    </View.Section>
  </UI.Theme>
)
