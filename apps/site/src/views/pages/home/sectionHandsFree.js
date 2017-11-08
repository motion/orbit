import * as React from 'react'
import * as Constants from '~/constants'
import * as View from '~/views'
import * as UI from '@mcro/ui'

export default props => (
  <UI.Theme name="dark">
    <View.Section
      space
      padded
      css={{
        background: `linear-gradient(to left, #7A52B9, #8D6BC3)`,
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
          <UI.Icon
            color={Constants.colorSecondary}
            size={501}
            name="travel_jellyfish"
          />
        </after>
        <View.Title getRef={props.setSection(1)} size={3} fontWeight={200}>
          As you work
        </View.Title>
        <View.Text
          size={4}
          fontWeight={100}
          color={UI.color(Constants.colorSecondary).lighten(0.5)}
        >
          Always on: no browser tab to lose, no bot you don't know how to use.
        </View.Text>
        <View.Text size={2} opacity={0.8}>
          Orbit is there with you, whether you're writing a Google doc, reading
          a new email, or chatting with a co-worker.
        </View.Text>
      </View.SectionContent>
    </View.Section>
  </UI.Theme>
)
