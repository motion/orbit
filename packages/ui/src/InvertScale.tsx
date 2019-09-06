import { motion, useInvertedScale } from 'framer-motion'
import React from 'react'

export function InvertScale({ style, ...rest }: any) {
  const invertStyle = useInvertedScale()
  return (
    <motion.div
      style={{
        flexDirection: 'inherit',
        flexBasis: 'inherit',
        display: 'flex',
        alignItems: 'inherit',
        justifyContent: 'inherit',
        ...style,
        ...invertStyle,
      }}
      {...rest}
    />
  )
}
