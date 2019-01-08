import { react, ensure } from '@mcro/black'
import { OrbitItemProps } from './OrbitItemProps'
import { NormalItem } from '../../helpers/normalizeItem'
import { AppActions } from '../../actions/AppActions'
import { getAppConfig } from '../../helpers/getAppConfig'

// TEMP i dont want to write the three level hoist to make this work quite yet
export const OrbitItemSingleton = {
  lastClick: Date.now(),
}

export class OrbitItemStore {
  props: OrbitItemProps<any>

  resolvedItem: NormalItem | null = null
  isSelected = false
  cardWrapRef = null
  clickAt = 0
  hoverSettler = null

  setHoverSettler = react(
    () => this.props.hoverToSelect,
    hoverSelect => {
      ensure('hoverSelect', !!hoverSelect)
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
      e.stopPropagation()
      e.preventDefault()
      this.props.onClick(e, this.cardWrapRef)
      return
    }
    this.props.appStore.toggleSelected(this.index, 'click')
  }

  lastClickLocation = Date.now()

  handleClickLocation = () => {
    this.lastClickLocation = Date.now()
  }

  searchLocation() {
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
    if (!this.props.item || this.props.item.target === 'source') {
      return
    }
    AppActions.openItem(this.props.item)
  }

  setCardWrapRef = cardWrapRef => {
    if (!cardWrapRef) return
    this.cardWrapRef = cardWrapRef
  }

  setResolvedItem = (item: NormalItem) => {
    this.resolvedItem = item
  }

  get index() {
    const { item, getIndex, index } = this.props
    return getIndex ? getIndex(item) : index
  }

  get appConfig() {
    if (this.props.appConfig) {
      return this.props.appConfig
    }
    return this.props.item ? getAppConfig(this.props.item) : null
  }

  selectItem = () => {
    AppActions.setPeekApp({
      appConfig: this.appConfig,
      target: this.cardWrapRef,
    })
  }

  shouldSelect = () => {
    const { activeCondition, ignoreSelection, appStore, isSelected } = this.props
    if (typeof isSelected === 'undefined') {
      if (ignoreSelection) {
        return false
      }
      if (typeof activeCondition === 'function' && activeCondition() === false) {
        return false
      }
      if (!appStore || !appStore.isActive) {
        return false
      }
    }
    const forceSelected = typeof isSelected === 'function' ? isSelected(this.index) : isSelected
    let next
    if (typeof forceSelected === 'boolean') {
      next = forceSelected
    } else {
      next = appStore && appStore.activeIndex === this.index
    }
    return next
  }

  updateIsSelected = react(
    this.shouldSelect,
    async (isSelected, { sleep }) => {
      const { onSelect } = this.props
      ensure('new index', isSelected !== this.isSelected)
      this.isSelected = isSelected
      if (isSelected) {
        if (onSelect) {
          onSelect(this.index, this.appConfig, this.cardWrapRef)
        } else {
          ensure('this.appConfig', !!this.appConfig)
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
