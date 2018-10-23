import * as React from 'react'
import { view } from '@mcro/black'
import { ProvideHighlightsContextWithDefaults } from '../../helpers/contexts/HighlightsContext'
import { SettingStore } from '../../stores/SettingStore'
import { SimpleItem } from '../../views/SimpleItem'
import { SubTitle } from '../../views/SubTitle'

type Props = {
  settingStore?: SettingStore
}

class MeStore {
  props: Props

  get setting() {
    return this.props.settingStore.setting
  }

  get recentSearches() {
    return this.setting.values.recentSearches || []
  }

  get pinnedBits() {
    return this.setting.values.pinnedBits || []
  }
}

@view.attach('settingStore')
@view.attach({
  store: MeStore,
})
@view
export class MeApp extends React.Component<Props & { store?: MeStore }> {
  render() {
    const { recentSearches, pinnedBits } = this.props.store
    return (
      <ProvideHighlightsContextWithDefaults
        value={{ words: ['app'], maxChars: 500, maxSurroundChars: 80 }}
      >
        <SubTitle>Recently Searched</SubTitle>
        {recentSearches.filter(x => !!`${x}`.trim()).map(search => (
          <SimpleItem key={search} title={search} />
        ))}

        <SubTitle>Pinned</SubTitle>
        {pinnedBits.map(bit => (
          <SimpleItem key={bit} title={bit} />
        ))}
      </ProvideHighlightsContextWithDefaults>
    )
  }
}
