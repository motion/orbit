import * as React from 'react'
import * as View from '~/views'
import * as UI from '@mcro/ui'

export default props => (
  <UI.Theme name="light">
    <View.Section padded css={{ background: '#f2f2f2' }}>
      <View.BottomSlant css={{ background: '#fff' }} />
      <View.SectionContent padRight padBottom>
        <after
          css={{
            position: 'absolute',
            top: 0,
            right: -200,
            bottom: 0,
            justifyContent: 'center',
            opacity: 0.05,
          }}
        >
          <UI.Icon color="#000" size={501} name="lock" />
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
