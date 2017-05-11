import MentionsPlugin from './mentions-core'
import { view } from '~/helpers'

export default MentionsPlugin({
  Mention: props => (
    <span
      style={{
        color: 'green',
      }}
      {...props.attributes}
    >
      {props.children}
    </span>
  ),
  Suggestions: @view class Suggestions {
    render({ suggestions, selected }) {
      return (
        <items>
          {suggestions.map((suggestion, index) => (
            <item key={index} $active={index === selected}>
              {suggestion}
            </item>
          ))}
        </items>
      )
    }

    static style = {
      items: {
        border: '1px solid #eee',
        marginTop: 1.75,
        minWidth: 220,
        maxWidth: 440,
        background: 'white',
        borderRadius: 2,
        boxShadow: '0px 4px 30px 0px rgba(220,220,220,1)',
        cursor: 'pointer',
        paddingTop: 8,
        paddingBottom: 8,
        zIndex: 2,
        boxSizing: `border-box`,
      },
      item: {
        padding: 20,
        color: '#575f67',
        cursor: 'pointer',
        display: 'inline-block',
        background: '#e6f3ff',
        borderRadius: 2,
        textDecoration: 'none',
      },
      active: {
        color: '#677584',
        background: '#edf5fd',
        fontWeight: 'bold',
      },
    }
  },
})
