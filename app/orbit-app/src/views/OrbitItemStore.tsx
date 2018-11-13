import { react, ensure } from '@mcro/black'
import { ItemProps } from './OrbitItemProps'
import { NormalizedItem } from '../helpers/normalizeItem'
import { AppActions } from '../actions/AppActions'
import { ResolvableModel } from '../sources/types'
import { getAppConfig } from '../helpers/getAppConfig'

// TEMP i dont want to write the three level hoist to make this work quite yet
export const OrbitItemSingleton = {
  lastClick: Date.now(),
}

export class OrbitItemStore {
  props: ItemProps<ResolvableModel>

  resolvedItem: NormalizedItem = null
  isSelected = false
  cardWrapRef = null
  clickAt = 0
  hoverSettler = null

  setHoverSettler = react(
    () => this.props.hoverToSelect,
    hoverSelect => {
      ensure('hoverSelect', hoverSelect)
      ensure('!hoverSettler', !this.hoverSettler)
      this.hoverSettler = this.props.appStore.getHoverSettler()
      this.hoverSettler.setItem({
        index: this.props.index,
      })
    },
  )

  get didClick() {
    return Date.now() - this.clickAt < 50
  }

  handleClick = (e: React.SyntheticEvent<MouseEvent>) => {
    // so we can control the speed of doubleclicks
    if (Date.now() - this.clickAt < 280) {
      // allow double click of location
      if (Date.now() - this.lastClickLocation < 280) {
        this.searchLocation()
        return
      }
      this.open()
      AppActions.setOrbitDocked(false)
      e.stopPropagation()
    }
    this.clickAt = Date.now()
    OrbitItemSingleton.lastClick = this.clickAt
    if (this.props.onClick) {
      this.props.onClick(e, this.cardWrapRef)
      return
    }
    if (this.props.inactive) {
      return
    }
    this.props.appStore.toggleSelected(this.realIndex, 'click')
  }

  lastClickLocation = Date.now()

  handleClickLocation = () => {
    this.lastClickLocation = Date.now()
  }

  searchLocation = () => {
    const { onClickLocation } = this.props
    if (typeof onClickLocation === 'string') {
      return AppActions.open(onClickLocation)
    }
    if (typeof onClickLocation === 'function') {
      return onClickLocation(this.resolvedItem)
    }
    console.log('no handler for location')
  }

  open = () => {
    if (!this.props.model || this.props.model.target === 'source') {
      return
    }
    AppActions.openItem(this.props.model)
  }

  setCardWrapRef = cardWrapRef => {
    if (!cardWrapRef) return
    this.cardWrapRef = cardWrapRef
  }

  setResolvedItem = (item: NormalizedItem) => {
    this.resolvedItem = item
  }

  get realIndex() {
    const { model, getIndex, index } = this.props
    return getIndex ? getIndex(model) : index
  }

  get appConfig() {
    console.log('okok', this.props, this.props.appConfig)
    if (this.props.appConfig) {
      return this.props.appConfig
    }
    return this.props.model ? getAppConfig(this.props.model) : null
  }

  selectItem = () => {
    const item = {
      appType: this.props.appType,
      appConfig: this.appConfig,
      target: this.cardWrapRef,
    }
    console.log('selecting item', item)
    AppActions.setPeekApp(item)
  }

  updateIsSelected = react(
    () => {
      const { activeCondition, ignoreSelection, appStore, isSelected } = this.props
      if (typeof isSelected === 'undefined') {
        if (ignoreSelection) {
          return false
        }
        if (activeCondition && activeCondition() === false) {
          return false
        }
        if (!appStore || !appStore.isActive) {
          return false
        }
      }
      const forceSelected =
        typeof isSelected === 'function' ? isSelected(this.realIndex) : isSelected
      let next
      if (typeof forceSelected === 'boolean') {
        next = forceSelected
      } else {
        next = appStore.activeIndex === this.realIndex
      }
      return next
    },
    async (isSelected, { sleep }) => {
      const { onSelect, preventAutoSelect } = this.props
      ensure('new index', isSelected !== this.isSelected)
      this.isSelected = isSelected
      if (isSelected && !preventAutoSelect) {
        console.log('selecting this thing...', this.props.appType, this.appConfig)
        ensure('appConfig`', !!this.appConfig)
        if (onSelect) {
          onSelect(this.realIndex, this.appConfig)
        } else {
          // fluidity
          await sleep()
          this.selectItem()
        }
      }
    },
    {
      deferFirstRun: true,
    },
  )
}
