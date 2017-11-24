import * as React from 'react'
import * as View from '~/views'
import * as UI from '@mcro/ui'

const background = '#ffeb72'
const bgLight = UI.color(background) //.lighten(0.15)
const colorLight = bgLight.lighten(0.05) //.lighten(0.15)
const colorDark = bgLight.darken(0.75)

export default props => (
  <UI.Theme name="light">
    <View.Section
      css={{
        background,
        zIndex: 100000,
        padding: [140, 0],
        boxShadow: [[0, 0, 100, [0, 0, 0, 0.2]]],
        width: '105%',
        margin: [-50, '-2.5%'],
        overflow: 'visible',
        transform: {
          rotate: '-2deg',
        },
      }}
    >
      <View.SectionContent
        css={{
          paddingRight: 400,
          transform: {
            rotate: '2deg',
          },
        }}
      >
        <after
          css={{
            position: 'absolute',
            top: 0,
            right: -100,
            bottom: 0,
            justifyContent: 'center',
          }}
        >
          <UI.Icon
            color={colorLight}
            opacity={0.8}
            size={480}
            name="lock"
            css={{ textShadow: `0 0 1px #000` }}
          />
        </after>
        <View.Title getRef={props.setSection(2)} size={1.7} color={colorDark}>
          The No-Cloud Infrastructure
        </View.Title>
        <View.Text size={3.5} fontWeight={200} opacity={0.7} color={colorDark}>
          In order to work well, we invented a new model: one that keeps you
          safe.
        </View.Text>

        <View.Text size={2} fontWeight={200}>
          Your data is yours, we never touch it.
        </View.Text>
        <View.Text size={2} fontWeight={200}>
          <span css={{ background: [255, 255, 255, 0.055], padding: 3 }}>
            This allows us to be ambitious from day one without compromise.
          </span>{' '}
          Our interests are aligned with yours: no data breaches, permissions
          mixups, or complicated on-premise software.
        </View.Text>
      </View.SectionContent>
    </View.Section>
  </UI.Theme>
)
