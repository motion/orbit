import { command, createApp, createStoreContext, save, useActiveSpace } from '@o/kit'
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
  async checkProxy() {
    return await command(CheckProxyCommand)
  }

  async setupProxy() {
    return await command(SetupProxyCommand)
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
        <Col width="80%" margin="auto" height="80%">
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
        {flow.index < flow.steps.length - 1 && <Button onClick={flow.next}>Next</Button>}
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
  return (
    <Centered space="lg" pad="xxl" scrollable="y" flex={1}>
      <Text size="xxl">Welcome to Orbit</Text>
      <IntroPara alpha={0.5}>Orbit is your team knowledge manager.</IntroPara>
      <IntroPara>
        It gives you easy access to <b>shortcuts</b>, <b>people</b>, and <b>search</b> within your
        company without exposing any of your team data to us. To do so it runs privately each
        persons computer.
      </IntroPara>
      <IntroPara>
        Orbit will set up a local proxy now to enable private sync and the access quick URLs you can
        access in your browser.
      </IntroPara>
      {false === false && (
        <Card
          title="Error setting up proxy"
          subTitle="Orbit had a problem setting up a proxy on your machine."
          pad
          margin="auto"
          afterTitle={<Button onClick={onboardStore.setupProxy} icon="refresh" />}
          width={400}
          height={160}
          textAlign="left"
        >
          <Paragraph>
            To submit the error log to us,{' '}
            <Button size="sm" display="inline-flex">
              open this file
            </Button>{' '}
            and send it to: <a href="mailto:help@tryorbit.com">help@tryorbit.com</a>
          </Paragraph>
        </Card>
      )}
    </Centered>
  )
}

const Centered = gloss(Col, {
  margin: 'auto',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
})
