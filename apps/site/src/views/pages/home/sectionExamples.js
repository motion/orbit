import { view } from '@mcro/black'
import * as React from 'react'
import * as Constants from '~/constants'
import * as View from '~/views'
import * as UI from '@mcro/ui'
import Orbitals from './orbitals'

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

const Nebula = () => (
  <nebula>
    <cloud
      css={{
        position: 'absolute',
        bottom: -400,
        right: -100,
        width: 1000,
        height: 800,
        background: 'radial-gradient(white, transparent 50%)',
        zIndex: 1,
        opacity: 0.25,
        transform: {
          z: 0,
          scale: 3,
        },
      }}
    />
  </nebula>
)

const Lines = ({ adjustDown, isActive }) => (
  <line
    css={{
      position: 'absolute',
      bottom: -adjustDown * 4 + 100,
      right: -140,
      width: 100,
      height: 1,
      opacity: isActive ? 1 : 0,
      //background: 'linear-gradient(to left, transparent, #000 50%)',
    }}
  >
    <upwardsLine
      css={{
        position: 'absolute',
        left: '-100%',
        width: 300,
        height: 1,
        background: 'linear-gradient(to right, #ccc 50%, #000)',
        transformOrigin: 'bottom right',
        transform: {
          rotate: `${adjustDown * 1.1}deg`,
          // y: -125,
          // x: -50,
        },
      }}
    />
  </line>
)

const OPTS = {
  percentFromTop: 50,
}

@view
export default class SectionExamples {
  render({ setSection, homeStore, blurred }) {
    const makeSection = (key, content, opts = OPTS, props) => {
      const adjustDown = opts.percentFromTop - 30 * 2
      const isActive = homeStore.activeKey === key
      return (
        <View.SubTitle
          getRef={setSection(key, opts)}
          opacity={isActive ? 1 : 0.32}
          color="#000"
          fontWeight={300}
          css={{
            transition: 'all ease-in 300ms',
            marginBottom: 50,
            marginTop: 50,
          }}
          {...props}
        >
          {content}
        </View.SubTitle>
      )
    }

    return (
      <UI.Theme name="light">
        <View.Section
          css={{
            // background: Constants.mainLight,
            padding: [100, 0],
          }}
        >
          <View.SectionContent css={{ paddingRight: 430 }}>
            <stripeBetween
              css={{
                position: 'absolute',
                top: -100,
                left: 0,
                bottom: 0,
                right: 0,
              }}
            >
              <fadeDown
                css={{
                  position: 'absolute',
                  top: 582,
                  left: -1114,
                  width: 2000,
                  height: 1000,
                  background: `linear-gradient(-90deg, ${
                    Constants.mainLight
                  }, white 50%)`,
                  zIndex: 2,
                  transform: {
                    rotate: '-98deg',
                    scale: 1,
                    y: 155,
                  },
                }}
              />
              <levelerStripe
                css={{
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  left: '-100%',
                  marginLeft: 395,
                  height: 200,
                  background: Constants.mainLight,
                  zIndex: 1,
                }}
              />
            </stripeBetween>

            <background
              css={{
                position: 'absolute',
                background: `radial-gradient(${
                  Constants.mainLight
                }, transparent 50%)`,
                height: 1800,
                width: 1800,
                bottom: -900,
                right: -600,
                zIndex: 1,
              }}
            />

            <Orbitals
              planetStyles={{
                background: '#f2f2f2',
                border: [1, '#ccc'],
              }}
              css={{
                zIndex: 0,
                top: -200,
                position: 'absolute',
                right: -800,
                left: 'auto',
                transform: { scale: 1.75 },
              }}
            />

            <inner css={{ position: 'relative', zIndex: 3 }}>
              <UI.Text
                size={3.8}
                fontWeight={200}
                padding={[0, 100, 60, 0]}
                color="#000"
              >
                Orbit provides insight as you work & talk with{' '}
                <span css={{ fontWeight: 600 }}>customers</span> &{' '}
                <span css={{ fontWeight: 600 }}>teammates</span>.<br />
              </UI.Text>

              {makeSection(
                'example-1',
                <span>
                  Discover a Slack conversation <Logo name="slack" /> as you
                  open a ticket <Logo name="jira" />.
                </span>,
                { percentFromTop: 38 }
              )}
              {makeSection(
                'example-2',
                <span>
                  Knowledgebase answers <Logo name="confluence" /> on hand the
                  second your customer asks in Zendesk <Logo name="zendesk" />.
                </span>,
                { percentFromTop: 55 }
              )}
              {makeSection(
                'example-3',
                <span>
                  See the latest numbers in that planning doc{' '}
                  <Logo name="google-drive" /> before you send{' '}
                  <Logo name="google-gmail" />.
                </span>,
                { percentFromTop: 58 }
              )}
              {false &&
                makeSection(
                  'example-4',
                  <span>
                    Michelle already wrote <Logo name="dropbox" /> some notes on
                    that last meeting.
                  </span>,
                  { percentFromTop: 63 }
                )}
              {false &&
                makeSection(
                  'example-5',
                  <span>
                    Be the hero in <Logo name="slack" /> #devops when you see a{' '}
                    <Logo name="github-icon" /> ticket was just opened for the
                    very issue someone just asked about.
                  </span>,
                  { percentFromTop: 70 }
                )}
              <br />
              <br />
              <br />
              <br />
              <div if={false}>
                <View.SubTitle opacity={1}>
                  Orbit is the first ever knowledge assistant that knows
                  <View.Hl color="#000">everything</View.Hl> in your company,
                  and keeps it on hand <View.Hl color="#000">anywhere</View.Hl>{' '}
                  you are.
                </View.SubTitle>
              </div>
            </inner>
          </View.SectionContent>

          <Nebula key={0} />
        </View.Section>
      </UI.Theme>
    )
  }
}
