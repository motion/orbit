import { createStoreContext, ensure, react, useHooks, useStore } from '@o/use-store'
import React, { Children, FunctionComponent, isValidElement, memo, useLayoutEffect, useRef, useState } from 'react'

import { Button } from './buttons/Button'
import { Center } from './Center'
import { Config } from './helpers/configureUI'
import { ScopeState } from './helpers/ScopeState'
import { Section, SectionProps } from './Section'
import { Slider } from './Slider'
import { SliderPane } from './SliderPane'
import { SubSection } from './SubSection'
import { Col } from './View/Col'
import { Row } from './View/Row'

type FlowSectionProps = Pick<SectionProps, 'afterTitle'>

// TODO: needs a little love, likely FlowStoreProps should be same as FlowPropsBase

export type FlowPropsBase = FlowSectionProps & {
  children: any
  Layout?: FunctionComponent<FlowLayoutProps>
  Toolbar?: FunctionComponent<FlowLayoutProps>
  height?: number
  onChangeStep?: (step: number) => any
}

export type FlowStoreProps = {
  id?: string
  data?: any
  onChangeStep?: (step: number) => any
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

export type FlowLayoutProps = Omit<FlowSectionProps, 'children'> & {
  stepProps: StepProps
  flowStore: FlowStore
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
      <Button disabled={isOnFirstStep} icon="chevron-left" onClick={props.stepProps.prev} />
      <Button disabled={isOnLastStep} iconAfter icon="chevron-right" onClick={props.stepProps.next}>
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

export const FlowLayoutSlider = (props: FlowLayoutProps) => {
  const { Toolbar, index, step, steps, height, flowStore, stepProps } = props
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
                onClick={() => stepProps.setStepIndex(stepIndex)}
                {...tabButtonProps}
                {...isActive && tabButtonPropsActive}
              >
                {stepIndex + 1}. {stp.buttonTitle || stp.title || 'No title'}
              </Button>
            )
          })}
        </Row>
      }
      afterTitle={Toolbar && <Toolbar {...props} />}
    >
      <Slider fixHeightToParent curFrame={flowStore.index}>
        {steps.map((child, idx) => {
          const ChildView = child.children as any
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
    </Section>
  )
}

export const FlowLayoutInline = (props: FlowLayoutProps) => {
  const { steps, stepProps } = props
  return (
    <Col flex={1} scrollable="y">
      {steps.map((child, idx) => {
        const ChildView = child.children as any
        const contents =
          typeof ChildView === 'string' || isValidElement(ChildView) ? (
            ChildView
          ) : (
            <ChildView {...stepProps} />
          )
        return (
          <SubSection key={idx} title={child.title} subTitle={child.subTitle}>
            {contents}
          </SubSection>
        )
      })}
    </Col>
  )
}

interface FlowComponent<Props> extends FunctionComponent<Props> {
  Step: FunctionComponent<FlowStepProps>
}

export class FlowStore {
  props: FlowStoreProps = {}
  steps: FlowStepProps[] = []

  private state = useHooks(() => {
    const [data, setData] = Config.useUserState(
      `flowdata-${this.props.id || ''}`,
      this.props.data || null,
    )
    const [index, setIndex] = useState(0)
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

  setData = this.state.setData
  setIndex = this.state.setIndex

  get total() {
    return this.steps.length
  }

  get step() {
    return this.steps[this.state.index]
  }

  onStepChangeCallback = react(
    () => [this.index],
    ([index]) => {
      const { onChangeStep } = this.props
      ensure('index', index > -1)
      ensure('onChangeStep', !!onChangeStep)
      onChangeStep(index)
    },
  )

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
    Layout = FlowLayoutSlider,
    afterTitle,
    ...props
  }: FlowProps) => {
    const flowStoreInternal = FlowStoreContext.useCreateStore('useFlow' in props ? false : props)
    const flowStore = useStore('useFlow' in props ? props.useFlow : flowStoreInternal)
    const stepChildren = Children.toArray(props.children).filter(
      x => x && x.type && x.type === FlowStep,
    )

    // Why no memo? Because we conditionally want to update based on if they are a function (always)
    // or an element (never). if we don't, you run into infinite loops as you are updating every
    // render for functional children
    const stepsRef = useRef<FlowStep[]>([])
    const stepsId = useRef(0)
    for (const [index, stepChild] of stepChildren.entries()) {
      const nextStep = {
        key: `${index}`,
        ...stepChild.props,
      }
      // memoize functions to prevent infinite renders
      const isFunctionChild = typeof stepChild.props.children === 'function'
      if ((isFunctionChild && !stepsRef.current[index]) || !isFunctionChild) {
        stepsRef.current[index] = nextStep
        stepsId.current += 1
      }
    }

    const total = stepChildren.length

    useLayoutEffect(() => {
      flowStore.setStepsInternal(stepsRef.current)
    }, [flowStore, stepsId.current])

    const stepProps = {
      data: flowStore.data,
      setData: flowStore.setData,
      next: flowStore.next,
      prev: flowStore.prev,
      setStepIndex: flowStore.setIndex,
    }

    if (!stepsRef.current[flowStore.index]) {
      return (
        <Center>
          No step at index: {flowStore.index}, steps: {JSON.stringify(stepsRef.current)}
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
          step={stepsRef.current[flowStore.index]}
          steps={stepsRef.current}
          index={flowStore.index}
          flowStore={flowStore}
          stepProps={stepProps}
        >
          <ScopeState id="flow">{stepsRef.current}</ScopeState>
        </Layout>
      </FlowStoreContext.SimpleProvider>
    )
  },
) as any

export function FlowStep(_: FlowStepProps) {
  return null
}

Flow.Step = FlowStep
