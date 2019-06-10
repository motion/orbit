import { createStoreContext, useHooks, useStore } from '@o/use-store'
import React, { Children, FunctionComponent, isValidElement, memo, useLayoutEffect, useMemo } from 'react'

import { Button } from './buttons/Button'
import { Center } from './Center'
import { Config } from './helpers/configureUI'
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
  initialData?: any
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
      <Button disabled={isOnFirstStep} iconAfter icon="chevron-left" onClick={props.prev} />
      <Button disabled={isOnLastStep} iconAfter icon="chevron-right" onClick={props.next} />
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
      titlePad={['lg', true, false]}
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
                onClick={() => props.setStepIndex(stepIndex)}
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

export class FlowStore {
  props: FlowDataProps
  total = 0

  private hooks = useHooks({
    data: () => Config.useUserState('Flow-data', this.props.initialData),
    index: () => Config.useUserState('Flow-index', 0),
  })

  get data() {
    return this.hooks.data[0]
  }

  get index() {
    return this.hooks.index[0]
  }

  setData = this.hooks.data[1]
  setStepIndex = this.hooks.index[1]

  next = () => this.setStepIndex(Math.min(this.total - 1, this.index + 1))
  prev = () => this.setStepIndex(Math.max(0, this.index - 1))
}

const FlowStoreContext = createStoreContext(FlowStore)
export const useFlow = (props: FlowDataProps) =>
  FlowStoreContext.useCreateStore(props, { react: false })

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
    // make it  merge by default
    const total = Children.count(props.children)
    const children = Children.toArray(props.children)
    const steps: FlowStep[] = useMemo(
      () =>
        children.map((child, idx) => ({
          key: `${idx}`,
          ...child.props,
        })),
      [props.children],
    )

    useLayoutEffect(() => {
      flowStore.total = total
    }, [total])

    const stepProps = {
      data: flowStore.data,
      setData: flowStore.setData,
      next: flowStore.next,
      prev: flowStore.prev,
      setStepIndex: flowStore.setStepIndex,
    }

    const contents = (
      <Slider fixHeightToParent curFrame={flowStore.index}>
        {children.map((child, idx) => {
          const ChildView = child.props.children
          return (
            <SliderPane key={idx}>
              {isValidElement(ChildView) ? ChildView : <ChildView {...stepProps} />}
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
        {contents}
      </Layout>
    )
  },
) as any

export function FlowStep(_: FlowStepProps) {
  return null
}

Flow.Step = FlowStep
