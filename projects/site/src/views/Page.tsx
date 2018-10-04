import * as React from 'react'
import { view } from '@mcro/black'
import { SectionContent } from './sectionContent'
import { ParallaxLayer } from '../components/Parallax'

const NormalLayer = view.attach('homeStore')(({ homeStore, ...props }) => {
  return <SectionContent style={{ height: homeStore.sectionHeight }} {...props} />
})

@view
export class Page extends React.Component {
  render() {
    const { offset, children, zIndex = 0 } = this.props
    const baseZIndex = zIndex
    const Parallax = ({ zIndex = 0, ...props }) => (
      <ParallaxLayer
        className="parallaxLayer"
        offset={offset}
        speed={0.2}
        style={{ zIndex: zIndex + baseZIndex }}
        {...props}
      />
    )
    const Content = props => (
      <NormalLayer style={{ position: 'relative', zIndex: 1 + zIndex }} {...props} />
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
