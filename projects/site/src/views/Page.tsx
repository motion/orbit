import * as React from 'react'
import { ParallaxLayer } from 'react-spring/renderprops-addons'
import { SectionContent } from './SectionContent'

function NormalLayer({ homeStore, ...props }) {
  return <SectionContent height={homeStore.sectionHeight} {...props} />
}

export function Page(props: { offset: number; zIndex?: number; children: any }) {
  const { offset, children, zIndex = 0 } = props
  const Parallax = rest => <ParallaxLayer offset={offset} speed={0.2} {...rest} />
  const Content = rest => (
    <NormalLayer style={{ position: 'relative', zIndex: 1 + zIndex }} {...rest} />
  )
  return (
    <>
      {typeof children === 'function' ? (
        children({ Parallax, Content })
      ) : (
        <Content>{children}</Content>
      )}
    </>
  )
}
