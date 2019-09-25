import { MotionValue, useMotionValue } from 'framer-motion'
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'

/**
 * TODO this is coming to framer motion
 */

const toValue: <T>(v: MotionValue<T> | T) => T = v => (v instanceof MotionValue ? v.get() : v)
const isMotionValue = (c: any) => c instanceof MotionValue

export function useRelative<T>(callback: (...values: T[]) => T, ...values: (MotionValue<T> | T)[]) {
  // Compute the motion values's value by running
  // current values of its related values through
  // the callback function
  const getComputedValue = useCallback(() => callback(...values.map(toValue)), [
    callback,
    ...values,
  ])

  // Create new motion value
  const value = useMotionValue(getComputedValue())

  // Update the motion value with the computed value
  const compute = useCallback(() => value.set(getComputedValue()), [])

  // Partition the values into motion values / non-motion values
  const [mvs, nmvs]: [MotionValue<T>[], T[]] = useMemo(
    () =>
      values.reduce(
        (acc, val) => {
          acc[isMotionValue(val) ? 0 : 1].push(val)
          return acc
        },
        [[] as any[], [] as any[]],
      ),
    [values],
  )

  // When motion values values
  // change, update listeners
  useEffect(() => {
    compute()
    const rs = mvs.map(v => v.onChange(compute))
    return () => rs.forEach(remove => remove())
  }, [mvs])

  // When non-motion values
  // change, compute a new value
  useEffect(compute, [nmvs])

  return value
}
