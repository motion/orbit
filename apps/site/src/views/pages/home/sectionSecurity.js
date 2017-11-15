import * as React from 'react'
import * as View from '~/views'
import * as UI from '@mcro/ui'

export default props => (
  <UI.Theme name="dark">
    <View.Section padded dark>
      <View.BottomSlant css={{ background: '#fff' }} />
      <View.SectionContent padRight padBottom>
        <after
          css={{
            position: 'absolute',
            top: 0,
            right: -200,
            bottom: 0,
            justifyContent: 'center',
            opacity: 0.4,
          }}
        >
          <UI.Icon color="#000" size={501} name="lock" />
        </after>
        <View.Title getRef={props.setSection(2)} size={3}>
          The No-Cloud Infrastructure
        </View.Title>
        <View.Text size={2} fontWeight={600} opacity={0.7}>
          In order to work, Orbit needed to invent a new model: one that keeps
          you safe.
        </View.Text>
        <View.SubText>
          Here's the rub. To provide great context, Orbit needs to hook into a
          lot of company data to be valuable. Your Slack, email, documents,
          tasks, company knowledge.
        </View.SubText>

        <View.SubText>How can we do that completely securely?</View.SubText>

        <View.SubText>
          Answer: the data never once leaves your local computer. We never see
          it, and neither does anyone else.
        </View.SubText>
        <View.SubText>
          <View.Hl color="#000">
            This allows us to be ambitious from day one without compromise.
          </View.Hl>{' '}
          Orbit can crawl everything that's relevant to you and your team
          without fear of data breaches, permissions exposures, or the need to
          run a complicated on-prem installs.
        </View.SubText>
      </View.SectionContent>
    </View.Section>
  </UI.Theme>
)
