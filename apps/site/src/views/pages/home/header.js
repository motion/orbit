import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'

const headerBg = '#111'

export default () => (
  <View.Section
    css={{
      background: '#000',
      height: 880,
      position: 'relative',
      transform: {
        z: 0,
      },
    }}
  >
    <fadeDown
      css={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 500,
        background: `linear-gradient(${headerBg}, #000)`,
        zIndex: 1,
        transform: {
          z: 0,
        },
      }}
    />
    <orb
      css={{
        position: 'absolute',
        top: -1500,
        right: -1200,
        borderRadius: 1000000,
        width: 11500,
        height: 11500,
        background: Constants.colorBlue,
        // border: [10, UI.color(Constants.colorTeal).lighten(0.2)],
        transform: {
          scale: 1,
          z: 0,
        },
      }}
    />
    <orb
      css={{
        position: 'absolute',
        bottom: '-480%',
        right: '15%',
        borderRadius: 10000,
        background: headerBg,
        width: 100,
        height: 100,
        opacity: 1,
        border: [1, 'dotted', [0, 0, 0, 0.15]],
        transform: {
          scale: 100,
          rotate: '1.24deg',
          z: 0,
        },
      }}
    />
    <orb
      css={{
        position: 'absolute',
        bottom: '-489%',
        right: '15%',
        borderRadius: 10000,
        width: 100,
        height: 100,
        border: [1, 'dotted', [0, 0, 0, 0.15]],
        opacity: 0.75,
        transform: {
          scale: 100,
          rotate: '2.44deg',
          z: 0,
        },
      }}
    />

    <bottomSlant
      css={{
        zIndex: 100,
        borderTop: [1, [0, 0, 0, 0.1]],
        bottom: -360,
      }}
    />
    <bottomSlant
      css={{
        zIndex: 100,
        borderTop: [1, [0, 0, 0, 0.1]],
        bottom: -365,
        opacity: 0.75,
      }}
    />
    <bottomSlant
      css={{
        zIndex: 100,
        borderTop: [1, [0, 0, 0, 0.1]],
        bottom: -370,
        opacity: 0.5,
      }}
    />
    <bottomSlant
      css={{
        zIndex: 100,
        borderTop: [1, [0, 0, 0, 0.1]],
        bottom: -375,
        opacity: 0.25,
      }}
    />

    <header $$row>
      <View.SectionContent>
        <thing
          $$row
          css={{
            alignItems: 'center',
            padding: [10, 0],
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          <logos
            css={{
              // background: '#fff',
              alignItems: 'center',
              flexFlow: 'row',
              padding: 10,
              margin: [-10, -10, -10, -20],
            }}
          >
            <View.Icon
              fill={'#fff'}
              css={{
                height: 45,
                margin: [-10, 10, -10, -5],
              }}
            />
            <View.Logo css={{ height: 40 }} fill={'#fff'} />
          </logos>
        </thing>
      </View.SectionContent>
    </header>

    <UI.Theme name="dark">
      <View.SectionContent
        css={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <wrap>
          <View.Content padRight>
            <View.Title size={4}>
              A smart assistant for your company.
            </View.Title>

            <View.Text size={2.2}>
              Orbit is a simple, always on app that provides relevant context as
              you work.<br />
              <View.Text size={1.7} opacity={0.5}>
                Scroll down to see how it works.
              </View.Text>
              <br />
            </View.Text>

            <hr />
          </View.Content>

          <logos
            css={{
              flexFlow: 'row',
              flex: 1,
              justifyContent: 'space-around',
              margin: [40, 0, 0],
            }}
          >
            <UI.PassProps size={35} color={Constants.colorTeal} opacity={0.7}>
              <UI.Icon name="social-slack" />
              <UI.Icon name="social-github" />
              <UI.Icon name="social-google" />
              <UI.Icon name="social-dropbox" />
              <UI.Icon name="social-trello" />
              <UI.Icon name="mail" />
              <UI.Icon name="calendar" />
              <UI.Icon name="files_archive-paper" />
              <UI.Icon name="files_book" />
              <UI.Icon name="attach" />
            </UI.PassProps>
          </logos>
        </wrap>
      </View.SectionContent>
    </UI.Theme>
  </View.Section>
)
