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

const OPTS = {
  percentFromTop: 50,
}

const lightText = UI.color(Constants.colorSecondary).lighten(0.4)
const topColor = '#444'

@view
export default class SectionExamples {
  render({ setSection, homeStore, blurred }) {
    const TOTAL_EXAMPLES = 3
    let index = -1
    const makeSection = (key, content, opts = OPTS, props) => {
      index++
      const isActive = homeStore.activeKey === key
      return (
        <View.SubTitle
          getRef={setSection(key, opts)}
          opacity={isActive ? 1 : 0.32}
          fontWeight={300}
          size={2}
          css={{
            transition: 'all ease-in 300ms',
            marginBottom: 50,
            marginTop: 50,
            marginRight: 50 + 50 * (TOTAL_EXAMPLES - index),
          }}
          {...props}
        >
          {content}
        </View.SubTitle>
      )
    }

    return (
      <UI.Theme name="dark">
        <View.SectionContent>
          <above
            css={{
              position: 'absolute',
              top: -100,
              height: 100,
              left: 0,
              right: '60%',
              textAlign: 'right',
              zIndex: 100,
              color: '#fff',
            }}
          >
            <UI.Text size={2} fontWeight={200}>
              Unify your cloud
            </UI.Text>

            <across
              $$fullscreen
              css={{
                transform: { x: '120%' },
                textAlign: 'left',
              }}
            >
              <UI.Text size={2} fontWeight={200} color="#000">
                Answers in context
              </UI.Text>
            </across>
          </above>
        </View.SectionContent>

        <View.Section>
          <View.SectionContent fullscreen>
            <View.Slant dark inverse />

            <Orbitals
              planetStyles={{
                background: '#fff',
                border: [1, '#ccc'],
              }}
              css={{
                zIndex: 0,
                top: -100,
                position: 'absolute',
                right: -800,
                left: 'auto',
                transform: { scale: 1.3 },
              }}
            />

            <inner
              css={{
                position: 'relative',
                zIndex: 3,
                padding: [100, 480, 100, 0],
              }}
            >
              <UI.Text fontWeight={600} marginBottom={20} size={1.3}>
                How it works
              </UI.Text>
              <UI.Text
                size={3}
                fontWeight={100}
                padding={[0, 80, 30, 0]}
                color={[255, 255, 255, 0.5]}
              >
                Insight as you talk to{' '}
                <span css={{ fontWeight: 600, color: '#fff' }}>teammates</span>{' '}
                &{' '}
                <span css={{ fontWeight: 600, color: '#fff' }}>customers</span>
              </UI.Text>

              <UI.Text
                if={false}
                size={2}
                padding={[10, 80, 40, 0]}
                color={lightText}
                fontWeight={200}
              >
                Some examples of how Orbit keeps you in the know:
              </UI.Text>

              <examples css={{ marginRight: -120 }}>
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
                      Michelle already wrote <Logo name="dropbox" /> some notes
                      on that last meeting.
                    </span>,
                    { percentFromTop: 63 }
                  )}
                {false &&
                  makeSection(
                    'example-5',
                    <span>
                      Be the hero in <Logo name="slack" /> #devops when you see
                      a <Logo name="github-icon" /> ticket was just opened for
                      the very issue someone just asked about.
                    </span>,
                    { percentFromTop: 70 }
                  )}
              </examples>
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
        </View.Section>
      </UI.Theme>
    )
  }
}
