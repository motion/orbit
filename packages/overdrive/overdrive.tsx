import * as React from 'react'
// import ReactDOM from 'react-dom'
// import OverdriveElement from './overdriveElement'
// import { debounce } from 'lodash'

// class PortalChild extends React.Component {
//   props: any
//   render() {
//     const { child, parentElement } = this.props
//     return ReactDOM.createPortal(child, parentElement)
//   }
// }

const AnimateElement = ({ children }) => children
// @ts-ignore
AnimateElement.IS_ANIMATED_ELEMENT = true

// depth first to capture changes
const replaceAnimateNode = (child, replacer) => {
  let result
  if (!child || !child.type) {
    result = child
  } else if (Array.isArray(child)) {
    result = child.map(replaceAnimateNode)
  } else if (child.props.children) {
    const children = replaceAnimateNode(child.props.children, replacer)
    result = {
      ...child,
      props: {
        ...child.props,
        children,
      },
    }
  }
  if (result && result.type && result.type.IS_ANIMATED_ELEMENT) {
    return replacer(result, result.props.id)
  }
  return result
}

export default class Overdrive extends React.Component {
  props: {
    children?: any
    parentElement?: any
  }

  state = {
    naturalChildren: null,
    rerender: false,
    needsMeasure: false,
  }

  // componentWillMount() {
  //   // this.updateNaturalChildren()
  // }

  // componentWillReceiveProps() {
  //   // this.setState({ needsMeasure: true })
  //   // this.updateNaturalChildren()
  // }

  // componentDidUpdate() {
  //   // if (this.state.needsMeasure) {
  //   //   this.setState({ needsMeasure: false })
  //   // }
  // }

  reRenderAfterCollectingChildren = () => {
    this.setState({ rerender: true })
  }

  childPositions = {}

  updateNaturalChildren = () => {
    this.setState({
      naturalChildren: this.props.children({
        AnimateElement: props =>
          React.cloneElement(props.children, {
            ref: this.getNaturalChildRef(props.id),
          }),
      }),
    })
  }

  getPosition = (node /*, addOffset?: boolean*/) => {
    // const parentRect = this.props.parentElement.getBoundingClientRect()
    const rect = node.getBoundingClientRect()
    const computedStyle = getComputedStyle(node)
    const marginTop = parseInt(computedStyle.marginTop, 10)
    const marginLeft = parseInt(computedStyle.marginLeft, 10)
    const res = {
      top: rect.top - marginTop, // - parentRect.top,
      left: rect.left - marginLeft, // - parentRect.left,
      width: rect.width,
      height: rect.height,
    }
    return res
  }

  getNaturalChildRef = id => ref => {
    if (ref) {
      this.childPositions[id] = this.getPosition(ref)
      this.reRenderAfterCollectingChildren()
    }
  }

  naturalChildRef = id => {
    return this.childPositions[id]
  }

  flattenChildren = root => {
    let result = []
    replaceAnimateNode(root, (child, id) => {
      result.push({ child, id })
      return null
    })
    return result
  }

  containers = {}

  collectContainer = index => ref => {
    this.containers[index] = ref
  }

  render() {
    return this.props.children({ AnimateElement })
    // const portalChildren = this.flattenChildren(
    //   this.props.children({
    //     AnimateElement,
    //   }),
    // )
    // const { needsMeasure } = this.state
    // const { containers } = this
    // return (
    //   <React.Fragment>
    //     {!needsMeasure && (
    //       <div
    //         style={{
    //           opacity: 0,
    //           position: 'absolute',
    //           top: 0,
    //           left: 0,
    //           right: 0,
    //           bottom: 0,
    //         }}
    //       >
    //         {this.state.naturalChildren}
    //       </div>
    //     )}
    //     {portalChildren.map(({ child, id }, index) => {
    //       if (!this.childPositions[id]) {
    //         return null
    //       }
    //       const { top = 0, left = 0, ...style } = this.childPositions[id]
    //       console.log('id', id, top, left)
    //       return (
    //         <div
    //           key={`container-${id}`}
    //           style={{
    //             position: 'absolute',
    //             transition: 'all ease-in 300ms',
    //             zIndex: portalChildren.length - index,
    //             ...style,
    //             top,
    //             left,
    //             // transform: `translateX$({left}px) translateY(${top}px)`,
    //           }}
    //           ref={this.collectContainer(id)}
    //         />
    //       )
    //     })}
    //     {portalChildren.map(
    //       ({ child, id }) =>
    //         containers[id] && (
    //           <PortalChild
    //             key={id}
    //             child={child}
    //             parentElement={containers[id]}
    //           />
    //         ),
    //     )}
    //   </React.Fragment>
    // )
  }
}
