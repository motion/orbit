import { motion, useAnimation } from 'framer-motion'

export function TestUIAnimation() {
  const animation = useAnimation()
  React.useEffect(() => {
    setTimeout(() => {
      animation.set({
        opacity: 1,
      })
    }, 500)
  }, [])
  return [1, 2, 3].map(x => (
    <motion.div
      key={x}
      custom={x}
      animate={animation}
      variants={variants}
      style={{
        width: 100,
        height: 100,
        margin: 10,
        background: 'green',
      }}
    />
  ))
}
const variants = {
  visible: i => ({
    scale: i * 1,
    rotateY: i * 10,
  }),
}
