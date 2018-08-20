import { SubPane } from '../../SubPane'
import { view, compose } from '@mcro/black'
import { Text, Button, Theme, View } from '@mcro/ui'
import { ORBIT_WIDTH } from '@mcro/constants'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { Desktop, App } from '@mcro/stores'
import { NICE_INTEGRATION_NAMES } from '../../../../constants'
import { addIntegrationClickHandler } from '../../../../helpers/addIntegrationClickHandler'
import { IntegrationSettingsStore } from '../../../../stores/IntegrationSettingsStore'
import { generalSettingQuery } from '../../../../repositories/settingQueries'
import { SettingRepository } from '../../../../repositories'
import { PaneManagerStore } from '../../PaneManagerStore'

type Props = {
  integrationSettingsStore?: IntegrationSettingsStore
  paneManagerStore?: PaneManagerStore
  store?: OnboardStore
}

const sidePad = 16
const controlsHeight = 40
const numFrames = 3
// subtract padding from parent
const frameWidth = ORBIT_WIDTH - sidePad * 2

const OnboardFrame = view({
  position: 'relative',
  width: frameWidth,
  minHeight: 300,
  padding: [20, 30, 20 + controlsHeight],
})

const Centered = view({
  margin: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
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
  '& > div': {
    transition: 'all ease-in 500ms',
    opacity: 0,
  },
  [`& > div:nth-child(${curFrame + 1})`]: {
    opacity: 1,
  },
  transform: {
    x: -frameWidth * curFrame,
  },
})

const Unpad = view({
  margin: [0, -sidePad],
})

const Item = view({
  flexFlow: 'row',
  padding: [0, sidePad + 4],
  height: 56,
  alignItems: 'center',
  inactive: {
    opacity: 0.5,
    filter: 'grayscale(1)',
  },
  '&:hover': {
    background: [0, 0, 0, 0.05],
  },
})

Item.theme = ({ theme }) => ({
  borderBottom: [1, theme.base.borderColor.alpha(0.2)],
})

const ItemTitle = props => (
  <Text
    {...{
      fontWeight: 600,
      padding: [0, 12],
      justifyContent: 'center',
      fontSize: 16,
      flex: 1,
    }}
    {...props}
  />
)

const AddButton = ({ disabled, ...props }) =>
  disabled ? (
    <Button chromeless disabled {...props} />
  ) : (
    <Theme theme="green">
      <Button fontWeight={700} {...props} />
    </Theme>
  )

const buttonText = ['Next', 'Looks good', 'Done!']

class OnboardStore {
  props: Props

  curFrame = 0
  lastFrame = () => this.curFrame--

  nextFrame = async () => {
    // before incrementing, run some actions for:
    // LEAVING curFrame page...

    if (this.curFrame === 1) {
      // await acceptsforwarding...
      // App.setState({ acceptsForwarding: true })
    }

    if (this.curFrame === 2) {
      console.log('cur frame now...')
      this.props.paneManagerStore.forceOnboard = false
      // save setting
      const generalSetting = await generalSettingQuery()
      generalSetting.values.hasOnboarded = true
      await SettingRepository.save(generalSetting)
    }

    // go to next frame
    this.curFrame++
  }
}

const decorator = compose(
  view.attach('integrationSettingsStore', 'paneManagerStore'),
  view.attach({
    store: OnboardStore,
  }),
  view,
)

export const OrbitOnboard = decorator(
  ({ store, integrationSettingsStore }: Props) => {
    const { foundIntegrations } = Desktop.state.onboardState
    if (!foundIntegrations) {
      console.log('no found integrations...')
      return null
    }
    const { atlassian, ...rest } = foundIntegrations
    let finalIntegrations = Object.keys(rest)
    if (atlassian) {
      finalIntegrations = ['jira', 'confluence', ...finalIntegrations]
    }
    const integrations = finalIntegrations.map(integration => {
      return {
        id: integration,
        title: NICE_INTEGRATION_NAMES[integration],
        auth: /jira|conflunce/.test(integration),
        added: !!(integrationSettingsStore.settingsList || []).find(
          x => x.type === integration,
        ),
      }
    })
    return (
      <SubPane name="onboard">
        <FrameAnimate curFrame={store.curFrame}>
          <OnboardFrame>
            <Centered>
              <Text size={2.5} fontWeight={600}>
                Hello
              </Text>
              <View height={5} />
              <Text size={1.5} alpha={0.5}>
                Welcome to Orbit
              </Text>
              <View height={20} />
              <Text textAlign="left" size={1.1} sizeLineHeight={0.9}>
                Orbit is the first ever completely private search and app
                platform. To work, it needs to proxy our OAuth keys on your
                machine. Learn how this Orbit privacy works, and hit "Next" to
                enter password for this.
              </Text>
            </Centered>
          </OnboardFrame>
          <OnboardFrame>
            <Text size={1.2} fontWeight={600}>
              Select apps
            </Text>
            <Text>
              You can always set these up and add multiple apps through the
              store later, but it's nice to get a few working.
            </Text>
            <View height={10} />
            <Unpad>
              {integrations.map(item => {
                return (
                  <Item
                    key={item.id}
                    inactive={item.added}
                    onClick={
                      item.added ? null : addIntegrationClickHandler(item)
                    }
                  >
                    <OrbitIcon size={18} icon={item.id} />
                    <ItemTitle>{item.title}</ItemTitle>
                    <AddButton disabled={item.added}>
                      {item.added ? 'Added!' : 'Add'}
                    </AddButton>
                  </Item>
                )
              })}
            </Unpad>
          </OnboardFrame>
          <OnboardFrame>
            <Centered>
              <Text size={2.5} fontWeight={600}>
                All set!
              </Text>
              <View height={10} />
              <Text size={1.5} alpha={0.5}>
                Orbit will scan your integrations and create an index. It
                creates profiles of people it sees from across different
                integrations.
              </Text>
            </Centered>
          </OnboardFrame>
        </FrameAnimate>
        <Controls>
          {store.curFrame > 1 && (
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
  },
)
