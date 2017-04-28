export default props => {
  const { data } = props.node
  const href = data.get('href')

  const onClick = e => {
    e.preventDefault()
    e.stopPropagation()
    const win = window.open(href, '_blank')
    win.focus()
  }

  return (
    <a
      style={{ color: 'blue' }}
      target="_blank"
      {...props.attributes}
      onClick={onClick}
      href={href}
    >
      {props.children}
    </a>
  )
}
