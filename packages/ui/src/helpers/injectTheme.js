import { object } from 'prop-types'

export default View => {
  function InjectTheme(props, context) {
    return (
      <View
        {...props}
        theme={(props.theme && context.uiTheme[props.theme]) || context.theme}
      />
    )
  }

  InjectTheme.contextTypes = {
    uiTheme: object,
    theme: object,
  }

  return InjectTheme
}
