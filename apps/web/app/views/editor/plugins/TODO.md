use old code as plugins:

```js
onChange = val => {
  this.setState({ val })
}

newParagraph = state =>
  state.transform().splitBlock().setBlock('paragraph').apply()

onEnter = (e, state) => {
  const { startBlock } = state
  const enterNewPara = ['header', 'quote']
  if (enterNewPara.filter(x => startsWith(startBlock.type, x)).length > 0) {
    e.preventDefault()
    return this.newParagraph(state)
  }
}

onKeyDown = (e, data, state) => {
  if (e.which === 13) {
    return this.onEnter(e, state)
  }

  // bold/italic/underline
  const buttons = {
    66: 'bold',
    73: 'italic',
    85: 'underlined',
  }

  if (!e.metaKey || !includes(Object.keys(buttons), '' + e.which)) return

  event.preventDefault()

  this.onChange(
    this.state.val.transform().toggleMark(buttons[e.which]).apply()
  )
}

addBlock = name => {
  const newState = this.state.val.transform().insertBlock(name).apply()

  this.onChange(newState)
}

wrapLink = () => {
  const href = window.prompt('Enter the URL of the link:')
  this.onChange(
    this.state.val
      .transform()
      .wrapInline({
        type: 'link',
        data: { href },
      })
      .collapseToEnd()
      .apply()
  )
}
```
