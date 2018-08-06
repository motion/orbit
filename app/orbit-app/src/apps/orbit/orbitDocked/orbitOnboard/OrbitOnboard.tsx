import { SubPane } from '../../SubPane'
import { view } from '@mcro/black'
import { Text, Button, Theme, View } from '@mcro/ui'

const controlsHeight = 40

const OnboardFrame = view({
  height: 300,
  paddingBottom: controlsHeight,
  alignItems: 'center',
  justifyContent: 'center',
})

const Controls = view({
  position: 'absolute',
  bottom: 0,
  right: 0,
})

export const OrbitOnboard = () => {
  return (
    <SubPane name="onboard">
      <OnboardFrame>
        <Text size={2.5} fontWeight={600}>
          Hello
        </Text>
        <View height={10} />
        <Text size={1.5} alpha={0.5}>
          Welcome to Orbit.
        </Text>

        <Controls>
          <Theme name="orbit">
            <Button size={1.2}>Let's get setup</Button>
          </Theme>
        </Controls>
      </OnboardFrame>
    </SubPane>
  )
}
