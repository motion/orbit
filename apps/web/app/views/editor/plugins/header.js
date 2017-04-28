export default fontSize => props => {
  //n const { text } = props.node

  return (
    <div style={{ fontSize, lineHeight: `${fontSize * 1.25}px` }}>
      {props.children}
    </div>
  )
}
