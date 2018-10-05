import * as React from 'react'
import { view, compose } from '@mcro/black'
import { SectionContent } from './sectionContent'
import { ParallaxLayer } from '../components/Parallax'

const decorate = compose(
  view.attach('homeStore'),
  view,
)
const NormalLayer = decorate(({ homeStore, ...props }) => {
  console.log('homeStore.sectionHeight', homeStore.sectionHeight)
  return <SectionContent height={homeStore.sectionHeight} {...props} />
})

@view
export class Page extends React.Component<{ offset: number; zIndex?: number }> {
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
