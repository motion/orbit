import { command, createApp, createStoreContext, save, useActiveSpace } from '@o/kit'
import { CheckProxyCommand, SetupProxyCommand, Space, SpaceModel } from '@o/models'
import { Button, Card, Flow, FlowProvide, gloss, Icon, Paragraph, Scale, Stack, Text, Toolbar, useCreateFlow, useFlow, View } from '@o/ui'
import React, { useEffect } from 'react'

import { om } from '../om/om'
import BlurryGuys from '../pages/OrbitPage/BlurryGuys'
import { SpaceEdit } from './SpacesApp'

export default createApp({
  id: 'onboard',
  icon: '',
  name: 'Onboard',
  app: OnboardApp,
})

const Centered = gloss(Stack, {
  margin: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
})

class OnboardStore {
  proxyStatus: 'waiting' | 'valid' | 'error' = 'waiting'
  space: Partial<Space> = {
    name: '',
    colors: ['red', 'orange'],
  }

  async checkProxy() {
    const next = await command(CheckProxyCommand)
    this.proxyStatus = next ? 'valid' : 'error'
    return next
  }

  async setupProxy() {
    const next = await command(SetupProxyCommand)
    this.proxyStatus = next ? 'valid' : 'error'
    return next
  }

  finishOnboard = async () => {
    const space = om.state.spaces.activeSpace
    await save(SpaceModel, {
      ...space,
      onboarded: true,
    })
    om.actions.router.showAppPage({ id: 'apps' })
  }
}

const Onboard = createStoreContext(OnboardStore)

export function OnboardApp() {
  const flow = useCreateFlow({
    id: 'onboard',
  })
  const onboardStore = Onboard.useCreateStore()

  useEffect(() => {
    if (flow.index === 0) {
      onboardStore.checkProxy().then(valid => {
        valid && flow.next()
      })
    }
  }, [flow.index])

  return (
    <Onboard.ProvideStore value={onboardStore}>
      <FlowProvide value={flow}>
        <BlurryGuys />
        <Stack width="80%" maxWidth={600} margin="auto" height="80%">
          <Flow useFlow={flow}>
            <Flow.Step
              title="Welcome to Orbit"
              buttonTitle="Welcome"
              validateFinished={onboardStore.setupProxy}
            >
              {OnboardStepProxy}
            </Flow.Step>
            <Flow.Step title="Customize Workspace" buttonTitle="Workspace">
              {OnboardSetupWorkspace}
            </Flow.Step>
            <Flow.Step
              title="All finished"
              buttonTitle="Done"
              validateFinished={onboardStore.finishOnboard}
            >
              <Centered space="xl" padding="xxl" scrollable="y" flex={1}>
                <Text size="xxl">All set</Text>
                <IntroPara>To finish setup, click Finish to go to your app manager.</IntroPara>
              </Centered>
            </Flow.Step>
          </Flow>
        </Stack>
        <OnboardToolbar />
      </FlowProvide>
    </Onboard.ProvideStore>
  )
}

function OnboardToolbar() {
  const flow = useFlow()
  const onboardStore = Onboard.useStore()!

  const buttons = [
    // extra buttons
  ]

  return (
    <Scale size="lg">
      <Toolbar>
        {flow.index > 0 && <Button onClick={flow.prev}>Prev</Button>}
        <View flex={1} />
        {buttons[flow.index]}
        {flow.index < flow.total - 1 && <Button onClick={flow.next}>Next</Button>}
        {flow.index === flow.total - 1 && (
          <Button coat="action" onClick={onboardStore.finishOnboard}>
            Finish
          </Button>
        )}
      </Toolbar>
    </Scale>
  )
}

function OnboardSetupWorkspace() {
  const [space] = useActiveSpace()
  return <SpaceEdit space={space} />
}

const IntroPara = props => <Paragraph textAlign="left" alpha={0.9} size={1.2} {...props} />

function OnboardStepProxy() {
  const onboardStore = Onboard.useStore()!
  const status = setupContent[onboardStore.proxyStatus]

  return (
    <Centered space="xl" padding="xxl" scrollable="y" flex={1}>
      <Text size="xxl">Welcome to Orbit</Text>
      <IntroPara alpha={0.5}>Lets set up.</IntroPara>
      <IntroPara>
        Orbit is <b>runs entirely privately on your desktop</b>, it never sends your keys or data
        off your computer. To do this, we run a private local server:
      </IntroPara>

      <Card
        title={status.title}
        subTitle={status.subTitle}
        padding
        margin="auto"
        afterTitle={
          onboardStore.proxyStatus !== 'valid' && (
            <Button onClick={onboardStore.setupProxy} icon="refresh" iconAfter>
              Setup
            </Button>
          )
        }
        width={400}
        height={160}
        textAlign="left"
      >
        {status.children}
      </Card>
    </Centered>
  )
}

const setupContent = {
  waiting: {
    title: `Checking for existing...`,
    subTitle: `Orbit is checking if you've already set up.`,
    children: (
      <Stack flex={1} alignItems="center" justifyContent="center">
        <Icon name="time" size={32} />
      </Stack>
    ),
  },
  error: {
    title: `Not setup yet.`,
    subTitle: `Orbit had a problem setting up permissions.`,
    children: (
      <Paragraph>
        To investigate or send the error to us,{' '}
        <Button size="sm" display="inline-flex">
          open this file
        </Button>{' '}
        and send it to: <a href="mailto:help@tryorbit.com">help@tryorbit.com</a>
      </Paragraph>
    ),
  },
  valid: {
    title: `Success, your permissions are valid`,
    subTitle: `You are all set up.`,
    children: (
      <Stack flex={1} alignItems="center" justifyContent="center">
        <Icon name="tick" size={32} />
      </Stack>
    ),
  },
}
