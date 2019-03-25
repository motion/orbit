import { App, AppProps, createApp, List, OrbitListItemProps, Table } from '@o/kit'
import {
  Button,
  Loading,
  Row,
  Section,
  Slider,
  SliderPane,
  Space,
  StatusBar,
  SurfacePassProps,
  Theme,
  Title,
  View,
} from '@o/ui'
import React, { Children, useState } from 'react'

function CustomApp2(_props: AppProps) {
  return (
    <App>
      <Flow
        initialData={{
          test: 1,
        }}
      >
        <FlowStep
          title="Step 1"
          subTitle="Select your thing"
          validateFinished={data => {
            return {
              field1: false,
            }
          }}
        >
          {({ data, setData, done }) => (
            <Table
              searchable
              showSearchBar
              rows={[{ title: 'Hello world' }, { title: 'Hello world' }, { title: 'Hello world' }]}
            />
          )}
        </FlowStep>

        <FlowStep title="Step 2" subTitle="Select other thing">
          {({ data, setData, done }) => (
            <MasterDetail
              items={[
                { title: 'Something', group: 'Hello', icon: 'test', subtitle: 'hello' },
                { title: 'Something', group: 'Hello', icon: 'smoe', subtitle: 'hello' },
                { title: 'Something', group: 'Hello', icon: 'hi', subtitle: 'hello' },
                { title: 'Something', group: 'Hello', icon: 'aos', subtitle: 'hello' },
                { title: 'Something', group: 'Hello', icon: 'dn', subtitle: 'hello' },
              ]}
            >
              {selected => (!selected ? <Loading /> : <Title>{selected.title}</Title>)}
            </MasterDetail>
          )}
        </FlowStep>
      </Flow>
      {/* <GridLayout>
        <GridItem>hello 1234</GridItem>
      </GridLayout> */}
    </App>
  )
}

export default createApp({
  id: 'custom2',
  name: 'Custom App 2',
  icon: '',
  app: CustomApp2,
})

///

type MasterDetailProps = {
  items: OrbitListItemProps[]
  children: (selected: OrbitListItemProps) => React.ReactNode
}

function MasterDetail(props: MasterDetailProps) {
  const [selected, setSelected] = useState(null)
  return (
    <Row>
      <View flex={1}>
        <List
          items={props.items}
          onSelect={index => setSelected(props.items[index])}
          itemProps={{ iconBefore: true }}
        />
      </View>
      <View overflow="hidden" flex={2} position="relative">
        {props.children(selected)}
      </View>
    </Row>
  )
}

///

const DefaultFlowLayout = ({ children, index, total, step, steps, setStep }) => {
  console.log('layout', steps, index, step)
  return (
    <Section
      bordered
      padding={0}
      title={step.title}
      subTitle={step.subTitle || `${index + 1}/${total}`}
      belowTitle={
        <SurfacePassProps
          background="transparent"
          borderWidth={0}
          glint={false}
          borderBottom={[3, 'transparent']}
          borderColor={(theme, props) => (props.active ? theme.borderColor : null)}
          sizeRadius={0}
          sizePadding={1.5}
        >
          <Row>
            {steps.map((step, stepIndex) => (
              <Theme key={step.key} name={steps[index].key === step.key ? 'selected' : null}>
                <Button active={steps[index].key === step.key} onClick={() => setStep(stepIndex)}>
                  {step.title}
                </Button>
              </Theme>
            ))}
          </Row>
        </SurfacePassProps>
      }
      below={<StatusBar>helloworld</StatusBar>}
    >
      {children}
      <Space />
      <Space />
      <Space />
      <Space />
      <Space />
      <Space />
      <Space />
    </Section>
  )
}

function Flow({ renderLayout = DefaultFlowLayout, ...props }: any) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState(props.initialData)
  const total = Children.count(props.children)
  const steps = Children.map(props.children, child => child.props).map((child, index) => ({
    key: `${index}`,
    ...child,
  }))
  const next = () => setStep(Math.min(total - 1, step + 1))
  const prev = () => setStep(Math.max(0, step - 1))

  const contents = (
    <Slider curFrame={step}>
      {Children.map(props.children, (child, index) => {
        const step = child.props
        if (typeof step.children !== 'function') {
          throw new Error(`Must provide a function as the child of FlowStep`)
        }
        return <SliderPane key={index}>{step.children({ data, setData, next })}</SliderPane>
      })}
    </Slider>
  )

  return renderLayout({
    children: contents,
    index: step,
    total,
    step: steps[step],
    steps,
    setStep,
    next,
    prev,
  })
}

function FlowStep(_props: any) {
  return null
}
