import { react } from '@mcro/black'
import { stateOnlyWhenActive } from './stateOnlyWhenActive'
import { App } from '@mcro/stores'
import { hoverSettler } from '../../helpers'

export class OrbitSearchStore {
  extraFiltersHeight = 300
  extraFiltersVisible = false

  get extraHeight() {
    return this.extraFiltersVisible ? 0 : this.extraFiltersHeight
  }

  // this isn't a computed val because it persists the last state
  state = stateOnlyWhenActive(this)

  get isChanging() {
    return this.currentQuery !== this.state.query
  }

  get isActive() {
    return this.props.appStore.selectedPane === 'summary-search'
  }

  hasQuery() {
    return !!App.state.query
  }

  // delay just a tiny bit to prevent input delay
  currentQuery = react(() => App.state.query, _ => _, {
    delay: 32,
    immediate: true,
  })

  dateState = {
    ranges: [
      {
        startDate: Date.now(),
        endDate: Date.now(),
        key: 'selection',
      },
    ],
  }

  setExtraFiltersVisible = target => {
    this.extraFiltersVisible = !!target
  }

  dateHover = hoverSettler({
    enterDelay: 400,
    leaveDelay: 400,
    onHovered: this.setExtraFiltersVisible,
  })

  dateHoverProps = this.dateHover().props

  get filters() {
    const { settingsList } = this.props.integrationSettingsStore
    if (!settingsList) {
      return []
    }
    return settingsList
      .filter(x => x.type !== 'setting')
      .map(setting => ({ icon: setting.type }))
  }

  onChangeDate = ranges => {
    this.dateState = {
      ranges: [ranges.selection],
    }
    // this.dateState = ranges
  }
}
