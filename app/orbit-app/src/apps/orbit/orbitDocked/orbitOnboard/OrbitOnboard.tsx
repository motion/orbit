import { SubPane } from '../../SubPane'
import { view, compose } from '@mcro/black'
import { Text, Button, Theme, View } from '@mcro/ui'
import { ORBIT_WIDTH } from '@mcro/constants'

const controlsHeight = 40
const numFrames = 3
// subtract padding from parent
const frameWidth = ORBIT_WIDTH - 16 * 2

const OnboardFrame = view({
  position: 'relative',
  width: frameWidth,
  height: 300,
  paddingBottom: controlsHeight,
  padding: [20, 0],
})

const Centered = view({
  margin: 'auto',
})

const Controls = view({
  flexFlow: 'row',
  position: 'absolute',
  bottom: 0,
  right: 0,
  alignItems: 'center',
})

const FrameAnimate = view({
  flexFlow: 'row',
  width: frameWidth * numFrames,
  transition: 'all ease 200ms',
})

FrameAnimate.theme = ({ curFrame }) => ({
  transform: {
    x: -frameWidth * curFrame,
  },
})

const Item = view({
  flexFlow: 'row',
  padding: [0, 10],
  height: 40,
  alignItems: 'center',
})

Item.theme = ({ theme }) => ({
  borderBottom: [1, theme.base.borderColor],
})

const ItemTitle = view({
  justifyContent: 'center',
  fontSize: 18,
  alpha: 0.5,
  flex: 1,
})

const AddButton = props => (
  <Theme name="orbit">
    <Button {...props} />
  </Theme>
)

const buttonText = ["Let's get setup", 'Looks good', 'Done!']

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
          <Centered>
            <Text size={2.5} fontWeight={600}>
              Hello
            </Text>
            <View height={10} />
            <Text size={1.5} alpha={0.5}>
              Welcome to Orbit.
            </Text>
          </Centered>
        </OnboardFrame>
        <OnboardFrame>
          <Text size={1} fontWeight={600}>
            Select integrations
          </Text>

          <Item>
            <ItemTitle>Hello world</ItemTitle>
            <AddButton>Add</AddButton>
          </Item>
        </OnboardFrame>
      </FrameAnimate>
      <Controls>
        {store.curFrame > 0 && (
          <Button chromeless onClick={store.lastFrame}>
            Back
          </Button>
        )}
        <View width={10} />
        <Theme name="orbit">
          <Button size={1.2} onClick={store.nextFrame}>
            {buttonText[store.curFrame]}
          </Button>
        </Theme>
      </Controls>
    </SubPane>
  )
})
