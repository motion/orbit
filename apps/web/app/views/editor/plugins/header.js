export default fontSize => props => {
  //n const { text } = props.node

  return <div style={{ fontSize }}>{props.children}</div>
}
