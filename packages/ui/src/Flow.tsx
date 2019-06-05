import { createStoreContext } from '@o/use-store'
import React, { Children, FunctionComponent, memo, useEffect, useState } from 'react'

import { Button } from './buttons/Button'
import { Section, SectionProps } from './Section'
import { Slider } from './Slider'
import { SliderPane } from './SliderPane'
import { SurfacePassProps } from './Surface'
import { Row } from './View/Row'

type FlowSectionProps = Pick<SectionProps, 'afterTitle'>

export type FlowPropsBase = FlowSectionProps & {
  children: any
  renderLayout?: (props: FlowLayoutProps) => React.ReactNode
  Toolbar?: FunctionComponent<FlowLayoutProps>
  height?: number
}

export type FlowDataProps = {
  initialData?: any
}

export type FlowProps =
  | FlowPropsBase & FlowDataProps
  | FlowPropsBase & {
      useFlow: FlowStore
    }

type FlowStepProps = FlowSectionProps & {
  title?: string
  subTitle?: string
  children?: React.ReactNode | ((props: StepProps) => React.ReactNode)
  validateFinished?: (a: any) => true | any
}

type FlowStep = FlowStepProps & {
  key: string
}

export type FlowLayoutProps = FlowSectionProps & {
  Toolbar: FlowProps['Toolbar']
  children: React.ReactChild
  index: number
  total: number
  step: FlowStep
  steps: FlowStep[]
  currentStep: StepProps
  height?: number
}

type StepProps = {
  data: any
  setData: (a: any) => void
  next: () => void
  prev: () => void
  setStepIndex: (index: number) => void
}

const DefaultFlowToolbar = (props: FlowLayoutProps) => {
  const isOnFirstStep = props.index === 0
  const isOnLastStep = props.index === props.total - 1

  return (
    <Row space="sm">
      <Button
        disabled={isOnFirstStep}
        iconAfter
        icon="chevron-left"
        onClick={props.currentStep.prev}
      />
      <Button
        disabled={isOnLastStep}
        iconAfter
        icon="chevron-right"
        onClick={props.currentStep.next}
      />
      {props.afterTitle}
    </Row>
  )
}

export const DefaultFlowLayout = (props: FlowLayoutProps) => {
  const { Toolbar, children, index, total, step, steps, height } = props
  return (
    <Section
      bordered
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
          color={theme => theme.background}
          borderColor={(theme, props) => (props.active ? theme.borderColor : null)}
          sizeRadius={0}
          sizeHeight={1.2}
          sizePadding={1.5}
        >
          <Row>
            {steps.map((stp, stepIndex) => (
              <Button
                key={stp.key}
                alt={steps[index].key === stp.key ? 'selected' : null}
                active={steps[index].key === stp.key}
                onClick={() => props.currentStep.setStepIndex(stepIndex)}
              >
                {stp.title || 'No title'}
              </Button>
            ))}
          </Row>
        </SurfacePassProps>
      }
      afterTitle={Toolbar && <Toolbar {...props} />}
    >
      {children}
    </Section>
  )
}

interface FlowComponent<Props> extends FunctionComponent<Props> {
  Step: FunctionComponent<FlowStepProps>
}

class FlowStore {
  props: FlowDataProps
  data = this.props.initialData || null

  setData(next: any) {
    this.data = next
  }
}

const FlowStoreContext = createStoreContext(FlowStore)
export const useFlow = FlowStoreContext.useCreateStore

export const Flow: FlowComponent<FlowProps> = memo(
  ({
    height,
    Toolbar = DefaultFlowToolbar,
    renderLayout = DefaultFlowLayout,
    afterTitle,
    ...props
  }: FlowProps) => {
    const flowStoreInternal = FlowStoreContext.useCreateStore('useFlow' in props ? false : props)
    const flowStore = 'useFlow' in props ? props.useFlow : flowStoreInternal
    const [index, setIndex] = useState(0)
    const [data, setDataDumb] = useState(flowStore.props.initialData)
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
    const stepProps = {
      data,
      setData,
      next,
      prev,
      setStepIndex: setIndex,
    }

    // update store
    useEffect(() => {
      flowStore.setData(data)
    }, [flowStore, data])

    const contents = (
      <Slider fixHeightToParent curFrame={index}>
        {Children.map(props.children, (child, idx) => {
          const step = child.props
          const ChildView = step.children
          return (
            <SliderPane key={idx}>
              {typeof step.children === 'function' ? <ChildView {...stepProps} /> : step.children}
            </SliderPane>
          )
        })}
      </Slider>
    )

    return (
      <>
        {renderLayout({
          Toolbar,
          children: contents,
          index: index,
          total,
          step: steps[index],
          steps,
          currentStep: stepProps,
          height,
          afterTitle,
        })}
      </>
    )
  },
) as any

export function FlowStep(_: FlowStepProps) {
  return null
}

Flow.Step = FlowStep
