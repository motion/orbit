import { command, createApp, createStoreContext, save, useActiveSpace, themes } from '@o/kit'
import { CheckProxyCommand, SetupProxyCommand, Space, SpaceModel } from '@o/models'
import {
  Button,
  Card,
  Col,
  Flow,
  FlowProvide,
  gloss,
  Paragraph,
  Scale,
  Text,
  Toolbar,
  useCreateFlow,
  useFlow,
  useOnMount,
  View,
  Title,
  Icon,
} from '@o/ui'
import React from 'react'

import { om } from '../om/om'
import BlurryGuys from '../pages/OrbitPage/BlurryGuys'
import { SpaceEdit } from './spaces/SpaceEdit'

export default createApp({
  id: 'onboard',
  icon: '',
  name: 'Onboard',
  app: OnboardApp,
})

class OnboardStore {
  proxyStatus: 'waiting' | 'valid' | 'error' = 'waiting'

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

  async finishOnboard(space: Space) {
    om.actions.router.showHomePage()
    await save(SpaceModel, {
      ...space,
      onboarded: true,
    })
  }
}

const Onboard = createStoreContext(OnboardStore)

export function OnboardApp() {
  const flow = useCreateFlow()
  const onboardStore = Onboard.useCreateStore()

  useOnMount(async () => {
    if (flow.index === 0) {
      const valid = await onboardStore.checkProxy()
      valid && flow.next()
    }
  })

  return (
    <Onboard.SimpleProvider value={onboardStore}>
      <FlowProvide value={flow}>
        <BlurryGuys />
        <Col width="80%" maxWidth={600} margin="auto" height="80%">
          <Flow useFlow={flow}>
            <Flow.Step title="Welcome" validateFinished={onboardStore.setupProxy}>
              {OnboardStepProxy}
            </Flow.Step>
            <Flow.Step title="Workspace">{OnboardSetupWorkspace}</Flow.Step>
            <Flow.Step title="Tutorial" validateFinished={onboardStore.finishOnboard}>
              final setp
            </Flow.Step>
          </Flow>
        </Col>
        <OnboardToolbar />
      </FlowProvide>
    </Onboard.SimpleProvider>
  )
}

function OnboardToolbar() {
  const flow = useFlow()

  const buttons = [<>ok</>]

  return (
    <Scale size="lg">
      <Toolbar>
        {flow.index > 0 && <Button onClick={flow.prev}>Prev</Button>}
        <View flex={1} />
        {buttons[flow.index]}
        {flow.index < flow.total - 1 && <Button onClick={flow.next}>Next</Button>}
      </Toolbar>
    </Scale>
  )
}

function OnboardSetupWorkspace() {
  const [space] = useActiveSpace()
  return <SpaceEdit id={space.id} />
}

const IntroPara = props => <Paragraph textAlign="left" alpha={0.9} size={1.2} {...props} />

function OnboardStepProxy() {
  const onboardStore = Onboard.useStore()
  const status = setupContent[onboardStore.proxyStatus]

  return (
    <Centered space="xl" pad="xxl" scrollable="y" flex={1}>
      <Text size="xxl">Welcome to Orbit</Text>
      <IntroPara alpha={0.5}>Orbit is a private app platform.</IntroPara>
      <IntroPara>
        Orbit lowers the bar to building apps in many ways. It makes it easy to build them, easy to
        plug in data, and easy to then collaborate on them with your team.
      </IntroPara>
      <IntroPara>
        Importantly, Orbit is <b>fully open source and runs entirely privately on your desktop</b>,
        not in the cloud. To do this, it runs a private local server that acts as your own
        authentication handler.
      </IntroPara>

      <View height={10} />

      <Title size="sm">Set up permissions</Title>

      <Card
        title={status.title}
        subTitle={status.subTitle}
        pad
        margin="auto"
        afterTitle={
          onboardStore.proxyStatus !== 'valid' && (
            <Button onClick={onboardStore.setupProxy} icon="refresh" />
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
      <Col flex={1} alignItems="center" justifyContent="center">
        <Icon name="time" size={32} />
      </Col>
    ),
  },
  error: {
    title: `Error setting up permissions`,
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
      <Col flex={1} alignItems="center" justifyContent="center">
        <Icon name="tick" size={32} />
      </Col>
    ),
  },
}

const Centered = gloss(Col, {
  margin: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
})
