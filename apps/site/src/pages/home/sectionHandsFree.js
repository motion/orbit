import * as React from 'react'
import * as Constants from '~/constants'
import * as View from '~/views'
import * as UI from '@mcro/ui'

export default props => (
  <UI.Theme name="dark">
    <View.Section
      dark
      css={{
        padding: [200, 0, 100],
      }}
    >
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
          <UI.Icon color={Constants.colorSecondary} size={501} name="planet" />
        </after>
        <View.Title getRef={props.setSection(1)} size={3} fontWeight={200}>
          About Orbit
        </View.Title>
        <View.Text
          size={3.5}
          fontWeight={200}
          color={UI.color(Constants.colorSecondary).lighten(0.5)}
        >
          Teamwork. It's how teams work.
        </View.Text>
        <View.Text size={3}>
          Orbit is going into private beta in December.
        </View.Text>
        <View.Text size={2}>
          <View.Link href="mailto:natewienert@gmail.com">
            Send us an email
          </View.Link>{' '}
          if you're interested.
        </View.Text>
      </View.SectionContent>
    </View.Section>
  </UI.Theme>
)
