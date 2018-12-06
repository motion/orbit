import { react, ensure } from '@mcro/black'
import { OrbitItemProps } from './OrbitItemProps'
import { NormalizedItem } from '../../helpers/normalizeItem'
import { AppActions } from '../../actions/AppActions'
import { ResolvableModel } from '../../sources/types'
import { getAppConfig } from '../../helpers/getAppConfig'

// TEMP i dont want to write the three level hoist to make this work quite yet
export const OrbitItemSingleton = {
  lastClick: Date.now(),
}

export class OrbitItemStore {
  props: OrbitItemProps<ResolvableModel>

  resolvedItem: NormalizedItem | null = null
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
      this.props.onClick(e, this.cardWrapRef)
      return
    }
    if (this.props.inactive) {
      console.log('inactive, ignore click')
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

  get index() {
    const { model, getIndex, index } = this.props
    return getIndex ? getIndex(model) : index
  }

  get appConfig() {
    if (this.props.appConfig) {
      return this.props.appConfig
    }
    return this.props.model ? getAppConfig(this.props.model) : null
  }

  selectItem = () => {
    const item = {
      appConfig: this.appConfig,
      target: this.cardWrapRef,
    }
    AppActions.setPeekApp(item)
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
        console.debug('updateIsSelected', this.appConfig)
        ensure('appConfig`', !!this.appConfig)
        if (onSelect) {
          onSelect(this.index, this.appConfig, this.cardWrapRef)
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
