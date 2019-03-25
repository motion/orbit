import { App, AppProps, createApp, Table } from '@o/kit'
import {
  Button,
  Row,
  Section,
  Slider,
  SliderPane,
  Space,
  StatusBar,
  Theme,
  Title,
  View,
  ViewProps,
} from '@o/ui'
import React, { Children, createContext, useContext, useState } from 'react'

function CustomApp2(_props: AppProps) {
  return (
    <App>
      <Title>hi 2 2</Title>

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
          {({ data, setData, done }) => <div>hihi 22222</div>}
        </FlowStep>
      </Flow>

      <Layout type="multi-step">
        <Step key="1" title="Step 1">
          hello world
        </Step>

        <Step key="2" title="Step 2">
          hello world
        </Step>
      </Layout>

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

const DefaultFlowLayout = ({ children, index, total, step, steps, setStep }) => {
  console.log('layout', steps, index, step)
  return (
    <Section
      bordered
      title={step.title}
      subTitle={step.subTitle || `${index + 1}/${total}`}
      belowTitle={
        <Row>
          {steps.map((step, stepIndex) => (
            <Theme name={steps[index].key === step.key ? 'selected' : null}>
              <Button
                active={steps[index].key === step.key}
                key={step.key}
                onClick={() => setStep(stepIndex)}
              >
                {step.title}
              </Button>
            </Theme>
          ))}
        </Row>
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

///

type LayoutProps = {
  type?: string
  navigation?: boolean
  children?: React.ReactNode
}

const LayoutPropsContext = createContext({} as LayoutProps)

function Layout(props: LayoutProps) {
  return (
    <LayoutPropsContext.Provider value={props}>
      <View>{props.children}</View>
    </LayoutPropsContext.Provider>
  )
}

type StepProps = ViewProps & {
  title?: string
}

function Step(props: StepProps) {
  const layoutProps = useContext(LayoutPropsContext)

  if (!layoutProps.navigation) {
    return <Section {...props} />
  }

  return <View>{props.children}</View>
}
