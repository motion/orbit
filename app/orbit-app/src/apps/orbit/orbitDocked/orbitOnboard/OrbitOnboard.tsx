import { SubPane } from '../../SubPane'
import { view, compose } from '@mcro/black'
import { Text, Button, Theme, View } from '@mcro/ui'
import { ORBIT_WIDTH } from '@mcro/constants'

const controlsHeight = 40
const numFrames = 3
const frameWidth = ORBIT_WIDTH

const OnboardFrame = view({
  position: 'relative',
  width: frameWidth,
  height: 300,
  paddingBottom: controlsHeight,
  alignItems: 'center',
  justifyContent: 'center',
})

const Controls = view({
  flexFlow: 'row',
  position: 'absolute',
  bottom: 0,
  right: 0,
  alignItems: 'center',
})

const FrameAnimate = view({
  margin: [0, -16],
  flexFlow: 'row',
  width: frameWidth * numFrames,
  transition: 'all ease-in 300ms',
})

FrameAnimate.theme = ({ curFrame }) => ({
  transform: {
    x: -frameWidth * curFrame,
  },
})

const decorator = compose(
  view.attach({
    store: class {
      curFrame = 0
      nextFrame = () => this.curFrame++
      lastFrame = () => this.curFrame--
    },
  }),
)

export const OrbitOnboard = decorator(({ store }) => {
  return (
    <SubPane name="onboard">
      <FrameAnimate curFrame={store.curFrame}>
        <OnboardFrame>
          <Text size={2.5} fontWeight={600}>
            Hello
          </Text>
          <View height={10} />
          <Text size={1.5} alpha={0.5}>
            Welcome to Orbit.
          </Text>
        </OnboardFrame>
      </FrameAnimate>
      <Controls>
        <Button chromeless onClick={store.lastFrame}>
          Back
        </Button>
        <View width={10} />
        <Theme name="orbit">
          <Button size={1.2} onClick={store.nextFrame}>
            Let's get setup
          </Button>
        </Theme>
      </Controls>
    </SubPane>
  )
})
