import { createStoreContext, useHooks, useStore } from '@o/use-store'
import React, { Children, FunctionComponent, isValidElement, memo, useLayoutEffect, useMemo } from 'react'

import { Button } from './buttons/Button'
import { Center } from './Center'
import { Config } from './helpers/configureUI'
import { ScopedState } from './helpers/ScopedState'
import { Section, SectionProps } from './Section'
import { Slider } from './Slider'
import { SliderPane } from './SliderPane'
import { SurfacePassProps } from './Surface'
import { Row } from './View/Row'

type FlowSectionProps = Pick<SectionProps, 'afterTitle'>

export type FlowPropsBase = FlowSectionProps & {
  children: any
  Layout?: FunctionComponent<FlowLayoutProps>
  Toolbar?: FunctionComponent<FlowLayoutProps>
  height?: number
}

export type FlowDataProps = {
  data?: any
}

export type FlowProps =
  | FlowPropsBase & FlowDataProps
  | FlowPropsBase & {
      useFlow: FlowStore
    }

type StepProps = {
  data: any
  setData: (a: any) => void
  next: () => void
  prev: () => void
  setStepIndex: (index: number) => void
}

export type FlowStepProps = FlowSectionProps & {
  title?: string
  buttonTitle?: string
  subTitle?: string
  children?: React.ReactNode | ((props: StepProps) => any)
  validateFinished?: (a: any) => true | any
}

type FlowStep = FlowStepProps & {
  key: string
}

export type FlowLayoutProps = FlowSectionProps &
  StepProps & {
    Toolbar: FlowProps['Toolbar']
    children: React.ReactChild
    index: number
    total: number
    step: FlowStep
    steps: FlowStep[]
    height?: number
  }

const DefaultFlowToolbar = (props: FlowLayoutProps) => {
  const isOnFirstStep = props.index === 0
  const isOnLastStep = props.index === props.total - 1

  return (
    <Row space="sm">
      <Button disabled={isOnFirstStep} icon="chevron-left" onClick={props.prev} />
      <Button disabled={isOnLastStep} iconAfter icon="chevron-right" onClick={props.next}>
        Next
      </Button>
      {props.afterTitle}
    </Row>
  )
}

export const DefaultFlowLayout = (props: FlowLayoutProps) => {
  const { Toolbar, children, index, step, steps, height } = props
  return (
    <Section
      bordered
      title={step.title}
      subTitle={step.subTitle}
      minHeight={300}
      height={height}
      flex={1}
      titlePad={['lg', true, false]}
      belowTitle={
        <SurfacePassProps
          background="transparent"
          borderWidth={0}
          glint={false}
          borderBottom={[3, 'transparent']}
          color={theme => theme.background}
          colorHover="red"
          borderColor={(theme, props) => (props.active ? theme.borderColor : null)}
          sizeRadius={0}
          sizeHeight={1.2}
          sizePadding={1.5}
          opacity={(_, props) => (props.active ? 1 : 0.4)}
        >
          <Row>
            {steps.map((stp, stepIndex) => (
              <Button
                key={stp.key}
                alt={steps[index].key === stp.key ? 'selected' : null}
                active={steps[index].key === stp.key}
                onClick={() => props.setStepIndex(stepIndex)}
              >
                {stp.buttonTitle || stp.title || 'No title'}
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

export class FlowStore {
  props: FlowDataProps
  steps: FlowStepProps[] = []

  private hooks = useHooks({
    data: () => Config.useUserState('flowdata', (this.props && this.props.data) || null),
    index: () => Config.useUserState('flowindex', 0),
  })

  get data() {
    return this.hooks.data[0]
  }

  get index() {
    return this.hooks.index[0]
  }

  get total() {
    return this.steps.length
  }

  get step() {
    return this.steps[this.index]
  }

  setData = this.hooks.data[1]
  setStepIndex = this.hooks.index[1]

  next = async () => {
    const nextIndex = Math.min(this.total - 1, this.index + 1)
    const { step } = this
    const nextStep = this.steps[nextIndex]
    if (!nextStep) return
    const isValid = !step.validateFinished || (await step.validateFinished(this.data))
    if (isValid) {
      this.setStepIndex(nextIndex)
    }
  }

  prev = () => {
    this.setStepIndex(Math.max(0, this.index - 1))
  }

  setStepsInternal(steps: FlowStepProps[]) {
    this.steps = steps
  }
}

const FlowStoreContext = createStoreContext(FlowStore)

export const useCreateFlow = FlowStoreContext.useCreateStore
export const useFlow = FlowStoreContext.useStore
export const FlowProvide = FlowStoreContext.SimpleProvider

export const Flow: FlowComponent<FlowProps> = memo(
  ({
    height,
    Toolbar = DefaultFlowToolbar,
    Layout = DefaultFlowLayout,
    afterTitle,
    ...props
  }: FlowProps) => {
    const flowStoreInternal = FlowStoreContext.useCreateStore('useFlow' in props ? false : props)
    const flowStore = useStore('useFlow' in props ? props.useFlow : flowStoreInternal)
    const stepChildren = Children.toArray(props.children).filter(
      x => x && x.type && x.type === FlowStep,
    )

    const steps: FlowStep[] = useMemo(
      () =>
        stepChildren.map((child, idx) => ({
          key: `${idx}`,
          ...child.props,
        })),
      [props.children],
    )

    const total = stepChildren.length

    useLayoutEffect(() => {
      flowStore.setStepsInternal(steps)
    }, [flowStore, steps])

    const stepProps = {
      data: flowStore.data,
      setData: flowStore.setData,
      next: flowStore.next,
      prev: flowStore.prev,
      setStepIndex: flowStore.setStepIndex,
    }

    const contents = (
      <Slider fixHeightToParent curFrame={flowStore.index}>
        {stepChildren.map((child, idx) => {
          const ChildView = child.props.children
          return (
            <SliderPane key={idx}>
              {typeof ChildView === 'string' || isValidElement(ChildView) ? (
                ChildView
              ) : (
                <ChildView {...stepProps} />
              )}
            </SliderPane>
          )
        })}
      </Slider>
    )

    if (!steps[flowStore.index]) {
      return (
        <Center>
          No step at index: {flowStore.index}, steps: {steps.length}
        </Center>
      )
    }

    return (
      <FlowStoreContext.SimpleProvider value={flowStore}>
        <Layout
          Toolbar={Toolbar}
          total={total}
          height={height}
          afterTitle={afterTitle}
          step={steps[flowStore.index]}
          steps={steps}
          index={flowStore.index}
          {...stepProps}
        >
          <ScopedState id="flow">{contents}</ScopedState>
        </Layout>
      </FlowStoreContext.SimpleProvider>
    )
  },
) as any

export function FlowStep(_: FlowStepProps) {
  return null
}

Flow.Step = FlowStep
