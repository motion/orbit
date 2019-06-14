import TweetAction from './TweetAction'
import { View, StyleSheet } from 'react-native'
import React, { PureComponent } from 'react'

const actionNames = ['reply', 'retweet', 'like', 'directMessage']

export default class TweetActionsBar extends PureComponent {
  render() {
    const { actions, style } = this.props

    /* eslint-disable react/jsx-handler-names */
    return (
      <View style={[styles.root, style]}>
        {actions.map((action, i) => (
          <TweetAction
            accessibilityLabel={actions.label}
            count={action.count}
            displayMode={action.name}
            highlighted={action.highlighted}
            key={i}
            onPress={action.onPress}
            style={styles.action}
          />
        ))}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
  },
  action: {
    display: 'block',
    marginRight: '10%',
  },
})
