import { Row } from 'gloss'
import React, { Children, FunctionComponent, memo, useState } from 'react'

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
  height?: number
}

type FlowStepProps = {
  title?: string
  subTitle?: string
  children?: React.ReactNode | ((props: StepState) => React.ReactNode)
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
  height?: number
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
  height,
}: FlowLayoutProps) => {
  return (
    <Section
      bordered
      padding={0}
      title={step.title}
      subTitle={step.subTitle || `${index + 1}/${total}`}
      minHeight={300}
      height={height}
      flex={1}
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
            {steps.map((stp, stepIndex) => (
              <Button
                key={stp.key}
                alt={steps[index].key === stp.key ? 'selected' : null}
                active={steps[index].key === stp.key}
                onClick={() => state.setStepIndex(stepIndex)}
              >
                {stp.title}
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

interface FlowComponent<Props> extends FunctionComponent<Props> {
  Step: FunctionComponent<FlowStepProps>
}

export const Flow: FlowComponent<FlowProps> = memo(
  ({ height, renderToolbar, renderLayout = DefaultFlowLayout, ...props }: FlowProps) => {
    const [index, setIndex] = useState(0)
    const [data, setDataDumb] = useState(props.initialData)
    // make it  merge by default
    const setData = x => setDataDumb({ ...data, ...x })
    const total = Children.count(props.children)
    const steps: FlowStep[] = Children.map(props.children, child => child.props).map(
      (child, idx) => ({
        key: `${idx}`,
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
      <Slider fixHeightToParent curFrame={index}>
        {Children.map(props.children, (child, idx) => {
          const step = child.props
          const ChildView = step.children
          return (
            <SliderPane key={idx}>
              {typeof step.children === 'function' ? <ChildView {...actions} /> : step.children}
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
          height,
        })}
      </>
    )
  },
) as any

export function FlowStep(_: FlowStepProps) {
  return null
}

Flow.Step = FlowStep
