import { command, useStore } from '@o/kit'
import { CheckProxyCommand } from '@o/models'
import { Col, Flow, gloss, Paragraph, Space, SubTitle, Text, Title, useCreateFlow, useOnMount, View } from '@o/ui'
import React from 'react'

import BlurryGuys from '../pages/OrbitPage/BlurryGuys'

export function OnboardApp() {
  const onboardStore = useStore(OnboardStore)
  const flow = useCreateFlow()

  useOnMount(async () => {
    if (await onboardStore.checkProxy()) {
      flow.next()
    }
  })

  return (
    <>
      <BlurryGuys />
      <Col width="80%" margin="auto" height="90%">
        <Flow useFlow={flow}>
          <Flow.Step title="Proxy" validateFinished={() => command(CheckProxyCommand)}>
            {OnboardStepProxy}
          </Flow.Step>
          <Flow.Step title="Workspace">{OnboardStepProxy}</Flow.Step>
        </Flow>
      </Col>
    </>
  )
}

function OnboardStepProxy() {
  return (
    <>
      {false === null && (
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
            It gives you easy access to <b>shortcuts</b>, <b>people</b>, and <b>search</b> within
            your company without exposing any of your team data to us. To do so it runs privately
            each persons computer.
            <Space />
            Orbit will set up a local proxy now to enable private sync and the access quick URLs you
            can access in your browser.
          </Text>
        </Centered>
      )}
      {false === false && (
        <Centered space>
          <Title>Error setting up proxy</Title>
          <SubTitle>
            Orbit had a problem setting up a proxy on your machine. Feel free to get in touch with
            us if you are having issues:
          </SubTitle>
          <Paragraph>
            <strong>
              <a href="mailto:help@tryorbit.com">help@tryorbit.com</a>
            </strong>
          </Paragraph>
          <Paragraph>
            <strong>Error message:</strong>
          </Paragraph>
        </Centered>
      )}
      {false === true && (
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
    </>
  )
}

const Centered = gloss(Col, {
  margin: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
})

class OnboardStore {
  acceptedMessage = ''
  accepted = null
  pendingMove = false

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
