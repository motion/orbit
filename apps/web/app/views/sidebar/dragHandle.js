import { SortableHandle } from 'react-sortable-hoc'

export default SortableHandle(() => {
  const innerStyle = {
    justifyContent: 'space-between',
    height: 10,
  }

  const notchStyle = {
    width: 20,
    height: 2,
    background: 'rgba(0,0,0,0.30)',
  }

  return (
    <div style={{ padding: 10 }}>
      <div style={innerStyle}>
        {[1, 2, 3].map(notch => <div key={notch} style={notchStyle} />)}
      </div>
    </div>
  )
})
