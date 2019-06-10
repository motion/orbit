import { command, loadOne, save } from '@o/bridge'
import { createApp, useActiveDataAppsWithDefinition, useActiveSpace } from '@o/kit'
import { CheckProxyCommand, SetupProxyCommand, UserModel } from '@o/models'
import { Button, Col, Icon, List, Paragraph, Section, Slider, SliderPane, Space, SubTitle, Text, Theme, Title, View } from '@o/ui'
import { react, useStore } from '@o/use-store'
import { sleep } from '@o/utils'
import { gloss } from 'gloss'
import React from 'react'

import { installApp } from '../helpers/installApp'
import { om } from '../om/om'
import BlurryGuys from '../pages/OrbitPage/BlurryGuys'
import { BottomControls } from '../views/BottomControls'
import { appDefToListItem, useDataAppDefinitions } from './apps/AppsApp'
import { SpaceEdit } from './spaces/SpaceEdit'

export default createApp({
  id: 'onboard',
  icon: '',
  name: 'Onboard',
  app: OnboardMain,
})

const buttonText = ['Start Local Proxy', 'Next', 'Done!']

class OnboardStore {
  acceptedMessage = ''
  accepted = null
  curFrame = 0
  pendingMove = false

  mount = react(
    () => 1,
    async () => {
      this.accepted = await command(CheckProxyCommand)
      if (this.accepted && this.curFrame === 0) {
        this.nextFrame()
      }
    },
  )

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
      om.actions.router.showHomePage()
      // save setting
      const user = await loadOne(UserModel, {})
      save(UserModel, {
        ...user,
        settings: {
          ...user.settings,
          hasOnboarded: true,
        },
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
  const dataDefs = useDataAppDefinitions()
  const active = useActiveDataAppsWithDefinition()
  const isInstalled = (id: string) => active.some(x => x.definition.id === id)
  const [space] = useActiveSpace()

  return (
    <>
      <BlurryGuys />
      <Slider curFrame={store.curFrame} framePad={30} verticalPad={50}>
        <SliderPane>
          {store.accepted === null && (
            <Centered space>
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
                <Space />
                It gives you easy access to <b>shortcuts</b>, <b>people</b>, and <b>search</b>{' '}
                within your company without exposing any of your team data to us. To do so it runs
                privately each persons computer.
                <Space />
                Orbit will set up a local proxy now to enable private sync and the access quick URLs
                you can access in your browser.
              </Text>
            </Centered>
          )}
          {store.accepted === false && (
            <Centered space>
              <Title>Error setting up proxy</Title>
              <SubTitle>
                Orbit had a problem setting up a proxy on your machine. Feel free to get in touch
                with us if you are having issues:
              </SubTitle>
              <Paragraph>
                <strong>
                  <a href="mailto:help@tryorbit.com">help@tryorbit.com</a>
                </strong>
              </Paragraph>
              <Paragraph>
                <strong>Error message:</strong>
                {store.acceptedMessage}
              </Paragraph>
            </Centered>
          )}
          {store.accepted === true && (
            <Centered>
              <Text size={2.2} fontWeight={600}>
                Success!
              </Text>
              <Space />
              <Text size={1.5} alpha={0.5}>
                Lets set you up...
              </Text>
            </Centered>
          )}
        </SliderPane>
        <SliderPane>
          <Section title="Setup workspace" titleBorder titlePad pad>
            <SpaceEdit id={space.id} />
          </Section>
        </SliderPane>
        <SliderPane space>
          <Title>Add a few data apps</Title>
          <List
            itemProps={{
              iconBefore: true,
              iconSize: 36,
            }}
            items={dataDefs.map(appDefToListItem)}
            getItemProps={(_, i) => ({
              onClick: () => installApp(dataDefs[i]),
              after: (
                <AddButton size={0.9} disabled={isInstalled(dataDefs[i].id)}>
                  {isInstalled(dataDefs[i].id) ? (
                    <Icon size={16} name="tick" color="green" />
                  ) : (
                    'Add'
                  )}
                </AddButton>
              ),
            })}
          />
        </SliderPane>
        <SliderPane>
          <Centered>
            <Text size={2.5} fontWeight={600}>
              All set!
            </Text>
            <Space />
            <Text size={1.5} alpha={0.5}>
              Toggle Orbit with the shortcut:
            </Text>
            <Space />
            <Space />
            <Text size={2.2}>Option + Space</Text>
            <Space />
            <Space />
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
        <Button
          alt="action"
          disabled={store.pendingMove}
          opacity={store.pendingMove ? 0.5 : 1}
          size={1.1}
          fontWeight={600}
          onClick={store.nextFrame}
        >
          {buttonText[store.curFrame]}
        </Button>
      </BottomControls>
    </>
  )
}

const Centered = gloss(Col, {
  margin: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
})

const AddButton = ({ disabled, ...props }) =>
  disabled ? (
    <Button chromeless disabled {...props} />
  ) : (
    <Theme theme={{ background: 'green', color: '#fff' }}>
      <Button fontWeight={700} {...props} />
    </Theme>
  )
