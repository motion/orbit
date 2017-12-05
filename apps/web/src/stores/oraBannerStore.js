import { Observable } from 'rxjs'

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

let bannerObs = null
const BANNER$ = Observable.create(observer => {
  bannerObs = observer
})

export default class OraBannerStore {
  static note = obj => bannerObs.next({ type: TYPES.note, ...obj })
  static success = obj => bannerObs.next({ type: TYPES.success, ...obj })
  static error = obj => bannerObs.next({ type: TYPES.error, ...obj })

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
