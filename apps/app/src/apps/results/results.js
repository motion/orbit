import * as React from 'react'
import { view } from '@mcro/black'
import OrbitCard from '~/apps/orbit/orbitCard'
import { throttle } from 'lodash'

const SPLIT_INDEX = 3
const getPosition = node => {
  const parentRect = node.parentElement.parentElement.getBoundingClientRect()
  const rect = node.getBoundingClientRect()
  const computedStyle = getComputedStyle(node)
  const marginTop = parseInt(computedStyle.marginTop, 10)
  const marginLeft = parseInt(computedStyle.marginLeft, 10)
  const res = {
    top: rect.top - marginTop - parentRect.top,
    left: rect.left - marginLeft - parentRect.left,
    width: rect.width,
    height: rect.height,
  }
  return res
}

// @view
// class AnimateItem extends React.Component {
//   childRef = null
//   measurements = null

//   state = {
//     children: null,
//   }

//   componentDidMount() {
//     this.updateChildren()
//   }

//   componentWillReceiveProps(nextProps) {
//     this.updateChildren(nextProps)
//   }

//   componentDidUpdate() {
//     if (this.state.willMeasure) {
//       this.measurements = getPosition(this.childRef)
//       this.setState({ willMeasure: false })
//     }
//   }

//   getRef(childRef) {
//     this.childRef = childRef
//   }

//   updateChildren(props = this.props) {
//     this.setState({
//       willMeasure: true,
//       children: React.cloneElement(props.children, {
//         getRef: this.getRef.bind(this),
//       }),
//     })
//   }

//   render() {
//     console.log('--', this.props.id, this.measurements)
//     return (
//       <React.Fragment>
//         <hiddenContainer>{this.state.children}</hiddenContainer>
//         <React.Fragment if={this.childRef}>
//           {React.cloneElement(this.props.children, {
//             style: {
//               position: 'absolute',
//               transition: 'all ease-in 2500ms',
//               height: this.measurements.height,
//               transform: `translateX(${this.measurements.left}px) translateY(${
//                 this.measurements.top
//               }px)`,
//             },
//           })}
//         </React.Fragment>
//       </React.Fragment>
//     )
//   }

//   static style = {
//     hiddenContainer: {
//       opacity: 0,
//       // position: 'absolute',
//       // top: 0,
//       // left: 0,
//       // right: 0,
//       // bottom: 0,
//     },
//   }
// }

@view.attach('appStore')
@view
export default class Results {
  frameRef = null
  state = {
    resultsRef: null,
    isScrolled: false,
    isOverflowing: false,
  }

  setResults = resultsRef => {
    this.setState({ resultsRef })
  }

  setResultsFrame = frameRef => {
    if (!frameRef) return
    this.frameRef = frameRef
    this.on(frameRef, 'scroll', this.handleScroll)
  }

  handleScroll = throttle(() => {
    let { isScrolled, resultsRef } = this.state
    const { frameRef } = this
    if (!frameRef) return
    if (frameRef.scrollTop > 0) {
      isScrolled = true
    } else {
      isScrolled = false
    }
    if (isScrolled !== this.state.isScrolled) {
      this.setState({ isScrolled })
    }
    const scrolledDistance = resultsRef.clientHeight + resultsRef.scrollTop
    const isOverflowing = frameRef.clientHeight <= scrolledDistance
    if (isOverflowing != this.state.isOverflowing) {
      this.setState({ isOverflowing })
    }
  }, 16)

  render({ appStore, isContext }, { resultsRef, isScrolled, isOverflowing }) {
    const { results } = appStore.searchState
    const total = results.length - SPLIT_INDEX
    return (
      <resultsFrame ref={this.setResultsFrame}>
        <fadeTop $fade $$untouchable $fadeVisible={isScrolled} />
        <results if={results.length} ref={this.setResults}>
          <firstResultSpace $$untouchable css={{ height: 6 }} />
          {results
            .slice(SPLIT_INDEX)
            .map((result, i) => (
              <OrbitCard
                key={result.id}
                parentElement={resultsRef}
                appStore={appStore}
                result={result}
                index={i + SPLIT_INDEX}
                total={total}
                listItem={!isContext}
              />
            ))}
          <lastResultSpace $$untouchable css={{ height: 12 }} />
        </results>
        <fadeBottom $fade $$untouchable $fadeVisible={isOverflowing} />
      </resultsFrame>
    )
  }
  static style = {
    resultsFrame: {
      flex: 1,
      position: 'relative',
      overflowY: 'scroll',
      paddingTop: 40,
      marginTop: -40,
      pointerEvents: 'none',
    },
    fade: {
      position: 'fixed',
      left: 0,
      right: 0,
      zIndex: 10000,
      opacity: 0,
      transform: {
        z: 0,
      },
      // transition: 'opacity ease-in 150ms',
    },
    fadeTop: {
      top: 13,
      height: 40,
    },
    fadeBottom: {
      bottom: 0,
      height: 40,
    },
    fadeVisible: {
      opacity: 1,
    },
  }

  static theme = (props, theme) => {
    return {
      fadeTop: {
        background: `linear-gradient(${
          theme.base.background
        } 25%, transparent)`,
      },
      fadeBottom: {
        background: `linear-gradient(transparent 45%, ${
          theme.base.background
        })`,
      },
    }
  }
}
