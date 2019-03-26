import { Row, Theme } from '@o/gloss'
import React, { Children, useState } from 'react'
import { Button } from './buttons/Button'
import { Section } from './Section'
import { Slider } from './Slider'
import { SliderPane } from './SliderPane'
import { StatusBar } from './StatusBar'
import { SurfacePassProps } from './Surface'

export type FlowProps = {
  initialData?: any
  children: any
  renderLayout?: (props: FlowLayoutProps) => React.ReactNode
}

export type FlowLayoutProps = {
  children: React.ReactChild
  index: number
  total: number
  step: FlowStepProps
  steps: FlowStepProps[]
  setStep: (index: number) => void
  next: () => void
  prev: () => void
}

type FlowStepProps = {
  title?: string
  subTitle?: string
  children?: (props: StepChildProps) => React.ReactNode
  validateFinished?: (a: any) => true | any
}

type StepChildProps = {
  data: any
  setData: (a: any) => void
  next: () => void
}

const DefaultFlowLayout = ({ children, index, total, step, steps, setStep }) => {
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
    </Section>
  )
}

export function Flow({ renderLayout = DefaultFlowLayout, ...props }: FlowProps) {
  const [step, setStep] = useState(0)
  const [data, setDataDumb] = useState(props.initialData)
  // make it  merge by default
  const setData = x => setDataDumb({ ...data, ...x })
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
        const ChildView = step.children
        return (
          <SliderPane key={index}>
            <ChildView {...{ data, setData, next }} />
          </SliderPane>
        )
      })}
    </Slider>
  )

  return (
    <>
      {renderLayout({
        children: contents,
        index: step,
        total,
        step: steps[step],
        steps,
        setStep,
        next,
        prev,
      })}
    </>
  )
}

export function FlowStep(_props: FlowStepProps) {
  return null
}
