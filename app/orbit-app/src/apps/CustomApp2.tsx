import { App, AppProps, createApp } from '@o/kit'
import { Section, Title, View, ViewProps } from '@o/ui'
import React, { createContext, useContext } from 'react'

function CustomApp2(_props: AppProps) {
  return (
    <App>
      <Title>hi 2 2</Title>

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
