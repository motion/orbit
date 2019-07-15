import { createStoreContext, useHooks, useStore } from '@o/use-store'
import React, { Children, FunctionComponent, isValidElement, memo, useLayoutEffect, useMemo } from 'react'

import { Button } from './buttons/Button'
import { Center } from './Center'
import { Config } from './helpers/configureUI'
import { ScopedState } from './helpers/ScopedState'
import { Section, SectionProps } from './Section'
import { Slider } from './Slider'
import { SliderPane } from './SliderPane'
import { Row } from './View/Row'

type FlowSectionProps = Pick<SectionProps, 'afterTitle'>

export type FlowPropsBase = FlowSectionProps & {
  children: any
  Layout?: FunctionComponent<FlowLayoutProps>
  Toolbar?: FunctionComponent<FlowLayoutProps>
  height?: number
}

export type FlowStoreProps = {
  id?: string
  data?: any
}

export type FlowProps =
  | FlowPropsBase & FlowStoreProps
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

const tabButtonProps: any = {
  background: 'transparent',
  borderWidth: 0,
  glint: false,
  borderBottom: [3, 'transparent'],
  opacity: 0.4,
  sizeRadius: 0,
  size: 1.1,
  sizeHeight: 1.3,
  sizePadding: 1.5,
}

const tabButtonPropsActive: any = {
  // color: theme => theme.color,
  borderBottom: theme => [3, theme.backgroundHighlight || theme.color],
  hoverStyle: false,
  opacity: 1,
}

export const DefaultFlowLayout = (props: FlowLayoutProps) => {
  const { Toolbar, children, index, step, steps, height } = props
  return (
    <Section
      bordered
      title={step.title}
      subTitle={step.subTitle}
      minHeight={20}
      height={height}
      flex={1}
      titlePadding={['lg', true, false]}
      belowTitle={
        <Row>
          {steps.map((stp, stepIndex) => {
            const isActive = steps[index].key === stp.key
            return (
              <Button
                key={stp.key}
                onClick={() => props.setStepIndex(stepIndex)}
                {...tabButtonProps}
                {...isActive && tabButtonPropsActive}
              >
                {stp.buttonTitle || stp.title || 'No title'}
              </Button>
            )
          })}
        </Row>
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
  props: FlowStoreProps
  steps: FlowStepProps[] = []

  state = useHooks(() => {
    const [data, setData] = Config.useUserState(
      `flowdata-${this.props.id || ''}`,
      this.props.data || null,
    )
    const [index, setIndex] = Config.useUserState(`flowindex-${this.props.id || ''}`, 0)
    return {
      data,
      setData,
      index,
      setIndex,
    }
  })

  get data() {
    return this.state.data
  }

  get index() {
    return this.state.index
  }

  get total() {
    return this.steps.length
  }

  get step() {
    return this.steps[this.state.index]
  }

  next = async () => {
    const nextIndex = Math.min(this.total - 1, this.state.index + 1)
    const { step } = this
    const nextStep = this.steps[nextIndex]
    if (!nextStep) return
    const isValid = !step.validateFinished || (await step.validateFinished(this.state.data))
    if (isValid) {
      this.state.setIndex(nextIndex)
    }
  }

  prev = () => {
    this.state.setIndex(Math.max(0, this.state.index - 1))
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
      data: flowStore.state.data,
      setData: flowStore.state.setData,
      next: flowStore.next,
      prev: flowStore.prev,
      setStepIndex: flowStore.state.setIndex,
    }

    const contents = (
      <Slider fixHeightToParent curFrame={flowStore.state.index}>
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

    if (!steps[flowStore.state.index]) {
      return (
        <Center>
          No step at index: {flowStore.state.index}, steps: {JSON.stringify(steps)}
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
          step={steps[flowStore.state.index]}
          steps={steps}
          index={flowStore.state.index}
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
