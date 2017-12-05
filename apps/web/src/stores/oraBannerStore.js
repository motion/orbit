import { Subject } from 'rxjs'

export const TYPES = {
  note: 'note',
  success: 'success',
  error: 'error',
}

const BANNER_TIMES = {
  [TYPES.note]: 5000,
  [TYPES.success]: 1500,
  [TYPES.error]: 5000,
}

const BANNER$ = new Subject()
export const note = obj => BANNER$.next({ type: TYPES.note, ...obj })
export const success = obj => BANNER$.next({ type: TYPES.success, ...obj })
export const error = obj => BANNER$.next({ type: TYPES.error, ...obj })

export default class OraBannerStore {
  banner = null

  willMount() {
    this.on(BANNER$, this.setBanner)
  }

  setBanner = ({ type, message, timeout }) => {
    this.banner = { message, type }
    const fadeOutTime = timeout || BANNER_TIMES[type]
    if (fadeOutTime) {
      this.setTimeout(() => {
        if (
          this.banner &&
          this.banner.type === type &&
          this.banner.message === message
        ) {
          this.banner = null
        }
      }, fadeOutTime)
    }
  }
}
