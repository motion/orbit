import { command, save } from '@o/kit'
import { CheckProxyCommand, SetupProxyCommand, Space, SpaceModel } from '@o/models'
import { Button, Col, Flow, gloss, Paragraph, SubTitle, Text, Title, Toolbar, useCreateFlow, useFlow, useOnMount } from '@o/ui'
import React from 'react'

import { om } from '../om/om'
import BlurryGuys from '../pages/OrbitPage/BlurryGuys'

async function checkProxy() {
  return await command(CheckProxyCommand)
}

async function validateProxy() {
  return await command(SetupProxyCommand)
}

async function finishOnboard(space: Space) {
  om.actions.router.showHomePage()
  await save(SpaceModel, {
    ...space,
    onboarded: true,
  })
}

export function OnboardApp() {
  const flow = useCreateFlow()

  useOnMount(() => {
    if (flow.index === 0) {
      let tm = setTimeout(() => {
        checkProxy().then(res => {
          res && flow.next()
        })
      }, 1000)
      return () => {
        clearTimeout(tm)
      }
    }
  })

  return (
    <>
      <BlurryGuys />
      <Col width="80%" margin="auto" height="90%">
        <Flow useFlow={flow}>
          <Flow.Step title="Proxy" validateFinished={validateProxy}>
            {OnboardStepProxy}
          </Flow.Step>
          <Flow.Step title="Workspace">{OnboardStepProxy}</Flow.Step>
          <Flow.Step validateFinished={finishOnboard}>final setp</Flow.Step>
          <OnboardToolbar />
        </Flow>
      </Col>
    </>
  )
}

function OnboardToolbar() {
  const flow = useFlow()

  const buttons = [
    <>
      <Button>hi</Button>
    </>,
  ]

  return <Toolbar size="lg">{buttons[flow.index]}</Toolbar>
}

const IntroPara = props => (
  <Paragraph textAlign="left" alpha={0.9} size={1.2} sizeLineHeight={1.025} {...props} />
)

function OnboardStepProxy() {
  return (
    <>
      {false === null && (
        <Centered space>
          <Text size={2.8} fontWeight={500}>
            Hello.
          </Text>
          <Text size={1.75} alpha={0.5}>
            Welcome to Orbit
          </Text>
          <IntroPara>Orbit is your team knowledge manager.</IntroPara>
          It gives you easy access to <b>shortcuts</b>, <b>people</b>, and <b>search</b> within your
          company without exposing any of your team data to us. To do so it runs privately each
          persons computer.
          <IntroPara>
            Orbit will set up a local proxy now to enable private sync and the access quick URLs you
            can access in your browser.
          </IntroPara>
        </Centered>
      )}
      {false === false && (
        <Centered space>
          <Title>Error setting up proxy</Title>
          <SubTitle>
            Orbit had a problem setting up a proxy on your machine. Feel free to get in touch with
            us if you are having issues:
          </SubTitle>
          <IntroPara>
            <strong>
              <a href="mailto:help@tryorbit.com">help@tryorbit.com</a>
            </strong>
          </IntroPara>
          <IntroPara>
            <strong>Error message:</strong>
          </IntroPara>
        </Centered>
      )}
      {false === true && (
        <Centered space>
          <Text size={2.2} fontWeight={600}>
            Success!
          </Text>
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
