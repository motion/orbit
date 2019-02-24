import { sleep } from '@mcro/black'
import { command } from '@mcro/bridge'
import { gloss } from '@mcro/gloss'
import { useAppPackages } from '@mcro/kit'
import { CheckProxyCommand, SetupProxyCommand } from '@mcro/models'
import { Button, Icon, Slider, SliderPane, Text, Theme, Title, VerticalSpace, View } from '@mcro/ui'
import { useHook, useStore } from '@mcro/use-store'
import * as React from 'react'
import { addSourceClickHandler } from '../../helpers/addSourceClickHandler'
import { useStoresSimple } from '../../hooks/useStores'
import BlurryGuys from '../../pages/OrbitPage/BlurryGuys'
import { BottomControls } from '../../views/BottomControls'
import { SimpleItem } from '../../views/SimpleItem'

const framePad = 30
const buttonText = ['Start Local Proxy', 'Next', 'Done!']

class OnboardStore {
  stores = useHook(useStoresSimple)
  acceptedMessage = ''
  accepted = null
  curFrame = 0
  pendingMove = false

  async didMount() {
    this.accepted = await command(CheckProxyCommand)
    if (this.accepted && this.curFrame === 0) {
      this.nextFrame()
    }
  }

  get disableButtons() {
    const isShowingSuccessMessage = this.accepted && this.curFrame === 0
    return isShowingSuccessMessage
  }

  stateActions = {
    0: async () => {
      if (this.accepted !== true) {
        try {
          this.accepted = await command(SetupProxyCommand)
        } catch (err) {
          this.acceptedMessage = err
        }
        if (this.accepted) {
          // show message for a sec
          this.acceptedMessage = 'Successfully setup proxy'
          await sleep(1500)
        }
      }
    },
    1: () => {},
    2: async () => {
      this.stores.paneManagerStore.setActivePaneByType('home')
      // save setting
      await this.stores.settingStore.update({
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

export function OnboardMain() {
  const store = useStore(OnboardStore)

  // for smart finding sources...
  // const { foundSources } = Desktop.state.onboardState
  // if (!foundSources) {
  //   console.log('no found sources...')
  //   return null
  // }
  // const { atlassian, ...rest } = foundSources
  // let finalSources = Object.keys(rest)
  // if (atlassian) {
  //   finalSources = ['jira', 'confluence', ...finalSources]
  // }
  const allAppsSorted = useAppPackages().filter(x => !!x.app.sync)

  return (
    <>
      <BlurryGuys />
      <Slider curFrame={store.curFrame} framePad={30} verticalPad={50}>
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
                  key={item.id}
                  title={item.app.name}
                  icon={item.app.icon}
                  // !TODO true === item.isActive
                  inactive={true}
                  onClick={true ? null : addSourceClickHandler(item)}
                  after={
                    <AddButton size={0.9} disabled={true}>
                      {true ? <Icon size={16} name="check" color="green" /> : 'Add'}
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
        <Theme name="selected">
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
}

const Centered = gloss({
  margin: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
})

const Unpad = gloss({
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
