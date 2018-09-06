import * as React from 'react'
import { SubPane } from '../../SubPane'
import { view, compose, sleep } from '@mcro/black'
import { Text, Button, Theme, View, Icon } from '@mcro/ui'
import { ORBIT_WIDTH } from '@mcro/constants'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { Desktop } from '@mcro/stores'
import { NICE_INTEGRATION_NAMES } from '../../../../constants'
import { addIntegrationClickHandler } from '../../../../helpers/addIntegrationClickHandler'
import { IntegrationSettingsStore } from '../../../../stores/IntegrationSettingsStore'
import { SettingRepository } from '../../../../repositories'
import { PaneManagerStore } from '../../PaneManagerStore'
import { Title, VerticalSpace } from '../../../../views'
// import { getGlobalConfig } from '@mcro/config'
import { checkAuthProxy } from '../../../../helpers/checkAuthProxy'
import { promptForAuthProxy } from '../../../../helpers/promptForAuthProxy'
// import { MessageDark } from '../../../../views/Message'
import { GeneralSettingValues } from '@mcro/models'

type Props = {
  integrationSettingsStore?: IntegrationSettingsStore
  paneManagerStore?: PaneManagerStore
  store?: OnboardStore
}

const sidePad = 16
const controlsHeight = 50
const framePad = 30
const numFrames = 3
// subtract padding from parent
const frameWidth = ORBIT_WIDTH - sidePad * 2

const OnboardFrame = view({
  position: 'relative',
  width: frameWidth,
  minHeight: 300,
  padding: [20, framePad, 20 + controlsHeight],
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
  bottom: 15,
  right: 0,
  alignItems: 'center',
  disabled: {
    pointerEvents: 'none',
    filter: 'grayscale(100%)',
    opacity: 0.8,
  },
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
  margin: [0, -sidePad - framePad],
})

const Item = view({
  flexFlow: 'row',
  padding: [0, sidePad + 4],
  height: 42,
  alignItems: 'center',
  inactive: {
    opacity: 0.5,
    filter: 'grayscale(0.5)',
  },
  '&:hover': {
    background: [0, 0, 0, 0.05],
  },
})

Item.theme = ({ theme }) => ({
  borderBottom: [1, theme.borderColor.alpha(0.2)],
})

const ItemTitle = props => (
  <Text
    {...{
      fontWeight: 400,
      padding: [0, 12],
      justifyContent: 'center',
      fontSize: 15,
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

const buttonText = ['Start Proxy', 'Next', 'Done!']

class OnboardStore {
  props: Props

  acceptedMessage = ''
  accepted = null
  curFrame = 0

  async didMount() {
    await this.checkAlreadyProxied()
    if (this.accepted && this.curFrame === 0) {
      this.nextFrame()
    }
  }

  async checkAlreadyProxied() {
    if (await checkAuthProxy()) {
      this.accepted = true
    }
  }

  get disableButtons() {
    const isShowingSuccessMessage = this.accepted && this.curFrame === 0
    return isShowingSuccessMessage
  }

  prevFrame = () => this.curFrame--
  nextFrame = async () => {
    // before incrementing, run some actions for:
    // LEAVING curFrame page...

    if (this.curFrame === 0) {
      console.log('start proxy')
      await this.checkAlreadyProxied()
      console.log('already on?', this.accepted)
      if (this.accepted !== true) {
        const { accepted, message } = await promptForAuthProxy()
        console.log('got from prompt', accepted, message)
        this.accepted = accepted
        this.acceptedMessage = message
        if (accepted) {
          // show message for a sec
          await sleep(1500)
          if (this.curFrame !== 0) {
            return
          }
        } else {
          console.log('not accepting, not advancing frame...')
          return
        }
      }
    }

    if (this.curFrame === 2) {
      this.props.paneManagerStore.setActivePane('home')
      this.props.paneManagerStore.forceOnboard = false
      // save setting
      const generalSetting = await SettingRepository.findOne({
        where: {
          type: 'general',
          category: 'general',
        },
      })
      const values = generalSetting.values as GeneralSettingValues
      values.hasOnboarded = true
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
            {store.accepted === null && (
              <Centered>
                <br />
                <Text size={3.2} fontWeight={600}>
                  Hello,
                </Text>
                <View height={10} />
                <Text size={1.75} alpha={0.5}>
                  Welcome to Orbit
                </Text>
                <View height={30} />
                <Text
                  textAlign="left"
                  fontSize={27}
                  lineHeight={35}
                  alpha={0.9}
                >
                  Orbit is the first ever search platform built{' '}
                  <strong>for&nbsp;you</strong>.<VerticalSpace />
                  It's completely private. Your keys and data are only ever
                  stored and accessed privately on your computer.
                </Text>
                <VerticalSpace />
                <Text textAlign="left">
                  To pull that off Orbit will run a secure proxy on your
                  computer.
                </Text>
                <VerticalSpace />
                <div className="markdown">
                  <a href="http://tryorbit.com/security">
                    Our absolute commitment to security.
                  </a>
                </div>
                <VerticalSpace />
                <VerticalSpace />
                <VerticalSpace />
              </Centered>
            )}
            {store.accepted === false && (
              <Centered>
                <Text size={1.5} alpha={0.5}>
                  Error setting up proxy
                </Text>
                <View height={20} />
                <Text
                  selectable
                  textAlign="left"
                  size={1.1}
                  sizeLineHeight={0.9}
                >
                  Orbit had a problem setting up a proxy on your machine. Feel
                  free to get in touch with us if you are having issues:
                  <br />
                  <br />
                  <strong>
                    <a href="mailto:help@tryorbit.com">help@tryorbit.com</a>
                  </strong>
                  .<br />
                  <br />
                  <strong>Error message:</strong>
                  <br />
                  <br />
                  {store.acceptedMessage}
                </Text>
              </Centered>
            )}
            {store.accepted === true && (
              <Centered>
                <Text size={2.2} fontWeight={600}>
                  Success
                </Text>
                <View height={5} />
                <Text size={1.5} alpha={0.5} width="80%">
                  Orbit was able to set up a private server to handle your
                  authentication.
                </Text>
                <View height={25} />
                <Text size={1.5} alpha={0.5} width="80%">
                  Now, let's get you set up.
                </Text>
              </Centered>
            )}
          </OnboardFrame>
          <OnboardFrame>
            <Title size={1.2} fontWeight={600}>
              Set up a few apps
            </Title>

            <Text>You can add a few apps now to get started.</Text>

            <View height={15} />
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
                    <AddButton size={0.9} disabled={item.added}>
                      {item.added ? (
                        <Icon size={16} name="check" color="green" />
                      ) : (
                        'Add'
                      )}
                    </AddButton>
                  </Item>
                )
              })}
            </Unpad>
            <VerticalSpace />

            {/* <MessageDark style={{ textAlign: 'center' }}>
              <Text size={1.2}>Orbit Proxy Active!</Text>
            </MessageDark> */}
          </OnboardFrame>
          <OnboardFrame>
            <Centered>
              <Text size={2.5} fontWeight={600}>
                All set!
              </Text>
              <View height={20} />
              <Text size={1.5} alpha={0.5}>
                Orbit is now creating an index of things and people from across
                your cloud.
              </Text>
            </Centered>
          </OnboardFrame>
        </FrameAnimate>
        <Controls disabled={store.disableButtons}>
          {store.curFrame > 1 && (
            <Button chromeless onClick={store.prevFrame}>
              Back
            </Button>
          )}
          <View width={10} />
          <Theme name="orbit">
            <Button size={1.1} fontWeight={600} onClick={store.nextFrame}>
              {buttonText[store.curFrame]}
            </Button>
          </Theme>
        </Controls>
      </SubPane>
    )
  },
)
