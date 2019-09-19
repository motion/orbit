import { MotionValue } from 'framer-motion'
import { spring, SpringProps } from 'popmotion'

export const createUpdateableSpring = (
  defaultVal: number,
  config?: SpringProps,
): {
  value: MotionValue
  update: (config: SpringProps | false) => void
  reset: () => void
} => {
  let value = new MotionValue(defaultVal)
  const defaultConfig = config
  function update(config?: SpringProps | false) {
    if (config === false) {
      value.stop()
    } else {
      value.attach((v, set) => {
        value.stop()
        spring({
          from: value.get(),
          to: v,
          velocity: value.getVelocity(),
          ...(config || defaultConfig),
        }).start(set)
        return value.get()
      })
    }
  }
  update()
  return {
    value,
    update,
    reset() {
      update(defaultConfig)
    },
  }
}
