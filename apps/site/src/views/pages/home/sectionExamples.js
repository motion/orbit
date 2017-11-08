import { view } from '@mcro/black'
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

const opts = {
  percentFromTop: 76,
}

@view
export default class SectionExamples {
  render({ setSection, homeStore }) {
    const makeSection = (key, content) => (
      <View.SubTitle
        getRef={setSection(key, opts)}
        opacity={homeStore.activeKey === key ? 1 : 0.2}
        css={{
          transition: 'all ease-in 300ms',
        }}
      >
        {content}

        <line
          css={{
            position: 'absolute',
            bottom: -125,
            right: -385,
            width: 300,
            height: 1,
            background: 'red',
          }}
        >
          <upwardsLine
            css={{
              position: 'absolute',
              left: '-100%',
              width: 300,
              height: 1,
              background: 'linear-gradient(to right, transparent 20%, red)',
              transformOrigin: 'bottom right',
              transform: {
                rotate: '50deg',
                // y: -125,
                // x: -50,
              },
            }}
          />
        </line>
      </View.SubTitle>
    )

    return (
      <UI.Theme name="dark">
        <View.Section
          padded
          css={{ background: `linear-gradient(${dark2}, #000)` }}
        >
          <View.SectionContent padRight>
            <inner css={{ padding: [100, 0] }}>
              <View.Title size={3}>Ora keeps you in sync</View.Title>
              {makeSection(
                'example-1',
                <span>
                  Know about that <Logo name="slack" /> Slack conversation
                  before you open a duplicate <Logo name="jira" /> ticket.
                </span>
              )}
              {makeSection(
                'example-2',
                <span>
                  Verify you're referencing the latest numbers in that{' '}
                  <Logo name="google-drive" /> planning document before you hit
                  send on that <Logo name="google-gmail" /> email.
                </span>
              )}
              {makeSection(
                'example-3',
                <span>
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
                  Lisa already wrote <Logo name="dropbox" /> notes for that
                  upcoming meeting.
                </span>
              )}
              {makeSection(
                'example-4',
                <span>
                  Be the hero in <Logo name="slack" /> #devops by knowing that a{' '}
                  <Logo name="github-icon" /> ticket was just opened for the
                  very issue brought up.
                </span>
              )}
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
                  <View.Hl color="#000">everything</View.Hl> in your company,
                  and keeps it on hand <View.Hl color="#000">
                    anywhere
                  </View.Hl>{' '}
                  you are.
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
  }
}
