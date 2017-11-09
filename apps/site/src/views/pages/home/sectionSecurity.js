import * as React from 'react'
import * as View from '~/views'
import * as UI from '@mcro/ui'

export default props => (
  <UI.Theme name="dark">
    <View.Section space css={{ background: '#111', zIndex: 100000 }} padded>
      <slant
        css={{
          position: 'absolute',
          top: -50,
          background: '#111',
          left: -300,
          right: -300,
          height: 100,
          zIndex: 1200000,
          boxShadow: [[0, -10, 10, [0, 0, 0, 0.05]]],
          transform: {
            rotate: '-1deg',
          },
        }}
      />
      <bottomSlant
        css={{
          position: 'absolute',
          bottom: -50,
          background: '#111',
          left: -300,
          right: -300,
          height: 100,
          zIndex: 1200000,
          boxShadow: [[0, 20, 20, [0, 0, 0, 0.025]]],
          transform: {
            rotate: '-1deg',
          },
        }}
      />

      <View.SectionContent padRight padBottom>
        <after
          css={{
            position: 'absolute',
            top: 0,
            right: -100,
            bottom: 0,
            justifyContent: 'center',
          }}
        >
          <UI.Icon color="#fff" size={501} name="lock" />
        </after>
        <View.Title getRef={props.setSection(2)} size={3}>
          The No-Cloud Infrastructure
        </View.Title>
        <View.Text size={2.5} fontWeight={200} opacity={0.7}>
          In order to work, Orbit needed to invent a new model: one that keeps
          you safe.
        </View.Text>
        <View.SubText>
          Here's the deal. To work really well, Orbit needs to hook into a lot
          of valuable company data. Slack, email, documents, knowledge...
          everything.
        </View.SubText>

        <View.SubText>How do we do that securely?</View.SubText>

        <View.SubText>
          Our answer: your data never once leaves your local computer. Thats
          right. We never see it, and neither does anyone else but yourself.
        </View.SubText>
        <View.SubText>
          <View.Hl color="#000">
            This allows us to be ambitious from day one without compromise.
          </View.Hl>{' '}
          Our interests are aligned with yours: no data breaches, permissions
          mixups, or complicated on-premise software.
        </View.SubText>
      </View.SectionContent>
    </View.Section>
  </UI.Theme>
)
