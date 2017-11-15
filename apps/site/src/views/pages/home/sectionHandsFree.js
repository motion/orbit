import * as React from 'react'
import * as Constants from '~/constants'
import * as View from '~/views'

export default props => (
  <View.Section css={{ background: '#fff' }} padded>
    <View.SectionContent padRight padBottom>
      {!props.isSmall && (
        <img
          css={{
            position: 'absolute',
            top: -35,
            right: -370,
            transition: 'all ease-in 300ms',
            animation: 'rotate 120s infinite linear',
          }}
          src="/orbitals.svg"
        />
      )}
      <View.Title
        getRef={props.setSection(1)}
        color={Constants.colorBlue}
        size={3}
      >
        Hands-free Intelligence
      </View.Title>
      <View.Text size={2} fontWeight={600} opacity={0.5}>
        An assistant that's always there, not hidden in a tab or bot.
      </View.Text>
      <View.Text size={1.7}>
        <View.List>
          <li>
            Orbit hooks into <em>every</em> cloud service, including email and
            chat.
          </li>
          <li>
            Using machine learning, Orbit understands{' '}
            <View.Strong>when</View.Strong> to show relevant items, and
            understands "accounting paperwork" can mean "tax form".
          </li>
          <li>
            Orbit stays with you: while chatting, writing emails, updating your
            CRM, or just browsing.
          </li>
        </View.List>
      </View.Text>
    </View.SectionContent>
    <View.BottomSlant dark />
  </View.Section>
)
