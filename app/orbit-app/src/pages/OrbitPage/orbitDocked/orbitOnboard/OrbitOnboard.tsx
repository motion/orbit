import * as React from 'react'
import { SubPane } from '../../SubPane'
import { view, compose, sleep } from '@mcro/black'
import { Text, Button, Theme, View, Icon } from '@mcro/ui'
import { addAppClickHandler } from '../../../../helpers/addAppClickHandler'
import { AppsStore } from '../../../../stores/AppsStore'
import { PaneManagerStore } from '../../PaneManagerStore'
import { Title, VerticalSpace } from '../../../../views'
// import { getGlobalConfig } from '@mcro/config'
import { checkAuthProxy } from '../../../../helpers/checkAuthProxy'
import { promptForAuthProxy } from '../../../../helpers/promptForAuthProxy'
// import { MessageDark } from '../../../../views/Message'
import { BlurryGuys } from './BlurryGuys'
import { SimpleItem } from '../../../../views/SimpleItem'
import { OrbitIntegration, ItemType } from '../../../../integrations/types'
import { SettingStore } from '../../../../stores/SettingStore'
import { SliderPane, Slider } from '../../../../views/Slider'
import { BottomControls } from '../../../../views/BottomControls'

type Props = {
  settingStore?: SettingStore
  appsStore?: AppsStore
  paneManagerStore?: PaneManagerStore
  store?: OnboardStore
}

const framePad = 30
export const numFrames = 3
// subtract padding from parent

const Centered = view({
  margin: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
})

const Unpad = view({
  margin: [0, -framePad],
})

const AddButton = ({ disabled, ...props }) =>
  disabled ? (
    <Button chromeless disabled {...props} />
  ) : (
    <Theme theme={{ background: 'green', color: '#fff' }}>
      <Button fontWeight={700} {...props} />
    </Theme>
  )

const buttonText = ['Start Secure Auth', 'Next', 'Done!']

class OnboardStore {
  props: Props

  acceptedMessage = ''
  accepted = null
  curFrame = 0
  pendingMove = false

  async didMount() {
    console.log('mounting OrbitOnboard')
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
    this.pendingMove = true
    // before incrementing, run some actions for:
    // LEAVING curFrame page...

    if (this.curFrame === 0) {
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
      await this.props.settingStore.update({
        hasOnboarded: true,
      })
    }

    // go to next frame
    this.curFrame++
    this.pendingMove = false
  }
}

const filterApps = (app: OrbitIntegration<ItemType>) =>
  !!app.integration && app.integration !== 'website'

const decorator = compose(
  view.attach('settingStore', 'appsStore', 'paneManagerStore'),
  view.attach({
    store: OnboardStore,
  }),
  view,
)
export const OrbitOnboard = decorator(({ store, paneManagerStore, appsStore }: Props) => {
  if (paneManagerStore.activePane !== 'onboard') {
    return null
  }
  // for smart finding integrations...
  // const { foundIntegrations } = Desktop.state.onboardState
  // if (!foundIntegrations) {
  //   console.log('no found integrations...')
  //   return null
  // }
  // const { atlassian, ...rest } = foundIntegrations
  // let finalIntegrations = Object.keys(rest)
  // if (atlassian) {
  //   finalIntegrations = ['jira', 'confluence', ...finalIntegrations]
  // }
  const allAppsSorted = appsStore.allIntegrations
    .filter(filterApps)
    .sort((a, b) => a.integration.localeCompare(b.integration))
  return (
    <SubPane name="onboard" paddingLeft={0} paddingRight={0}>
      <BlurryGuys />
      <Slider curFrame={store.curFrame}>
        <SliderPane>
          {store.accepted === null && (
            <Centered>
              <br />
              <Text size={2.8} fontWeight={500}>
                Hello.
              </Text>
              <View height={10} />
              <Text size={1.75} alpha={0.5}>
                Welcome to Orbit
              </Text>
              <View height={30} />
              <Text selectable textAlign="left" size={1.1} sizeLineHeight={1.025} alpha={0.9}>
                Welcome to your personal OS. Orbit is your own tool to manage disparate information
                in a beautiful, private, extensible way.
                <VerticalSpace />
                Orbit runs 100% locally on your device and never exposes your keys or data to anyone
                but you. To do that it needs to run a secure local server to handle sensitive
                information on-device.
              </Text>
              <VerticalSpace />
              <VerticalSpace />
              <div className="markdown">
                <a href="http://tryorbit.com/security">
                  Learn about our security & privacy commitment.
                </a>
              </div>
              <VerticalSpace />
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
              <Text selectable textAlign="left" size={1.1} sizeLineHeight={0.9}>
                Orbit had a problem setting up a proxy on your machine. Feel free to get in touch
                with us if you are having issues:
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
                Success!
              </Text>
              <VerticalSpace />
              <Text size={1.5} alpha={0.5}>
                Lets set you up...
              </Text>
            </Centered>
          )}
        </SliderPane>
        {/* <SliderPane>
          <Title size={1.4} fontWeight={500}>
            Insider: unlock with email.
          </Title>

          <VerticalSpace />

          <InputRow label="Email Address" />

          <VerticalSpace />
          <VerticalSpace />
        </SliderPane> */}
        <SliderPane>
          <Title>Set up a few apps</Title>

          <VerticalSpace />

          <Unpad>
            {allAppsSorted.map(item => {
              return (
                <SimpleItem
                  key={item.integration}
                  title={item.appName}
                  icon={item.integration}
                  inactive={item.isActive}
                  onClick={item.isActive ? null : addAppClickHandler(item)}
                  after={
                    <AddButton size={0.9} disabled={item.isActive}>
                      {item.isActive ? <Icon size={16} name="check" color="green" /> : 'Add'}
                    </AddButton>
                  }
                />
              )
            })}
          </Unpad>

          <VerticalSpace />
          <VerticalSpace />
        </SliderPane>
        <SliderPane>
          <Centered>
            <Text size={2.5} fontWeight={600}>
              All set!
            </Text>
            <VerticalSpace />
            <Text size={1.5} alpha={0.5}>
              Toggle Orbit with the shortcut:
            </Text>
            <VerticalSpace />
            <VerticalSpace />
            <Text size={2.2}>Option + Space</Text>
            <VerticalSpace />
            <VerticalSpace />
            <Text size={1.5} alpha={0.5}>
              Orbit has many keyboard controls, try using your arrow keys from the home screen!
            </Text>
          </Centered>
        </SliderPane>
      </Slider>
      <BottomControls disabled={store.disableButtons}>
        {store.curFrame > 1 && (
          <Button chromeless onClick={store.prevFrame}>
            Back
          </Button>
        )}
        <View width={10} />
        <Theme name="orbit">
          <Button
            disabled={store.pendingMove}
            opacity={store.pendingMove ? 0.5 : 1}
            size={1.1}
            fontWeight={600}
            onClick={store.nextFrame}
          >
            {buttonText[store.curFrame]}
          </Button>
        </Theme>
      </BottomControls>
    </SubPane>
  )
})
