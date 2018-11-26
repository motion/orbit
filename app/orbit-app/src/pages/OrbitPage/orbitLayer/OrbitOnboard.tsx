import * as React from 'react'
import { SubPane } from '../../../components/SubPane'
import { view, compose, sleep, attach } from '@mcro/black'
import { Text, Button, Theme, View, Icon } from '@mcro/ui'
import { addAppClickHandler } from '../../../helpers/addAppClickHandler'
import { SourcesStore } from '../../../stores/SourcesStore'
import { Title, VerticalSpace } from '../../../views'
import { BlurryGuys } from './BlurryGuys'
import { SimpleItem } from '../../../views/SimpleItem'
import { OrbitIntegration, ItemType } from '../../../sources/types'
import { SettingStore } from '../../../stores/SettingStore'
import { SliderPane, Slider } from '../../../views/Slider'
import { BottomControls } from '../../../views/BottomControls'
import { PaneManagerStore } from '../../../stores/PaneManagerStore'

type Props = {
  settingStore?: SettingStore
  sourcesStore?: SourcesStore
  paneManagerStore?: PaneManagerStore
  store?: OnboardStore
}

const framePad = 30
export const numFrames = 3

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

const buttonText = ['Start Local Proxy', 'Next', 'Done!']

class OnboardStore {
  props: Props

  acceptedMessage = ''
  accepted = null
  curFrame = 0
  pendingMove = false

  async didMount() {
    console.log('mounting OrbitOnboard')
    // todo: do we need to run https auth server here? looks so
    // await this.checkAlreadyProxied()
    if (this.accepted && this.curFrame === 0) {
      this.nextFrame()
    }
  }

  // async checkAlreadyProxied() {
  // if (await checkAuthProxy()) {
  //   this.accepted = true
  // }
  // }

  get disableButtons() {
    const isShowingSuccessMessage = this.accepted && this.curFrame === 0
    return isShowingSuccessMessage
  }

  stateActions = {
    0: async () => {
      // await this.checkAlreadyProxied()
      console.log('already on?', this.accepted)
      if (this.accepted !== true) {
        const [accepted, message] = [true, ''] // await promptForAuthProxy()
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
    },
    1: () => {},
    2: async () => {
      this.props.paneManagerStore.setActivePane('home')
      // save setting
      await this.props.settingStore.update({
        hasOnboarded: true,
      })
    },
  }

  prevFrame = () => {
    this.curFrame--
  }

  nextFrame = async () => {
    this.pendingMove = true
    await this.stateActions[this.curFrame]()
    this.curFrame++
    this.pendingMove = false
  }
}

const filterApps = (app: OrbitIntegration<ItemType>) =>
  !!app.integration && app.integration !== 'website'

const decorator = compose(
  attach('settingStore', 'sourcesStore', 'paneManagerStore'),
  attach({
    store: OnboardStore,
  }),
  view,
)
export const OrbitOnboard = decorator(({ store, paneManagerStore, sourcesStore }: Props) => {
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
  const allAppsSorted = sourcesStore.allSources
    .filter(filterApps)
    .sort((a, b) => a.integration.localeCompare(b.integration))
  return (
    <>
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
              <Text selectable textAlign="left" size={1.2} sizeLineHeight={1.025} alpha={0.9}>
                Orbit is your team knowledge manager.
                <VerticalSpace />
                It gives you easy access to <b>shortcuts</b>, <b>people</b>, and <b>search</b>{' '}
                within your company without exposing any of your team data to us. To do so it runs
                privately each persons computer.
                <VerticalSpace />
                Orbit will set up a local proxy now to enable private sync and the access quick URLs
                you can access in your browser.
              </Text>
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
        <View width={10} flex={1} />
        {store.curFrame > 1 && (
          <Button chromeless onClick={store.prevFrame}>
            Back
          </Button>
        )}
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
    </>
  )
})
