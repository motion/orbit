import * as React from 'react'
import { view } from '@mcro/black'
import { SectionContent } from '~/views/sectionContent'
import { ParallaxLayer } from '~/components/Parallax'

const NormalLayer = view.attach('homeStore')(({ homeStore, ...props }) => {
  return <SectionContent css={{ height: homeStore.sectionHeight }} {...props} />
})

@view
export class Page extends React.Component {
  render({ offset, children, zIndex = 0 }) {
    const baseZIndex = zIndex
    const Parallax = ({ zIndex = 0, ...props }) => (
      <ParallaxLayer
        className="parallaxLayer"
        offset={offset}
        speed={0.2}
        css={{ zIndex: zIndex + baseZIndex }}
        {...props}
      />
    )
    const Content = props => (
      <NormalLayer
        css={{ position: 'relative', zIndex: 1 + zIndex }}
        {...props}
      />
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
}
