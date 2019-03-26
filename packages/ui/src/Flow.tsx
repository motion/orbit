import { Row } from '@o/gloss'
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
  renderToolbar?: (props: StepState) => React.ReactNode
}

type FlowStepProps = {
  title?: string
  subTitle?: string
  children?: (props: StepState) => React.ReactNode
  validateFinished?: (a: any) => true | any
}

type FlowStep = FlowStepProps & {
  key: string
}

export type FlowLayoutProps = {
  renderToolbar: FlowProps['renderToolbar']
  children: React.ReactChild
  index: number
  total: number
  step: FlowStep
  steps: FlowStep[]
  state: StepState
}

type StepState = {
  data: any
  setData: (a: any) => void
  next: () => void
  prev: () => void
  setStepIndex: (index: number) => void
}

const DefaultFlowLayout = ({
  renderToolbar,
  children,
  index,
  total,
  step,
  steps,
  state,
}: FlowLayoutProps) => {
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
              <Button
                key={step.key}
                alt={steps[index].key === step.key ? 'selected' : null}
                active={steps[index].key === step.key}
                onClick={() => state.setStepIndex(stepIndex)}
              >
                {step.title}
              </Button>
            ))}
          </Row>
        </SurfacePassProps>
      }
      afterTitle={
        renderToolbar ? (
          <Row height="100%" alignItems="center">
            {renderToolbar(state)}
          </Row>
        ) : null
      }
      below={<StatusBar>helloworld</StatusBar>}
    >
      {children}
    </Section>
  )
}

export function Flow({ renderToolbar, renderLayout = DefaultFlowLayout, ...props }: FlowProps) {
  const [index, setIndex] = useState(0)
  const [data, setDataDumb] = useState(props.initialData)
  // make it  merge by default
  const setData = x => setDataDumb({ ...data, ...x })
  const total = Children.count(props.children)
  const steps: FlowStep[] = Children.map(props.children, child => child.props).map(
    (child, index) => ({
      key: `${index}`,
      ...child,
    }),
  )
  const next = () => setIndex(Math.min(total - 1, index + 1))
  const prev = () => setIndex(Math.max(0, index - 1))
  const actions = {
    data,
    setData,
    next,
    prev,
    setStepIndex: setIndex,
  }

  const contents = (
    <Slider curFrame={index}>
      {Children.map(props.children, (child, index) => {
        const step = child.props
        if (typeof step.children !== 'function') {
          throw new Error(`Must provide a function as the child of FlowStep`)
        }
        const ChildView = step.children
        return (
          <SliderPane key={index}>
            <ChildView {...actions} />
          </SliderPane>
        )
      })}
    </Slider>
  )

  return (
    <>
      {renderLayout({
        renderToolbar,
        children: contents,
        index: index,
        total,
        step: steps[index],
        steps,
        state: actions,
      })}
    </>
  )
}

export function FlowStep(_props: FlowStepProps) {
  return null
}
